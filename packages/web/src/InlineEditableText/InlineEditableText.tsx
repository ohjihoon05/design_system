import { useEffect, useRef, useState, createElement } from 'react';
import type {
  CSSProperties,
  KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { interfaceColors, fontSize, fontFamily, fontWeight } from '@wonik/tokens';
import { Input } from '../Input';
import type { InlineEditableTextProps } from './types';

// ADR-011: :hover and :focus-visible cannot be expressed inline; inject once.
const INLINE_EDITABLE_CSS = `
.wonik-inline-editable {
  display: inline-block;
  cursor: text;
  color: var(--color-text, currentColor);
  transition: color 0.12s ease;
  outline: none;
}
.wonik-inline-editable:hover:not([aria-disabled="true"]) {
  color: var(--color-primary);
}
.wonik-inline-editable:focus-visible {
  outline: 2px solid var(--color-focus, var(--color-primary));
  outline-offset: 2px;
}
.wonik-inline-editable[aria-disabled="true"] {
  cursor: not-allowed;
  opacity: 0.5;
}
.wonik-inline-editable--placeholder {
  color: var(--color-text-muted, var(--color-text-dim));
}
`;

let cssInjected = false;
function ensureCssInjected() {
  if (cssInjected || typeof document === 'undefined') return;
  const style = document.createElement('style');
  style.setAttribute('data-wonik-inline-editable', 'true');
  style.textContent = INLINE_EDITABLE_CSS;
  document.head.appendChild(style);
  cssInjected = true;
}

const SIZE_TO_FONT: Record<NonNullable<InlineEditableTextProps['size']>, string> = {
  sm: fontSize.labelSm,
  md: fontSize.label,
  lg: fontSize.titleSm,
};

export function InlineEditableText({
  value,
  onChange,
  placeholder = '',
  disabled = false,
  trigger = 'single',
  saveOnBlur = true,
  selectOnFocus = true,
  as = 'span',
  size = 'md',
  ariaLabel,
  className,
  style,
}: InlineEditableTextProps) {
  ensureCssInjected();

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const committedRef = useRef(false);

  // Sync external value into display when not editing. While editing, the
  // draft is the source of truth — ignore upstream changes.
  useEffect(() => {
    if (!editing) {
      setDraft(value);
    }
  }, [value, editing]);

  // On entering edit mode: focus + (optionally) select all.
  useEffect(() => {
    if (editing && inputRef.current && selectOnFocus) {
      inputRef.current.select();
    }
  }, [editing, selectOnFocus]);

  const enterEdit = () => {
    if (disabled) return;
    committedRef.current = false;
    setDraft(value);
    setEditing(true);
  };

  const commitSave = () => {
    if (committedRef.current) return;
    committedRef.current = true;
    setEditing(false);
    if (draft !== value) {
      onChange(draft);
    }
  };

  const commitCancel = () => {
    if (committedRef.current) return;
    committedRef.current = true;
    setDraft(value);
    setEditing(false);
  };

  /* ── display-mode handlers ───────────────────────── */

  const handleDisplayClick = () => {
    if (disabled || trigger !== 'single') return;
    enterEdit();
  };

  const handleDisplayDoubleClick = () => {
    if (disabled || trigger !== 'double') return;
    enterEdit();
  };

  const handleDisplayKeyDown = (e: ReactKeyboardEvent) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      enterEdit();
    }
  };

  /* ── edit-mode handlers ──────────────────────────── */

  const handleInputKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      commitSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      commitCancel();
    }
  };

  const handleInputBlur = () => {
    if (saveOnBlur) {
      commitSave();
    } else {
      commitCancel();
    }
  };

  /* ── render ───────────────────────────────────────── */

  if (editing) {
    return (
      <Input
        ref={inputRef}
        size={size}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleInputKeyDown}
        onBlur={handleInputBlur}
        // eslint-disable-next-line jsx-a11y/no-autofocus -- intentional: entering edit mode requires immediate cursor focus, this is the entire UX promise of inline-editing. See ADR-027.
        autoFocus
      />
    );
  }

  const isPlaceholder = value === '';
  const displayText = isPlaceholder ? placeholder : value;

  const displayStyle: CSSProperties = {
    fontFamily: fontFamily.base,
    fontWeight: fontWeight.regular,
    fontSize: SIZE_TO_FONT[size],
    color: isPlaceholder ? interfaceColors.textMuted : interfaceColors.text,
    ...style,
  };

  const cls =
    `wonik-inline-editable${isPlaceholder ? ' wonik-inline-editable--placeholder' : ''}` +
    (className ? ` ${className}` : '');

  return createElement(
    as,
    {
      role: 'button',
      tabIndex: disabled ? -1 : 0,
      'aria-label': ariaLabel ?? (value || placeholder),
      'aria-disabled': disabled || undefined,
      onClick: handleDisplayClick,
      onDoubleClick: handleDisplayDoubleClick,
      onKeyDown: handleDisplayKeyDown,
      className: cls,
      style: displayStyle,
    },
    displayText,
  );
}
