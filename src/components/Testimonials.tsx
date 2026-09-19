import { Star, Quote, Sparkles, CheckCircle2, ChevronRight, UserCheck } from 'lucide-react';
import { VICI_FEEDBACKS } from '../data/viciData';

interface TestimonialsProps {
  onOpenRegister?: (courseName?: string) => void;
}

export default function Testimonials({ onOpenRegister }: TestimonialsProps) {
  return (
    <section id="feedback" className="py-20 bg-[#FAF7F0] border-t border-[#E8DFC8] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D69A2D]/15 text-[#9E6910] text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cảm nhận học viên</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#252822] font-serif-display mb-4">
            Câu Chuyện Chuyển Hóa Cùng VICI
          </h2>
          <p className="text-base text-[#5A5F52] leading-relaxed">
            Hơn 1.200+ học viên đã phục hồi thành công các vấn đề cơ xương khớp và tìm lại sự an yên trong tâm hồn cùng các chuyên gia VICI Yoga Therapy.
          </p>
        </div>

        {/* Mobile Swipe Notice */}
        <div className="md:hidden flex items-center justify-between text-xs text-[#717769] mb-3 px-1">
          <span className="font-medium">Feedback thực tế từ học viên</span>
          <span className="text-[11px] bg-[#FFFDF8] px-2 py-0.5 rounded-full border border-[#E8DFC8]">
            ← Vuốt ngang ({VICI_FEEDBACKS.length}) →
          </span>
        </div>

        {/* Feedback Cards: Horizontal Snap Carousel on Mobile, Responsive Multi-Column on Desktop */}
        <div className="flex md:grid md:grid-cols-3 gap-5 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 pb-4 md:pb-0 mb-10">
          {VICI_FEEDBACKS.map((fb) => (
            <div
              key={fb.id}
              className="w-[84vw] sm:w-[350px] md:w-auto shrink-0 md:shrink snap-center bg-[#FFFDF8] rounded-3xl p-6 sm:p-7 border border-[#E8DFC8] shadow-2xs hover:shadow-md hover:border-[#D69A2D] transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header Rating & Quote icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-[#D69A2D]">
                    {[...Array(fb.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-[#E0D5BE] group-hover:text-[#D69A2D] transition-colors" />
                </div>

                {/* Highlight Improvement Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold mb-3">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="line-clamp-1">{fb.improvement}</span>
                </div>

                {/* Comment Text */}
                <p className="text-xs sm:text-[13px] text-[#4A4E44] leading-relaxed mb-4 italic line-clamp-4">
                  "{fb.comment}"
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {fb.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-[#FAF7F0] text-[#717769] text-[10px] font-medium border border-[#E8DFC8]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-[#F0E8D7] flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#252822] font-serif-display">
                    {fb.name}
                  </h4>
                  <p className="text-[11px] text-[#717769]">
                    {fb.role}
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-[#8A6437] max-w-[130px] truncate text-right">
                  {fb.course}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        {onOpenRegister && (
          <div className="bg-[#FFFDF8] rounded-2xl border border-[#E8DFC8] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#D69A2D]/15 text-[#9E6910] flex items-center justify-center shrink-0">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-[#252822] font-serif-display">
                  Sẵn sàng bắt đầu hành trình chuyển hóa của riêng bạn?
                </h4>
                <p className="text-xs sm:text-sm text-[#5A5F52]">
                  Đăng ký ngay buổi trải nghiệm scan kiểm tra cơ thể 1-1 miễn phí hoặc đặt lịch học thử.
                </p>
              </div>
            </div>

            <button
              id="feedback-cta-register-btn"
              onClick={() => onOpenRegister('Đăng ký trải nghiệm phác đồ trị liệu')}
              className="min-h-[44px] px-6 py-3 rounded-full bg-[#D69A2D] hover:bg-[#B87A14] text-white font-bold text-xs sm:text-sm shadow-xs active:scale-98 transition-all cursor-pointer shrink-0 flex items-center gap-2"
            >
              <span>Đặt lịch trải nghiệm ngay</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
