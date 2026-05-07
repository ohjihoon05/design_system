# Step 0: box-primitive

## 읽어야 할 파일

먼저 아래 파일을 읽고 1단계 우선순위·토큰 구조·기존 컴포넌트 패턴을 파악하라:

- `/CLAUDE.md` (CRITICAL — web 우선 + 토큰 하드코딩 금지 + stateless + React 18·19 dual peer)
- `/docs/UI_GUIDE.md` (AI 슬롭 anti-pattern 목록)
- `/docs/ARCHITECTURE.md` (`packages/web/src/{ComponentName}/` 구조 약속)
- 이전 phase 산출물 — 토큰·기존 컴포넌트 패턴 그대로 따른다:
  - `/packages/tokens/src/spacing.ts` (`space[1..8]`, `radius`)
  - `/packages/tokens/src/colors.ts` (`surfaces`, `borders`, `primary`)
  - `/packages/tokens/dist/index.{js,mjs,d.ts}` (TS import 표면)
  - `/packages/web/src/Button/Button.tsx` (inline style + 토큰 import 패턴)
  - `/packages/web/src/Button/types.ts` (prop 타입 정의 스타일)
  - `/packages/web/src/Button/Button.test.tsx` (TDD 테스트 스타일 — render·getByRole·toHaveStyle)
  - `/packages/web/src/index.ts` (public API re-export 형태)
  - `/packages/web/package.json` (peer/dev deps 그대로 활용)

## 작업

`@wonik/web`에 **두 번째 컴포넌트인 `Box`** 를 추가한다. `Box`는 design system의 **layout primitive** — 모든 후속 컴포넌트(Stack, Card, Modal 등)가 그 위에 올라간다. 자체로는 시각적 데코레이션이 없는 "투명한 wrapper"이고, **토큰-인덱스로 padding·margin·background·border-radius를 받아** raw `<div style={{padding:16}}>` 사용을 근절하는 것이 목적.

이 step의 목적은 "polymorphic primitive 1개가 토큰 시스템 위에서 동작한다"를 가장 작은 단위로 증명하는 것. Stack·Text는 후속 step.

### 핵심 설계 결정 (왜 이렇게 만드는가)

1. **Polymorphic (`as` prop)**: `<Box as="section">`, `<Box as="article">` 처럼 SEO·semantic HTML을 유지하면서 spacing 일관성을 챙긴다. 기본은 `<div>`. 단순히 ElementType을 받는 형태로, full TypeScript generic은 1단계 범위 외 (복잡도 비대비 가성비 낮음).
2. **Token-indexed spacing**: `<Box p={4}>` → `padding: var(--space-4)` (= 10px). 16px 같은 raw value는 prop으로 받지 않는다. 디자인 시스템이 "4 = 10px"이라는 약속을 지킨다. CLAUDE.md CRITICAL ("색·spacing·typography 같은 raw 값을 컴포넌트 코드에 하드코딩 금지")의 spacing 면을 1차 보장하는 layer.
3. **No glass/gradient/glow**: AI 슬롭 anti-pattern (UI_GUIDE.md) 절대 도입 금지. background는 token surface만, border는 token border만, shadow는 이번 step 범위 외.
4. **className·style override 허용**: consumer가 외부 override 가능하도록 `...rest`/`...style` spread. Button과 동일 패턴.
5. **Stateless**: 글로벌 state 0. controlled/uncontrolled 패턴 불필요 — Box는 visual primitive.

### 1. 디렉토리 구조

```
packages/web/src/
├── Button/                       # 그대로
└── Box/
    ├── Box.tsx                   # 컴포넌트 구현
    ├── Box.test.tsx              # 테스트 (먼저 작성)
    ├── types.ts                  # BoxProps, SpaceToken 등
    └── index.ts                  # Box·types re-export
└── index.ts                      # 공개 표면에 Box·BoxProps 추가
```

### 2. `types.ts` 시그니처

