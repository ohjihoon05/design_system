import type { TextareaHTMLAttributes, Ref } from 'react';
import type { InputSize } from '../Input/types';

/** Textarea size — Input과 동일 토큰 (sm/md/lg). 시각 리듬 일치. */
export type TextareaSize = InputSize;

export interface TextareaOwnProps {
  /** size 토큰. 기본 'md'. */
  size?: TextareaSize;

  /** invalid 상태. true면 alarm 색 border + aria-invalid="true". */
  invalid?: boolean;

  /** native textarea ref. */
  ref?: Ref<HTMLTextAreaElement>;
}

export interface TextareaProps
  extends TextareaOwnProps,
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {}
