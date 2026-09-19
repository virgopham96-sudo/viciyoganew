import { CheckCircle2, ShieldCheck, HeartPulse, Brain, BookOpen, Smile } from 'lucide-react';

export default function Outcomes() {
  const outcomeCategories = [
    {
      icon: Brain,
      title: 'Thấu Hiểu Cơ Thể & Giải Phẫu',
      color: 'text-[#8A6437] bg-[#8A6437]/10',
      items: [
        'Hiểu rõ nguyên nhân gốc rễ các cơn đau mỏi cơ vai gáy, lưng và khớp hông',
        'Nắm bắt cơ chế vận hành của cột sống và hệ cơ xương khớp trong từng chuyển động',
        'Nhận biết các thói quen ngồi, đi đứng sai lệch để chủ động sửa lỗi hàng ngày'
      ]
    },
    {
      icon: ShieldCheck,
      title: 'Định Tuyến & Luyện Tập An Toàn',
      color: 'text-[#687B56] bg-[#687B56]/15',
      items: [
        'Loại bỏ hoàn toàn nỗi sợ chấn thương hoặc ép dẻo quá sức gây tổn thương khớp',
        'Làm chủ kỹ thuật căn chỉnh trục 6D khoa học do Master Henry Phan truyền thụ',
        'Từng bước chinh phục các tư thế uốn lưng, thăng bằng và đảo ngược vững chãi'
      ]
    },
    {
      icon: HeartPulse,
      title: 'Phục Hồi Tự Nhiên & Giấc Ngủ',
      color: 'text-[#D69A2D] bg-[#D69A2D]/15',
      items: [
        'Giải phóng 70 - 90% cảm giác căng cứng bả vai và đau nhức đốt sống sau lộ trình',
        'Kích hoạt hệ thần kinh phó giao cảm thông qua thở Pranayama và chuông xoay',
        'Cải thiện chất lượng giấc ngủ, ngủ sâu hơn và thức dậy tràn đầy năng lượng'
      ]
    },
    {
      icon: BookOpen,
      title: 'Năng Lực Tự Chăm Sóc & Giảng Dạy',
      color: 'text-[#8A6437] bg-[#8A6437]/10',
      items: [
        'Sở hữu bộ bài tập duy trì tại nhà/văn phòng trong 5 - 15 phút mỗi ngày',
        'Đối với học viên HLV: Tự tin thiết kế giáo án trị liệu và giảng dạy chuẩn quốc tế',
        'Nhận chứng nhận uy tín từ VICI Yoga Therapy Training Center'
      ]
    }
  ];

  return (
    <section className="py-20 bg-[#F8F5EE] border-t border-[#E8DFC8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8A6437]/10 text-[#8A6437] text-xs font-semibold uppercase tracking-wider mb-3">
            <Smile className="w-3.5 h-3.5" />
            <span>Giá trị thực chất</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#252822] font-serif-display mb-4">
            Bạn Nhận Được Gì Sau Chương Trình?
          </h2>
          <p className="text-base text-[#5A5F52] leading-relaxed">
            Không chỉ là những buổi tập thể dục thông thường — VICI mang đến cho bạn sự hiểu biết sâu sắc về cơ thể, phương pháp trị liệu khoa học và sự chuyển hóa từ bên trong.
          </p>
        </div>

        {/* Mobile Swipe Guidance Notice */}
        <div className="md:hidden flex items-center justify-between text-xs text-[#717769] mb-3 px-1">
          <span className="font-medium">4 giá trị chuyển hóa cốt lõi</span>
          <span className="text-[11px] bg-[#FFFDF8] px-2 py-0.5 rounded-full border border-[#E8DFC8]">
            ← Vuốt ngang →
          </span>
        </div>

        {/* 4 Outcome Columns: Horizontal Swipe / Snap on Mobile, Grid on Tablet & Desktop */}
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 pb-4 md:pb-0">
          {outcomeCategories.map((cat, idx) => {
            const IconComponent = cat.icon;
            return (
              <div
                key={idx}
                className="w-[82vw] sm:w-[320px] md:w-auto shrink-0 md:shrink snap-center bg-[#FFFDF8] rounded-3xl p-6 sm:p-7 border border-[#E8DFC8] shadow-2xs hover:shadow-md hover:border-[#8A6437] transition-all flex flex-col"
              >
                <div className={`w-12 h-12 rounded-2xl ${cat.color} flex items-center justify-center mb-5 shrink-0`}>
                  <IconComponent className="w-6 h-6" />
                </div>

                <h3 className="text-lg font-bold text-[#252822] font-serif-display mb-4">
                  {cat.title}
                </h3>

                <ul className="space-y-3 flex-grow text-xs sm:text-[13px] text-[#555A4E]">
                  {cat.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#687B56] shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