```typescript
import type { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react';
import type { space, radius, surfaces, borders } from '@wonik/tokens';

/** spacing scale — packages/tokens/src/spacing.ts의 space 객체 키와 1:1. */
export type SpaceToken = keyof typeof space;            // 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

/** border-radius 토큰 키. */
export type RadiusToken = keyof typeof radius;          // 'sm' | 'md' | 'full' | 'panelHeader'

/** 배경색 — surfaces 토큰 키만 허용 (raw hex 금지). */
export type SurfaceToken = keyof typeof surfaces;       // 'canvas' | 'surface' | 'surfaceSubtle' | ...

/** border 색 — borders 토큰 키만 허용. */
export type BorderToken = keyof typeof borders;         // 'light' | 'mid' | 'dark' | 'panelDark'

export interface BoxOwnProps {
  /** HTML 요소 — SEO·semantic HTML을 유지하면서 spacing 일관성을 챙기기 위해 polymorphic. 기본 'div'. */
  as?: ElementType;
  children?: ReactNode;

  // padding — token index로만 받는다.
  p?:  SpaceToken;
  px?: SpaceToken;
  py?: SpaceToken;
  pt?: SpaceToken;
  pr?: SpaceToken;
  pb?: SpaceToken;
  pl?: SpaceToken;

  // margin — 동일.
  m?:  SpaceToken;
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
 * ComponentPropsWithoutRef<'div'>로 typing해 단순화한다 (Chakra v3 / Radix 초기와 동일 전략).
 */
export interface BoxProps
  extends BoxOwnProps,
          Omit<ComponentPropsWithoutRef<'div'>, keyof BoxOwnProps> {}
```

### 3. `Box.test.tsx` (TDD — 먼저 작성)

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Box } from './Box';

describe('Box', () => {
  it('renders a div by default', () => {
    render(<Box data-testid="b">child</Box>);
    expect(screen.getByTestId('b').tagName).toBe('DIV');
  });

  it('renders polymorphically via the as prop', () => {
    render(<Box as="section" data-testid="b">child</Box>);
    expect(screen.getByTestId('b').tagName).toBe('SECTION');
  });

  it('renders children', () => {
    render(<Box>hello</Box>);
    expect(screen.getByText('hello')).toBeInTheDocument();
  });

  it('maps p prop to padding via space token (4 -> 10px)', () => {
    render(<Box p={4} data-testid="b" />);
    expect(screen.getByTestId('b')).toHaveStyle({ padding: '10px' });
  });

  it('maps px/py to logical paddings', () => {
    render(<Box px={3} py={6} data-testid="b" />);
    const el = screen.getByTestId('b');
    expect(el).toHaveStyle({ paddingLeft: '8px', paddingRight: '8px' });
    expect(el).toHaveStyle({ paddingTop: '16px', paddingBottom: '16px' });
  });

  it('maps individual side paddings', () => {
    render(<Box pt={1} pr={2} pb={3} pl={4} data-testid="b" />);
    const el = screen.getByTestId('b');
    expect(el).toHaveStyle({ paddingTop: '4px', paddingRight: '6px', paddingBottom: '8px', paddingLeft: '10px' });
  });

  it('maps margin props', () => {
    render(<Box m={2} mt={6} data-testid="b" />);
    const el = screen.getByTestId('b');
    // mt가 m을 override해야 함 (CSS의 longhand-after-shorthand 의도와 동일)
    expect(el).toHaveStyle({ marginTop: '16px' });
  });

  it('applies bg via surfaces token', () => {
    render(<Box bg="surface" data-testid="b" />);
    // surfaces.surface === '#FEFEFE'
    expect(screen.getByTestId('b')).toHaveStyle({ background: '#FEFEFE' });
  });

  it('applies border with 1px solid via borders token', () => {
    render(<Box border="mid" data-testid="b" />);
    const styles = window.getComputedStyle(screen.getByTestId('b'));
    expect(styles.borderStyle).toBe('solid');
    expect(styles.borderWidth).toBe('1px');
  });

  it('applies rounded via radius token', () => {
    render(<Box rounded="md" data-testid="b" />);
    // radius.md === '10px'
    expect(screen.getByTestId('b')).toHaveStyle({ borderRadius: '10px' });
  });

  it('passes through native HTML attributes', () => {
    render(<Box id="my-box" role="region" aria-label="hero" data-testid="b" />);
    const el = screen.getByTestId('b');
    expect(el).toHaveAttribute('id', 'my-box');
    expect(el).toHaveAttribute('role', 'region');
    expect(el).toHaveAttribute('aria-label', 'hero');
  });

  it('allows consumer style override via style prop', () => {
    render(<Box p={4} style={{ padding: '99px' }} data-testid="b" />);
    // 사용자 지정 style이 token-derived padding을 override해야 함 (style spread 마지막)
    expect(screen.getByTestId('b')).toHaveStyle({ padding: '99px' });
  });

  it('renders without any visual decoration by default (no glow/gradient)', () => {
    render(<Box data-testid="b">x</Box>);
    const styles = window.getComputedStyle(screen.getByTestId('b'));
    // backdrop-filter, background-image gradient, box-shadow 모두 없어야 함
    expect(styles.backdropFilter || '').not.toMatch(/blur/);
    expect(styles.backgroundImage || '').not.toMatch(/gradient/);
    expect(styles.boxShadow || '').not.toMatch(/glow|0 0 \d+px/i);
  });
});
```

### 4. `Box.tsx` 구현 (테스트 통과시키는 minimal 구현)

```tsx
import type { CSSProperties, ElementType } from 'react';
import { space, radius, surfaces, borders } from '@wonik/tokens';
import type { BoxProps } from './types';

