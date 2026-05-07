import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { fontSize, fontWeight } from '@wonik/tokens';

export type TextVariant = keyof typeof fontSize;
export type TextWeight = keyof typeof fontWeight;

export type TextColor =
  | 'primary'
  | 'secondary'
  | 'dim'
  | 'dark'
  | 'onDark'
  | 'onDarkVal'
  | 'onDarkDim'
  | 'brand';

export type TextAlign = 'left' | 'center' | 'right';

export type TextAs =
  | 'p'
  | 'span'
  | 'div'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'label'
  | 'strong'
  | 'em';

export interface TextOwnProps {
  variant?: TextVariant;
  weight?: TextWeight;
  color?: TextColor;
  align?: TextAlign;
  as?: TextAs;
  truncate?: boolean;
  children?: ReactNode;
}

export interface TextProps
  extends TextOwnProps,
    Omit<ComponentPropsWithoutRef<'p'>, keyof TextOwnProps> {}
