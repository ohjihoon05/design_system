// Runtime color tokens — return CSS variable references so components automatically
// react to <html data-theme="light|dark"> (ADR-009). Hex source-of-truth lives in
// theme-light.ts and theme-dark.ts; build-css.ts emits the matching CSS rules.

// Surface colors — page/canvas/panel backgrounds
export const surfaces = {
  canvas: 'var(--color-canvas)',
  surface: 'var(--color-surface)',
  surfaceSubtle: 'var(--color-surface-subtle)',
  surfaceInset: 'var(--color-surface-inset)',
  surfaceMid: 'var(--color-surface-mid)',
  surfaceWhite: 'var(--color-surface-white)',
  darkBase: 'var(--color-dark-base)',
  darkHeader: 'var(--color-dark-header)',
  darkHover: 'var(--color-dark-hover)',
} as const;

// Border colors
export const borders = {
  light: 'var(--color-border)',
  mid: 'var(--color-border-mid)',
  dark: 'var(--color-border-dark)',
  panelDark: 'var(--color-border-panel-dark)',
} as const;

// Primary — WONIK BLUE (공식 CI, ADR-007)
export const primary = {
  base: 'var(--color-primary)',
  pale: 'var(--color-primary-pale)',
  bg: 'var(--color-primary-bg)',
  stroke: 'var(--color-primary-stroke)',
  selected: 'var(--color-primary-selected)',
} as const;

// Secondary — WONIK GRAY (공식 CI, ADR-007)
export const secondary = {
  base: 'var(--color-brand-secondary)',
} as const;

// Text colors
export const text = {
  primary: 'var(--color-text-primary)',
  secondary: 'var(--color-text-secondary)',
  dim: 'var(--color-text-dim)',
  dark: 'var(--color-text-dark)',
  onDark: 'var(--color-text-on-dark)',
  onDarkVal: 'var(--color-text-on-dark-val)',
  onDarkDim: 'var(--color-text-on-dark-dim)',
} as const;