export function Box({
  as,
  p, px, py, pt, pr, pb, pl,
  m, mx, my, mt, mr, mb, ml,
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
    ...(p  !== undefined && { padding: space[p] }),
    ...(px !== undefined && { paddingLeft: space[px], paddingRight: space[px] }),
    ...(py !== undefined && { paddingTop: space[py], paddingBottom: space[py] }),
    ...(pt !== undefined && { paddingTop: space[pt] }),
    ...(pr !== undefined && { paddingRight: space[pr] }),
    ...(pb !== undefined && { paddingBottom: space[pb] }),
    ...(pl !== undefined && { paddingLeft: space[pl] }),

    // margin shorthand 먼저, 개별 side가 override
    ...(m  !== undefined && { margin: space[m] }),
    ...(mx !== undefined && { marginLeft: space[mx], marginRight: space[mx] }),
    ...(my !== undefined && { marginTop: space[my], marginBottom: space[my] }),
    ...(mt !== undefined && { marginTop: space[mt] }),
    ...(mr !== undefined && { marginRight: space[mr] }),
    ...(mb !== undefined && { marginBottom: space[mb] }),
    ...(ml !== undefined && { marginLeft: space[ml] }),

    ...(bg      !== undefined && { background: surfaces[bg] }),
    ...(border  !== undefined && { border: `1px solid ${borders[border]}` }),
    ...(rounded !== undefined && { borderRadius: radius[rounded] }),

    ...style, // consumer override (마지막)
  };

  return (
    <Component style={composed} {...rest}>
      {children}
    </Component>
  );
}
```

**작성 원칙:**
- spacing/color/radius 모두 토큰에서 import. **컴포넌트 코드에 hex/px 리터럴 금지** (CLAUDE.md CRITICAL).
- inline style만 사용 (CSS-in-JS 라이브러리 도입 금지).
- React 19-only API 금지 — `useState`/`useEffect` 같은 18·19 공통만 (이 컴포넌트는 hook 자체가 불필요).
- AI 슬롭 0 — `backdrop-filter`/`linear-gradient`/`box-shadow` glow 사용 안 함.

### 5. `index.ts` (Box 폴더)

```typescript
export { Box } from './Box';
export type { BoxProps, BoxOwnProps, SpaceToken, RadiusToken, SurfaceToken, BorderToken } from './types';
```

### 6. `packages/web/src/index.ts` 업데이트

기존 Button export에 Box를 추가:

```typescript
export { Button } from './Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button/types';

