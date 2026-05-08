import type { HTMLAttributes, Ref } from 'react';

export type SpinnerSize = 'sm' | 'md' | 'lg';

export interface SpinnerOwnProps {
  /** size 토큰. 기본 'md'. 16/24/40 */
  size?: SpinnerSize;

  /** 스크린리더용 라벨. 기본 'Loading'. */
  label?: string;

  /** native span ref. */
  ref?: Ref<HTMLSpanElement>;
}

/**
 * native <span>의 모든 attr 통과.
 * role/aria-busy/aria-live는 컴포넌트가 강제 — consumer override 금지.
 */
export interface SpinnerProps
  extends SpinnerOwnProps,
    Omit<HTMLAttributes<HTMLSpanElement>, 'role' | 'aria-busy' | 'aria-live'> {}
