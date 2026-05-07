import { forwardRef } from 'react';
import type { CSSProperties } from 'react';
import { primary, statusTokens } from '@wonik/tokens';
import type { RadioProps, RadioSize } from './types';

const SIZE_PX: Record<RadioSize, string> = {
  sm: '16px',
  md: '20px',
  lg: '24px',
};

// 1단계 단순화 — Checkbox와 동일하게 native <input type="radio">의 시각을 직접
// 커스텀하지 않고 `accent-color`로 native dot 색만 토큰화. 풀 커스텀(:checked
// 분기)은 후속 polish — 1단계는 토큰 일관성을 가장 적은 비용으로 달성.
const BASE_STYLE: CSSProperties = {
  margin: 0,
  cursor: 'pointer',
  flexShrink: 0,
  accentColor: primary.base,
};

const INVALID_STYLE: CSSProperties = {
  outline: `2px solid ${statusTokens.alarm.text}`,
  outlineOffset: '0px',
  borderRadius: '50%',
};

const DISABLED_STYLE: CSSProperties = {
  cursor: 'not-allowed',
  opacity: 0.5,
};

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
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
      type="radio"
      disabled={disabled}
      onChange={disabled ? undefined : onChange}
      aria-invalid={invalid || undefined}
      style={composed}
    />
  );
});
