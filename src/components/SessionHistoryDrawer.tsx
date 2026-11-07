import React, { useState } from 'react';
import { useSessionHistory } from '../context/SessionHistoryContext';
import { formatBytes, triggerDownload } from '../lib/imageProcessor';
import {
  X,
  History,
  Download,
  RotateCcw,
  Trash2,
  Clock,
  Layers,
  Check,
} from 'lucide-react';

interface SessionHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTool: (path: string) => void;
}

export const SessionHistoryDrawer: React.FC<SessionHistoryDrawerProps> = ({
  isOpen,
  onClose,
  onNavigateToTool,
}) => {
  const { history, removeFromHistory, clearHistory, triggerReloadInTool } = useSessionHistory();
  const [clearedNotice, setClearedNotice] = useState(false);

  if (!isOpen) return null;

  const toolPaths: Record<string, string> = {
    'image-compressor': '/tools/image-compressor',
    'image-resizer': '/tools/image-resizer',
    'image-converter': '/tools/image-converter',
    'image-size-checker': '/tools/image-size-checker',
    'batch-image-compressor': '/tools/batch-image-compressor',
  };

  const formatRelativeTime = (timestamp: number) => {
    const elapsedSeconds = Math.floor((Date.now() - timestamp) / 1000);
    if (elapsedSeconds < 30) return 'Just now';
    if (elapsedSeconds < 60) return `${elapsedSeconds}s ago`;
    const elapsedMinutes = Math.floor(elapsedSeconds / 60);
    if (elapsedMinutes < 60) return `${elapsedMinutes}m ago`;
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleReprocess = (item: any) => {
    if (!item.originalFile) return;
    const targetPath = toolPaths[item.toolId] || '/tools/image-compressor';
    triggerReloadInTool(item.toolId, item.originalFile);
    onNavigateToTool(targetPath);
    onClose();
  };

  const handleClearAll = () => {
    clearHistory();
    setClearedNotice(true);
    setTimeout(() => setClearedNotice(false), 2500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-[#111827] border-l border-slate-200 dark:border-slate-800 w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Session History</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
                  {history.length}
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Recent files processed in this session
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Header Clear All button */}
            {history.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="px-2.5 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors flex items-center gap-1"
                title="Remove all session items from context and storage"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close session history"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feedback banner if cleared */}
        {clearedNotice && (
          <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2 border-b border-emerald-100 dark:border-emerald-900/40">
            <Check className="w-3.5 h-3.5" />
            <span>Session history and local cache cleared.</span>
          </div>
        )}

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  No images in session
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
                  When you compress, resize, or convert images, they will appear here for instant re-download and re-processing.
                </p>
              </div>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-3 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center shrink-0 p-1">
                    <img
                      src={item.previewUrl}
                      alt={item.fileName}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                        {item.toolName}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-0.5 font-mono">
                        <Clock className="w-2.5 h-2.5" />
                        {formatRelativeTime(item.timestamp)}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {item.fileName}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {item.settingsSummary}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {item.originalFile && (
                      <button
                        type="button"
                        onClick={() => handleReprocess(item)}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                        <span>Re-process</span>
                      </button>
                    )}
                    {item.resultBlob && item.resultFileName && (
                      <button
                        type="button"
                        onClick={() => triggerDownload(item.resultBlob!, item.resultFileName!)}
                        className="px-2.5 py-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download</span>
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromHistory(item.id)}
                    className="p-1 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer with Clear All */}
        {history.length > 0 && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              {history.length} {history.length === 1 ? 'file' : 'files'} in session
            </span>
            <button
              type="button"
              onClick={handleClearAll}
              className="text-rose-600 dark:text-rose-400 hover:underline font-semibold flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