export { Box } from './Box';
export type { BoxProps, BoxOwnProps, SpaceToken, RadiusToken, SurfaceToken, BorderToken } from './Box/types';
```

## Acceptance Criteria

```bash
cd C:/Users/ohjih/design_system

# 의존성 OK 상태에서
pnpm -F @wonik/web test          # 모든 테스트 (Button + Box) 통과
pnpm -F @wonik/web build         # 빌드 성공

# 빌드 산출물 검증
test -f packages/web/dist/index.js
test -f packages/web/dist/index.mjs
test -f packages/web/dist/index.d.ts

# 하드코딩 hex 금지 — Box.tsx 안에 #로 시작하는 6자리 hex 리터럴 0건
! grep -E "['\"]#[0-9A-Fa-f]{6}['\"]" packages/web/src/Box/Box.tsx

# 하드코딩 px 금지 — Box.tsx 안에 'NNpx' 리터럴 0건
! grep -E "['\"][0-9]+px['\"]" packages/web/src/Box/Box.tsx

# AI 슬롭 anti-pattern 0건
! grep -i -E "backdrop-filter|linear-gradient|box-shadow.*0 0|rounded-2xl" packages/web/src/Box/Box.tsx

# 공개 표면에 Box·BoxProps 노출
grep -q "export { Box }" packages/web/src/index.ts
grep -q "BoxProps" packages/web/src/index.ts

# Button 회귀 0 — 기존 Button 테스트도 통과
pnpm -F @wonik/web test --run 2>&1 | grep -q "Button"
```

위 명령이 모두 통과해야 한다.

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 체크리스트:
   - TDD: `Box.test.tsx`가 `Box.tsx` 전에 작성됐나? (구현 시 적어도 모든 test가 작성된 후 구현 시작)
   - 토큰 하드코딩 금지: `Box.tsx` 안에 hex/px 리터럴 0건?
   - polymorphic: `as` prop으로 `'div'`/`'section'`/`'article'` 등 자유롭게 바뀌는가?
   - stateless: 글로벌 state 의존 없나? hook 의존 없나? (`useState`·`useEffect` 등록 0)
   - 회귀 없음: 기존 Button 테스트 모두 통과?
3. 결과에 따라 `phases/02-layout-primitives/index.json`의 step 0을 업데이트:
   - 성공 → `"status": "completed"`, `"summary": "@wonik/web Box primitive 추가. polymorphic (as prop), token-indexed padding/margin/bg/border/rounded. AI 슬롭 0. 다음 step에서 Stack이 이 위에 올라감."`
   - 실패 → `"status": "error"`, `"error_message": "구체 사유"`
   - 사용자 개입 → `"status": "blocked"`, `"blocked_reason": "구체 사유"`

## 금지사항

- **hex/px 리터럴 사용 금지** (모두 `@wonik/tokens` import). 이유: CLAUDE.md CRITICAL.
- **CSS-in-JS 라이브러리 도입 금지** (styled-components/emotion/stitches/vanilla-extract). 이유: 추가 의존성·빌드 복잡도. 1단계는 inline style + 토큰만으로 충분.
- **TypeScript full polymorphic generic 도입 금지** (`<T extends ElementType>` 형태). 이유: 1단계 단순화. Chakra v3 / Radix 초기와 동일 전략 — `ElementType` cast로 충분.
- **Snapshot test 금지.**
- **`backdrop-filter`·`linear-gradient`·`box-shadow` glow 사용 금지** (AI 슬롭).
- **React 19-only API 사용 금지** (`useFormStatus`/`useOptimistic`/`use()`·React Compiler 자동 메모 등). peer dual.
- **다른 패키지 폴더 만들지 마라** (`packages/{tokens,web}` 외 금지, ADR-001).
- **WONIK IPS — WARP Design System/ 폴더 import 금지** (시안만, ADR-004).
- **기존 docs/CLAUDE.md/scripts/execute.py/Button 코드 수정 금지** — 단 `packages/web/src/index.ts`에 Box export 추가는 허용.
- **기존 테스트를 깨뜨리지 마라.**
