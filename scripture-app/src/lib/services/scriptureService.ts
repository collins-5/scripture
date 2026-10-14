import { apiClient } from './apiClient';

export type ServerNote = {
  _id: string;
  userId: string;
  verseReference: string;
  content: string;
  createdAt: string;
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

  async createNote(verseReference: string, content: string): Promise<ServerNote> {
    const data = await apiClient('/api/notes', {
      method: 'POST',
      body: JSON.stringify({ verseReference, content }),
    });
    return data.note;
  },

  async updateNote(id: string, verseReference: string, content: string): Promise<ServerNote> {
    const data = await apiClient(`/api/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ verseReference, content }),
    });
    return data.note;
  },

  async deleteNote(id: string): Promise<void> {
    await apiClient(`/api/notes/${id}`, { method: 'DELETE' });
  },

  async getUserNotes(): Promise<ServerNote[]> {
    const data = await apiClient('/api/notes');
    return data.notes;
  },
};