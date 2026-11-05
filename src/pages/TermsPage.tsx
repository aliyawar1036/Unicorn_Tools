import React from 'react';
import { FileText, ShieldAlert } from 'lucide-react';
import { AdSlot } from '../components/AdSlot';

export const TermsPage: React.FC = () => {
  const contactEmail =
    (import.meta as any).env?.VITE_CONTACT_EMAIL || 'support@unicorntools.app';

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10 text-slate-700 dark:text-slate-300">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-8 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/80">
          <FileText className="w-3.5 h-3.5" />
          <span>Last Updated: November 2026</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Terms of Service
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
          Please review these Terms of Service carefully before utilizing the UnicornTools online utility platform.
        </p>
      </div>

      <div className="space-y-8 text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using UnicornTools (the &ldquo;Service&rdquo;), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must refrain from using the website.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            2. Nature of the Service &amp; Local Processing
          </h2>
          <p>
            UnicornTools provides free browser-based utilities to help users compress, resize, format-convert, and inspect raster images. All processing is executed locally on the user&apos;s personal device using client-side web technologies. The Service is provided free of charge on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis.
          </p>
        </section>

        <section className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 rounded-2xl p-6 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold text-base">
            <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3>3. User Responsibilities &amp; Verification Requirement</h3>
          </div>
          <p className="text-xs sm:text-sm text-amber-900/90 dark:text-amber-200/90 leading-relaxed">
            <strong>Critical Verification Notice:</strong> Users are solely responsible for inspecting and verifying all processed outputs before submitting them to third-party institutions, legal authorities, government portals, academic institutions, or printing services.
          </p>
          <p className="text-xs sm:text-sm text-amber-900/90 dark:text-amber-200/90 leading-relaxed">
            Different online application systems have disparate rules regarding color profiles, dimensions, resolution, and maximum kilobyte weights. You must always confirm that your downloaded image meets the exact submission guidelines of your target recipient.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            4. Prohibited Activities
          </h2>
          <p>You agree not to:</p>
          <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400 ml-2">
            <li>Attempt to reverse-engineer, exploit, or disrupt the website infrastructure or security controls.</li>
            <li>Use automated scrapers, bots, or excessive automated requests that impair site availability for other users.</li>
            <li>Use the service to process images that violate applicable local, national, or international laws.</li>
            <li>Circumvent or tamper with advertising scripts, consent management dialogues, or security headers.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            5. Intellectual Property
          </h2>
          <p>
            You retain 100% full ownership, copyright, and title to all images you process with UnicornTools. Because files are handled client-side without transmission to our servers, we obtain zero license or intellectual property claim over your content.
          </p>
          <p>
            The UnicornTools brand, geometric unicorn logo, original website design, UI layout, and proprietary code are the exclusive property of UnicornTools and protected by international intellectual property laws.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            6. Limitation of Liability
          </h2>
          <p>
            To the maximum extent permitted by applicable law, UnicornTools, its founders, and operators shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of, or inability to use, the Service—including but not limited to missed application deadlines, portal rejection of uploaded files, data corruption, or hardware malfunction.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            7. Modifications &amp; Service Availability
          </h2>
          <p>
            We reserve the right to modify, suspend, or discontinue any tool or feature at any time without prior notice. We do not guarantee uninterrupted, bug-free, or error-free uptime.
          </p>
        </section>

        <section className="space-y-3 pt-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            8. Contact Information
          </h2>
          <p>
            Questions regarding these Terms of Service should be directed to{' '}
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
