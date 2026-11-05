import React from 'react';
import { useSessionHistory } from '../context/SessionHistoryContext';
import { formatBytes, triggerDownload } from '../lib/imageProcessor';
import {
  History,
  Download,
  RotateCcw,
  Trash2,
  Clock,
} from 'lucide-react';

interface SessionHistoryViewProps {
  toolId: string;
  toolName: string;
  onSelectForReprocess?: (file: File) => void;
  className?: string;
}

export const SessionHistoryView: React.FC<SessionHistoryViewProps> = ({
  toolId,
  toolName,
  onSelectForReprocess,
  className = '',
}) => {
  const { getToolHistory, removeFromHistory, clearToolHistory, triggerReloadInTool } =
    useSessionHistory();

  const toolHistory = getToolHistory(toolId);

  if (toolHistory.length === 0) {
    return null;
  }

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
    if (onSelectForReprocess) {
      onSelectForReprocess(item.originalFile);
    } else {
      triggerReloadInTool(toolId, item.originalFile);
    }
  };

  return (
    <section
      aria-label={`Session History for ${toolName}`}
      className={`bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4 transition-all ${className}`}
    >
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Recent Session Images</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/40">
                {toolHistory.length} {toolHistory.length === 1 ? 'file' : 'files'}
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Quickly re-download or reload recent files processed in this tool
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => clearToolHistory(toolId)}
          className="self-start sm:self-center text-xs text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Tool History</span>
        </button>
      </div>

      {/* History Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {toolHistory.map((item) => {
          const hasSavings =
            item.processedSize &&
            item.originalSize > 0 &&
            item.processedSize < item.originalSize;
          const savingsPct = hasSavings
            ? Math.round(((item.originalSize - item.processedSize!) / item.originalSize) * 100)
            : 0;

          return (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between gap-3 group"
            >
              <div className="flex items-start gap-3">
                {/* Thumbnail Preview */}
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 p-1">
                  <img
                    src={item.previewUrl}
                    alt={item.fileName}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4
                      className="text-xs font-bold text-slate-900 dark:text-white truncate"
                      title={item.fileName}
                    >
                      {item.fileName}
                    </h4>
                    <span className="text-[10px] text-slate-400 shrink-0 flex items-center gap-1 font-mono">
                      <Clock className="w-2.5 h-2.5" />
                      {formatRelativeTime(item.timestamp)}
                    </span>
                  </div>

                  {/* Size info */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                    <span className="font-mono text-[11px] text-slate-400">
                      {formatBytes(item.originalSize)}
                    </span>
                    {item.processedSize && (
                      <>
                        <span className="text-slate-400">&rarr;</span>
                        <span className="font-mono font-semibold text-slate-900 dark:text-white">
                          {formatBytes(item.processedSize)}
                        </span>
                        {savingsPct > 0 && (
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded">
                            -{savingsPct}%
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  {/* Settings summary */}
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {item.settingsSummary}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {/* Re-process */}
                  {item.originalFile && (
                    <button
                      type="button"
                      onClick={() => handleReprocess(item)}
                      className="px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
                      title="Load image back into tool"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span>Re-process</span>
                    </button>
                  )}

                  {/* Re-download */}
                  {item.resultBlob && item.resultFileName && (
                    <button
                      type="button"
                      onClick={() => triggerDownload(item.resultBlob!, item.resultFileName!)}
                      className="px-3 py-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                      title="Re-download processed image"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  )}
                </div>

                {/* Remove single item */}
                <button
                  type="button"
                  onClick={() => removeFromHistory(item.id)}
                  className="p-1 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
                  title="Remove from history"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
