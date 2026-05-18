import type { ReactNode } from 'react';

export type ToastTone = 'info' | 'success' | 'warning' | 'error';
export type ToastPosition = 'top-right' | 'bottom-right' | 'top-center' | 'bottom-center';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  tone?: ToastTone;
  title: string;
  description?: string;
  /** ms — `0` or `null` = persistent (no auto-dismiss). default 4000. */
  duration?: number | null;
  action?: ToastAction;
}

export interface ToastItem extends Required<Pick<ToastOptions, 'title'>> {
  id: string;
  tone: ToastTone;
  description?: string;
  duration: number | null;
  action?: ToastAction;
}

export interface ToastApi {
  show(options: ToastOptions): string;
  dismiss(id: string): void;
  dismissAll(): void;
}

export interface ToastProviderProps {
  children: ReactNode;
  position?: ToastPosition;
  /** Max simultaneous toasts. default 5. */
  max?: number;
}
