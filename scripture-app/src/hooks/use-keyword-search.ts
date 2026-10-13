import { useCallback, useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { scriptureService } from '@/lib/services/scriptureService';
import { BOOK_LIST, BookInfo } from '@/lib/bible/meta';
import { chapterBlocks } from '@/lib/bible/text';

export type Scope = 'all' | 'OT' | 'NT';

export type SearchHit = {
  id: string;
  order: number;
  book: BookInfo;
  chapter: number;
  verse: number;
  text: string;
};

type View = {
  hits: SearchHit[];
  scanned: number;
  total: number;
  running: boolean;
  exhausted: boolean;
};

type ScanItem = { book: BookInfo; chapter: number; order: number };

const PAGE_SIZE = 25;
const WORKERS = 6;
const EMPTY_VIEW: View = { hits: [], scanned: 0, total: 0, running: false, exhausted: false };

export function useDebounced<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export function useKeywordSearch(query: string, scope: Scope, translation: string) {
  const client = useQueryClient();
  const [view, setView] = useState<View>(EMPTY_VIEW);
  const runId = useRef(0);
  const cursor = useRef(0);
  const limit = useRef(PAGE_SIZE);
  const hits = useRef<SearchHit[]>([]);
  const scanned = useRef(0);
  const items = useRef<ScanItem[]>([]);
  const terms = useRef<string[]>([]);

  const scan = useCallback(
    async (id: number) => {
      setView((v) => ({ ...v, running: true }));

      const worker = async () => {
        while (
          runId.current === id &&
          cursor.current < items.current.length &&
          hits.current.length < limit.current
        ) {
          const index = cursor.current;
          cursor.current += 1;
          const ref = items.current[index];
          try {
            const data: any = await client.fetchQuery({
              queryKey: ['scripture', translation, ref.book.id, String(ref.chapter), undefined],
              queryFn: () =>
                scriptureService.getScripture(translation, ref.book.id, String(ref.chapter), undefined),
              staleTime: Infinity,
            });
            if (runId.current !== id) return;
            chapterBlocks(data?.chapterContent ?? []).forEach((block) => {
              if (block.type !== 'verse') return;
              const lower = block.text.toLowerCase();
              if (terms.current.every((term) => lower.includes(term))) {
                hits.current.push({
                  id: `${ref.book.id}-${ref.chapter}-${block.number}`,
                  order: ref.order * 1000 + block.number,
                  book: ref.book,
                  chapter: ref.chapter,
                  verse: block.number,
                  text: block.text,
                });
              }
            });
          } catch {}
          scanned.current += 1;
          if (runId.current === id) {
            setView({
              hits: [...hits.current].sort((a, b) => a.order - b.order),
              scanned: scanned.current,
              total: items.current.length,
              running: true,
              exhausted: false,
            });
          }
        }
      };

      await Promise.all(Array.from({ length: WORKERS }, worker));

      if (runId.current === id) {
        setView((v) => ({
          ...v,
          running: false,
          exhausted: cursor.current >= items.current.length,
        }));
      }
    },
    [client, translation],
  );

  useEffect(() => {
    runId.current += 1;
    const id = runId.current;
    const q = query.trim().toLowerCase();
    hits.current = [];
    scanned.current = 0;
    cursor.current = 0;
    limit.current = PAGE_SIZE;

    if (q.length < 3) {
      setView(EMPTY_VIEW);
      return;
    }

    terms.current = q.split(/\s+/).filter(Boolean);
    const list: ScanItem[] = [];
    BOOK_LIST.filter((b) => scope === 'all' || b.testament === scope).forEach((book) => {
      for (let chapter = 1; chapter <= book.chapters; chapter += 1) {
        list.push({ book, chapter, order: list.length });
      }
    });
    items.current = list;
    setView({ hits: [], scanned: 0, total: list.length, running: true, exhausted: false });
    scan(id);

    return () => {
      runId.current += 1;
    };
  }, [query, scope, translation, scan]);

  const loadMore = useCallback(() => {
    limit.current += PAGE_SIZE;
    runId.current += 1;
    scan(runId.current);
  }, [scan]);

  const canLoadMore = !view.running && !view.exhausted && view.hits.length > 0;

  return { ...view, loadMore, canLoadMore };
}
