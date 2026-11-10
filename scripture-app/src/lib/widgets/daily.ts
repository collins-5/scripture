import { scriptureService } from '@/lib/services/scriptureService';
import { BOOK_MAP, formatRef } from '@/lib/bible/meta';
import { chapterBlocks } from '@/lib/bible/text';
import { verseOfTheDay } from '@/lib/daily-verse';
import { dayKey } from '@/lib/dates';
import { ACCENTS, AccentKey } from '@/lib/theme/accents';
import { readSettings, readSnapshot, writeSnapshot } from '@/lib/widgets/store';
import { EMPTY_SNAPSHOT, WidgetSnapshot, trimVerse } from '@/lib/widgets/snapshot';

export async function buildSnapshot(
  translation: string,
  accent: AccentKey,
  date: Date = new Date(),
): Promise<WidgetSnapshot | null> {
  const ref = verseOfTheDay(date);
  const book = BOOK_MAP[ref.book];
  if (!book) return null;

  const data: any = await scriptureService.getScripture(translation, ref.book, String(ref.chapter));
  const block = chapterBlocks(data?.chapterContent ?? []).find(
    (b) => b.type === 'verse' && b.number === ref.verse,
  );
  if (!block || block.type !== 'verse' || !block.text) return null;

  const colors = ACCENTS[accent] ?? ACCENTS.gold;

  return {
    day: dayKey(date),
    text: trimVerse(block.text),
    reference: formatRef(book.name, ref.chapter, ref.verse),
    version: translation,
    book: ref.book,
    chapter: ref.chapter,
    verse: ref.verse,
    accentLight: colors.light,
    accentDark: colors.dark,
  };
}

export async function buildWeek(
  translation: string,
  accent: AccentKey,
  days = 7,
): Promise<WidgetSnapshot[]> {
  const now = new Date();
  const dates = Array.from(
    { length: days },
    (_, i) => new Date(now.getFullYear(), now.getMonth(), now.getDate() + i),
  );
  const results = await Promise.all(
    dates.map((date) => buildSnapshot(translation, accent, date).catch(() => null)),
  );
  return results.filter((item): item is WidgetSnapshot => item !== null);
}

export async function loadFreshSnapshot(): Promise<WidgetSnapshot> {
  const stored = await readSnapshot();
  if (stored && stored.day === dayKey()) return stored;

  try {
    const settings = await readSettings();
    const fresh = await buildSnapshot(settings.translation, settings.accent);
    if (fresh) {
      await writeSnapshot(fresh);
      return fresh;
    }
  } catch {
    return stored ?? EMPTY_SNAPSHOT;
  }
  return stored ?? EMPTY_SNAPSHOT;
}