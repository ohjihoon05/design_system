import type { CSSProperties } from 'react';
import { interfaceColors, surfaces, fontWeight } from '@wonik/tokens';
import type { AvatarProps } from './types';

export function Avatar({
  name,
  size = 32,
  color,
  className,
  style,
  ...rest
}: AvatarProps) {
  const initial = Array.from(name.trim())[0] ?? '?';
  const composed: CSSProperties = {
    width: size,
    height: size,
    borderRadius: '50%',
    background: color ?? interfaceColors.primary,
    color: surfaces.surfaceWhite,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: Math.round(size * 0.4),
    fontWeight: fontWeight.medium,
    lineHeight: 1,
    flexShrink: 0,
    userSelect: 'none',
    ...style,
  };
  const mergedClassName = className ? `wonik-avatar ${className}` : 'wonik-avatar';

  return (
    <span
      aria-hidden={rest['aria-label'] ? undefined : true}
      {...rest}
      className={mergedClassName}
      style={composed}
    >
      {initial}
    </span>
  );
}
