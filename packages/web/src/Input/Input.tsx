import { forwardRef } from 'react';
import type { CSSProperties } from 'react';
import {
  surfaces,
  statusTokens,
  space,
  radius,
  fontSize,
  fontFamily,
  fontWeight,
  interfaceColors,
} from '@wonik/tokens';
import type { InputProps, InputSize } from './types';
import { ensureCssInjected } from '../utils/ensureCssInjected';

// ADR-011: :focus-visible, :hover, ::placeholder는 inline style로 못 풀어서 1회-inject CSS.
// outline·border-color의 base 값도 여기(클래스 규칙)에 둔다 — inline에 두면
// 인라인이 아래 pseudo-class 규칙을 항상 이겨서 focus ring·hover가 죽는다 (ISSUE-004/005).
const INPUT_CSS = `
.wonik-input {
  outline: none;
  border-color: ${interfaceColors.border};
}
.wonik-input:focus-visible {
  outline: 2px solid var(--color-focus, var(--color-primary));
  outline-offset: 0;
}
.wonik-input:hover:not(:disabled) {
  border-color: var(--color-border-strong, var(--color-border-mid));
}
.wonik-input::placeholder {
  color: var(--color-placeholder, var(--color-text-dim));
  opacity: 1;
}
`;

const SIZE_STYLES: Record<InputSize, CSSProperties> = {
  sm: { height: '24px', padding: `0 ${space[3]}`, fontSize: fontSize.labelSm },
  md: { height: '32px', padding: `0 ${space[5]}`, fontSize: fontSize.label },
  lg: { height: '40px', padding: `0 ${space[6]}`, fontSize: fontSize.titleSm },
};

const BASE_STYLE: CSSProperties = {
  fontFamily: fontFamily.base,
  fontWeight: fontWeight.regular,
  color: interfaceColors.text,
  background: interfaceColors.surface,
  // border shorthand 금지 — INVALID_STYLE의 borderColor(longhand)와 혼용 시
  // invalid→valid 리렌더에서 React가 스타일 충돌 에러를 낸다 (ISSUE-001).
  // base border-color·outline은 INPUT_CSS 클래스 규칙에 있다 (ISSUE-004/005).
  borderWidth: '1px',
  borderStyle: 'solid',
  borderRadius: radius.sm,
  width: '100%',
  boxSizing: 'border-box',
  transition: 'border-color 0.12s ease, box-shadow 0.12s ease',
};

const INVALID_STYLE: CSSProperties = {
  borderColor: statusTokens.alarm.text,
};

const DISABLED_STYLE: CSSProperties = {
  background: surfaces.surfaceSubtle,
  color: interfaceColors.textMuted,
  cursor: 'not-allowed',
  opacity: 0.6,
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    size = 'md',
    invalid = false,
    leftAddon,
    rightAddon,
    disabled,
    className,
    style,
    onChange,
    ...rest
  },
  ref
) {
  ensureCssInjected('input', INPUT_CSS);
  const inputStyle: CSSProperties = {
    ...BASE_STYLE,
    ...SIZE_STYLES[size],
    ...(invalid && INVALID_STYLE),
    ...(disabled && DISABLED_STYLE),
    ...style,
  };
  const mergedClassName = className ? `wonik-input ${className}` : 'wonik-input';

  const inputEl = (
    <input
      {...rest}
      ref={ref}
      className={mergedClassName}
      disabled={disabled}
      onChange={disabled ? undefined : onChange}
      aria-invalid={invalid || undefined}
      style={inputStyle}
    />
  );

  if (!leftAddon && !rightAddon) {
    return inputEl;
  }

  const wrapperStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: space[3],
    width: '100%',
  };

  return (
    <span style={wrapperStyle}>
      {leftAddon}
      {inputEl}
      {rightAddon}
    </span>
  );
});
