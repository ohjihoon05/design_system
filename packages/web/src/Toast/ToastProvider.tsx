import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { space } from '@wonik/tokens';
import { Toast } from './Toast';
import type { ToastApi, ToastItem, ToastOptions, ToastPosition, ToastProviderProps } from './types';

export const ToastContext = createContext<ToastApi | null>(null);

const DEFAULT_DURATION = 4000;
const DEFAULT_MAX = 5;

const POSITION_STYLE: Record<ToastPosition, CSSProperties> = {
  'top-right':    { top: space[6], right: space[6], alignItems: 'flex-end' },
  'top-center':   { top: space[6], left: '50%', transform: 'translateX(-50%)', alignItems: 'center' },
  'bottom-right': { bottom: space[6], right: space[6], alignItems: 'flex-end' },
  'bottom-center':{ bottom: space[6], left: '50%', transform: 'translateX(-50%)', alignItems: 'center' },
};

let counter = 0;
function nextId() {
  counter += 1;
  return `wonik-toast-${counter}`;
}

export function ToastProvider({ children, position = 'bottom-right', max = DEFAULT_MAX }: ToastProviderProps) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current.clear();
    setItems([]);
  }, []);

  const show = useCallback((options: ToastOptions): string => {
    const id = nextId();
    const duration = options.duration === undefined ? DEFAULT_DURATION : options.duration;
    const item: ToastItem = {
      id,
      tone: options.tone ?? 'info',
      title: options.title,
      description: options.description,
      duration,
      action: options.action,
    };
    setItems((prev) => {
      const next = [...prev, item];
      // Trim queue oldest-first when above max.
      while (next.length > max) {
        const removed = next.shift();
        if (removed) {
          const t = timers.current.get(removed.id);
          if (t) {
            clearTimeout(t);
            timers.current.delete(removed.id);
          }
        }
      }
      return next;
    });
    if (duration && duration > 0) {
      const timer = setTimeout(() => dismiss(id), duration);
      timers.current.set(id, timer);
    }
    return id;
  }, [dismiss, max]);

  // Cleanup timers on unmount.
  useEffect(() => {
    const map = timers.current;
    return () => {
      map.forEach((t) => clearTimeout(t));
      map.clear();
    };
  }, []);

  const api = useMemo<ToastApi>(() => ({ show, dismiss, dismissAll }), [show, dismiss, dismissAll]);

  const stackStyle: CSSProperties = {
    position: 'fixed',
    display: 'flex',
    flexDirection: 'column',
    gap: space[3],
    zIndex: 1100,
    pointerEvents: 'none',
    ...POSITION_STYLE[position],
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      {typeof document !== 'undefined' && (
        <div className="wonik-toast-stack" style={stackStyle} aria-live="polite" role="region" aria-label="알림">
          {items.map((t) => (
            <Toast key={t.id} toast={t} onDismiss={dismiss} />
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}
