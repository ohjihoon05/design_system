# Step 2: text-primitive

## 읽어야 할 파일

먼저 아래 파일을 읽고 typography 토큰 구조와 polymorphic 패턴을 파악하라:

- `/CLAUDE.md` (CRITICAL — 토큰 하드코딩 금지 + stateless + React 18·19 dual peer)
- `/docs/UI_GUIDE.md` (AI 슬롭 anti-pattern — gradient text 금지가 특히 중요)
- 이전 step 산출물:
  - `/packages/tokens/src/typography.ts` (`fontSize`/`fontWeight`/`fontFamily`/`lineHeight`)
  - `/packages/tokens/src/colors.ts` (`text` 토큰 — primary/secondary/dim/dark/onDark*)
  - `/packages/web/src/Box/Box.tsx` (polymorphic `as` 패턴)
  - `/packages/web/src/index.ts` (Box·Stack 공개 표면 — 여기에 Text 추가)

## 작업

`@wonik/web`에 **네 번째 컴포넌트인 `Text`** 를 추가한다. `Text`는 typography 토큰을 컴포넌트 레벨로 brige — `<Text variant="titleSm" weight="medium" color="primary">제목</Text>` 형태로 raw `style={{fontSize:14}}` 사용을 근절한다. semantic HTML (h1-h6, p, span) 유지를 위해 polymorphic.

이 step의 목적은 **"typography 토큰이 컴포넌트 prop으로 안전하게 노출된다"**를 증명. 이후 모든 텍스트는 이 컴포넌트를 통하도록.

### 핵심 설계 결정 (왜 이렇게 만드는가)

1. **`variant`는 fontSize 토큰 키와 1:1**: `'micro' | 'labelSm' | 'label' | 'titleSm'`. 토큰에 없는 사이즈는 prop으로 입력 불가 (TypeScript가 막음). 1단계는 토큰 4개라 단순하지만, 후속 step에서 fontSize 토큰을 늘리면 자동으로 variant가 늘어나는 구조.
2. **`weight`는 fontWeight 토큰 키와 1:1**: `'regular' | 'medium'`.
3. **`color`는 text 토큰 + primary 강조 토큰만 허용**: `'primary' | 'secondary' | 'dim' | 'dark' | 'onDark' | 'onDarkVal' | 'onDarkDim' | 'brand'`. raw hex 거부. `'brand'`는 special — `colors.primary.base` (WONIK BLUE)로 매핑한다 (브랜드 강조 텍스트).
4. **Polymorphic `as`** (기본 `'p'`): SEO·semantic HTML — `<Text variant="titleSm" as="h2">` 식으로 시각 크기와 의미적 헤더 레벨이 분리된다.
5. **`align`** 옵션 (`'left' | 'center' | 'right'`): 자주 쓰이는 정렬만 노출. justify는 1단계 범위 외.
6. **gradient text 절대 금지**: AI 슬롭의 가장 흔한 형태. `background-clip: text` + transparent color 조합 같은 트릭 사용 안 함.
7. **`<Text>` 자체에 padding·margin은 없음**: 타이포는 spacing을 제공하지 않는다 — 외부에서 Stack/Box로 감싸 spacing 부여. 단일 책임 원칙.

### 1. 디렉토리 구조

```
packages/web/src/
├── Button/
├── Box/
├── Stack/
└── Text/
    ├── Text.tsx
    ├── Text.test.tsx
    ├── types.ts
    └── index.ts
└── index.ts                      # Text·TextProps 추가
```

### 2. `types.ts` 시그니처

```typescript
import type { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react';
import type { fontSize, fontWeight } from '@wonik/tokens';

/** typography size 토큰 키와 1:1. 토큰 추가 시 자동으로 variant 확장. */
export type TextVariant = keyof typeof fontSize;        // 'micro' | 'labelSm' | 'label' | 'titleSm'
export type TextWeight  = keyof typeof fontWeight;      // 'regular' | 'medium'

export type TextColor =
  | 'primary'
  | 'secondary'
  | 'dim'
  | 'dark'
  | 'onDark'
  | 'onDarkVal'
  | 'onDarkDim'
  | 'brand';                                            // colors.primary.base (WONIK BLUE)

export type TextAlign = 'left' | 'center' | 'right';

/** semantic HTML 표현 — polymorphic as. */
export type TextAs = 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'label' | 'strong' | 'em';

export interface TextOwnProps {
  /** typography size 토큰. 기본 'label'. */
  variant?: TextVariant;

  /** font weight 토큰. 기본 'regular'. */
  weight?: TextWeight;

  /** text color — text 토큰 키 + 'brand' (WONIK BLUE). 기본 'primary'. */
  color?: TextColor;

  /** text-align. 기본 'left'. */
  align?: TextAlign;

  /** semantic HTML element. 기본 'p'. */
  as?: TextAs;

  /** truncate single line with ellipsis. 기본 false. */
  truncate?: boolean;

  children?: ReactNode;
}

/**
 * Text는 단순 polymorphic — Box처럼 generic 안 쓰고 ComponentPropsWithoutRef<'p'>로 typing.
 */
export interface TextProps
  extends TextOwnProps,
          Omit<ComponentPropsWithoutRef<'p'>, keyof TextOwnProps> {}
```

