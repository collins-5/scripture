export type Translation = {
  id: string;
  label: string;
  name: string;
  language?: string;
  books?: number;
  rtl?: boolean;
};

export const TRANSLATIONS: Translation[] = [
  { id: 'BSB', label: 'BSB', name: 'Berean Standard Bible', language: 'English', books: 66 },
  { id: 'eng_kjv', label: 'KJAV', name: 'King James (Authorized) Version', language: 'English', books: 66 },
  { id: 'ENGWEBP', label: 'WEB', name: 'World English Bible', language: 'English', books: 66 },
];

export const DEFAULT_TRANSLATION = 'BSB';

export function translationLabel(id: string, list: Translation[] = TRANSLATIONS): string {
  return list.find((t) => t.id === id)?.label ?? id;
}