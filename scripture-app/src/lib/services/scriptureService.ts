import { apiClient } from './apiClient';

export const scriptureService = {
  async getScripture(version: string, book: string, chapter: string, verse?: string) {
    let url = `/api/scripture?version=${version}&book=${book}&chapter=${chapter}`;
    if (verse) url += `&verse=${verse}`;
    return apiClient(url);
  },

  async getVersions() {
    return apiClient('/api/versions');
  },

  async createNote(verseReference: string, content: string) {
    return apiClient('/api/notes', {
      method: 'POST',
      body: JSON.stringify({ verseReference, content }),
    });
  },

  async getUserNotes() {
    const data = await apiClient('/api/notes');
    return data.notes;
  }
};
