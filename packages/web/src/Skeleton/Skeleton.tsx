import { forwardRef } from 'react';
import type { CSSProperties } from 'react';
import { surfaces } from '@wonik/tokens';
import type { SkeletonProps, SkeletonVariant } from './types';
import { ensureCssInjected } from '../utils/ensureCssInjected';

interface VariantSpec {
  width?: string;
  height?: string;
  radius: string;
}

const VARIANT_SPEC: Record<SkeletonVariant, VariantSpec> = {
  text: { width: '100%', height: '1em', radius: '4px' },
  rect: { radius: '8px' },
  circle: { radius: '50%' },
};

// @keyframes는 inline style로 정의 못 하므로 module-scoped CSS 1회 inject (Spinner 패턴 동일).
const SKELETON_CSS = `
@keyframes wonik-skeleton-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
`;

function toLength(value: string | number | undefined): string | undefined {
  if (value === undefined) return undefined;
  return typeof value === 'number' ? `${value}px` : value;
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { variant = 'text', width, height, style, ...rest },
  ref,
) {
  ensureCssInjected('skeleton', SKELETON_CSS);
  const spec = VARIANT_SPEC[variant];

  const composed: CSSProperties = {
    display: 'block',
    width: toLength(width) ?? spec.width,
    height: toLength(height) ?? spec.height,
    borderRadius: spec.radius,
    backgroundColor: surfaces.surfaceMid,
    animation: 'wonik-skeleton-pulse 1.5s ease-in-out infinite',
    ...style,
  };

  return (
    <div
      {...rest}
      ref={ref}
      role="status"
      aria-busy="true"
      style={composed}
    />
  );
});
