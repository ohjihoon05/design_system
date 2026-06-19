// Light theme source-of-truth (ADR-009).
// Holds raw hex values directly so build-css.ts can emit :root[data-theme="light"]
// without depending on colors.ts (which now exports var(...) references for runtime use).
// Key set MUST stay 1:1 with theme-dark.ts.
// surfaces/borders/text는 Figma "Standardization 2.0" Light + Primitives와 전수
// 대조해 drift 값(디자인 파일에 없던 값)을 교정 완료 (ADR-024).

export const surfacesLight = {
  canvas: '#E7E7E7',
  surface: '#FEFEFE',
  surfaceSubtle: '#F4F5F5',
  surfaceInset: '#F5F5F5',
  surfaceMid: '#EEEEF0',
  surfaceWhite: '#FFFFFF',
  darkBase: '#1E1E21',
  darkHeader: '#252528',
  darkHover: '#29292F',
} as const;

export const bordersLight = {
  light: '#E1E1E4',
  mid: '#D4D4D8',
  dark: '#5C5C66',
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
  dark: '#323640',
  onDark: '#D9D9DC',
  onDarkVal: '#E0E0E3',
  onDarkDim: '#D4D4D8',
} as const;

// Status semantic tokens — same hex set used by both light and dark for now.
// Primary-derived states (run, accessReady) MUST use WONIK BLUE #273E82 (ADR-007).
// ADR-041 §A (2026-06-18): text/dot 색을 WCAG AA(text 4.5:1, dot 3:1)로 darken —
// 각 hue는 보존(신호색 정체성 유지), 가독성만 확보. ADR-037 무채색 베이스 reconciliation
// (더 넓은 팔레트 비전)은 별개로 owner/Figma 대기. 값 drift라 minor (ADR-024).
export const statusTokensLight = {
  idle: { bg: '#F4F5F5', border: '#D4D4D8', text: '#6A6A73' },
  init: { bg: '#FFFFAC', border: '#D4C800', text: '#7A6E00' },
  ready: { bg: '#E6FAF4', dot: '#07895E', text: '#007A52' },
  run: { bg: '#EEF0F8', border: '#A8B4D8', dot: '#273E82', text: '#273E82' },
  processEnd: { bg: '#D6F0E6', text: '#04603F' },
  accessReady: { bg: '#EEF0F8', text: '#273E82' },
  warning: { bg: '#FFF4DC', dot: '#A06800', text: '#7C5A00' },
  alarm: { bg: '#FFE2E2', border: '#FFCACA', text: '#CC0000' },
  abort: { bg: '#FFCACA', border: '#FFCACA', text: '#A60000' },
  processed: { bg: '#F3E8FF', border: '#E9D1FF', text: '#7C3AED' },
  ok: { dot: '#07895E', text: '#00D492' },
} as const;

// Graph semantic tokens — status-driven plot/chart colors (ADR-013, ADR-014).
// signalTuned line MUST stay WONIK BLUE #273E82 (ADR-007 brand alignment).
// signalReference line MUST stay WONIK GRAY #ACACAC (ADR-007 brand alignment).
// 13개: limit/signal/pass 의미축. ADR-014로 signalReference.surface 추가 →
// signal 3개 신호 모두 (line, surface) 쌍 대칭. chrome(action/annotation/axis)
// 및 duplicate label은 ADR-013에서 제거 — chrome 색은 brand/text/border 토큰 재사용.
export const graphTokensLight = {
  limitUpper: { line: '#EC4899', surface: '#FCE7F3' },
  limitLower: { line: '#14B8A6', surface: '#CCFBF1' },
  signalPrimary: { line: '#818CF8', surface: '#EEF0FE' },
  signalTuned: { line: '#273E82', surface: '#D6DCF0' },
  signalReference: { line: '#ACACAC', surface: '#F0F0F0' },
  pass: { line: '#22C55E', surface: '#DCFCE7', label: '#16A34A' },
} as const;

// Button component tokens — Figma "Standardization 2.0" Light (ADR-023).
// 3-state(default/pressed/disabled) × (bg, outline, imageBg, image, text).
// pressed/top은 pressed 상태 전용 상단 accent. pressed의 #2B7FFF는 ADR-007에
// 따라 WONIK BLUE #273E82로 치환 — 그 외 blue shade는 Figma 값 유지.
export const buttonTokensLight = {
  default: {
    bg: '#FBFBFB',
    outline: '#D4D4D8',
    imageBg: '#EEEEF0',
    image: '#7F7F88',
    text: '#7F7F88',
  },
  pressed: {
    bg: '#F4F8FF',
    outline: '#273E82',
    imageBg: '#D6E6FF',
    image: '#165EFC',
    text: '#273E82',
    top: '#273E82',
  },
  disabled: {
    bg: '#F4F4F5',
    outline: '#EDEDEE',
    imageBg: '#EEEEEF',
    image: '#CACACF',
    text: '#CACACF',
  },
} as const;

// Table component tokens — Figma "Standardization 2.0" Light (ADR-025).
// surface = table chrome, 나머지는 Fab 슬롯 점유 상태. Figma 오타 `oborted`는
// `aborted`로 교정. table/information(circle) Dark의 #2B7FFF만 ADR-007에 따라
// WONIK BLUE로 치환되며 Light 값(#155DFC)은 #2B7FFF가 아니므로 Figma 값 유지.
export const tableTokensLight = {
  surface: {
    bg: '#FEFEFE',
    text: '#71717B',
    outline: '#E1E1E4',
    titleBg: '#F4F5F5',
    titleBox: '#EEEEF0',
    title: '#B8B8C0',
    littleTable: '#FEFEFE',
    littleTableOutline: '#F0F0F3',
  },
  ready: { base: '#009966', circle: '#06BE80' },
  manual: { base: '#E37D15', circle: '#FE9A00' },
  information: { circle: '#155DFC' },
  empty: { text: '#9F9FA9', bg: '#ECECEE', outline: '#EAEAEC' },
  occupied: { text: '#1447E6', bg: '#DBEAFE', outline: '#BBDCFF' },
  processed: { text: '#8200DB', bg: '#F3E8FF', outline: '#E9D1FF' },
  aborted: { text: '#C10007', bg: '#FFE2E2', outline: '#FFCACA' },
} as const;

export const themeLight = {
  surfaces: surfacesLight,
  borders: bordersLight,
  primary: primaryLight,
  secondary: secondaryLight,
  text: textLight,
  statusTokens: statusTokensLight,
  graphTokens: graphTokensLight,
  buttonTokens: buttonTokensLight,
  tableTokens: tableTokensLight,
} as const;
