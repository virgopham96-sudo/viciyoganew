import { Sparkles, ArrowRight, ShieldCheck, HeartPulse, Award, Compass } from 'lucide-react';
import { VICI_ASSETS } from '../data/viciData';

interface HeroProps {
  onOpenAIChat: () => void;
  onOpenRegister: () => void;
}

export default function Hero({ onOpenAIChat, onOpenRegister }: HeroProps) {
  const scrollToCourses = () => {
    const el = document.querySelector('#courses');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
      {/* Subtle organic background ambient glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-[#EEDDC0]/40 via-[#F7F2E7]/20 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Typography & Conversion Action */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Trust Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFE7D5] border border-[#DFCFAE] text-[#8A6437] text-xs sm:text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-[#D69A2D] animate-pulse" />
              <span>Yoga Trị Liệu & Phục Hồi Chuẩn Quốc Tế E-RYT 500</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-bold text-[#252822] leading-[1.2] tracking-tight font-serif-display mb-5">
              Thấu hiểu cơ thể. <br />
              <span className="text-[#8A6437] font-semibold">Chuyển hóa</span> từ bên trong.
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-[#555A4E] leading-relaxed max-w-2xl mb-8">
              VICI Yoga Therapy Training Center đồng hành cùng bạn trên hành trình luyện tập, 
              thấu hiểu cơ thể và phục hồi tự nhiên một cách khoa học, bền vững. 
              Không ép dẻo sai trục — mỗi phác đồ là một sự nâng niu trọn vẹn.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto mb-6">
              <button
                id="hero-explore-courses-btn"
                onClick={scrollToCourses}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#D69A2D] text-white font-semibold text-sm sm:text-base hover:bg-[#B87A14] shadow-md hover:shadow-lg transition-all cursor-pointer group"
              >
                <span>Khám phá khóa học</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="hero-ai-advisor-btn"
                onClick={onOpenAIChat}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#FFFDF8] text-[#8A6437] font-semibold text-sm sm:text-base border border-[#DFCFAE] hover:border-[#D69A2D] hover:bg-[#F9F5EC] transition-all cursor-pointer shadow-2xs"
              >
                <Sparkles className="w-4 h-4 text-[#D69A2D]" />
                <span>Tư Vấn Cùng MyVici</span>
              </button>
            </div>

            {/* Mobile Quick Action Pills */}
            <div className="w-full mb-8 lg:hidden">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar text-xs font-semibold text-[#8A6437]">
                <a
                  href="#therapy-sop"
                  className="px-3 py-1.5 rounded-full bg-[#F4EADA] border border-[#DFCFAE] shrink-0 whitespace-nowrap active:scale-95"
                >
                  🌿 Liệu trình Cột Sống
                </a>
                <a
                  href="#schedule"
                  className="px-3 py-1.5 rounded-full bg-[#F4EADA] border border-[#DFCFAE] shrink-0 whitespace-nowrap active:scale-95"
                >
                  📅 Lịch Học Tuần
                </a>
                <a
                  href="#courses"
                  className="px-3 py-1.5 rounded-full bg-[#F4EADA] border border-[#DFCFAE] shrink-0 whitespace-nowrap active:scale-95"
                >
                  💰 Bảng Học Phí
                </a>
                <a
                  href="https://zalo.me/0366840130"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-full bg-blue-50 text-[#0068FF] border border-blue-200 shrink-0 whitespace-nowrap active:scale-95"
                >
                  💬 Zalo Bác Sĩ / HLV
                </a>
              </div>
            </div>

            {/* Trust Badges Row */}
            <div className="pt-6 border-t border-[#E8DFC8] grid grid-cols-2 sm:grid-cols-3 gap-4 w-full text-xs text-[#555A4E]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-full bg-[#8A6437]/10 text-[#8A6437]">
                  <Award className="w-4 h-4" />
                </div>
                <span>E-RYT 500 & YACEP Yoga Alliance</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-full bg-[#8A6437]/10 text-[#8A6437]">
                  <HeartPulse className="w-4 h-4" />
                </div>
                <span>Trị liệu cột sống cho nhân sự nội bộ BV Tâm Anh & Vinpearl</span>
              </div>

              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <div className="p-1.5 rounded-full bg-[#8A6437]/10 text-[#8A6437]">
                  <Compass className="w-4 h-4" />
                </div>
                <span>Quy trình SOP 4 Bước Cá Nhân Hóa</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer decorative ring */}
              <div className="absolute -inset-3 bg-gradient-to-tr from-[#D69A2D]/20 via-[#8A6437]/10 to-transparent rounded-3xl -rotate-1 -z-10" />

              {/* Main Image Container */}
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-[#E8DFC8] bg-white aspect-[4/5] sm:aspect-[3/4]">
                <img
                  src={VICI_ASSETS.henry.primary}
                  alt="Master Henry Phan - Founder VICI Yoga Therapy"
                  className="w-full h-full object-cover object-center"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />

                {/* Gradient overlay for text contrast at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Floating caption card */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-white/40 shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-[#D69A2D] uppercase tracking-wider">
                        Người sáng lập VICI
                      </p>
                      <h4 className="text-base font-bold text-[#252822]">
                        Master Henry Phan (Yogi Hùng Phan)
                      </h4>
                      <p className="text-xs text-[#6B7260] mt-0.5">
                        International Master Yoga • Giảng viên Bệnh viện Tâm Anh & Vinpearl
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Small floating badge */}
              <div className="absolute -top-3 left-3 sm:-top-4 sm:-left-4 bg-[#FFFDF8]/95 backdrop-blur-md border border-[#E8DFC8] px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl shadow-md flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#D69A2D]" />
                <div className="text-left">
                  <p className="text-[10px] sm:text-[11px] font-bold text-[#252822]">52+ Ca Trị Liệu</p>
                  <p className="text-[9px] sm:text-[10px] text-[#717769]">Hệ cơ xương khớp</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
