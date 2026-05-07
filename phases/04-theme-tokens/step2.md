# Step 2: theme-provider-react

## 읽어야 할 파일

먼저 아래 파일을 읽고 step 0/1에서 만든 토큰 인프라와 React 18·19 dual peer 정책을 파악하라:

- `/CLAUDE.md` (CRITICAL — 18·19 공통 API만, stateless 우선)
- `/docs/ADR.md` 특히 ADR-008 (React 18·19 dual) + ADR-009 (다크 모드)
- 이전 step 산출물:
  - `/packages/tokens/dist/tokens.css` (light + dark 변수 정의)
  - `/packages/tokens/src/theme-light.ts`, `theme-dark.ts`
  - `/packages/web/src/Button/Button.tsx` (토큰을 inline style로 사용 — ThemeProvider와 직접 무관, 단 사용 패턴 reference)
- 기존 컴포넌트 패턴:
  - `/packages/web/src/Box/Box.tsx` (polymorphic 패턴)
  - `/packages/web/src/index.ts` (공개 표면)

## 작업

`@wonik/web`에 **`ThemeProvider`** 컴포넌트와 **`useTheme()`** 훅을 추가한다. ThemeProvider는 `<html>` 또는 자식 wrapper에 `data-theme="light|dark"` 속성을 설정해 step 0/1의 CSS 변수 시스템을 활성화한다. controlled (외부 prop)와 uncontrolled (내부 state, 기본값 'light')를 모두 지원하며, localStorage 기억을 옵션으로 제공.

이 step의 목적은 **"테마 전환 인프라가 React 컴포넌트로 노출된다"**를 검증.

### 핵심 설계 결정

1. **컨테이너는 `<html>` 직접 조작 (default)**: 테마 변환은 페이지 전역이 자연스럽다 (Radix Themes·Mantine·Toss SLASH 동일 default). `useEffect`로 `document.documentElement.setAttribute('data-theme', mode)`. 단 SSR-safe하게 effect 안에서만.
2. **scope 옵션**: ThemeProvider에 `scope?: 'html' | 'self'` prop. `'self'`면 ThemeProvider가 직접 렌더링하는 wrapper `<div>`에 data-theme 부착 (다중 테마 페이지 지원 — 실험적).
3. **controlled + uncontrolled 둘 다**: `<ThemeProvider theme="dark">` (controlled) / `<ThemeProvider defaultTheme="light">` (uncontrolled, 내부 state).
4. **localStorage 기억은 opt-in**: `<ThemeProvider persist>` 또는 `<ThemeProvider persist="my-app-theme">` (key 지정). default false — 라이브러리 사용자가 명시적으로 켜야 동작.
5. **`useTheme()`은 `{ theme, setTheme, toggleTheme }`** 반환. 동일 패턴이 React Aria·Chakra·MUI에서 검증됨.
6. **18·19 공통 API만**: `useState`/`useEffect`/`useContext`/`createContext`/`useCallback`. React 19-only(`use()`) 금지.
7. **stateless 컴포넌트가 ThemeProvider 안 없이도 import해서 작동해야 함**: 토큰이 `var(--color-...)` reference이고, `:root` 기본값이 light이므로 ThemeProvider 없으면 light가 기본 (backwards compat). 본 ThemeProvider는 dark로 토글하고 싶을 때만 필수.

### 1. 디렉토리 구조

```
packages/web/src/
├── Button/, Box/, Stack/, Text/, Input/, Textarea/    # 그대로
└── ThemeProvider/
    ├── ThemeProvider.tsx
    ├── ThemeProvider.test.tsx
    ├── useTheme.ts
    ├── types.ts
    └── index.ts
└── index.ts                      # ThemeProvider·useTheme·ThemeMode·ThemeProviderProps 추가
```

### 2. `types.ts` 시그니처

