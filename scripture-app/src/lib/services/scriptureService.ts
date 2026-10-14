import { apiClient } from './apiClient';

export type ServerNote = {
  _id: string;
  userId: string;
  book?: string;
  bookName?: string;
  chapter?: number | null;
  verse?: number | null;
  quote?: string;
  body: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ServerSavedVerse = {
  _id: string;
  userId: string;
  book: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
  translation: string;
  createdAt?: string;
  updatedAt?: string;
};

export type NoteInput = {
  book?: string;
  bookName?: string;
  chapter?: number | null;
  verse?: number | null;
  quote?: string;
  body: string;
};

export type SavedVerseInput = {
  book: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
  translation: string;
};

export const scriptureService = {
  async getScripture(version: string, book: string, chapter: string, verse?: string) {
    let url = `/api/scripture?version=${version}&book=${book}&chapter=${chapter}`;
    if (verse) url += `&verse=${verse}`;
    return apiClient(url);
  },

  async getVersions() {
    return apiClient('/api/versions');
  },

  async getUserNotes(): Promise<ServerNote[]> {
    const data = await apiClient('/api/notes');
    return data?.notes ?? [];
  },

  async createNote(input: NoteInput): Promise<ServerNote> {
    const data = await apiClient('/api/notes', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    return data.note;
  },

  async updateNote(id: string, input: NoteInput): Promise<ServerNote> {
    const data = await apiClient(`/api/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    });
    return data.note;
  },

  async deleteNote(id: string): Promise<void> {
    await apiClient(`/api/notes/${id}`, { method: 'DELETE' });
  },

  async getSavedVerses(): Promise<ServerSavedVerse[]> {
    const data = await apiClient('/api/saved-verses');
    return data?.saved ?? [];
  },

  async createSavedVerse(input: SavedVerseInput): Promise<ServerSavedVerse> {
    const data = await apiClient('/api/saved-verses', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    return data.saved;
  },

  async deleteSavedVerse(id: string): Promise<void> {
    await apiClient(`/api/saved-verses/${id}`, { method: 'DELETE' });
  },

  async toggleSavedVerse(
    input: SavedVerseInput,
  ): Promise<{ saved: boolean; entry?: ServerSavedVerse }> {
    const data = await apiClient('/api/saved-verses/toggle', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    return { saved: data.saved, entry: data.entry };
  },
};