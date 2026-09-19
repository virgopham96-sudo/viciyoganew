/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * VICI Yoga Therapy - Knowledge Base & Advisory Engine
 * Upgraded with concise clinical consultation, diagnostic course matching,
 * zero-duplicate schedule presentation, and active trainer intake gathering.
 */

export const VICI_CARE_SYSTEM_PROMPT = `
Bạn là "MyVici" – Chuyên viên tư vấn phục hồi và trị liệu của Vici Yoga Therapy Center (viciyoga.vercel.app).

1. TÍNH CÁCH & PHONG THÁI:
- Nhẹ nhàng, lắng nghe, thấu cảm và mang năng lượng chữa lành (mindful).
- Chuẩn mực khoa học: Kết hợp giữa giải phẫu học và yoga trị liệu.
- Ngôn ngữ: Tiếng Việt chuẩn mực, xưng "MyVici" hoặc "mình", gọi khách là "bạn" hoặc "anh/chị".
- Câu trả lời súc tích, gãy gọn, chia đoạn rõ ràng, tránh lan man như sách giáo khoa.

2. VỀ VICI YOGA THERAPY:
- Định vị: Chuyên sâu về Yoga Trị liệu, Phục hồi cột sống, xương khớp, giải tỏa căng thẳng thần kinh và cải thiện giấc ngủ.
- Người sáng lập: Master Henry Phan (Yogi Hùng Phan, E-RYT 500 & YACEP Yoga Alliance Hoa Kỳ, từng hỗ trợ trị liệu cột sống chuyên sâu).
- Đồng sáng lập: Master Mỹ Kiều (Chuyên gia Trị liệu Thư giãn & Chuông xoay Tây Tạng).
- Địa chỉ: Căn hộ B1-0705, Chung cư Opal Boulevard, đường Phạm Văn Đồng, TP. Dĩ An (giáp TP. Thủ Đức, TP. HCM). Hotline/Zalo: 036 684 0130.
- Phương châm: "Tập đúng để chữa lành – Không ép dẻo quá đà – Tôn trọng giới hạn tự nhiên của cơ thể".
- Mô hình lớp:
  + Lớp trị liệu nhóm nhỏ: Đảm bảo giáo viên theo sát từng tư thế.
  + Lớp kèm 1:1 (PT): Giáo án cá nhân hóa theo hồ sơ bệnh lý (thoát vị đĩa đệm, thoái hóa khớp, lệch vẹo cột sống).
  + Lớp Yoga Thư giãn: Hatha nhẹ nhàng, Yin Yoga phục hồi sâu, Workshop Chuông xoay Tây Tạng.

3. QUY TRÌNH HỘI THOẠI 4 BƯỚC:
- Bước 1 (Khảo sát): Hỏi thăm vị trí đau mỏi (cổ vai gáy, thắt lưng), thói quen ngồi làm việc và mục tiêu trị liệu.
- Bước 2 (Giải thích & Trấn an): Giải thích nguyên nhân căng cơ, chèn ép rễ thần kinh. Cam kết tập luyện an toàn, không đau buốt.
- Bước 3 (Đề xuất giải pháp): Gợi ý lớp trị liệu nhóm nhỏ hoặc PT 1:1, kết hợp các ca tập phù hợp (Sáng 05:00/06:30/08:00, Chiều 14:00, Tan ca 17:45, Tối 19:00).
- Bước 4 (Chuyển đổi): Mời học viên đặt lịch kiểm tra tầm vận động (ROM test) và trải nghiệm buổi tập thử.

4. NGUYÊN TẮC AN TOÀN BẮT BUỘC:
- Tuyệt đối không thay thế bác sĩ điều trị hoặc chẩn đoán phim X-quang/MRI.
- Luôn nhắc học viên báo tình trạng chấn thương cho giáo viên đứng lớp.
- Khi khách hàng cung cấp Tên và Số điện thoại/Zalo, BẮT BUỘC gọi công cụ save_contact_lead để lưu trữ dữ liệu vào hệ thống và xác nhận với khách.

5. CÁC TÌNH HUỐNG MẪU TIÊU CHUẨN (FEW-SHOT):
- Trường hợp 1: Thoát vị đĩa đệm (L4-L5, L5-S1):
  + Đồng cảm & Trấn an: Bày tỏ sự thấu hiểu về cảm giác bất tiện và khẳng định người bị thoát vị hoàn toàn có thể tập luyện yoga phục hồi an toàn.
  + Giải thích cơ chế: Bài tập tập trung kéo giãn giải áp giữa các đốt sống và gia cố nhóm cơ lõi (core muscles) để giảm tải cho cột sống; loại bỏ hoàn toàn các động tác vặn xoắn gắt hoặc uốn lưng sâu.
  + Định hướng: Khuyến nghị lớp kèm 1:1 (PT) hoặc kiểm tra biên độ cột sống trước khi xếp lớp.
  + Kêu gọi: Mời để lại số điện thoại/Zalo để đặt lịch kiểm tra trực tiếp.

- Trường hợp 2: Khách văn phòng đau mỏi cổ vai gáy:
  + Phân tích nguyên nhân: Co rút cơ thang, cơ nâng vai và chèn ép thần kinh do thói quen gù lưng, cúi đầu làm việc máy tính (Text Neck).
  + Giải pháp: Đề xuất lớp chuyên đề Cổ Vai Gáy hoặc Yin Yoga giãn sâu, mở khớp vai và giải phóng tắc nghẽn.
  + Kêu gọi: Xin thông tin liên hệ để gửi lịch học và xếp chỗ tập thử.

- Trường hợp 3: Khách hàng hỏi bảng giá chung:
  + Giới thiệu tổng quan các hình thức (Lớp nhóm trị liệu 3-6 tháng khoảng 800k-850k/tháng và Lớp PT 1:1 cá nhân hóa).
  + Nêu chính sách ưu đãi cho buổi kiểm tra tầm vận động (ROM test) và trải nghiệm đầu tiên.
  + Kêu gọi: Xin số điện thoại/Zalo để bộ phận tư vấn gửi biểu phí chi tiết theo thời hạn gói tập.
`;

