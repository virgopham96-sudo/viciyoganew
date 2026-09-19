import { useState } from 'react';
import { Award, ArrowRight, Sparkles, UserCheck } from 'lucide-react';
import { VICI_TRAINERS } from '../data/viciData';
import { Trainer } from '../types';
import TrainerModal from './TrainerModal';

interface TrainersProps {
  onOpenRegister: (courseOrTrainer?: string) => void;
}

export default function Trainers({ onOpenRegister }: TrainersProps) {
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);

  return (
    <section id="trainers" className="py-20 bg-[#FFFDF8] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8A6437]/10 text-[#8A6437] text-xs font-semibold uppercase tracking-wider mb-3">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Đội ngũ chuyên gia VICI</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#252822] font-serif-display mb-4">
            Người Đồng Hành Cùng Bạn
          </h2>
          <p className="text-base text-[#5A5F52] leading-relaxed">
            Được dẫn dắt trực tiếp bởi Master Henry Phan và đội ngũ giảng viên tận tâm, sở hữu chứng nhận quốc tế E-RYT 500 và kinh nghiệm giảng dạy y tế chuyên sâu.
          </p>
        </div>

        {/* Mobile Swipe Notice */}
        <div className="md:hidden flex items-center justify-between text-xs text-[#717769] mb-3 px-1">
          <span className="font-medium">Đội ngũ {VICI_TRAINERS.length} Huấn luyện viên Master</span>
          <span className="text-[11px] bg-[#FFFDF8] px-2 py-0.5 rounded-full border border-[#E8DFC8]">
            ← Vuốt ngang →
          </span>
        </div>

        {/* Trainers: Horizontal Swipe / Snap on Mobile, Grid on Tablet & Desktop */}
        <div className="flex md:grid md:grid-cols-3 gap-5 md:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 pb-4 md:pb-0">
          {VICI_TRAINERS.map((trainer) => (
            <div
              key={trainer.id}
              className="w-[82vw] sm:w-[340px] md:w-auto shrink-0 md:shrink snap-center bg-[#FBF9F4] rounded-3xl border border-[#E8DFC8] overflow-hidden shadow-2xs hover:shadow-md hover:border-[#D69A2D] transition-all flex flex-col group"
            >
              {/* Photo Area */}
              <div className="relative aspect-[4/4] overflow-hidden bg-[#EFE7D5]">
                <img
                  src={trainer.photoUrl}
                  alt={trainer.name}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#E5B25D] block">
                    {trainer.title}
                  </span>
                  <h3 className="text-xl font-bold font-serif-display">
                    {trainer.name}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-grow space-y-4">
                <p className="text-xs font-semibold text-[#8A6437]">
                  {trainer.role}
                </p>

                {trainer.quote && (
                  <p className="text-xs italic text-[#555A4E] leading-relaxed bg-[#FFFDF8] p-3 rounded-xl border border-[#E8DFC8]">
                    {trainer.quote}
                  </p>
                )}

                {/* Specialties tags */}
                <div className="space-y-1.5 flex-grow">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#717769]">
                    Thế mạnh chuyên môn:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {trainer.specialties.map((spec, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md bg-[#FFFDF8] border border-[#E0D5BE] text-[11px] text-[#4A4E44]"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action Button: Minimum 44px touch height */}
                <div className="pt-2 border-t border-[#E8DFC8]">
                  <button
                    id={`trainer-view-profile-${trainer.id}-btn`}
                    onClick={() => setSelectedTrainer(trainer)}
                    className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#FFFDF8] border border-[#D5C7AA] hover:border-[#8A6437] text-xs font-bold text-[#8A6437] hover:bg-[#F4EADA]/60 transition-all cursor-pointer active:scale-98"
                  >
                    <span>Xem hồ sơ chi tiết</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trainer Profile Modal */}
      <TrainerModal
        trainer={selectedTrainer}
        onClose={() => setSelectedTrainer(null)}
        onRegisterWithTrainer={(tName) => onOpenRegister(tName)}
      />
    </section>
  );
}
