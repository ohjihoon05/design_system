import type { ElementType, HTMLAttributes, ReactNode } from 'react';

/** 카드 시각 variant. surface = 1px border, elevated = light box-shadow (dark에선 그림자 0, ADR-009 정신). */
export type CardVariant = 'surface' | 'elevated';

/** 카드 내부 padding 토큰. md(16px)가 default — Trial 4 ppt `p-4` 대응. */
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardOwnProps {
  /** 시각 variant. default 'surface'. */
  variant?: CardVariant;

  /** 내부 padding. default 'md'. */
  padding?: CardPadding;

  /** HTML 요소 — semantic HTML 유지를 위해 polymorphic. default 'div'. */
  as?: ElementType;

  children?: ReactNode;
}

/**
 * native <div>의 모든 attr 통과.
 * Box 패턴 답습 — forwardRef 미사용(ADR-015 §대안 4 결정).
 */
export interface CardProps
  extends CardOwnProps,
    Omit<HTMLAttributes<HTMLDivElement>, keyof CardOwnProps> {}
