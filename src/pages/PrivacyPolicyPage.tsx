import React from 'react';
import { ShieldCheck, Lock, Eye, Database } from 'lucide-react';
import { AdSlot } from '../components/AdSlot';

export const PrivacyPolicyPage: React.FC = () => {
  const contactEmail =
    (import.meta as any).env?.VITE_CONTACT_EMAIL || 'support@unicorntools.app';

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10 text-slate-700 dark:text-slate-300">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-8 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/80">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Last Updated: November 2026</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
          At UnicornTools, we believe user privacy is a fundamental human right. This Privacy Policy discloses exactly how our website functions, what data is processed, and our technical measures to keep your files confidential.
        </p>
      </div>

      <div className="space-y-8 text-sm leading-relaxed">
        {/* Core Architecture */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold text-lg">
            <Lock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2>1. Image Processing &amp; Zero-Upload Architecture</h2>
          </div>
          <p>
            Unlike traditional file conversion websites, <strong>UnicornTools executes image processing operations (compression, resizing, format conversion, and metadata inspection) entirely client-side inside your web browser</strong> using HTML5 Canvas, the JavaScript Blob API, and Web Workers.
          </p>
          <p>
            When you select or drop a photo into any of our image tools:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400 ml-2">
            <li>Your image file is never uploaded, transmitted, or streamed to any remote server or cloud infrastructure.</li>
            <li>No copies or temporary backups of your files are stored on our servers.</li>
            <li>Once you close or refresh your browser tab, the temporary image buffer in your computer’s RAM is immediately cleared.</li>
          </ul>
        </section>

        {/* Information Collected */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            2. Information We Collect
          </h2>
          <p>
            While your image files never leave your device, we may collect or process certain categories of operational data:
          </p>
          <div className="space-y-3 pt-1">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
                A. Contact Form Data
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                If you voluntarily submit an inquiry through our Contact Us form, we receive the name, email address, subject, and message text you provide so we can respond to your request. We never sell or share contact details with marketing brokers.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
                B. Usage &amp; Analytics Data
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                If you grant consent via our Cookie Preferences banner, aggregate analytics services (such as Google Analytics) may collect pseudonymous telemetry including pages visited, browser type, operating system, approximate geographic country/region, and referral URL. This assists us in optimizing tool performance and detecting broken browser compatibility.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
                C. Advertising Data (Google AdSense)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                We may utilize Google AdSense to display advertisements that fund our free platform. When enabled and consented to, Google and its advertising partners may use cookies or web beacons to serve ads based on your prior visits to this and other websites. You may opt out of personalized advertising by visiting Google Ad Settings (<a href="https://adssettings.google.com" target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 underline">adssettings.google.com</a>) or via our Cookie Consent modal.
              </p>
            </div>
          </div>
        </section>

        {/* Cookies */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            3. Cookies &amp; Local Storage
          </h2>
          <p>
            UnicornTools uses browser local storage (`localStorage`) to remember your theme selection (light or dark mode), your list of recently used tools on this browser, and your Cookie Consent preferences. For full details on cookie categories, see our dedicated <a href="/cookie-policy" className="text-indigo-600 dark:text-indigo-400 underline">Cookie Policy</a>.
          </p>
        </section>

        {/* Data Security & Retention */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            4. Data Retention &amp; Security Measures
          </h2>
          <p>
            Because image processing occurs strictly on your device, we have zero retention of image content. Contact inquiries submitted to our team are retained only as long as necessary to resolve your question or fulfill regulatory obligations, typically up to 12 months. All network transmissions (such as website pages and contact requests) are encrypted using standard Transport Layer Security (TLS 1.3 / HTTPS).
          </p>
        </section>

        {/* Privacy Rights */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            5. User Privacy Rights (GDPR, CCPA / CPRA)
          </h2>
          <p>
            Depending on your jurisdiction, you have legal rights regarding your personal data, including the right to access, rectify, or request erasure of contact form data we hold, as well as the right to withdraw consent for analytics and advertising tracking at any time via our Cookie Preferences.
          </p>
        </section>

        {/* Children's Privacy */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            6. Children&apos;s Privacy
          </h2>
          <p>
            UnicornTools is intended for general audiences and does not knowingly collect personal identifiable information from children under the age of 13 (or under 16 in the European Economic Area).
          </p>
        </section>

        {/* Changes */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            7. Changes to this Privacy Policy
          </h2>
          <p>
            We may periodically update this policy to reflect enhancements in our tool architecture or regulatory guidelines. Any modifications will be posted here with an updated revision date.
          </p>
        </section>

        {/* Contact */}
        <section className="space-y-3 pt-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            8. Contact Information
          </h2>
          <p>
            For any questions, data requests, or concerns regarding this Privacy Policy, please email our privacy officer at{' '}
            <a href={`mailto:${contactEmail}`} className="font-mono text-indigo-600 dark:text-indigo-400 underline">
              {contactEmail}
            </a>.
          </p>
        </section>
      </div>

      <AdSlot placement="content-inline" />
    </div>
  );
};
