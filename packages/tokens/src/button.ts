// Button component tokens — runtime references to CSS variables so the Button
// component lights up correctly under <html data-theme="light|dark"> (ADR-009).
// Hex source-of-truth lives in theme-light.ts / theme-dark.ts (ADR-023).
//
// 3-state × (bg, outline, imageBg, image, text); pressed adds `top` (상단 accent).
export const buttonTokens = {
  default: {
    bg: 'var(--color-button-default-bg)',
    outline: 'var(--color-button-default-outline)',
    imageBg: 'var(--color-button-default-image-bg)',
    image: 'var(--color-button-default-image)',
    text: 'var(--color-button-default-text)',
  },
  pressed: {
    bg: 'var(--color-button-pressed-bg)',
    outline: 'var(--color-button-pressed-outline)',
    imageBg: 'var(--color-button-pressed-image-bg)',
    image: 'var(--color-button-pressed-image)',
    text: 'var(--color-button-pressed-text)',
    top: 'var(--color-button-pressed-top)',
  },
  disabled: {
    bg: 'var(--color-button-disabled-bg)',
    outline: 'var(--color-button-disabled-outline)',
    imageBg: 'var(--color-button-disabled-image-bg)',
    image: 'var(--color-button-disabled-image)',
    text: 'var(--color-button-disabled-text)',
  },
} as const;
