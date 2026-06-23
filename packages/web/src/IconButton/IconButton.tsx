import type { CSSProperties } from 'react';
import { interfaceColors, radius } from '@wonik/tokens';
import type { IconButtonProps, IconButtonVariant, IconButtonSize } from './types';
import { ensureCssInjected } from '../utils/ensureCssInjected';

// ADR-011: :hover / :focus-visible — inline style로 못 풀어서 module-scope CSS 1회-inject.
const ICONBUTTON_CSS = `
.wonik-iconbtn:hover:not(:disabled) {
  background: var(--color-surface-subtle, transparent);
}
.wonik-iconbtn:focus-visible {
  outline: 2px solid var(--color-focus, var(--color-primary));
  outline-offset: 2px;
}
`;

const variantStyles: Record<IconButtonVariant, CSSProperties> = {
  outline: {
    background: 'transparent',
    color: interfaceColors.text,
    border: `1px solid ${interfaceColors.border}`,
  },
  ghost: {
    background: 'transparent',
    color: interfaceColors.text,
    border: 'none',
  },
};

const sizeStyles: Record<IconButtonSize, CSSProperties> = {
  sm: { width: '24px', height: '24px' },
  md: { width: '32px', height: '32px' },
  lg: { width: '40px', height: '40px' },
};

const baseStyle: CSSProperties = {
  borderRadius: radius.sm,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  cursor: 'pointer',
  fontFamily: 'inherit',
  transition: 'background 100ms ease-out',
};

const disabledStyle: CSSProperties = {
  opacity: 0.5,
  cursor: 'not-allowed',
};

export function IconButton({
  variant = 'outline',
  size = 'md',
  disabled,
  className,
  style,
  children,
  type = 'button',
  ...rest
}: IconButtonProps) {
  ensureCssInjected('iconbutton', ICONBUTTON_CSS);
  const composed: CSSProperties = {
    ...baseStyle,
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...(disabled ? disabledStyle : {}),
    ...style,
  };
  const mergedClassName = className ? `wonik-iconbtn ${className}` : 'wonik-iconbtn';

  return (
    <button {...rest} type={type} className={mergedClassName} disabled={disabled} style={composed}>
      {children}
    </button>
  );
}
