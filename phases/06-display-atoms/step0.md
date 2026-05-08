# Step 0: spinner-primitive

## 읽어야 할 파일

먼저 아래 파일을 읽고 1단계 우선순위·기존 atom 패턴·토큰 reference 형태를 파악하라:

- `/CLAUDE.md` (CRITICAL — 토큰 하드코딩 금지 + stateless + React 18·19 dual peer)
- `/docs/UI_GUIDE.md` (AI 슬롭 anti-pattern — gradient·glow·blur 금지)
- `/docs/ADR.md` 특히 ADR-007 (WONIK BLUE), ADR-008 (React dual peer), ADR-009 (다크 모드 — 토큰은 `var(--color-...)` reference)
- 이전 phase 산출물:
  - `/packages/tokens/src/colors.ts` (`primary.base = 'var(--color-primary)'`, `borders.mid`)
  - `/packages/web/src/Switch/Switch.tsx` (**scoped CSS inject 패턴** — `:checked` 분기를 inline에서 못 풀 때 `<style>` 1회 inject. Spinner의 `@keyframes`도 동일하게 처리)
  - `/packages/web/src/Checkbox/Checkbox.tsx` (단순 atom + forwardRef + size 3종 reference)
  - `/packages/web/src/index.ts` (공개 표면)
  - `/packages/web/vitest.setup.ts` (jsdom CSS var inject 설정)

## 작업

`@wonik/web`에 **Spinner** 컴포넌트를 추가한다. **로딩 state를 표현하는 display atom** — ppt(첫 dogfood, AI 프레젠테이션 생성기)에서 "AI 생성 중", "이미지 업로드 중" 같은 빈도가 가장 높은 feedback 시각.

이 step의 목적은 **"가장 단순한 display atom 1개가 토큰 + 다크모드 + AI 슬롭 anti-pattern 0건 위에서 정상 동작한다"**.

### 핵심 설계 결정

1. **border trick 기반** — `<span>`에 `border` 4면 + 한 면만 primary 색 + `border-radius: 50%` + `animation: rotate`. SVG보다 코드 줄 수 적고 작은 size에서도 깔끔. Toss SLASH 등 산업 표준이 동일.
2. **`@keyframes`는 scoped CSS inject** — inline style로 `@keyframes`를 정의할 수 없으므로 모듈 스코프 변수로 1회 inject 가드(`/packages/web/src/Switch/Switch.tsx`의 `ensureCssInjected` 패턴 동일). 토큰은 `var(--color-primary)` 등 reference 유지.
3. **size 3종 — sm/md/lg**: `16/24/40px`. form atom보다 size 범위 넓음 — sm은 텍스트 inline용, lg는 큰 빈 영역(전체 화면 로딩)용.
4. **stroke width 토큰화하지 않음** — `2px`로 size별 동일. 작은 spinner도 너무 가늘지 않게. raw px 1건은 시각 spec(border thickness)이므로 토큰화 가성비 낮음 — 단 컴포넌트 코드에 직접 쓰는 게 아니라 size spec table에 넣어 `Switch.tsx`처럼 의도 명확히.
5. **default color = `var(--color-primary)` (token reference)** — consumer가 `style.color` override로 쉽게 바꿀 수 있도록 `borderTopColor`만 primary로 두고 나머지 3면은 `borders.mid`로. 다크/라이트 모두 자동 작동.
6. **a11y — `role="status"` + `aria-live="polite"` + `aria-label`** — 스크린리더가 "Loading"으로 인식. 라벨은 prop으로 받되 default `'Loading'` (영문 default — i18n은 1단계 외).
7. **stateless**: hook 0.
8. **forwardRef는 사용**: consumer가 외부에서 spinner DOM을 측정/포커스할 수 있도록(form atom과 일관성). 대상은 `HTMLSpanElement`.

### 1. 디렉토리 구조

```
packages/web/src/
├── (기존)
└── Spinner/
    ├── Spinner.tsx
    ├── Spinner.test.tsx
    ├── types.ts
    └── index.ts
└── index.ts                      # Spinner·SpinnerProps·SpinnerSize 추가
```

### 2. `types.ts` 시그니처

```typescript
import type { HTMLAttributes, Ref } from 'react';

export type SpinnerSize = 'sm' | 'md' | 'lg';

export interface SpinnerOwnProps {
  /** size 토큰. 기본 'md'. */
  size?: SpinnerSize;

  /** 스크린리더용 라벨. 기본 'Loading'. */
  label?: string;

  /** native span ref. */
  ref?: Ref<HTMLSpanElement>;
}

/**
 * native <span>의 모든 attr 통과.
 * role/aria-busy/aria-live는 컴포넌트가 강제 — consumer override 금지(Omit).
 */
export interface SpinnerProps
  extends SpinnerOwnProps,
          Omit<HTMLAttributes<HTMLSpanElement>, 'role' | 'aria-busy' | 'aria-live'> {}
```

