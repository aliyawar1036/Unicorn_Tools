import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Download,
  RotateCcw,
  Lock,
  Unlock,
  ShieldCheck,
  Maximize2,
  Zap,
} from 'lucide-react';
import {
  formatBytes,
  resizeImage,
  triggerDownload,
  parseImageFile,
} from '../../lib/imageProcessor';
import { ImageFileInfo, CompressionResult } from '../../types';
import { AdSlot } from '../AdSlot';
import { useSessionHistory } from '../../context/SessionHistoryContext';
import { SessionHistoryView } from '../SessionHistoryView';

interface DimensionPreset {
  name: string;
  width: number;
  height: number;
  description: string;
}

const RESIZE_PRESETS: DimensionPreset[] = [
  { name: 'Full HD', width: 1920, height: 1080, description: '16:9 Web & Desktop' },
  { name: 'HD / YouTube Thumb', width: 1280, height: 720, description: '16:9 Thumbnail' },
  { name: 'Web Banner / OG', width: 1200, height: 630, description: 'Social Share Card' },
  { name: 'Square / Avatar', width: 600, height: 600, description: '1:1 Profile & Icons' },
  { name: 'Passport / ID', width: 600, height: 600, description: '2x2 inches @ 300DPI' },
  { name: 'Story / Reel / Mobile', width: 1080, height: 1920, description: '9:16 Vertical Video' },
];

