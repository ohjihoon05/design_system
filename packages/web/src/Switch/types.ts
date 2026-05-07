import type { InputHTMLAttributes, Ref } from 'react';

export type SwitchSize = 'sm' | 'md' | 'lg';

export interface SwitchOwnProps {
  /** size 토큰. 기본 'md'. track 26x14 / 32x18 / 38x22 */
  size?: SwitchSize;

  /** invalid 상태 — true면 track border가 alarm 색 + aria-invalid="true". */
  invalid?: boolean;

  /** native input ref. */
  ref?: Ref<HTMLInputElement>;
}

/**
 * native <input type="checkbox" role="switch">의 모든 attr 통과
 * (checked, defaultChecked, onChange, name, value 등).
 * type은 'checkbox' 고정 — consumer가 바꾸지 못한다.
 * size는 우리 prop이 우선.
 */
export interface SwitchProps
  extends SwitchOwnProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {}
