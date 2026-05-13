import type { CSSProperties, ElementType } from 'react';
import { space, radius, interfaceColors } from '@wonik/tokens';
import type { CardProps, CardPadding } from './types';

// ADR-015: dark theme에서 elevated 그림자 0 (ADR-009 정신: dark는 surface bg로 elevation 표현).
// inline style로는 attribute 셀렉터를 풀어낼 수 없어 module-scope CSS 1회 inject (Button/Spinner/Skeleton 패턴 동일).
const CARD_CSS = `
[data-theme="dark"] .wonik-card-elevated {
  box-shadow: none;
}
`;

let cssInjected = false;
function ensureCssInjected() {
  if (cssInjected || typeof document === 'undefined') return;
  const style = document.createElement('style');
  style.setAttribute('data-wonik-card', 'true');
  style.textContent = CARD_CSS;
  document.head.appendChild(style);
  cssInjected = true;
}

const PADDING_MAP: Record<CardPadding, string> = {
  none: '0',
  sm: space[4],
  md: space[6],
  lg: space[8],
};

// elevation, 토큰화는 사용처 2+ 부상 시 (plan.md §2.6 / ADR-015 §대안 3).
const ELEVATED_SHADOW = '0 1px 3px rgba(0,0,0,0.08)';

export function Card({
  variant = 'surface',
  padding = 'md',
  as,
  className,
  style,
  children,
  ...rest
}: CardProps) {
  ensureCssInjected();
  const Component = (as ?? 'div') as ElementType;

  const isElevated = variant === 'elevated';

  const composed: CSSProperties = {
    background: interfaceColors.surface,
    border: isElevated ? 'none' : `1px solid ${interfaceColors.border}`,
    borderRadius: radius.md,
    padding: PADDING_MAP[padding],
    boxShadow: isElevated ? ELEVATED_SHADOW : 'none',
    ...style,
  };

  const baseClass = isElevated ? 'wonik-card wonik-card-elevated' : 'wonik-card';
  const composedClassName = className ? `${baseClass} ${className}` : baseClass;

  return (
    <Component className={composedClassName} style={composed} {...rest}>
      {children}
    </Component>
  );
}
