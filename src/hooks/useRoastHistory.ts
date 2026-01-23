import { useState, useEffect, useCallback } from 'react';
import { RoastResponse, Language } from '@/types/roast';

export interface HistoryEntry {
  id: string;
  timestamp: number;
  originalCode: string;
  language: Language;
  result: RoastResponse;
}

const HISTORY_KEY = 'roast_history';
const MAX_HISTORY = 20;

export function useRoastHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load roast history:', error);
    }
  }, []);

  // Save to localStorage whenever history changes
  const saveHistory = useCallback((newHistory: HistoryEntry[]) => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
      setHistory(newHistory);
    } catch (error) {
      console.error('Failed to save roast history:', error);
    }
  }, []);

  const addToHistory = useCallback((
    originalCode: string,
    language: Language,
    result: RoastResponse
  ) => {
    const newEntry: HistoryEntry = {
      id: `roast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      originalCode,
      language,
      result,
    };

    const updatedHistory = [newEntry, ...history].slice(0, MAX_HISTORY);
    saveHistory(updatedHistory);
  }, [history, saveHistory]);

  const deleteFromHistory = useCallback((id: string) => {
    const updatedHistory = history.filter(entry => entry.id !== id);
    saveHistory(updatedHistory);
  }, [history, saveHistory]);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(HISTORY_KEY);
    setHistory([]);
  }, []);

  const getEntry = useCallback((id: string) => {
    return history.find(entry => entry.id === id);
  }, [history]);

  return {
    history,
    addToHistory,
    deleteFromHistory,
    clearHistory,
    getEntry,
  };
}
