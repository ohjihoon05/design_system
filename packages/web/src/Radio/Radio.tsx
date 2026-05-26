import { forwardRef } from 'react';
import type { CSSProperties } from 'react';
import { statusTokens, interfaceColors } from '@wonik/tokens';
import type { RadioProps, RadioSize } from './types';

// ADR-011: keyboard focus indicator. inline style로 pseudo-class 못 풀어서 1회-inject CSS.
const RADIO_CSS = `
.wonik-radio:focus-visible {
  outline: 2px solid var(--color-focus, var(--color-primary));
  outline-offset: 2px;
}
`;

let cssInjected = false;
function ensureCssInjected() {
  if (cssInjected || typeof document === 'undefined') return;
  const style = document.createElement('style');
  style.setAttribute('data-wonik-radio', 'true');
  style.textContent = RADIO_CSS;
  document.head.appendChild(style);
  cssInjected = true;
}

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
  accentColor: interfaceColors.primary,
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
  { size = 'md', invalid = false, disabled, className, style, onChange, ...rest },
  ref,
) {
  ensureCssInjected();
  const composed: CSSProperties = {
    ...BASE_STYLE,
    width: SIZE_PX[size],
    height: SIZE_PX[size],
    ...(invalid && INVALID_STYLE),
    ...(disabled && DISABLED_STYLE),
    ...style,
  };
  const mergedClassName = className ? `wonik-radio ${className}` : 'wonik-radio';

  return (
    // eslint-disable-next-line jsx-a11y/role-supports-aria-props -- aria-invalid IS a global ARIA attribute supported on form controls per WAI-ARIA 1.2 §6.3 (radio inputs included). jsx-a11y@6.10 uses ARIA 1.1 spec which excluded it. See ADR-027.
    <input
      {...rest}
      ref={ref}
      type="radio"
      className={mergedClassName}
      disabled={disabled}
      onChange={disabled ? undefined : onChange}
      aria-invalid={invalid || undefined}
      style={composed}
    />
  );
});
