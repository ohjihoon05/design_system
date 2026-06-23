import { forwardRef } from 'react';
import type { CSSProperties } from 'react';
import { interfaceColors } from '@wonik/tokens';
import type { SpinnerProps, SpinnerSize } from './types';
import { ensureCssInjected } from '../utils/ensureCssInjected';

interface SizeSpec {
  diameter: string;
  thickness: string;
}

const SIZE_SPEC: Record<SpinnerSize, SizeSpec> = {
  sm: { diameter: '16px', thickness: '2px' },
  md: { diameter: '24px', thickness: '2px' },
  lg: { diameter: '40px', thickness: '3px' },
};

// @keyframes는 inline style로 정의 못 하므로 module-scoped CSS 1회 inject (Switch 패턴 동일).
const SPINNER_CSS = `
@keyframes wonik-spin {
  to { transform: rotate(360deg); }
}
`;

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size = 'md', label = 'Loading', style, ...rest },
  ref,
) {
  ensureCssInjected('spinner', SPINNER_CSS);
  const spec = SIZE_SPEC[size];

  const composed: CSSProperties = {
    display: 'inline-block',
    width: spec.diameter,
    height: spec.diameter,
    borderWidth: spec.thickness,
    borderStyle: 'solid',
    borderColor: interfaceColors.border,
    borderTopColor: interfaceColors.primary,
    borderRadius: '50%',
    boxSizing: 'border-box',
    animation: 'wonik-spin 0.8s linear infinite',
    flexShrink: 0,
    ...style,
  };

  return (
    <span
      {...rest}
      ref={ref}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
      style={composed}
    />
  );
});
