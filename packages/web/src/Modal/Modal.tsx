import { useEffect, useId, useRef } from 'react';
import type { CSSProperties, MouseEvent, KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import {
  space,
  radius,
  fontSize,
  fontWeight,
  interfaceColors,
} from '@wonik/tokens';
import type {
  ModalBodyProps,
  ModalFooterProps,
  ModalProps,
  ModalSize,
} from './types';

const SIZE_MAX_WIDTH: Record<ModalSize, number> = {
  sm: 480,
  md: 640,
  lg: 800,
};

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function ModalImpl({
  isOpen,
  onClose,
  title,
  closeOnBackdrop = true,
  closeOnEsc = true,
  size = 'md',
  children,
  className,
  style,
  ...rest
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<Element | null>(null);
  const titleId = useId();

  // Save trigger + focus first focusable on open. Restore on close.
  useEffect(() => {
    if (!isOpen) return;
    triggerRef.current = document.activeElement;
    const panel = panelRef.current;
    if (panel) {
      const focusables = panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusables.length > 0) {
        focusables[0].focus();
      } else {
        panel.focus();
      }
    }
    return () => {
      const t = triggerRef.current;
      if (t && t instanceof HTMLElement) t.focus();
    };
  }, [isOpen]);

  // Lock body scroll while open.
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!closeOnBackdrop) return;
    if (e.target === e.currentTarget) onClose();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (closeOnEsc && e.key === 'Escape') {
      e.stopPropagation();
      onClose();
      return;
    }
    if (e.key !== 'Tab') return;
    const panel = panelRef.current;
    if (!panel) return;
    const focusables = Array.from(
      panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    ).filter((el) => !el.hasAttribute('disabled'));
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement as HTMLElement | null;
    if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const backdropStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: space[6],
    zIndex: 9999,
  };

  const panelStyle: CSSProperties = {
    background: interfaceColors.surface,
    color: interfaceColors.text,
    border: `1px solid ${interfaceColors.border}`,
    borderRadius: radius.md,
    width: '100%',
    maxWidth: SIZE_MAX_WIDTH[size],
    maxHeight: 'calc(100vh - 48px)',
    display: 'flex',
    flexDirection: 'column',
    outline: 'none',
    ...style,
  };

  const headerStyle: CSSProperties = {
    padding: `${space[5]} ${space[6]}`,
    borderBottom: `1px solid ${interfaceColors.border}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space[3],
    flexShrink: 0,
  };

  const closeBtnStyle: CSSProperties = {
    background: 'transparent',
    border: 'none',
    color: 'inherit',
    cursor: 'pointer',
    padding: space[1],
    fontSize: fontSize.label,
    lineHeight: 1,
    flexShrink: 0,
    opacity: 0.7,
  };

  const mergedClassName = className ? `wonik-modal ${className}` : 'wonik-modal';

  return createPortal(
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- backdrop click is mouse-only convenience for dismiss; keyboard dismiss (ESC) is handled by the inner role="dialog" panel via onKeyDown. See ADR-027 escape-hatch policy.
    <div
      className="wonik-modal-backdrop"
      style={backdropStyle}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        className={mergedClassName}
        style={panelStyle}
        {...rest}
      >
        {title && (
          <div className="wonik-modal-header" style={headerStyle}>
            <div
              id={titleId}
              style={{
                fontSize: fontSize.titleSm,
                fontWeight: fontWeight.medium,
              }}
            >
              {title}
            </div>
            <button
              type="button"
              aria-label="닫기"
              onClick={onClose}
              style={closeBtnStyle}
            >
              ×
            </button>
          </div>
        )}
        {children}
      </div>
    </div>,
    document.body,
  );
}

function ModalBody({ children, className, style, ...rest }: ModalBodyProps) {
  const composed: CSSProperties = {
    padding: `${space[5]} ${space[6]}`,
    overflowY: 'auto',
    flex: 1,
    minHeight: 0,
    ...style,
  };
  const mergedClassName = className ? `wonik-modal-body ${className}` : 'wonik-modal-body';
  return (
    <div {...rest} className={mergedClassName} style={composed}>
      {children}
    </div>
  );
}

function ModalFooter({ children, className, style, ...rest }: ModalFooterProps) {
  const composed: CSSProperties = {
    padding: `${space[5]} ${space[6]}`,
    borderTop: `1px solid ${interfaceColors.border}`,
    display: 'flex',
    justifyContent: 'flex-end',
    gap: space[3],
    flexShrink: 0,
    ...style,
  };
  const mergedClassName = className ? `wonik-modal-footer ${className}` : 'wonik-modal-footer';
  return (
    <div {...rest} className={mergedClassName} style={composed}>
      {children}
    </div>
  );
}

export const Modal = Object.assign(ModalImpl, {
  Body: ModalBody,
  Footer: ModalFooter,
});
