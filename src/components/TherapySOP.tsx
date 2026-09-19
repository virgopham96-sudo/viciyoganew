import { Activity, ShieldAlert, CheckCircle2, Calendar, ArrowRight } from 'lucide-react';
import { THERAPY_SOP_STEPS, VICI_INFO } from '../data/viciData';

interface TherapySOPProps {
  onOpenRegister: (courseName?: string) => void;
}

export default function TherapySOP({ onOpenRegister }: TherapySOPProps) {
  return (
    <section id="therapy-sop" className="py-20 bg-[#F8F5EE] border-t border-[#E8DFC8] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#687B56]/15 text-[#4D603B] text-xs font-semibold uppercase tracking-wider mb-3">
            <Activity className="w-3.5 h-3.5" />
            <span>Phương pháp khoa học</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#252822] font-serif-display mb-4">
            Quy Trình Trị Liệu Chuẩn 4 Bước (SOP)
          </h2>
          <p className="text-base text-[#5A5F52] leading-relaxed">
            Mỗi cơ thể là một bản đồ vận động riêng biệt. VICI xây dựng phác đồ cá nhân hóa dựa trên sự lắng nghe, đo đạc chỉ số chính xác và căn chỉnh an toàn.
          </p>
        </div>

        {/* 4 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {THERAPY_SOP_STEPS.map((step) => (
            <div
              key={step.step}
              className="bg-[#FFFDF8] rounded-2xl p-6 border border-[#E8DFC8] shadow-2xs hover:shadow-md hover:border-[#D69A2D] transition-all flex flex-col relative"
            >
              {/* Step number badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-black text-[#D69A2D]/40 font-serif-display">
                  {step.step}
                </span>
                <span className="w-8 h-8 rounded-full bg-[#D69A2D]/10 text-[#8A6437] flex items-center justify-center text-xs font-bold">
                  B{parseInt(step.step)}
                </span>
              </div>

              <h3 className="text-lg font-bold text-[#252822] mb-1">
                {step.name}
              </h3>
              <p className="text-xs font-semibold text-[#8A6437] mb-3">
                {step.subTitle}
              </p>

              <p className="text-xs sm:text-sm text-[#555A4E] leading-relaxed mb-4 flex-grow">
                {step.description}
              </p>

              <div className="pt-3 border-t border-[#F0E8D7] text-xs text-[#4E5446] flex items-start gap-2 bg-[#FAF7F0] -mx-6 -mb-6 p-4 rounded-b-2xl">
                <CheckCircle2 className="w-4 h-4 text-[#687B56] shrink-0 mt-0.5" />
                <span>
                  <strong>Hiệu quả:</strong> {step.benefit}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick CTA Box */}
        <div className="bg-[#FFFDF8] rounded-2xl p-8 border border-[#E8DFC8] flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm mb-12">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl font-bold text-[#252822] font-serif-display">
              Bắt đầu bằng một buổi Scan Trị liệu chuyên sâu
            </h3>
            <p className="text-sm text-[#555A4E]">
              Thời lượng 45 - 60 phút. Master trực tiếp kiểm tra góc lệch trục, biên độ cơ khớp và đề xuất phác đồ.
            </p>
          </div>

          <button
            id="therapy-book-scan-btn"
            onClick={() => onOpenRegister('Scan Trị Liệu Cơ - Vai - Cổ - Gáy (650.000đ)')}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#8A6437] text-white font-semibold text-sm hover:bg-[#6F4E27] shadow-sm transition-all shrink-0 cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Đặt lịch Scan Trị liệu (650k)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Medical Disclaimer Box (Mandatory & Crucial) */}
        <div className="rounded-2xl p-6 bg-amber-50/80 border border-amber-200/80 text-[#5F4E27]">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-[#D69A2D] shrink-0 mt-0.5" />
            <div className="text-xs sm:text-[13px] leading-relaxed">
              <h4 className="font-bold text-[#4B3B18] uppercase tracking-wider mb-1">
                Tuyên Bố Miễn Trừ Y Tế (Medical Disclaimer)
              </h4>
              <p>{VICI_INFO.medicalDisclaimer}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
