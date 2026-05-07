# Step 2: radio-primitive

## 읽어야 할 파일

- `/CLAUDE.md` (CRITICAL)
- `/docs/UI_GUIDE.md`, `/docs/ADR.md` (특히 ADR-009)
- 이전 step 산출물:
  - `/packages/web/src/Checkbox/Checkbox.tsx` (가장 가까운 reference — accent-color 단순화 패턴)
  - `/packages/web/src/Checkbox/types.ts`, `/packages/web/src/Checkbox/Checkbox.test.tsx`
  - `/packages/web/src/Switch/Switch.tsx` (시각 풀 커스텀 시 scoped CSS inject 패턴 — Radio도 동일 옵션 가능)
  - `/packages/web/src/index.ts`
  - `/packages/tokens/src/colors.ts`

## 작업

`@wonik/web`에 **Radio** 컴포넌트를 추가한다. native `<input type="radio">`를 베이스로 하며, **그룹화는 native `name` 속성**으로 처리(브라우저가 같은 name의 radio들 중 1개만 선택 보장). RadioGroup composition은 본 step 외 — 별도 phase에서 다룬다 (FormField/composition 영역).

이 step의 목적은 **"Radio atom 1개가 native name 그룹으로 정상 동작 + 토큰화"**.

### 핵심 설계 결정

1. **native `<input type="radio">` + `accent-color`**: Checkbox와 동일 단순화 — `:checked` 분기 풀 커스텀은 보류, native UI를 토큰 색으로 바꾼다.
2. **그룹화는 `name` prop으로**: `<Radio name="size" value="sm" />`, `<Radio name="size" value="md" defaultChecked />`. 브라우저가 자동으로 같은 name의 radio들 중 1개만 selected.
3. **`RadioGroup` 컴포넌트는 1단계 외**: Context 기반 composition은 후속 phase. 1단계는 Radio atom만.
4. **size 3종 — sm/md/lg**: 16/20/24px (Checkbox와 동일 spec). 시각 리듬 통일.
5. **invalid prop**: `aria-invalid`. 단 invalid radio는 보통 group 단위라 individual radio에 적용은 비-표준. 1단계는 그래도 prop 시그니처 일치를 위해 제공하되 시각만 (border 색만 alarm으로). 추후 RadioGroup이 그룹 단위 invalid로 흡수.
6. **forwardRef**: form 라이브러리 호환.
7. **stateless**.

### 1. 디렉토리 구조

```
packages/web/src/
├── (기존)
└── Radio/
    ├── Radio.tsx
    ├── Radio.test.tsx
    ├── types.ts
    └── index.ts
└── index.ts                      # Radio·RadioProps·RadioSize 추가
```

### 2. `types.ts` 시그니처

```typescript
import type { InputHTMLAttributes, Ref } from 'react';

export type RadioSize = 'sm' | 'md' | 'lg';

export interface RadioOwnProps {
  size?: RadioSize;
  invalid?: boolean;
  ref?: Ref<HTMLInputElement>;
}

/**
 * Native <input type="radio">의 attr 통과 (name·value·checked·defaultChecked·onChange·required 등).
 * 그룹화는 같은 name 속성을 공유하면 브라우저가 자동 처리.
 */
export interface RadioProps
  extends RadioOwnProps,
          Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {}
```

### 3. `Radio.test.tsx` (TDD — 먼저 작성)

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Radio } from './Radio';
import { useState } from 'react';

