/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Shared AI Advisory Service for both Express server and Vercel Serverless Functions.
 */

import { GoogleGenAI, Type } from '@google/genai';
import { VICI_CARE_SYSTEM_PROMPT, VICI_SYSTEM_PROMPT, getViciConsultation, extractLeadFromText } from '../data/viciAdvisor';
import { AIConsultationReport } from '../types';
import { analyzeCustomerSegmentAndSchedule } from '../utils/customerSegmentation';
import { saveOrUpdateLead } from './leadStorage';

let geminiClient: GoogleGenAI | null = null;

// Track temporary rate limits or quota exhaustion to avoid hanging user requests
const modelQuotaCooldown: Record<string, number> = {};

export function getGeminiClient(): GoogleGenAI | null {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_GENAI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey: apiKey.trim(),
    });
  }
  return geminiClient;
}

export interface ChatHistoryItem {
  role?: string;
  sender?: string;
  text?: string;
  content?: string;
}

export interface ChatResponseResult {
  reply: string;
  source: 'gemini' | 'local_expert';
  model?: string;
  isAiActive: boolean;
  notice?: string;
  capturedLead?: any;
  toolCalled?: string;
}

/**
 * Function Declaration for Gemini 2.5 Flash to automatically capture lead info
 */
export const saveContactLeadDeclaration = {
  name: 'save_contact_lead',
  description: 'Lưu thông tin khách hàng đặt lịch kiểm tra tầm vận động hoặc tập thử',
  parameters: {
    type: Type.OBJECT,
    properties: {
      fullName: {
        type: Type.STRING,
        description: 'Họ và tên của học viên',
      },
      phone: {
        type: Type.STRING,
        description: 'Số điện thoại hoặc số Zalo liên hệ',
      },
      healthCondition: {
        type: Type.STRING,
        description: 'Vấn đề sức khỏe (ví dụ: đau cổ vai gáy, thoát vị L4-L5)',
      },
      serviceInterest: {
        type: Type.STRING,
        description: 'Lớp học quan tâm (Lớp nhóm trị liệu, PT 1:1)',
      },
      preferredTime: {
        type: Type.STRING,
        description: 'Khung giờ mong muốn tập (sáng, trưa, tối)',
      },
    },
    required: ['phone'],
  },
};

