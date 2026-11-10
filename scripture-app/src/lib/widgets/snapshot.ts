import { WIDGET_SCHEME } from '@/lib/widgets/config';

export const SNAPSHOT_KEY = '@widget-snapshot';
export const LAST_SYNC_KEY = '@widget-last-sync';

export type WidgetSnapshot = {
  day: string;
  text: string;
  reference: string;
  version: string;
  book: string;
  chapter: number;
  verse: number;
  accentLight: string;
  accentDark: string;
};

export const EMPTY_SNAPSHOT: WidgetSnapshot = {
  day: '',
  text: 'Open Scripture to load today’s verse.',
  reference: 'Verse of the day',
  version: '',
  book: 'JHN',
  chapter: 3,
  verse: 16,
  accentLight: '#B07A2E',
  accentDark: '#D4AF37',
};

export function verseLink(snapshot: WidgetSnapshot): string {
  return `${WIDGET_SCHEME}://read?book=${snapshot.book}&chapter=${snapshot.chapter}&verse=${snapshot.verse}`;
}

export function trimVerse(text: string, max = 220): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max).replace(/[\s,;:.]+$/, '')}…`;
}