import type { ElementType, HTMLAttributes, ReactNode } from 'react';

/** Badge 시각 variant. neutral = subtle label, primary = attention count/tag. */
export type BadgeVariant = 'neutral' | 'primary';

export interface BadgeOwnProps {
  /** 시각 variant. default 'neutral'. */
  variant?: BadgeVariant;

  /** HTML 요소 — Badge는 inline 본성이라 default 'span'. */
  as?: ElementType;

  children?: ReactNode;
}

/**
 * native <span>의 모든 attr 통과.
 * Card 패턴 답습 — forwardRef 미사용 (ADR-016 §대안).
 */
export interface BadgeProps
  extends BadgeOwnProps,
    Omit<HTMLAttributes<HTMLSpanElement>, keyof BadgeOwnProps> {}
