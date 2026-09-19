/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Client-safe helper for generating consultation reports.
 * Does NOT import any Node.js modules or server-only SDKs (@google/genai, fs, path).
 */

import { AIConsultationReport } from '../types';
import { analyzeCustomerSegmentAndSchedule } from './customerSegmentation';

export function generateClientConsultationReport(
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
): AIConsultationReport {
  const sessionId = `VICI-CHAT-${Date.now().toString().slice(-6)}`;
  const createdAt = new Date().toLocaleString('vi-VN');

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
  const recommendedCourse = segmentInfo.recommendedCourse;
  const recommendedSchedule = segmentInfo.recommendedSchedule;
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

  const fullSummaryText = `## BÁO CÁO TƯ VẤN LÂM SÀNG & THỂ TRẠNG ĐẦU VÀO CHO HLV
**Mã phiên tư vấn:** ${sessionId} | **Thời gian:** ${createdAt}

### 1. HỒ SƠ HỌC VIÊN
* **Họ và tên:** ${customerInfo?.name || 'Học viên tư vấn qua MyVici'}
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
* 📞 **${nextAction}**
* Xác nhận tình trạng đau nhức thực tế khi học viên đến trực tiếp Studio`;

  return {
    sessionId,
    createdAt,
    customerName: customerInfo?.name || 'Học viên tư vấn MyVici',
    customerPhone: customerInfo?.phone || '',
    category: segmentInfo.category,
    categoryLabel: segmentInfo.categoryLabel,
    detectedCondition,
    severityLevel,
    lifestyleFactors,
    customerGoals,
    recommendedCourse,
    recommendedSchedule,
    preferredTime: segmentInfo.preferredTime,
    leadScore: customerInfo?.phone ? 'HOT' : 'WARM',
    assignedTrainer: segmentInfo.assignedTo,
    clinicalSafetyNotes,
    nextAction,
    fullSummaryText,
    transcriptCount: messages.length,
  };
}
