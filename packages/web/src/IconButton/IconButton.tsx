import type { CSSProperties } from 'react';
import { interfaceColors, radius } from '@wonik/tokens';
import type { IconButtonProps, IconButtonVariant, IconButtonSize } from './types';
import { ensureCssInjected } from '../utils/ensureCssInjected';

// ADR-011: :hover / :focus-visible — inline style로 못 풀어서 module-scope CSS 1회-inject.
// background의 base 값은 클래스 규칙에 둔다 — inline에 두면 인라인이
// 아래 :hover 규칙을 항상 이겨서 hover가 죽는다 (ISSUE-005).
const ICONBUTTON_CSS = `
.wonik-iconbtn {
  background: transparent;
}
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
    color: interfaceColors.text,
    border: `1px solid ${interfaceColors.border}`,
  },
  ghost: {
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
