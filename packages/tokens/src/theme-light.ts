// Light theme source-of-truth (ADR-009).
// Holds raw hex values directly so build-css.ts can emit :root[data-theme="light"]
// without depending on colors.ts (which now exports var(...) references for runtime use).
// Key set MUST stay 1:1 with theme-dark.ts.

export const surfacesLight = {
  canvas: '#E8E8EA',
  surface: '#FEFEFE',
  surfaceSubtle: '#F4F5F5',
  surfaceInset: '#F5F5F5',
  surfaceMid: '#E7E7E7',
  surfaceWhite: '#FFFFFF',
  darkBase: '#1E1E21',
  darkHeader: '#252528',
  darkHover: '#2D2D31',
} as const;

export const bordersLight = {
  light: '#E1E1E4',
  mid: '#D4D4D8',
  dark: '#5C5C5C',
  panelDark: '#52525C',
} as const;

// Primary — WONIK BLUE (공식 CI, ADR-007)
// RGB(39, 62, 130) / CMYK(70, 52, 0, 49)
export const primaryLight = {
  base: '#273E82',
  pale: '#EEF0F8',
  bg: '#D6DCF0',
  stroke: '#A8B4D8',
  selected: '#1C2E60',
} as const;

// Secondary — WONIK GRAY (공식 CI, ADR-007)
// RGB(172, 172, 172) / CMYK(0, 0, 0, 33)
export const secondaryLight = {
  base: '#ACACAC',
} as const;

export const textLight = {
  primary: '#71717B',
  secondary: '#5C5C66',
  dim: '#52525C',
  dark: '#303030',
  onDark: '#D9D9DC',
  onDarkVal: '#E0E0E3',
  onDarkDim: '#D1D1D4',
} as const;

// Status semantic tokens — same hex set used by both light and dark for now.
// Primary-derived states (run, accessReady) MUST use WONIK BLUE #273E82 (ADR-007).
export const statusTokensLight = {
  idle: { bg: '#F4F5F5', border: '#D4D4D8', text: '#71717B' },
  init: { bg: '#FFFFAC', border: '#D4C800', text: '#7A6E00' },
  ready: { bg: '#E6FAF4', dot: '#07895E', text: '#00A876' },
  run: { bg: '#EEF0F8', border: '#A8B4D8', dot: '#273E82', text: '#273E82' },
  processEnd: { bg: '#D6F0E6', text: '#07895E' },
  accessReady: { bg: '#EEF0F8', text: '#273E82' },
  warning: { bg: '#FFF4DC', dot: '#FE9A00', text: '#D09804' },
  alarm: { bg: '#FFE2E2', border: '#FFCACA', text: '#CC0000' },
  abort: { bg: '#FFCACA', border: '#FFCACA', text: '#CC0000' },
  processed: { bg: '#F3E8FF', border: '#E9D1FF', text: '#7C3AED' },
  ok: { dot: '#07895E', text: '#00D492' },
} as const;

export const themeLight = {
  surfaces: surfacesLight,
  borders: bordersLight,
  primary: primaryLight,
  secondary: secondaryLight,
  text: textLight,
  statusTokens: statusTokensLight,
} as const;
