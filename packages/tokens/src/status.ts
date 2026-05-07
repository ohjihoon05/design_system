// Status semantic tokens — runtime references to CSS variables so the same
// components light up correctly under <html data-theme="light|dark"> (ADR-009).
// Hex source-of-truth lives in theme-light.ts / theme-dark.ts.
export const statusTokens = {
  idle: {
    bg: 'var(--color-status-idle-bg)',
    border: 'var(--color-status-idle-border)',
    text: 'var(--color-status-idle-text)',
  },
  init: {
    bg: 'var(--color-status-init-bg)',
    border: 'var(--color-status-init-border)',
    text: 'var(--color-status-init-text)',
  },
  ready: {
    bg: 'var(--color-status-ready-bg)',
    dot: 'var(--color-status-ready-dot)',
    text: 'var(--color-status-ready-text)',
  },
  run: {
    bg: 'var(--color-status-run-bg)',
    border: 'var(--color-status-run-border)',
    dot: 'var(--color-status-run-dot)',
    text: 'var(--color-status-run-text)',
  },
  processEnd: {
    bg: 'var(--color-status-process-end-bg)',
    text: 'var(--color-status-process-end-text)',
  },
  accessReady: {
    bg: 'var(--color-status-access-ready-bg)',
    text: 'var(--color-status-access-ready-text)',
  },
  warning: {
    bg: 'var(--color-status-warning-bg)',
    dot: 'var(--color-status-warning-dot)',
    text: 'var(--color-status-warning-text)',
  },
  alarm: {
    bg: 'var(--color-status-alarm-bg)',
    border: 'var(--color-status-alarm-border)',
    text: 'var(--color-status-alarm-text)',
  },
  abort: {
    bg: 'var(--color-status-abort-bg)',
    border: 'var(--color-status-abort-border)',
    text: 'var(--color-status-abort-text)',
  },
  processed: {
    bg: 'var(--color-status-processed-bg)',
    border: 'var(--color-status-processed-border)',
    text: 'var(--color-status-processed-text)',
  },
  ok: {
    dot: 'var(--color-status-ok-dot)',
    text: 'var(--color-status-ok-text)',
  },
} as const;
