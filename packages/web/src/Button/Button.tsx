import type { CSSProperties } from 'react';
import {
  primary,
  surfaces,
  text,
  statusTokens,
  space,
  radius,
  fontSize,
  fontWeight,
  fontFamily,
  borders,
} from '@wonik/tokens';
import type { ButtonProps, ButtonVariant, ButtonSize } from './types';

const variantStyles: Record<ButtonVariant, CSSProperties> = {
  primary: {
    background: primary.base,
    color: surfaces.surfaceWhite,
    border: 'none',
  },
  secondary: {
    background: surfaces.surface,
    color: text.primary,
    border: `1px solid ${borders.mid}`,
  },
  text: {
    background: 'transparent',
    color: text.primary,
    border: 'none',
  },
  outline: {
    background: 'transparent',
    color: primary.base,
    border: `1px solid ${primary.base}`,
  },
  danger: {
    background: statusTokens.alarm.text,
    color: surfaces.surfaceWhite,
    border: 'none',
  },
};

const sizeStyles: Record<ButtonSize, CSSProperties> = {
  sm: { padding: `${space[1]} ${space[3]}`, fontSize: fontSize.labelSm, height: '24px' },
  md: { padding: `${space[3]} ${space[5]}`, fontSize: fontSize.label, height: '32px' },
  lg: { padding: `${space[3]} ${space[6]}`, fontSize: fontSize.titleSm, height: '40px' },
};

const baseStyle: CSSProperties = {
  fontFamily: fontFamily.base,
  fontWeight: fontWeight.regular,
  borderRadius: radius.sm,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: 1,
  transition: 'opacity 0.15s ease',
};

const disabledStyle: CSSProperties = {
  opacity: 0.5,
  cursor: 'not-allowed',
};

export function Button({
  variant = 'primary',
  size = 'md',
  disabled,
  style,
  children,
  ...rest
}: ButtonProps) {
  const composed: CSSProperties = {
    ...baseStyle,
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...(disabled ? disabledStyle : {}),
    ...style,
  };

  return (
    <button {...rest} disabled={disabled} style={composed}>
      {children}
    </button>
  );
}
