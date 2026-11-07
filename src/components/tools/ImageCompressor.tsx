import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Download,
  RotateCcw,
  Sliders,
  Target,
  AlertCircle,
  Eye,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import {
  formatBytes,
  compressImage,
  triggerDownload,
  parseImageFile,
} from '../../lib/imageProcessor';
import { ImageFileInfo, CompressionResult } from '../../types';
import { AdSlot } from '../AdSlot';
import { useSessionHistory } from '../../context/SessionHistoryContext';
import { SessionHistoryView } from '../SessionHistoryView';

export const ImageCompressor: React.FC = () => {
  const { addToHistory, activeReload, clearActiveReload } = useSessionHistory();
  const [fileInfo, setFileInfo] = useState<ImageFileInfo | null>(null);
  const [quality, setQuality] = useState<number>(80);
  const [mode, setMode] = useState<'target' | 'quality'>('target');
  const [targetSizeKb, setTargetSizeKb] = useState<number>(100);
  const [targetUnit, setTargetUnit] = useState<'KB' | 'MB'>('KB');
  const [targetInputVal, setTargetInputVal] = useState<string>('100');
  const [outputType, setOutputType] = useState<'image/jpeg' | 'image/webp' | 'image/png'>('image/jpeg');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [previewMode, setPreviewMode] = useState<'side-by-side' | 'split'>('side-by-side');
  const [splitPos, setSplitPos] = useState<number>(50);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const presets = [50, 100, 200, 500];

  useEffect(() => {
    if (activeReload && activeReload.toolId === 'image-compressor') {
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

      if (file.type === 'image/webp') setOutputType('image/webp');
      else if (file.type === 'image/png') setOutputType('image/png');
      else setOutputType('image/jpeg');

      await runCompression(file, {
        targetSizeKb: mode === 'target' ? targetSizeKb : undefined,
        quality: mode === 'quality' ? quality / 100 : undefined,
      });
    } catch (err: any) {
      alert('Error parsing image: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const runCompression = async (
    file: File,
    overrideOpts?: { targetSizeKb?: number; quality?: number; outType?: 'image/jpeg' | 'image/webp' | 'image/png' }
  ) => {
    setIsProcessing(true);
    try {
      const activeMode = overrideOpts?.targetSizeKb !== undefined ? 'target' : mode;
      const res = await compressImage(file, {
        quality: overrideOpts?.quality ?? (activeMode === 'quality' ? quality / 100 : undefined),
        targetSizeKb:
          overrideOpts?.targetSizeKb ??
          (activeMode === 'target'
            ? targetUnit === 'MB'
              ? targetSizeKb * 1024
              : targetSizeKb
            : undefined),
        outputType: overrideOpts?.outType || outputType,
      });
      setResult(res);

      addToHistory({
        toolId: 'image-compressor',
        toolName: 'Image Compressor',
        fileName: file.name,
        originalFile: file,
        originalSize: file.size,
        processedSize: res.size,
        width: res.width,
        height: res.height,
        previewUrl: res.dataUrl,
        resultBlob: res.blob,
        resultFileName: res.fileName,
        settingsSummary:
          activeMode === 'target'
            ? `Target: ${formatBytes(res.size)} (Saved ${res.savingsPercentage}%)`
            : `Quality: ${res.actualQuality}% · ${formatBytes(res.size)}`,
      });
    } catch (err: any) {
      alert('Compression error: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePresetClick = (presetKb: number) => {
    setMode('target');
    setTargetUnit('KB');
    setTargetSizeKb(presetKb);
    setTargetInputVal(presetKb.toString());
    if (fileInfo) {
      runCompression(fileInfo.file, { targetSizeKb: presetKb });
    }
  };

  const handleTargetInputChange = (val: string) => {
    setTargetInputVal(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      const kb = targetUnit === 'MB' ? num * 1024 : num;
      setTargetSizeKb(kb);
    }
  };

  const handleApplySettings = () => {
    if (!fileInfo) return;
    runCompression(fileInfo.file);
  };

  const handleReset = () => {
    setFileInfo(null);
    setResult(null);
    setQuality(80);
    setMode('target');
    setTargetSizeKb(100);
    setTargetInputVal('100');
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Tool Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/50">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>100% Private · Local In-Browser Execution</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111827] dark:text-white tracking-tight">
          Image Compressor
        </h1>
        <p className="text-sm sm:text-base text-[#64748B] dark:text-slate-400 max-w-2xl mx-auto">
          Reduce JPG, PNG, and WebP image sizes to an exact kilobyte target or fine-tune with custom quality sliders.
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
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs">
              <Upload className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <p className="text-base sm:text-lg font-bold text-[#111827] dark:text-white">
                Drag and drop your image here
              </p>
              <p className="text-xs sm:text-sm text-[#64748B] dark:text-slate-400">
                Supports JPG, PNG, and WebP (up to 50 MB)
              </p>
            </div>
            <button
              type="button"
              className="mt-1 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors shadow-2xs"
            >
              Browse Files
            </button>
            <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2 text-xs text-slate-400">
              <span>Quick targets:</span>
              {presets.map((kb) => (
                <span
                  key={kb}
                  className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-300"
                >
                  {kb} KB
                </span>
              ))}
            </div>
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
                  Compression Settings
                </h3>
                <p className="text-xs text-[#64748B] dark:text-slate-400 truncate max-w-[200px]">
                  {fileInfo.name} ({formatBytes(fileInfo.size)})
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

            {/* Mode Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Optimization Mode
              </label>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
                <button
                  type="button"
                  onClick={() => setMode('target')}
                  className={`py-1.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                    mode === 'target'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Target className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  Target Size
                </button>
                <button
                  type="button"
                  onClick={() => setMode('quality')}
                  className={`py-1.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                    mode === 'quality'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                  Quality Slider
                </button>
              </div>
            </div>

            {/* Target Size Mode */}
            {mode === 'target' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Target Max Size
                    </label>
                    <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                      Iterative search
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="5"
                      max="20000"
                      value={targetInputVal}
                      onChange={(e) => handleTargetInputChange(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                    <select
                      value={targetUnit}
                      onChange={(e) => {
                        const newUnit = e.target.value as 'KB' | 'MB';
                        setTargetUnit(newUnit);
                        const num = parseFloat(targetInputVal) || 100;
                        setTargetSizeKb(newUnit === 'MB' ? num * 1024 : num);
                      }}
                      className="px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    >
                      <option value="KB">KB</option>
                      <option value="MB">MB</option>
                    </select>
                  </div>
                </div>

                {/* Common Presets */}
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Quick Presets
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {presets.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => handlePresetClick(preset)}
                        className={`py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                          targetSizeKb === preset && targetUnit === 'KB'
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
                        }`}
                      >
                        {preset} KB
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Quality Slider Mode */}
            {mode === 'quality' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Visual Quality
                  </label>
                  <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {quality}%
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="98"
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Max compression</span>
                  <span>Balanced (80%)</span>
                  <span>Highest detail</span>
                </div>
              </div>
            )}

            {/* Format selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Output Format
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['image/jpeg', 'image/webp', 'image/png'] as const).map((fmt) => {
                  const label = fmt === 'image/jpeg' ? 'JPEG' : fmt === 'image/webp' ? 'WebP' : 'PNG';
                  return (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => {
                        setOutputType(fmt);
                        if (fileInfo) runCompression(fileInfo.file, { outType: fmt });
                      }}
                      className={`py-1.5 text-xs font-medium rounded-lg border transition-all ${
                        outputType === fmt
                          ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-indigo-500 font-semibold shadow-2xs'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recalculate button */}
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleApplySettings}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Compressing locally...</span>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Apply &amp; Recompress</span>
                </>
              )}
            </button>
          </div>

          {/* Results & Comparison View Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Stat Cards */}
            {result && (
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-slate-800 shadow-2xs">
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
                    Original File
                  </span>
                  <span className="text-base font-bold font-mono text-slate-800 dark:text-slate-100">
                    {formatBytes(result.originalSize)}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-slate-800 shadow-2xs">
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
                    Compressed File
                  </span>
                  <span className="text-base font-bold font-mono text-indigo-600 dark:text-indigo-400">
                    {formatBytes(result.size)}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-slate-800 shadow-2xs">
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
                    Size Reduction
                  </span>
                  <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    -{result.savingsPercentage}%
                  </span>
                </div>
              </div>
            )}

            {/* Target size warning if reached minimum clean quality */}
            {result?.note && (
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                  {result.note}
                </p>
              </div>
            )}

            {/* Preview Box */}
            <div className="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Visual Inspection
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs">
                  <button
                    type="button"
                    onClick={() => setPreviewMode('side-by-side')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                      previewMode === 'side-by-side'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Side by Side
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode('split')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                      previewMode === 'split'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Interactive Slider
                  </button>
                </div>
              </div>

              {/* Side-by-side view */}
              {previewMode === 'side-by-side' && result && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Original</span>
                      <span className="font-mono">{formatBytes(result.originalSize)}</span>
                    </div>
                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900 flex items-center justify-center border border-slate-200 dark:border-slate-800 p-2">
                      <img
                        src={fileInfo.dataUrl}
                        alt="Original"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                      <span>Compressed Result</span>
                      <span className="font-mono">{formatBytes(result.size)}</span>
                    </div>
                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900 flex items-center justify-center border border-indigo-200 dark:border-indigo-900/60 p-2">
                      <img
                        src={result.dataUrl}
                        alt="Compressed output"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Interactive Split Slider view */}
              {previewMode === 'split' && result && (
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 select-none">
                  <img
                    src={result.dataUrl}
                    alt="Compressed output"
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ width: `${splitPos}%` }}
                  >
                    <img
                      src={fileInfo.dataUrl}
                      alt="Original"
                      className="absolute inset-0 w-full h-full object-contain"
                      style={{ width: '100%', maxWidth: 'none' }}
                    />
                  </div>
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg cursor-ew-resize flex items-center justify-center"
                    style={{ left: `${splitPos}%` }}
                  >
                    <div className="w-6 h-6 rounded-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shadow-md flex items-center justify-center text-[10px] font-bold text-slate-700 dark:text-slate-300">
                      ↔
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={splitPos}
                    onChange={(e) => setSplitPos(Number(e.target.value))}
                    className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full"
                  />
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-medium backdrop-blur-xs pointer-events-none">
                    Before: {formatBytes(result.originalSize)}
                  </div>
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-indigo-600/90 text-white text-[10px] font-medium backdrop-blur-xs pointer-events-none">
                    After: {formatBytes(result.size)}
                  </div>
                </div>
              )}

              {/* Download Action Bar */}
              {result && (
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Output: <span className="font-mono text-slate-700 dark:text-slate-200">{result.width} × {result.height} px</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => triggerDownload(result.blob, result.fileName)}
                    className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Compressed Image ({formatBytes(result.size)})</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Session History: Recent Images Processed in this Tool */}
      <SessionHistoryView
        toolId="image-compressor"
        toolName="Image Compressor"
        onSelectForReprocess={handleFile}
      />

      <AdSlot placement="tool-bottom" />
    </div>
  );
};
