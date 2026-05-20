import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface FilterChipOwnProps {
  active?: boolean;
}

export interface FilterChipProps
  extends FilterChipOwnProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof FilterChipOwnProps | 'children'> {
  children: ReactNode;
}
