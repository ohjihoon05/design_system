# Step 1: stack-primitive

## 읽어야 할 파일

먼저 아래 파일을 읽고 Box 위에 Stack을 어떻게 layering하는지 파악하라:

- `/CLAUDE.md` (CRITICAL — 토큰 하드코딩 금지 + stateless + React 18·19 dual peer)
- `/docs/UI_GUIDE.md` (AI 슬롭 anti-pattern)
- 이전 step 산출물:
  - `/packages/web/src/Box/Box.tsx` (Stack은 Box를 wrap한다 — `as` 등 prop을 그대로 통과)
  - `/packages/web/src/Box/types.ts` (`SpaceToken` 재사용)
  - `/packages/web/src/index.ts` (Box export 확인)
  - `/packages/tokens/src/spacing.ts` (`space[1..8]`)

이전 step에서 만든 `Box`의 prop signature를 그대로 이해하고, Stack은 그 위에 flex layout을 올리는 layer임을 의식하며 작업하라.

## 작업

`@wonik/web`에 **세 번째 컴포넌트인 `Stack`** 을 추가한다. `Stack`은 `Box` 위에 **flex layout**을 얹은 컴포넌트 — `direction`(vertical/horizontal), `gap`(token), `align`/`justify`/`wrap`을 받는다. 모든 후속 컴포넌트(Card 내부, Modal footer, Form, Toolbar 등)가 raw `<div style={{display:'flex'}}>` 대신 Stack을 쓰도록 한다.

이 step의 목적은 **"flex container 1개가 token-driven gap으로 동작한다"**를 가장 작은 단위로 증명하는 것.

### 핵심 설계 결정 (왜 이렇게 만드는가)

1. **단일 `Stack` + `direction` prop** (vs `<VStack>`/`<HStack>` 분리): 단일 컴포넌트가 코드 일관성을 높이고 export 표면을 작게 유지한다. Toss SLASH도 단일 Stack을 사용 (Chakra는 분리). 1단계 단순성 우선.
2. **기본 direction = `'column'`** (vertical): 실제 UI의 70%+가 vertical stack이라는 산업 통념 (Toss SLASH 발표 인용). 가장 흔한 케이스를 default로 두면 키 입력이 줄고 의도가 분명해진다.
3. **`gap`은 token index만**: `<Stack gap={4}>` → `gap: var(--space-4)` (= 10px). `gap={16}` 같은 raw value는 거부 (TypeScript가 막음).
4. **`align`/`justify`는 short-name enum**: `'start' | 'center' | 'end' | 'stretch'` (align), `'start' | 'center' | 'end' | 'between' | 'around'` (justify). 내부적으로 `flex-start`/`flex-end`/`space-between`/`space-around`로 매핑.
5. **Box prop 통과**: Stack은 Box 위에 layer라 `p`/`m`/`bg`/`border`/`rounded`/`as`를 그대로 통과해야 한다 — Stack을 padding 있는 컨테이너로 바로 쓸 수 있도록.
6. **Stateless**: hook 0, glob state 0.

### 1. 디렉토리 구조

```
packages/web/src/
├── Button/
├── Box/
└── Stack/
    ├── Stack.tsx
    ├── Stack.test.tsx
    ├── types.ts
    └── index.ts
└── index.ts                      # Stack·StackProps 추가
```

### 2. `types.ts` 시그니처

```typescript
import type { ReactNode } from 'react';
import type { BoxProps, SpaceToken } from '../Box/types';

export type StackDirection = 'row' | 'column';

export type StackAlign   = 'start' | 'center' | 'end' | 'stretch';
export type StackJustify = 'start' | 'center' | 'end' | 'between' | 'around';

export interface StackOwnProps {
  /** flex 축 — 기본 'column' (vertical). UI 대부분이 vertical stack이라는 통념. */
  direction?: StackDirection;

  /** flex gap — space token index. 4 → '10px'. */
  gap?: SpaceToken;

  /** cross-axis alignment. */
  align?: StackAlign;

  /** main-axis distribution. */
  justify?: StackJustify;

  /** flex-wrap 활성화. 기본 false. */
  wrap?: boolean;

  children?: ReactNode;
}

/**
 * Stack은 Box 위에 layer — Box의 prop(`p`/`m`/`bg`/`border`/`rounded`/`as` 등)을 그대로 통과한다.
 * StackOwnProps의 prop(`direction`/`gap`/...)은 Box prop과 충돌하지 않는다.
 */
export interface StackProps extends StackOwnProps, Omit<BoxProps, keyof StackOwnProps> {}
```

