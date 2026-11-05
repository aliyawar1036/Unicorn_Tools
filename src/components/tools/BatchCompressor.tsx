import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Download,
  RotateCcw,
  ShieldCheck,
  Archive,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  formatBytes,
  compressImage,
  createZipPackage,
  triggerDownload,
} from '../../lib/imageProcessor';
import { BatchItem } from '../../types';
import { AdSlot } from '../AdSlot';
import { useSessionHistory } from '../../context/SessionHistoryContext';
import { SessionHistoryView } from '../SessionHistoryView';

export const BatchCompressor: React.FC = () => {
  const { addToHistory, activeReload, clearActiveReload } = useSessionHistory();
  const [items, setItems] = useState<BatchItem[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [quality, setQuality] = useState<number>(80);
  const [targetKb, setTargetKb] = useState<number>(0);
  const [outputType, setOutputType] = useState<'image/jpeg' | 'image/webp'>('image/jpeg');
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeReload && activeReload.toolId === 'batch-image-compressor') {
      handleFiles([activeReload.file]);
      clearActiveReload();
    }
  }, [activeReload, clearActiveReload]);

  const handleFiles = (fileList: FileList | File[]) => {
    const validFiles: BatchItem[] = [];
    const filesArray = Array.from(fileList);

    filesArray.forEach((file) => {
      if (file.type.match(/^image\/(jpeg|png|webp)$/i)) {
        validFiles.push({
          id: Math.random().toString(36).substring(2, 9),
          file,
          name: file.name,
          originalSize: file.size,
          status: 'pending',
          progress: 0,
        });
      }
    });

    if (validFiles.length === 0) {
      alert('Please upload valid JPG, PNG, or WebP images.');
      return;
    }

    setItems((prev) => [...prev, ...validFiles]);
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleProcessBatch = async () => {
    if (items.length === 0 || isProcessing) return;
    setIsProcessing(true);

    const updated = [...items];

    for (let i = 0; i < updated.length; i++) {
      const current = updated[i];
      if (current.status === 'completed') continue;

      current.status = 'processing';
      current.progress = 25;
      setItems([...updated]);

      try {
        current.progress = 60;
        const res = await compressImage(current.file, {
          quality: quality / 100,
          targetSizeKb: targetKb > 0 ? targetKb : undefined,
          outputType,
        });

        current.result = res;
        current.status = 'completed';
        current.progress = 100;

        addToHistory({
          toolId: 'batch-image-compressor',
          toolName: 'Batch Image Compressor',
          fileName: current.name,
          originalFile: current.file,
          originalSize: current.originalSize,
          processedSize: res.size,
          width: res.width,
          height: res.height,
          previewUrl: res.dataUrl,
          resultBlob: res.blob,
          resultFileName: res.fileName,
          settingsSummary: `Batch Quality ${quality}% · ${formatBytes(res.size)}`,
        });
      } catch (err: any) {
        current.status = 'error';
        current.error = err.message || 'Compression failed';
      }

      setItems([...updated]);
    }

    setIsProcessing(false);
  };

  const handleDownloadZip = async () => {
    const completedItems = items.filter((it) => it.status === 'completed' && it.result);
    if (completedItems.length === 0) return;

    setIsZipping(true);
    try {
      const zipPayload = completedItems.map((it) => ({
        name: it.result!.fileName,
        blob: it.result!.blob,
      }));
      const zipBlob = await createZipPackage(zipPayload);
      triggerDownload(zipBlob, `unicorntools_batch_${Date.now()}.zip`);
    } catch (err: any) {
      alert('Failed to generate ZIP archive: ' + err.message);
    } finally {
      setIsZipping(false);
    }
  };

  const handleResetAll = () => {
    setItems([]);
  };

  const totalOriginal = items.reduce((acc, curr) => acc + curr.originalSize, 0);
  const totalCompressed = items.reduce((acc, curr) => {
    return acc + (curr.result ? curr.result.size : curr.originalSize);
  }, 0);
  const totalSavings =
    totalOriginal > 0 ? Math.max(0, Math.round(((totalOriginal - totalCompressed) / totalOriginal) * 100)) : 0;
  const completedCount = items.filter((it) => it.status === 'completed').length;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/80">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>100% Private · In-Browser Multi-File Compression</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Batch Image Compressor
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Compress dozens of photos at once locally in your browser. Download individually or as a single packaged ZIP.
        </p>
      </div>

      <AdSlot placement="tool-top" />

      {/* Batch Upload Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files) {
            handleFiles(e.dataTransfer.files);
          }
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 scale-[1.01]'
            : 'border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-900'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            if (e.target.files) {
              handleFiles(e.target.files);
            }
          }}
        />
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center shadow-xs">
            <Layers className="w-7 h-7" />
          </div>
          <div>
            <p className="text-base font-bold text-slate-900 dark:text-white">
              Drop multiple photos here, or <span className="text-indigo-600 dark:text-indigo-400 underline">select files</span>
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Select 10, 20, or 50+ images at once (JPG, PNG, WebP)
            </p>
          </div>
        </div>
      </div>

      {/* Controls & Queue List */}
      {items.length > 0 && (
        <div className="space-y-6">
          {/* Settings toolbar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Target Quality:
                </label>
                <select
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  disabled={isProcessing}
                  className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-medium"
                >
                  <option value={90}>90% (High Detail)</option>
                  <option value={80}>80% (Recommended)</option>
                  <option value={70}>70% (Medium)</option>
                  <option value={50}>50% (Max Compression)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Output Format:
                </label>
                <select
                  value={outputType}
                  onChange={(e) => setOutputType(e.target.value as any)}
                  disabled={isProcessing}
                  className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-medium"
                >
                  <option value="image/jpeg">JPEG (.jpg)</option>
                  <option value="image/webp">WebP (.webp)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleResetAll}
                disabled={isProcessing}
                className="px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Clear All
              </button>
              <button
                type="button"
                onClick={handleProcessBatch}
                disabled={isProcessing || completedCount === items.length}
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Compressing Batch...</span>
                  </>
                ) : (
                  <span>Compress All ({items.length} files)</span>
                )}
              </button>
              {completedCount > 0 && (
                <button
                  type="button"
                  onClick={handleDownloadZip}
                  disabled={isZipping}
                  className="px-4 py-2 text-xs font-bold text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all flex items-center gap-1.5"
                >
                  {isZipping ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Archive className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  )}
                  <span>Download ZIP ({completedCount})</span>
                </button>
              )}
            </div>
          </div>

          {/* Aggregate Summary */}
          {completedCount > 0 && (
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
                  Total Original
                </span>
                <span className="text-base font-bold font-mono text-slate-800 dark:text-slate-100">
                  {formatBytes(totalOriginal)}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
                  Total Compressed
                </span>
                <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  {formatBytes(totalCompressed)}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
                  Batch Savings
                </span>
                <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  -{totalSavings}%
                </span>
              </div>
            </div>
          )}

          {/* Items Table / List */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs divide-y divide-slate-100 dark:divide-slate-800">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    {item.status === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    ) : item.status === 'processing' ? (
                      <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                    ) : item.status === 'error' ? (
                      <AlertCircle className="w-4 h-4 text-rose-500" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span>{formatBytes(item.originalSize)}</span>
                      {item.result && (
                        <>
                          <span>&rarr;</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            {formatBytes(item.result.size)} (-{item.result.savingsPercentage}%)
                          </span>
                        </>
                      )}
                      {item.error && (
                        <span className="text-rose-500">{item.error}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {item.result && (
                    <button
                      type="button"
                      onClick={() => triggerDownload(item.result!.blob, item.result!.fileName)}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  )}
                  {!isProcessing && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Remove file"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Session History */}
      <SessionHistoryView
        toolId="batch-image-compressor"
        toolName="Batch Image Compressor"
        onSelectForReprocess={(file) => handleFiles([file])}
      />

      <AdSlot placement="tool-bottom" />
    </div>
  );
};
