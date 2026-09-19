import { useEffect } from 'react';
import { X, CheckCircle2, Clock, Calendar, Users, Award, Shield, ArrowRight } from 'lucide-react';
import { Course } from '../types';

interface CourseModalProps {
  course: Course | null;
  onClose: () => void;
  onRegisterCourse: (courseName: string) => void;
}

export default function CourseModal({ course, onClose, onRegisterCourse }: CourseModalProps) {
  // Handle Escape key to close modal
  useEffect(() => {
    if (!course) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [course, onClose]);

  if (!course) return null;

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
        {/* Modal Header */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-r from-[#F8F5EE] to-[#FAF7F0] border-b border-[#E8DFC8] flex items-start justify-between">
          <div>
            {course.badge && (
              <span className="inline-block px-2.5 py-1 rounded-full bg-[#D69A2D]/15 text-[#9E6910] text-[11px] font-bold uppercase tracking-wider mb-2">
                {course.badge}
              </span>
            )}
            <h3 className="text-xl sm:text-2xl font-bold text-[#252822] font-serif-display">
              {course.name}
            </h3>
            <div className="flex items-center gap-3 mt-2 text-xs text-[#717769]">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#D69A2D]" />
                {course.duration}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#D69A2D]" />
                {course.schedule}
              </span>
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
              id="course-modal-close-btn"
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
          {/* Course Photo Preview */}
          {course.photoUrl && (
            <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden bg-[#EFE7D5] border border-[#E8DFC8]/80 shadow-2xs">
              <img
                src={course.photoUrl}
                alt={course.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              {course.sourcePhotoUrl && (
                <a
                  href={course.sourcePhotoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/60 hover:bg-black/80 text-white text-[11px] font-medium backdrop-blur-xs flex items-center gap-1 transition-all"
                >
                  Ảnh thực tế Google Photos ↗
                </a>
              )}
            </div>
          )}

          {/* Price Box */}
          <div className="p-4 rounded-2xl bg-[#F4EADA]/60 border border-[#E8DFC8] flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#8A6437] uppercase tracking-wider">
                Học phí niêm yết:
              </p>
              <p className="text-2xl font-bold text-[#252822] font-serif-display">
                {course.priceDisplay}
              </p>
            </div>
            {course.priceDetail && (
              <p className="text-xs text-[#63685C] max-w-xs text-right">
                {course.priceDetail}
              </p>
            )}
          </div>

          {/* Detailed Description */}
          <div>
            <h4 className="text-xs font-bold text-[#252822] uppercase tracking-wider mb-2">
              Giới thiệu chương trình
            </h4>
            <p className="text-xs sm:text-sm text-[#555A4E] leading-relaxed">
              {course.fullDesc}
            </p>
          </div>

          {/* Target Audience */}
          <div>
            <h4 className="text-xs font-bold text-[#252822] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#D69A2D]" />
              <span>Chương trình phù hợp với ai?</span>
            </h4>
            <ul className="space-y-1.5">
              {course.targetAudience.map((target, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D69A2D] mt-2 shrink-0" />
                  <span>{target}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Syllabus if available (e.g. 10 Chuyên đề Ashtanga) */}
          {course.syllabus && course.syllabus.length > 0 && (
            <div className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#E8DFC8]">
              <h4 className="text-xs font-bold text-[#252822] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#8A6437]" />
                <span>Nội dung 10 chuyên đề then chốt</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#555A4E]">
                {course.syllabus.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 bg-[#F8F5EE] p-2 rounded-lg border border-[#E8DFC8]/50">
                    <span className="font-bold text-[#D69A2D]">{i + 1}.</span>
                    <span>{item.replace(/^Chuyên đề \d+: /, '')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Benefits & Rights */}
          <div>
            <h4 className="text-xs font-bold text-[#252822] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-[#687B56]" />
              <span>Quyền lợi học viên</span>
            </h4>
            <div className="space-y-2">
              {course.benefits.map((b, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm">
                  <CheckCircle2 className="w-4 h-4 text-[#687B56] shrink-0 mt-0.5" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Outcomes */}
          <div>
            <h4 className="text-xs font-bold text-[#252822] uppercase tracking-wider mb-2.5">
              Cam kết đầu ra
            </h4>
            <div className="space-y-1.5">
              {course.outcomes.map((out, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-[#555A4E]">
                  <span className="text-[#D69A2D] font-bold">✓</span>
                  <span>{out}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
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
              onRegisterCourse(course.name);
            }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#D69A2D] text-white text-xs font-semibold hover:bg-[#B87A14] shadow-xs cursor-pointer"
          >
            <span>Đăng ký nhận tư vấn</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
