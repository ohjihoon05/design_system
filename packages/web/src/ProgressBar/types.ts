import type { HTMLAttributes } from 'react';

export type ProgressTone = 'primary' | 'alarm' | 'ready';

export interface ProgressBarOwnProps {
  value: number;
  height?: number;
  tone?: ProgressTone;
}

export interface ProgressBarProps
  extends ProgressBarOwnProps,
    Omit<HTMLAttributes<HTMLDivElement>, keyof ProgressBarOwnProps | 'children'> {}
