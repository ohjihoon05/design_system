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
  /**
   * Text color token. Defaults to `dark` (passes WCAG AA on every light surface).
   *
   * ⚠️ `primary` (#71717B) only meets AA (4.5:1) on white-ish surfaces
   * (surfaceWhite/surface, #FEFEFE·#FFFFFF). On canvas/surfaceSubtle/
   * surfaceInset/surfaceMid it falls below 4.5:1 — use `dark` for body-grade
   * text there, reserve `primary` for muted labels on white surfaces.
   * (ADR-041 §B; guarded by tokens/scripts/contrast-audit.ts.)
   */
  color?: TextColor;
  align?: TextAlign;
  as?: TextAs;
  truncate?: boolean;
  children?: ReactNode;
}

export interface TextProps
  extends TextOwnProps,
    Omit<ComponentPropsWithoutRef<'p'>, keyof TextOwnProps> {}
