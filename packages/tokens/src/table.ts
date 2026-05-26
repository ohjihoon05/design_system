// Table component tokens — runtime references to CSS variables so a Table
// component lights up correctly under <html data-theme="light|dark"> (ADR-009).
// Hex source-of-truth lives in theme-light.ts / theme-dark.ts (ADR-025).
//
// surface — table frame chrome (bg/text/outline/title*/little table).
// cell states — Fab 슬롯 점유 상태. ready·manual은 {base, circle},
// information은 {circle}, empty·occupied·processed·aborted는 {text, bg, outline}.
// Figma 변수 오타 `oborted`는 코드에서 `aborted`로 교정 (FIGMA_SEMANTIC_MAPPING_PLAN §8).
export const tableTokens = {
  surface: {
    bg: 'var(--color-table-surface-bg)',
    text: 'var(--color-table-surface-text)',
    outline: 'var(--color-table-surface-outline)',
    titleBg: 'var(--color-table-surface-title-bg)',
    titleBox: 'var(--color-table-surface-title-box)',
    title: 'var(--color-table-surface-title)',
    littleTable: 'var(--color-table-surface-little-table)',
    littleTableOutline: 'var(--color-table-surface-little-table-outline)',
  },
  ready: {
    base: 'var(--color-table-ready-base)',
    circle: 'var(--color-table-ready-circle)',
  },
  manual: {
    base: 'var(--color-table-manual-base)',
    circle: 'var(--color-table-manual-circle)',
  },
  information: {
    circle: 'var(--color-table-information-circle)',
  },
  empty: {
    text: 'var(--color-table-empty-text)',
    bg: 'var(--color-table-empty-bg)',
    outline: 'var(--color-table-empty-outline)',
  },
  occupied: {
    text: 'var(--color-table-occupied-text)',
    bg: 'var(--color-table-occupied-bg)',
    outline: 'var(--color-table-occupied-outline)',
  },
  processed: {
    text: 'var(--color-table-processed-text)',
    bg: 'var(--color-table-processed-bg)',
    outline: 'var(--color-table-processed-outline)',
  },
  aborted: {
    text: 'var(--color-table-aborted-text)',
    bg: 'var(--color-table-aborted-bg)',
    outline: 'var(--color-table-aborted-outline)',
  },
} as const;
