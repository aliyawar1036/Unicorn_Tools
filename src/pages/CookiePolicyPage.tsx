import React from 'react';
import { SlidersHorizontal, ShieldCheck, CheckCircle2, Cookie } from 'lucide-react';
import { AdSlot } from '../components/AdSlot';

export const CookiePolicyPage: React.FC = () => {
  const handleOpenPreferences = () => {
    window.dispatchEvent(new CustomEvent('open-cookie-preferences'));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10 text-slate-700 dark:text-slate-300">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-8 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/80">
          <Cookie className="w-3.5 h-3.5" />
          <span>Last Updated: November 2026</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Cookie Policy
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
          How UnicornTools and authorized third-party partners utilize cookies and browser storage technologies.
        </p>
      </div>

      <div className="space-y-8 text-sm leading-relaxed">
        {/* Manage Preferences Action Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Your Cookie Consent Choices
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              You can adjust or revoke your cookie preferences at any time.
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenPreferences}
            className="px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl transition-all shadow-sm flex items-center gap-1.5 shrink-0"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Open Cookie Settings</span>
          </button>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            1. What Are Cookies and Local Storage?
          </h2>
          <p>
            Cookies are small text files placed on your device by websites you visit. Browser local storage (`localStorage`) allows websites to store key-value data in your browser session with no expiration date until manually cleared.
          </p>
          <p>
            UnicornTools utilizes these mechanisms strictly to enhance usability, record your preferences, and maintain our free-tier business model.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            2. Categories of Cookies We Use
          </h2>

          <div className="space-y-3">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  A. Strictly Essential Cookies &amp; Storage
                </h3>
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  Always Active
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                These are necessary for the website to function securely and remember basic session settings. For example, we save your theme choice (light or dark mode) and your cookie consent status in <code>localStorage</code>. Disabling these would prevent the website from functioning properly.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  B. Performance &amp; Analytics Cookies
                </h3>
                <span className="text-[11px] font-medium text-slate-500">
                  Optional / Requires Consent
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                When consented to, aggregated analytics scripts gather pseudonymous information about visitor counts, popular tools, and page loading speeds. This helps our engineers identify performance bottlenecks and improve tool features.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  C. Advertising Cookies (Google AdSense)
                </h3>
                <span className="text-[11px] font-medium text-slate-500">
                  Optional / Requires Consent
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Google and authorized ad networks may place advertising cookies to display relevant advertisements and measure ad performance. These cookies enable personalized ads based on visits across the web. You can decline advertising cookies via our consent manager.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                D. Third-Party Cookies
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Some third-party providers (such as Google Fonts or AdSense CDN) may set temporary cookies when their assets load. We ensure non-essential third-party tracking cookies are withheld until you have granted consent.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            3. How to Manage Cookies in Your Browser
          </h2>
          <p>
            In addition to our on-site Cookie Preferences manager, you can manage or delete cookies directly within your web browser settings:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400 ml-2">
            <li><strong>Google Chrome:</strong> Settings &gt; Privacy and security &gt; Cookies and other site data</li>
            <li><strong>Mozilla Firefox:</strong> Settings &gt; Privacy &amp; Security &gt; Enhanced Tracking Protection</li>
            <li><strong>Apple Safari:</strong> Preferences &gt; Privacy &gt; Manage Website Data</li>
            <li><strong>Microsoft Edge:</strong> Settings &gt; Cookies and site permissions</li>
          </ul>
        </section>
      </div>

      <AdSlot placement="content-inline" />
    </div>
  );
};
