import {
  cloneElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import type {
  CSSProperties,
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  ReactElement,
} from 'react';
import { interfaceColors, radius, fontSize, fontFamily } from '@wonik/tokens';
import type { TooltipPlacement, TooltipProps } from './types';
import { ensureCssInjected } from '../utils/ensureCssInjected';

// ADR-011: module-scope CSS 1회-inject — wrapper position context + bubble layout helpers.
const TOOLTIP_CSS = `
.wonik-tooltip-wrapper {
  position: relative;
  display: inline-block;
}
`;

const placementOffset = '6px';
const placementStyle: Record<TooltipPlacement, CSSProperties> = {
  top: {
    bottom: `calc(100% + ${placementOffset})`,
    left: '50%',
    transform: 'translateX(-50%)',
  },
  bottom: {
    top: `calc(100% + ${placementOffset})`,
    left: '50%',
    transform: 'translateX(-50%)',
  },
  left: {
    right: `calc(100% + ${placementOffset})`,
    top: '50%',
    transform: 'translateY(-50%)',
  },
  right: {
    left: `calc(100% + ${placementOffset})`,
    top: '50%',
    transform: 'translateY(-50%)',
  },
};

type AnyHandler<E> = ((event: E) => void) | undefined;

function chain<E>(...fns: Array<AnyHandler<E>>): (event: E) => void {
  return (event: E) => {
    for (const fn of fns) {
      if (typeof fn === 'function') fn(event);
    }
  };
}

interface TriggerHandlerProps {
  onMouseEnter?: (event: MouseEvent<HTMLElement>) => void;
  onMouseLeave?: (event: MouseEvent<HTMLElement>) => void;
  onFocus?: (event: FocusEvent<HTMLElement>) => void;
  onBlur?: (event: FocusEvent<HTMLElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
  'aria-describedby'?: string;
}

export function Tooltip({
  children,
  content,
  placement = 'top',
  openDelay = 200,
  closeDelay = 0,
  id,
  disabled = false,
}: TooltipProps) {
  ensureCssInjected('tooltip', TOOLTIP_CSS);
  const reactId = useId();
  const tooltipId = id ?? `wonik-tooltip-${reactId}`;
  const [open, setOpen] = useState(false);
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearOpenTimer = () => {
    if (openTimerRef.current !== null) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
  };
  const clearCloseTimer = () => {
    if (closeTimerRef.current !== null) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearOpenTimer();
      clearCloseTimer();
    };
  }, []);

  const show = useCallback(() => {
    if (disabled) return;
    clearCloseTimer();
    if (openDelay > 0) {
      clearOpenTimer();
      openTimerRef.current = setTimeout(() => {
        openTimerRef.current = null;
        setOpen(true);
      }, openDelay);
    } else {
      setOpen(true);
    }
  }, [disabled, openDelay]);

  const hide = useCallback(() => {
    clearOpenTimer();
    if (closeDelay > 0) {
      clearCloseTimer();
      closeTimerRef.current = setTimeout(() => {
        closeTimerRef.current = null;
        setOpen(false);
      }, closeDelay);
    } else {
      setOpen(false);
    }
  }, [closeDelay]);

  const handleKey = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === 'Escape' && open) {
        clearOpenTimer();
        clearCloseTimer();
        setOpen(false);
      }
    },
    [open],
  );

  const childProps = children.props as TriggerHandlerProps;
  const ariaDescribedBy = open ? tooltipId : childProps['aria-describedby'];
  const triggerProps: TriggerHandlerProps = {
    onMouseEnter: chain<MouseEvent<HTMLElement>>(childProps.onMouseEnter, show),
    onMouseLeave: chain<MouseEvent<HTMLElement>>(childProps.onMouseLeave, hide),
    onFocus: chain<FocusEvent<HTMLElement>>(childProps.onFocus, show),
    onBlur: chain<FocusEvent<HTMLElement>>(childProps.onBlur, hide),
    onKeyDown: chain<KeyboardEvent<HTMLElement>>(childProps.onKeyDown, handleKey),
    'aria-describedby': ariaDescribedBy ?? undefined,
  };

  const trigger = cloneElement(children as ReactElement<TriggerHandlerProps>, triggerProps);

  const bubbleStyle: CSSProperties = {
    position: 'absolute',
    background: interfaceColors.text,
    color: interfaceColors.surface,
    padding: '6px 10px',
    borderRadius: radius.sm,
    fontSize: fontSize.label,
    fontFamily: fontFamily.base,
    fontWeight: 400,
    lineHeight: 1.3,
    maxWidth: '280px',
    whiteSpace: 'normal',
    pointerEvents: 'none',
    zIndex: 1000,
    boxSizing: 'border-box',
    ...placementStyle[placement],
  };

  const showBubble = open && !disabled;

  return (
    <span className="wonik-tooltip-wrapper">
      {trigger}
      {showBubble ? (
        <span
          role="tooltip"
          id={tooltipId}
          className="wonik-tooltip-bubble"
          style={bubbleStyle}
        >
          {content}
        </span>
      ) : null}
    </span>
  );
}
