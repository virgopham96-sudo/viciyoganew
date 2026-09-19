import { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';
import { VICI_FAQ } from '../data/viciData';

interface FAQProps {
  onOpenAIChat: (questionTopic?: string) => void;
}

export default function FAQ({ onOpenAIChat }: FAQProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 bg-[#F8F5EE] border-t border-[#E8DFC8]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8A6437]/10 text-[#8A6437] text-xs font-semibold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Giải đáp thắc mắc</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#252822] font-serif-display mb-3">
            Câu Hỏi Thường Gặp
          </h2>
          <p className="text-sm text-[#5A5F52]">
            Những thắc mắc phổ biến nhất của học viên khi tìm hiểu và bắt đầu hành trình tại VICI.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {VICI_FAQ.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={faq.id}
                className="bg-[#FFFDF8] rounded-2xl border border-[#E8DFC8] overflow-hidden transition-all shadow-2xs"
              >
                <button
                  id={`faq-toggle-btn-${faq.id}`}
                  onClick={() => toggle(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#FAF7F0] transition-colors"
                >
                  <span className="text-sm sm:text-base font-bold text-[#252822] font-serif-display">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-[#8A6437] text-white' : 'bg-[#F4EADA] text-[#8A6437]'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 sm:pb-6 pt-1 text-xs sm:text-sm text-[#555A4E] leading-relaxed border-t border-[#F0E8D7] bg-[#FDFBF7] animate-in fade-in-50 duration-200">
                    <p>{faq.answer}</p>
                    <div className="mt-3 pt-2 flex justify-end">
                      <button
                        onClick={() => onOpenAIChat(`Tư vấn chi tiết câu hỏi: ${faq.question}`)}
                        className="inline-flex items-center gap-1 text-xs text-[#D69A2D] hover:text-[#B87A14] font-medium cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Hỏi sâu hơn với MyVici</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Extra Help Callout */}
        <div className="mt-12 text-center text-xs text-[#717769]">
          <span>Bạn có câu hỏi chuyên biệt về bệnh lý cột sống? </span>
          <button
            onClick={() => onOpenAIChat('Tôi muốn tư vấn về tình trạng bệnh lý cột sống')}
            className="text-[#8A6437] font-bold hover:underline cursor-pointer ml-1"
          >
            Trò chuyện ngay với MyVici
          </button>
        </div>
      </div>
    </section>
  );
}
