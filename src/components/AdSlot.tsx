import React, { useState, useEffect } from 'react';

interface AdSlotProps {
  placement: 'homepage-below-hero' | 'tool-top' | 'tool-bottom' | 'desktop-sidebar' | 'content-inline';
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({ placement, className = '' }) => {
  const clientId = (import.meta as any).env?.VITE_ADSENSE_CLIENT_ID;
  const isClientIdConfigured = Boolean(clientId && clientId !== 'pub-0000000000000000');

  const [hasAdConsent, setHasAdConsent] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('unicorntools_cookie_consent');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Boolean(parsed.advertising);
      }
    } catch {
      // ignore
    }
    return false;
  });

  useEffect(() => {
    const handleConsentChange = (e: any) => {
      if (e?.detail?.advertising !== undefined) {
        setHasAdConsent(Boolean(e.detail.advertising));
      } else {
        try {
          const saved = localStorage.getItem('unicorntools_cookie_consent');
          if (saved) {
            const parsed = JSON.parse(saved);
            setHasAdConsent(Boolean(parsed.advertising));
          }
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener('cookie-consent-updated', handleConsentChange);
    return () => window.removeEventListener('cookie-consent-updated', handleConsentChange);
  }, []);

  // Only render real AdSense if both client ID is configured AND user granted explicit advertising consent
  const canRenderAd = isClientIdConfigured && hasAdConsent;

  if (canRenderAd) {
    return (
      <aside
        className={`w-full my-6 flex flex-col items-center justify-center p-3 bg-slate-100/70 dark:bg-slate-900/50 rounded-xl border border-slate-200/80 dark:border-slate-800 ${className}`}
        aria-label="Advertisement"
      >
        <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-400 dark:text-slate-500 mb-2">
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

  // Non-deceptive placeholder reserving layout space when AdSense is pending approval or consent not granted
  return (
    <aside
      className={`w-full my-6 flex flex-col items-center justify-center p-4 bg-slate-50/70 dark:bg-slate-900/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center transition-all ${className}`}
      aria-label="Sponsorship Space"
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 dark:text-slate-500">
          Sponsor / Ad Placement Space
        </span>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
        Reserved for Google AdSense or verified privacy-safe sponsors. Ads remain strictly separated from download buttons.
      </p>
    </aside>
  );
};
