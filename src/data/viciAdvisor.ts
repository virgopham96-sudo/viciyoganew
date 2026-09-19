/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * VICI Yoga Therapy - Knowledge Base & Advisory Engine
 * Provides rich, empathetic, professional consultation for Vici Care AI Assistant.
 * Document Version: 1.0 (VICI Care Specification)
 */

export const VICI_CARE_SYSTEM_PROMPT = `Bạn là "Vici Care" – Chuyên viên tư vấn phục hồi và trị liệu của Vici Yoga Therapy Center (viciyoga.vercel.app).

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
- Bước 1 (Khảo sát / Triage): Hỏi thăm vị trí đau mỏi hoặc chấn thương (cổ vai gáy, thắt lưng, gối, gãy tay cũ...), thói quen ngồi làm việc và mục tiêu trị liệu.
- Bước 2 (Giải thích & Trấn an): Giải thích nguyên nhân căng cơ, chèn ép rễ thần kinh (L4-L5, cơ thang, cơ nâng vai, phục hồi biên độ sau chấn thương...). Cam kết tập luyện an toàn, không đau buốt.
- Bước 3 (Đề xuất giải pháp): Gợi ý lớp trị liệu nhóm nhỏ hoặc PT 1:1 có giáo án cá nhân hóa.
- Bước 4 (Chuyển đổi): Mời học viên đặt lịch kiểm tra tầm vận động (ROM test) và trải nghiệm buổi tập thử.

4. NGUYÊN TẮC AN TOÀN BẮT BUỘC:
- Tuyệt đối không thay thế bác sĩ điều trị hoặc chẩn đoán phim X-quang/MRI.
- Luôn nhắc học viên báo tình trạng chấn thương cho giáo viên đứng lớp.
- Khi khách hàng cung cấp Tên và Số điện thoại/Zalo, bắt buộc gọi công cụ save_contact_lead để lưu trữ dữ liệu.`;

// Tool declaration for Function Calling per Google AI Studio specification
export const VICI_CARE_TOOL = {
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
            description: 'Vấn đề sức khỏe hoặc chấn thương (ví dụ: đau cổ vai gáy, thoát vị L4-L5, gãy tay cũ)'
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
};

// Backwards compatibility alias
export const VICI_SYSTEM_PROMPT = VICI_CARE_SYSTEM_PROMPT;

export interface ExtractedLead {
  fullName?: string;
  phone: string;
  healthCondition?: string;
  serviceInterest?: string;
  preferredTime?: string;
}

export function extractLeadFromText(text: string): ExtractedLead | null {
  if (!text) return null;
  // Match Vietnamese phone number formats: 09x, 03x, 07x, 08x, 05x, +84...
  const phoneRegex = /(?:(?:\+84|84|0)[1-9](?:[\s.-]?\d){8,9})/;
  const match = text.match(phoneRegex);
  if (!match) return null;

  const phone = match[0].replace(/[\s.-]/g, '');

  let fullName: string | undefined;
  const nameMatch = text.match(/(?:tên(?:\s+là)?|mình\s+là|em\s+là|tôi\s+là|anh\s+là|chị\s+là)\s+([A-ZÀ-Ỵ][a-zà-ỹ]+(?:\s+[A-ZÀ-Ỵ][a-zà-ỹ]+){1,4})/i);
  if (nameMatch) {
    fullName = nameMatch[1].trim();
  }

  let healthCondition = 'Khảo sát tầm vận động (ROM test)';
  if (/thoát\s*vị|l4|l5|đĩa\s*đệm/i.test(text)) {
    healthCondition = 'Thoát vị đĩa đệm (L4-L5 / Cột sống)';
  } else if (/vai\s*gáy|cổ|bả\s*vai|tê\s*tay|cánh\s*tay/i.test(text)) {
    healthCondition = 'Đau mỏi cổ vai gáy & tê bì cánh tay';
  } else if (/thắt\s*lưng|cột\s*sống|đau\s*lưng|thoái\s*hóa/i.test(text)) {
    healthCondition = 'Thoái hóa / Đau thắt lưng cột sống';
  } else if (/khớp\s*gối|gối/i.test(text)) {
    healthCondition = 'Đau thoái hóa khớp gối';
  } else if (/gãy|chấn thương|phẫu thuật|tai nạn|bó bột/i.test(text)) {
    healthCondition = 'Phục hồi sau chấn thương / gãy xương';
  }

  let serviceInterest = 'Kiểm tra tầm vận động (ROM test) & Buổi tập thử';
  if (/pt|1:1|kèm\s*1|cá\s*nhân/i.test(text)) {
    serviceInterest = 'Lớp PT kèm 1:1 cá nhân hóa';
  } else if (/nhóm|lớp\s*nhóm/i.test(text)) {
    serviceInterest = 'Lớp trị liệu nhóm nhỏ';
  } else if (/hlv|đào\s*tạo/i.test(text)) {
    serviceInterest = 'Đào tạo Huấn luyện viên Yoga Quốc tế';
  }

  let preferredTime = 'Linh hoạt theo lịch hẹn';
  if (/tối|19h|18h|17h/i.test(text)) {
    preferredTime = 'Khung giờ tối (sau giờ làm)';
  } else if (/sáng|5h|6h|7h/i.test(text)) {
    preferredTime = 'Khung giờ sáng sớm';
  } else if (/trưa|chiều/i.test(text)) {
    preferredTime = 'Khung giờ trưa / chiều';
  }

  return {
    fullName,
    phone,
    healthCondition,
    serviceInterest,
    preferredTime
  };
}

