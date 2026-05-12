// Dark theme source-of-truth (ADR-009).
// Starting point: ppt's slate-900 family + WONIK BLUE adjusted for dark surfaces.
// Refinable by designer later — but the key set MUST stay 1:1 with theme-light.
import { statusTokensLight, graphTokensLight } from './theme-light';

export const surfacesDark = {
  canvas: '#0F141C',
  surface: '#1A2230',
  surfaceSubtle: '#1F2937',
  surfaceInset: '#1A2230',
  surfaceMid: '#2D3748',
  surfaceWhite: '#FFFFFF',
  darkBase: '#0A0E15',
  darkHeader: '#1A2230',
  darkHover: '#2D3748',
} as const;

export const bordersDark = {
  light: '#2D3748',
  mid: '#3F4A5C',
  dark: '#5C6677',
  panelDark: '#5C6677',
} as const;

// WONIK BLUE adjusted for dark mode — same hue, raised lightness for legibility
// against dark surfaces. Brand identity preserved.
export const primaryDark = {
  base: '#4A65B8',
  pale: '#1F2A4D',
  bg: '#2A3556',
  stroke: '#4A65B8',
  selected: '#6B82CC',
} as const;

export const secondaryDark = {
  base: '#ACACAC',
} as const;

export const textDark = {
  primary: '#94A3B8',
  secondary: '#B0B7C2',
  dim: '#64748B',
  dark: '#F1F5F9',
  onDark: '#303030',
  onDarkVal: '#1A2230',
  onDarkDim: '#5C5C66',
} as const;

// Status semantic colors are intentionally shared with light for now.
// Contrast issues, if found, get a separate phase.
export const statusTokensDark = statusTokensLight;

// Graph tokens shared with light initially. Dark-mode contrast tuning is a
// follow-up phase (esp. .surface fills which may need lower alpha on dark bg).
export const graphTokensDark = graphTokensLight;

export const themeDark = {
  surfaces: surfacesDark,
  borders: bordersDark,
  primary: primaryDark,
  secondary: secondaryDark,
  text: textDark,
  statusTokens: statusTokensDark,
  graphTokens: graphTokensDark,
} as const;
