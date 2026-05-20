import type { HTMLAttributes } from 'react';

export interface AvatarOwnProps {
  name: string;
  size?: number;
  color?: string;
}

export interface AvatarProps
  extends AvatarOwnProps,
    Omit<HTMLAttributes<HTMLSpanElement>, keyof AvatarOwnProps | 'children'> {}