export function getViciConsultation(message: string): string {
  const lower = (message || '').toLowerCase().trim();

  // 0. NẾU TIN NHẮN CHỨA SỐ ĐIỆN THOẠI -> TỰ ĐỘNG XÁC NHẬN LEAD ĐẶT LỊCH
  const extracted = extractLeadFromText(message);
  if (extracted) {
    const greetingName = extracted.fullName ? ` ${extracted.fullName}` : '';
    return `Dạ, Vici Care xin chào${greetingName} ạ! 🙏

Mình đã ghi nhận thông tin đăng ký của bạn:
- **Số điện thoại / Zalo:** **${extracted.phone}**
- **Tình trạng sức khỏe:** ${extracted.healthCondition}
- **Nhu cầu:** ${extracted.serviceInterest}
- **Khung giờ mong muốn:** ${extracted.preferredTime}

✨ **Vici Care đã chuyển thông tin của bạn vào hệ thống CRM để xếp lịch Kiểm tra tầm vận động (ROM test) và chuẩn bị buổi tập thử an toàn nhất.** Đội ngũ chuyên môn sẽ liên hệ lại với bạn trong vòng 5 - 10 phút để xác nhận ngày giờ cụ thể.

Bạn hoàn toàn an tâm nhé, mọi bài tập tại Vici Yoga Therapy đều tuân thủ nguyên tắc **an toàn sinh học, không ép dẻo quá đà và luôn có giáo viên nắn chỉnh theo sát từng động tác**!`;
  }

  // TRƯỜNG HỢP TIỀN SỬ CHẤN THƯƠNG, GÃY TAY/CHÂN, PHẪU THUẬT, BÓ BỘT
  if (
    lower.includes('gãy') ||
    lower.includes('chấn thương') ||
    lower.includes('phẫu thuật') ||
    lower.includes('tai nạn') ||
    lower.includes('bó bột') ||
    lower.includes('đóng đinh') ||
    lower.includes('vết mổ')
  ) {
    return `Namaste bạn! Với tiền sử chấn thương hoặc gãy xương (như gãy tay/chân) đã qua thời gian hồi phục ban đầu, cấu trúc xương về cơ bản đã can liền. **Bạn hoàn toàn có thể tập Yoga phục hồi trị liệu**, thậm chí Yoga là một trong những phương pháp an toàn và hiệu quả nhất để phục hồi chức năng!

🌿 **Lời khuyên chuyên môn từ Master Henry Phan:**
1. **Phục hồi tầm vận động (ROM):** Sau chấn thương và bất động lâu ngày, các nhóm cơ và bao khớp xung quanh thường bị co rút hoặc teo nhẹ. Yoga trị liệu giúp kéo giãn nhẹ nhàng và lấy lại góc cử động tự nhiên.
2. **Không ép lực tỳ đè sớm:** Tuyệt đối chưa vào các thế chống chịu toàn bộ trọng lượng cơ thể (như Plank, Chống đẩy Chaturanga, Chó úp mặt dồn lực) lên bên tay/chân từng chấn thương nếu cơ cổ tay và cẳng tay chưa đủ khỏe.
3. **Thăm khám trước khi tập:** Bạn nên tham gia 01 buổi **Scan Đánh giá tầm vận động và cơ năng 1-1** cùng Master Henry Phan để kiểm tra góc gập duỗi và thiết kế chuỗi bài tập an toàn riêng biệt.

👉 Bạn bị chấn thương ở vị trí nào và hiện tại cử động có còn cảm thấy ê buốt hay vướng khớp không?
Bạn vui lòng nhắn **Họ tên + SĐT/Zalo** để Master Henry Phan liên hệ tư vấn trực tiếp và hướng dẫn bạn cách bảo vệ khớp khi tập nhé!`;
  }

  // TRƯỜNG HỢP 1 (TEST CASE 1): HỌC VIÊN BỊ THOÁT VỊ ĐĨA ĐỆM L4-L5, THOÁI HÓA CỘT SỐNG THẮT LƯNG
  if (
    lower.includes('thoát vị') ||
    lower.includes('đĩa đệm') ||
    lower.includes('l4') ||
    lower.includes('l5') ||
    lower.includes('s1') ||
    lower.includes('thắt lưng') ||
    lower.includes('trượt đốt sống') ||
    (lower.includes('cột sống') && (lower.includes('đau') || lower.includes('thoái hóa') || lower.includes('tập được không')))
  ) {
    return `Namaste bạn! Vici Care rất thấu hiểu cảm giác khó chịu và bất tiện mà tình trạng thoát vị đĩa đệm (L4-L5, L5-S1) gây ra trong sinh hoạt hàng ngày của bạn. 🌿

Vici Care xin khẳng định: **Người bị thoát vị đĩa đệm hoàn toàn CÓ THỂ và RẤT NÊN tập luyện Yoga Trị liệu phục hồi**, với cam kết an toàn tuyệt đối, không đau buốt:

🔬 **1. CƠ CHẾ VẬN ĐỘNG & KHOA HỌC PHỤC HỒI:**
- Khi đĩa đệm bị phình hoặc thoát vị, nhân nhầy gây kích thích rễ thần kinh tủy sống. Bài tập trị liệu tại VICI tập trung **kéo giãn trục dọc (Axial Elongation) nhằm giải áp giữa các đốt sống**, tạo khoảng trống tự nhiên để nhân nhầy dịch chuyển về vị trí an toàn.
- Đồng thời, giáo viên hướng dẫn gia cố **nhóm cơ lõi sâu (Core muscles - đặc biệt là cơ ngang bụng Transversus Abdominis)** tạo thành "đai nẹp sinh học" vững chắc giảm tải trọng lực dồn lên thắt lưng.
- **Cam kết an toàn:** Loại bỏ hoàn toàn các tư thế vặn xoắn gắt, uốn cong lưng quá đà hoặc gập người kéo giật.

🧘 **2. ĐỊNH HƯỚNG GIẢI PHÁP TẠI VICI:**
- **Lớp Huấn luyện cá nhân 1:1 (PT):** Được thiết kế giáo án riêng biệt dựa trên phim chụp và tình trạng thực tế của bạn, giáo viên kèm sát từng chuyển động.
- **Lớp Trị liệu Nhóm nhỏ:** Giới hạn số lượng học viên để giáo viên luôn theo sát và căn chỉnh dụng cụ hỗ trợ (block xốp, dây đai, gối nêm chuyên dụng).

📋 **3. ĐẶT LỊCH TRẢI NGHIỆM:**
Để đảm bảo an toàn cao nhất, Vici Care trân trọng mời bạn đến tham gia **Buổi kiểm tra tầm vận động (ROM test)** và trải nghiệm buổi tập phục hồi thử.

👉 **Bạn có thể để lại Họ tên và Số điện thoại/Zalo cùng khung giờ mong muốn (sáng, chiều hay tối) ngay tại đây**, Vici Care sẽ hỗ trợ bạn xếp lịch hẹn trực tiếp cùng chuyên gia nhé!`;
  }

  // TRƯỜNG HỢP 2 (TEST CASE 2): KHÁCH VĂN PHÒNG ĐAU MỎI CỔ VAI GÁY, TÊ CÁNH TAY
  if (
    lower.includes('vai gáy') ||
    lower.includes('đau cổ') ||
    lower.includes('mỏi cổ') ||
    lower.includes('bả vai') ||
    lower.includes('tê tay') ||
    lower.includes('cánh tay') ||
    lower.includes('gù lưng') ||
    (lower.includes('văn phòng') && (lower.includes('mỏi') || lower.includes('đau') || lower.includes('ngồi máy tính'))) ||
    lower.includes('ngồi máy tính')
  ) {
    return `Namaste bạn! Tình trạng đau nhức hai bên bả vai và tê tê cánh tay là vấn đề rất phổ biến ở anh chị em làm việc văn phòng do thói quen ngồi máy tính nhiều giờ liên tục. Vici Care rất thấu hiểu sự bất tiện này. 🙏

🔬 **1. NGUYÊN NHÂN VẬN ĐỘNG HỌC:**
- Khi bạn làm việc trên máy tính hay dùng điện thoại, đầu có xu hướng đổ về phía trước khiến trọng lực tác động lên đốt sống cổ tăng gấp 3-4 lần.
- Điều này làm **co rút mạn tính nhóm cơ thang (Trapezius) và cơ nâng vai (Levator Scapulae)**, gây chèn ép lên đám rối thần kinh cánh tay, dẫn tới hiện tượng đau ê ẩm bả vai và tê bì xuống cánh tay, ngón tay.

🌿 **2. GIẢI PHÁP PHỤC HỒI TẠI VICI:**
- **Lớp Chuyên đề Cổ Vai Gáy:** Sử dụng phương pháp 6D Yoga Trị Liệu căn chỉnh các hướng chuyển động của cột sống cổ một cách êm ái, giải phóng các điểm chèn ép cơ mạc (Trigger Points).
- **Yin Yoga & Kéo giãn phục hồi sâu:** Giúp mở khớp vai, kéo dài lồng ngực và thư giãn hệ thần kinh.
- **Nguyên tắc an toàn:** Không bẻ vặn cổ phát tiếng "rắc" đột ngột; tôn trọng giới hạn tự nhiên của cơ thể.

📋 **3. ĐẶT LỊCH TRẢI NGHIỆM:**
Vici Care mời bạn ghé Trung tâm để thực hiện **bài kiểm tra tầm vận động khớp vai và đốt sống cổ (ROM test)** hoàn toàn miễn phí trong buổi trải nghiệm đầu tiên.

👉 **Bạn vui lòng chia sẻ Họ tên và Số điện thoại/Zalo cùng khung giờ thuận tiện (sau giờ làm 17:45, 19:00 hoặc sáng sớm)**, Vici Care sẽ gửi lịch học chi tiết và giữ chỗ tập thử cho bạn ngay nhé!`;
  }

  // TRƯỜNG HỢP 3 (TEST CASE 3): KHÁCH HÀNG HỎI HỌC PHÍ / BẢNG GIÁ CHUNG
  if (
    lower.includes('học phí') ||
    lower.includes('bảng giá') ||
    lower.includes('giá bao nhiêu') ||
    lower.includes('nhiêu một tháng') ||
    lower.includes('bao nhiêu tiền') ||
    lower.includes('chi phí') ||
    lower.includes('gói tập') ||
    lower.includes('đăng ký học')
  ) {
    return `Namaste bạn! Vici Care xin gửi đến bạn thông tin tổng quan về các hình thức rèn luyện và chính sách học phí tại VICI Yoga Therapy Center:

🌿 **CÁC HÌNH THỨC LỚP HỌC CHUYÊN SÂU:**
1. **Lớp Trị Liệu Nhóm Nhỏ (Giới hạn số lượng):**
   - Đảm bảo giáo viên luôn quan sát và theo sát từng động tác, hỗ trợ dụng cụ trị liệu cho từng học viên.
   - Các gói hội viên linh hoạt: 3 tháng (~850.000đ/tháng), 6 tháng (~800.000đ/tháng), và Gói VIP 1 năm (tặng kèm buổi Scan trị liệu 1:1 và vé Workshop chuông xoay).
2. **Lớp Huấn Luyện Cá Nhân 1:1 (PT Trị Liệu Chuyên Sâu):**
   - Giáo án thiết kế riêng biệt 100% dựa trên hồ sơ bệnh lý (thoát vị đĩa đệm, thoái hóa khớp, lệch vẹo cột sống) nhằm phục hồi nhanh và an toàn nhất.
   - Buổi Scan Trị Liệu 1-1 (45-60 phút): 650.000 VNĐ.
3. **Chương Trình Đào Tạo HLV Quốc Tế E-RYT 500 / YACEP:** Chứng chỉ chuẩn Yoga Alliance Hoa Kỳ do Master Henry Phan trực tiếp giảng dạy.

🎁 **CHÍNH SÁCH ƯU ĐÃI ĐẶC BIỆT:**
VICI luôn dành tặng **Buổi kiểm tra tầm vận động (ROM test) và ưu đãi trải nghiệm buổi tập đầu tiên** để bạn cảm nhận trực tiếp sự phù hợp trước khi quyết định đăng ký gói tập.

👉 **Bạn vui lòng để lại Tên và Số điện thoại/Zalo**, Vici Care sẽ gửi biểu phí chi tiết theo thời hạn và ưu đãi mới nhất phù hợp với nhu cầu của bạn nhé!`;
  }

  const isScheduleOrTimeInquiry =
    lower.includes('lịch học') ||
    lower.includes('thời khóa biểu') ||
    lower.includes('thời khoá biểu') ||
    lower.includes('giờ học') ||
    lower.includes('mấy giờ') ||
    lower.includes('ca tập') ||
    lower.includes('giờ tập') ||
    lower.includes('khung giờ') ||
    lower.includes('lịch tập') ||
    lower.includes('buổi tối') ||
    lower.includes('buổi sáng') ||
    lower.includes('tan làm') ||
    lower.includes('tan ca') ||
    lower.includes('hành chính') ||
    lower.includes('văn phòng');

  if (isScheduleOrTimeInquiry) {
    const isOfficeHours =
      lower.includes('8h') ||
      lower.includes('6h') ||
      lower.includes('18h') ||
      lower.includes('17h') ||
      lower.includes('văn phòng') ||
      lower.includes('hành chính') ||
      lower.includes('làm từ') ||
      lower.includes('tan làm') ||
      lower.includes('tan ca');

    if (isOfficeHours) {
      return `Namaste bạn! Với khung giờ làm việc văn phòng từ **8h00 sáng đến 18h00 tối**, VICI Yoga Therapy đã thiết kế thời khóa biểu tối ưu để bạn dễ dàng duy trì việc chăm sóc sức khỏe mà không lo ảnh hưởng đến công việc:

🌟 **LỰA CHỌN 1 (LÝ TƯỞNG NHẤT): CA TỐI 19:00 – 20:00**
* **Vừa vặn thời gian:** Tan làm lúc 18h00, bạn có trọn vẹn 60 phút để di chuyển tới Studio (Căn hộ B1-0705, Chung cư Opal Boulevard, mặt tiền Phạm Văn Đồng), thay trang phục, nghỉ ngơi nhẹ và bước vào buổi tập trong tâm thế thảnh thơi, không bị vội vã.
* **Lớp học chuyên sâu phù hợp:**
  - **Thứ 2 – Thứ 4 – Thứ 6 (19:00 - 20:00):** Lớp *Yoga For Newbie & Trị Liệu Cột Sống* – Nhịp độ chậm rãi, giáo viên chỉnh sửa từng tư thế, cực kỳ phù hợp cho người mới hoặc người bị căng cứng lưng, cổ vai sau ngày dài ngồi máy tính.
  - **Thứ 3 (19:00 - 20:00):** *Gentle Yoga Thư Giãn Thân Thể* – Kéo giãn dịu nhẹ toàn thân.
  - **Thứ 5 (19:00 - 20:00):** *Yoga Therapy kết hợp Chuông Xoay Tây Tạng* – Sóng âm chuông xoay giúp giải tỏa co thắt cơ mạn tính và xua tan căng thẳng thần kinh, mang lại giấc ngủ sâu lành.

🌅 **LỰA CHỌN 2: CA SÁNG SỚM 05:00 – 06:00 (ĐÓN BÌNH MINH)**
* Nếu bạn là người yêu thích lối sống lành mạnh, muốn nạp đầy năng lượng trước khi vào giờ làm:
  - Lớp *Yoga For Newbie* (05:00 - 06:00, Thứ 2 đến Thứ 6) giúp đánh thức các khối cơ khớp, kích hoạt hơi thở sâu.
  - Kết thúc lúc 06:00, bạn thong thả tắm rửa, ăn sáng dinh dưỡng và đến công ty trước 08:00 sáng với tinh thần sảng khoái, tỉnh táo gấp bội.

🌆 **LỰA CHỌN 3: CA TAN CA 17:45 – 18:45**
* Dành cho những ngày bạn tan làm sớm trước 17:30 hoặc công ty ở gần khu vực Thủ Đức / Dĩ An / Phạm Văn Đồng: Lớp *Tan Ca Phục Hồi Thân Thể* (T2 Hatha, T3 Mở vai ngực, T4 Dynamic nhẹ, T5 Mở hông, T6 Kéo giãn chuyên sâu).

📋 **THỜI KHÓA BIỂU ĐẦY ĐỦ TẠI VICI (Thứ 2 – Thứ 7):**
* **05:00 – 06:00:** Yoga For Newbie (Người mới bắt đầu)
* **06:30 – 07:30:** Trị Liệu Chuyên Đề Sáng (Mở hông, vai ngực, vặn xoắn)
* **08:00 – 09:00:** Yoga Dòng Chảy & Cột Sống (Hatha, Vinyasa, Yin)
* **09:00 – 12:00:** Khóa Đào Tạo HLV Yoga Quốc Tế E-RYT 500
* **14:00 – 15:30:** Yoga Nâng Cao Ashtanga 10 Chuyên Đề (Master Henry Phan)
* **17:45 – 18:45:** Lớp Tan Ca Phục Hồi Thân Thể (Dân văn phòng)
* **19:00 – 20:00:** Yoga Buổi Tối & Trị Liệu Chuông Xoay (Thư giãn sâu, ngủ ngon)
* **Thứ 7 & Chủ Nhật:** Workshop Chuông Xoay & Đặt lịch Scan Trị Liệu 1-1 theo giờ hẹn.

💡 **LỜI KHUYÊN TỪ MASTER HENRY PHAN:**
Người ngồi văn phòng 10 tiếng liên tục rất dễ gặp phải tình trạng cơ ngực co ngắn gây gù vai và cơ thắt lưng bị chèn ép. Bạn có thể bắt đầu bằng **01 buổi Scan Trị Liệu 1-1 (45-60 phút, 650.000đ)** để Master đo lường góc lệch cột sống và xếp lớp chính xác nhất, hoặc đăng ký tham gia ngay **lớp tối 19:00 - 20:00**.

Bạn thấy khung giờ tối 19:00 hay sáng sớm 05:00 thuận tiện cho lịch trình của bạn hơn? Hãy chia sẻ với Vici Care nhé!`;
    }

    // Câu hỏi lịch học tổng quát
    return `Namaste bạn! Dưới đây là **Thời Khóa Biểu các lớp tập tại VICI Yoga Therapy Training Center** (từ Thứ 2 đến Thứ 7):

🌅 **CÁC CA SÁNG:**
* **05:00 – 06:00:** Lớp *Yoga For Newbie* (Nhẹ nhàng, đánh thức cơ thể, nạp năng lượng đón bình minh).
* **06:30 – 07:30:** Lớp *Trị Liệu Chuyên Đề Sáng* (T2: Kéo giãn | T3: Mở hông | T4: Mở vai & Lưng trên | T5: Vặn xoắn | T6: Thăng bằng).
* **08:00 – 09:00:** Lớp *Yoga Dòng Chảy & Cột Sống* (Cân bằng giữa hơi thở, thể lực và bảo vệ cột sống: Hatha, Vinyasa, Yin).
* **09:00 – 12:00:** Khóa *Đào Tạo HLV Yoga Quốc Tế E-RYT 500 / YACEP* (T2 - T4 - T6, trực tiếp Master Henry Phan).

☀️ **CA CHIỀU:**
* **14:00 – 15:30:** Lớp *Yoga Nâng Cao Ashtanga & Cột Sống* (10 chuyên đề chuyên sâu của Master Henry Phan, T3 & T5).

🌆 **CÁC CA TỐI (Thuận tiện sau giờ làm việc):**
* **17:45 – 18:45:** Lớp *Tan Ca Phục Hồi Thân Thể* (Xả stress, kéo giãn bó cơ và giải tỏa mỏi cổ vai gáy cho dân văn phòng).
* **19:00 – 20:00:** Lớp *Yoga Buổi Tối & Trị Liệu Chuông Xoay* (T2, T4, T6: Lớp Newbie | T3: Gentle Yoga | T5: Trị liệu Chuông xoay Tây Tạng giúp ngủ sâu giấc).

🌿 **DỊCH VỤ 1-1 & CUỐI TUẦN:**
* **Scan Trị Liệu Cơ - Vai - Cổ - Gáy 1-1 (45-60 phút, 650k):** Đặt lịch linh hoạt theo khung giờ riêng của bạn.
* **Workshop Chuông Xoay Chữa Lành:** Tổ chức định kỳ vào sáng Thứ 7 (tuần thứ 2 & thứ 4 hàng tháng).

Bạn thuận tiện tham gia vào khung giờ nào nhất (sáng sớm, ca chiều hay ca tối sau giờ làm) để Vici Care tư vấn chi tiết lớp học phù hợp cho bạn nhé?`;
  }

  // CÂU HỎI TƯ VẤN CHUNG / BẮT ĐẦU TỪ ĐÂU
  const isGeneralConsultation =
    lower === 'tư vấn' ||
    lower === 'tư vấn giúp tôi' ||
    lower === 'tư vấn cho tôi' ||
    lower === 'tôi cần tư vấn' ||
    lower === 'tôi muốn tư vấn' ||
    lower === 'cho tôi xin tư vấn' ||
    lower === 'nhờ tư vấn' ||
    lower === 'xin tư vấn' ||
    lower.includes('tư vấn giúp') ||
    lower.includes('tư vấn cho mình') ||
    lower.includes('cần được tư vấn') ||
    lower.includes('muốn được tư vấn') ||
    (lower.includes('tư vấn') && !lower.includes('thoát vị') && !lower.includes('vai gáy') && !lower.includes('học phí') && !lower.includes('lịch') && !lower.includes('địa chỉ') && !lower.includes('hlv') && !lower.includes('gối') && !lower.includes('ngủ'));

  if (isGeneralConsultation) {
    return `Namaste! 🙏 Rất vui được gặp bạn. Mình là **Vici Care** – Chuyên viên tư vấn phục hồi & trị liệu của Vici Yoga Therapy Training Center. Mình xin phép đưa ra định hướng giải phẫu học và lộ trình an toàn cho bạn ngay sau đây:

🌿 **1. ĐỊNH HƯỚNG CÁC NHÓM TRỊ LIỆU & RÈN LUYỆN CHÍNH TẠI VICI:**
* **Phục hồi Cột sống & Đĩa đệm (Thắt lưng, Thoát vị, Thoái hóa):** Áp dụng nguyên lý kéo giãn trục dọc (Axial Elongation) và kích hoạt nhóm cơ ngang bụng (Transversus Abdominis) để tạo "khung đỡ tự nhiên" bảo vệ đốt sống, giảm áp lực nhân nhầy lên rễ thần kinh.
* **Cổ - Vai - Gáy & Hội chứng văn phòng (Tê bì cánh tay, đau đầu):** Sử dụng phương pháp **6D Yoga Trị Liệu** căn chỉnh 6 chiều chuyển động của cột sống cổ, kết hợp kỹ thuật giải phóng điểm xoắn mạc cơ (Trigger Point) giúp máu lưu thông tốt lên não.
* **Dành cho Người mới bắt đầu / Cơ thể cứng:** Lớp **Yoga For Newbie** nhịp độ chậm rãi, sử dụng đầy đủ dụng cụ hỗ trợ (block xốp, dây đai, gối nêm), giáo viên nắn chỉnh tỉ mỉ từng biên độ, tuyệt đối không ép dẻo quá sức.
* **Mất ngủ, Lo âu & Rối loạn tiền đình:** Kỹ thuật thở Pranayama 4 thì kết hợp tần số rung chuông xoay Tây Tạng giúp kích hoạt hệ thần kinh phó giao cảm, đưa tâm trí về trạng thái thư giãn sâu.
* **Khóa Nâng cao Ashtanga (10 chuyên đề) & Đào tạo HLV Quốc Tế E-RYT 500:** Kèm cặp trực tiếp cùng Master Henry Phan theo chuẩn Yoga Alliance Hoa Kỳ.

📋 **2. QUY TRÌNH 4 BƯỚC CHUẨN HÓA TẠI VICI:**
1. **Bước 1 - Khảo sát tầm vận động (ROM Test):** Đánh giá góc nghiêng cột sống, độ gập duỗi và các điểm chèn ép thần kinh.
2. **Bước 2 - Lập phác đồ cá nhân hóa:** Thiết kế chuỗi bài tập nắn chỉnh và cân bằng cơ thể.
3. **Bước 3 - Luyện tập định tuyến:** Tham gia lớp tập trị liệu chuyên biệt hoặc lớp kèm 1-1 với sự nắn chỉnh trực tiếp của giáo viên.
4. **Bước 4 - Tái đánh giá & Duy trì:** Kiểm tra sự cải thiện của biên độ khớp sau từng chu kỳ.

💬 **Bạn đang quan tâm đến mục tiêu nào nhất?**
Hãy chia sẻ với Vici Care: Bạn có đang bị đau mỏi ở vùng nào (cổ vai gáy, thắt lưng, khớp gối) hay bạn là người mới muốn bắt đầu tập để nâng cao sức khỏe? Mình sẽ hỗ trợ bạn ngay nhé!`;
  }

  // NGƯỜI MỚI BẮT ĐẦU / CƠ THỂ CỨNG / SỢ ĐAU / CHƯA TẬP BAO GIỜ
  if (
    lower.includes('mới') ||
    lower.includes('chưa tập') ||
    lower.includes('cơ bản') ||
    lower.includes('bắt đầu') ||
    lower.includes('cứng') ||
    lower.includes('không dẻo') ||
    lower.includes('sợ đau') ||
    lower.includes('newbie')
  ) {
    return `Namaste bạn! Rất nhiều người nghĩ rằng "phải dẻo mới tập được Yoga", nhưng tại VICI, triết lý của Master Henry Phan hoàn toàn ngược lại:
> **"Chính vì cơ thể cứng nên chúng ta mới cần đến Yoga để được mềm mại, dẻo dai và giải tỏa áp lực!"**

🌿 **TƯ VẤN CHO NGƯỜI MỚI TẠI VICI:**
1. **Không có sự so sánh:** Mỗi người có cấu trúc xương khớp khác nhau. Bạn không cần phải làm giống hệt người bên cạnh, chỉ cần lắng nghe giới hạn cơ thể mình.
2. **Được hỗ trợ đầy đủ dụng cụ:** Lớp Newbie được trang bị gạch xốp (blocks), dây đai (straps), gối nêm (bolster). Dụng cụ giúp đưa mặt sàn lại gần cơ thể bạn, giúp bạn vào tư thế an toàn, không bị căng kéo rách cơ.
3. **Giáo viên nắn chỉnh trực tiếp:** Thầy Cô sẽ hướng dẫn từng cách đặt bàn chân, mở khớp háng và bảo vệ đầu gối.
4. **Học thở Pranayama bài bản:** Bạn sẽ học cách thở bằng cơ hoành, giúp tăng lượng oxy vào máu và giải tỏa căng thẳng ngay từ buổi đầu tiên.

⏰ **CÁC CA TẬP PHÙ HỢP:**
* Sáng sớm: 05:00 - 06:00 (Lớp Đón Bình Minh & Newbie Yoga)
* Sáng: 06:30 - 07:30 (Yoga Nền tảng)
* Tối: 19:00 - 20:00 (Gentle Yoga Thư giãn)

Bạn muốn bắt đầu vào khung giờ sáng sớm để tràn đầy năng lượng hay khung giờ tối sau giờ làm việc ạ?`;
  }

  // ĐAU KHỚP GỐI, THOÁI HÓA GỐI, TRÀN DỊCH, KHÔ KHỚP, DÂY CHẰNG
  if (
    lower.includes('khớp gối') ||
    lower.includes('đầu gối') ||
    lower.includes('tràn dịch') ||
    lower.includes('thoái hóa gối') ||
    lower.includes('dây chằng') ||
    lower.includes('khô khớp')
  ) {
    return `Namaste bạn! Khớp gối là khớp bản lề chịu tải trọng rất lớn của toàn bộ cơ thể. Khi khớp gối bị đau hoặc thoái hóa, nguyên tắc trị liệu khoa học là:

🔬 **NGUYÊN TẮC PHỤC HỒI KHỚP GỐI TẠI VICI:**
* Khớp gối không thể tự ổn định nếu các nhóm cơ xung quanh bị yếu. Muốn gối hết đau, bắt buộc phải **kích hoạt nhóm cơ tứ đầu đùi (Quadriceps)** và **cơ mông nhỡ (Gluteus Medius)** để chúng gánh tải trọng thay cho sụn khớp gối.
* **Quy tắc an toàn sống còn:**
  - Tuyệt đối TRÁNH khóa khớp gối (Hyperextension - đẩy khớp gối ra sau quá mức).
  - Khi gập gối, đầu gối luôn hướng thẳng theo ngón chân thứ 2, không để đầu gối sụp vào trong (Knee Valgus).
  - Tránh các bài ngồi xổm sâu hoặc tư thế Hoa sen (Padmasana) khi khớp gối chưa đủ linh hoạt.

✅ **BÀI TẬP NÊN LÀM:**
1. Tập cơ đùi tĩnh: Nằm ngửa, đặt một cuộn khăn dưới khoeo chân, siết cơ đùi ấn nhẹ khoeo xuống sàn trong 5 giây rồi nhả.
2. Tư thế Nhấc chân thẳng (Straight Leg Raise) để củng cố sức mạnh nhóm cơ mặt trước đùi mà không gây cọ xát khớp gối.

Bạn hãy chia sẻ xem đầu gối của bạn bị đau khi đi cầu thang, ngồi xổm hay đau âm ỉ cả khi nghỉ ngơi nhé!`;
  }

  // ĐAU THẦN KINH TỌA, TÊ BÚỐT MÔNG CHÂN, CƠ HÌNH LÊ (PIRIFORMIS)
  if (
    lower.includes('thần kinh tọa') ||
    lower.includes('tê chân') ||
    lower.includes('buốt mông') ||
    lower.includes('cơ hình lê') ||
    lower.includes('piriformis')
  ) {
    return `Namaste bạn! Cơn đau buốt từ mông lan dọc xuống đùi và bắp chân thường do 2 nguyên nhân chính: Thoát vị đĩa đệm L4-L5/L5-S1 chèn ép rễ thần kinh, hoặc do **Hội chứng Cơ hình lê (Piriformis Syndrome)** co thắt đè lên dây thần kinh tọa.

🌿 **TƯ VẤN PHỤC HỒI TẠI VICI:**
1. **Giải phóng cơ hình lê (Piriformis Release):**
   - Tư thế Con số 4 nằm ngửa (Reclined Pigeon Pose): Nằm ngửa, đặt mắt cá chân phải lên đùi trái, hai tay ôm lấy đùi trái kéo nhẹ về ngực. Giữ lưng chạm sàn, hít thở sâu để giải tỏa cơ mông sâu.
2. **Kéo giãn nhóm gân kheo (Hamstrings Stretch) nhẹ nhàng:** Dùng dây đai móc vào lòng bàn chân và duỗi thẳng chân lên trần nhà có kiểm soát, tránh kéo giật.
3. **Thư giãn sóng âm Chuông xoay:** Tần số rung động cơ học giúp phá vỡ các nút thắt co cứng cơ mạc vùng khung chậu.

❌ **LƯU Ý:** Không ngồi trên ví tiền hoặc vật cứng ở túi quần sau, tránh ngồi ghế quá thấp khiến khớp háng bị gập nhọn.

Tại VICI, Master Henry Phan có phác đồ nắn chỉnh giải áp thần kinh tọa 1-1 rất hiệu quả. Bạn có thể mô tả vị trí đau buốt nhất của mình để Vici Care hỗ trợ thêm nhé!`;
  }

  // MẤT NGỦ, STRESS, ĐAU ĐẦU, TIỀN ĐÌNH, LO ÂU
  if (
    lower.includes('mất ngủ') ||
    lower.includes('khó ngủ') ||
    lower.includes('stress') ||
    lower.includes('tiền đình') ||
    lower.includes('đau đầu') ||
    lower.includes('lo âu') ||
    lower.includes('căng thẳng')
  ) {
    return `Namaste bạn! Mất ngủ và căng thẳng kéo dài là biểu hiện của việc hệ thần kinh giao cảm (Sympathetic) bị kích thích liên tục, khiến cơ thể luôn trong trạng thái "chiến đấu hoặc bỏ chạy", lượng cortisol tăng cao và tuần hoàn máu não suy giảm.

🌸 **GIẢI PHÁP CHỮA LÀNH TẠI VICI:**
1. **Kỹ thuật Thở Luân Phiên (Nadi Shodhana Pranayama):** Dùng ngón tay bịt luân phiên từng bên mũi để hít thở chậm, sâu. Phương pháp này đã được khoa học chứng minh giúp cân bằng 2 bán cầu não và hạ nhịp tim về mức thư giãn.
2. **Tư thế Gác chân lên tường (Viparita Karani):** Nằm ngửa gác hai chân thẳng lên tường 10-15 phút trước khi đi ngủ. Tư thế này giúp máu giàu oxy dồn về não, giảm áp lực tĩnh mạch chân và xoa dịu hệ thần kinh cực kỳ nhanh chóng.
3. **Liệu pháp Chuông Xoay Tây Tạng Full Moon (Sound Healing):** Master Mỹ Kiều ứng dụng sóng âm chuông xoay tác động vào các phân tử nước trong tế bào, đưa tần số sóng não từ Beta (căng thẳng) về Alpha và Theta (thiền định sâu), giúp tái tạo giấc ngủ tự nhiên mà không cần dùng thuốc an thần.

Lớp tập tối 19:00 - 20:00 tại VICI là sự kết hợp hoàn hảo giữa Yoga Phục hồi và Chuông xoay để bạn có một giấc ngủ trọn vẹn mỗi đêm!`;
  }

  // KHÓA ASHTANGA NÂNG CAO 10 CHUYÊN ĐỀ (MASTER HENRY PHAN)
  if (
    lower.includes('ashtanga') ||
    lower.includes('nâng cao') ||
    lower.includes('10 chuyên đề') ||
    lower.includes('handstand') ||
    lower.includes('uốn lưng') ||
    lower.includes('pincha') ||
    lower.includes('chuối') ||
    lower.includes('đảo ngược')
  ) {
    return `Namaste bạn! Khóa học **"Yoga Nâng Cao Ashtanga & Năng Lượng Cột Sống (10 chuyên đề chuyên sâu)"** do đích thân Master Henry Phan (E-RYT 500) biên soạn và trực tiếp giảng dạy:

🔥 **10 CHUYÊN ĐỀ NỔI BẬT:**
1. Khóa năng lượng Bandhas (Mula, Uddiyana, Jalandhara) & Hơi thở Ujjayi chuẩn xác.
2. Định tuyến điểm nhìn định tâm (Drishti) và chuyển động Vinyasa krama.
3. Kỹ thuật mở lưng trên (Thoracic Spine) an toàn, tuyệt đối không chèn ép thắt lưng.
4. Mở khớp hông đa chiều & tư thế Bồ Câu Vua (Kapotasana).
5. Kỹ thuật đảo ngược an toàn: Trồng chuối Sirsasana và Pincha Mayurasana.
6. Chinh phục thăng bằng tay Handstand (Adho Mukha Vrksasana) với cấu trúc đai vai vững chãi.

💰 **Học phí ưu đãi Early Bird:** 1.290.000 VNĐ (Giá gốc 1.590.000 VNĐ).
⏰ Lịch học: Ca chiều Thứ 3 & Thứ 5 (14:00 - 15:30). Bạn có thể đăng ký giữ chỗ ngay hôm nay!`;
  }

  // ĐÀO TẠO HUẤN LUYỆN VIÊN YOGA QUỐC TẾ E-RYT 500 / YACEP
  if (
    lower.includes('hlv') ||
    lower.includes('huấn luyện viên') ||
    lower.includes('đào tạo') ||
    lower.includes('chứng chỉ') ||
    lower.includes('yoga alliance') ||
    lower.includes('bằng cấp') ||
    lower.includes('e-ryt') ||
    lower.includes('200h') ||
    lower.includes('500h')
  ) {
    return `Namaste bạn! Khóa **Đào Tạo Huấn Luyện Viên Yoga Quốc Tế (E-RYT 500 / YACEP)** tại VICI là chương trình đào tạo chuyên sâu chuẩn quốc tế Yoga Alliance Hoa Kỳ (chứng chỉ có giá trị giảng dạy trên toàn cầu):

🎓 **ĐIỂM KHÁC BIỆT KHI HỌC TẠI VICI:**
* Kèm cặp trực tiếp bởi **Master Henry Phan** – chuyên gia từng đào tạo y bác sĩ BV Đa khoa Tâm Anh và Vinpearl Landmark Sky Studio.
* Đào tạo bài bản về **Giải phẫu học Cơ năng (Kinesiology)** và **Trị Liệu Cột Sống 6D Yoga** – giúp bạn tự tin xử lý mọi ca chấn thương của học viên.
* Nghệ thuật chỉnh sửa bằng tay (Hands-on Adjustments) an toàn và tâm lý học sư phạm.
* Cơ hội thực tập trợ giảng và giới thiệu việc làm tại hệ thống phòng tập đối tác của VICI.

⏰ Lịch học: Ca sáng 09:00 - 12:00 (Thứ 2 - 4 - 6). Bạn có thể để lại thông tin để VICI gửi trọn bộ Brochure chương trình và chính sách học bổng nhé!`;
  }

  // ĐỊA CHỈ, ĐƯỜNG ĐI, GỬI XE
  if (
    lower.includes('địa chỉ') ||
    lower.includes('ở đâu') ||
    lower.includes('chỗ nào') ||
    lower.includes('vị trí') ||
    lower.includes('đường đi') ||
    lower.includes('gửi xe') ||
    lower.includes('opal')
  ) {
    return `📍 **Địa chỉ Trung tâm VICI Yoga Therapy:**
* **Trụ sở chính:** Căn hộ B1-0705, Chung cư Opal Boulevard, mặt tiền đường Phạm Văn Đồng, phường An Bình, TP. Dĩ An (giáp ranh trực tiếp TP. Thủ Đức, TP. Hồ Chí Minh).
* **Tiện ích:** Tòa nhà có hầm gửi xe máy và ô tô cực kỳ rộng rãi, an ninh 24/7. Phòng tập trên tầng cao thoáng mát, đón gió trời tự nhiên, cách biệt hoàn toàn khói bụi và tiếng ồn.
* Ngoài ra VICI còn có chuỗi không gian liên kết: Yoga Chân Mây (Vinpearl Landmark Sky Studio) và Vườn Ong Xóm Lá.
Hotline đón khách: **036 684 0130**. Rất hoan nghênh bạn ghé thăm phòng tập!`;
  }

  // GIẢNG VIÊN (MASTER HENRY PHAN & MASTER MỸ KIỀU)
  if (
    lower.includes('thầy') ||
    lower.includes('cô') ||
    lower.includes('henry') ||
    lower.includes('hùng phan') ||
    lower.includes('mỹ kiều') ||
    lower.includes('giảng viên') ||
    lower.includes('ai dạy')
  ) {
    return `Đội ngũ Giảng viên tại VICI Yoga Therapy gồm những Master giàu kinh nghiệm và tâm huyết:

🌟 **Master Henry Phan (Yogi Hùng Phan) - Sáng lập VICI:**
* Đạt chuẩn **E-RYT 500 & YACEP** cao nhất của Yoga Alliance Hoa Kỳ.
* Cử nhân ĐH Kinh tế Quốc dân và ĐH Yoga Ấn Độ.
* Á Quân Got Talent FLG Việt Nam 2022.
* Chuyên gia Master Yoga từng trực tiếp đào tạo phục hồi cho đội ngũ y bác sĩ Bệnh viện Đa khoa Tâm Anh và Vinpearl Landmark Sky Studio.

🌸 **Master Mỹ Kiều - Đồng sáng lập VICI:**
* Chuyên gia trị liệu tâm trí và chuông xoay Tây Tạng với phương châm *"Tâm an - Vạn sự an"*.
* Thấu hiểu tâm lý học viên, hướng dẫn hơi thở và giải tỏa căng thẳng thần kinh hiệu quả.

Các Thầy Cô luôn trực tiếp nắn chỉnh tư thế trong từng buổi tập để bạn đạt định tuyến chuẩn xác nhất.`;
  }

  // TRẢI NGHIỆM / HỌC THỬ / SCAN TRỊ LIỆU
  if (
    lower.includes('tập thử') ||
    lower.includes('học thử') ||
    lower.includes('trải nghiệm') ||
    lower.includes('scan') ||
    lower.includes('kiểm tra')
  ) {
    return `Namaste bạn! VICI luôn chào đón bạn đến trải nghiệm:
* **Buổi trải nghiệm lớp tập nhóm:** Cảm nhận không khí tập luyện ấm áp và sự nắn chỉnh tận tình của giáo viên.
* **Buổi Scan Trị Liệu & ROM test 1-1 (45-60 phút, 650.000đ):** Master sẽ đo đạc độ lệch trục cột sống, biên độ khớp, tầm soát điểm đau cơ mạc và thiết lập phác đồ riêng cho bạn trước khi xếp lớp.
Bạn có thể cho Vici Care biết bạn muốn tham gia trải nghiệm vào ngày nào trong tuần nhé!`;
  }

  // DEFAULT CONVERSATIONAL ADVICE
  return `Namaste bạn! Cảm ơn bạn đã trò chuyện cùng Vici Care. 🙏

Tại VICI Yoga Therapy, dưới sự dẫn dắt của **Master Henry Phan (E-RYT 500)**, chúng tôi chuyên sâu về:
1. **Trị liệu Cột sống & Cơ xương khớp:** Thoát vị đĩa đệm, thoái hóa L4-L5, đau mỏi cổ vai gáy, phục hồi sau chấn thương, đau thần kinh tọa và khớp gối.
2. **Yoga Cho Người Mới:** Nhịp độ nhẹ nhàng, sử dụng dụng cụ hỗ trợ an toàn tuyệt đối.
3. **Khóa Ashtanga Nâng Cao & Đào Tạo HLV Quốc Tế E-RYT 500:** Cấp bằng Yoga Alliance Hoa Kỳ.
4. **Workshop Chuông Xoay Himalaya:** Giải tỏa stress và điều trị mất ngủ.

Bạn có thể chia sẻ cụ thể hơn về tình trạng sức khỏe hiện tại của bạn (vị trí đau mỏi, tiền sử chấn thương hoặc mục tiêu bạn mong muốn) để Vici Care tư vấn bài tập và phác đồ tốt nhất cho bạn ngay nhé!`;
}
