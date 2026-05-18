import type { ReactNode } from 'react';
import { injectCss, FOCUS_RING } from '../../lib/injectCss';

injectCss('nav-button', `
  .demo-navbtn {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 10px 12px;
    border: none;
    border-radius: 5px;
    background: transparent;
    color: var(--color-text-dark);
    cursor: pointer;
    font-family: inherit;
    font-size: 14px;
    font-weight: 400;
    line-height: 1;
    text-align: left;
    transition: background 100ms ease-out;
  }
  .demo-navbtn:hover {
    background: var(--color-surface-subtle);
  }
  .demo-navbtn:focus-visible {
    ${FOCUS_RING}
  }
  .demo-navbtn[data-active="true"] {
    background: var(--color-primary-bg);
    color: var(--color-primary-selected);
    font-weight: 500;
  }
  .demo-navbtn[data-active="true"]:hover {
    background: var(--color-primary-bg);
  }
  .demo-navbtn-label {
    flex: 1;
  }
`);

interface NavButtonProps {
  active?: boolean;
  onClick?: () => void;
  icon: ReactNode;
  label: string;
  trailing?: ReactNode;
}

export function NavButton({ active = false, onClick, icon, label, trailing }: NavButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-active={active}
      className="demo-navbtn"
      aria-current={active ? 'page' : undefined}
    >
      {icon}
      <span className="demo-navbtn-label">{label}</span>
      {trailing}
    </button>
  );
}
