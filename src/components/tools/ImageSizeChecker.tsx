import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Copy,
  Download,
  Check,
  RotateCcw,
  ShieldCheck,
  Info,
  Sparkles,
  FileText,
  BarChart2,
} from 'lucide-react';
import { formatBytes, parseImageFile } from '../../lib/imageProcessor';
import { ImageFileInfo } from '../../types';
import { AdSlot } from '../AdSlot';
import { useSessionHistory } from '../../context/SessionHistoryContext';
import { SessionHistoryView } from '../SessionHistoryView';

interface OptimizationForecast {
  scenario: string;
  estimatedSize: number;
  savingsPercentage: number;
  recommendation: string;
}

export const ImageSizeChecker: React.FC = () => {
  const { addToHistory, activeReload, clearActiveReload } = useSessionHistory();
  const [fileInfo, setFileInfo] = useState<ImageFileInfo | null>(null);
  const [forecasts, setForecasts] = useState<OptimizationForecast[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeReload && activeReload.toolId === 'image-size-checker') {
      handleFile(activeReload.file);
      clearActiveReload();
    }
  }, [activeReload, clearActiveReload]);

  const handleFile = async (file: File) => {
    if (!file.type.match(/^image\/(jpeg|png|webp)$/i)) {
      alert('Please upload a valid JPG, PNG, or WebP image file.');
      return;
    }
    try {
      const parsed = await parseImageFile(file);
      setFileInfo(parsed);

      // Calculate realistic forecasts based on format and resolution
      const isPng = parsed.type === 'image/png';
      const isWebp = parsed.type === 'image/webp';
      const originalSize = parsed.size;

      const results: OptimizationForecast[] = [];

      // Forecast 1: WebP Conversion (if not already WebP)
      if (!isWebp) {
        const estWebp = Math.round(originalSize * (isPng ? 0.35 : 0.68));
        results.push({
          scenario: 'Convert to Modern WebP (Quality 85%)',
          estimatedSize: estWebp,
          savingsPercentage: Math.max(0, Math.round(((originalSize - estWebp) / originalSize) * 100)),
          recommendation: 'Ideal for web apps, blogs, and e-commerce stores.',
        });
      }

      // Forecast 2: Balanced JPEG Compression
      const estJpg = Math.round(originalSize * 0.45);
      results.push({
        scenario: 'Balanced JPEG Compression (Quality 80%)',
        estimatedSize: estJpg,
        savingsPercentage: Math.max(0, Math.round(((originalSize - estJpg) / originalSize) * 100)),
        recommendation: 'Maximum compatibility for email attachments and portal forms.',
      });

      // Forecast 3: Web-Friendly Max 1200px Resizing + Compression
      if (parsed.width > 1200 || parsed.height > 1200) {
        const scaleFactor = Math.min(1200 / parsed.width, 1200 / parsed.height);
        const estResized = Math.round(originalSize * scaleFactor * scaleFactor * 0.5);
        results.push({
          scenario: 'Downscale to 1200px Max + Compress',
          estimatedSize: estResized,
          savingsPercentage: Math.max(0, Math.round(((originalSize - estResized) / originalSize) * 100)),
          recommendation: 'Drastically accelerates page load and boosts Core Web Vitals.',
        });
      } else {
        // High-Compression 60% scenario
        const estHigh = Math.round(originalSize * 0.25);
        results.push({
          scenario: 'Maximum Size Reduction (Quality 60%)',
          estimatedSize: estHigh,
          savingsPercentage: Math.max(0, Math.round(((originalSize - estHigh) / originalSize) * 100)),
          recommendation: 'Best for tight document or portal upload ceilings (e.g. 50 KB).',
        });
      }

      setForecasts(results);

      addToHistory({
        toolId: 'image-size-checker',
        toolName: 'Image Size Checker',
        fileName: file.name,
        originalFile: file,
        originalSize: file.size,
        processedSize: file.size,
        width: parsed.width,
        height: parsed.height,
        previewUrl: parsed.dataUrl,
        settingsSummary: `${parsed.width} × ${parsed.height} px · ${formatBytes(parsed.size)} (${parsed.aspectRatio})`,
      });
    } catch (err: any) {
      alert('Error analyzing image: ' + err.message);
    }
  };

  const generateReportText = () => {
    if (!fileInfo) return '';
    const lines = [
      `=========================================`,
      `UNICORNTOOLS — IMAGE TECHNICAL ANALYSIS REPORT`,
      `=========================================`,
      `File Name:      ${fileInfo.name}`,
      `File Size:      ${formatBytes(fileInfo.size)} (${fileInfo.size.toLocaleString()} bytes)`,
      `Dimensions:     ${fileInfo.width} × ${fileInfo.height} px`,
      `Aspect Ratio:   ${fileInfo.aspectRatio}`,
      `Image Format:   ${fileInfo.type.replace('image/', '').toUpperCase()}`,
      `Megapixels:     ${((fileInfo.width * fileInfo.height) / 1000000).toFixed(2)} MP`,
      `Generated At:   ${new Date().toISOString()}`,
      ``,
      `OPTIMIZATION POSSIBILITIES FORECAST:`,
      ...forecasts.map(
        (f) =>
          `- ${f.scenario}: ~${formatBytes(f.estimatedSize)} (Save ~${f.savingsPercentage}%)`
      ),
      `=========================================`,
      `Analyzed 100% locally with UnicornTools (https://unicorn-tools.vercel.app/)`,
    ];
    return lines.join('\n');
  };

  const handleCopyReport = () => {
    const text = generateReportText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadReport = () => {
    const text = generateReportText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileInfo?.name || 'image'}_analysis_report.txt`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };

  const handleReset = () => {
    setFileInfo(null);
    setForecasts([]);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/80">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>100% Private · In-Browser Metadata Inspection</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Image Size Checker
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Inspect detailed technical dimensions, aspect ratios, file weights, and projected compression savings.
        </p>
      </div>

      <AdSlot placement="tool-top" />

      {!fileInfo ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleFile(e.dataTransfer.files[0]);
            }
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-8 sm:p-14 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 scale-[1.01]'
              : 'border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-900'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
          />
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center shadow-xs">
              <BarChart2 className="w-8 h-8" />
            </div>
            <div>
              <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Upload image to analyze, or <span className="text-indigo-600 dark:text-indigo-400 underline">browse files</span>
              </p>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Reads exact dimensions, aspect ratio, and compression potential instantly
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Metadata Card Column */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Technical Specifications
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                  {fileInfo.name}
                </p>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Analyze different image"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <span className="text-xs text-slate-500 dark:text-slate-400">File Weight</span>
                <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                  {formatBytes(fileInfo.size)} ({fileInfo.size.toLocaleString()} bytes)
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <span className="text-xs text-slate-500 dark:text-slate-400">Pixel Dimensions</span>
                <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                  {fileInfo.width} × {fileInfo.height} px
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <span className="text-xs text-slate-500 dark:text-slate-400">Aspect Ratio</span>
                <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                  {fileInfo.aspectRatio}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <span className="text-xs text-slate-500 dark:text-slate-400">MIME Format</span>
                <span className="text-sm font-bold font-mono text-indigo-600 dark:text-indigo-400">
                  {fileInfo.type.replace('image/', '').toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <span className="text-xs text-slate-500 dark:text-slate-400">Megapixels</span>
                <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                  {((fileInfo.width * fileInfo.height) / 1000000).toFixed(2)} MP
                </span>
              </div>
            </div>

            {/* Copy / Export Report Action */}
            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyReport}
                className="flex-1 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Metrics'}</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadReport}
                className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-center gap-1.5"
                title="Download report as .txt"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save .txt</span>
              </button>
            </div>
          </div>

          {/* Forecast & Image Preview Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Optimization Forecast */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Estimated Compression Possibilities
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Projected savings if processed through UnicornTools compression algorithms:
              </p>

              <div className="space-y-3">
                {forecasts.map((f, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {f.scenario}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {f.recommendation}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">
                        ~{formatBytes(f.estimatedSize)}
                      </div>
                      <div className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                        Save ~{f.savingsPercentage}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Thumbnail preview */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
              <div className="text-xs font-medium text-slate-500">Image Preview</div>
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 flex items-center justify-center border border-slate-200 dark:border-slate-800 p-2">
                <img
                  src={fileInfo.dataUrl}
                  alt={fileInfo.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Session History */}
      <SessionHistoryView
        toolId="image-size-checker"
        toolName="Image Size Checker"
        onSelectForReprocess={handleFile}
      />

      <AdSlot placement="tool-bottom" />
    </div>
  );
};
