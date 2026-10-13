import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { getStoredString, setStoredString } from '@/lib/storage';
import { dayKey } from '@/lib/dates';

export type Note = {
  id: string;
  book?: string;
  bookName?: string;
  chapter?: number;
  verse?: number;
  quote?: string;
  body: string;
  updatedAt: number;
};

export type SavedVerse = {
  id: string;
  book: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
  translation: string;
  savedAt: number;
};

export type LastRead = { book: string; chapter: number; progress: number };

type Persisted = {
  notes: Note[];
  saved: SavedVerse[];
  lastRead: LastRead | null;
  readDays: string[];
  planStart: string;
};

type LibraryContextValue = Persisted & {
  hydrated: boolean;
  streak: number;
  saveNote: (note: Partial<Note> & { body: string }) => void;
  deleteNote: (id: string) => void;
  toggleSaved: (verse: Omit<SavedVerse, 'id' | 'savedAt'>) => void;
  removeSaved: (id: string) => void;
  isSaved: (book: string, chapter: number, verse: number, translation: string) => boolean;
  setLastRead: (value: LastRead) => void;
  markReadToday: () => void;
  restartPlan: () => void;
};

const STORAGE_KEY = '@reader-library';

const LibraryContext = createContext<LibraryContextValue | null>(null);

function createId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

function savedId(book: string, chapter: number, verse: number, translation: string): string {
  return `${translation}:${book}:${chapter}:${verse}`;
}

function computeStreak(days: string[]): number {
  const set = new Set(days);
  const cursor = new Date();
  if (!set.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let count = 0;
  while (set.has(dayKey(cursor))) {
    count += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}

function initialState(): Persisted {
  return { notes: [], saved: [], lastRead: null, readDays: [], planStart: dayKey() };
}

function sanitize(input: any): Persisted {
  const base = initialState();
  if (!input || typeof input !== 'object') return base;
  return {
    notes: Array.isArray(input.notes) ? input.notes : base.notes,
    saved: Array.isArray(input.saved) ? input.saved : base.saved,
    lastRead:
      input.lastRead && typeof input.lastRead.book === 'string' && Number(input.lastRead.chapter) > 0
        ? {
            book: input.lastRead.book,
            chapter: Number(input.lastRead.chapter),
            progress: Math.min(1, Math.max(0, Number(input.lastRead.progress) || 0)),
          }
        : null,
    readDays: Array.isArray(input.readDays) ? input.readDays.filter((d: any) => typeof d === 'string') : [],
    planStart: typeof input.planStart === 'string' && input.planStart ? input.planStart : base.planStart,
  };
}

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Persisted>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const raw = await getStoredString(STORAGE_KEY);
        if (mounted && raw) setState(sanitize(JSON.parse(raw)));
      } catch {
        return;
      } finally {
        if (mounted) setHydrated(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const timer = setTimeout(() => {
      setStoredString(STORAGE_KEY, JSON.stringify(state)).catch(() => undefined);
    }, 400);
    return () => clearTimeout(timer);
  }, [state, hydrated]);

  const saveNote = useCallback((note: Partial<Note> & { body: string }) => {
    setState((prev) => {
      const now = Date.now();
      if (note.id && prev.notes.some((n) => n.id === note.id)) {
        return {
          ...prev,
          notes: prev.notes.map((n) => (n.id === note.id ? { ...n, ...note, updatedAt: now } : n)),
        };
      }
      const created: Note = { ...note, id: createId(), updatedAt: now };
      return { ...prev, notes: [created, ...prev.notes] };
    });
  }, []);

  const deleteNote = useCallback((id: string) => {
    setState((prev) => ({ ...prev, notes: prev.notes.filter((n) => n.id !== id) }));
  }, []);

  const toggleSaved = useCallback((verse: Omit<SavedVerse, 'id' | 'savedAt'>) => {
    setState((prev) => {
      const id = savedId(verse.book, verse.chapter, verse.verse, verse.translation);
      if (prev.saved.some((s) => s.id === id)) {
        return { ...prev, saved: prev.saved.filter((s) => s.id !== id) };
      }
      return { ...prev, saved: [{ ...verse, id, savedAt: Date.now() }, ...prev.saved] };
    });
  }, []);

  const removeSaved = useCallback((id: string) => {
    setState((prev) => ({ ...prev, saved: prev.saved.filter((s) => s.id !== id) }));
  }, []);

  const setLastRead = useCallback((value: LastRead) => {
    setState((prev) => ({ ...prev, lastRead: value }));
  }, []);

  const markReadToday = useCallback(() => {
    const today = dayKey();
    setState((prev) => {
      if (prev.readDays.includes(today)) return prev;
      return { ...prev, readDays: [...prev.readDays, today].slice(-400) };
    });
  }, []);

  const restartPlan = useCallback(() => {
    setState((prev) => ({ ...prev, planStart: dayKey() }));
  }, []);

  const isSaved = useCallback(
    (book: string, chapter: number, verse: number, translation: string) =>
      state.saved.some((s) => s.id === savedId(book, chapter, verse, translation)),
    [state.saved],
  );

  const streak = useMemo(() => computeStreak(state.readDays), [state.readDays]);

  const value = useMemo<LibraryContextValue>(
    () => ({
      ...state,
      hydrated,
      streak,
      saveNote,
      deleteNote,
      toggleSaved,
      removeSaved,
      isSaved,
      setLastRead,
      markReadToday,
      restartPlan,
    }),
    [
      state,
      hydrated,
      streak,
      saveNote,
      deleteNote,
      toggleSaved,
      removeSaved,
      isSaved,
      setLastRead,
      markReadToday,
      restartPlan,
    ],
  );

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary(): LibraryContextValue {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error('useLibrary must be used within LibraryProvider');
  return ctx;
}
