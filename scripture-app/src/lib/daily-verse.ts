import { dayOfYear } from '@/lib/dates';

export type VerseRef = { book: string; chapter: number; verse: number };

const VERSES: VerseRef[] = [
  { book: 'JHN', chapter: 3, verse: 16 },
  { book: 'PSAL', chapter: 23, verse: 1 },
  { book: 'PHIL', chapter: 4, verse: 13 },
  { book: 'ROM', chapter: 8, verse: 28 },
  { book: 'PROV', chapter: 3, verse: 5 },
  { book: 'ISA', chapter: 41, verse: 10 },
  { book: 'JER', chapter: 29, verse: 11 },
  { book: 'MATT', chapter: 11, verse: 28 },
  { book: 'JOSH', chapter: 1, verse: 9 },
  { book: 'PSAL', chapter: 46, verse: 1 },
  { book: 'ROM', chapter: 12, verse: 2 },
  { book: 'PSAL', chapter: 119, verse: 105 },
  { book: 'MATT', chapter: 6, verse: 33 },
  { book: 'EPH', chapter: 2, verse: 8 },
  { book: 'HEB', chapter: 11, verse: 1 },
  { book: '2TIM', chapter: 1, verse: 7 },
  { book: '1JHN', chapter: 4, verse: 19 },
  { book: 'LAM', chapter: 3, verse: 22 },
];

export function verseOfTheDay(date: Date = new Date()): VerseRef {
  return VERSES[dayOfYear(date) % VERSES.length];
}
