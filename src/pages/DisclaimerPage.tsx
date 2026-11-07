import React from 'react';
import { AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';
import { AdSlot } from '../components/AdSlot';

export const DisclaimerPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10 text-slate-700 dark:text-slate-300">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-8 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/80">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Legal Disclaimer</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Website &amp; Utility Disclaimer
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
          Important disclosures regarding image processing variability, third-party submission compliance, and user verification.
        </p>
      </div>

      <div className="space-y-8 text-sm leading-relaxed">
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            1. General Convenience Only
          </h2>
          <p>
            The tools, calculators, guides, and services provided by UnicornTools are offered solely for general informational, educational, and personal convenience purposes. While our algorithms strive to achieve clean compression, accurate resizing, and optimal format conversions, all outputs are generated programmatically based on user input and client-side browser capabilities.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            2. Variations in Image Processing Results
          </h2>
          <p>
            Image compression and format conversion results depend heavily on several external factors beyond our control, including:
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 ml-2">
            <li>The visual complexity, noise levels, and high-frequency textures of the original source image.</li>
            <li>Your specific browser engine implementation (e.g. Chrome, Firefox, Safari) and underlying hardware graphics drivers.</li>
            <li>Inherent limitations of raster file formats (for instance, JPEG does not support alpha transparency, and extreme compression of detailed images will produce visible artifacts).</li>
          </ul>
          <p>
            Consequently, we cannot and do not guarantee that an image can always reach an arbitrary target size (such as 20 KB) without noticeable loss of visual quality.
          </p>
        </section>

        <section className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 rounded-2xl p-6 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold text-base">
            <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3>3. No Guarantee for Third-Party Portal Requirements</h3>
          </div>
          <p className="text-xs sm:text-sm text-amber-900/90 dark:text-amber-200/90 leading-relaxed">
            Government visa offices, university registration boards, passport authorities, and job recruitment portals frequently enforce proprietary, automated validation scripts.
          </p>
          <p className="text-xs sm:text-sm text-amber-900/90 dark:text-amber-200/90 leading-relaxed">
            UnicornTools does not guarantee that an image processed through our tools will satisfy the specific validation criteria, DPI requirements, color space standards, or acceptance rules of any particular third-party organization or portal.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            4. Mandatory Output Verification
          </h2>
          <p>
            Users are explicitly advised to review and verify all output files, visual clarity, legibility of text, and file attributes before relying upon them for any official, commercial, medical, or legal purpose. UnicornTools assumes no responsibility for decisions made or actions taken based on the use of tool outputs.
          </p>
        </section>
      </div>

      <AdSlot placement="content-inline" />
    </div>
  );
};
