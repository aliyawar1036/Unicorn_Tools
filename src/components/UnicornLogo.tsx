import React from 'react';

interface UnicornLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const UnicornLogo: React.FC<UnicornLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Modern Minimalist Geometric Unicorn Symbol */}
      <div
        className={`${iconSizes[size]} relative flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 p-1.5 shadow-sm ring-1 ring-indigo-500/25 shrink-0`}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="logoHornPrimary" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="50%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>
            <linearGradient id="logoHornFacet" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818CF8" />
              <stop offset="100%" stopColor="#4338CA" />
            </linearGradient>
          </defs>
          {/* Main crystalline horn shard */}
          <polygon points="24,5 34,35 24,31" fill="url(#logoHornPrimary)" />
          {/* Angular faceted left wing */}
          <polygon points="24,5 14,35 24,31" fill="url(#logoHornFacet)" />
          {/* Prism base facet */}
          <polygon points="24,31 34,35 24,42 14,35" fill="#312E81" />
          {/* Radiant horn apex gleam */}
          <circle cx="24" cy="6" r="1.5" fill="#E0E7FF" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className={`${textSizes[size]} font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap`}
          >
            Unicorn<span className="text-indigo-600 dark:text-indigo-400">Tools</span>
          </span>
          {size === 'lg' && (
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 tracking-normal mt-0.5">
              Everyday Tools. Made Simple.
            </span>
          )}
        </div>
      )}
    </div>
  );
};
