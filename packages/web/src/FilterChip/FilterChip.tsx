import type { CSSProperties } from 'react';
import {
  space,
  radius,
  fontSize,
  fontWeight,
  lineHeight,
  interfaceColors,
  surfaces,
  primary,
} from '@wonik/tokens';
import type { FilterChipProps } from './types';
import { ensureCssInjected } from '../utils/ensureCssInjected';

// background의 base 값은 클래스 규칙에 둔다 — inline에 두면 인라인이
// 아래 :hover 규칙을 항상 이겨서 hover가 죽는다 (ISSUE-005).
const FILTERCHIP_CSS = `
.wonik-filterchip {
  background: ${interfaceColors.surface};
}
.wonik-filterchip[data-active="true"] {
  background: ${primary.bg};
}
.wonik-filterchip:hover:not(:disabled) {
  background: ${surfaces.surfaceSubtle};
}
.wonik-filterchip[data-active="true"]:hover:not(:disabled) {
  background: ${primary.bg};
}
.wonik-filterchip:focus-visible {
  outline: 2px solid var(--color-focus, var(--color-primary));
  outline-offset: 2px;
}
`;

const baseStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: space[2],
  padding: `${space[2]} ${space[5]}`,
  borderRadius: radius.sm,
  fontSize: fontSize.label,
  fontWeight: fontWeight.medium,
  lineHeight: lineHeight.tight,
  fontFamily: 'inherit',
  cursor: 'pointer',
  transition: 'background 100ms ease-out',
};

const inactiveStyle: CSSProperties = {
  color: interfaceColors.text,
  border: `1px solid ${interfaceColors.border}`,
};

const activeStyle: CSSProperties = {
  color: primary.selected,
  border: `1px solid ${interfaceColors.primary}`,
};

export function FilterChip({
  active = false,
  className,
  style,
  children,
  type = 'button',
  ...rest
}: FilterChipProps) {
  ensureCssInjected('filterchip', FILTERCHIP_CSS);
  const composed: CSSProperties = {
    ...baseStyle,
    ...(active ? activeStyle : inactiveStyle),
    ...style,
  };
  const mergedClassName = className ? `wonik-filterchip ${className}` : 'wonik-filterchip';

  return (
    <button
      {...rest}
      type={type}
      data-active={active}
      aria-pressed={active}
      className={mergedClassName}
      style={composed}
    >
      {children}
    </button>
  );
}
