import type { CSSProperties } from 'react';
import { space } from '@wonik/tokens';
import { Box } from '../Box/Box';
import type { StackProps, StackAlign, StackJustify } from './types';

const ALIGN_MAP: Record<StackAlign, CSSProperties['alignItems']> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
};

const JUSTIFY_MAP: Record<StackJustify, CSSProperties['justifyContent']> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
};

export function Stack({
  direction = 'column',
  gap,
  align,
  justify,
  wrap = false,
  style,
  children,
  ...boxRest
}: StackProps) {
  const flexStyle: CSSProperties = {
    display: 'flex',
    flexDirection: direction,
    ...(gap !== undefined && { gap: space[gap] }),
    ...(align !== undefined && { alignItems: ALIGN_MAP[align] }),
    ...(justify !== undefined && { justifyContent: JUSTIFY_MAP[justify] }),
    ...(wrap && { flexWrap: 'wrap' }),
    ...style,
  };

  return (
    <Box style={flexStyle} {...boxRest}>
      {children}
    </Box>
  );
}
