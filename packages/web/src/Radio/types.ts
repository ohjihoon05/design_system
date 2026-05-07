import type { InputHTMLAttributes, Ref } from 'react';

export type RadioSize = 'sm' | 'md' | 'lg';

export interface RadioOwnProps {
  /** size 토큰. 기본 'md'. */
  size?: RadioSize;

  /** invalid 상태 — true면 outline이 alarm 색 + aria-invalid="true". */
  invalid?: boolean;

  /** native input ref. */
  ref?: Ref<HTMLInputElement>;
}

/**
 * Native <input type="radio">의 모든 attr 통과 (name·value·checked·defaultChecked·
 * onChange·required 등). 그룹화는 같은 name 속성을 공유하면 브라우저가 자동 처리.
 * type은 'radio' 고정 — consumer가 바꾸지 못한다. size는 우리 prop이 우선.
 */
export interface RadioProps
  extends RadioOwnProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {}
