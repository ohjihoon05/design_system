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
  border: `1px solid ${interfaceColors.border}`,
  borderRadius: radius.sm,
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
  resize: 'vertical',
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
  { size = 'md', invalid = false, rows = 4, disabled, style, onChange, ...rest },
  ref
) {
  const composed: CSSProperties = {
    ...BASE_STYLE,
    fontSize: SIZE_FONT[size],
    padding: SIZE_PADDING[size],
    ...(invalid && INVALID_STYLE),
    ...(disabled && DISABLED_STYLE),
    ...style,
  };

  return (
    <textarea
      {...rest}
      ref={ref}
      rows={rows}
      disabled={disabled}
      onChange={disabled ? undefined : onChange}
      aria-invalid={invalid || undefined}
      style={composed}
    />
  );
});