export async function processChatConsultation(
  message: string,
  rawHistory: ChatHistoryItem[] = []
): Promise<ChatResponseResult> {
  const trimmedMessage = (message || '').trim();
  if (!trimmedMessage) {
    return {
      reply: 'Namaste bạn! 🙏 Mình là Vici Care – Chuyên viên tư vấn phục hồi và trị liệu của Vici Yoga Therapy. Bạn đang gặp vấn đề gì về cơ xương khớp hay cần tư vấn lớp tập phù hợp không ạ?',
      source: 'local_expert',
      isAiActive: false,
    };
  }

  const ai = getGeminiClient();

  if (ai) {
    // Primary models: gemini-2.5-flash with thinkingBudget: 0 for ultra-fast (1-2s) responses on Vercel
    const candidateModels = [
      'gemini-2.5-flash',
      'gemini-3.1-flash-lite',
      'gemini-3.8-flash',
    ];

    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text?: string; functionResponse?: any }> }> = [];

    // Map conversation history to Gemini structure
    for (const item of rawHistory.slice(-8)) {
      const isUser = item.role === 'user' || item.sender === 'user';
      const isModel = item.role === 'model' || item.role === 'assistant' || item.sender === 'ai';
      const text = (item.text || item.content || '').trim();

      if (text) {
        if (isUser) {
          if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
            contents[contents.length - 1].parts[0].text += `\n${text}`;
          } else {
            contents.push({ role: 'user', parts: [{ text }] });
          }
        } else if (isModel && contents.length > 0) {
          if (contents[contents.length - 1].role === 'model') {
            contents[contents.length - 1].parts[0].text += `\n${text}`;
          } else {
            contents.push({ role: 'model', parts: [{ text }] });
          }
        }
      }
    }

    // Append current user message if not already the last entry
    const lastContentText = contents.length > 0 && contents[contents.length - 1].role === 'user'
      ? contents[contents.length - 1].parts[0].text
      : '';

    if (lastContentText !== trimmedMessage) {
      if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
        contents[contents.length - 1].parts[0].text += `\n${trimmedMessage}`;
      } else {
        contents.push({ role: 'user', parts: [{ text: trimmedMessage }] });
      }
    }

    const now = Date.now();
    for (const modelName of candidateModels) {
      if (modelQuotaCooldown[modelName] && modelQuotaCooldown[modelName] > now) {
        continue;
      }

      try {
        // Request content generation with function calling and thinkingBudget: 0 for lightning-fast Vercel response
        const responsePromise = ai.models.generateContent({
          model: modelName,
          contents,
          config: {
            systemInstruction: VICI_CARE_SYSTEM_PROMPT,
            temperature: 0.5,
            thinkingConfig: { thinkingBudget: 0 },
            maxOutputTokens: 800,
            tools: [{ functionDeclarations: [saveContactLeadDeclaration] }],
          },
        });

        const timeoutPromise = new Promise<null>((resolve) =>
          setTimeout(() => resolve(null), 7000)
        );

        const response = await Promise.race([responsePromise, timeoutPromise]);

        if (response) {
          let capturedLead: any = null;
          let toolCalled: string | undefined = undefined;

          // Check if Gemini invoked save_contact_lead tool
          if (response.functionCalls && response.functionCalls.length > 0) {
            for (const call of response.functionCalls) {
              if (call.name === 'save_contact_lead') {
                toolCalled = 'save_contact_lead';
                const args = (call.args || {}) as {
                  fullName?: string;
                  phone: string;
                  healthCondition?: string;
                  serviceInterest?: string;
                  preferredTime?: string;
                };

                if (args.phone) {
                  try {
                    capturedLead = saveOrUpdateLead({
                      name: args.fullName || 'Học viên tư vấn Vici Care',
                      phone: args.phone,
                      interest: args.serviceInterest || args.healthCondition || 'Yoga Trị liệu Phục hồi',
                      category: 'THERAPY_INTEREST',
                      preferredTime: args.preferredTime || 'Linh hoạt',
                      goals: args.healthCondition
                        ? [args.healthCondition]
                        : ['Kiểm tra tầm vận động (ROM test)', 'Tập thử phục hồi'],
                      source: 'Vici Care AI Advisor',
                      conversationSummary: `Đăng ký qua Vici Care AI: Bệnh lý/Tình trạng: ${args.healthCondition || 'Cần kiểm tra'}. Lớp quan tâm: ${args.serviceInterest || 'Lớp trị liệu'}. Giờ tập: ${args.preferredTime || 'Linh hoạt'}.`,
                    });
                  } catch (saveErr) {
                    console.warn('[Vici Care] Lỗi lưu lead:', saveErr);
                  }
                }
              }
            }

            // Send function response back to Gemini to get final confirmation reply
            try {
              const previousContent = response.candidates?.[0]?.content;
              const followUpContents = [
                ...contents,
                previousContent,
                {
                  role: 'user' as const,
                  parts: [
                    {
                      functionResponse: {
                        name: 'save_contact_lead',
                        response: {
                          status: 'success',
                          message: 'Thông tin học viên đã được ghi nhận thành công vào hệ thống VICI. Huấn luyện viên chuyên môn sẽ liên hệ sớm qua Zalo/Điện thoại.',
                        },
                      },
                    },
                  ],
                },
              ];

              const followUpResponse = await ai.models.generateContent({
                model: modelName,
                contents: followUpContents as any,
                config: {
                  systemInstruction: VICI_CARE_SYSTEM_PROMPT,
                  temperature: 0.5,
                  thinkingConfig: { thinkingBudget: 0 },
                  maxOutputTokens: 800,
                  tools: [{ functionDeclarations: [saveContactLeadDeclaration] }],
                },
              });

              if (followUpResponse && followUpResponse.text) {
                return {
                  reply: followUpResponse.text.trim(),
                  source: 'gemini',
                  model: modelName,
                  isAiActive: true,
                  capturedLead,
                  toolCalled,
                };
              }
            } catch (errFollowUp) {
              console.warn('[Vici Care] Follow up tool error:', errFollowUp);
            }
          }

          // If text returned directly
          if (response.text) {
            const replyText = response.text.trim();
            if (replyText) {
              // Safety check: if user message contained phone number, also store lead
              const extracted = extractLeadFromText(trimmedMessage);
              if (extracted && extracted.phone && !capturedLead) {
                try {
                  capturedLead = saveOrUpdateLead({
                    name: extracted.fullName || 'Học viên tư vấn Vici Care',
                    phone: extracted.phone,
                    interest: extracted.serviceInterest || 'Yoga Trị liệu Phục hồi',
                    category: 'THERAPY_INTEREST',
                    preferredTime: extracted.preferredTime || 'Linh hoạt',
                    goals: [extracted.healthCondition || 'Tư vấn phục hồi'],
                    source: 'Vici Care AI Advisor',
                    conversationSummary: `Khách hàng cung cấp SĐT qua Vici Care AI: "${trimmedMessage}"`,
                  });
                } catch (_) {}
              }

              return {
                reply: replyText,
                source: 'gemini',
                model: modelName,
                isAiActive: true,
                capturedLead,
                toolCalled,
              };
            }
          }
        }
      } catch (err: any) {
        const errStatus = err?.status || err?.code;
        const errMsg = String(err?.message || '');
        if (errStatus === 429 || errMsg.includes('quota') || errMsg.includes('RESOURCE_EXHAUSTED')) {
          modelQuotaCooldown[modelName] = Date.now() + 60000;
        }
        console.warn(`[Vici Care AI] Model ${modelName} notice:`, errStatus || errMsg);
      }
    }
  }

  // Instant fallback to VICI Expert Consultation Engine
  const localReply = getViciConsultation(trimmedMessage);

  return {
    reply: localReply,
    source: 'local_expert',
    isAiActive: false,
  };
}

