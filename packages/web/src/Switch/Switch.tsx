import { forwardRef } from 'react';
import type { CSSProperties } from 'react';
import { surfaces, statusTokens, interfaceColors } from '@wonik/tokens';
import type { SwitchProps, SwitchSize } from './types';

interface SizeSpec {
  trackW: string;
  trackH: string;
  thumbSize: string;
  thumbOffset: string;
  thumbTranslate: string;
}

// Toss SLASH 스타일 — 가로:세로 약 1.7:1, 높이는 Checkbox와 통일.
const SIZE_SPEC: Record<SwitchSize, SizeSpec> = {
  sm: {
    trackW: '26px',
    trackH: '14px',
    thumbSize: '10px',
    thumbOffset: '2px',
    thumbTranslate: '12px',
  },
  md: {
    trackW: '32px',
    trackH: '18px',
    thumbSize: '14px',
    thumbOffset: '2px',
    thumbTranslate: '14px',
  },
  lg: {
    trackW: '38px',
    trackH: '22px',
    thumbSize: '18px',
    thumbOffset: '2px',
    thumbTranslate: '16px',
  },
};

// :checked 분기는 inline style로 못 풀므로 module-scoped CSS 1회 inject.
// 토큰 reference 유지 — var(--color-primary) 등.
const SWITCH_CSS = `
.wonik-switch__input:checked + .wonik-switch__track {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}
.wonik-switch__input:checked + .wonik-switch__track > .wonik-switch__thumb {
  transform: var(--wonik-switch-thumb-translate, translateX(12px));
}
.wonik-switch__input:focus-visible + .wonik-switch__track {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
`;

let cssInjected = false;
function ensureCssInjected() {
  if (cssInjected || typeof document === 'undefined') return;
  const style = document.createElement('style');
  style.setAttribute('data-wonik-switch', 'true');
  style.textContent = SWITCH_CSS;
  document.head.appendChild(style);
  cssInjected = true;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { size = 'md', invalid = false, disabled, className, onChange, ...rest },
  ref,
) {
  ensureCssInjected();
  const spec = SIZE_SPEC[size];

  const labelStyle: CSSProperties = {
    display: 'inline-block',
    position: 'relative',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    width: spec.trackW,
    height: spec.trackH,
    flexShrink: 0,
    verticalAlign: 'middle',
  };

  const inputStyle: CSSProperties = {
    position: 'absolute',
    opacity: 0,
    width: '100%',
    height: '100%',
    margin: 0,
    cursor: disabled ? 'not-allowed' : 'pointer',
  };

  const trackStyle: CSSProperties = {
    display: 'block',
    width: spec.trackW,
    height: spec.trackH,
    background: surfaces.surfaceMid,
    border: `1px solid ${invalid ? statusTokens.alarm.text : interfaceColors.border}`,
    borderRadius: spec.trackH,
    transition: 'background-color 0.15s ease, border-color 0.15s ease',
    position: 'relative',
    boxSizing: 'border-box',
    ['--wonik-switch-thumb-translate' as never]: `translateX(${spec.thumbTranslate})`,
  };

  const thumbStyle: CSSProperties = {
    position: 'absolute',
    top: spec.thumbOffset,
    left: spec.thumbOffset,
    width: spec.thumbSize,
    height: spec.thumbSize,
    background: surfaces.surfaceWhite,
    borderRadius: '50%',
    transition: 'transform 0.18s ease',
    transform: 'translateX(0)',
  };

  return (
    <label style={labelStyle} className={className}>
      <input
        {...rest}
        ref={ref}
        type="checkbox"
        role="switch"
        disabled={disabled}
        onChange={disabled ? undefined : onChange}
        aria-invalid={invalid || undefined}
        className="wonik-switch__input"
        style={inputStyle}
      />
      <span
        data-switch-track
        className="wonik-switch__track"
        style={trackStyle}
      >
        <span
          data-switch-thumb
          className="wonik-switch__thumb"
          style={thumbStyle}
        />
      </span>
    </label>
  );
});
