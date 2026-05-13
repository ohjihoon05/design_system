import type { CSSProperties, ElementType, MouseEvent } from 'react';
import {
  space,
  radius,
  fontSize,
  lineHeight,
  statusTokens,
} from '@wonik/tokens';
import type { AlertProps } from './types';

const DISMISS_BTN_STYLE: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'transparent',
  border: 'none',
  color: 'inherit',
  cursor: 'pointer',
  padding: space[1],
  fontSize: fontSize.titleSm,
  lineHeight: lineHeight.tight,
  fontFamily: 'inherit',
};

export function Alert({
  onDismiss,
  as,
  className,
  style,
  children,
  ...rest
}: AlertProps) {
  const Component = (as ?? 'div') as ElementType;

  const composed: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: onDismiss ? 'space-between' : undefined,
    gap: space[3],
    padding: `${space[5]} ${space[6]}`,
    borderRadius: radius.md,
    fontSize: fontSize.titleSm,
    lineHeight: lineHeight.tight,
    background: statusTokens.alarm.bg,
    color: statusTokens.alarm.text,
    border: `1px solid ${statusTokens.alarm.border}`,
    ...style,
  };

  const composedClassName = className ? `wonik-alert ${className}` : 'wonik-alert';

  const handleDismissClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onDismiss?.();
  };

  return (
    <Component role="alert" className={composedClassName} style={composed} {...rest}>
      <span>{children}</span>
      {onDismiss && (
        <button
          type="button"
          aria-label="닫기"
          onClick={handleDismissClick}
          style={DISMISS_BTN_STYLE}
        >
          ×
        </button>
      )}
    </Component>
  );
}
