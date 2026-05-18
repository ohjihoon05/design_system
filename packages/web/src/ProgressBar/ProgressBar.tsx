import type { CSSProperties } from 'react';
import { interfaceColors, surfaces, statusTokens } from '@wonik/tokens';
import type { ProgressBarProps, ProgressTone } from './types';

const TONE_FILL: Record<ProgressTone, string> = {
  primary: interfaceColors.primary,
  alarm: statusTokens.alarm.text,
  ready: statusTokens.ready.dot,
};

export function ProgressBar({
  value,
  height = 4,
  tone = 'primary',
  className,
  style,
  ...rest
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const trackStyle: CSSProperties = {
    width: '100%',
    height,
    background: surfaces.surfaceSubtle,
    borderRadius: height,
    overflow: 'hidden',
    ...style,
  };
  const fillStyle: CSSProperties = {
    width: `${clamped}%`,
    height: '100%',
    background: TONE_FILL[tone],
    transition: 'width 600ms ease-out',
  };
  const mergedClassName = className ? `wonik-progressbar ${className}` : 'wonik-progressbar';

  return (
    <div
      {...rest}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={mergedClassName}
      style={trackStyle}
    >
      <div style={fillStyle} />
    </div>
  );
}
