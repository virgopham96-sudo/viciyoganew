import { CheckCircle2, Shield } from 'lucide-react';
import { VICI_STATS } from '../data/viciData';

export default function Stats() {
  return (
    <section className="relative py-12 bg-[#F4EADA]/50 border-y border-[#E8DFC8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#8A6437] mb-1">
              <Shield className="w-3.5 h-3.5 text-[#D69A2D]" />
              <span>Số liệu xác thực từ VICI Yoga Therapy</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#252822] font-serif-display">
              Năng Lực & Minh Chứng Thực Chiến
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[#63685C] max-w-md">
            Hành trình đồng hành cùng học viên, y bác sĩ và các doanh nghiệp trên khắp cả nước với phương pháp Yoga Trị liệu chuẩn hóa.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {VICI_STATS.map((stat, idx) => (
            <div
              key={idx}
              className="bg-[#FFFDF8] rounded-xl p-5 border border-[#E8DFC8] shadow-2xs hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl sm:text-4xl font-bold text-[#8A6437] font-serif-display tracking-tight">
                  {stat.value}
                </span>
                <CheckCircle2 className="w-4 h-4 text-[#D69A2D]" />
              </div>
              <h4 className="text-sm font-semibold text-[#252822] mb-1">
                {stat.label}
              </h4>
              <p className="text-xs text-[#717769] leading-relaxed">
                {stat.subLabel}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
