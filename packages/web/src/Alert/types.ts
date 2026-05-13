import type { ElementType, HTMLAttributes, ReactNode } from 'react';

export interface AlertOwnProps {
  /** dismiss callback — 제공 시 우측에 ×버튼이 자동 렌더되고 클릭 시 호출된다. */
  onDismiss?: () => void;

  /** HTML 요소 — default 'div'. role="alert"는 컴포넌트가 강제. */
  as?: ElementType;

  children?: ReactNode;
}

/**
 * native <div>의 모든 attr 통과 (role 제외 — 컴포넌트가 강제).
 * Card/Badge 패턴 답습 — forwardRef 미사용.
 */
export interface AlertProps
  extends AlertOwnProps,
    Omit<HTMLAttributes<HTMLDivElement>, keyof AlertOwnProps | 'role'> {}
