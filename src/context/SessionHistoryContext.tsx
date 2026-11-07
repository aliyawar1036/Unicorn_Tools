import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { SessionHistoryItem } from '../types';
import {
  saveHistoryItemToDb,
  getAllHistoryItemsFromDb,
  deleteHistoryItemFromDb,
  clearAllHistoryItemsFromDb,
  deleteToolHistoryFromDb,
} from '../lib/historyDb';

const STORAGE_KEY = 'unicorntools_history';

interface ReloadTarget {
  toolId: string;
  file: File;
  timestamp: number;
}

interface SessionHistoryContextType {
  history: SessionHistoryItem[];
  addToHistory: (item: Omit<SessionHistoryItem, 'id' | 'timestamp'>) => void;
  removeFromHistory: (id: string) => void;
  clearToolHistory: (toolId: string) => void;
  clearHistory: () => void;
  clearAllHistory: () => void;
  getToolHistory: (toolId: string) => SessionHistoryItem[];
  activeReload: ReloadTarget | null;
  triggerReloadInTool: (toolId: string, file: File) => void;
  clearActiveReload: () => void;
  isLoading: boolean;
}

const SessionHistoryContext = createContext<SessionHistoryContextType | undefined>(undefined);

export const SessionHistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<SessionHistoryItem[]>([]);
  const [activeReload, setActiveReload] = useState<ReloadTarget | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Track active blob object URLs so we can cleanly revoke them and avoid memory leaks
  const activeObjectUrls = useRef<Set<string>>(new Set());

  const registerObjectUrl = (url: string) => {
    if (url.startsWith('blob:')) {
      activeObjectUrls.current.add(url);
    }
  };

  const releaseObjectUrl = (url?: string) => {
    if (url && url.startsWith('blob:') && activeObjectUrls.current.has(url)) {
      try {
        URL.revokeObjectURL(url);
      } catch {
        // ignore
      }
      activeObjectUrls.current.delete(url);
    }
  };

  // Restore history from IndexedDB on initial mount
  useEffect(() => {
    let isMounted = true;

    async function loadStoredHistory() {
      try {
        const stored = await getAllHistoryItemsFromDb();
        if (!isMounted) return;

        const restoredItems: SessionHistoryItem[] = [];

        for (const rec of stored) {
          // Verify that file or blob actually exists and is non-empty
          const sourceBlob = rec.resultBlob || rec.originalFile;
          if (!sourceBlob || !(sourceBlob instanceof Blob)) {
            continue; // Skip invalid or missing entries
          }

          let previewUrl = '';
          try {
            previewUrl = URL.createObjectURL(sourceBlob);
            registerObjectUrl(previewUrl);
          } catch {
            continue;
          }

          restoredItems.push({
            id: rec.id,
            toolId: rec.toolId,
            toolName: rec.toolName,
            fileName: rec.fileName,
            originalFile: rec.originalFile instanceof File ? rec.originalFile : (rec.originalFile as any),
            originalSize: rec.originalSize,
            processedSize: rec.processedSize,
            width: rec.width,
            height: rec.height,
            previewUrl,
            resultBlob: rec.resultBlob,
            resultFileName: rec.resultFileName,
            settingsSummary: rec.settingsSummary,
            timestamp: rec.timestamp,
          });
        }

        setHistory(restoredItems);
      } catch (err) {
        console.warn('Could not restore history from IndexedDB:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadStoredHistory();

    return () => {
      isMounted = false;
      // Revoke all generated object URLs on unmount
      activeObjectUrls.current.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch {
          // ignore
        }
      });
      activeObjectUrls.current.clear();
    };
  }, []);

  const addToHistory = useCallback((item: Omit<SessionHistoryItem, 'id' | 'timestamp'>) => {
    const id = `${item.toolId}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const timestamp = Date.now();

    let previewUrl = item.previewUrl;
    // Ensure preview URL is a tracked blob URL or data URL
    if (previewUrl && previewUrl.startsWith('blob:')) {
      registerObjectUrl(previewUrl);
    } else if (item.resultBlob || item.originalFile) {
      try {
        previewUrl = URL.createObjectURL(item.resultBlob || item.originalFile!);
        registerObjectUrl(previewUrl);
      } catch {
        // keep existing
      }
    }

    const newItem: SessionHistoryItem = {
      ...item,
      id,
      timestamp,
      previewUrl,
    };

    setHistory((prev) => {
      const filtered = prev.filter((h) => h.fileName !== item.fileName || h.toolId !== item.toolId);
      const updated = [newItem, ...filtered].slice(0, 20);
      return updated;
    });

    // Asynchronously persist to IndexedDB
    if (item.originalFile) {
      saveHistoryItemToDb({
        id,
        toolId: item.toolId,
        toolName: item.toolName,
        fileName: item.fileName,
        originalFile: item.originalFile,
        originalSize: item.originalSize,
        processedSize: item.processedSize,
        width: item.width,
        height: item.height,
        resultBlob: item.resultBlob,
        resultFileName: item.resultFileName,
        settingsSummary: item.settingsSummary,
        timestamp,
      }).catch((e) => console.warn('IndexedDB save failed:', e));
    }
  }, []);

  const removeFromHistory = useCallback((id: string) => {
    setHistory((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) {
        releaseObjectUrl(target.previewUrl);
      }
      return prev.filter((item) => item.id !== id);
    });

    deleteHistoryItemFromDb(id).catch((e) => console.warn('IndexedDB delete failed:', e));
  }, []);

  const clearToolHistory = useCallback((toolId: string) => {
    setHistory((prev) => {
      prev.filter((item) => item.toolId === toolId).forEach((it) => releaseObjectUrl(it.previewUrl));
      return prev.filter((item) => item.toolId !== toolId);
    });

    deleteToolHistoryFromDb(toolId).catch((e) => console.warn('IndexedDB delete tool failed:', e));
  }, []);

  const clearHistory = useCallback(() => {
    // Revoke all preview URLs
    history.forEach((it) => releaseObjectUrl(it.previewUrl));
    activeObjectUrls.current.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch {
        // ignore
      }
    });
    activeObjectUrls.current.clear();

    setHistory([]);
    setActiveReload(null);

    // Clear IndexedDB store
    clearAllHistoryItemsFromDb().catch((e) => console.warn('IndexedDB clear failed:', e));

    // Clear legacy localStorage keys
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('unicorntools_session_history');
      localStorage.removeItem('unicorntools_recent_files');
    } catch {
      // ignore
    }
  }, [history]);

  const clearAllHistory = clearHistory;

  const getToolHistory = useCallback(
    (toolId: string) => {
      return history.filter((item) => item.toolId === toolId);
    },
    [history]
  );

  const triggerReloadInTool = useCallback((toolId: string, file: File) => {
    setActiveReload({
      toolId,
      file,
      timestamp: Date.now(),
    });
  }, []);

  const clearActiveReload = useCallback(() => {
    setActiveReload(null);
  }, []);

  return (
    <SessionHistoryContext.Provider
      value={{
        history,
        addToHistory,
        removeFromHistory,
        clearToolHistory,
        clearHistory,
        clearAllHistory,
        getToolHistory,
        activeReload,
        triggerReloadInTool,
        clearActiveReload,
        isLoading,
      }}
    >
      {children}
    </SessionHistoryContext.Provider>
  );
};

export function useSessionHistory() {
  const context = useContext(SessionHistoryContext);
  if (!context) {
    throw new Error('useSessionHistory must be used within a SessionHistoryProvider');
  }
  return context;
}