### 3. `Stack.test.tsx` (TDD — 먼저 작성)

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Stack } from './Stack';

describe('Stack', () => {
  it('renders a div by default', () => {
    render(<Stack data-testid="s">child</Stack>);
    expect(screen.getByTestId('s').tagName).toBe('DIV');
  });

  it('applies display: flex', () => {
    render(<Stack data-testid="s" />);
    expect(screen.getByTestId('s')).toHaveStyle({ display: 'flex' });
  });

  it('defaults to column direction (vertical stack)', () => {
    render(<Stack data-testid="s" />);
    expect(screen.getByTestId('s')).toHaveStyle({ flexDirection: 'column' });
  });

  it('applies row direction when explicit', () => {
    render(<Stack direction="row" data-testid="s" />);
    expect(screen.getByTestId('s')).toHaveStyle({ flexDirection: 'row' });
  });

  it('maps gap prop to gap via space token (4 -> 10px)', () => {
    render(<Stack gap={4} data-testid="s" />);
    expect(screen.getByTestId('s')).toHaveStyle({ gap: '10px' });
  });

  it('maps align="center" to alignItems: center', () => {
    render(<Stack align="center" data-testid="s" />);
    expect(screen.getByTestId('s')).toHaveStyle({ alignItems: 'center' });
  });

  it('maps align="start" to alignItems: flex-start', () => {
    render(<Stack align="start" data-testid="s" />);
    expect(screen.getByTestId('s')).toHaveStyle({ alignItems: 'flex-start' });
  });

  it('maps justify="between" to justifyContent: space-between', () => {
    render(<Stack justify="between" data-testid="s" />);
    expect(screen.getByTestId('s')).toHaveStyle({ justifyContent: 'space-between' });
  });

  it('applies flexWrap: wrap when wrap=true', () => {
    render(<Stack wrap data-testid="s" />);
    expect(screen.getByTestId('s')).toHaveStyle({ flexWrap: 'wrap' });
  });

  it('passes through Box props (p, bg, rounded)', () => {
    render(<Stack p={6} bg="surface" rounded="md" data-testid="s" />);
    const el = screen.getByTestId('s');
    // space[6] === '16px', surfaces.surface === '#FEFEFE', radius.md === '10px'
    expect(el).toHaveStyle({ padding: '16px' });
    expect(el).toHaveStyle({ background: '#FEFEFE' });
    expect(el).toHaveStyle({ borderRadius: '10px' });
  });

  it('passes through as prop', () => {
    render(<Stack as="section" data-testid="s" />);
    expect(screen.getByTestId('s').tagName).toBe('SECTION');
  });

  it('renders children in given order', () => {
    render(
      <Stack>
        <span>a</span>
        <span>b</span>
        <span>c</span>
      </Stack>
    );
    expect(screen.getByText('a')).toBeInTheDocument();
    expect(screen.getByText('b')).toBeInTheDocument();
    expect(screen.getByText('c')).toBeInTheDocument();
  });

  it('allows consumer style override via style prop', () => {
    render(<Stack gap={4} style={{ gap: '99px' }} data-testid="s" />);
    expect(screen.getByTestId('s')).toHaveStyle({ gap: '99px' });
  });

  it('renders without AI slop visual decoration', () => {
    render(<Stack data-testid="s" />);
    const styles = window.getComputedStyle(screen.getByTestId('s'));
    expect(styles.backdropFilter || '').not.toMatch(/blur/);
    expect(styles.backgroundImage || '').not.toMatch(/gradient/);
    expect(styles.boxShadow || '').not.toMatch(/glow|0 0 \d+px/i);
  });
});
```

### 4. `Stack.tsx` 구현 (테스트 통과시키는 minimal 구현)

```tsx
import type { CSSProperties } from 'react';
import { space } from '@wonik/tokens';
import { Box } from '../Box/Box';
import type { StackProps, StackAlign, StackJustify } from './types';

const ALIGN_MAP: Record<StackAlign, CSSProperties['alignItems']> = {
  start:   'flex-start',
  center:  'center',
  end:     'flex-end',
  stretch: 'stretch',
};