### 3. `Spinner.test.tsx` (TDD — 먼저 작성)

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('renders a span with role="status"', () => {
    render(<Spinner data-testid="s" />);
    const el = screen.getByTestId('s');
    expect(el.tagName).toBe('SPAN');
    expect(el).toHaveAttribute('role', 'status');
  });

  it('sets aria-live="polite" + aria-busy="true"', () => {
    render(<Spinner data-testid="s" />);
    const el = screen.getByTestId('s');
    expect(el).toHaveAttribute('aria-live', 'polite');
    expect(el).toHaveAttribute('aria-busy', 'true');
  });

  it('default label is "Loading"', () => {
    render(<Spinner data-testid="s" />);
    expect(screen.getByTestId('s')).toHaveAttribute('aria-label', 'Loading');
  });

  it('custom label overrides default', () => {
    render(<Spinner label="AI 생성 중" data-testid="s" />);
    expect(screen.getByTestId('s')).toHaveAttribute('aria-label', 'AI 생성 중');
  });

  it('size="sm" renders 16x16', () => {
    render(<Spinner size="sm" data-testid="s" />);
    const el = screen.getByTestId('s');
    expect(el).toHaveStyle({ width: '16px', height: '16px' });
  });

  it('size="md" (default) renders 24x24', () => {
    render(<Spinner data-testid="s" />);
    const el = screen.getByTestId('s');
    expect(el).toHaveStyle({ width: '24px', height: '24px' });
  });

  it('size="lg" renders 40x40', () => {
    render(<Spinner size="lg" data-testid="s" />);
    const el = screen.getByTestId('s');
    expect(el).toHaveStyle({ width: '40px', height: '40px' });
  });

  it('uses token reference for primary color (no hex literal)', () => {
    render(<Spinner data-testid="s" />);
    const styleAttr = screen.getByTestId('s').getAttribute('style') || '';
    // borderTopColor 또는 컴포넌트가 사용하는 token reference가 var(--color-...)로 노출돼야 한다.
    expect(styleAttr).toMatch(/var\(--color-/);
  });

  it('uses border-radius 50% for circular shape', () => {
    render(<Spinner data-testid="s" />);
    expect(screen.getByTestId('s')).toHaveStyle({ borderRadius: '50%' });
  });

  it('forwards ref to the underlying span', () => {
    const ref = { current: null as HTMLSpanElement | null };
    render(<Spinner ref={ref} data-testid="s" />);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('SPAN');
  });

  it('forwards extra attributes (data-* / className)', () => {
    render(<Spinner className="my-spin" data-foo="bar" data-testid="s" />);
    const el = screen.getByTestId('s');
    expect(el).toHaveClass('my-spin');
    expect(el).toHaveAttribute('data-foo', 'bar');
  });

  it('does not use AI slop visual decoration', () => {
    render(<Spinner data-testid="s" />);
    const styles = window.getComputedStyle(screen.getByTestId('s'));
    expect(styles.backdropFilter || '').not.toMatch(/blur/);
    expect(styles.backgroundImage || '').not.toMatch(/gradient/);
    expect(styles.boxShadow || '').not.toMatch(/glow/i);
  });

  it('injects scoped @keyframes once into document head', () => {
    render(<Spinner />);
    render(<Spinner />);
    const styleTags = document.head.querySelectorAll('style[data-wonik-spinner]');
    expect(styleTags.length).toBe(1);
    expect(styleTags[0].textContent).toMatch(/@keyframes\s+wonik-spin/);
  });

  it('applies animation referencing wonik-spin keyframes', () => {
    render(<Spinner data-testid="s" />);
    const styleAttr = screen.getByTestId('s').getAttribute('style') || '';
    expect(styleAttr).toMatch(/animation/);
    expect(styleAttr).toMatch(/wonik-spin/);
  });
});
```

### 4. `Spinner.tsx` 구현

```tsx
import { forwardRef } from 'react';
import type { CSSProperties } from 'react';
import { primary, borders } from '@wonik/tokens';
import type { SpinnerProps, SpinnerSize } from './types';

interface SizeSpec {
  diameter: string;
  thickness: string;
}

const SIZE_SPEC: Record<SpinnerSize, SizeSpec> = {
  sm: { diameter: '16px', thickness: '2px' },
  md: { diameter: '24px', thickness: '2px' },
  lg: { diameter: '40px', thickness: '3px' },
};

// @keyframes는 inline style로 정의 못 하므로 module-scoped CSS 1회 inject.
const SPINNER_CSS = `
@keyframes wonik-spin {
  to { transform: rotate(360deg); }
}
`;

