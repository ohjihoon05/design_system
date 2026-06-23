import { forwardRef } from 'react';
import type { CSSProperties } from 'react';
import { statusTokens, interfaceColors } from '@wonik/tokens';
import type { CheckboxProps, CheckboxSize } from './types';
import { ensureCssInjected } from '../utils/ensureCssInjected';

// ADR-011: keyboard focus indicator. inline style로 pseudo-class 못 풀어서 1회-inject CSS.
const CHECKBOX_CSS = `
.wonik-checkbox:focus-visible {
  outline: 2px solid var(--color-focus, var(--color-primary));
  outline-offset: 2px;
}
`;

const SIZE_PX: Record<CheckboxSize, string> = {
  sm: '16px',
  md: '20px',
  lg: '24px',
};

// 1단계 단순화 — appearance:none + 커스텀 mask는 inline style로 :checked
// 가상 클래스를 분기할 수 없어 시각이 깨진다. 대신 `accent-color`로 native
// checkbox 체크 색만 토큰화 — 토큰 일관성을 가장 적은 비용으로 달성.
const BASE_STYLE: CSSProperties = {
  margin: 0,
  cursor: 'pointer',
  flexShrink: 0,
  accentColor: interfaceColors.primary,
};

const INVALID_STYLE: CSSProperties = {
  borderColor: statusTokens.alarm.text,
  outline: `2px solid ${statusTokens.alarm.text}`,
  outlineOffset: '0px',
};

const DISABLED_STYLE: CSSProperties = {
  cursor: 'not-allowed',
  opacity: 0.5,
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    { size = 'md', invalid = false, disabled, className, style, onChange, ...rest },
    ref,
  ) {
    ensureCssInjected('checkbox', CHECKBOX_CSS);
    const composed: CSSProperties = {
      ...BASE_STYLE,
      width: SIZE_PX[size],
      height: SIZE_PX[size],
      ...(invalid && INVALID_STYLE),
      ...(disabled && DISABLED_STYLE),
      ...style,
    };
    const mergedClassName = className ? `wonik-checkbox ${className}` : 'wonik-checkbox';

    return (
      <input
        {...rest}
        ref={ref}
        type="checkbox"
        className={mergedClassName}
        disabled={disabled}
        onChange={disabled ? undefined : onChange}
        aria-invalid={invalid || undefined}
        style={composed}
      />
    );
  },
);