/**
 * Generate a detailed clinical intake and consultation summary report
 * after a chat session for trainer handover and CRM Google Sheet storage.
 */
export async function generateConsultationReport(
  messages: Array<{ sender: string; text: string; timestamp?: string }>,
  customerInfo?: {
    name?: string;
    phone?: string;
    condition?: string;
    preferredTime?: string;
    customNote?: string;
    notes?: string;
    goals?: string[];
  }
): Promise<AIConsultationReport> {
  const sessionId = `VICI-CHAT-${Date.now().toString().slice(-6)}`;
  const createdAt = new Date().toLocaleString('vi-VN');
  const transcriptText = messages
    .map((m) => `${m.sender === 'user' ? '👤 Học viên' : '🧘 MyVici'}: ${m.text}`)
    .join('\n\n');

  // Detect segment, goals and preferred schedule dynamically from full customer text and messages
  const userGoalsText = Array.isArray(customerInfo?.goals) ? customerInfo.goals.join(' ') : '';
  const rawCombinedText = `${customerInfo?.condition || ''} ${customerInfo?.customNote || ''} ${customerInfo?.notes || ''} ${userGoalsText} ${messages.map(m => m.text).join(' ')}`;
  const segmentInfo = analyzeCustomerSegmentAndSchedule(
    rawCombinedText,
    customerInfo?.condition,
    customerInfo?.preferredTime,
    customerInfo?.goals
  );

  const lowerText = rawCombinedText.toLowerCase();
  let detectedCondition = customerInfo?.condition || segmentInfo.interest || 'Tư vấn phác đồ tổng quát';
  let severityLevel: 'Nhẹ' | 'Vừa' | 'Nặng' | 'Chưa xác định' = 'Vừa';
  let recommendedCourse = segmentInfo.recommendedCourse;
  let recommendedSchedule = segmentInfo.recommendedSchedule;
  const lifestyleFactors: string[] = [];
  const customerGoals: string[] = Array.isArray(customerInfo?.goals) && customerInfo.goals.length > 0
    ? customerInfo.goals
    : [...segmentInfo.goals];
  const clinicalSafetyNotes: string[] = [];
  let nextAction = 'Master Henry Phan / HLV chuyên môn liên hệ qua Zalo tư vấn phác đồ chi tiết';

  if (segmentInfo.category === 'TRAINER_EDUCATION') {
    detectedCondition = 'Nhu cầu Đào tạo Nghề Huấn Luyện Viên Yoga Quốc Tế';
    severityLevel = 'Chưa xác định';
    nextAction = 'Gửi trọn bộ Syllabus đào tạo HLV và xếp lịch phỏng vấn chuyên môn cùng Master Henry Phan';
  } else if (segmentInfo.category === 'ADVANCED') {
    detectedCondition = 'Học viên có nền tảng thể lực tốt / Nhu cầu nâng cao Ashtanga & Cột Sống';
    severityLevel = 'Nhẹ';
    clinicalSafetyNotes.push('Khóa đai vai vững chắc khi lên Handstand/Pincha', 'Uốn ngực trên Thoracic, không ép gập đốt sống thắt lưng L4-L5');
    nextAction = 'Master Henry Phan kiểm tra thể lực trực tiếp và giữ suất ưu đãi 10 Chuyên đề';
  } else if (segmentInfo.category === 'WORKSHOP') {
    detectedCondition = 'Rối loạn nhịp thức ngủ / Quá tải hệ thần kinh giao cảm (Stress)';
    severityLevel = 'Nhẹ';
    lifestyleFactors.push('Căng thẳng áp lực công việc', 'Khó vào giấc ngủ sâu, hay thức giấc nửa đêm');
    clinicalSafetyNotes.push('Ưu tiên tư thế phục hồi thụ động Viparita Karani', 'Thở luân phiên Nadi Shodhana xoa dịu thần kinh');
    nextAction = 'Gửi lịch Workshop Chuông Xoay Tây Tạng Thứ 7 và hướng dẫn bài thở thư giãn tại nhà';
  } else if (segmentInfo.category === 'BEGINNER') {
    detectedCondition = 'Người mới bắt đầu / Cơ thể căng cứng / Cần làm quen từ căn bản';
    severityLevel = 'Nhẹ';
    clinicalSafetyNotes.push('Bắt buộc sử dụng dụng cụ hỗ trợ (block, đai)', 'Không ép dẻo vượt ngưỡng giới hạn cơ thể');
    nextAction = 'HLV xếp lịch trải nghiệm lớp Yoga For Newbie và căn chỉnh định tuyến';
  } else if (lowerText.includes('thoát vị') || lowerText.includes('l4') || lowerText.includes('l5') || lowerText.includes('thắt lưng') || lowerText.includes('đau lưng')) {
    detectedCondition = 'Đau thắt lưng cơ năng / Nguy cơ chèn ép đĩa đệm L4-L5, L5-S1';
    severityLevel = 'Nặng';
    lifestyleFactors.push('Ngồi khom lưng tĩnh tại kéo dài', 'Yếu cơ lõi bảo vệ cột sống');
    clinicalSafetyNotes.push('Tuyệt đối tránh cúi gập người sâu đột ngột', 'Tránh xoắn vặn biên độ tối đa khi khung chậu chưa được cố định');
    nextAction = 'Master Henry Phan thăm khám góc lệch cột sống và thiết lập phác đồ 1-1';
  } else if (lowerText.includes('vai gáy') || lowerText.includes('cổ') || lowerText.includes('tê tay') || lowerText.includes('gù lưng')) {
    detectedCondition = 'Hội chứng Chéo Trên (Upper Crossed) & Co cứng Cổ Vai Gáy';
    severityLevel = 'Vừa';
    lifestyleFactors.push('Ngồi máy tính nhiều giờ liên tục', 'Cúi đầu sử dụng điện thoại (Text Neck)');
    clinicalSafetyNotes.push('Tránh bẻ lắc cổ phát tiếng rắc đột ngột', 'Tăng cường kéo giãn cơ ngực lớn, kích hoạt cơ trám');
    nextAction = 'Xếp lịch Scan Trị Liệu Cơ Vai Cổ Gáy 1-1 (650k) và tư vấn lớp phù hợp';
  }

  // If Gemini is available, attempt rich AI synthesis
  const ai = getGeminiClient();
  let fullSummaryText = '';

  if (ai) {
    try {
      const summaryPrompt = `
Bạn là Trưởng ban Chuyên môn VICI Yoga Therapy Training Center (phụ trách bởi Master Henry Phan - E-RYT 500 & YACEP Yoga Alliance Hoa Kỳ).
Hãy phân tích toàn bộ nội dung phiên trò chuyện tư vấn sau và lập một "BÁO CÁO TỔNG QUAN TƯ VẤN LÂM SÀNG & THỂ TRẠNG ĐẦU VÀO CHO HUẤN LUYỆN VIÊN":

NỘI DUNG CUỘC TRÒ CHUYỆN:
${transcriptText}

THÔNG TIN ĐÃ CÓ:
- Họ tên: ${customerInfo?.name || 'Chưa cung cấp'}
- Số điện thoại/Zalo: ${customerInfo?.phone || 'Chưa cung cấp'}
- Phân khúc CRM nhận diện: ${segmentInfo.categoryLabel} (${segmentInfo.category})
- Khung giờ học viên mong muốn: ${segmentInfo.preferredTime}
- Mục tiêu chính của học viên: ${customerGoals.join(', ') || 'Cải thiện sức khỏe và phục hồi'}
- Ghi chú thêm: ${customerInfo?.customNote || customerInfo?.notes || 'Không'}

YÊU CẦU ĐỊNH DẠNG BÁO CÁO (Trình bày súc tích, chuyên nghiệp, rõ ràng bằng Markdown):
1. **HỒ SƠ HỌC VIÊN**: Tên, SĐT, Phân khúc CRM (${segmentInfo.categoryLabel}), Khung giờ mong muốn (${segmentInfo.preferredTime}).
2. **CHẨN ĐOÁN THỂ TRẠNG & TỔN THƯƠNG CƠ NĂNG**: Vùng đau mỏi, thói quen sinh hoạt tạo áp lực, mức độ ưu tiên.
3. **MỤC TIÊU CỦA HỌC VIÊN**: Các mục tiêu cụ thể mà học viên mong muốn đạt được (${customerGoals.join(', ')}).
4. **LỘ TRÌNH & KHÓA HỌC VICI ĐỀ XUẤT**: ${segmentInfo.recommendedCourse}, lịch tập đề xuất (${segmentInfo.recommendedSchedule}), học phí tham chiếu.
5. **CHỈ ĐỊNH AN TOÀN CHO HLV (MASTER HENRY PHAN LƯU Ý)**: Nhóm cơ cần kích hoạt, tư thế chống chỉ định/cần tránh.
6. **HÀNH ĐỘNG TIẾP THEO (NEXT ACTION)**: HLV cần làm gì tiếp theo khi gọi điện/nhắn tin Zalo.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: summaryPrompt }] }],
        config: {
          temperature: 0.3,
          thinkingConfig: { thinkingBudget: 0 },
          maxOutputTokens: 1000
        }
      });

      if (response.text && response.text.trim()) {
        fullSummaryText = response.text.trim();
      }
    } catch (e) {
      console.warn('Gemini report generation fallback:', e);
    }
  }

  // Local expert template fallback if Gemini output is not generated
  if (!fullSummaryText) {
    fullSummaryText = `## BÁO CÁO TƯ VẤN LÂM SÀNG & THỂ TRẠNG ĐẦU VÀO CHO HLV
**Mã phiên tư vấn:** ${sessionId} | **Thời gian:** ${createdAt}

### 1. HỒ SƠ HỌC VIÊN
* **Họ và tên:** ${customerInfo?.name || 'Học viên tư vấn qua AI Chat'}
* **Số điện thoại / Zalo:** ${customerInfo?.phone || 'Chưa để lại số điện thoại'}
* **Phân khúc khách hàng CRM:** ${segmentInfo.categoryLabel} (${segmentInfo.category})
* **Khung giờ học viên mong muốn:** ${segmentInfo.preferredTime}
* **Lịch học đề xuất:** ${recommendedSchedule}
* **Mức độ quan tâm:** ${customerInfo?.phone ? 'HOT (Cần liên hệ trong 2-4h)' : 'WARM (Đang tìm hiểu)'}

### 2. CHẨN ĐOÁN THỂ TRẠNG & VẤN ĐỀ CƠ XƯƠNG KHỚP
* **Vấn đề phát hiện:** ${detectedCondition}
* **Mức độ ảnh hưởng:** Mức ${severityLevel}
* **Yếu tố nguyên nhân:** ${lifestyleFactors.join(', ') || 'Thói quen sinh hoạt và ngồi làm việc tĩnh tại'}

### 3. MỤC TIÊU HỌC VIÊN
${customerGoals.map((g) => `* 🎯 ${g}`).join('\n') || '* Phục hồi cơ thể và giảm đau nhức'}

### 4. LỘ TRÌNH & KHÓA HỌC ĐỀ XUẤT TẠI VICI
* **Khóa học trọng tâm:** ${recommendedCourse}
* **Lịch tập tối ưu:** ${recommendedSchedule}
* **Địa điểm:** Studio Opal Boulevard, đường Phạm Văn Đồng (giáp TP. Thủ Đức)

### 5. CHỈ ĐỊNH AN TOÀN CHO HUẤN LUYỆN VIÊN (MASTER HENRY PHAN LƯU Ý)
${clinicalSafetyNotes.map((n) => `* ⚠️ ${n}`).join('\n') || '* Căn chỉnh biên độ an toàn, kiểm soát lực đai bụng'}

### 6. HÀNH ĐỘNG TIẾP THEO (NEXT ACTION)
* 👉 ${nextAction}`;
  }

  const assignedTrainer = segmentInfo.assignedTo || (recommendedCourse.includes('1-1') || recommendedCourse.includes('Cá Nhân')
    ? 'Master Henry Phan (E-RYT 500)'
    : 'Đội ngũ Huấn Luyện Viên Trị Liệu VICI');
  const safetyNotes = clinicalSafetyNotes.join('; ') || 'Kiểm soát biên độ khớp và lực đai bụng, tránh động tác uốn sâu quá giới hạn.';

  return {
    sessionId,
    createdAt,
    timestamp: createdAt,
    customerName: customerInfo?.name || 'Học viên AI Chat',
    customerPhone: customerInfo?.phone || '',
    category: segmentInfo.category,
    categoryLabel: segmentInfo.categoryLabel,
    detectedCondition,
    detectedConditions: [detectedCondition, ...(lifestyleFactors.length > 0 ? [`Thói quen: ${lifestyleFactors.join(', ')}`] : [])],
    severityLevel,
    lifestyleFactors,
    customerGoals,
    recommendedCourse,
    recommendedSchedule,
    preferredTime: segmentInfo.preferredTime,
    leadScore: customerInfo?.phone ? 'HOT' : 'WARM',
    assignedTrainer,
    safetyNotes,
    clinicalSafetyNotes,
    suggestedNextActions: [
      nextAction,
      'Đo kiểm tra biên độ vận động (ROM) và độ cong sinh lý cột sống trước buổi tập đầu tiên'
    ],
    nextAction,
    fullSummaryText,
    executiveSummary: detectedCondition,
    transcriptCount: messages.length,
  };
}

