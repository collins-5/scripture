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
import {
  scriptureService,
  ServerNote,
  ServerSavedVerse,
  SavedVerseInput,
} from '@/lib/services/scriptureService';

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
  lastRead: LastRead | null;
  readDays: string[];
  planStart: string;
};

type LibraryContextValue = Persisted & {
  hydrated: boolean;
  streak: number;
  notes: Note[];
  notesLoading: boolean;
  refreshNotes: () => Promise<void>;
  saveNote: (note: Partial<Note> & { body: string }) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  saved: SavedVerse[];
  savedLoading: boolean;
  refreshSaved: () => Promise<void>;
  toggleSaved: (verse: SavedVerseInput) => Promise<void>;
  removeSaved: (id: string) => Promise<void>;
  isSaved: (
    book: string,
    chapter: number,
    verse: number,
    translation: string,
  ) => boolean;
  setLastRead: (value: LastRead) => void;
  markReadToday: () => void;
  restartPlan: () => void;
};

const STORAGE_KEY = '@reader-library';

const LibraryContext = createContext<LibraryContextValue | null>(null);

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
  return { lastRead: null, readDays: [], planStart: dayKey() };
}

function sanitize(input: any): Persisted {
  const base = initialState();
  if (!input || typeof input !== 'object') return base;
  return {
    lastRead:
      input.lastRead &&
      typeof input.lastRead.book === 'string' &&
      Number(input.lastRead.chapter) > 0
        ? {
            book: input.lastRead.book,
            chapter: Number(input.lastRead.chapter),
            progress: Math.min(
              1,
              Math.max(0, Number(input.lastRead.progress) || 0),
            ),
          }
        : null,
    readDays: Array.isArray(input.readDays)
      ? input.readDays.filter((d: any) => typeof d === 'string')
      : [],
    planStart:
      typeof input.planStart === 'string' && input.planStart
        ? input.planStart
        : base.planStart,
  };
}

function noteFromServer(raw: ServerNote): Note {
  return {
    id: String(raw._id),
    book: raw.book || undefined,
    bookName: raw.bookName || undefined,
    chapter: raw.chapter ?? undefined,
    verse: raw.verse ?? undefined,
    quote: raw.quote ?? '',
    body: String(raw.body ?? ''),
    updatedAt: raw.updatedAt
      ? new Date(raw.updatedAt).getTime()
      : raw.createdAt
      ? new Date(raw.createdAt).getTime()
      : Date.now(),
  };
}

function savedFromServer(raw: ServerSavedVerse): SavedVerse {
  return {
    id: String(raw._id),
    book: raw.book,
    bookName: raw.bookName,
    chapter: raw.chapter,
    verse: raw.verse,
    text: raw.text,
    translation: raw.translation,
    savedAt: raw.createdAt ? new Date(raw.createdAt).getTime() : Date.now(),
  };
}

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Persisted>(initialState);
  const [hydrated, setHydrated] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [saved, setSaved] = useState<SavedVerse[]>([]);
  const [savedLoading, setSavedLoading] = useState(false);

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
      setStoredString(STORAGE_KEY, JSON.stringify(state)).catch(
        () => undefined,
      );
    }, 400);
    return () => clearTimeout(timer);
  }, [state, hydrated]);

  const refreshNotes = useCallback(async () => {
    setNotesLoading(true);
    try {
      const rows = await scriptureService.getUserNotes();
      setNotes(rows.map(noteFromServer));
    } catch {
      return;
    } finally {
      setNotesLoading(false);
    }
  }, []);

  const saveNote = useCallback(
    async (note: Partial<Note> & { body: string }) => {
      const trimmed = note.body.trim();
      if (!trimmed) return;

      if (note.id) {
        const updated = await scriptureService.updateNote(note.id, {
          book: note.book ?? '',
          bookName: note.bookName ?? '',
          chapter: note.chapter ?? null,
          verse: note.verse ?? null,
          quote: note.quote ?? '',
          body: trimmed,
        });
        const mapped = noteFromServer(updated);
        setNotes((prev) => prev.map((n) => (n.id === mapped.id ? mapped : n)));
        return;
      }

      const created = await scriptureService.createNote({
        book: note.book ?? '',
        bookName: note.bookName ?? '',
        chapter: note.chapter ?? null,
        verse: note.verse ?? null,
        quote: note.quote ?? '',
        body: trimmed,
      });
      setNotes((prev) => [noteFromServer(created), ...prev]);
    },
    [],
  );

  const deleteNote = useCallback(async (id: string) => {
    await scriptureService.deleteNote(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const refreshSaved = useCallback(async () => {
    setSavedLoading(true);
    try {
      const rows = await scriptureService.getSavedVerses();
      setSaved(rows.map(savedFromServer));
    } catch {
      return;
    } finally {
      setSavedLoading(false);
    }
  }, []);

  const toggleSaved = useCallback(
    async (verse: SavedVerseInput) => {
      const existing = saved.find(
        (s) =>
          s.book === verse.book &&
          s.chapter === verse.chapter &&
          s.verse === verse.verse &&
          s.translation === verse.translation,
      );

      if (existing) {
        setSaved((prev) => prev.filter((s) => s.id !== existing.id));
      } else {
        const optimistic: SavedVerse = {
          ...verse,
          id: `temp-${Date.now()}`,
          savedAt: Date.now(),
        };
        setSaved((prev) => [optimistic, ...prev]);
      }

      try {
        const result = await scriptureService.toggleSavedVerse(verse);
        if (result.saved && result.entry) {
          const mapped = savedFromServer(result.entry);
          setSaved((prev) => [
            mapped,
            ...prev.filter((s) => !s.id.startsWith('temp-')),
          ]);
        } else {
          setSaved((prev) => prev.filter((s) => !s.id.startsWith('temp-')));
        }
      } catch {
        await refreshSaved();
      }
    },
    [saved, refreshSaved],
  );

  const removeSaved = useCallback(
    async (id: string) => {
      setSaved((prev) => prev.filter((s) => s.id !== id));
      try {
        await scriptureService.deleteSavedVerse(id);
      } catch {
        await refreshSaved();
      }
    },
    [refreshSaved],
  );

  const isSaved = useCallback(
    (book: string, chapter: number, verse: number, translation: string) =>
      saved.some(
        (s) =>
          s.book === book &&
          s.chapter === chapter &&
          s.verse === verse &&
          s.translation === translation,
      ),
    [saved],
  );

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

  const streak = useMemo(
    () => computeStreak(state.readDays),
    [state.readDays],
  );

  const value = useMemo<LibraryContextValue>(
    () => ({
      ...state,
      hydrated,
      streak,
      notes,
      notesLoading,
      refreshNotes,
      saveNote,
      deleteNote,
      saved,
      savedLoading,
      refreshSaved,
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
      notes,
      notesLoading,
      refreshNotes,
      saveNote,
      deleteNote,
      saved,
      savedLoading,
      refreshSaved,
      toggleSaved,
      removeSaved,
      isSaved,
      setLastRead,
      markReadToday,
      restartPlan,
    ],
  );

  return (
    <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
  );
}

export function useLibrary(): LibraryContextValue {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error('useLibrary must be used within LibraryProvider');
  return ctx;
}