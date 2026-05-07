# Step 0: checkbox-primitive

## 읽어야 할 파일

먼저 아래 파일을 읽고 1단계 우선순위·기존 컴포넌트 패턴·토큰 reference 형태를 파악하라:

- `/CLAUDE.md` (CRITICAL — 토큰 하드코딩 금지 + stateless + controlled/uncontrolled + React 18·19 dual peer)
- `/docs/UI_GUIDE.md` (AI 슬롭 anti-pattern)
- `/docs/ADR.md` 특히 ADR-007 (WONIK BLUE), ADR-008 (React dual peer), ADR-009 (다크 모드 — 토큰은 var() reference)
- 이전 phase 산출물:
  - `/packages/tokens/src/colors.ts` (`primary.base = 'var(--color-primary)'` 등 reference 형태)
  - `/packages/tokens/src/status.ts` (`statusTokens.alarm.text = 'var(--color-status-alarm-text)'`)
  - `/packages/web/src/Input/Input.tsx` (forwardRef + invalid + controlled/uncontrolled 패턴 — 가장 가까운 reference)
  - `/packages/web/src/Input/types.ts` (size 토큰)
  - `/packages/web/src/Input/Input.test.tsx` (테스트 스타일 — controlled state 테스트, vitest setup의 jsdom CSS var 처리 참고)
  - `/packages/web/vitest.setup.ts` (CSS var inject 설정)
  - `/packages/web/src/index.ts` (공개 표면)

## 작업

`@wonik/web`에 **Checkbox** 컴포넌트를 추가한다. boolean state를 받는 form atom으로, Input과 같은 controlled/uncontrolled · forwardRef · invalid·disabled state · size 3종 패턴을 따른다. `<input type="checkbox">`를 native로 쓰되 `appearance: none`으로 시각을 토큰 기반으로 커스텀.

이 step의 목적은 **"boolean atom 1개가 토큰 시스템·React form 표준 위에서 정상 동작한다"**.

### 핵심 설계 결정

1. **native `<input type="checkbox">` + `appearance: none`**: wrapper `<label>` 없이 input 자체에 inline style 적용. 단순성 우선. checkmark 시각은 background-image (SVG data URL) 또는 ::after pseudo로 구현 — inline style로는 ::after가 어려우므로 **SVG data URL background**가 1단계 적합.
2. **size 3종 — sm/md/lg**: 16/20/24px (Input의 24/32/40과 다른 spec — checkbox는 일반적으로 input보다 작음). Button과 매핑되는 시각 리듬 보존.
3. **invalid prop**: `aria-invalid` HTML 표준 1:1, border 색을 alarm으로.
4. **`indeterminate`는 1단계 외**: tristate(`indeterminate`)는 native에서 JS로만 설정 가능 (`element.indeterminate = true`). hook + ref 필요해 복잡도 증가. "select all parent of partial children" 같은 use case가 등장하면 별도 step에서 추가.
5. **forwardRef**: form 라이브러리 호환.
6. **stateless**: hook 0. native `<input>`이 자기 checked state 처리.
7. **체크 시 토큰**: WONIK BLUE 배경 + 흰색 체크마크. SVG data URL은 hardcoded이지만 색은 `currentColor`로 두고 input의 `color` 속성을 토큰으로 — 이 경우엔 SVG inline data URL에 색을 넣는 게 가장 간단. **단 hex 직접 사용은 CLAUDE.md 위반**이므로, 다음 두 옵션 중 선택:
   - 옵션 A: `mask-image`로 체크마크 모양만 정의하고 `background-color`를 토큰으로 → 색은 토큰 reference 유지.
   - 옵션 B: SVG data URL에 흰색 hex 넣고 (`#FFFFFF`만 예외 허용) — surfaces.surfaceWhite와 일치하는 단순 흰색이라 디자인 시스템 변경 영향 0.
   - **본 step은 옵션 A 채택** — hex 0건 원칙 더 엄격히. `mask-image: url("data:image/svg+xml,...")` + `background-color: var(--color-surface-white)` 구조.