```typescript
import type { ReactNode } from 'react';

export type ThemeMode = 'light' | 'dark';

export interface ThemeProviderProps {
  /** controlled 모드 — 외부에서 theme 직접 통제. 지정 시 defaultTheme 무시. */
  theme?: ThemeMode;

  /** controlled 모드의 변경 콜백. */
  onThemeChange?: (theme: ThemeMode) => void;

  /** uncontrolled 모드의 초기값. 기본 'light'. */
  defaultTheme?: ThemeMode;

  /**
   * data-theme 속성을 어디에 설정할지.
   * - 'html' (default): document.documentElement.dataset.theme — 페이지 전역
   * - 'self': ThemeProvider가 렌더하는 <div data-theme="..."> 안쪽만 영향
   */
  scope?: 'html' | 'self';

  /**
   * localStorage 기억.
   * - false (default): 기억 안 함
   * - true: 기본 key 'wonik-theme'으로 기억
   * - string: 지정 key로 기억
   */
  persist?: boolean | string;

  children: ReactNode;
}

export interface ThemeContextValue {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}
```

### 3. `useTheme.ts`

```typescript
import { createContext, useContext } from 'react';
import type { ThemeContextValue } from './types';

export const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Theme 토글 hook. 반드시 <ThemeProvider> 자손 트리 안에서 사용.
 * Provider 외부에서 호출하면 명확한 에러 throw.
 */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (ctx === null) {
    throw new Error('useTheme must be used inside <ThemeProvider>');
  }
  return ctx;
}
```

### 4. `ThemeProvider.test.tsx` (TDD — 먼저 작성)

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from './ThemeProvider';
import { useTheme } from './useTheme';

function ThemeReader() {
  const { theme, setTheme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="cur">{theme}</span>
      <button onClick={() => setTheme('dark')}>set-dark</button>
      <button onClick={toggleTheme}>toggle</button>
    </div>
  );
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    // 각 테스트가 깨끗한 <html> 상태로 시작
    document.documentElement.removeAttribute('data-theme');
    localStorage.clear();
  });

  it('uncontrolled — defaults to "light"', () => {
    render(
      <ThemeProvider>
        <ThemeReader />
      </ThemeProvider>
    );
    expect(screen.getByTestId('cur').textContent).toBe('light');
  });

  it('uncontrolled — defaultTheme honored', () => {
    render(
      <ThemeProvider defaultTheme="dark">
        <ThemeReader />
      </ThemeProvider>
    );
    expect(screen.getByTestId('cur').textContent).toBe('dark');
  });

  it('sets data-theme on <html> by default (scope="html")', () => {
    render(
      <ThemeProvider defaultTheme="dark">
        <ThemeReader />
      </ThemeProvider>
    );
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('setTheme updates state and html attribute', () => {
    render(
      <ThemeProvider>
        <ThemeReader />
      </ThemeProvider>
    );
    fireEvent.click(screen.getByText('set-dark'));
    expect(screen.getByTestId('cur').textContent).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('toggleTheme flips between light and dark', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <ThemeReader />
      </ThemeProvider>
    );
    fireEvent.click(screen.getByText('toggle'));
    expect(screen.getByTestId('cur').textContent).toBe('dark');
    fireEvent.click(screen.getByText('toggle'));
    expect(screen.getByTestId('cur').textContent).toBe('light');
  });

  it('controlled — theme prop wins over internal state', () => {
    const { rerender } = render(
      <ThemeProvider theme="dark">
        <ThemeReader />
      </ThemeProvider>
    );
    expect(screen.getByTestId('cur').textContent).toBe('dark');
    rerender(
      <ThemeProvider theme="light">
        <ThemeReader />
      </ThemeProvider>
    );
    expect(screen.getByTestId('cur').textContent).toBe('light');
  });

  it('controlled — onThemeChange called when setTheme invoked', () => {
    const onChange = vi.fn();
    render(
      <ThemeProvider theme="light" onThemeChange={onChange}>
        <ThemeReader />
      </ThemeProvider>
    );
    fireEvent.click(screen.getByText('set-dark'));
    expect(onChange).toHaveBeenCalledWith('dark');
  });

  it('scope="self" — sets data-theme on rendered wrapper, not html', () => {
    render(
      <ThemeProvider defaultTheme="dark" scope="self">
        <ThemeReader />
      </ThemeProvider>
    );
    // html은 영향 없어야
    expect(document.documentElement.getAttribute('data-theme')).toBeNull();
    // wrapper element는 data-theme 가져야 — ThemeReader의 부모를 찾아서
    const reader = screen.getByTestId('cur');
    const wrapper = reader.closest('[data-theme]');
    expect(wrapper?.getAttribute('data-theme')).toBe('dark');
  });

  it('persist=true — stores theme in localStorage as "wonik-theme"', () => {
    render(
      <ThemeProvider defaultTheme="dark" persist>
        <ThemeReader />
      </ThemeProvider>
    );
    expect(localStorage.getItem('wonik-theme')).toBe('dark');
  });

  it('persist=string — uses custom key', () => {
    render(
      <ThemeProvider defaultTheme="dark" persist="my-app">
        <ThemeReader />
      </ThemeProvider>
    );
    expect(localStorage.getItem('my-app')).toBe('dark');
  });

  it('persist=true — restores theme from localStorage on mount', () => {
    localStorage.setItem('wonik-theme', 'dark');
    render(
      <ThemeProvider defaultTheme="light" persist>
        <ThemeReader />
      </ThemeProvider>
    );
    expect(screen.getByTestId('cur').textContent).toBe('dark');
  });

  it('useTheme outside ThemeProvider throws', () => {
    // console.error suppress (React가 에러 stack을 출력)
    const original = console.error;
    console.error = () => {};
    expect(() => render(<ThemeReader />)).toThrow(/useTheme must be used inside <ThemeProvider>/);
    console.error = original;
  });
});
```

### 5. `ThemeProvider.tsx` 구현 (테스트 통과시키는 minimal 구현)

```tsx
import { useState, useEffect, useCallback, useMemo } from 'react';
import { ThemeContext } from './useTheme';
import type { ThemeProviderProps, ThemeMode, ThemeContextValue } from './types';

