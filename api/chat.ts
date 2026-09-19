/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Vercel Serverless Function: /api/chat
 * Self-contained dynamic Gemini AI consultation endpoint for Vercel deployment.
 * Eliminates external relative import resolution errors in Vercel Node runtime.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

const VICI_SYSTEM_INSTRUCTION = `Bạn là "Vici Care" – Chuyên viên tư vấn phục hồi và trị liệu của Vici Yoga Therapy Center (viciyoga.vercel.app).

1. TÍNH CÁCH & PHONG THÁI:
- Nhẹ nhàng, lắng nghe, thấu cảm và mang năng lượng chữa lành (mindful & zen).
- Chuẩn mực khoa học: Kết hợp hài hòa giữa giải phẫu học cơ thể và các tư thế phục hồi của yoga trị liệu.
- Ngôn ngữ: Tiếng Việt chuẩn mực, xưng "Vici Care" hoặc "mình", gọi khách là "bạn" hoặc "anh/chị".

2. VỀ VICI YOGA THERAPY:
- Định vị: Chuyên sâu về Yoga Trị liệu, Phục hồi cột sống, xương khớp, giải tỏa căng thẳng thần kinh và cải thiện giấc ngủ.
- Phương châm: "Tập đúng để chữa lành – Không ép dẻo quá đà – Tôn trọng giới hạn tự nhiên của cơ thể".
- Mô hình lớp:
  + Lớp trị liệu nhóm nhỏ: Đảm bảo giáo viên theo sát từng tư thế.
  + Lớp kèm 1:1 (PT): Giáo án cá nhân hóa theo hồ sơ bệnh lý (thoát vị đĩa đệm, thoái hóa khớp, lệch vẹo cột sống, sau chấn thương).
  + Lớp Yoga Thư giãn: Hatha nhẹ nhàng, Yin Yoga phục hồi sâu.
- Trung tâm: Căn hộ B1-0705, Chung cư Opal Boulevard, đường Phạm Văn Đồng, TP. Dĩ An / TP. Thủ Đức, TP. Hồ Chí Minh.
- Người sáng lập: Master Henry Phan (Yogi Hùng Phan, E-RYT 500 & YACEP Yoga Alliance Hoa Kỳ) và Master Mỹ Kiều (Chuyên gia Trị liệu Thư giãn & Chuông xoay Tây Tạng).
- Hotline / Zalo: 036 684 0130.

3. QUY TRÌNH HỘI THOẠI 4 BƯỚC BẮT BUỘC:
- Bước 1 (Khảo sát / Triage): Hỏi thăm cụ thể vị trí chấn thương/đau mỏi (cổ vai gáy, thắt lưng, gãy tay cũ, gối...), tiền sử điều trị và mức độ cử động hiện tại.
- Bước 2 (Giải thích & Trấn an): Giải thích cơ chế phục hồi cơ xương khớp, trấn an học viên hoàn toàn có thể tập luyện an toàn theo định tuyến chuẩn.
- Bước 3 (Đề xuất giải pháp): Gợi ý giải pháp phù hợp (lớp trị liệu nhóm nhỏ hoặc PT 1:1 có dụng cụ hỗ trợ block, dây).
- Bước 4 (Chuyển đổi): Mời học viên để lại Họ tên và Số điện thoại/Zalo để đặt lịch kiểm tra tầm vận động (ROM test) miễn phí và trải nghiệm buổi tập thử.

4. NGUYÊN TẮC AN TOÀN:
- Tôn trọng giới hạn tự nhiên, không ép dẻo quá đà.
- Khi khách hàng chia sẻ số điện thoại, chủ động thu thập qua công cụ save_contact_lead để liên hệ đặt lịch tư vấn trực tiếp.`;

