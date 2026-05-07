import { forwardRef } from 'react';
import type { CSSProperties } from 'react';
import { primary, statusTokens } from '@wonik/tokens';
import type { CheckboxProps, CheckboxSize } from './types';

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
  accentColor: primary.base,
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
    { size = 'md', invalid = false, disabled, style, onChange, ...rest },
    ref,
  ) {
    const composed: CSSProperties = {
      ...BASE_STYLE,
      width: SIZE_PX[size],
      height: SIZE_PX[size],
      ...(invalid && INVALID_STYLE),
      ...(disabled && DISABLED_STYLE),
      ...style,
    };

    return (
      <input
        {...rest}
        ref={ref}
        type="checkbox"
        disabled={disabled}
        onChange={disabled ? undefined : onChange}
        aria-invalid={invalid || undefined}
        style={composed}
      />
    );
  },
);