### 3. `Text.test.tsx` (TDD — 먼저 작성)

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Text } from './Text';

describe('Text', () => {
  it('renders a p by default', () => {
    render(<Text data-testid="t">hi</Text>);
    expect(screen.getByTestId('t').tagName).toBe('P');
  });

  it('renders polymorphically via as prop', () => {
    render(<Text as="h2" data-testid="t">heading</Text>);
    expect(screen.getByTestId('t').tagName).toBe('H2');
  });

  it('renders children text', () => {
    render(<Text>hello world</Text>);
    expect(screen.getByText('hello world')).toBeInTheDocument();
  });

  it('applies fontSize via variant token (titleSm -> 14px)', () => {
    render(<Text variant="titleSm" data-testid="t">x</Text>);
    expect(screen.getByTestId('t')).toHaveStyle({ fontSize: '14px' });
  });

  it('defaults to variant="label" (12px)', () => {
    render(<Text data-testid="t">x</Text>);
    expect(screen.getByTestId('t')).toHaveStyle({ fontSize: '12px' });
  });

  it('applies fontWeight via weight token (medium -> 500)', () => {
    render(<Text weight="medium" data-testid="t">x</Text>);
    expect(screen.getByTestId('t')).toHaveStyle({ fontWeight: '500' });
  });

  it('applies color via text token (color="dark" -> #303030)', () => {
    render(<Text color="dark" data-testid="t">x</Text>);
    expect(screen.getByTestId('t')).toHaveStyle({ color: '#303030' });
  });

  it('color="brand" applies WONIK BLUE (#273E82)', () => {
    render(<Text color="brand" data-testid="t">x</Text>);
    expect(screen.getByTestId('t')).toHaveStyle({ color: '#273E82' });
  });

  it('applies text-align', () => {
    render(<Text align="center" data-testid="t">x</Text>);
    expect(screen.getByTestId('t')).toHaveStyle({ textAlign: 'center' });
  });

  it('truncate=true sets ellipsis styles', () => {
    render(<Text truncate data-testid="t">a very long sentence that overflows</Text>);
    const el = screen.getByTestId('t');
    expect(el).toHaveStyle({ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' });
  });

  it('passes through native attributes', () => {
    render(<Text id="title" aria-label="page title" data-testid="t">x</Text>);
    const el = screen.getByTestId('t');
    expect(el).toHaveAttribute('id', 'title');
    expect(el).toHaveAttribute('aria-label', 'page title');
  });

  it('allows consumer style override via style prop', () => {
    render(<Text variant="titleSm" style={{ fontSize: '99px' }} data-testid="t">x</Text>);
    expect(screen.getByTestId('t')).toHaveStyle({ fontSize: '99px' });
  });

  it('does NOT use gradient text (AI slop anti-pattern)', () => {
    render(<Text data-testid="t">x</Text>);
    const styles = window.getComputedStyle(screen.getByTestId('t'));
    // background-clip: text + transparent color 트릭이 없어야 함
    expect(styles.backgroundImage || '').not.toMatch(/gradient/);
    expect(styles.webkitBackgroundClip || styles.backgroundClip || '').not.toMatch(/text/);
  });

  it('uses tokens.fontFamily for default font', () => {
    render(<Text data-testid="t">x</Text>);
    const ff = window.getComputedStyle(screen.getByTestId('t')).fontFamily || '';
    // fontFamily.base === "'Segoe UI', 'Inter', system-ui, sans-serif"
    expect(ff.toLowerCase()).toContain('segoe ui');
  });
});
```

### 4. `Text.tsx` 구현 (테스트 통과시키는 minimal 구현)

```tsx
import type { CSSProperties, ElementType } from 'react';
import { fontSize, fontWeight, fontFamily, lineHeight, text as textColors, primary } from '@wonik/tokens';
import type { TextProps, TextColor, TextAlign } from './types';

const COLOR_MAP: Record<TextColor, string> = {
  primary:    textColors.primary,
  secondary:  textColors.secondary,
  dim:        textColors.dim,
  dark:       textColors.dark,
  onDark:     textColors.onDark,
  onDarkVal:  textColors.onDarkVal,
  onDarkDim:  textColors.onDarkDim,
  brand:      primary.base,  // WONIK BLUE
};

export function Text({
  variant = 'label',
  weight = 'regular',
  color = 'primary',
  align,
  as,
  truncate = false,
  style,
  children,
  ...rest
}: TextProps) {
  const Component = (as ?? 'p') as ElementType;

  const composed: CSSProperties = {
    fontFamily: fontFamily.base,
    fontSize:   fontSize[variant],
    fontWeight: fontWeight[weight],
    lineHeight: lineHeight.tight,
    color:      COLOR_MAP[color],
    margin:     0,                                      // browser default 제거 (p의 margin)
    ...(align !== undefined && { textAlign: align }),
    ...(truncate && {
      whiteSpace:   'nowrap',
      overflow:     'hidden',
      textOverflow: 'ellipsis',
    }),
    ...style,                                            // consumer override (마지막)
  };

  return (
    <Component style={composed} {...rest}>
      {children}
    </Component>
  );
}
```

**작성 원칙:**
- 모든 typography·color는 토큰 import. **hex/px 리터럴 금지.**
- COLOR_MAP은 컴포넌트 파일 내부 const. 외부 helper 모듈 분리 금지 (CLAUDE.md).
- `margin: 0`은 browser default p 마진 제거 — Text가 spacing을 제공하지 않는다는 단일 책임 강제.
- AI 슬롭 anti-pattern (gradient text) 절대 금지.

### 5. `index.ts` (Text 폴더)

```typescript
export { Text } from './Text';
export type { TextProps, TextOwnProps, TextVariant, TextWeight, TextColor, TextAlign, TextAs } from './types';
```

### 6. `packages/web/src/index.ts` 업데이트

```typescript
export { Button } from './Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button/types';

export { Box } from './Box';
export type { BoxProps, BoxOwnProps, SpaceToken, RadiusToken, SurfaceToken, BorderToken } from './Box/types';

export { Stack } from './Stack';
export type { StackProps, StackOwnProps, StackDirection, StackAlign, StackJustify } from './Stack/types';

export { Text } from './Text';
export type { TextProps, TextOwnProps, TextVariant, TextWeight, TextColor, TextAlign, TextAs } from './Text/types';
```

## Acceptance Criteria

```bash
cd C:/Users/ohjih/design_system

pnpm -F @wonik/web test          # Button + Box + Stack + Text 모두 통과
pnpm -F @wonik/web build         # 빌드 성공

# 빌드 산출물 검증
test -f packages/web/dist/index.js
test -f packages/web/dist/index.mjs
test -f packages/web/dist/index.d.ts

# 하드코딩 hex 금지
! grep -E "['\"]#[0-9A-Fa-f]{6}['\"]" packages/web/src/Text/Text.tsx

# 하드코딩 px 금지
! grep -E "['\"][0-9]+px['\"]" packages/web/src/Text/Text.tsx

# AI 슬롭 — gradient text 금지 (-webkit-background-clip / background-clip:text)
! grep -i -E "background-clip:\s*text|webkit-background-clip|backdrop-filter|linear-gradient" packages/web/src/Text/Text.tsx

# 공개 표면에 Text 노출
grep -q "export { Text }" packages/web/src/index.ts

# 회귀 없음 — Button + Box + Stack 테스트 통과
pnpm -F @wonik/web test --run 2>&1 | grep -qE "Button|Box|Stack"
```

위 명령이 모두 통과해야 한다.

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 체크리스트:
   - TDD: `Text.test.tsx`가 `Text.tsx` 전에 작성됐나?
   - 토큰 하드코딩 금지: `Text.tsx` 안에 hex/px 리터럴 0건?
   - polymorphic: `as`로 h1~h6, p, span, label 등 자유롭게?
   - `color="brand"`가 `colors.primary.base` (WONIK BLUE)로 정확히 매핑?
   - gradient text 사용 0?
   - 회귀 없음: 기존 Button + Box + Stack 테스트 모두 통과?
3. 결과에 따라 `phases/02-layout-primitives/index.json`의 step 2를 업데이트:
   - 성공 → `"status": "completed"`, `"summary": "@wonik/web Text primitive 추가. typography 토큰을 prop(variant/weight/color)으로 노출. polymorphic as. gradient text 금지. 다음 step에서 sandbox before/after 데모로 layout primitive 가치를 시각화."`
   - 실패 → `"status": "error"`, `"error_message": "구체 사유"`

## 금지사항

- **hex/px 리터럴 사용 금지** (모두 `@wonik/tokens` import).
- **gradient text 절대 금지** (`background-clip: text` + transparent color 트릭). AI 슬롭 핵심 anti-pattern.
- **Text에 padding·margin prop 금지** — 단일 책임 원칙. spacing은 외부 Stack/Box에서.
- **CSS-in-JS 라이브러리 도입 금지.**
- **Snapshot test 금지.**
- **AI 슬롭 anti-pattern 금지** (backdrop-filter/gradient/glow shadow/rounded-2xl).
- **React 19-only API 금지.**
- **Box·Stack·Button 코드 수정 금지** — Text 구현은 Text 폴더 안에서만.
- **다른 패키지 폴더 만들지 마라** (ADR-001).
- **기존 테스트를 깨뜨리지 마라.**
