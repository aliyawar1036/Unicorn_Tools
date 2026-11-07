import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Download,
  RotateCcw,
  ShieldCheck,
  RefreshCw,
  ArrowRight,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  formatBytes,
  convertImage,
  triggerDownload,
  parseImageFile,
} from '../../lib/imageProcessor';
import { ImageFileInfo, CompressionResult } from '../../types';
import { AdSlot } from '../AdSlot';
import { useSessionHistory } from '../../context/SessionHistoryContext';
import { SessionHistoryView } from '../SessionHistoryView';

export const ImageConverter: React.FC = () => {
  const { addToHistory, activeReload, clearActiveReload } = useSessionHistory();
  const [fileInfo, setFileInfo] = useState<ImageFileInfo | null>(null);
  const [targetFormat, setTargetFormat] = useState<'image/webp' | 'image/png' | 'image/jpeg'>('image/webp');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeReload && activeReload.toolId === 'image-converter') {
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
      setIsProcessing(true);
      const parsed = await parseImageFile(file);
      setFileInfo(parsed);

      // Default target format: if PNG or JPEG -> WebP; if WebP -> PNG
      const defaultTarget = parsed.type === 'image/webp' ? 'image/png' : 'image/webp';
      setTargetFormat(defaultTarget);

      const res = await convertImage(file, defaultTarget);
      setResult(res);

      addToHistory({
        toolId: 'image-converter',
        toolName: 'Image Format Converter',
        fileName: file.name,
        originalFile: file,
        originalSize: file.size,
        processedSize: res.size,
        width: res.width,
        height: res.height,
        previewUrl: res.dataUrl,
        resultBlob: res.blob,
        resultFileName: res.fileName,
        settingsSummary: `Converted to ${res.mimeType.replace('image/', '').toUpperCase()} · ${formatBytes(res.size)}`,
      });
    } catch (err: any) {
      alert('Error parsing image: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConvert = async (format: 'image/webp' | 'image/png' | 'image/jpeg') => {
    if (!fileInfo) return;
    setTargetFormat(format);
    setIsProcessing(true);
    try {
      const res = await convertImage(fileInfo.file, format);
      setResult(res);

      addToHistory({
        toolId: 'image-converter',
        toolName: 'Image Format Converter',
        fileName: fileInfo.name,
        originalFile: fileInfo.file,
        originalSize: fileInfo.size,
        processedSize: res.size,
        width: res.width,
        height: res.height,
        previewUrl: res.dataUrl,
        resultBlob: res.blob,
        resultFileName: res.fileName,
        settingsSummary: `Converted to ${res.mimeType.replace('image/', '').toUpperCase()} · ${formatBytes(res.size)}`,
      });
    } catch (err: any) {
      alert('Conversion failed: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFileInfo(null);
    setResult(null);
  };

  const formats = [
    {
      id: 'image/webp',
      label: 'WebP',
      badge: 'Modern Web (25-35% lighter)',
      desc: 'High compression efficiency with alpha transparency support.',
    },
    {
      id: 'image/png',
      label: 'PNG',
      badge: 'Lossless & Transparent',
      desc: 'Pixel-perfect quality, best for logos, icons, and UI graphics.',
    },
    {
      id: 'image/jpeg',
      label: 'JPG / JPEG',
      badge: 'Universal Compatibility',
      desc: 'Broadest cross-platform support. Fills transparency with solid white.',
    },
  ] as const;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/80">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>100% Private · Zero Server Uploads</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Image Format Converter
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Convert between JPG, PNG, and WebP instantly with full preservation of transparent backgrounds.
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
              <RefreshCw className="w-8 h-8" />
            </div>
            <div>
              <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Upload image to convert, or <span className="text-indigo-600 dark:text-indigo-400 underline">browse files</span>
              </p>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Convert between JPG, PNG, and WebP with zero quality degradation
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Target Format
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Current: {fileInfo.type.replace('image/', '').toUpperCase()} ({formatBytes(fileInfo.size)})
                </p>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Upload different image"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Format cards */}
            <div className="space-y-3">
              {formats.map((fmt) => {
                const isSelected = targetFormat === fmt.id;
                return (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => handleConvert(fmt.id as any)}
                    className={`w-full p-3.5 text-left rounded-xl border transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 ring-1 ring-indigo-500/50'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {fmt.label}
                      </span>
                      <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
                        {fmt.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {fmt.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Transparency Note */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5">
              <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Transparency Notice:
                </span>{' '}
                PNG and WebP support alpha transparency. Converting to JPEG automatically flattens with a clean white backdrop.
              </p>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-7 space-y-6">
            {result && (
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
                    Source Size
                  </span>
                  <span className="text-base font-bold font-mono text-slate-800 dark:text-slate-100">
                    {formatBytes(result.originalSize)}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
                    Converted Size
                  </span>
                  <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    {formatBytes(result.size)}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
                    Format
                  </span>
                  <span className="text-base font-bold font-mono text-indigo-600 dark:text-indigo-400">
                    {result.mimeType.replace('image/', '').toUpperCase()}
                  </span>
                </div>
              </div>
            )}

            {/* Preview Box */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Output Image Preview</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">
                  {fileInfo.width} × {fileInfo.height} px
                </span>
              </div>

              {result && (
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 flex items-center justify-center border border-slate-200 dark:border-slate-800 p-2">
                  <img
                    src={result.dataUrl}
                    alt="Converted output"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              )}

              {result && (
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs text-slate-500">
                    Ready as {result.fileName}
                  </span>
                  <button
                    type="button"
                    onClick={() => triggerDownload(result.blob, result.fileName)}
                    className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Converted Image ({formatBytes(result.size)})</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Session History */}
      <SessionHistoryView
        toolId="image-converter"
        toolName="Image Format Converter"
        onSelectForReprocess={handleFile}
      />

      <AdSlot placement="tool-bottom" />
    </div>
  );
};
