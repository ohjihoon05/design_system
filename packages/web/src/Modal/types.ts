import type { HTMLAttributes, ReactNode } from 'react';

export type ModalSize = 'sm' | 'md' | 'lg';

export interface ModalOwnProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
  size?: ModalSize;
  children: ReactNode;
}

export interface ModalProps
  extends ModalOwnProps,
    Omit<HTMLAttributes<HTMLDivElement>, keyof ModalOwnProps> {}

export interface ModalBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}
