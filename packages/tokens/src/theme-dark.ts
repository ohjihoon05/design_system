// Dark theme source-of-truth (ADR-009).
// surfaces·borders·text(primary/secondary/dim)는 Figma "Standardization 2.0"
// Dark 모드 디자인 값으로 정합 (ADR-022). 기존 임시값(ppt slate 계열)을 대체.
// primaryDark·text inversion 토큰(dark/onDark*)·statusTokens·graphTokens는
// 별도 phase. key set은 theme-light과 1:1로 유지.
import { statusTokensLight, graphTokensLight } from './theme-light';

export const surfacesDark = {
  canvas: '#343434',
  surface: '#1E1E21',
  surfaceSubtle: '#252528',
  surfaceInset: '#1F1F1F',
  surfaceMid: '#313137',
  surfaceWhite: '#FFFFFF',
  darkBase: '#161619',
  darkHeader: '#1B1B1F',
  darkHover: '#242429',
} as const;

export const bordersDark = {
  light: '#313137',
  mid: '#52525C',
  dark: '#676771',
  panelDark: '#52525C',
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

// primary/secondary/dim — Figma Standardization 2.0 Dark (table/text, tob bar/text,
// table/empty(text)). dark/onDark/onDarkVal/onDarkDim는 light↔dark surface 간
// 반전(inversion) 헬퍼라 Figma 영역 토큰과 직접 매핑되지 않음 — 별도 phase.
export const textDark = {
  primary: '#E0E0E3',
  secondary: '#D9D9DC',
  dim: '#71717B',
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

// Button component tokens — Figma "Standardization 2.0" Dark (ADR-023).
// key set은 buttonTokensLight과 1:1. pressed/outline·text·top의 #2B7FFF는
// ADR-007에 따라 WONIK BLUE #273E82로 치환.
export const buttonTokensDark = {
  default: {
    bg: '#27272A',
    outline: '#52525C',
    imageBg: '#323235',
    image: '#D4D4D8',
    text: '#D4D4D8',
  },
  pressed: {
    bg: '#19384C',
    outline: '#273E82',
    imageBg: '#EAF6FF',
    image: '#273E82',
    text: '#EAF6FF',
    top: '#273E82',
  },
  disabled: {
    bg: '#161619',
    outline: '#242429',
    imageBg: '#1B1B1F',
    image: '#3D3D43',
    text: '#3D3D43',
  },
} as const;

export const themeDark = {
  surfaces: surfacesDark,
  borders: bordersDark,
  primary: primaryDark,
  secondary: secondaryDark,
  text: textDark,
  statusTokens: statusTokensDark,
  graphTokens: graphTokensDark,
  buttonTokens: buttonTokensDark,
} as const;
