import type { InputHTMLAttributes, ReactNode, Ref } from 'react';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputOwnProps {
  /** size 토큰 — Button과 동일 system. 기본 'md'. */
  size?: InputSize;

  /** invalid 상태 — true면 border가 alarm 색으로, aria-invalid="true" 자동 설정. */
  invalid?: boolean;

  /** 입력 박스 좌측 부착 콘텐츠 (icon, prefix 등). ReactNode. */
  leftAddon?: ReactNode;

  /** 입력 박스 우측 부착 콘텐츠 (clear button, unit, password reveal 등). ReactNode. */
  rightAddon?: ReactNode;

  /** native input ref 노출 — focus()/select()/validity 등 form 라이브러리용. */
  ref?: Ref<HTMLInputElement>;
}

export interface InputProps
  extends InputOwnProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {}
