export const colors = {
  bg: '#0C0B10',
  card: '#161520',
  cardAlt: '#1C1B28',
  surface: '#211F30',
  border: 'rgba(255,255,255,0.06)',
  borderFocus: 'rgba(255,255,255,0.12)',

  accent: '#C9A84C',
  accentDim: 'rgba(201,168,76,0.10)',
  accentBorder: 'rgba(201,168,76,0.25)',

  green: '#4CAF6E',
  greenDim: 'rgba(76,175,110,0.10)',
  greenBorder: 'rgba(76,175,110,0.20)',

  red: '#CF5C5C',
  redDim: 'rgba(207,92,92,0.08)',
  redBorder: 'rgba(207,92,92,0.20)',

  blue: '#5B8FD4',
  blueDim: 'rgba(91,143,212,0.10)',
  blueBorder: 'rgba(91,143,212,0.20)',

  purple: '#9575CD',
  purpleDim: 'rgba(149,117,205,0.10)',
  purpleBorder: 'rgba(149,117,205,0.20)',

  text: '#E8E5DD',
  textMid: 'rgba(232,229,221,0.55)',
  textDim: 'rgba(232,229,221,0.25)',
} as const;

export const fonts = {
  display: "'Libre Baskerville', serif",
  body: "'Outfit', sans-serif",
  mono: "'Azeret Mono', monospace",
} as const;

export const radii = {
  sm: 8,
  md: 10,
  lg: 12,
  xl: 14,
  '2xl': 16,
  '3xl': 20,
  full: 9999,
  app: 24,
} as const;

export const spacing = {
  1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 7: 32, 8: 40,
} as const;

export const motion = {
  easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
  easeProgress: 'cubic-bezier(0.22, 1, 0.36, 1)',
  fast: 200,
  base: 300,
  card: 500,
  progress: 800,
} as const;

export const STATUS_COLOR: Record<string, { bg: string; bd: string; fg: string; label: string }> = {
  'on-track': { bg: colors.greenDim, bd: colors.greenBorder, fg: colors.green, label: 'On track' },
  'ahead': { bg: colors.greenDim, bd: colors.greenBorder, fg: colors.green, label: 'Ahead' },
  'at-risk': { bg: colors.redDim, bd: colors.redBorder, fg: colors.red, label: 'At risk' },
  'behind': { bg: colors.redDim, bd: colors.redBorder, fg: colors.red, label: 'Behind' },
  'paused': { bg: colors.cardAlt, bd: colors.border, fg: colors.textMid, label: 'Paused' },
};