const JUSTIFY_MAP: Record<StackJustify, CSSProperties['justifyContent']> = {
  start:   'flex-start',
  center:  'center',
  end:     'flex-end',
  between: 'space-between',
  around:  'space-around',
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
    display:        'flex',
    flexDirection:  direction,
    ...(gap     !== undefined && { gap: space[gap] }),
    ...(align   !== undefined && { alignItems:    ALIGN_MAP[align] }),
    ...(justify !== undefined && { justifyContent: JUSTIFY_MAP[justify] }),
    ...(wrap                  && { flexWrap: 'wrap' }),
    ...style, // consumer override (마지막)
  };

  return (
    <Box style={flexStyle} {...boxRest}>
      {children}
    </Box>
  );
}
```

**작성 원칙:**
- spacing은 `space` 토큰만. **px 리터럴 금지.**
- align/justify mapping table은 외부 모듈 분리하지 말고 같은 파일 안에 const로 둔다 (CLAUDE.md "컴포넌트 폴더 외부에 helper 함수를 만들지 않는다" 정신).
- Box를 wrap. raw `<div>` 사용 금지 — Box를 통해 padding·margin·bg·border가 일관되게 처리되도록.
- AI 슬롭 0.

### 5. `index.ts` (Stack 폴더)

```typescript
export { Stack } from './Stack';
export type { StackProps, StackOwnProps, StackDirection, StackAlign, StackJustify } from './types';
```

### 6. `packages/web/src/index.ts` 업데이트

```typescript
export { Button } from './Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button/types';

export { Box } from './Box';
export type { BoxProps, BoxOwnProps, SpaceToken, RadiusToken, SurfaceToken, BorderToken } from './Box/types';

export { Stack } from './Stack';
export type { StackProps, StackOwnProps, StackDirection, StackAlign, StackJustify } from './Stack/types';
```

## Acceptance Criteria

```bash
cd C:/Users/ohjih/design_system

pnpm -F @wonik/web test          # Button + Box + Stack 모두 통과
pnpm -F @wonik/web build         # 빌드 성공

# 빌드 산출물 검증
test -f packages/web/dist/index.js
test -f packages/web/dist/index.mjs
test -f packages/web/dist/index.d.ts

# 하드코딩 px 금지
! grep -E "['\"][0-9]+px['\"]" packages/web/src/Stack/Stack.tsx

# 하드코딩 hex 금지
! grep -E "['\"]#[0-9A-Fa-f]{6}['\"]" packages/web/src/Stack/Stack.tsx

# AI 슬롭 anti-pattern 0건
! grep -i -E "backdrop-filter|linear-gradient|box-shadow.*0 0|rounded-2xl" packages/web/src/Stack/Stack.tsx

# 공개 표면에 Stack 노출
grep -q "export { Stack }" packages/web/src/index.ts

# Stack은 Box를 사용한다 (raw div 금지)
grep -q "from '../Box/Box'" packages/web/src/Stack/Stack.tsx
```

위 명령이 모두 통과해야 한다.

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 체크리스트:
   - TDD: `Stack.test.tsx`가 `Stack.tsx` 전에 작성됐나?
   - Stack이 `Box`를 wrap하나? (raw `<div>` 금지)
   - `direction` 기본값이 `'column'`인가?
   - `gap`이 `space` 토큰 인덱스로만 제한되나?
   - 회귀 없음: 기존 Button + Box 테스트 모두 통과?
3. 결과에 따라 `phases/02-layout-primitives/index.json`의 step 1을 업데이트:
   - 성공 → `"status": "completed"`, `"summary": "@wonik/web Stack primitive 추가. Box 위에 layer로 flex(direction/gap/align/justify/wrap) 제공. token-indexed gap. 다음 step에서 Text가 typography 토큰을 wrap."`
   - 실패 → `"status": "error"`, `"error_message": "구체 사유"`

## 금지사항

- **hex/px 리터럴 사용 금지** (모두 `@wonik/tokens` import).
- **raw `<div>` 사용 금지** — Stack은 Box를 wrap하라.
- **CSS-in-JS 라이브러리 도입 금지.**
- **Snapshot test 금지.**
- **AI 슬롭 anti-pattern 금지** (backdrop-filter/gradient/glow shadow).
- **React 19-only API 금지.**
- **Box·Button 코드 수정 금지** — Stack 구현은 Stack 폴더 안에서만.
- **다른 패키지 폴더 만들지 마라** (ADR-001).
- **기존 테스트를 깨뜨리지 마라.**