export const VICI_SYSTEM_PROMPT = VICI_CARE_SYSTEM_PROMPT;

/**
 * Fallback Local Advisory Engine for instant offline consultation
 * Crisp, concise, highly diagnostic, zero duplicate schedules, active intake & booking CTA.
 */
export function getViciConsultation(message: string): string {
  const lower = (message || '').toLowerCase().trim();

  // Check if message contains a phone number (user leaving info)
  const phoneMatch = message.match(/(0\d{9,10}|\+84\d{9,10}|\d{4}[\s.-]?\d{3}[\s.-]?\d{3})/);
  if (phoneMatch) {
    const rawNumber = phoneMatch[0];
    return `Namaste bạn! 🙏 VICI đã ghi nhận thông tin liên hệ của bạn: **${rawNumber}**.

📋 **Thông tin đã được chuyển giao cho Huấn luyện viên:**
Master Henry Phan và đội ngũ chuyên môn VICI sẽ liên hệ trực tiếp qua số điện thoại/Zalo này trong vòng 30 - 60 phút để:
1. Trao đổi kỹ hơn về tình trạng cơ xương khớp / mục tiêu tập luyện của bạn.
2. Thiết lập phác đồ trị liệu cá nhân hóa và xếp lịch hẹn phù hợp nhất.

Nếu bạn cần hỗ trợ khẩn cấp, bạn cũng có thể gọi trực tiếp Hotline/Zalo: **036 684 0130** (Master Henry Phan). Chúc bạn một ngày an lành! ✨`;
  }

  // 1. HỎI CÁC CA TẬP BUỔI SÁNG (05:00, 06:30, 08:00)
  const isMorningQuery =
    (lower.includes('sáng') || lower.includes('5h') || lower.includes('05:00') || lower.includes('6h30') || lower.includes('06:30') || lower.includes('8h') || lower.includes('08:00')) &&
    (lower.includes('lớp') || lower.includes('giờ') || lower.includes('tập') || lower.includes('lịch') || lower.includes('có ca') || lower.includes('buổi sáng'));

  if (isMorningQuery && !lower.includes('tối') && !lower.includes('chiều')) {
    return `Namaste bạn! VICI có **3 ca tập buổi sáng** được thiết kế khoa học phù hợp với từng nhu cầu và thể trạng:

🌅 **1. Ca Sáng Sớm (05:00 – 06:00) — Yoga For Newbie:**
* Đón bình minh, nhẹ nhàng khởi động khớp và học kỹ thuật thở sâu nạp năng lượng. Hoàn thành lúc 6h00 giúp bạn thảnh thơi ăn sáng và đến công ty đúng giờ.

🌿 **2. Ca Sáng (06:30 – 07:30) — Trị Liệu Chuyên Đề Chuyên Sâu:**
* **Thứ 2:** Yoga Stretching kéo giãn toàn thân.
* **Thứ 3:** Hip Opening mở khớp hông, giải phóng căng cứng thắt lưng.
* **Thứ 4:** Shoulder & Upperback chuyên đề mở vai gáy & chống gù lưng.
* **Thứ 5:** Twisting Yoga vặn xoắn linh hoạt cột sống.
* **Thứ 6:** Yoga Balance thăng bằng và kích hoạt cơ lõi.

✨ **3. Ca Sáng (08:00 – 09:00) — Phục Hồi & Năng Lượng:**
* Hatha truyền thống, Vinyasa Flow và Yin Yoga phục hồi mạc cơ sâu.

👉 Bạn thuận tiện tham gia ca sáng nào nhất (05:00, 06:30 hay 08:00)? Hãy để lại **Họ tên + SĐT/Zalo** để VICI giữ chỗ và chuẩn bị thảm tập cho bạn nhé!`;
  }

  // 2. HỎI VỀ CA CHIỀU (14:00 - 15:30)
  const isAfternoonQuery =
    (lower.includes('chiều') || lower.includes('14h') || lower.includes('15h') || lower.includes('buổi chiều')) &&
    (lower.includes('lớp') || lower.includes('giờ') || lower.includes('tập') || lower.includes('lịch') || lower.includes('ca'));

  if (isAfternoonQuery && !lower.includes('tan ca') && !lower.includes('17h') && !lower.includes('tối')) {
    return `Namaste bạn! Khung giờ chiều tại VICI là thời gian dành cho các lớp chuyên sâu đặc biệt:

☀️ **Ca Chiều (14:00 – 15:30) — Thứ 3 & Thứ 5:**
* **Khóa học:** *Yoga Nâng Cao Ashtanga & Năng Lượng Cột Sống (10 chuyên đề)* do đích thân **Master Henry Phan** (E-RYT 500) trực tiếp đứng lớp.
* **Nội dung:** Kỹ thuật mở vai ngực, uốn lưng sâu bảo vệ đĩa đệm, chinh phục Handstand và thăng bằng tay an toàn.
* **Học phí ưu đãi:** 1.290.000đ/khóa 10 buổi.

🌿 Ngoài ra, các buổi chiều còn dành cho lịch **Scan Trị Liệu 1-1 và Phục Hồi Cá Nhân Hóa** theo giờ hẹn riêng với Huấn luyện viên.

👉 Bạn đang quan tâm đến lớp Ashtanga nâng cao hay đặt lịch Scan 1-1 riêng? Hãy để lại **Họ tên + SĐT/Zalo** để VICI hỗ trợ xếp lịch ngay nhé!`;
  }

  // 3. HỎI VỀ CA TAN CA (17:45 - 18:45) HOẶC GIỜ LÀM VĂN PHÒNG
  const isOfficeHours =
    (lower.includes('8h') || lower.includes('18h') || lower.includes('văn phòng') || lower.includes('hành chính') || lower.includes('tan làm') || lower.includes('tan ca') || lower.includes('17h45')) &&
    (lower.includes('lớp') || lower.includes('giờ') || lower.includes('tập') || lower.includes('lịch') || lower.includes('phù hợp'));

  if (isOfficeHours) {
    return `Namaste bạn! Hiểu rõ lịch trình làm việc văn phòng bận rộn, VICI thiết kế các khung giờ linh hoạt theo đúng nhu cầu của bạn:

🌆 **1. Ca Tan Ca (17:45 – 18:45) — Tập ngay sau giờ làm:**
* Vừa rời công sở, bạn ghé Studio tập ngay 60 phút để xả bỏ căng thẳng cổ vai gáy, tránh kẹt xe giờ cao điểm.
* Các chuyên đề: Mở vai gáy, mở khớp hông giải phóng thắt lưng và Stretching kéo giãn sâu.

🌙 **2. Ca Tối (19:00 – 20:00) — Thảnh thơi sau bữa tối:**
* Thích hợp cho học viên muốn về nhà cơm nước, nghỉ ngơi rồi mới vào lớp.
* Gồm các lớp: *Yoga Newbie căn bản*, *Gentle Yoga thư giãn*, và đặc biệt *Yoga Therapy Chuông Xoay Tây Tạng* (Thứ 5) giúp ngủ ngon sâu giấc.

🌅 **3. Ca Sáng Sớm (05:00 – 06:00) — Đón bình minh trước giờ làm:**
* Dành cho học viên thích tập sớm để tinh thần sảng khoái và tràn đầy năng lượng suốt ngày làm việc.

👉 Bạn cảm thấy khung giờ nào thuận tiện nhất cho lịch trình cá nhân của mình? Bạn có thể để lại **Họ tên + SĐT/Zalo** để VICI hỗ trợ xếp lớp trải nghiệm nhé!`;
  }

  // 4. HỎI VỀ LỊCH CUỐI TUẦN (THỨ 7 / CHỦ NHẬT)
  if (
    lower.includes('cuối tuần') ||
    lower.includes('thứ 7') ||
    lower.includes('thứ bảy') ||
    lower.includes('chủ nhật') ||
    lower.includes('t7') ||
    lower.includes('cn')
  ) {
    return `Namaste bạn! Lịch trình cuối tuần tại VICI Yoga Therapy Training Center:

🌿 **Thứ 7 (08:30 – 11:30):**
* **Workshop Trị Liệu Chuông Xoay Tây Tạng & Mindfulness:** Chữa lành năng lượng, giải tỏa stress và thanh lọc tâm trí cùng Master Mỹ Kiều.
* **Chương trình Gia Đình Yoga & Chuyên đề cộng đồng Henry Wellness.**

🎯 **Thứ 7 & Chủ Nhật (Khung giờ linh hoạt theo lịch hẹn):**
* **Buổi Scan Trị Liệu Cơ Xương Khớp 1-1 (650.000đ, 45-60 phút):** Tầm soát góc lệch cột sống, xác định điểm nghẽn bó cơ và hướng dẫn phác đồ riêng cùng Master Henry Phan.
* **Gói Trị Liệu Cá Nhân Hóa 1-1** cho học viên bận rộn ngày thường.

👉 Bạn quan tâm đến Workshop Chuông Xoay hay muốn đặt lịch Scan Trị Liệu 1-1 cuối tuần? Hãy để lại **Họ tên + SĐT/Zalo** để VICI sắp xếp lịch chu đáo nhé!`;
  }

  // 5. THỜI KHÓA BIỂU TỔNG QUÁT (DUY NHẤT 1 LẦN, KHÔNG TRÙNG LẶP)
  if (
    lower.includes('thời khóa biểu') ||
    lower.includes('tkb') ||
    (lower.includes('lịch') && (lower.includes('học') || lower.includes('tập') || lower.includes('tuần') || lower.includes('lớp'))) ||
    lower.includes('các ca tập')
  ) {
    return `Namaste bạn! Dưới đây là **Thời Khóa Biểu các lớp tại VICI Yoga Therapy** (Thứ 2 đến Thứ 7):

🌅 **CA SÁNG:**
* **05:00 – 06:00:** Yoga For Newbie (Đón bình minh nhẹ nhàng, khởi động ngày mới)
* **06:30 – 07:30:** Trị Liệu Chuyên Đề (Kéo giãn cơ, Mở khớp hông, Mở vai gáy, Vặn xoắn)
* **08:00 – 09:00:** Hatha Truyền Thống, Vinyasa Flow & Yin Yoga Phục Hồi Cột Sống
* **09:00 – 12:00:** Đào Tạo Huấn Luyện Viên Quốc Tế E-RYT 500 (Thứ 2 - 4 - 6)

☀️ **CA CHIỀU:**
* **14:00 – 15:30:** Yoga Nâng Cao Ashtanga 10 Chuyên Đề (Master Henry Phan, T3 & T5)

🌆 **CA TỐI & TAN CA:**
* **17:45 – 18:45:** Lớp Tan Ca Phục Hồi Cổ Vai Gáy (Vừa tan sở ghé tập ngay)
* **19:00 – 20:00:** Yoga Newbie, Gentle Yoga & Trị Liệu Chuông Xoay (Ngủ sâu giấc)

🌿 **Cuối tuần:** Workshop Chuông xoay Thứ 7 (08:30 - 11:30) & Lịch Scan Trị Liệu 1-1 theo hẹn riêng.

👉 Khung giờ nào phù hợp nhất với thời gian biểu của bạn? Bạn vui lòng để lại **Họ tên + SĐT/Zalo** để VICI hỗ trợ xếp lớp phù hợp nhé!`;
  }

  // 3. ĐAU MỎI CỔ - VAI - GÁY, TÊ TAY, GÙ LƯNG, DÂN VĂN PHÒNG
  if (
    lower.includes('vai gáy') ||
    lower.includes('cổ') ||
    lower.includes('tê tay') ||
    lower.includes('gù lưng') ||
    lower.includes('ngồi máy tính') ||
    lower.includes('đau đầu') ||
    lower.includes('chéo trên')
  ) {
    return `Namaste bạn! Tình trạng đau mỏi Cổ - Vai - Gáy và tê bì ngón tay là dấu hiệu của **Hội chứng Chéo Trên (Upper Crossed Syndrome)** do ngồi cúi nhìn màn hình lâu, làm cơ nâng vai co rút và chèn ép dây thần kinh:

🌿 **Lời khuyên tự chăm sóc tại chỗ:**
* Thực hiện bài tập **Thu cằm (Chin Tuck)**: Ngồi thẳng, từ từ đẩy cằm thẳng ra sau tạo nếp gấp cằm đôi, giữ 5 giây rồi thả lỏng (10 lần/ngày).
* Tuyệt đối **không bẻ lắc cổ phát tiếng rắc** đột ngột vì dễ gây tổn thương đĩa đệm cổ.

🎯 **Khóa học VICI gợi ý phù hợp nhất cho bạn:**
1. **01 buổi Scan Trị Liệu Cơ - Vai - Cổ - Gáy 1-1 (45-60 phút, 650.000đ):** Master Henry Phan sẽ đo biên độ khớp cổ, giải phóng điểm xoắn mạc cơ (Trigger Point) và thiết lập phác đồ riêng.
2. Tham gia **Lớp Tan Ca 17:45** hoặc **Lớp Tối 19:00 (T2-T4-T6)** chuyên phục hồi cơ mạc.

👉 Bạn bị đau mỏi bao lâu rồi và có bị tê lan xuống cánh tay không? Hãy để lại **Họ tên + Số điện thoại/Zalo** để HLV VICI lên hồ sơ bệnh án và hẹn giờ tư vấn 1-1 cho bạn nhé!`;
  }

  // 4. THOÁT VỊ ĐĨA ĐỆM (L4-L5, L5-S1), ĐAU THẮT LƯNG, THOÁI HÓA CỘT SỐNG
  if (
    lower.includes('thoát vị') ||
    lower.includes('đĩa đệm') ||
    lower.includes('l4') ||
    lower.includes('l5') ||
    lower.includes('s1') ||
    lower.includes('thắt lưng') ||
    lower.includes('đau lưng') ||
    lower.includes('cột sống') ||
    lower.includes('thoái hóa')
  ) {
    return `Namaste bạn! Người bị đau thắt lưng hay thoát vị đĩa đệm (L4-L5, L5-S1) **hoàn toàn tập Yoga được và phục hồi rất tốt**, nhưng bắt buộc phải theo phương pháp Kinesiology an toàn:

🌿 **Nguyên tắc an toàn sống còn:**
* Ưu tiên các động tác kéo dài trục dọc cột sống nhẹ nhàng: *Tư thế Con Mèo - Con Bò chậm*, *Tư thế Nhân Sư (Sphinx Pose)* giúp đưa nhân nhầy về trung tính.
* **Tuyệt đối tránh:** Cúi gập người sâu kéo giật, vặn xoắn gắt khi hông chưa cố định, hoặc uốn cong lưng ra sau quá mức.

🎯 **Khóa học VICI gợi ý phù hợp nhất:**
* **Gói Trị Liệu Cá Nhân Hóa 1-1 (1.200.000đ/buổi) hoặc Gói Hội Viên Trị Liệu 3 - 6 Tháng:** Master Henry Phan (chuyên gia trị liệu cột sống cho BV Tâm Anh & Vinpearl) sẽ kèm cặp, kích hoạt cơ ngang bụng để tạo "đai nẹp sinh học tự nhiên" bảo vệ đĩa đệm.

👉 Tình trạng đau của bạn có lan xuống mông hay cẳng chân không? Bạn vui lòng gửi **Họ tên + Số điện thoại/Zalo** để Master Henry Phan chuẩn bị phác đồ và xếp lịch tư vấn trực tiếp cho bạn nhé!`;
  }

  // 5. NGƯỜI MỚI BẮT ĐẦU, CƠ THỂ CỨNG, CHƯA TẬP BAO GIỜ, NGƯỜI TRÊN 50 TUỔI
  if (
    lower.includes('mới') ||
    lower.includes('chưa tập') ||
    lower.includes('cơ bản') ||
    lower.includes('cứng') ||
    lower.includes('50 tuổi') ||
    lower.includes('60 tuổi') ||
    lower.includes('lớn tuổi') ||
    lower.includes('trung niên') ||
    lower.includes('bắt đầu')
  ) {
    return `Namaste bạn! Tại VICI, triết lý của Master Henry Phan là: **"Chính vì cơ thể chưa dẻo nên chúng ta mới cần đến Yoga để được mềm mại, giải tỏa áp lực và trẻ hóa xương khớp!"**

🌿 **Ưu tiên cho người mới & học viên lớn tuổi tại VICI:**
* Không có sự so sánh: Lớp tập trang bị đầy đủ dụng cụ hỗ trợ (gạch xốp, dây đai, gối nêm) giúp vào thế an toàn, tuyệt đối không ép dẻo quá sức.
* Được giáo viên nắn chỉnh từng tư thế đặt chân, bảo vệ khớp gối và học kỹ thuật thở sâu tăng cường dưỡng khí.

🎯 **Lớp học phù hợp nhất:**
* **Lớp Yoga For Newbie:** Ca sáng sớm **05:00 - 06:00** hoặc Ca tối **19:00 - 20:00 (Thứ 2 - 4 - 6)**.
* Học phí ưu đãi: Gói 3 tháng chỉ 2.550.000đ (~850k/tháng).

👉 Bạn thuận tiện tập vào khung giờ sáng sớm hay buổi tối sau giờ làm? Bạn có thể gửi **Họ tên + SĐT/Zalo** hoặc bấm [Đặt lịch hẹn] để VICI giữ chỗ trải nghiệm lớp cho bạn nhé!`;
  }

  // 6. MẤT NGỦ, STRESS, LO ÂU, CHUÔNG XOAY TÂY TẠNG
  if (
    lower.includes('mất ngủ') ||
    lower.includes('khó ngủ') ||
    lower.includes('stress') ||
    lower.includes('căng thẳng') ||
    lower.includes('chuông') ||
    lower.includes('sound healing') ||
    lower.includes('tiền đình')
  ) {
    return `Namaste bạn! Mất ngủ và lo âu kéo dài là do hệ thần kinh giao cảm bị quá tải. VICI có phương pháp chữa lành tự nhiên không dùng thuốc rất hiệu quả:

🌸 **Giải pháp tại VICI:**
* Kết hợp các tư thế phục hồi xoa dịu thần kinh (*Gác chân lên tường Viparita Karani*) với kỹ thuật thở luân phiên giúp hạ nhịp tim.
* **Sóng âm Chuông Xoay Tây Tạng Full Moon (do Master Mỹ Kiều dẫn dắt):** Tần số rung động cơ học tác động vào tế bào, đưa não bộ về sóng Alpha/Theta để tái tạo giấc ngủ sâu lành.

🎯 **Khóa học gợi ý:**
* **Lớp Yoga Tối & Chuông Xoay:** 19:00 - 20:00 (Đặc biệt tối Thứ 5).
* **Workshop Chuông Xoay Trị Liệu Cuối Tuần:** 1.200.000đ/buổi (sáng Thứ 7).

👉 Bạn bị mất ngủ hay đau đầu trong bao lâu rồi? Bạn vui lòng nhắn **Họ tên + SĐT/Zalo** để VICI gửi hướng dẫn bài thở trị liệu và xếp lịch trải nghiệm buổi chuông xoay cho bạn nhé!`;
  }

  // 7. KHÓA ASHTANGA 10 CHUYÊN ĐỀ & ĐÀO TẠO HUẤN LUYỆN VIÊN (HLV) QUỐC TẾ
  if (
    lower.includes('hlv') ||
    lower.includes('huấn luyện viên') ||
    lower.includes('đào tạo') ||
    lower.includes('chứng chỉ') ||
    lower.includes('yoga alliance') ||
    lower.includes('ashtanga') ||
    lower.includes('nâng cao')
  ) {
    const isTeacherTraining = lower.includes('hlv') || lower.includes('huấn luyện viên') || lower.includes('đào tạo') || lower.includes('chứng chỉ');

    if (isTeacherTraining) {
      return `Namaste bạn! **Khóa Đào Tạo HLV Yoga Quốc Tế E-RYT 500 / YACEP (Yoga Alliance Hoa Kỳ)** tại VICI được đào tạo trực tiếp bởi Master Henry Phan:

🎓 **Điểm nổi bật chương trình:**
* Bằng cấp có giá trị quốc tế, chứng nhận bởi Yoga Alliance Hoa Kỳ.
* Đào tạo chuyên sâu về **Giải phẫu học Cơ năng (Kinesiology)** & **Yoga Trị Liệu 6D Cột Sống** — tự tin xử lý mọi ca chấn thương của học viên.
* Nghệ thuật nắn chỉnh bằng tay (Hands-on Adjustments) an toàn và phương pháp sư phạm truyền cảm hứng.
* **Thời gian học:** 09:00 – 12:00 (Thứ 2 - 4 - 6).

👉 Bạn vui lòng để lại **Họ tên + Số điện thoại/Zalo và Email** để VICI gửi trọn bộ Brochure lộ trình đào tạo cùng chính sách học bổng tuyển sinh khóa mới nhất nhé!`;
    }

    return `Namaste bạn! **Khóa Yoga Nâng Cao Ashtanga & Năng Lượng Cột Sống (10 chuyên đề)** do đích thân Master Henry Phan giảng dạy:

🔥 **10 Chuyên đề cốt lõi:**
* Kỹ thuật mở khớp hông đa chiều, mở lưng trên Thoracic an toàn không chèn ép thắt lưng.
* Chinh phục thăng bằng tay Handstand, Pincha, Trồng chuối Sirsasana với cấu trúc đai vai vững chãi.
* **Lịch học:** 14:00 - 15:30 (Thứ 3 & Thứ 5). Học phí ưu đãi Early Bird: **1.290.000đ** (gốc 1.590.000đ).

👉 Bạn vui lòng để lại **Họ tên + SĐT/Zalo** để VICI bảo lưu mức học phí ưu đãi và giữ suất học chuyên đề cho bạn nhé!`;
  }

  // 8. BẢNG HỌC PHÍ CÁC GÓI TẬP
  if (
    lower.includes('học phí') ||
    lower.includes('giá') ||
    lower.includes('tiền') ||
    lower.includes('bao nhiêu') ||
    lower.includes('chi phí') ||
    lower.includes('gói tập')
  ) {
    return `Namaste bạn! Bảng học phí tại VICI Yoga Therapy Training Center được niêm yết công khai và minh bạch:

📋 **CÁC GÓI HỘI VIÊN CHẤT LƯỢNG CAO:**
* **Gói 3 tháng:** 2.550.000đ (~850.000đ/tháng)
* **Gói 6 tháng:** 4.800.000đ (~800.000đ/tháng)
* **Gói VIP 1 năm:** 8.000.000đ *(Tặng 01 buổi Scan Trị Liệu 650k + 01 vé Workshop Chuông Xoay 1.2tr)*

🌿 **DỊCH VỤ TRỊ LIỆU 1-1 & CHUYÊN SÂU:**
* **Scan Trị Liệu Cơ Vai Cổ Gáy 1-1 (45-60p):** 650.000đ
* **Trị Liệu Chuyên Sâu 1-1 Cá nhân hóa (60-75p):** 1.200.000đ
* **Workshop Chuông Xoay & Chánh niệm:** 1.200.000đ/buổi
* **Khóa Ashtanga 10 chuyên đề:** 1.290.000đ (Early Bird)

👉 Bạn đang quan tâm đến gói tập nào hoặc dịch vụ trị liệu 1-1? Hãy để lại **Họ tên + SĐT/Zalo** để VICI gửi ưu đãi và hỗ trợ đăng ký cho bạn nhé!`;
  }

  // 9. ĐỊA CHỈ & HƯỚNG DẪN ĐẾN STUDIO
  if (
    lower.includes('địa chỉ') ||
    lower.includes('ở đâu') ||
    lower.includes('chỗ nào') ||
    lower.includes('đường đi') ||
    lower.includes('gửi xe') ||
    lower.includes('opal')
  ) {
    return `📍 **Địa chỉ VICI Yoga Therapy Training Center:**
* **Vị trí:** Căn hộ B1-0705, Chung cư Opal Boulevard, mặt tiền đường Phạm Văn Đồng, phường An Bình, TP. Dĩ An (giáp ranh trực tiếp TP. Thủ Đức, TP. Hồ Chí Minh).
* **Tiện ích:** Có hầm gửi xe ô tô và xe máy rộng rãi, an ninh 24/7. Studio trên tầng cao thoáng mát, đón gió trời thanh tịnh, cách biệt hoàn toàn khói bụi.
* **Hotline đón khách:** **036 684 0130** (Master Henry Phan).

👉 Bạn dự định ghé thăm trung tâm vào ngày nào trong tuần? Hãy nhắn **Họ tên + SĐT/Zalo** để VICI đón tiếp và chuẩn bị không gian chu đáo nhất nhé!`;
  }

  // 10. TIỀN SỬ CHẤN THƯƠNG, GÃY TAY/CHÂN, PHẪU THUẬT, BÓ BỘT
  if (
    lower.includes('gãy') ||
    lower.includes('chấn thương') ||
    lower.includes('phẫu thuật') ||
    lower.includes('tai nạn') ||
    lower.includes('bó bột') ||
    lower.includes('đóng đinh') ||
    lower.includes('vết mổ') ||
    lower.includes('dây chằng')
  ) {
    return `Namaste bạn! Với tiền sử chấn thương hoặc gãy xương (như gãy tay/chân) đã qua một thời gian, cấu trúc xương về cơ bản đã can liền. **Bạn hoàn toàn có thể tập Yoga phục hồi trị liệu**, thậm chí Yoga là một trong những phương pháp an toàn và hiệu quả nhất để phục hồi chức năng!

🌿 **Lời khuyên chuyên môn từ Master Henry Phan:**
1. **Phục hồi tầm vận động (ROM):** Sau chấn thương và bất động lâu ngày, các nhóm cơ và bao khớp xung quanh thường bị co rút hoặc teo nhẹ. Yoga trị liệu giúp kéo giãn nhẹ nhàng và lấy lại góc cử động tự nhiên.
2. **Không ép lực tỳ đè sớm:** Tuyệt đối chưa vào các thế chống chịu toàn bộ trọng lượng cơ thể (như Plank, Chống đẩy Chaturanga, Chó úp mặt dồn lực) lên bên tay/chân từng chấn thương nếu cơ cổ tay và cẳng tay chưa đủ khỏe.
3. **Thăm khám trước khi tập:** Bạn nên tham gia 01 buổi **Scan Đánh giá tầm vận động và cơ năng 1-1** cùng Master Henry Phan để kiểm tra góc gập duỗi và thiết kế chuỗi bài tập an toàn riêng biệt.

👉 Bạn bị chấn thương ở vị trí nào và hiện tại cử động có còn cảm thấy ê buốt hay vướng khớp không?
Bạn vui lòng nhắn **Họ tên + SĐT/Zalo** để Master Henry Phan liên hệ tư vấn trực tiếp và hướng dẫn bạn cách bảo vệ khớp khi tập nhé!`;
  }

  // 11. MẶC ĐỊNH — TƯ VẤN NHANH & THU THẬP THÔNG TIN ĐẦU VÀO CHO HLV
  return `Namaste bạn! Rất vui được đồng hành cùng bạn. Tôi là **MyVici** – Trợ lý Chuyên môn của VICI Yoga Therapy do Master Henry Phan sáng lập. 🙏

🌿 **Các dịch vụ trị liệu & đào tạo cốt lõi tại VICI:**
1. **Trị liệu Phục hồi Cột sống:** Thoát vị đĩa đệm (L4-L5), thoái hóa cột sống thắt lưng, nắn chỉnh đau mỏi cổ vai gáy dân văn phòng.
2. **Yoga Cho Người Mới & Lớn Tuổi:** Các ca linh hoạt (sáng sớm 05:00, sáng 06:30, hoặc ca tối), an toàn tuyệt đối với dụng cụ hỗ trợ.
3. **Trị Liệu Chuông Xoay Himalaya:** Giải tỏa stress, giảm đau đầu và cải thiện giấc ngủ sâu.
4. **Khóa Ashtanga 10 Chuyên Đề & Đào Tạo HLV Quốc Tế E-RYT 500.**

📋 **Để Master Henry Phan và đội ngũ HLV chuẩn bị hồ sơ phác đồ phù hợp nhất theo đúng nhu cầu của bạn, bạn vui lòng chia sẻ:**
1. Bạn đang quan tâm đến cải thiện vấn đề cơ xương khớp nào (cổ vai gáy, lưng, gối) hay muốn rèn luyện vóc dáng / học nghề HLV?
2. Khung giờ bạn thuận tiện tập nhất (sáng sớm 5h, sáng 6h30/8h, chiều 14h, tan ca 17h45, tối 19h, hay cuối tuần)?
3. **Họ tên + Số điện thoại/Zalo** của bạn để HLV liên hệ tư vấn chuyên sâu 1-1 nhé!`;
}
