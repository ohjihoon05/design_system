import type { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react';
import { space, radius, surfaces, borders } from '@wonik/tokens';

/** spacing scale — packages/tokens/src/spacing.ts의 space 객체 키와 1:1. */
export type SpaceToken = keyof typeof space;

/** border-radius 토큰 키. */
export type RadiusToken = keyof typeof radius;

/** 배경색 — surfaces 토큰 키만 허용 (raw hex 금지). */
export type SurfaceToken = keyof typeof surfaces;

/** border 색 — borders 토큰 키만 허용. */
export type BorderToken = keyof typeof borders;

export interface BoxOwnProps {
  /** HTML 요소 — SEO·semantic HTML을 유지하면서 spacing 일관성을 챙기기 위해 polymorphic. 기본 'div'. */
  as?: ElementType;
  children?: ReactNode;

  // padding — token index로만 받는다.
  p?: SpaceToken;
  px?: SpaceToken;
  py?: SpaceToken;
  pt?: SpaceToken;
  pr?: SpaceToken;
  pb?: SpaceToken;
  pl?: SpaceToken;

  // margin — 동일.
  m?: SpaceToken;
  mx?: SpaceToken;
  my?: SpaceToken;
  mt?: SpaceToken;
  mr?: SpaceToken;
  mb?: SpaceToken;
  ml?: SpaceToken;

  /** 배경색 토큰 (surfaces). raw hex 금지. */
  bg?: SurfaceToken;

  /** border 색 토큰 (borders). 1px solid border가 적용된다. */
  border?: BorderToken;

  /** border-radius 토큰. */
  rounded?: RadiusToken;
}

/**
 * Box는 polymorphic — 외부에서 추가 prop을 자유롭게 통과시킬 수 있다.
 * 단, 1단계에서는 type-safe per-element generic은 도입하지 않고
 * ComponentPropsWithoutRef<'div'>로 typing해 단순화한다.
 */
export interface BoxProps
  extends BoxOwnProps,
    Omit<ComponentPropsWithoutRef<'div'>, keyof BoxOwnProps> {}
