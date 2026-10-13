export type Segment = { text: string; jesus: boolean };

export function verseSegments(content: any, jesus = false): Segment[] {
  if (content === null || content === undefined) return [];
  if (typeof content === 'string') return content ? [{ text: content, jesus }] : [];
  if (Array.isArray(content)) return content.flatMap((item) => verseSegments(item, jesus));
  if (typeof content === 'object') {
    const flagged = jesus || content.wordsOfJesus === true;
    if (typeof content.text === 'string') return [{ text: content.text, jesus: flagged }];
    if (typeof content.value === 'string') return [{ text: content.value, jesus: flagged }];
    if (content.content) return verseSegments(content.content, flagged);
  }
  return [];
}

function clean(segments: Segment[]): string {
  return segments
    .map((s) => s.text)
    .join('')
    .replace(/\s+/g, ' ')
    .trim();
}

export function verseText(content: any): string {
  return clean(verseSegments(content));
}

export type VerseBlock = {
  type: 'verse';
  key: string;
  number: number;
  segments: Segment[];
  text: string;
};

export type HeadingBlock = { type: 'heading'; key: string; text: string };

export type ChapterBlock = VerseBlock | HeadingBlock;

export function chapterBlocks(content: any): ChapterBlock[] {
  if (!Array.isArray(content)) return [];
  const out: ChapterBlock[] = [];
  content.forEach((item: any, i: number) => {
    if (!item) return;
    if (item.type === 'heading') {
      const text = verseText(item.content);
      if (text) out.push({ type: 'heading', key: `h-${i}`, text });
      return;
    }
    if (item.type === 'verse') {
      const segments = verseSegments(item.content);
      out.push({
        type: 'verse',
        key: `v-${i}`,
        number: Number(item.number) || 0,
        segments,
        text: clean(segments),
      });
    }
  });
  return out;
}
