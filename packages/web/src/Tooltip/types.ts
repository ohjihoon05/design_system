import type { ReactElement, ReactNode } from 'react';

export type TooltipPlacement = 'top' | 'right' | 'bottom' | 'left';

export interface TooltipOwnProps {
  /**
   * The trigger element. Receives mouseEnter/Leave + focus/blur handlers
   * plus aria-describedby via cloneElement. Must be a single React element
   * that forwards refs (button, anchor, IconButton, etc.).
   */
  children: ReactElement;
  /** Tooltip body content. Plain text or inline ReactNode. */
  content: ReactNode;
  /** Placement of the bubble relative to the trigger. Default `'top'`. */
  placement?: TooltipPlacement;
  /** Delay (ms) before the tooltip appears on hover/focus. Default 200. */
  openDelay?: number;
  /** Delay (ms) before the tooltip hides on mouseLeave/blur. Default 0. */
  closeDelay?: number;
  /** Optional stable id for the bubble (used in aria-describedby). Auto-generated if omitted. */
  id?: string;
  /** When true, tooltip never shows (a11y handlers stay no-op). */
  disabled?: boolean;
}

export type TooltipProps = TooltipOwnProps;
