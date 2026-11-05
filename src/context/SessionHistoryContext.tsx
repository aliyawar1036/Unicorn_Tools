import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { SessionHistoryItem } from '../types';

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
}

const SessionHistoryContext = createContext<SessionHistoryContextType | undefined>(undefined);

export const SessionHistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<SessionHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [activeReload, setActiveReload] = useState<ReloadTarget | null>(null);

  // Sync serializable history metadata to localStorage
  const syncToStorage = (items: SessionHistoryItem[]) => {
    try {
      const serializable = items.map(({ originalFile, resultBlob, ...rest }) => rest);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
    } catch {
      // ignore
    }
  };

  const addToHistory = useCallback((item: Omit<SessionHistoryItem, 'id' | 'timestamp'>) => {
    const newItem: SessionHistoryItem = {
      ...item,
      id: `${item.toolId}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
    };

    setHistory((prev) => {
      // Keep up to 20 recent items across the session to stay memory-efficient
      const filtered = prev.filter((h) => h.fileName !== item.fileName || h.toolId !== item.toolId);
      const updated = [newItem, ...filtered].slice(0, 20);
      syncToStorage(updated);
      return updated;
    });
  }, []);

  const removeFromHistory = useCallback((id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      syncToStorage(updated);
      return updated;
    });
  }, []);

  const clearToolHistory = useCallback((toolId: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.toolId !== toolId);
      syncToStorage(updated);
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    setActiveReload(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('unicorntools_session_history');
      localStorage.removeItem('unicorntools_recent_files');
    } catch {
      // ignore
    }
  }, []);

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
