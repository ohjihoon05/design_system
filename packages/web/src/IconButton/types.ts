import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type IconButtonVariant = 'outline' | 'ghost';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonOwnProps {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  'aria-label': string;
}

export interface IconButtonProps
  extends IconButtonOwnProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof IconButtonOwnProps | 'aria-label'> {
  children: ReactNode;
}
