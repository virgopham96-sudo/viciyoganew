import { Sparkles, Calendar, CalendarCheck, Bot } from 'lucide-react';
import ZaloIcon from './ZaloIcon';
import { VICI_INFO } from '../data/viciData';

interface MobileBottomBarProps {
  onOpenAIChat: () => void;
  onOpenRegister: () => void;
}

export default function MobileBottomBar({ onOpenAIChat, onOpenRegister }: MobileBottomBarProps) {
  const scrollToSchedule = () => {
    const el = document.querySelector('#schedule');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const rawPhone = VICI_INFO.hotline.replace(/\s/g, '');

  return (
    <aside
      id="mobile-sticky-bottom-bar"
      aria-label="Thanh điều hướng cố định dưới đáy màn hình"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFDF8]/95 backdrop-blur-lg border-t border-[#E8DFC8] shadow-[0_-6px_25px_rgba(0,0,0,0.09)] px-3 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
    >
      <div className="max-w-md mx-auto flex flex-col gap-1.5">
        {/* Top Mini Quick Utility Row: AI Chat & Xem Lịch Học (Thumb-friendly >= 44px) */}
        <div className="flex items-center justify-between gap-2 px-1 text-xs">
          <button
            id="mobile-bottom-ai-pill-btn"
            onClick={onOpenAIChat}
            className="min-h-[44px] flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF7F0] border border-[#E8DFC8] text-[#8A6437] font-semibold text-[11px] active:scale-97 transition-all cursor-pointer"
            aria-label="Tư vấn phác đồ nhanh cùng trợ lý MyVici"
          >
            <span className="relative flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-[#D69A2D]" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </span>
            <span>Hỏi AI MyVici</span>
          </button>

          <button
            id="mobile-bottom-schedule-pill-btn"
            onClick={scrollToSchedule}
            className="min-h-[44px] flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF7F0] border border-[#E8DFC8] text-[#555A4E] hover:text-[#8A6437] font-semibold text-[11px] active:scale-97 transition-all cursor-pointer"
            aria-label="Cuộn đến thời khóa biểu tuần"
          >
            <Calendar className="w-3.5 h-3.5 text-[#8A6437]" />
            <span>Xem lịch học tuần</span>
          </button>
        </div>

        {/* Primary 2-Action Row: 1. Đặt lịch tập thử (Nổi bật, primary) & 2. Nhắn tin Zalo (Thao tác chạm >= 48px) */}
        <div className="grid grid-cols-5 gap-2 items-center">
          {/* Action 1: Nhắn tin Zalo (2 columns) */}
          <a
            id="mobile-bottom-zalo-primary-btn"
            href={`https://zalo.me/${rawPhone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="col-span-2 min-h-[48px] h-12 flex items-center justify-center gap-2 px-3 rounded-2xl bg-[#0068FF]/10 border border-[#0068FF]/30 text-[#0068FF] font-bold text-xs sm:text-sm active:bg-[#0068FF]/20 active:scale-98 transition-all cursor-pointer shadow-2xs"
            aria-label="Nhắn tin Zalo với chuyên gia VICI"
          >
            <ZaloIcon size={20} className="shrink-0" />
            <span className="truncate">Nhắn tin Zalo</span>
          </a>

          {/* Action 2: Đặt lịch tập thử (3 columns - PROMINENT) */}
          <button
            id="mobile-bottom-book-trial-primary-btn"
            onClick={onOpenRegister}
            className="col-span-3 min-h-[48px] h-12 flex items-center justify-center gap-2 px-4 rounded-2xl bg-gradient-to-r from-[#D69A2D] to-[#B87A14] text-white font-bold text-xs sm:text-sm shadow-md hover:brightness-105 active:scale-98 transition-all cursor-pointer"
            aria-label="Đặt lịch tập thử yoga trị liệu miễn phí"
          >
            <CalendarCheck className="w-4 h-4 shrink-0 text-amber-100" />
            <span className="truncate tracking-wide">Đặt lịch tập thử</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-md uppercase font-extrabold text-white">
              Free
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}