### 1. 디렉토리 구조

```
packages/web/src/
├── (기존)
└── Checkbox/
    ├── Checkbox.tsx
    ├── Checkbox.test.tsx
    ├── types.ts
    └── index.ts
└── index.ts                      # Checkbox·CheckboxProps·CheckboxSize 추가
```

### 2. `types.ts` 시그니처

```typescript
import type { InputHTMLAttributes, Ref } from 'react';

export type CheckboxSize = 'sm' | 'md' | 'lg';

export interface CheckboxOwnProps {
  /** size 토큰. 기본 'md'. */
  size?: CheckboxSize;

  /** invalid 상태 — true면 border가 alarm 색 + aria-invalid="true". */
  invalid?: boolean;

  /** native input ref. */
  ref?: Ref<HTMLInputElement>;
}

/**
 * native <input type="checkbox">의 모든 attr 통과 (checked, defaultChecked, onChange, name, value 등).
 * 단 type은 강제로 'checkbox' 고정 — consumer가 type 변경 못함.
 * size는 우리 prop이 우선.
 */
export interface CheckboxProps
  extends CheckboxOwnProps,
          Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {}
```

### 3. `Checkbox.test.tsx` (TDD — 먼저 작성)

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Checkbox } from './Checkbox';
import { useState } from 'react';

