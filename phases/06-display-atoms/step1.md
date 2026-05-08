# Step 1: skeleton-primitive

## 읽어야 할 파일

- `/CLAUDE.md` (CRITICAL — 토큰 하드코딩 금지 + stateless + React 18·19 dual peer)
- `/docs/UI_GUIDE.md` (AI 슬롭 anti-pattern)
- `/docs/ADR.md` 특히 ADR-009 (다크 모드 — 토큰은 var() reference)
- 이전 step 산출물:
  - `/packages/web/src/Spinner/Spinner.tsx` (**scoped CSS inject 패턴** — 동일하게 `@keyframes` 1회 inject)
  - `/packages/web/src/Spinner/types.ts`
  - `/packages/web/src/Spinner/Spinner.test.tsx`
  - `/packages/tokens/src/colors.ts` (`surfaces.surfaceMid`, `surfaces.surfaceWhite`)
  - `/packages/web/src/index.ts`

## 작업

`@wonik/web`에 **Skeleton** 컴포넌트를 추가한다. **데이터/이미지 로딩 중 placeholder shape**으로, ppt 슬라이드 썸네일·생성 중 콘텐츠 영역 등에 들어간다. Spinner와 함께 1단계 display atom 셋을 마무리.

이 step의 목적은 **"variant prop 기반 단순 display atom 1개 추가 + 두 번째 컴포넌트도 scoped CSS inject 패턴이 일관 적용된다"**.

### 핵심 설계 결정

1. **3 variant — `text` / `rect` / `circle`**:
   - `text`: width 100%, height `1em`, border-radius `4px`. 텍스트 줄 placeholder.
   - `rect`: 명시적 width/height required, border-radius `8px`. 카드/이미지 placeholder.
   - `circle`: 명시적 width=height required, border-radius 50%. 아바타·아이콘 placeholder.
2. **width/height props** — `string | number`. 숫자는 px로 자동 처리. variant default를 override.
3. **pulse animation — opacity 1 → 0.5 → 1** — `@keyframes wonik-skeleton-pulse`. shimmer(background-position 이동)는 1단계 외 — 시각 가성비 낮고 다크모드에서 색 매핑 복잡. 단순 opacity pulse가 Toss/Material 동일.
4. **`@keyframes`는 scoped CSS inject** — Spinner와 동일 패턴. 별도 `data-wonik-skeleton` 속성으로 가드.
5. **base color는 `surfaces.surfaceMid` 토큰** — light/dark 자동 매핑. 별도 skeleton-only 토큰을 만들지 않음 (1단계 단순성).
6. **a11y — `role="status"` + `aria-busy="true"` + `aria-hidden`은 안 씀** — 스크린리더가 placeholder 영역 인식. 텍스트 라벨은 안 줌(콘텐츠 자체가 placeholder라 의미 텍스트 없음).
7. **forwardRef 사용**: 대상 `HTMLDivElement`.
8. **stateless**: hook 0.

### 1. 디렉토리 구조

```
packages/web/src/
├── (기존)
└── Skeleton/
    ├── Skeleton.tsx
    ├── Skeleton.test.tsx
    ├── types.ts
    └── index.ts
└── index.ts                      # Skeleton·SkeletonProps·SkeletonVariant 추가
```

### 2. `types.ts` 시그니처

```typescript
import type { HTMLAttributes, Ref } from 'react';

export type SkeletonVariant = 'text' | 'rect' | 'circle';

export interface SkeletonOwnProps {
  /** placeholder 모양. 기본 'text'. */
  variant?: SkeletonVariant;

  /** 명시적 width. number는 px. variant 기본값 override. */
  width?: string | number;

  /** 명시적 height. number는 px. variant 기본값 override. */
  height?: string | number;

  /** native div ref. */
  ref?: Ref<HTMLDivElement>;
}

/**
 * native <div>의 모든 attr 통과.
 * role/aria-busy는 컴포넌트가 강제 — consumer override 금지.
 */
export interface SkeletonProps
  extends SkeletonOwnProps,
          Omit<HTMLAttributes<HTMLDivElement>, 'role' | 'aria-busy'> {}
```

