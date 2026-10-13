import { useQuery } from '@tanstack/react-query';
import { scriptureService } from '@/lib/services/scriptureService';

export function useScripture(version: string, book: string, chapter: string, verse?: string) {
  return useQuery({
    queryKey: ['scripture', version, book, chapter, verse],
    queryFn: () => scriptureService.getScripture(version, book, chapter, verse),
    enabled: !!version && !!book && !!chapter,
  });
}
