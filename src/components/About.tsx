import { Target, Compass, HeartHandshake, Sparkles } from 'lucide-react';
import { VICI_INFO, VICI_ASSETS } from '../data/viciData';

export default function About() {
  return (
    <section id="about" className="py-20 bg-[#FFFDF8] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D69A2D]/10 text-[#A66F17] text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Câu chuyện thương hiệu</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#252822] font-serif-display mb-4">
            Về VICI Yoga Therapy Training Center
          </h2>
          <p className="text-base text-[#5A5F52] leading-relaxed">
            Hành trình kiến tạo Yoga xanh, thấu hiểu cơ thể và mang lại giá trị phục hồi thể chất lẫn tinh thần đích thực cho cộng đồng.
          </p>
        </div>

        {/* Brand Origin & Logo Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16 bg-[#F8F5EE] rounded-3xl p-8 sm:p-12 border border-[#E8DFC8]">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-block text-xs font-bold uppercase tracking-widest text-[#8A6437] pb-1 border-b-2 border-[#D69A2D]">
              Ý nghĩa tên gọi & Biểu tượng tổ ong
            </div>
            <h3 className="text-2xl font-bold text-[#252822] font-serif-display">
              Từ quê hương Vinh City đến khát vọng kiến tạo giá trị thâm sâu vươn ra thế giới
            </h3>
            <p className="text-[#555A4E] leading-relaxed text-sm sm:text-base">
              <strong>"Vici"</strong> là viết tắt của <strong>Vinh City</strong> — vùng đất quê hương gắn liền với hành trình trưởng thành và tu tập của Yogi Henry Phan (Hùng Phan). Sau những năm tháng tu học sâu tại cái nôi Yoga Ấn Độ và Rishikesh, thầy đã mang theo lý tưởng trở về phụng sự cộng đồng Việt.
            </p>
            <p className="text-[#555A4E] leading-relaxed text-sm sm:text-base">
              <strong>Logo hình tổ ong</strong> được lấy cảm hứng từ chữ <strong>K</strong> (trong tên <em>Kiều Hùng</em>, vợ của Henry Hùng Phan cũng là một Master Yoga) tạo thành hình lục giác. Tổ ong mang ý nghĩa xây dựng những giá trị thâm sâu, bền bỉ và khát vọng vươn ra thế giới bằng sự gắn kết hữu cơ, trật tự tự nhiên và sự ngọt lành của mật hoa.
            </p>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="rounded-2xl overflow-hidden shadow-lg border border-[#E8DFC8] aspect-[4/3] relative">
              <img
                src={VICI_ASSETS.vuonOng.primary}
                alt="Không gian Vườn Ong Xóm Lá VICI"
                className="w-full h-full object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white text-xs">
                <p className="font-semibold text-amber-300">Không gian Vườn Ong Xóm Lá</p>
                <p className="opacity-90">Nơi kết nối thiên nhiên và hành trình chữa lành thân tâm</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Pillars: Vision, Mission, Core Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Tầm nhìn */}
          <div className="bg-[#FFFDF8] rounded-2xl p-7 border border-[#E8DFC8] shadow-2xs hover:border-[#D69A2D] transition-all flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-[#D69A2D]/10 text-[#D69A2D] flex items-center justify-center mb-5">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#252822] font-serif-display mb-3">
              Tầm Nhìn
            </h3>
            <p className="text-sm text-[#555A4E] leading-relaxed flex-grow">
              {VICI_INFO.vision}
            </p>
          </div>

          {/* Sứ mệnh */}
          <div className="bg-[#FFFDF8] rounded-2xl p-7 border border-[#E8DFC8] shadow-2xs hover:border-[#D69A2D] transition-all flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-[#8A6437]/10 text-[#8A6437] flex items-center justify-center mb-5">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#252822] font-serif-display mb-3">
              Sứ Mệnh
            </h3>
            <p className="text-sm text-[#555A4E] leading-relaxed flex-grow">
              {VICI_INFO.mission}
            </p>
          </div>

          {/* Giá trị cốt lõi */}
          <div className="bg-[#FFFDF8] rounded-2xl p-7 border border-[#E8DFC8] shadow-2xs hover:border-[#D69A2D] transition-all flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-[#687B56]/15 text-[#687B56] flex items-center justify-center mb-5">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#252822] font-serif-display mb-3">
              Giá Trị Cốt Lõi
            </h3>
            <ul className="text-xs sm:text-sm text-[#555A4E] space-y-2 flex-grow">
              {VICI_INFO.coreValues.map((val, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#D69A2D] font-bold">•</span>
                  <span>
                    <strong className="text-[#252822]">{val.title}:</strong> {val.description}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
