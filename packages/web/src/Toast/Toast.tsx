import type { CSSProperties } from 'react';
import {
  space,
  radius,
  fontSize,
  fontWeight,
  lineHeight,
  interfaceColors,
  statusTokens,
} from '@wonik/tokens';
import type { ToastItem, ToastTone } from './types';

const TONE_STYLE: Record<ToastTone, CSSProperties> = {
  info: {
    background: interfaceColors.surface,
    color: interfaceColors.text,
    border: `1px solid ${interfaceColors.border}`,
  },
  success: {
    background: statusTokens.ready.bg,
    color: statusTokens.ready.text,
    border: `1px solid ${statusTokens.ready.text}`,
  },
  warning: {
    background: statusTokens.warning.bg,
    color: statusTokens.warning.text,
    border: `1px solid ${statusTokens.warning.text}`,
  },
  error: {
    background: statusTokens.alarm.bg,
    color: statusTokens.alarm.text,
    border: `1px solid ${statusTokens.alarm.border}`,
  },
};

const ARIA_ROLE: Record<ToastTone, 'status' | 'alert'> = {
  info: 'status',
  success: 'status',
  warning: 'status',
  error: 'alert',
};

const baseStyle: CSSProperties = {
  minWidth: 0,
  width: `min(420px, calc(100vw - ${space[8]}))`,
  padding: `${space[5]} ${space[6]}`,
  borderRadius: radius.md,
  fontFamily: 'inherit',
  display: 'flex',
  flexDirection: 'column',
  gap: space[1],
  pointerEvents: 'auto',
};

interface ToastViewProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

export function Toast({ toast, onDismiss }: ToastViewProps) {
  const composed: CSSProperties = {
    ...baseStyle,
    ...TONE_STYLE[toast.tone],
  };

  return (
    <div
      role={ARIA_ROLE[toast.tone]}
      aria-live={toast.tone === 'error' ? 'assertive' : 'polite'}
      className="wonik-toast"
      style={composed}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: space[3] }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: fontSize.label,
              fontWeight: fontWeight.medium,
              lineHeight: lineHeight.tight,
            }}
          >
            {toast.title}
          </div>
          {toast.description && (
            <div
              style={{
                marginTop: space[1],
                fontSize: fontSize.labelSm,
                lineHeight: lineHeight.tight,
                opacity: 0.85,
              }}
            >
              {toast.description}
            </div>
          )}
        </div>
        <button
          type="button"
          aria-label="닫기"
          onClick={() => onDismiss(toast.id)}
          className="wonik-toast-dismiss"
          style={{
            flexShrink: 0,
            background: 'transparent',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            padding: 0,
            fontSize: fontSize.label,
            lineHeight: 1,
            opacity: 0.7,
          }}
        >
          ×
        </button>
      </div>
      {toast.action && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: space[2] }}>
          <button
            type="button"
            onClick={() => {
              toast.action!.onClick();
              onDismiss(toast.id);
            }}
            className="wonik-toast-action"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              padding: `${space[1]} ${space[3]}`,
              fontSize: fontSize.labelSm,
              fontWeight: fontWeight.medium,
              textDecoration: 'underline',
            }}
          >
            {toast.action.label}
          </button>
        </div>
      )}
    </div>
  );
}
