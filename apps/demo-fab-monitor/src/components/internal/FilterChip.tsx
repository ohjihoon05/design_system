import type { ReactNode } from 'react';
import { injectCss, FOCUS_RING } from '../../lib/injectCss';

injectCss('filter-chip', `
  .demo-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 5px;
    font-size: 12px;
    font-weight: 500;
    line-height: 1;
    cursor: pointer;
    font-family: inherit;
    border: 1px solid var(--color-border-mid);
    background: var(--color-surface);
    color: var(--color-text-dark);
    transition: background 100ms ease-out;
  }
  .demo-chip:hover {
    background: var(--color-surface-subtle);
  }
  .demo-chip:focus-visible {
    ${FOCUS_RING}
  }
  .demo-chip[data-active="true"] {
    background: var(--color-primary-bg);
    border-color: var(--color-primary);
    color: var(--color-primary-selected);
  }
  .demo-chip[data-active="true"]:hover {
    background: var(--color-primary-bg);
  }
`);

interface FilterChipProps {
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
  'aria-label'?: string;
}

export function FilterChip({ active = false, onClick, children, ...rest }: FilterChipProps) {
  return (
    <button
      type="button"
      data-active={active}
      onClick={onClick}
      className="demo-chip"
      aria-pressed={active}
      {...rest}
    >
      {children}
    </button>
  );
}
