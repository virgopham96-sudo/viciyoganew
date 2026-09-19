import regeneratedLogo from '../assets/images/regenerated_image_1789285483552.jpg';

interface ViciLogoProps {
  className?: string;
  light?: boolean;
  variant?: 'horizontal' | 'stacked' | 'icon-only' | 'full-image';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export default function ViciLogo({
  className = '',
  light = false,
  variant = 'horizontal',
  size = 'md',
  showText = true,
}: ViciLogoProps) {
  // Dimension scales
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11 sm:w-12 sm:h-12',
    lg: 'w-16 h-16 sm:w-20 sm:h-20',
    xl: 'w-24 h-24 sm:w-28 sm:h-28',
  };

  const fullImageSizes = {
    sm: 'w-28 h-auto',
    md: 'w-40 sm:w-48 h-auto',
    lg: 'w-56 sm:w-64 h-auto',
    xl: 'w-72 sm:w-80 h-auto',
  };

  if (variant === 'full-image') {
    return (
      <div className={`inline-flex flex-col items-center select-none ${className}`}>
        <img
          src={regeneratedLogo}
          alt="VICI Yoga Therapy & Phục Hồi Thể Thao"
          className={`${fullImageSizes[size]} object-contain drop-shadow-xs transition-transform hover:scale-105 duration-300 ${
            light ? 'brightness-110 contrast-105 bg-white/95 rounded-2xl p-2 shadow-md' : 'mix-blend-multiply'
          }`}
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  return (
    <div
      className={`inline-flex ${
        variant === 'stacked'
          ? 'flex-col items-center text-center'
          : variant === 'icon-only'
          ? 'items-center justify-center'
          : 'items-center gap-3'
      } select-none ${className}`}
    >
      {/* Official VICI Emblem (Hexagon with K-H monogram, bee & infinity flourish) */}
      <div
        className={`relative ${iconSizes[size]} shrink-0 transition-transform hover:scale-105 duration-300 flex items-center justify-center rounded-xl overflow-hidden ${
          light
            ? 'bg-white/10 p-1 backdrop-blur-xs border border-amber-300/20 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <img
          src={regeneratedLogo}
          alt="VICI Emblem"
          className={`w-full h-full object-contain ${
            light
              ? 'filter drop-shadow-[0_2px_8px_rgba(233,192,101,0.4)] brightness-105'
              : 'drop-shadow-xs hover:brightness-105 mix-blend-multiply'
          }`}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/vici-logo.jpg';
          }}
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Brand Typography matching official VICI corporate identity */}
      {variant !== 'icon-only' && showText && (
        <div className={`flex flex-col ${variant === 'stacked' ? 'mt-2 items-center' : 'items-start'}`}>
          <div className="flex flex-col leading-none">
            <span
              className={`font-serif-display font-black tracking-wider uppercase ${
                size === 'sm'
                  ? 'text-xs'
                  : size === 'lg' || size === 'xl'
                  ? 'text-lg sm:text-xl'
                  : 'text-sm sm:text-base'
              } ${
                light
                  ? 'bg-gradient-to-r from-[#F7DF94] via-[#E9C065] to-[#D69A2D] bg-clip-text text-transparent drop-shadow-xs'
                  : 'bg-gradient-to-r from-[#C4841D] via-[#9C640C] to-[#633F05] bg-clip-text text-transparent'
              }`}
            >
              VICI YOGA THERAPY
            </span>
            <span
              className={`font-serif-display font-extrabold tracking-widest uppercase mt-1 ${
                size === 'sm'
                  ? 'text-[8px]'
                  : size === 'lg' || size === 'xl'
                  ? 'text-xs'
                  : 'text-[9.5px] sm:text-[10.5px]'
              } ${
                light
                  ? 'text-[#F5DC8C]'
                  : 'text-[#8A6437]'
              }`}
            >
              &amp; PHỤC HỒI THỂ THAO
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
