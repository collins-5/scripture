import { ALL_CHAPTERS, ChapterRef } from '@/lib/bible/meta';
import { parseDayKey } from '@/lib/dates';

export const PLAN_DAYS = 365;

export function readingForDay(day: number): ChapterRef[] {
  const total = ALL_CHAPTERS.length;
  const clamped = Math.min(PLAN_DAYS, Math.max(1, day));
  const start = Math.floor(((clamped - 1) * total) / PLAN_DAYS);
  const end = Math.floor((clamped * total) / PLAN_DAYS);
  return ALL_CHAPTERS.slice(start, end);
}

export function describeReading(items: ChapterRef[]): string {
  const groups: { name: string; first: number; last: number }[] = [];
  items.forEach((item) => {
    const group = groups[groups.length - 1];
    if (group && group.name === item.book.name) {
      group.last = item.chapter;
    } else {
      groups.push({ name: item.book.name, first: item.chapter, last: item.chapter });
    }
  });
  return groups
    .map((g) => (g.first === g.last ? `${g.name} ${g.first}` : `${g.name} ${g.first}–${g.last}`))
    .join(' · ');
}

export function planDay(planStart: string, now: Date = new Date()): number {
  const start = parseDayKey(planStart);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = Math.round((today.getTime() - start.getTime()) / 86400000) + 1;
  return Math.min(PLAN_DAYS, Math.max(1, diff));
}
