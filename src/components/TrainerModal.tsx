import { useEffect } from 'react';
import { X, Award, MapPin, ExternalLink, CheckCircle2, Shield } from 'lucide-react';
import { Trainer } from '../types';

interface TrainerModalProps {
  trainer: Trainer | null;
  onClose: () => void;
  onRegisterWithTrainer: (trainerName: string) => void;
}

export default function TrainerModal({ trainer, onClose, onRegisterWithTrainer }: TrainerModalProps) {
  // Handle Escape key to close modal
  useEffect(() => {
    if (!trainer) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [trainer, onClose]);

  if (!trainer) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-[#FFFDF8] w-full max-w-2xl rounded-3xl shadow-2xl border border-[#E8DFC8] overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-r from-[#F4EADA] to-[#FAF7F0] border-b border-[#E8DFC8] flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-white shadow-sm shrink-0">
              <img
                src={trainer.photoUrl}
                alt={trainer.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8A6437] uppercase tracking-wider mb-1">
                <Shield className="w-3.5 h-3.5 text-[#D69A2D]" />
                <span>Hồ sơ chuyên gia</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#252822] font-serif-display">
                {trainer.name}
              </h3>
              {trainer.realName && (
                <p className="text-xs text-[#717769]">Tên thật: {trainer.realName}</p>
              )}
              <p className="text-xs sm:text-sm font-semibold text-[#8A6437] mt-0.5">
                {trainer.role}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className="hidden sm:inline-block text-[10px] bg-black/5 text-[#555A4E] px-1.5 py-0.5 rounded border border-[#D5C7AA]/50 font-mono select-none"
              title="Nhấn phím Esc để đóng"
            >
              Esc
            </span>
            <button
              id="trainer-modal-close-btn"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-black/5 text-[#555A4E] transition-colors cursor-pointer"
              aria-label="Đóng (Phím Esc)"
              title="Đóng (Phím Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-[#4A4E44] text-sm">
          {/* Quote */}
          {trainer.quote && (
            <div className="p-4 rounded-2xl bg-[#F8F5EE] border-l-4 border-[#D69A2D] italic text-xs sm:text-sm text-[#464A40] leading-relaxed">
              {trainer.quote}
            </div>
          )}

          {/* Bio */}
          <div>
            <h4 className="text-sm font-bold text-[#252822] uppercase tracking-wider mb-2">
              Giới thiệu chuyên môn
            </h4>
            <p className="text-xs sm:text-sm leading-relaxed text-[#555A4E]">
              {trainer.bio}
            </p>
          </div>

          {/* Teaching experience / locations */}
          {trainer.teachingLocations && trainer.teachingLocations.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-[#252822] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#D69A2D]" />
                <span>Kinh nghiệm giảng dạy thực tế</span>
              </h4>
              <ul className="space-y-2">
                {trainer.teachingLocations.map((loc, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-[13px] bg-[#F8F5EE] p-3 rounded-xl border border-[#E8DFC8]">
                    <CheckCircle2 className="w-4 h-4 text-[#687B56] shrink-0 mt-0.5" />
                    <span>{loc}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Credentials */}
          <div>
            <h4 className="text-sm font-bold text-[#252822] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#D69A2D]" />
              <span>Bằng cấp & Chứng chỉ quốc tế</span>
            </h4>
            <div className="space-y-2">
              {trainer.credentials.map((cred, i) => (
                <div key={i} className="flex items-start gap-2 text-xs sm:text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D69A2D] mt-2 shrink-0" />
                  <span>{cred}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Social links */}
          {trainer.socials && (
            <div className="pt-4 border-t border-[#E8DFC8] flex flex-wrap items-center gap-3">
              <span className="text-xs font-semibold text-[#717769]">Kênh kết nối:</span>
              {trainer.socials.facebook && (
                <a
                  href={trainer.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#EFE7D5] text-[#8A6437] text-xs font-medium hover:bg-[#E5D7BE]"
                >
                  <span>Facebook</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {trainer.socials.tiktok && (
                <a
                  href={trainer.socials.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#EFE7D5] text-[#8A6437] text-xs font-medium hover:bg-[#E5D7BE]"
                >
                  <span>TikTok</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {trainer.socials.instagram && (
                <a
                  href={trainer.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#EFE7D5] text-[#8A6437] text-xs font-medium hover:bg-[#E5D7BE]"
                >
                  <span>Instagram</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-[#FAF7F0] border-t border-[#E8DFC8] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full border border-[#D5C7AA] text-xs font-semibold text-[#555A4E] hover:bg-white cursor-pointer"
          >
            Đóng
          </button>
          <button
            onClick={() => {
              onClose();
              onRegisterWithTrainer(`Tập cùng ${trainer.name}`);
            }}
            className="px-6 py-2.5 rounded-full bg-[#D69A2D] text-white text-xs font-semibold hover:bg-[#B87A14] shadow-xs cursor-pointer"
          >
            Đăng ký học cùng {trainer.name}
          </button>
        </div>
      </div>
    </div>
  );
}
