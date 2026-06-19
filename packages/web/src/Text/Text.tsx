import type { CSSProperties, ElementType } from 'react';
import {
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  text as textColors,
  interfaceColors,
} from '@wonik/tokens';
import type { TextColor, TextProps, TextVariant } from './types';

// Web reading variants get relaxed line-height (1.5) for legible multi-line text;
// dense/label variants (HMI heritage) keep tight (1). ADR-040.
// NOTE: headings (h1~h3) intentionally share body's 1.5 — a heading-specific
// leading (~1.2) is deferred until the first multi-line web-heading consumer
// appears (ADR-040 trade-off #3, 2026-06-19 re-review). Single-line titles are
// unaffected by line-height, so there's no harm yet.
const RELAXED_VARIANTS: ReadonlySet<TextVariant> = new Set<TextVariant>([
  'body',
  'h1',
  'h2',
  'h3',
]);

const COLOR_MAP: Record<TextColor, string> = {
  primary: textColors.primary,
  secondary: textColors.secondary,
  dim: textColors.dim,
  dark: textColors.dark,
  onDark: textColors.onDark,
  onDarkVal: textColors.onDarkVal,
  onDarkDim: textColors.onDarkDim,
  brand: interfaceColors.primary,
};

export function Text({
  variant = 'label',
  weight = 'regular',
  color = 'dark',
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
    lineHeight: RELAXED_VARIANTS.has(variant) ? lineHeight.normal : lineHeight.tight,
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
