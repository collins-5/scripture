export type FontKey = 'lora' | 'merriweather' | 'inter' | 'system';

export type FontOption = {
  key: FontKey;
  label: string;
  description: string;
  regular?: string;
  bold?: string;
  italic?: string;
};

export const FONT_OPTIONS: FontOption[] = [
  {
    key: 'lora',
    label: 'Lora',
    description: 'Warm and classic',
    regular: 'Lora_400Regular',
    bold: 'Lora_600SemiBold',
    italic: 'Lora_400Regular_Italic',
  },
  {
    key: 'merriweather',
    label: 'Merriweather',
    description: 'Sturdy and highly legible',
    regular: 'Merriweather_400Regular',
    bold: 'Merriweather_700Bold',
  },
  {
    key: 'inter',
    label: 'Inter',
    description: 'Clean and modern',
    regular: 'Inter_400Regular',
    bold: 'Inter_600SemiBold',
  },
  {
    key: 'system',
    label: 'System',
    description: 'Your device default',
  },
];

export const SIZE_STEPS = [0.85, 1, 1.15, 1.3, 1.5];

export const LINE_STEPS = [
  { label: 'Compact', value: 1.5 },
  { label: 'Comfortable', value: 1.7 },
  { label: 'Relaxed', value: 1.95 },
];
