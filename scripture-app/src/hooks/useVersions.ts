import { useCallback, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { scriptureService } from '@/lib/services/scriptureService';
import { useSettings } from '@/hooks/use-settings';
import { DEFAULT_TRANSLATION, TRANSLATIONS, Translation } from '@/lib/bible/translations';

function text(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function toTranslation(item: any): Translation | null {
  if (typeof item === 'string') {
    const id = text(item);
    return id ? { id, label: id, name: id } : null;
  }
  if (!item || typeof item !== 'object') return null;

  const id = text(item.id) ?? text(item.version) ?? text(item.code) ?? text(item.slug);
  if (!id) return null;

  const label = text(item.shortName) ?? text(item.abbreviation) ?? text(item.label) ?? id;
  const language =
    text(item.languageEnglishName) ?? text(item.languageName) ?? text(item.language);
  const english = text(item.englishName);
  const native = text(item.name) ?? text(item.title);
  const englishIsGeneric =
    !english || (language ? english.toLowerCase() === language.toLowerCase() : false);
  const name = (englishIsGeneric ? native ?? english : english) ?? label;

  const books = Number(item.numberOfBooks);

  return {
    id,
    label,
    name,
    language,
    books: Number.isFinite(books) && books > 0 ? books : undefined,
    rtl: item.textDirection === 'rtl',
  };
}

export function normalizeVersions(data: any): Translation[] {
  const list = Array.isArray(data)
    ? data
    : Array.isArray(data?.translations)
      ? data.translations
      : Array.isArray(data?.versions)
        ? data.versions
        : Array.isArray(data?.data)
          ? data.data
          : [];

  const seen = new Set<string>();
  const out: Translation[] = [];
  list.forEach((item: any) => {
    const parsed = toTranslation(item);
    if (parsed && !seen.has(parsed.id)) {
      seen.add(parsed.id);
      out.push(parsed);
    }
  });
  return out;
}

export function useTranslations() {
  const { settings, update } = useSettings();

  const query = useQuery({
    queryKey: ['versions'],
    queryFn: async () => normalizeVersions(await scriptureService.getVersions()),
    staleTime: 1000 * 60 * 60 * 24,
  });

  const fetched = query.data && query.data.length > 0 ? query.data : null;
  const versions = fetched ?? TRANSLATIONS;

  const byId = useMemo(() => {
    const map = new Map<string, Translation>();
    versions.forEach((v) => map.set(v.id, v));
    return map;
  }, [versions]);

  useEffect(() => {
    if (!fetched) return;
    if (byId.has(settings.translation)) return;
    const fallback = byId.get(DEFAULT_TRANSLATION) ?? fetched[0];
    update({ translation: fallback.id });
  }, [fetched, byId, settings.translation, update]);

  const label = useCallback((id: string) => byId.get(id)?.label ?? id, [byId]);

  return useMemo(
    () => ({
      versions,
      label,
      isLoading: query.isLoading,
      isError: query.isError,
      refetch: query.refetch,
    }),
    [versions, label, query.isLoading, query.isError, query.refetch],
  );
}