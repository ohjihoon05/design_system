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
import type { TextareaProps, TextareaSize } from './types';
import { ensureCssInjected } from '../utils/ensureCssInjected';

// ADR-011: :focus-visible, :hover, ::placeholder는 inline style로 못 풀어서 1회-inject CSS.
// outline·border-color의 base 값도 여기(클래스 규칙)에 둔다 — inline에 두면
// 인라인이 아래 pseudo-class 규칙을 항상 이겨서 focus ring·hover가 죽는다 (ISSUE-004/005).
const TEXTAREA_CSS = `
.wonik-textarea {
  outline: none;
  border-color: ${interfaceColors.border};
}
.wonik-textarea:focus-visible {
  outline: 2px solid var(--color-focus, var(--color-primary));
  outline-offset: 0;
}
.wonik-textarea:hover:not(:disabled) {
  border-color: var(--color-border-strong, var(--color-border-mid));
}
.wonik-textarea::placeholder {
  color: var(--color-placeholder, var(--color-text-dim));
  opacity: 1;
}
`;

const SIZE_FONT: Record<TextareaSize, string> = {
  sm: fontSize.labelSm,
  md: fontSize.label,
  lg: fontSize.titleSm,
};

const SIZE_PADDING: Record<TextareaSize, string> = {
  sm: `${space[2]} ${space[3]}`,
  md: `${space[3]} ${space[5]}`,
  lg: `${space[3]} ${space[6]}`,
};

const BASE_STYLE: CSSProperties = {
  fontFamily: fontFamily.base,
  fontWeight: fontWeight.regular,
  color: interfaceColors.text,
  background: interfaceColors.surface,
  // border shorthand 금지 — INVALID_STYLE의 borderColor(longhand)와 혼용 시
  // invalid→valid 리렌더에서 React가 스타일 충돌 에러를 낸다 (ISSUE-001).
  // base border-color·outline은 TEXTAREA_CSS 클래스 규칙에 있다 (ISSUE-004/005).
  borderWidth: '1px',
  borderStyle: 'solid',
  borderRadius: radius.sm,
  width: '100%',
  boxSizing: 'border-box',
  lineHeight: 1.5,
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
  resize: 'none',
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    size = 'md',
    invalid = false,
    rows = 4,
    resize = 'vertical',
    disabled,
    className,
    style,
    onChange,
    ...rest
  },
  ref
) {
  ensureCssInjected('textarea', TEXTAREA_CSS);
  const composed: CSSProperties = {
    ...BASE_STYLE,
    fontSize: SIZE_FONT[size],
    padding: SIZE_PADDING[size],
    resize: disabled ? 'none' : resize,
    ...(invalid && INVALID_STYLE),
    ...(disabled && DISABLED_STYLE),
    ...style,
  };
  const mergedClassName = className ? `wonik-textarea ${className}` : 'wonik-textarea';

  return (
    <textarea
      {...rest}
      ref={ref}
      rows={rows}
      className={mergedClassName}
      disabled={disabled}
      onChange={disabled ? undefined : onChange}
      aria-invalid={invalid || undefined}
      style={composed}
    />
  );
});
