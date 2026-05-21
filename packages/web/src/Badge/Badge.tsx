import type { CSSProperties, ElementType } from 'react';
import {
  space,
  radius,
  fontSize,
  fontWeight,
  lineHeight,
  interfaceColors,
  surfaces,
} from '@wonik/tokens';
import type { BadgeProps, BadgeVariant } from './types';

const BASE_STYLE: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: `${space[1]} ${space[3]}`,
  borderRadius: radius.sm,
  fontSize: fontSize.label,
  fontWeight: fontWeight.medium,
  lineHeight: lineHeight.tight,
  fontVariantNumeric: 'tabular-nums',
};

const VARIANT_STYLE: Record<BadgeVariant, CSSProperties> = {
  neutral: {
    background: interfaceColors.surface,
    color: interfaceColors.text,
    border: `1px solid ${interfaceColors.border}`,
  },
  primary: {
    background: interfaceColors.primary,
    color: surfaces.surfaceWhite,
  },
};

export function Badge({
  variant = 'neutral',
  as,
  className,
  style,
  children,
  ...rest
}: BadgeProps) {
  const Component = (as ?? 'span') as ElementType;

  const composed: CSSProperties = {
    ...BASE_STYLE,
    ...VARIANT_STYLE[variant],
    ...style,
  };

  const composedClassName = className ? `wonik-badge ${className}` : 'wonik-badge';

  return (
    <Component className={composedClassName} style={composed} {...rest}>
      {children}
    </Component>
  );
}
