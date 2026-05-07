// Surface colors — page/canvas/panel backgrounds
export const surfaces = {
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

// Border colors
export const borders = {
  light: '#E1E1E4',
  mid: '#D4D4D8',
  dark: '#5C5C5C',
  panelDark: '#52525C',
} as const;

// Primary — WONIK BLUE (공식 CI, ADR-007)
// RGB(39, 62, 130) / CMYK(70, 52, 0, 49)
export const primary = {
  base: '#273E82',
  pale: '#EEF0F8',
  bg: '#D6DCF0',
  stroke: '#A8B4D8',
  selected: '#1C2E60',
} as const;

// Secondary — WONIK GRAY (공식 CI, ADR-007)
// RGB(172, 172, 172) / CMYK(0, 0, 0, 33)
export const secondary = {
  base: '#ACACAC',
} as const;

// Text colors
export const text = {
  primary: '#71717B',
  secondary: '#5C5C66',
  dim: '#52525C',
  dark: '#303030',
  onDark: '#D9D9DC',
  onDarkVal: '#E0E0E3',
  onDarkDim: '#D1D1D4',
} as const;
