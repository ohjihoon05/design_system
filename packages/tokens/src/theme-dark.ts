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
  // ADR-032 (2026-05-29): #52525C → #82828A. Phase 2 finding 1·2·8 fix —
  // Input/Textarea/Button outline border가 surface(#1E1E21) 위 2.15, canvas(#343434)
  // 위 1.61 (UI 3.0:1 미달). 새 값은 surface 위 ≈ 4.59, canvas 위 ≈ 3.41 통과.
  // buttonTokens.default.outline·tableTokens.surface.outline·panelDark는 Figma 정합
  // 별개 source라 변경 안 함 (ADR-023·025 source-of-truth).
  mid: '#82828A',
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
  // ADR-032 (2026-05-29): #6B82CC → #8FA3DD. Phase 2 finding 6 fix — FilterChip
  // active text on primaryDark.bg (#2A3556) 가 3.27 (Text 4.5:1 미달). 새 값은
  // primaryDark.bg 위 ≈ 4.93 통과. base·stroke (#4A65B8)는 ADR-007 WONIK BLUE 의
  // dark 적응 — brand 인지 영향이라 사내 design 협의 전까지 보류.
  selected: '#8FA3DD',
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
  // ADR-032 (2026-05-29): #71717B → #A0A0A8. Phase 2 finding 3·4·5 fix —
  // Input/Textarea placeholder + InlineEditableText muted text가 canvas(#343434)
  // 위 2.58, surface(#1E1E21) 위 3.44 (Text 4.5:1 미달). 새 값은 canvas 위 ≈ 4.92,
  // surface 위 ≈ 6.61 통과. tableTokensDark.empty.text (#71717B)는 Figma 정합 별개
  // source라 변경 안 함 (ADR-025 source-of-truth).
  dim: '#A0A0A8',
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

// Table component tokens — Figma "Standardization 2.0" Dark (ADR-025).
// key set은 tableTokensLight과 1:1. information(circle)의 #2B7FFF는 ADR-007에
// 따라 WONIK BLUE #273E82로 치환 — 그 외 blue shade는 Figma 값 유지.
export const tableTokensDark = {
  surface: {
    bg: '#1E1E21',
    text: '#D9D9DC',
    outline: '#52525C',
    titleBg: '#252528',
    titleBox: '#313137',
    title: '#676771',
    littleTable: '#1E1E21',
    littleTableOutline: '#52525C',
  },
  ready: { base: '#00D492', circle: '#07895E' },
  manual: { base: '#D09804', circle: '#FE9A00' },
  information: { circle: '#273E82' },
  empty: { text: '#71717B', bg: '#29292F', outline: '#29292F' },
  occupied: { text: '#8EC5FF', bg: '#1A2F53', outline: '#1D3F76' },
  processed: { text: '#DAB2FF', bg: '#3A2153', outline: '#512877' },
  aborted: { text: '#FFA2A2', bg: '#4E1A20', outline: '#701E24' },
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
  tableTokens: tableTokensDark,
} as const;
