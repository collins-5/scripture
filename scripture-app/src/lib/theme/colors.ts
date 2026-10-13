const lightBrand = {
  primary:        '#4A1E27',
  primaryDark:    '#36141B',
  primaryDeep:    '#250B10',
  primaryMidGrad: '#3D151D',
  primaryNavy:    '#1F050A',
  primaryGlow:    '#6E323D',
  primaryLight:   '#FDF8F9',
  primaryMid:     '#F5E6E8',
  primaryBorder:  '#E8CBD0',
  primaryFaint:   '#F9EDEF',
  primarySubtle:  '#FBF3F4',
  primaryBlue:    '#4A1E27',
  primarySky:     '#BA8D95',
  primaryWhisper: '#FCF7F8',
  shadowDeep:     '#1A0307',
  blue:           '#4A1E27',
  indigo:         '#5C2B35',
} as const;

const darkBrand = {
  primary:        '#D4AF37',
  primaryDark:    '#B8962F',
  primaryDeep:    '#1A1005',
  primaryMidGrad: '#2D1B07',
  primaryNavy:    '#140C03',
  primaryGlow:    '#E5C158',
  primaryLight:   '#1A1005',
  primaryMid:     '#2D1B07',
  primaryBorder:  '#4A3311',
  primaryFaint:   '#140C03',
  primarySubtle:  '#0F0902',
  primaryBlue:    '#D4AF37',
  primarySky:     '#E5C158',
  primaryWhisper: '#211507',
  shadowDeep:     '#000000',
  blue:           '#D4AF37',
  indigo: '#E0C56E',
} as const;

const lightGreen = {
  accent:    '#16a34a',
  dark:      '#15803d',
  dot:       '#10b981',
  light:     '#f0fdf4',
  mid:       '#dcfce7',
  border:    '#bbf7d0',
  gradStart: '#0f2d1f',
  gradEnd:   '#1a6b3a',
} as const;

const darkGreen = {
  accent:    '#22c55e',
  dark:      '#4ade80',
  dot:       '#10b981',
  light:     '#052e16',
  mid:       '#064e21',
  border:    '#166534',
  gradStart: '#0f2d1f',
  gradEnd:   '#1a6b3a',
} as const;

const lightAmber = {
  accent:     '#d97706',
  bright:     '#f59e0b',
  dark:       '#92400e',
  light:      '#fffbeb',
  pill:       '#fef3c7',
  warm:       '#fdf8f0',
  warmBorder: '#f0e6d3',
  gradStart:  '#3d1a00',
  gradEnd:    '#b85c00',
} as const;

const darkAmber = {
  accent:     '#f59e0b',
  bright:     '#fbbf24',
  dark:       '#fcd34d',
  light:      '#1e1000',
  pill:       '#2d1a00',
  warm:       '#1e1a08',
  warmBorder: '#2e2a14',
  gradStart:  '#3d1a00',
  gradEnd:    '#b85c00',
} as const;

const lightRed = {
  accent:    '#dc2626',
  error:     '#ef4444',
  light:     '#fef2f2',
  gradStart: '#3d0f0f',
  gradEnd:   '#b82020',
} as const;

const darkRed = {
  accent:    '#f87171',
  error:     '#ef4444',
  light:     '#3d0a0a',
  gradStart: '#3d0f0f',
  gradEnd:   '#b82020',
} as const;

const lightOrange = {
  accent: '#f97316',
  light:  '#fff7ed',
} as const;

const darkOrange = {
  accent: '#fb923c',
  light:  '#2d1500',
} as const;

const lightPurple = {
  accent:     '#5b21b6',
  dark:       '#6d28d9',
  violet:     '#7c3aed',
  indigoDark: '#4f46e5',
  deepBg:     '#2b1a57',
  light:      '#f5f3ff',
  mid:        '#ede9fe',
  border:     '#ddd6fe',
  muted:      '#c4b5fd',
  gradStart:  '#1e0a3c',
  gradEnd:    '#5a2db0',
} as const;

const darkPurple = {
  accent:     '#a78bfa',
  dark:       '#8b5cf6',
  violet:     '#7c3aed',
  indigoDark: '#818cf8',
  deepBg:     '#1e0a3c',
  light:      '#1a0a3d',
  mid:        '#1f1045',
  border:     '#2d1a55',
  muted:      '#4c2a8a',
  gradStart:  '#1e0a3c',
  gradEnd:    '#5a2db0',
} as const;

const lightCyan = {
  accent:  '#0891b2',
  sky:     '#0284c7',
  ocean:   '#0369a1',
  light:   '#e0f2fe',
} as const;

const darkCyan = {
  accent:  '#22d3ee',
  sky:     '#38bdf8',
  ocean:   '#0ea5e9',
  light:   '#0a1f2d',
} as const;

const lightText = {
  primary:     '#241508',
  dark:        '#1A0F05',
  nearBlack:   '#2D1B07',
  body:        '#3D2A18',
  medium:      '#4E3B29',
  muted:       '#705C49',
  gray:        '#826E5B',
  light:       '#A4907D',
  faint:       '#B5A18E',
  placeholder: '#C6B2A0',
  disabled:    '#D7C3B1',
} as const;

const darkText = {
  primary:     '#FDF8F0',
  dark:        '#F7F0E3',
  nearBlack:   '#EFE5D3',
  body:        '#E3D6C1',
  medium:      '#D2C4AE',
  muted:       '#BFAFA0',
  gray:        '#BFAFA0',
  light:       '#AC9C8E',
  faint:       '#99897C',
  placeholder: '#86766B',
  disabled:    '#605248',
} as const;

const lightSurface = {
  page:        '#FDF8F2',
  appGray:     '#FAF4EB',
  gray100:     '#F5ECE0',
  indigoFaint: '#F0E4D5',
  card:        '#FFFFFF',
  header:      '#FAF3E8',
  muted:       '#F3E8D9',
} as const;

const darkSurface = {
  page:        '#1F1014',
  appGray:     '#1F1014',
  gray100:     '#2A181C',
  indigoFaint: '#352024',
  card:        '#2D1418',
  header:      '#1A0C0E',
  muted:       '#3A2429',
} as const;

const lightBorder = {
  card:   '#EADCC9',
  medium: '#E3D2BA',
  light:  '#ECDDC6',
  faint:  '#F4E8D7',
  blue:   '#E8CBD0',
} as const;

const darkBorder = {
  card:   '#4A232B',
  medium: '#3A181E',
  light:  '#351419',
  faint:  '#250B10',
  blue:   '#2A181C',
} as const;

export const lightPalette = {
  brand: lightBrand,
  text: lightText,
  surface: lightSurface,
  border: lightBorder,
  green: lightGreen,
  amber: lightAmber,
  red: lightRed,
  orange: lightOrange,
  purple: lightPurple,
  cyan: lightCyan,
};

export const darkPalette = {
  brand: darkBrand,
  text: darkText,
  surface: darkSurface,
  border: darkBorder,
  green: darkGreen,
  amber: darkAmber,
  red: darkRed,
  orange: darkOrange,
  purple: darkPurple,
  cyan: darkCyan,
};