export function ThemeProvider({
  theme: controlledTheme,
  onThemeChange,
  defaultTheme = 'light',
  scope = 'html',
  persist = false,
  children,
}: ThemeProviderProps) {
  const persistKey = typeof persist === 'string' ? persist : 'wonik-theme';

  // localStorage 초기화 (mount 시 1회)
  const initialTheme: ThemeMode = (() => {
    if (controlledTheme !== undefined) return controlledTheme;
    if (persist && typeof window !== 'undefined') {
      const stored = localStorage.getItem(persistKey);
      if (stored === 'light' || stored === 'dark') return stored;
    }
    return defaultTheme;
  })();

  const [internalTheme, setInternalTheme] = useState<ThemeMode>(initialTheme);

  const isControlled = controlledTheme !== undefined;
  const currentTheme = isControlled ? controlledTheme : internalTheme;

  const setTheme = useCallback(
    (next: ThemeMode) => {
      if (!isControlled) setInternalTheme(next);
      onThemeChange?.(next);
    },
    [isControlled, onThemeChange]
  );

  const toggleTheme = useCallback(() => {
    setTheme(currentTheme === 'light' ? 'dark' : 'light');
  }, [currentTheme, setTheme]);

  // <html data-theme> 또는 wrapper에 적용 (scope="html"일 때만 html 조작)
  useEffect(() => {
    if (scope === 'html' && typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', currentTheme);
      return () => {
        // ThemeProvider가 unmount될 때 html 속성을 제거할 필요는 없음 — page life와 일치하므로 그대로 둠.
        // 단 클린업이 필요한 사용 케이스가 생기면 여기에서 removeAttribute 추가 검토.
      };
    }
  }, [scope, currentTheme]);

  // localStorage 기억
  useEffect(() => {
    if (persist && typeof window !== 'undefined') {
      localStorage.setItem(persistKey, currentTheme);
    }
  }, [persist, persistKey, currentTheme]);

  const contextValue: ThemeContextValue = useMemo(
    () => ({ theme: currentTheme, setTheme, toggleTheme }),
    [currentTheme, setTheme, toggleTheme]
  );

  if (scope === 'self') {
    return (
      <ThemeContext.Provider value={contextValue}>
        <div data-theme={currentTheme}>{children}</div>
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
  );
}
```

**작성 원칙:**
- React 18·19 공통 API만 (`useState`/`useEffect`/`useCallback`/`useMemo`/`useContext`/`createContext`).
- SSR-safe: `typeof document !== 'undefined'` / `typeof window !== 'undefined'` 가드 (Vite/Next 양쪽 호환).
- localStorage 키는 `'wonik-theme'`이 default — 사용자가 string 지정하면 override.
- AI 슬롭 anti-pattern 0.
- 새 hex/px 리터럴 0 (이 컴포넌트는 색·간격 사용 0 — DOM 속성만 조작).

### 6. `index.ts` (ThemeProvider 폴더)

```typescript
export { ThemeProvider } from './ThemeProvider';
export { useTheme } from './useTheme';
export type { ThemeProviderProps, ThemeMode, ThemeContextValue } from './types';
```

### 7. `packages/web/src/index.ts` 업데이트

기존 export 그대로 + ThemeProvider/useTheme 추가:

```typescript
// 기존 atoms / layout primitives / form atoms 그대로...

export { ThemeProvider, useTheme } from './ThemeProvider';
export type { ThemeProviderProps, ThemeMode, ThemeContextValue } from './ThemeProvider/types';
```

## Acceptance Criteria

```bash
cd C:/Users/ohjih/design_system

pnpm -F @wonik/web build          # 빌드 성공
pnpm -F @wonik/web test --run     # ThemeProvider 12+ 테스트 통과 + 기존 테스트 회귀 0

# 빌드 산출물 검증
test -f packages/web/dist/index.js
grep -q "ThemeProvider" packages/web/dist/index.js
grep -q "useTheme" packages/web/dist/index.js

# AI 슬롭 anti-pattern 0건
! grep -i -E "backdrop-filter|linear-gradient|box-shadow.*glow|rounded-2xl" packages/web/src/ThemeProvider/ThemeProvider.tsx

# 공개 표면에 ThemeProvider·useTheme 노출
grep -q "export { ThemeProvider, useTheme }" packages/web/src/index.ts

# React 19-only API 사용 0
! grep -E "useFormStatus|useOptimistic|use\(" packages/web/src/ThemeProvider/ThemeProvider.tsx

# hex/px 리터럴 0 (이 컴포넌트는 색·간격 안 다룸)
! grep -E "['\"]#[0-9A-Fa-f]{6}['\"]" packages/web/src/ThemeProvider/ThemeProvider.tsx
```

위 명령이 모두 통과해야 한다.

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 체크리스트:
   - TDD: `ThemeProvider.test.tsx`가 `ThemeProvider.tsx` 전에 작성됐나?
   - controlled + uncontrolled 둘 다 동작?
   - `scope="html"`이 `document.documentElement.dataset.theme` 정확히 설정?
   - `scope="self"`가 wrapper element 한정으로 동작?
   - `persist`로 localStorage 기억·복원?
   - `useTheme` hook이 Provider 외부에서 호출 시 명확한 에러?
   - 18·19 공통 API만 사용?
   - 회귀 없음: 기존 ~79개 테스트 모두 통과?
3. 결과에 따라 `phases/04-theme-tokens/index.json`의 step 2를 업데이트:
   - 성공 → `"status": "completed"`, `"summary": "@wonik/web ThemeProvider + useTheme 추가. controlled/uncontrolled, scope=html|self, localStorage persist 지원. <html data-theme> 토글로 step 0/1 인프라 활성화. 다음 step에서 sandbox에 토글 UI 붙여 6 atom × 2 theme 시각 검증."`
   - 실패 → `"status": "error"`, `"error_message": "구체 사유"`

## 금지사항

- **React 19-only API 금지** (`useFormStatus`/`useOptimistic`/`use()`/Compiler 자동 메모 등). 18에서도 동작해야.
- **CSS-in-JS 라이브러리 도입 금지.**
- **next-themes / styled-components ThemeProvider 같은 외부 lib 의존 금지** — 자체 구현.
- **`<html>` 외 element 변경 금지** (scope="html"일 때) — `document.body`나 `<head>` 조작 금지.
- **Snapshot test 금지.**
- **AI 슬롭 anti-pattern 금지.**
- **시스템 prefers-color-scheme 자동 감지 도입 금지** — 1단계는 명시적 토글만. system 자동 감지는 후속 phase의 일.
- **persist 기본값을 true로 만들지 마라** — opt-in이어야 함 (라이브러리 consumer의 명시적 결정).
- **컴포넌트(Button/Input/Box/Stack/Text/Textarea) 코드 수정 금지** — 이 step은 Provider만.
- **다른 패키지 폴더 만들지 마라.**
- **기존 테스트를 깨뜨리지 마라.**
