import { useAppColorScheme } from '@/hooks/use-theme-preference';
import { lightPalette, darkPalette, type ThemeColors } from '@/lib/theme/colors';

export function useThemeColors(): ThemeColors {
  const scheme = useAppColorScheme();
  return scheme === 'dark' ? darkPalette : lightPalette;
}
