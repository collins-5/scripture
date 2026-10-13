export type AccentKey = 'gold' | 'green' | 'burgundy' | 'slate' | 'rose';

export const ACCENT_ORDER: AccentKey[] = ['gold', 'green', 'burgundy', 'slate', 'rose'];

export const ACCENTS: Record<AccentKey, { label: string; light: string; dark: string }> = {
  gold: { label: 'Gold', light: '#B07A2E', dark: '#D4AF37' },
  green: { label: 'Olive', light: '#4F6B3F', dark: '#8DB37A' },
  burgundy: { label: 'Burgundy', light: '#6B2D3A', dark: '#C9788A' },
  slate: { label: 'Slate', light: '#52677A', dark: '#93AEC6' },
  rose: { label: 'Rose', light: '#C06C7C', dark: '#E59AAA' },
};

export function withAlpha(hex: string, alpha: number): string {
  const a = Math.round(Math.min(1, Math.max(0, alpha)) * 255)
    .toString(16)
    .padStart(2, '0');
  return `${hex}${a}`;
}
