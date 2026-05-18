import type { ReactNode, MouseEventHandler } from 'react';
import { injectCss, FOCUS_RING } from '../../lib/injectCss';

injectCss('icon-button', `
  .demo-iconbtn {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 5px;
    background: transparent;
    border: 1px solid var(--color-border-mid);
    color: var(--color-text-dark);
    cursor: pointer;
    font-family: inherit;
    transition: background 100ms ease-out;
  }
  .demo-iconbtn:hover {
    background: var(--color-surface-subtle);
  }
  .demo-iconbtn:focus-visible {
    ${FOCUS_RING}
  }
  .demo-iconbtn[data-variant="ghost"] {
    border-color: transparent;
  }
  .demo-iconbtn-badge {
    position: absolute;
    top: -4px;
    right: -4px;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    border-radius: 9px;
    background: var(--color-status-alarm-text);
    color: white;
    font-size: 10px;
    font-weight: 500;
    line-height: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
`);

interface IconButtonProps {
  icon: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  badge?: number | string | null;
  variant?: 'outline' | 'ghost';
  'aria-label': string;
}

export function IconButton({ icon, onClick, badge, variant = 'outline', ...rest }: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-variant={variant}
      className="demo-iconbtn"
      {...rest}
    >
      {icon}
      {badge != null && badge !== 0 && <span className="demo-iconbtn-badge">{badge}</span>}
    </button>
  );
}
