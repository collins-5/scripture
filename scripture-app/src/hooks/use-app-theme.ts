import { useMemo } from 'react';
import { useThemePreference } from '@/hooks/use-theme-preference';
import { useSettings } from '@/hooks/use-settings';
import { lightPalette, darkPalette } from '@/lib/theme/colors';
import { ACCENTS, withAlpha } from '@/lib/theme/accents';
import { FONT_OPTIONS, LINE_STEPS, SIZE_STEPS } from '@/lib/theme/fonts';

const UI = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
} as const;

const DISPLAY = {
  regular: 'Lora_400Regular',
  medium: 'Lora_500Medium',
  semibold: 'Lora_600SemiBold',
  italic: 'Lora_400Regular_Italic',
} as const;

export function useAppTheme() {
  const { isDark } = useThemePreference();
  const { settings } = useSettings();

  return useMemo(() => {
    const p = isDark ? darkPalette : lightPalette;
    const accentDef = ACCENTS[settings.accent];
    const main = isDark ? accentDef.dark : accentDef.light;
    const fontOption = FONT_OPTIONS.find((f) => f.key === settings.fontFamily) ?? FONT_OPTIONS[0];
    const scale = SIZE_STEPS[settings.sizeStep] ?? 1;
    const lineMultiplier = LINE_STEPS[settings.lineStep]?.value ?? 1.7;

    const c = {
      bg: isDark ? p.surface.page : p.surface.gray100,
      card: isDark ? p.surface.card : p.surface.appGray,
      sheet: isDark ? p.surface.header : p.surface.card,
      border: p.border.card,
      text: p.text.primary,
      body: p.text.body,
      muted: p.text.muted,
      faint: p.text.light,
      placeholder: p.text.placeholder,
      verseBg: isDark ? p.surface.muted : p.brand.primaryGlow,
      verseText: '#FDF8F0',
      verseMuted: 'rgba(253,248,240,0.72)',
      jesus: p.red.accent,
      danger: p.red.accent,
      overlay: 'rgba(0,0,0,0.45)',
    };

    const accent = {
      main,
      soft: withAlpha(main, 0.14),
      softer: withAlpha(main, 0.08),
      on: isDark ? '#1A0F05' : '#FFFFFF',
    };

    const reading = {
      regular: fontOption.regular,
      bold: fontOption.bold,
      italic: fontOption.italic
        ? { fontFamily: fontOption.italic }
        : { fontFamily: fontOption.regular, fontStyle: 'italic' as const },
      size: (n: number) => Math.round(n * scale),
      lh: (n: number) => Math.round(n * scale * lineMultiplier),
    };

    return { isDark, c, accent, ui: UI, display: DISPLAY, reading, settings };
  }, [
    isDark,
    settings.accent,
    settings.fontFamily,
    settings.sizeStep,
    settings.lineStep,
    settings,
  ]);
}

export type AppTheme = ReturnType<typeof useAppTheme>;
