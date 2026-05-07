import type { CSSProperties, ElementType } from 'react';
import {
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  primary,
  text as textColors,
} from '@wonik/tokens';
import type { TextColor, TextProps } from './types';

const COLOR_MAP: Record<TextColor, string> = {
  primary: textColors.primary,
  secondary: textColors.secondary,
  dim: textColors.dim,
  dark: textColors.dark,
  onDark: textColors.onDark,
  onDarkVal: textColors.onDarkVal,
  onDarkDim: textColors.onDarkDim,
  brand: primary.base,
};

export function Text({
  variant = 'label',
  weight = 'regular',
  color = 'primary',
  align,
  as,
  truncate = false,
  style,
  children,
  ...rest
}: TextProps) {
  const Component = (as ?? 'p') as ElementType;

  const composed: CSSProperties = {
    fontFamily: fontFamily.base,
    fontSize: fontSize[variant],
    fontWeight: fontWeight[weight],
    lineHeight: lineHeight.tight,
    color: COLOR_MAP[color],
    margin: 0,
    ...(align !== undefined && { textAlign: align }),
    ...(truncate && {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    }),
    ...style,
  };

  return (
    <Component style={composed} {...rest}>
      {children}
    </Component>
  );
}
