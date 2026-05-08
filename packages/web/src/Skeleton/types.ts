import type { HTMLAttributes, Ref } from 'react';

export type SkeletonVariant = 'text' | 'rect' | 'circle';

export interface SkeletonOwnProps {
  /** placeholder 모양. 기본 'text'. */
  variant?: SkeletonVariant;

  /** 명시적 width. number는 px. variant 기본값 override. */
  width?: string | number;

  /** 명시적 height. number는 px. variant 기본값 override. */
  height?: string | number;

  /** native div ref. */
  ref?: Ref<HTMLDivElement>;
}

/**
 * native <div>의 모든 attr 통과.
 * role/aria-busy는 컴포넌트가 강제 — consumer override 금지.
 */
export interface SkeletonProps
  extends SkeletonOwnProps,
    Omit<HTMLAttributes<HTMLDivElement>, 'role' | 'aria-busy'> {}
