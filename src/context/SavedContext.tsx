import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';

interface SavedContextValue {
  saved: Set<string>;
  isSaved: (id: string) => boolean;
  toggleSaved: (id: string) => void;
  count: number;
}

const SavedContext = createContext<SavedContextValue | undefined>(undefined);

export function SavedProvider({ children }: { children: React.ReactNode }) {
  // In-memory for V1. Swap for AsyncStorage / backend in V2.
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const toggleSaved = useCallback((id: string) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const value = useMemo<SavedContextValue>(
    () => ({
      saved,
      isSaved: (id: string) => saved.has(id),
      toggleSaved,
      count: saved.size,
    }),
    [saved, toggleSaved],
  );

  return <SavedContext.Provider value={value}>{children}</SavedContext.Provider>;
}

export function useSaved(): SavedContextValue {
  const ctx = useContext(SavedContext);
  if (!ctx) throw new Error('useSaved must be used within a SavedProvider');
  return ctx;
}