### 3. `Skeleton.test.tsx` (TDD — 먼저 작성)

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('renders a div with role="status" + aria-busy="true"', () => {
    render(<Skeleton data-testid="sk" />);
    const el = screen.getByTestId('sk');
    expect(el.tagName).toBe('DIV');
    expect(el).toHaveAttribute('role', 'status');
    expect(el).toHaveAttribute('aria-busy', 'true');
  });

  it('default variant "text" — width 100%, height 1em, radius 4px', () => {
    render(<Skeleton data-testid="sk" />);
    const el = screen.getByTestId('sk');
    expect(el).toHaveStyle({ width: '100%', height: '1em', borderRadius: '4px' });
  });

  it('variant "rect" — radius 8px, no default size', () => {
    render(<Skeleton variant="rect" width={200} height={100} data-testid="sk" />);
    const el = screen.getByTestId('sk');
    expect(el).toHaveStyle({ width: '200px', height: '100px', borderRadius: '8px' });
  });

  it('variant "circle" — radius 50%', () => {
    render(<Skeleton variant="circle" width={40} height={40} data-testid="sk" />);
    const el = screen.getByTestId('sk');
    expect(el).toHaveStyle({ width: '40px', height: '40px', borderRadius: '50%' });
  });

  it('width/height props — number is treated as px', () => {
    render(<Skeleton width={120} height={24} data-testid="sk" />);
    const el = screen.getByTestId('sk');
    expect(el).toHaveStyle({ width: '120px', height: '24px' });
  });

  it('width/height props — string is passed through (e.g. percentage)', () => {
    render(<Skeleton width="50%" height="2rem" data-testid="sk" />);
    const el = screen.getByTestId('sk');
    expect(el).toHaveStyle({ width: '50%', height: '2rem' });
  });

  it('explicit width/height override variant defaults', () => {
    render(<Skeleton variant="text" width={80} height={12} data-testid="sk" />);
    const el = screen.getByTestId('sk');
    expect(el).toHaveStyle({ width: '80px', height: '12px' });
  });

  it('uses token reference for background (no hex literal)', () => {
    render(<Skeleton data-testid="sk" />);
    const styleAttr = screen.getByTestId('sk').getAttribute('style') || '';
    expect(styleAttr).toMatch(/var\(--color-/);
  });

  it('forwards ref to the underlying div', () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Skeleton ref={ref} data-testid="sk" />);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('DIV');
  });

  it('forwards extra attributes (data-* / className)', () => {
    render(<Skeleton className="my-sk" data-foo="bar" data-testid="sk" />);
    const el = screen.getByTestId('sk');
    expect(el).toHaveClass('my-sk');
    expect(el).toHaveAttribute('data-foo', 'bar');
  });

  it('does not use AI slop visual decoration', () => {
    render(<Skeleton data-testid="sk" />);
    const styles = window.getComputedStyle(screen.getByTestId('sk'));
    expect(styles.backdropFilter || '').not.toMatch(/blur/);
    expect(styles.backgroundImage || '').not.toMatch(/gradient/);
    expect(styles.boxShadow || '').not.toMatch(/glow/i);
  });

  it('injects scoped @keyframes once into document head', () => {
    render(<Skeleton />);
    render(<Skeleton />);
    const styleTags = document.head.querySelectorAll('style[data-wonik-skeleton]');
    expect(styleTags.length).toBe(1);
    expect(styleTags[0].textContent).toMatch(/@keyframes\s+wonik-skeleton-pulse/);
  });

  it('applies animation referencing wonik-skeleton-pulse keyframes', () => {
    render(<Skeleton data-testid="sk" />);
    const styleAttr = screen.getByTestId('sk').getAttribute('style') || '';
    expect(styleAttr).toMatch(/animation/);
    expect(styleAttr).toMatch(/wonik-skeleton-pulse/);
  });
});
```

### 4. `Skeleton.tsx` 구현

```tsx
import { forwardRef } from 'react';
import type { CSSProperties } from 'react';
import { surfaces } from '@wonik/tokens';
import type { SkeletonProps, SkeletonVariant } from './types';

interface VariantSpec {
  width?: string;
  height?: string;
  radius: string;
}

const VARIANT_SPEC: Record<SkeletonVariant, VariantSpec> = {
  text:   { width: '100%', height: '1em', radius: '4px' },
  rect:   { radius: '8px' },
  circle: { radius: '50%' },
};

const SKELETON_CSS = `
@keyframes wonik-skeleton-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
`;

let cssInjected = false;
function ensureCssInjected() {
  if (cssInjected || typeof document === 'undefined') return;
  const style = document.createElement('style');
  style.setAttribute('data-wonik-skeleton', 'true');
  style.textContent = SKELETON_CSS;
  document.head.appendChild(style);
  cssInjected = true;
}

