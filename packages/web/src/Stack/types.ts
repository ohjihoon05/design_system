import type { ReactNode } from 'react';
import type { BoxProps, SpaceToken } from '../Box/types';

export type StackDirection = 'row' | 'column';

export type StackAlign = 'start' | 'center' | 'end' | 'stretch';
export type StackJustify = 'start' | 'center' | 'end' | 'between' | 'around';

export interface StackOwnProps {
  /** flex 축 — 기본 'column' (vertical). UI 대부분이 vertical stack이라는 통념. */
  direction?: StackDirection;

  /** flex gap — space token index. 4 → '10px'. */
  gap?: SpaceToken;

  /** cross-axis alignment. */
  align?: StackAlign;

  /** main-axis distribution. */
  justify?: StackJustify;

  /** flex-wrap 활성화. 기본 false. */
  wrap?: boolean;

  children?: ReactNode;
}

/**
 * Stack은 Box 위에 layer — Box의 prop(`p`/`m`/`bg`/`border`/`rounded`/`as` 등)을 그대로 통과한다.
 * StackOwnProps의 prop(`direction`/`gap`/...)은 Box prop과 충돌하지 않는다.
 */
export interface StackProps
  extends StackOwnProps,
    Omit<BoxProps, keyof StackOwnProps> {}