export const ImageResizer: React.FC = () => {
  const { addToHistory, activeReload, clearActiveReload } = useSessionHistory();
  const [fileInfo, setFileInfo] = useState<ImageFileInfo | null>(null);
  const [width, setWidth] = useState<number>(1280);
  const [height, setHeight] = useState<number>(720);
  const [lockAspect, setLockAspect] = useState<boolean>(true);
  const [quality, setQuality] = useState<number>(90);
  const [outputType, setOutputType] = useState<'image/jpeg' | 'image/webp' | 'image/png'>('image/jpeg');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeReload && activeReload.toolId === 'image-resizer') {
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
      setWidth(parsed.width);
      setHeight(parsed.height);

      if (file.type === 'image/webp') setOutputType('image/webp');
      else if (file.type === 'image/png') setOutputType('image/png');
      else setOutputType('image/jpeg');

      const res = await resizeImage(file, {
        width: parsed.width,
        height: parsed.height,
        outputType: file.type as any,
        quality: 0.9,
      });
      setResult(res);
    } catch (err: any) {
      alert('Error loading image: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWidthChange = (val: string) => {
    const newW = parseInt(val) || 0;
    setWidth(newW);
    if (lockAspect && fileInfo && fileInfo.width > 0 && newW > 0) {
      const ratio = fileInfo.height / fileInfo.width;
      setHeight(Math.round(newW * ratio));
    }
  };

  const handleHeightChange = (val: string) => {
    const newH = parseInt(val) || 0;
    setHeight(newH);
    if (lockAspect && fileInfo && fileInfo.height > 0 && newH > 0) {
      const ratio = fileInfo.width / fileInfo.height;
      setWidth(Math.round(newH * ratio));
    }
  };

  const handlePresetSelect = (preset: DimensionPreset) => {
    setWidth(preset.width);
    setHeight(preset.height);
    if (fileInfo) {
      runResize(fileInfo.file, preset.width, preset.height);
    }
  };

  const runResize = async (file: File, w = width, h = height) => {
    if (w <= 0 || h <= 0) {
      alert('Width and Height must be greater than 0.');
      return;
    }
    setIsProcessing(true);
    try {
      const res = await resizeImage(file, {
        width: w,
        height: h,
        outputType,
        quality: quality / 100,
      });
      setResult(res);

      addToHistory({
        toolId: 'image-resizer',
        toolName: 'Image Resizer',
        fileName: file.name,
        originalFile: file,
        originalSize: file.size,
        processedSize: res.size,
        width: res.width,
        height: res.height,
        previewUrl: res.dataUrl,
        resultBlob: res.blob,
        resultFileName: res.fileName,
        settingsSummary: `${res.width} × ${res.height} px · ${formatBytes(res.size)}`,
      });
    } catch (err: any) {
      alert('Resize error: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFileInfo(null);
    setResult(null);
    setWidth(1280);
    setHeight(720);
    setLockAspect(true);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-100 dark:border-sky-900/50">
          <ShieldCheck className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          <span>100% Private · Local In-Browser Resizing</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111827] dark:text-white tracking-tight">
          Image Resizer
        </h1>
        <p className="text-sm sm:text-base text-[#64748B] dark:text-slate-400 max-w-2xl mx-auto">
          Scale pixel dimensions accurately with aspect ratio lock and one-click standard presets.
        </p>
      </div>

      <AdSlot placement="tool-top" />

      {/* Upload Drop Zone */}
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
          className={`border-2 border-dashed rounded-3xl p-10 sm:p-14 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20 scale-[1.01]'
              : 'border-slate-300 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-indigo-400 hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
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
            <div className="w-14 h-14 rounded-2xl bg-sky-50 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center shadow-xs">
              <Maximize2 className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <p className="text-base sm:text-lg font-bold text-[#111827] dark:text-white">
                Drag and drop your image to resize
              </p>
              <p className="text-xs sm:text-sm text-[#64748B] dark:text-slate-400">
                Supports JPG, PNG, and WebP (High DPI &amp; 4K supported)
              </p>
            </div>
            <button
              type="button"
              className="mt-1 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors shadow-2xs"
            >
              Browse Files
            </button>
          </div>
        </div>
      ) : (
        /* Workspace */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-5 bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-[#111827] dark:text-white text-base">
                  Resize Options
                </h3>
                <p className="text-xs text-[#64748B] dark:text-slate-400">
                  Original: {fileInfo.width} × {fileInfo.height} px ({fileInfo.aspectRatio})
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

            {/* Custom Dimensions Form */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 items-end">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Width (px)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={width || ''}
                    onChange={(e) => handleWidthChange(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Height (px)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={height || ''}
                    onChange={(e) => handleHeightChange(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              {/* Aspect Ratio Lock Toggle */}
              <button
                type="button"
                onClick={() => setLockAspect(!lockAspect)}
                className={`w-full py-2 px-3 rounded-lg text-xs font-medium border flex items-center justify-center gap-2 transition-colors ${
                  lockAspect
                    ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-semibold'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                {lockAspect ? <Lock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> : <Unlock className="w-3.5 h-3.5" />}
                <span>
                  {lockAspect ? 'Maintain Aspect Ratio (Locked)' : 'Custom Proportions (Unlocked)'}
                </span>
              </button>
            </div>

            {/* Popular Size Presets */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Preset Dimensions
              </label>
              <div className="grid grid-cols-2 gap-2">
                {RESIZE_PRESETS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => handlePresetSelect(p)}
                    className="p-2.5 text-left rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60 hover:border-indigo-400 transition-colors"
                  >
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {p.name}
                    </div>
                    <div className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 mt-0.5">
                      {p.width} × {p.height}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Output Format */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Format
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['image/jpeg', 'image/webp', 'image/png'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setOutputType(fmt)}
                    className={`py-1.5 text-xs font-medium rounded-lg border transition-all ${
                      outputType === fmt
                        ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-indigo-500 font-semibold'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {fmt === 'image/jpeg' ? 'JPEG' : fmt === 'image/webp' ? 'WebP' : 'PNG'}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => runResize(fileInfo.file)}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Resizing image...</span>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Apply New Dimensions</span>
                </>
              )}
            </button>
          </div>

          {/* Preview & Output Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Dimensions Metric Banner */}
            {result && (
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-slate-800 shadow-2xs">
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
                    Original
                  </span>
                  <span className="text-sm font-bold font-mono text-slate-800 dark:text-slate-100">
                    {fileInfo.width} × {fileInfo.height} px
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-slate-800 shadow-2xs">
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
                    Resized Output
                  </span>
                  <span className="text-sm font-bold font-mono text-indigo-600 dark:text-indigo-400">
                    {result.width} × {result.height} px
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-slate-800 shadow-2xs">
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
                    Output File Size
                  </span>
                  <span className="text-sm font-bold font-mono text-slate-800 dark:text-slate-100">
                    {formatBytes(result.size)}
                  </span>
                </div>
              </div>
            )}

            {/* Preview Box */}
            <div className="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Resized Preview</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400">
                  {width} × {height} px
                </span>
              </div>

              {result && (
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900 flex items-center justify-center border border-slate-200 dark:border-slate-800 p-2">
                  <img
                    src={result.dataUrl}
                    alt="Resized output"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              )}

              {result && (
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs text-slate-500">
                    Format: {result.mimeType.replace('image/', '').toUpperCase()} · Ready to download
                  </span>
                  <button
                    type="button"
                    onClick={() => triggerDownload(result.blob, result.fileName)}
                    className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Resized Image</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Session History */}
      <SessionHistoryView
        toolId="image-resizer"
        toolName="Image Resizer"
        onSelectForReprocess={handleFile}
      />

      <AdSlot placement="tool-bottom" />
    </div>
  );
};