const VICI_TOOLS = [
  {
    functionDeclarations: [
      {
        name: 'save_contact_lead',
        description: 'Lưu thông tin khách hàng đặt lịch kiểm tra tầm vận động hoặc tập thử',
        parameters: {
          type: 'OBJECT',
          properties: {
            fullName: {
              type: 'STRING',
              description: 'Họ và tên của học viên'
            },
            phone: {
              type: 'STRING',
              description: 'Số điện thoại hoặc số Zalo liên hệ'
            },
            healthCondition: {
              type: 'STRING',
              description: 'Vấn đề sức khỏe hoặc chấn thương (ví dụ: gãy tay cũ, đau cổ vai gáy, thoát vị L4-L5)'
            },
            serviceInterest: {
              type: 'STRING',
              description: 'Lớp học quan tâm (Lớp nhóm trị liệu, PT 1:1, ROM test)'
            },
            preferredTime: {
              type: 'STRING',
              description: 'Khung giờ mong muốn tập (sáng, trưa, tối)'
            }
          },
          required: ['phone']
        }
      }
    ]
  }
];

function extractPhoneAndInfo(text: string) {
  if (!text) return null;
  const phoneRegex = /(?:(?:\+84|84|0)[1-9](?:[\s.-]?\d){8,9})/;
  const match = text.match(phoneRegex);
  if (!match) return null;

  const phone = match[0].replace(/[\s.-]/g, '');
  let fullName: string | undefined;
  const nameMatch = text.match(/(?:tên(?:\s+là)?|mình\s+là|em\s+là|tôi\s+là|anh\s+là|chị\s+là)\s+([A-ZÀ-Ỵ][a-zà-ỹ]+(?:\s+[A-ZÀ-Ỵ][a-zà-ỹ]+){1,4})/i);
  if (nameMatch) {
    fullName = nameMatch[1].trim();
  }

  let healthCondition = 'Tư vấn phục hồi & trị liệu qua Vici Care AI';
  if (/thoát\s*vị|l4|l5|đĩa\s*đệm/i.test(text)) {
    healthCondition = 'Thoát vị đĩa đệm (L4-L5 / Cột sống)';
  } else if (/vai\s*gáy|cổ|bả\s*vai|tê\s*tay|cánh\s*tay/i.test(text)) {
    healthCondition = 'Đau mỏi cổ vai gáy & tê bì cánh tay';
  } else if (/thắt\s*lưng|cột\s*sống|đau\s*lưng|thoái\s*hóa/i.test(text)) {
    healthCondition = 'Thoái hóa / Đau thắt lưng cột sống';
  } else if (/khớp\s*gối|gối/i.test(text)) {
    healthCondition = 'Đau thoái hóa khớp gối';
  } else if (/gãy|chấn thương|phẫu thuật|tai nạn/i.test(text)) {
    healthCondition = 'Phục hồi sau chấn thương / gãy xương';
  }

  let serviceInterest = 'Kiểm tra tầm vận động (ROM test) & Tập thử';
  if (/pt|1:1|kèm\s*1|cá\s*nhân/i.test(text)) {
    serviceInterest = 'Lớp PT kèm 1:1 cá nhân hóa';
  } else if (/nhóm|lớp\s*nhóm/i.test(text)) {
    serviceInterest = 'Lớp trị liệu nhóm nhỏ';
  } else if (/hlv|đào\s*tạo/i.test(text)) {
    serviceInterest = 'Đào tạo Huấn luyện viên Yoga Quốc tế';
  }

  return {
    fullName,
    phone,
    healthCondition,
    serviceInterest,
    preferredTime: 'Linh hoạt'
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Setup CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-Type'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'ok',
      endpoint: '/api/chat',
      message: 'VICI Care AI Serverless Endpoint is active. Send POST requests with { message, conversationHistory }.'
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (_) {}
    }

    const message = body?.message;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, error: 'Tin nhắn không được để trống' });
    }

    const trimmed = message.trim();
    const rawHistory = body?.conversationHistory || body?.history || [];

    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.VITE_GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.GOOGLE_GENAI_API_KEY;

    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
      return res.status(200).json({
        success: true,
        reply: 'Chào bạn, Vici Care hiện đang chạy ở chế độ offline do chưa phát hiện GEMINI_API_KEY trong cấu hình Vercel. Bạn vui lòng thêm biến GEMINI_API_KEY vào Environment Variables trên Vercel nhé!',
        source: 'local_expert',
        isAiActive: false,
        notice: 'Chưa cấu hình GEMINI_API_KEY trên Vercel'
      });
    }

    const ai = new GoogleGenAI({ apiKey: apiKey.trim() });

    // Fast, reliable models with thinkingBudget: 0 for 1-2s response time
    const configuredModel = process.env.GEMINI_MODEL?.trim();
    const candidateModels = [
      ...(configuredModel ? [configuredModel] : []),
      'gemini-2.5-flash',
      'gemini-3.1-flash-lite',
      'gemini-3.8-flash'
    ].filter((m, idx, arr) => arr.indexOf(m) === idx);

    // Build chat turns
    const contents: Array<{ role: 'user' | 'model'; parts: Array<any> }> = [];
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

    // Append current message
    if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
      contents[contents.length - 1].parts[0].text += `\n${trimmed}`;
    } else {
      contents.push({ role: 'user', parts: [{ text: trimmed }] });
    }

    let replyText = '';
    let usedModel = '';
    let capturedLead: any = null;

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents,
          config: {
            systemInstruction: VICI_SYSTEM_INSTRUCTION,
            temperature: 0.35,
            thinkingConfig: { thinkingBudget: 0 },
            maxOutputTokens: 750,
            tools: VICI_TOOLS as any
          }
        });

        // Check for function calls
        if (response.functionCalls && response.functionCalls.length > 0) {
          for (const call of response.functionCalls) {
            if (call.name === 'save_contact_lead' && call.args) {
              capturedLead = call.args;
              const followUpContents = [
                ...contents,
                { role: 'model' as const, parts: [{ functionCall: call }] },
                {
                  role: 'user' as const,
                  parts: [{
                    functionResponse: {
                      name: 'save_contact_lead',
                      response: { status: 'success', message: 'Thông tin học viên đã được ghi nhận vào CRM.' }
                    }
                  }]
                }
              ];

              const followUp = await ai.models.generateContent({
                model: modelName,
                contents: followUpContents,
                config: {
                  systemInstruction: VICI_SYSTEM_INSTRUCTION,
                  temperature: 0.35,
                  thinkingConfig: { thinkingBudget: 0 },
                  maxOutputTokens: 650
                }
              });

              if (followUp.text?.trim()) {
                replyText = followUp.text.trim();
                usedModel = modelName;
                break;
              }
            }
          }
        }

        if (!replyText && response.text?.trim()) {
          replyText = response.text.trim();
          usedModel = modelName;
        }

        if (replyText) {
          break; // Successfully generated response
        }
      } catch (modelErr: any) {
        console.warn(`[Vercel /api/chat] Model ${modelName} failed:`, modelErr?.message || modelErr);
      }
    }

    // Fallback extraction if user mentioned phone in text
    if (!capturedLead) {
      capturedLead = extractPhoneAndInfo(trimmed);
    }

    if (!replyText) {
      replyText = `Namaste bạn! Vici Care rất chia sẻ với tình trạng của bạn. Để chúng mình tư vấn chi tiết và an toàn nhất, bạn hãy ghé trực tiếp studio tại Căn hộ B1-0705, Chung cư Opal Boulevard (Phạm Văn Đồng) để Master kiểm tra tầm vận động (ROM test) miễn phí nhé. Bạn có thể để lại Số điện thoại/Zalo để Vici Care hỗ trợ đặt lịch hẹn chu đáo ạ!`;
      usedModel = 'vici-rule-based';
    }

    return res.status(200).json({
      success: true,
      reply: replyText,
      source: usedModel.startsWith('gemini') ? 'gemini' : 'local_expert',
      model: usedModel,
      isAiActive: usedModel.startsWith('gemini'),
      capturedLead
    });
  } catch (err: any) {
    console.error('Unhandled error in Vercel /api/chat:', err);
    return res.status(200).json({
      success: true,
      reply: 'Namaste bạn! Hệ thống tư vấn Vici Care đang có lưu lượng truy cập cao. Bạn có thể liên hệ trực tiếp hotline/Zalo 036 684 0130 hoặc để lại Số điện thoại để chuyên viên tư vấn gọi lại ngay nhé!',
      source: 'local_expert',
      isAiActive: false,
      error: err?.message
    });
  }
}
