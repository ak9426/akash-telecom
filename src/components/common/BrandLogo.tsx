import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  light?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showTagline = false,
  light = false,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Precision Geometric Telecom / Tech Icon */}
      <div
        className={`${iconSizes[size]} relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#101828] via-[#1E293B] to-[#0F172A] p-1.5 shadow-sm ring-1 ring-white/10`}
      >
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Signal wave outer */}
          <path
            d="M8 12C13.5 7 22.5 7 28 12"
            stroke="url(#akash-cyan-grad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.85"
          />
          {/* Signal wave mid */}
          <path
            d="M12 16C15.5 12.8 20.5 12.8 24 16"
            stroke="url(#akash-blue-grad)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Stylized 'A' + Tower Mast Core */}
          <path
            d="M18 20L13 29H16L18 24.5L20 29H23L18 20Z"
            fill="url(#akash-cyan-grad)"
          />
          {/* Transmitter Pulse Dot */}
          <circle cx="18" cy="18" r="2.2" fill="#06B6D4" />

          <defs>
            <linearGradient id="akash-cyan-grad" x1="8" y1="7" x2="28" y2="29" gradientUnits="userSpaceOnUse">
              <stop stopColor="#06B6D4" />
              <stop offset="1" stopColor="#3B82F6" />
            </linearGradient>
            <linearGradient id="akash-blue-grad" x1="12" y1="13" x2="24" y2="29" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2563EB" />
              <stop offset="1" stopColor="#06B6D4" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Wordmark */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`font-extrabold tracking-tight font-display ${textSizes[size]} ${
              light ? 'text-white' : 'text-[#101828]'
            }`}
          >
            AKASH
          </span>
          <span
            className={`font-bold tracking-wider uppercase text-xs px-1.5 py-0.5 rounded bg-blue-600/10 text-blue-600 font-display`}
          >
            TELECOM
          </span>
        </div>
        {showTagline && (
          <span
            className={`text-[10px] tracking-wide mt-1 font-medium ${
              light ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Your Tech. Your Lifestyle. Our Commitment.
          </span>
        )}
      </div>
    </div>
  );
};
