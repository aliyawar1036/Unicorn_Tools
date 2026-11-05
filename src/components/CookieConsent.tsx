import React, { useState, useEffect } from 'react';
import { CookiePreferences } from '../types';
import { ShieldCheck, Settings2, X, Check } from 'lucide-react';

const STORAGE_KEY = 'unicorntools_cookie_consent';

export const CookieConsent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [prefs, setPrefs] = useState<CookiePreferences>({
    essential: true, // Always true
    analytics: false,
    advertising: false,
    hasConsented: false,
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setPrefs(parsed);
      } else {
        // Show banner if not yet consented
        setIsOpen(true);
      }
    } catch {
      setIsOpen(true);
    }

    // Custom event listener so footer / settings link can reopen preferences modal
    const handleOpenPrefs = () => {
      setShowManageModal(true);
    };
    window.addEventListener('open-cookie-preferences', handleOpenPrefs);
    return () => {
      window.removeEventListener('open-cookie-preferences', handleOpenPrefs);
    };
  }, []);

  const saveConsent = (updated: CookiePreferences) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          ...updated,
          hasConsented: true,
          timestamp: Date.now(),
        })
      );
    } catch {
      // ignore
    }
    setPrefs({ ...updated, hasConsented: true });
    setIsOpen(false);
    setShowManageModal(false);
  };

  const handleAcceptAll = () => {
    saveConsent({
      essential: true,
      analytics: true,
      advertising: true,
      hasConsented: true,
    });
  };

  const handleRejectNonEssential = () => {
    saveConsent({
      essential: true,
      analytics: false,
      advertising: false,
      hasConsented: true,
    });
  };

  const handleSaveCustom = () => {
    saveConsent({
      ...prefs,
      hasConsented: true,
    });
  };

  return (
    <>
      {/* Bottom Sticky Banner if user has not chosen yet */}
      {isOpen && !showManageModal && (
        <div
          role="dialog"
          aria-label="Cookie consent banner"
          className="fixed bottom-0 inset-x-0 z-50 p-4 md:p-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-xl transition-all"
        >
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3 max-w-3xl">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 rounded-lg shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  We respect your privacy &amp; data ownership
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  UnicornTools processes images locally on your device without server uploads. We use strictly necessary cookies for website preferences, and optional cookies to analyze aggregate usage and display privacy-safe advertisements. Read our{' '}
                  <a
                    href="/cookie-policy"
                    onClick={(e) => {
                      e.preventDefault();
                      window.history.pushState({}, '', '/cookie-policy');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }}
                    className="text-indigo-600 dark:text-indigo-400 underline underline-offset-2 hover:text-indigo-700"
                  >
                    Cookie Policy
                  </a>{' '}
                  and{' '}
                  <a
                    href="/privacy-policy"
                    onClick={(e) => {
                      e.preventDefault();
                      window.history.pushState({}, '', '/privacy-policy');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }}
                    className="text-indigo-600 dark:text-indigo-400 underline underline-offset-2 hover:text-indigo-700"
                  >
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setShowManageModal(true)}
                className="px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Settings2 className="w-3.5 h-3.5" />
                Manage Preferences
              </button>
              <button
                type="button"
                onClick={handleRejectNonEssential}
                className="px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Reject Non-Essential
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg transition-colors shadow-sm"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Managing Cookie Preferences */}
      {showManageModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Cookie &amp; Privacy Preferences
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowManageModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              {/* Essential */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      Strictly Essential Cookies
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      Always Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Required for core website functionality such as remembering your light/dark theme preference and these cookie settings.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  className="rounded text-indigo-600 w-4 h-4 mt-1 accent-indigo-600 cursor-not-allowed"
                />
              </div>

              {/* Analytics */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 flex items-start justify-between gap-4">
                <div>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    Performance &amp; Analytics
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Helps us understand aggregated user traffic and tool usage patterns to improve processing speed and detect broken features.
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="pref-analytics"
                  checked={prefs.analytics}
                  onChange={(e) => setPrefs({ ...prefs, analytics: e.target.checked })}
                  className="rounded text-indigo-600 w-4 h-4 mt-1 accent-indigo-600 cursor-pointer"
                />
              </div>

              {/* Advertising */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 flex items-start justify-between gap-4">
                <div>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    Personalized Advertising Cookies
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Allows Google AdSense partners to serve relevant advertisements that keep UnicornTools 100% free for everyone.
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="pref-ad"
                  checked={prefs.advertising}
                  onChange={(e) => setPrefs({ ...prefs, advertising: e.target.checked })}
                  className="rounded text-indigo-600 w-4 h-4 mt-1 accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={handleRejectNonEssential}
                className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Reject Non-Essential
              </button>
              <button
                type="button"
                onClick={handleSaveCustom}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Preferences</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
