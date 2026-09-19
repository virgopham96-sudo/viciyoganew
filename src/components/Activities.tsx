import { useState } from 'react';
import { MapPin, Sparkles, Flower2, ExternalLink } from 'lucide-react';
import { VICI_ACTIVITIES } from '../data/viciData';
import { ActivitySpace } from '../types';

export default function Activities() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const currentSpace: ActivitySpace = VICI_ACTIVITIES[activeTab];

  return (
    <section id="activities" className="py-20 bg-[#FFFDF8] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D69A2D]/10 text-[#A66F17] text-xs font-semibold uppercase tracking-wider mb-3">
            <Flower2 className="w-3.5 h-3.5" />
            <span>Hệ thống không gian chữa lành</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#252822] font-serif-display mb-4">
            Không Gian Yoga & Hoạt Động VICI
          </h2>
          <p className="text-base text-[#5A5F52] leading-relaxed">
            Ba không gian – ba trải nghiệm hoàn toàn khác nhau nhưng cùng chung một sứ mệnh: lan tỏa trí tuệ cổ xưa, nuôi dưỡng sự bình an và xây dựng cộng đồng Healing & Wellness bền vững.
          </p>
        </div>

        {/* Space Selector Tabs */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-10">
          {VICI_ACTIVITIES.map((space, idx) => (
            <button
              key={space.id}
              onClick={() => setActiveTab(idx)}
              className={`px-4 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === idx
                  ? 'bg-[#8A6437] text-white shadow-sm scale-102'
                  : 'bg-[#F8F5EE] text-[#555A4E] hover:bg-[#EFE7D5]'
              }`}
            >
              {space.name}
            </button>
          ))}
        </div>

        {/* Featured Editorial Card for the active space */}
        <div className="bg-[#FBF9F4] rounded-3xl border border-[#E8DFC8] overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-0 mb-12">
          {/* Image side */}
          <div className="lg:col-span-7 relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto overflow-hidden bg-[#EFE7D5] min-h-[340px]">
            <img
              src={currentSpace.photoUrl}
              alt={currentSpace.name}
              className="w-full h-full object-cover"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
            <div className="absolute bottom-4 left-4 right-4 text-white lg:hidden">
              <span className="text-xs font-semibold text-[#E5B25D]">{currentSpace.subtitle}</span>
              <h3 className="text-lg font-bold">{currentSpace.name}</h3>
            </div>
          </div>

          {/* Content narrative side */}
          <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8A6437] uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#D69A2D]" />
                <span>{currentSpace.subtitle}</span>
              </div>

              <h3 className="text-2xl font-bold text-[#252822] font-serif-display mb-3">
                {currentSpace.name}
              </h3>

              <div className="flex items-start gap-2 text-xs sm:text-[13px] text-[#63685C] mb-5">
                <MapPin className="w-4 h-4 text-[#D69A2D] shrink-0 mt-0.5" />
                <span>{currentSpace.address}</span>
              </div>

              <p className="text-sm text-[#555A4E] leading-relaxed mb-6">
                {currentSpace.description}
              </p>

              {/* Highlights pills */}
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-[#717769]">
                  Điểm nổi bật:
                </p>
                <div className="flex flex-wrap gap-2">
                  {currentSpace.highlights.map((h, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-[#FFFDF8] border border-[#E0D5BE] text-xs font-medium text-[#4A4E44]"
                    >
                      ✓ {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#E8DFC8] mt-6 flex items-center justify-between text-xs text-[#717769]">
              <span>Ảnh tài liệu lưu trữ VICI</span>
              <a
                href={currentSpace.sourcePhotoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#8A6437] font-semibold hover:text-[#D69A2D]"
              >
                <span>Nguồn ảnh gốc</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Small thumbnail strip for quick browsing */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {VICI_ACTIVITIES.map((space, idx) => (
            <button
              key={space.id}
              onClick={() => setActiveTab(idx)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                activeTab === idx
                  ? 'bg-[#FAF7F0] border-[#8A6437] ring-1 ring-[#8A6437]/20 shadow-xs'
                  : 'bg-[#FFFDF8] border-[#E8DFC8] hover:border-[#D5C7AA]'
              }`}
            >
              <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                <img
                  src={space.photoUrl}
                  alt={space.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#252822] truncate">{space.name}</p>
                <p className="text-[11px] text-[#717769] truncate">{space.subtitle}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
