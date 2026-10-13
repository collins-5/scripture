import { BIBLE_BOOKS } from '@/constants/bibleBooks';

export type Testament = 'OT' | 'NT';

export type BookInfo = {
  id: string;
  name: string;
  chapters: number;
  testament: Testament;
  index: number;
};

export type ChapterRef = { book: BookInfo; chapter: number };

const CHAPTER_COUNTS: Record<string, number> = {
  GEN: 50, EXO: 40, LEV: 27, NUM: 36, DEU: 34, JOSH: 24, JUDG: 21, RUTH: 4,
  '1SAM': 31, '2SAM': 24, '1KGS': 22, '2KGS': 25, '1CHR': 29, '2CHR': 36,
  EZR: 10, NEH: 13, ESTH: 10, JOB: 42, PSAL: 150, PROV: 31, ECCL: 12, SNG: 8,
  ISA: 66, JER: 52, LAM: 5, EZEK: 48, DAN: 12, HOS: 14, JOEL: 3, AMOS: 9,
  OBAD: 1, JON: 4, MIC: 7, NAH: 3, HAB: 3, ZEPH: 3, HAG: 2, ZECH: 14, MAL: 4,
  MATT: 28, MARK: 16, LUKE: 24, JHN: 21, ACTS: 28, ROM: 16, '1COR': 16, '2COR': 13,
  GAL: 6, EPH: 6, PHIL: 4, COL: 4, '1THESS': 5, '2THESS': 3, '1TIM': 6, '2TIM': 4,
  TIT: 3, PHILEM: 1, HEB: 13, JAS: 5, '1PET': 5, '2PET': 3, '1JHN': 5, '2JHN': 1,
  '3JHN': 1, JUDE: 1, REV: 22,
};

export const BOOK_LIST: BookInfo[] = Object.values(BIBLE_BOOKS).map((b, index) => ({
  id: b.id,
  name: b.name,
  chapters: CHAPTER_COUNTS[b.id] ?? 1,
  testament: index < 39 ? 'OT' : 'NT',
  index,
}));

export const BOOK_MAP: Record<string, BookInfo> = Object.fromEntries(
  BOOK_LIST.map((b) => [b.id, b]),
);

export const OLD_TESTAMENT = BOOK_LIST.filter((b) => b.testament === 'OT');
export const NEW_TESTAMENT = BOOK_LIST.filter((b) => b.testament === 'NT');

export const ALL_CHAPTERS: ChapterRef[] = BOOK_LIST.flatMap((book) =>
  Array.from({ length: book.chapters }, (_, i) => ({ book, chapter: i + 1 })),
);

export function formatRef(bookName: string, chapter: number, verse?: number): string {
  return verse ? `${bookName} ${chapter}:${verse}` : `${bookName} ${chapter}`;
}

export function stepChapter(
  bookId: string,
  chapter: number,
  dir: 1 | -1,
): { book: string; chapter: number } | null {
  const book = BOOK_MAP[bookId];
  if (!book) return null;
  const next = chapter + dir;
  if (next >= 1 && next <= book.chapters) return { book: book.id, chapter: next };
  const other = BOOK_LIST[book.index + dir];
  if (!other) return null;
  return { book: other.id, chapter: dir === 1 ? 1 : other.chapters };
}

const ABBREVIATIONS: Record<string, string> = {
  ps: 'PSAL', psalm: 'PSAL', psalms: 'PSAL', jn: 'JHN', jhn: 'JHN',
  sos: 'SNG', song: 'SNG', songofsongs: 'SNG', mt: 'MATT', mk: 'MARK', lk: 'LUKE',
  rm: 'ROM', php: 'PHIL', phm: 'PHILEM', '1jn': '1JHN', '2jn': '2JHN', '3jn': '3JHN',
  rev: 'REV', revelations: 'REV',
};

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function resolveBook(input: string): BookInfo | null {
  const norm = normalize(input);
  if (!norm) return null;
  if (ABBREVIATIONS[norm]) return BOOK_MAP[ABBREVIATIONS[norm]] ?? null;
  const exact = BOOK_LIST.find((b) => normalize(b.name) === norm || b.id.toLowerCase() === norm);
  if (exact) return exact;
  return BOOK_LIST.find((b) => normalize(b.name).startsWith(norm)) ?? null;
}

export type ParsedReference = { book: BookInfo; chapter?: number; verse?: number };

export function parseReference(input: string): ParsedReference | null {
  const match = input
    .trim()
    .match(/^((?:[1-3]\s*)?[a-zA-Z][a-zA-Z.\s]*?)\s*(?:(\d+)(?:\s*[:.]\s*(\d+))?)?$/);
  if (!match) return null;
  const book = resolveBook(match[1]);
  if (!book) return null;
  const chapter = match[2] ? Number(match[2]) : undefined;
  if (chapter !== undefined && (chapter < 1 || chapter > book.chapters)) return { book };
  const verse = match[3] ? Number(match[3]) : undefined;
  return { book, chapter, verse };
}
