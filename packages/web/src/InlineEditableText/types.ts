import type { CSSProperties } from 'react';

export type InlineEditableTextSize = 'sm' | 'md' | 'lg';
export type InlineEditableTextTrigger = 'single' | 'double';
export type InlineEditableTextAs = 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4';

export interface InlineEditableTextOwnProps {
  /** Current text value (controlled). */
  value: string;
  /**
   * Called when the user commits a new value via Enter, onBlur (if `saveOnBlur`),
   * or commits programmatically. Escape never fires this — it cancels.
   */
  onChange: (next: string) => void;
  /** Placeholder shown when `value` is empty in display mode. */
  placeholder?: string;
  /** When true, blocks click/keyboard entry into edit mode. */
  disabled?: boolean;
  /**
   * How the display mode enters edit mode.
   * - `'single'` (default): single click / Enter / Space enters edit.
   * - `'double'`: double click enters edit; single click does nothing.
   */
  trigger?: InlineEditableTextTrigger;
  /** Whether onBlur commits the draft. Default `true`. False = onBlur cancels. */
  saveOnBlur?: boolean;
  /** Whether autofocus also selects all text in the input. Default `true`. */
  selectOnFocus?: boolean;
  /** Element tag used in display mode. Default `'span'`. */
  as?: InlineEditableTextAs;
  /** Size pass-through to the underlying `Input` in edit mode. Default `'md'`. */
  size?: InlineEditableTextSize;
  /**
   * Accessible label for the display-mode "button". When omitted, the current
   * `value` is used (or the placeholder if value is empty).
   */
  ariaLabel?: string;
  /** Extra className applied to display-mode element. Edit mode is unaffected. */
  className?: string;
  /** Extra inline style applied to display-mode element. Edit mode is unaffected. */
  style?: CSSProperties;
}

export type InlineEditableTextProps = InlineEditableTextOwnProps;
