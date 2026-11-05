import React from 'react';

interface AdSlotProps {
  placement: 'homepage-below-hero' | 'tool-top' | 'tool-bottom' | 'desktop-sidebar' | 'content-inline';
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({ placement, className = '' }) => {
  // Configured via environment variable VITE_ADSENSE_CLIENT_ID / VITE_ADSENSE_SLOT_ID
  const clientId = (import.meta as any).env?.VITE_ADSENSE_CLIENT_ID;
  const isEnabled = Boolean(clientId && clientId !== 'pub-0000000000000000');

  // If enabled in production with real client ID, render the official Google AdSense ins tag
  if (isEnabled) {
    return (
      <aside
        className={`w-full my-6 flex flex-col items-center justify-center p-3 bg-slate-100/70 dark:bg-neutral-900/50 rounded-xl border border-slate-200/80 dark:border-neutral-800 ${className}`}
        aria-label="Advertisement"
      >
        <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-400 dark:text-neutral-500 mb-2">
          Advertisement
        </span>
        <div className="w-full flex items-center justify-center min-h-[90px] overflow-hidden">
          <ins
            className="adsbygoogle"
            style={{ display: 'block', textAlign: 'center' }}
            data-ad-layout="in-article"
            data-ad-format="fluid"
            data-ad-client={clientId}
            data-ad-slot="1234567890"
          ></ins>
        </div>
      </aside>
    );
  }

  // When AdSense is not configured, we do NOT display fake ads.
  // We provide a quiet, standards-compliant placeholder that reserves layout space
  // and cleanly explains integration readiness without deceiving users.
  return (
    <aside
      className={`w-full my-6 flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-neutral-900/30 rounded-xl border border-dashed border-slate-200 dark:border-neutral-800 text-center transition-all ${className}`}
      aria-label="Sponsorship Space"
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 dark:text-neutral-500">
          Sponsor / Ad Placement Space
        </span>
      </div>
      <p className="text-xs text-slate-500 dark:text-neutral-400 max-w-md">
        Reserved for Google AdSense or verified privacy-conscious sponsors. Ads remain strictly separated from download buttons.
      </p>
    </aside>
  );
};
