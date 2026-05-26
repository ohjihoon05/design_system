import type { CSSProperties } from 'react';
import {
  surfaces,
  text,
  statusTokens,
  space,
  radius,
  fontSize,
  fontWeight,
  fontFamily,
  interfaceColors,
} from '@wonik/tokens';
import type { ButtonProps, ButtonVariant, ButtonSize } from './types';

// ADR-011: keyboard focus indicator. inline style로 pseudo-class 못 풀어서 1회-inject CSS.
const BUTTON_CSS = `
.wonik-button:focus-visible {
  outline: 2px solid var(--color-focus, var(--color-primary));
  outline-offset: 2px;
}
`;

let cssInjected = false;
function ensureCssInjected() {
  if (cssInjected || typeof document === 'undefined') return;
  const style = document.createElement('style');
  style.setAttribute('data-wonik-button', 'true');
  style.textContent = BUTTON_CSS;
  document.head.appendChild(style);
  cssInjected = true;
}

const variantStyles: Record<ButtonVariant, CSSProperties> = {
  primary: {
    background: interfaceColors.primary,
    color: surfaces.surfaceWhite,
    border: 'none',
  },
  secondary: {
    background: interfaceColors.surface,
    color: interfaceColors.text,
    border: `1px solid ${interfaceColors.border}`,
  },
  text: {
    background: 'transparent',
    color: interfaceColors.text,
    border: 'none',
  },
  outline: {
    background: 'transparent',
    color: interfaceColors.primary,
    border: `1px solid ${interfaceColors.primary}`,
  },
  danger: {
    background: statusTokens.alarm.text,
    color: surfaces.surfaceWhite,
    border: 'none',
  },
};

const sizeStyles: Record<ButtonSize, CSSProperties> = {
  sm: { padding: `${space[1]} ${space[3]}`, fontSize: fontSize.labelSm, height: '24px' },
  md: { padding: `${space[3]} ${space[5]}`, fontSize: fontSize.label, height: '32px' },
  lg: {
    padding: `${space[3]} ${space[6]}`,
    fontSize: fontSize.titleSm,
    height: '40px',
    fontWeight: fontWeight.medium,
    borderRadius: radius.md,
  },
};

const baseStyle: CSSProperties = {
  fontFamily: fontFamily.base,
  fontWeight: fontWeight.regular,
  borderRadius: radius.sm,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: 1,
  transition: 'opacity 0.15s ease',
};

const disabledStyle: CSSProperties = {
  opacity: 0.5,
  cursor: 'not-allowed',
};

export function Button({
  variant = 'primary',
  size = 'md',
  disabled,
  className,
  style,
  children,
  ...rest
}: ButtonProps) {
  ensureCssInjected();
  const composed: CSSProperties = {
    ...baseStyle,
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...(disabled ? disabledStyle : {}),
    ...style,
  };
  const mergedClassName = className ? `wonik-button ${className}` : 'wonik-button';

  return (
    <button {...rest} className={mergedClassName} disabled={disabled} style={composed}>
      {children}
    </button>
  );
}