describe('Checkbox', () => {
  it('renders an input of type checkbox', () => {
    render(<Checkbox data-testid="c" />);
    const el = screen.getByTestId('c') as HTMLInputElement;
    expect(el.tagName).toBe('INPUT');
    expect(el.type).toBe('checkbox');
  });

  it('uncontrolled — defaultChecked is honored', () => {
    render(<Checkbox defaultChecked data-testid="c" />);
    expect((screen.getByTestId('c') as HTMLInputElement).checked).toBe(true);
  });

  it('uncontrolled — defaultChecked=false renders unchecked', () => {
    render(<Checkbox data-testid="c" />);
    expect((screen.getByTestId('c') as HTMLInputElement).checked).toBe(false);
  });

  it('controlled — checked updates via consumer state', () => {
    function Wrapper() {
      const [v, setV] = useState(false);
      return <Checkbox checked={v} onChange={(e) => setV(e.target.checked)} data-testid="c" />;
    }
    render(<Wrapper />);
    const el = screen.getByTestId('c') as HTMLInputElement;
    expect(el.checked).toBe(false);
    fireEvent.click(el);
    expect(el.checked).toBe(true);
  });

  it('does not call onChange when disabled', () => {
    const onChange = vi.fn();
    render(<Checkbox disabled onChange={onChange} data-testid="c" />);
    fireEvent.click(screen.getByTestId('c'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('invalid=true sets aria-invalid="true"', () => {
    render(<Checkbox invalid data-testid="c" />);
    expect(screen.getByTestId('c')).toHaveAttribute('aria-invalid', 'true');
  });

  it('size variants apply different dimensions', () => {
    const { rerender } = render(<Checkbox size="sm" data-testid="c" />);
    const sm = window.getComputedStyle(screen.getByTestId('c')).width;
    rerender(<Checkbox size="lg" data-testid="c" />);
    const lg = window.getComputedStyle(screen.getByTestId('c')).width;
    expect(sm).not.toBe(lg);
  });

  it('size="sm" renders 16x16', () => {
    render(<Checkbox size="sm" data-testid="c" />);
    const el = screen.getByTestId('c');
    expect(el).toHaveStyle({ width: '16px', height: '16px' });
  });

  it('size="md" (default) renders 20x20', () => {
    render(<Checkbox data-testid="c" />);
    const el = screen.getByTestId('c');
    expect(el).toHaveStyle({ width: '20px', height: '20px' });
  });

  it('size="lg" renders 24x24', () => {
    render(<Checkbox size="lg" data-testid="c" />);
    const el = screen.getByTestId('c');
    expect(el).toHaveStyle({ width: '24px', height: '24px' });
  });

  it('forwards native attributes (name, value, required)', () => {
    render(<Checkbox name="agree" value="yes" required data-testid="c" />);
    const el = screen.getByTestId('c');
    expect(el).toHaveAttribute('name', 'agree');
    expect(el).toHaveAttribute('value', 'yes');
    expect(el).toHaveAttribute('required');
  });

  it('forwards ref to the underlying <input>', () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<Checkbox ref={ref} data-testid="c" />);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.type).toBe('checkbox');
  });

  it('uses appearance:none to remove native rendering', () => {
    render(<Checkbox data-testid="c" />);
    const styles = window.getComputedStyle(screen.getByTestId('c'));
    expect(styles.appearance).toBe('none');
  });

  it('does not use AI slop visual decoration', () => {
    render(<Checkbox data-testid="c" />);
    const styles = window.getComputedStyle(screen.getByTestId('c'));
    expect(styles.backdropFilter || '').not.toMatch(/blur/);
    expect(styles.backgroundImage || '').not.toMatch(/gradient/);
    expect(styles.boxShadow || '').not.toMatch(/glow/i);
  });

  it('uses token reference for border (not hex literal)', () => {
    render(<Checkbox data-testid="c" />);
    const styleAttr = screen.getByTestId('c').getAttribute('style') || '';
    // 인라인 style에 var(--color-...) reference가 포함돼야 한다 (jsdom 25는 var() resolve 못 함)
    expect(styleAttr).toMatch(/var\(--color-/);
  });
});
```

### 4. `Checkbox.tsx` 구현

```tsx
import { forwardRef } from 'react';
import type { CSSProperties } from 'react';
import {
  primary,
  surfaces,
  borders,
  statusTokens,
  radius,
} from '@wonik/tokens';
import type { CheckboxProps, CheckboxSize } from './types';

const SIZE_PX: Record<CheckboxSize, string> = {
  sm: '16px',
  md: '20px',
  lg: '24px',
};

// 체크마크 SVG — currentColor 사용을 위해 mask-image 패턴.
// stroke로 V 모양만 그림. width/height 100%로 박스 전체 채움.
const CHECK_MASK =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='none' stroke='black' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' d='M3.5 8.5l3 3 6-6'/%3E%3C/svg%3E\")";

const BASE_STYLE: CSSProperties = {
  appearance:        'none',
  WebkitAppearance:  'none',
  margin:            0,
  background:        surfaces.surfaceWhite,
  border:            `1px solid ${borders.mid}`,
  borderRadius:      radius.sm,
  cursor:            'pointer',
  flexShrink:        0,
  display:           'inline-block',
  position:          'relative',
  transition:        'background-color 0.12s ease, border-color 0.12s ease',
};

// :checked 가상 클래스를 inline style로는 못 쓰므로,
// background-image의 mask + background-color 조합을 분기 적용.
// 단 inline style은 :checked selector가 없으므로,
// "checked일 때 시각" 분기는 input.checked를 React에서 알아서 prop으로 결정 — 단 controlled에서만.
// 우회: native :checked 분기를 inline style로 못 하므로 보조 wrapper element 또는 외부 stylesheet 필요.
//
// 본 구현 전략: native :checked는 "currentColor"를 활용한 mask 색상 변화 + accent-color로 처리.
// 그러나 accent-color 만으로는 fill color만 바뀌고 체크 vs 미체크 분기가 불완전.
//
// 가장 단순한 1단계 대안: inline `<style>` 태그를 한 번만 head에 inject해
// .wonik-checkbox:checked { background-color: ...; mask-image: ... } 같은 :checked 선택자 정의.
// 이 패턴은 이미 vitest.setup.ts와 비슷 (CSS inject).
//
// 단 본 step의 단순성을 우선해, accent-color로 native 체크 색만 토큰으로 바꾸고
// 시각 디테일(체크마크 mask 등)은 후속 polish phase로 미룬다.
//
// **결정**: 1단계 Checkbox는 `accent-color: var(--color-primary)`로 native checkbox를
// 시스템 default UI(브라우저 native)에서 색만 토큰화. appearance:none을 안 쓴다.
// "appearance:none + 커스텀 mask" 풀 커스텀은 후속 phase의 polish 작업.

const INVALID_STYLE: CSSProperties = {
  borderColor: statusTokens.alarm.text,
  outline:     `2px solid ${statusTokens.alarm.text}`,
  outlineOffset: '0px',
};

const DISABLED_STYLE: CSSProperties = {
  cursor:  'not-allowed',
  opacity: 0.5,
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { size = 'md', invalid = false, disabled, style, ...rest },
  ref
) {
  const composed: CSSProperties = {
    ...BASE_STYLE,
    width:  SIZE_PX[size],
    height: SIZE_PX[size],
    accentColor: primary.base, // native checkbox 체크 색을 WONIK BLUE로
    ...(invalid && INVALID_STYLE),
    ...(disabled && DISABLED_STYLE),
    ...style,
  };

  return (
    <input
      ref={ref}
      type="checkbox"
      disabled={disabled}
      aria-invalid={invalid || undefined}
      style={composed}
      {...rest}
    />
  );
});
```

**구현 주석 — 1단계 단순화 결정:**

위 구현은 **`appearance: none` 풀 커스텀이 아니라 `accent-color`로 native checkbox 색만 토큰화**한 형태다. 이유:

- inline style로는 `:checked` 가상 클래스 분기를 못 한다 → mask-image 시각을 inline으로 못 푼다.
- 풀 커스텀하려면 외부 stylesheet 또는 `<style>` head inject가 필요해 1단계 단순성을 깬다.
- `accent-color` (CSS standard, 모든 모던 브라우저 지원)는 native checkbox의 체크 색을 토큰 한 줄로 바꿔준다 — 토큰 일관성을 가장 적은 비용으로 달성.

따라서 본 step의 BASE_STYLE은 `appearance: 'none'` 대신 `accentColor: primary.base`만 적용한다. 위 코드의 BASE_STYLE에서 `appearance: 'none'`/`WebkitAppearance: 'none'`/`background`/`border` 부분을 제거하고, 단순히 `cursor: 'pointer'`/`margin: 0`/`flexShrink: 0`/`accentColor: ...` 정도로만 둔다.

**최종 BASE_STYLE 형태**:

```typescript
const BASE_STYLE: CSSProperties = {
  margin:      0,
  cursor:      'pointer',
  flexShrink:  0,
  accentColor: primary.base,   // var(--color-primary)
};
```

테스트의 `appearance: 'none'` 검증은 그대로 — accent-color 적용 여부와 무관하게 시각 native가 보존되도록 의도. 단 그 테스트는 **삭제**하고, 대신 `accentColor`가 token reference인지 검증하는 테스트로 대체:

```typescript
it('uses accentColor token for native check color', () => {
  render(<Checkbox data-testid="c" />);
  const styleAttr = screen.getByTestId('c').getAttribute('style') || '';
  expect(styleAttr).toMatch(/accent-color:\s*var\(--color-primary\)/);
});
```

테스트 #16("uses appearance:none ...") 자체를 위 테스트로 교체. 다른 테스트는 그대로 유효.

### 5. `index.ts` (Checkbox 폴더)

```typescript
export { Checkbox } from './Checkbox';
export type { CheckboxProps, CheckboxOwnProps, CheckboxSize } from './types';
```

### 6. `packages/web/src/index.ts` 업데이트

```typescript
// 기존 export들 그대로 ...

export { Checkbox } from './Checkbox';
export type { CheckboxProps, CheckboxOwnProps, CheckboxSize } from './Checkbox/types';
```

## Acceptance Criteria

```bash
cd C:/Users/ohjih/design_system

pnpm -F @wonik/web test --run     # Checkbox 테스트 + 기존 91개 모두 통과
pnpm -F @wonik/web build          # 빌드 성공

# 빌드 산출물 검증
test -f packages/web/dist/index.js
grep -q "Checkbox" packages/web/dist/index.js

# 하드코딩 hex 금지 (단 SVG mask-image 안의 color="black" 같은 단순 모양 정의는 예외 고려 — 단 1단계 단순화로 mask-image 자체를 안 씀)
! grep -E "['\"]#[0-9A-Fa-f]{6}['\"]" packages/web/src/Checkbox/Checkbox.tsx

# AI 슬롭 anti-pattern 0건
! grep -i -E "backdrop-filter|linear-gradient|box-shadow.*glow|rounded-2xl" packages/web/src/Checkbox/Checkbox.tsx

# 공개 표면에 Checkbox 노출
grep -q "export { Checkbox }" packages/web/src/index.ts

# forwardRef 사용
grep -q "forwardRef" packages/web/src/Checkbox/Checkbox.tsx

# accent-color 토큰 reference 사용
grep -q "accentColor: primary.base" packages/web/src/Checkbox/Checkbox.tsx || grep -q "accent-color" packages/web/src/Checkbox/Checkbox.tsx

# React 19-only API 사용 0
! grep -E "useFormStatus|useOptimistic|use\(" packages/web/src/Checkbox/Checkbox.tsx
```

위 명령이 모두 통과해야 한다.

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 체크리스트:
   - TDD: `Checkbox.test.tsx`가 `Checkbox.tsx` 전에 작성됐나?
   - 토큰 hex 0건? (`accentColor`도 토큰 reference)
   - controlled + uncontrolled 둘 다 동작?
   - `invalid` prop이 `aria-invalid` 표준 매칭?
   - `forwardRef`로 native input 노출?
   - 18·19 공통 API만?
   - 회귀 없음: 기존 91개 테스트 통과?
3. 결과에 따라 `phases/05-form-atoms-2/index.json`의 step 0을 업데이트:
   - 성공 → `"status": "completed"`, `"summary": "@wonik/web Checkbox atom 추가. native <input type=checkbox> + accent-color로 토큰화된 체크 색. controlled/uncontrolled 지원, forwardRef, 3 size, invalid·disabled state. 풀 커스텀(:checked mask) 시각은 후속 polish로 보류 — 1단계 단순성 우선. 다음 step에서 Switch가 같은 boolean 패턴을 다른 시각으로."`
   - 실패 → `"status": "error"`, `"error_message": "구체 사유"`

## 금지사항

- **hex 리터럴 금지** — `accentColor`도 토큰 reference (`primary.base`).
- **`appearance: none` + 풀 커스텀 시각 도입 금지** — inline style로는 `:checked` 가상 클래스 분기를 못해 mask-image 시각이 깨짐. 1단계는 `accent-color`만으로 단순화. 풀 커스텀은 후속 polish phase의 일.
- **외부 stylesheet 또는 `<style>` head inject 도입 금지** — sandbox에 한해 inject는 허용 가능하지만 컴포넌트 패키지는 inline style 원칙 유지.
- **indeterminate state prop 도입 금지** — 1단계 외. tristate(`indeterminate`)는 native에서 ref + JS로 설정 — hook 의존성·복잡도 증가. "select all" 같은 use case 등장 시 별도 step.
- **internal `useState`/`useReducer` 도입 금지** — controlled/uncontrolled는 native `<input>`이 처리.
- **CSS-in-JS 라이브러리 도입 금지.**
- **Snapshot test 금지.**
- **AI 슬롭 anti-pattern 금지** (backdrop-filter / gradient / glow / rounded-2xl).
- **React 19-only API 금지.**
- **label·helperText·errorText prop 도입 금지** — pure atom. composition은 후속 FormField phase.
- **다른 패키지 폴더 만들지 마라.**
- **기존 docs/CLAUDE.md/scripts/execute.py 또는 기존 컴포넌트 코드 수정 금지** — 단 `packages/web/src/index.ts`에 Checkbox export 추가는 허용.
- **기존 테스트를 깨뜨리지 마라.**
