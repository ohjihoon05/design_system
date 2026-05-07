import type { CSSProperties, ElementType } from 'react';
import { space, radius, surfaces, borders } from '@wonik/tokens';
import type { BoxProps } from './types';

export function Box({
  as,
  p,
  px,
  py,
  pt,
  pr,
  pb,
  pl,
  m,
  mx,
  my,
  mt,
  mr,
  mb,
  ml,
  bg,
  border,
  rounded,
  style,
  children,
  ...rest
}: BoxProps) {
  const Component = (as ?? 'div') as ElementType;

  const composed: CSSProperties = {
    // padding shorthand 먼저, 개별 side가 override
    ...(p !== undefined && { padding: space[p] }),
    ...(px !== undefined && { paddingLeft: space[px], paddingRight: space[px] }),
    ...(py !== undefined && { paddingTop: space[py], paddingBottom: space[py] }),
    ...(pt !== undefined && { paddingTop: space[pt] }),
    ...(pr !== undefined && { paddingRight: space[pr] }),
    ...(pb !== undefined && { paddingBottom: space[pb] }),
    ...(pl !== undefined && { paddingLeft: space[pl] }),

    // margin shorthand 먼저, 개별 side가 override
    ...(m !== undefined && { margin: space[m] }),
    ...(mx !== undefined && { marginLeft: space[mx], marginRight: space[mx] }),
    ...(my !== undefined && { marginTop: space[my], marginBottom: space[my] }),
    ...(mt !== undefined && { marginTop: space[mt] }),
    ...(mr !== undefined && { marginRight: space[mr] }),
    ...(mb !== undefined && { marginBottom: space[mb] }),
    ...(ml !== undefined && { marginLeft: space[ml] }),

    ...(bg !== undefined && { background: surfaces[bg] }),
    ...(border !== undefined && { border: `1px solid ${borders[border]}` }),
    ...(rounded !== undefined && { borderRadius: radius[rounded] }),

    ...style,
  };

  return (
    <Component style={composed} {...rest}>
      {children}
    </Component>
  );
}