describe('Radio', () => {
  it('renders an input of type radio', () => {
    render(<Radio data-testid="r" />);
    const el = screen.getByTestId('r') as HTMLInputElement;
    expect(el.tagName).toBe('INPUT');
    expect(el.type).toBe('radio');
  });

  it('uncontrolled — defaultChecked is honored', () => {
    render(<Radio defaultChecked data-testid="r" />);
    expect((screen.getByTestId('r') as HTMLInputElement).checked).toBe(true);
  });

  it('controlled — checked updates via consumer state', () => {
    function Wrapper() {
      const [v, setV] = useState('a');
      return (
        <>
          <Radio name="g" value="a" checked={v === 'a'} onChange={() => setV('a')} data-testid="ra" />
          <Radio name="g" value="b" checked={v === 'b'} onChange={() => setV('b')} data-testid="rb" />
        </>
      );
    }
    render(<Wrapper />);
    expect((screen.getByTestId('ra') as HTMLInputElement).checked).toBe(true);
    fireEvent.click(screen.getByTestId('rb'));
    expect((screen.getByTestId('rb') as HTMLInputElement).checked).toBe(true);
    expect((screen.getByTestId('ra') as HTMLInputElement).checked).toBe(false);
  });

  it('does not call onChange when disabled', () => {
    const onChange = vi.fn();
    render(<Radio disabled onChange={onChange} data-testid="r" />);
    fireEvent.click(screen.getByTestId('r'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('native grouping by name — only one selected at a time (uncontrolled)', () => {
    render(
      <>
        <Radio name="g" value="a" data-testid="ra" />
        <Radio name="g" value="b" data-testid="rb" />
        <Radio name="g" value="c" data-testid="rc" />
      </>
    );
    fireEvent.click(screen.getByTestId('rb'));
    expect((screen.getByTestId('rb') as HTMLInputElement).checked).toBe(true);
    expect((screen.getByTestId('ra') as HTMLInputElement).checked).toBe(false);
    expect((screen.getByTestId('rc') as HTMLInputElement).checked).toBe(false);

    fireEvent.click(screen.getByTestId('rc'));
    expect((screen.getByTestId('rc') as HTMLInputElement).checked).toBe(true);
    expect((screen.getByTestId('rb') as HTMLInputElement).checked).toBe(false);
  });

  it('invalid=true sets aria-invalid="true"', () => {
    render(<Radio invalid data-testid="r" />);
    expect(screen.getByTestId('r')).toHaveAttribute('aria-invalid', 'true');
  });

  it('size variants apply different dimensions', () => {
    const { rerender } = render(<Radio size="sm" data-testid="r" />);
    const sm = window.getComputedStyle(screen.getByTestId('r')).width;
    rerender(<Radio size="lg" data-testid="r" />);
    const lg = window.getComputedStyle(screen.getByTestId('r')).width;
    expect(sm).not.toBe(lg);
  });

  it('size="sm" renders 16x16', () => {
    render(<Radio size="sm" data-testid="r" />);
    const el = screen.getByTestId('r');
    expect(el).toHaveStyle({ width: '16px', height: '16px' });
  });

  it('size="md" (default) renders 20x20', () => {
    render(<Radio data-testid="r" />);
    const el = screen.getByTestId('r');
    expect(el).toHaveStyle({ width: '20px', height: '20px' });
  });

  it('size="lg" renders 24x24', () => {
    render(<Radio size="lg" data-testid="r" />);
    const el = screen.getByTestId('r');
    expect(el).toHaveStyle({ width: '24px', height: '24px' });
  });

  it('forwards native attributes (name, value, required)', () => {
    render(<Radio name="size" value="sm" required data-testid="r" />);
    const el = screen.getByTestId('r');
    expect(el).toHaveAttribute('name', 'size');
    expect(el).toHaveAttribute('value', 'sm');
    expect(el).toHaveAttribute('required');
  });

  it('forwards ref to the underlying <input>', () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<Radio ref={ref} data-testid="r" />);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.type).toBe('radio');
  });

  it('uses accentColor token for native check color', () => {
    render(<Radio data-testid="r" />);
    const styleAttr = screen.getByTestId('r').getAttribute('style') || '';
    expect(styleAttr).toMatch(/accent-color:\s*var\(--color-primary\)/);
  });

  it('does not use AI slop visual decoration', () => {
    render(<Radio data-testid="r" />);
    const styles = window.getComputedStyle(screen.getByTestId('r'));
    expect(styles.backdropFilter || '').not.toMatch(/blur/);
    expect(styles.backgroundImage || '').not.toMatch(/gradient/);
    expect(styles.boxShadow || '').not.toMatch(/glow/i);
  });
});
```

### 4. `Radio.tsx` 구현

```tsx
import { forwardRef } from 'react';
import type { CSSProperties } from 'react';
import { primary, statusTokens } from '@wonik/tokens';
import type { RadioProps, RadioSize } from './types';

const SIZE_PX: Record<RadioSize, string> = {
  sm: '16px',
  md: '20px',
  lg: '24px',
};

const BASE_STYLE: CSSProperties = {
  margin:      0,
  cursor:      'pointer',
  flexShrink:  0,
  accentColor: primary.base, // var(--color-primary) — native radio dot 색
};

const INVALID_STYLE: CSSProperties = {
  outline:       `2px solid ${statusTokens.alarm.text}`,
  outlineOffset: '0px',
  borderRadius:  '50%',
};

const DISABLED_STYLE: CSSProperties = {
  cursor:  'not-allowed',
  opacity: 0.5,
};

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { size = 'md', invalid = false, disabled, style, ...rest },
  ref
) {
  const composed: CSSProperties = {
    ...BASE_STYLE,
    width:  SIZE_PX[size],
    height: SIZE_PX[size],
    ...(invalid && INVALID_STYLE),
    ...(disabled && DISABLED_STYLE),
    ...style,
  };

  return (
    <input
      ref={ref}
      type="radio"
      disabled={disabled}
      aria-invalid={invalid || undefined}
      style={composed}
      {...rest}
    />
  );
});
```

**작성 원칙:**
- 토큰 reference만. hex 0.
- Checkbox와 같은 simplification 전략(`accent-color`).
- forwardRef, native input.
- AI 슬롭 0.

### 5. `index.ts` (Radio 폴더)

```typescript
export { Radio } from './Radio';
export type { RadioProps, RadioOwnProps, RadioSize } from './types';
```

### 6. `packages/web/src/index.ts` 업데이트

```typescript
// 기존 ...
export { Radio } from './Radio';
export type { RadioProps, RadioOwnProps, RadioSize } from './Radio/types';
```

## Acceptance Criteria

```bash
cd C:/Users/ohjih/design_system

