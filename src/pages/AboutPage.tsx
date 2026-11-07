import React from 'react';
import { ShieldCheck, Zap, Globe, Cpu, Heart, CheckCircle2 } from 'lucide-react';
import { UnicornLogo } from '../components/UnicornLogo';
import { AdSlot } from '../components/AdSlot';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      {/* Title */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <UnicornLogo size="lg" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          About UnicornTools
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Everyday Tools. Made Simple. A privacy-first online utility platform built for speed, simplicity, and zero compromise.
        </p>
      </div>

      <div className="max-w-none text-slate-600 dark:text-slate-300 text-sm leading-relaxed space-y-6">
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            What is UnicornTools?
          </h2>
          <p>
            UnicornTools is an independent online utility suite designed to assist creators, students, developers, job seekers, and digital professionals worldwide with essential file and image workflows.
          </p>
          <p>
            From meeting strict 50 KB or 100 KB government portal upload limits, to scaling photos for social media headers, to converting image formats for better Core Web Vitals, UnicornTools delivers reliable utilities without paywalls, email registrations, or watermarks.
          </p>
        </section>

        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Why the Platform Was Created
          </h2>
          <p>
            Most traditional online image utilities follow an outdated and privacy-invasive architecture: you upload your personal photos or sensitive documents to an external third-party server, wait in a slow server processing queue, and download the output while trusting that your files are deleted afterward.
          </p>
          <p>
            We realized that modern web browsers now provide powerful, hardware-accelerated APIs—including the HTML5 Canvas 2D engine, Web Workers, and WebAssembly. There is rarely any technical need to transmit your files over the network when your device can execute the compression or resizing operations locally in milliseconds.
          </p>
          <p>
            UnicornTools was created to bring that privacy-first, zero-upload architecture to everyday utility tools.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40">
              <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white pt-1">
              Zero Server Uploads
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Files are processed in temporary browser memory and never touch any server.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/60 flex items-center justify-center border border-violet-100 dark:border-violet-900/40">
              <Zap className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white pt-1">
              Instant Processing
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              No waiting for upload or queue times. Results calculate instantaneously.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 flex items-center justify-center border border-sky-100 dark:border-sky-900/40">
              <Globe className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white pt-1">
              100% Free for Everyone
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Accessible across all desktop and mobile devices without registration or paywalls.
            </p>
          </div>
        </div>

        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Our Core Commitments
          </h2>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Privacy by Design:</strong> We do not log, retain, or share user files. Processing stays completely local to your browser session.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Transparent Advertising:</strong> When non-intrusive display ads are shown, they are clearly separated from download controls to avoid accidental clicks.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Continuous Optimization:</strong> We continuously refine our compression and conversion logic to balance minimal kilobyte weights with maximum visual fidelity.
              </span>
            </li>
          </ul>
        </section>
      </div>

      <div className="text-center pt-4">
        <button
          type="button"
          onClick={() => onNavigate('/tools')}
          className="px-6 py-3 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl transition-all shadow-sm"
        >
          Explore All Tools Now
        </button>
      </div>

      <AdSlot placement="content-inline" />
    </div>
  );
};