function toLength(value: string | number | undefined): string | undefined {
  if (value === undefined) return undefined;
  return typeof value === 'number' ? `${value}px` : value;
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { variant = 'text', width, height, style, ...rest },
  ref,
) {
  ensureCssInjected();
  const spec = VARIANT_SPEC[variant];

  const composed: CSSProperties = {
    display: 'block',
    width:  toLength(width)  ?? spec.width,
    height: toLength(height) ?? spec.height,
    borderRadius: spec.radius,
    backgroundColor: surfaces.surfaceMid,
    animation: 'wonik-skeleton-pulse 1.5s ease-in-out infinite',
    ...style,
  };

  return (
    <div
      ref={ref}
      role="status"
      aria-busy="true"
      style={composed}
      {...rest}
    />
  );
});
```

### 5. `index.ts` (Skeleton 폴더)

```typescript
export { Skeleton } from './Skeleton';
export type { SkeletonProps, SkeletonOwnProps, SkeletonVariant } from './types';
```

### 6. `packages/web/src/index.ts` 업데이트

기존 export들 그대로 유지하고 끝에 추가:

```typescript
export { Skeleton } from './Skeleton';
export type { SkeletonProps, SkeletonOwnProps, SkeletonVariant } from './Skeleton/types';
```

## Acceptance Criteria

```bash
cd C:/Users/ohjih/design_system

pnpm -F @wonik/web test --run     # Skeleton 테스트 + 기존 테스트 모두 통과
pnpm -F @wonik/web build          # 빌드 성공

# 빌드 산출물 검증
test -f packages/web/dist/index.js
grep -q "Skeleton" packages/web/dist/index.js

# 하드코딩 hex 금지
! grep -E "['\"]#[0-9A-Fa-f]{6}['\"]" packages/web/src/Skeleton/Skeleton.tsx

# AI 슬롭 anti-pattern 0건
! grep -i -E "backdrop-filter|linear-gradient|box-shadow.*glow|rounded-2xl" packages/web/src/Skeleton/Skeleton.tsx

# 공개 표면에 Skeleton 노출
grep -q "export { Skeleton }" packages/web/src/index.ts

# forwardRef 사용
grep -q "forwardRef" packages/web/src/Skeleton/Skeleton.tsx

# scoped CSS inject 패턴
grep -q "data-wonik-skeleton" packages/web/src/Skeleton/Skeleton.tsx
grep -q "@keyframes wonik-skeleton-pulse" packages/web/src/Skeleton/Skeleton.tsx

# 토큰 reference 사용
grep -E "surfaces\.surface" packages/web/src/Skeleton/Skeleton.tsx

# React 19-only API 사용 0
! grep -E "useFormStatus|useOptimistic|use\(" packages/web/src/Skeleton/Skeleton.tsx
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 체크리스트:
   - TDD: `Skeleton.test.tsx`가 `Skeleton.tsx` 전에 작성됐나?
   - 토큰 hex 0건?
   - role="status" + aria-busy="true"?
   - 3 variant + width/height override 동작?
   - forwardRef로 div 노출?
   - 18·19 공통 API만?
   - 회귀 없음: 기존 테스트 모두 통과?
3. 결과에 따라 `phases/06-display-atoms/index.json`의 step 1을 업데이트:
   - 성공 → `"status": "completed"`, `"summary": "@wonik/web Skeleton atom 추가. 3 variant(text/rect/circle) + width/height override. opacity pulse animation은 scoped @keyframes inject. surfaces.surfaceMid 토큰 reference로 light/dark 자동. ppt 슬라이드 placeholder의 baseline. 다음 step에서 sandbox 시각 매트릭스."`
   - 실패 → `"status": "error"`, `"error_message": "구체 사유"`

## 금지사항

- **hex 리터럴 금지** — `backgroundColor`도 토큰 reference (`surfaces.surfaceMid`).
- **shimmer/gradient animation 도입 금지** — opacity pulse만. shimmer는 1단계 외.
- **외부 stylesheet 도입 금지** — `<style>` head inject 방식만.
- **internal `useState`/`useReducer`/`useEffect` 도입 금지** — stateless. CSS inject는 동기적으로 첫 render 전에 처리.
- **CSS-in-JS 라이브러리 도입 금지.**
- **Snapshot test 금지.**
- **AI 슬롭 anti-pattern 금지** (backdrop-filter / gradient / glow / rounded-2xl).
- **React 19-only API 금지.**
- **다른 패키지 폴더 만들지 마라.**
- **기존 docs/CLAUDE.md/scripts/execute.py 또는 기존 컴포넌트 코드 수정 금지** — 단 `packages/web/src/index.ts`에 Skeleton export 추가는 허용.
- **기존 테스트를 깨뜨리지 마라.**