pnpm -F @wonik/web test --run     # Radio + 기존 통과
pnpm -F @wonik/web build

test -f packages/web/dist/index.js
grep -q "Radio" packages/web/dist/index.js

! grep -E "['\"]#[0-9A-Fa-f]{6}['\"]" packages/web/src/Radio/Radio.tsx

! grep -i -E "backdrop-filter|linear-gradient|box-shadow.*glow|rounded-2xl" packages/web/src/Radio/Radio.tsx

grep -q "export { Radio }" packages/web/src/index.ts
grep -q "forwardRef" packages/web/src/Radio/Radio.tsx
grep -q "accentColor: primary.base" packages/web/src/Radio/Radio.tsx
! grep -E "useFormStatus|useOptimistic|use\(" packages/web/src/Radio/Radio.tsx
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 체크리스트:
   - TDD: 테스트 먼저?
   - 토큰 hex 0건?
   - native name 그룹이 정상 동작? (테스트가 검증)
   - controlled/uncontrolled 둘 다?
   - forwardRef로 native input 노출?
   - 회귀 없음?
3. 결과에 따라 `phases/05-form-atoms-2/index.json`의 step 2를 업데이트:
   - 성공 → `"status": "completed"`, `"summary": "@wonik/web Radio atom 추가. native input type=radio + name 속성 그룹화. accent-color로 토큰화. controlled/uncontrolled, forwardRef, 3 size, invalid·disabled. RadioGroup composition은 후속 phase. 다음 step에서 sandbox에 Checkbox·Switch·Radio 시각 매트릭스 + 폼 데모."`
   - 실패 → `"status": "error"`, `"error_message": "구체 사유"`

## 금지사항

- **RadioGroup composition 컴포넌트 만들지 마라** — 1단계 atom만. group은 native name 속성으로.
- **hex 리터럴 금지.**
- **CSS-in-JS 라이브러리 도입 금지.**
- **`appearance: none` + 풀 커스텀 시각 도입 금지** — Checkbox와 동일 단순화 (`accent-color`).
- **Snapshot test 금지.**
- **AI 슬롭 anti-pattern 금지.**
- **React 19-only API 금지.**
- **internal `useState` 도입 금지.**
- **Checkbox·Switch 코드 수정 금지** — Radio 폴더 안에서만.
- **다른 패키지 폴더 만들지 마라.**
- **기존 테스트를 깨뜨리지 마라.**