let cssInjected = false;
function ensureCssInjected() {
  if (cssInjected || typeof document === 'undefined') return;
  const style = document.createElement('style');
  style.setAttribute('data-wonik-spinner', 'true');
  style.textContent = SPINNER_CSS;
  document.head.appendChild(style);
  cssInjected = true;
}

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size = 'md', label = 'Loading', style, ...rest },
  ref,
) {
  ensureCssInjected();
  const spec = SIZE_SPEC[size];

  const composed: CSSProperties = {
    display: 'inline-block',
    width: spec.diameter,
    height: spec.diameter,
    borderWidth: spec.thickness,
    borderStyle: 'solid',
    borderColor: borders.mid,
    borderTopColor: primary.base,
    borderRadius: '50%',
    boxSizing: 'border-box',
    animation: 'wonik-spin 0.8s linear infinite',
    flexShrink: 0,
    ...style,
  };

  return (
    <span
      ref={ref}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
      style={composed}
      {...rest}
    />
  );
});
```

### 5. `index.ts` (Spinner 폴더)

```typescript
export { Spinner } from './Spinner';
export type { SpinnerProps, SpinnerOwnProps, SpinnerSize } from './types';
```

### 6. `packages/web/src/index.ts` 업데이트

기존 export들 그대로 유지하고 끝에 추가:

```typescript
export { Spinner } from './Spinner';
export type { SpinnerProps, SpinnerOwnProps, SpinnerSize } from './Spinner/types';
```

## Acceptance Criteria

```bash
cd C:/Users/ohjih/design_system

pnpm -F @wonik/web test --run     # Spinner 테스트 + 기존 테스트 모두 통과
pnpm -F @wonik/web build          # 빌드 성공

# 빌드 산출물 검증
test -f packages/web/dist/index.js
grep -q "Spinner" packages/web/dist/index.js

# 하드코딩 hex 금지
! grep -E "['\"]#[0-9A-Fa-f]{6}['\"]" packages/web/src/Spinner/Spinner.tsx

# AI 슬롭 anti-pattern 0건
! grep -i -E "backdrop-filter|linear-gradient|box-shadow.*glow|rounded-2xl" packages/web/src/Spinner/Spinner.tsx

# 공개 표면에 Spinner 노출
grep -q "export { Spinner }" packages/web/src/index.ts

# forwardRef 사용
grep -q "forwardRef" packages/web/src/Spinner/Spinner.tsx

# scoped CSS inject 패턴 (Switch 동일)
grep -q "data-wonik-spinner" packages/web/src/Spinner/Spinner.tsx
grep -q "@keyframes wonik-spin" packages/web/src/Spinner/Spinner.tsx

# 토큰 reference 사용 — primary.base 또는 borders.mid
grep -E "primary\.base|borders\.mid" packages/web/src/Spinner/Spinner.tsx

# React 19-only API 사용 0
! grep -E "useFormStatus|useOptimistic|use\(" packages/web/src/Spinner/Spinner.tsx
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 체크리스트:
   - TDD: `Spinner.test.tsx`가 `Spinner.tsx` 전에 작성됐나?
   - 토큰 hex 0건? (`borderTopColor`도 토큰 reference)
   - role="status" + aria-busy="true" + aria-live="polite" 모두?
   - 3 size?
   - forwardRef로 span 노출?
   - 18·19 공통 API만?
   - 회귀 없음: 기존 테스트 모두 통과?
3. 결과에 따라 `phases/06-display-atoms/index.json`의 step 0을 업데이트:
   - 성공 → `"status": "completed"`, `"summary": "@wonik/web Spinner atom 추가. border trick + scoped @keyframes inject. 3 size(16/24/40), aria-live polite + role status, label prop. ppt 'AI 생성 중' 시나리오 등 로딩 state의 baseline. 다음 step에서 Skeleton."`
   - 실패 → `"status": "error"`, `"error_message": "구체 사유"`

## 금지사항

- **hex 리터럴 금지** — `borderTopColor`/`borderColor` 모두 토큰 reference (`primary.base`, `borders.mid`).
- **외부 stylesheet 도입 금지** — `<style>` head inject 방식만(Switch와 동일).
- **SVG 사용 금지** — border trick으로 충분, 1단계 단순성 우선.
- **internal `useState`/`useReducer`/`useEffect` 도입 금지** — stateless. CSS inject도 동기적으로 첫 render 전에 처리(`ensureCssInjected()` 호출).
- **CSS-in-JS 라이브러리 도입 금지.**
- **Snapshot test 금지.**
- **AI 슬롭 anti-pattern 금지** (backdrop-filter / gradient / glow / rounded-2xl / pulse-glow).
- **React 19-only API 금지.**
- **다른 패키지 폴더 만들지 마라.**
- **기존 docs/CLAUDE.md/scripts/execute.py 또는 기존 컴포넌트 코드 수정 금지** — 단 `packages/web/src/index.ts`에 Spinner export 추가는 허용.
- **기존 테스트를 깨뜨리지 마라.**
