import type { InputHTMLAttributes, Ref } from 'react';

export type CheckboxSize = 'sm' | 'md' | 'lg';

export interface CheckboxOwnProps {
  /** size 토큰. 기본 'md'. */
  size?: CheckboxSize;

  /** invalid 상태 — true면 border가 alarm 색 + aria-invalid="true". */
  invalid?: boolean;

  /** native input ref. */
  ref?: Ref<HTMLInputElement>;
}

/**
 * native <input type="checkbox">의 모든 attr 통과 (checked, defaultChecked,
 * onChange, name, value 등). type은 'checkbox' 고정 — consumer가 바꾸지 못한다.
 * size는 우리 prop이 우선.
 */
export interface CheckboxProps
  extends CheckboxOwnProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {}
