# Step 1: switch-primitive

## 읽어야 할 파일

- `/CLAUDE.md` (CRITICAL — 토큰 하드코딩 금지 + stateless + controlled/uncontrolled + React 18·19 dual peer)
- `/docs/UI_GUIDE.md`
- `/docs/ADR.md` 특히 ADR-009 (다크 모드)
- 이전 step 산출물:
  - `/packages/web/src/Checkbox/Checkbox.tsx` (boolean atom 패턴 — Switch는 시각만 다름)
  - `/packages/web/src/Checkbox/types.ts` (size 토큰 패턴)
  - `/packages/web/src/Input/Input.tsx`, `/packages/web/src/Textarea/Textarea.tsx` (forwardRef 패턴)
  - `/packages/tokens/src/colors.ts`, `/packages/tokens/src/spacing.ts`
  - `/packages/web/src/index.ts`

## 작업

`@wonik/web`에 **Switch** 컴포넌트를 추가한다. Switch는 **boolean toggle** — Checkbox와 의미적으로 동일(on/off)하지만 시각이 **pill-shaped 토글 슬라이더**다. native `<input type="checkbox" role="switch">`를 베이스로 하되 시각은 wrapper `<label>` + custom track/thumb로 구현 — `:checked` 가상 클래스 분기가 필요하므로 inline style만으로는 안 되고, 작은 inline `<style>` 블록을 컴포넌트 안에 함께 둔다.

이 step의 목적은 **"같은 boolean atom을 다른 시각 언어로 구현"** — 학습 포인트는 (1) Checkbox vs Switch는 보통 분리 컴포넌트 (Toss/Material/Radix 동일), (2) `:checked` 분기를 inline style로 못 풀 때의 대처 패턴 (scoped `<style>` 블록).

### 핵심 설계 결정

1. **`<label>` wrapper + visually-hidden `<input>` + 시각 `<span>`**: native input은 a11y와 form 통합을 위해 보존하되, 시각은 input을 hide(`opacity:0`/`absolute`)하고 옆 `<span>` element로 렌더링. label에 클릭 시 input.checked 토글이 native로 작동.
2. **scoped `<style>` 블록**: Switch.tsx 안에 `<style>{`...`}</style>`를 한 번만 렌더 (모듈 모듈 스코프 변수로 inject 1회 가드). `:checked` 분기를 위해 필요한 최소 CSS 4-5줄. 토큰은 `var(--color-primary)` 등으로 reference.
3. **size 3종 — sm/md/lg**: track 26×14 / 32×18 / 38×22 (Toss SLASH 스타일에 맞춰 가로:세로 약 1.7:1, 높이는 Checkbox와 통일감).
4. **invalid prop**: track border를 alarm 색으로. aria-invalid="true".
5. **forwardRef**: form 라이브러리 호환 — `<input>` 자체에 ref forward.
6. **`role="switch"` 자동 부착**: native checkbox에 ARIA role을 명시해 스크린리더가 "switch"로 인식.
7. **stateless**: hook 0. native `<input>`이 checked 처리.

### 1. 디렉토리 구조

```
packages/web/src/
├── (기존)
└── Switch/
    ├── Switch.tsx
    ├── Switch.test.tsx
    ├── types.ts
    └── index.ts
└── index.ts                      # Switch·SwitchProps·SwitchSize 추가
```

### 2. `types.ts` 시그니처

```typescript
import type { InputHTMLAttributes, Ref } from 'react';

export type SwitchSize = 'sm' | 'md' | 'lg';

export interface SwitchOwnProps {
  size?: SwitchSize;
  invalid?: boolean;
  ref?: Ref<HTMLInputElement>;
}

export interface SwitchProps
  extends SwitchOwnProps,
          Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {}
```

### 3. `Switch.test.tsx` (TDD — 먼저 작성)

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Switch } from './Switch';
import { useState } from 'react';

describe('Switch', () => {
  it('renders an input of type checkbox with role="switch"', () => {
    render(<Switch data-testid="s" />);
    const el = screen.getByTestId('s') as HTMLInputElement;
    expect(el.tagName).toBe('INPUT');
    expect(el.type).toBe('checkbox');
    expect(el).toHaveAttribute('role', 'switch');
  });

  it('uncontrolled — defaultChecked is honored', () => {
    render(<Switch defaultChecked data-testid="s" />);
    expect((screen.getByTestId('s') as HTMLInputElement).checked).toBe(true);
  });

  it('controlled — checked updates via consumer state', () => {
    function Wrapper() {
      const [v, setV] = useState(false);
      return <Switch checked={v} onChange={(e) => setV(e.target.checked)} data-testid="s" />;
    }
    render(<Wrapper />);
    const el = screen.getByTestId('s') as HTMLInputElement;
    fireEvent.click(el);
    expect(el.checked).toBe(true);
  });

  it('does not call onChange when disabled', () => {
    const onChange = vi.fn();
    render(<Switch disabled onChange={onChange} data-testid="s" />);
    fireEvent.click(screen.getByTestId('s'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('invalid=true sets aria-invalid="true"', () => {
    render(<Switch invalid data-testid="s" />);
    expect(screen.getByTestId('s')).toHaveAttribute('aria-invalid', 'true');
  });

  it('forwards native attributes (name, value)', () => {
    render(<Switch name="notify" value="on" data-testid="s" />);
    const el = screen.getByTestId('s');
    expect(el).toHaveAttribute('name', 'notify');
    expect(el).toHaveAttribute('value', 'on');
  });

  it('forwards ref to the underlying <input>', () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<Switch ref={ref} data-testid="s" />);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.type).toBe('checkbox');
  });

  it('size variants apply different widths to the track', () => {
    const { container, rerender } = render(<Switch size="sm" />);
    const trackSm = container.querySelector('span[data-switch-track]');
    const wSm = trackSm ? window.getComputedStyle(trackSm as Element).width : '';

    rerender(<Switch size="lg" />);
    const trackLg = container.querySelector('span[data-switch-track]');
    const wLg = trackLg ? window.getComputedStyle(trackLg as Element).width : '';

    expect(wSm).not.toBe(wLg);
  });

  it('renders inside a <label> wrapper for click-target inflation', () => {
    const { container } = render(<Switch data-testid="s" />);
    const input = screen.getByTestId('s');
    expect(input.closest('label')).not.toBeNull();
  });

  it('input is visually hidden (opacity:0 or position:absolute) but still focusable', () => {
    render(<Switch data-testid="s" />);
    const input = screen.getByTestId('s');
    const styles = window.getComputedStyle(input);
    // visually hidden 패턴 — opacity 0 또는 position absolute + clip
    const hidden = styles.opacity === '0' || styles.position === 'absolute';
    expect(hidden).toBe(true);
  });

  it('does not use AI slop visual decoration', () => {
    const { container } = render(<Switch />);
    const track = container.querySelector('span[data-switch-track]');
    if (track) {
      const styles = window.getComputedStyle(track as Element);
      expect(styles.backdropFilter || '').not.toMatch(/blur/);
      expect(styles.backgroundImage || '').not.toMatch(/gradient/);
      expect(styles.boxShadow || '').not.toMatch(/glow/i);
    }
  });

  it('uses token reference (var(--color-...)) in the track style', () => {
    const { container } = render(<Switch />);
    const track = container.querySelector('span[data-switch-track]');
    const styleAttr = track?.getAttribute('style') || '';
    expect(styleAttr).toMatch(/var\(--color-/);
  });
});
```

### 4. `Switch.tsx` 구현

```tsx
import { forwardRef } from 'react';
import type { CSSProperties } from 'react';
import { primary, surfaces, borders, statusTokens, radius } from '@wonik/tokens';
import type { SwitchProps, SwitchSize } from './types';

interface SizeSpec {
  trackW: string;
  trackH: string;
  thumbSize: string;
  thumbOffset: string;
  thumbTranslate: string;
}

const SIZE_SPEC: Record<SwitchSize, SizeSpec> = {
  sm: { trackW: '26px', trackH: '14px', thumbSize: '10px', thumbOffset: '2px', thumbTranslate: '12px' },
  md: { trackW: '32px', trackH: '18px', thumbSize: '14px', thumbOffset: '2px', thumbTranslate: '14px' },
  lg: { trackW: '38px', trackH: '22px', thumbSize: '18px', thumbOffset: '2px', thumbTranslate: '16px' },
};

// :checked 분기를 위한 작은 scoped CSS. 모듈 단위 1회 inject.
// .wonik-switch__input:checked + .wonik-switch__track { background: ...; border-color: ... }
// .wonik-switch__input:checked + .wonik-switch__track > .wonik-switch__thumb { transform: translateX(...) }
const SWITCH_CSS = `
.wonik-switch__input:checked + .wonik-switch__track {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}
.wonik-switch__input:checked + .wonik-switch__track > .wonik-switch__thumb {
  transform: var(--wonik-switch-thumb-translate, translateX(12px));
}
.wonik-switch__input:focus-visible + .wonik-switch__track {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
`;

let cssInjected = false;
function ensureCssInjected() {
  if (cssInjected || typeof document === 'undefined') return;
  const style = document.createElement('style');
  style.setAttribute('data-wonik-switch', 'true');
  style.textContent = SWITCH_CSS;
  document.head.appendChild(style);
  cssInjected = true;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { size = 'md', invalid = false, disabled, style, className, ...rest },
  ref
) {
  ensureCssInjected();
  const spec = SIZE_SPEC[size];

  const labelStyle: CSSProperties = {
    display:        'inline-block',
    position:       'relative',
    cursor:         disabled ? 'not-allowed' : 'pointer',
    opacity:        disabled ? 0.5 : 1,
    width:          spec.trackW,
    height:         spec.trackH,
    flexShrink:     0,
    verticalAlign:  'middle',
  };

  const inputStyle: CSSProperties = {
    position: 'absolute',
    opacity:  0,
    width:    '100%',
    height:   '100%',
    margin:   0,
    cursor:   disabled ? 'not-allowed' : 'pointer',
  };

  const trackStyle: CSSProperties = {
    display:         'block',
    width:           spec.trackW,
    height:          spec.trackH,
    background:      surfaces.surfaceMid,
    border:          `1px solid ${invalid ? statusTokens.alarm.text : borders.mid}`,
    borderRadius:    spec.trackH, // pill — 높이만큼 radius
    transition:      'background-color 0.15s ease, border-color 0.15s ease',
    position:        'relative',
    boxSizing:       'border-box',
    ['--wonik-switch-thumb-translate' as string]: `translateX(${spec.thumbTranslate})`,
  };

  const thumbStyle: CSSProperties = {
    position:   'absolute',
    top:        spec.thumbOffset,
    left:       spec.thumbOffset,
    width:      spec.thumbSize,
    height:     spec.thumbSize,
    background: surfaces.surfaceWhite,
    borderRadius: '50%',
    transition: 'transform 0.18s ease',
    transform:  'translateX(0)',
  };

  return (
    <label style={labelStyle} className={className}>
      <input
        ref={ref}
        type="checkbox"
        role="switch"
        disabled={disabled}
        aria-invalid={invalid || undefined}
        className="wonik-switch__input"
        style={inputStyle}
        {...rest}
      />
      <span data-switch-track className="wonik-switch__track" style={trackStyle}>
        <span data-switch-thumb className="wonik-switch__thumb" style={thumbStyle} />
      </span>
    </label>
  );
});
```

**작성 원칙:**
- `:checked` 분기는 inline style로 못 하므로 module-scoped `<style>` 1회 inject — 토큰 reference 유지(`var(--color-primary)`).
- 토큰만 사용 — `surfaces.surfaceMid`, `surfaces.surfaceWhite`, `primary.base` (CSS는 `var(--color-primary)`로), `borders.mid`, `statusTokens.alarm.text`.
- `forwardRef`로 native input 노출.
- `role="switch"` 명시 (a11y 표준).
- 18·19 공통 API.
- AI 슬롭 0.

### 5. `index.ts` (Switch 폴더)

```typescript
export { Switch } from './Switch';
export type { SwitchProps, SwitchOwnProps, SwitchSize } from './types';
```

### 6. `packages/web/src/index.ts` 업데이트

```typescript
// 기존 ...
export { Switch } from './Switch';
export type { SwitchProps, SwitchOwnProps, SwitchSize } from './Switch/types';
```

## Acceptance Criteria

```bash
cd C:/Users/ohjih/design_system

pnpm -F @wonik/web test --run     # Switch 테스트 + 기존 모두 통과
pnpm -F @wonik/web build          # 빌드 성공

# 빌드 산출물 검증
test -f packages/web/dist/index.js
grep -q "Switch" packages/web/dist/index.js

# 하드코딩 hex 금지
! grep -E "['\"]#[0-9A-Fa-f]{6}['\"]" packages/web/src/Switch/Switch.tsx

# AI 슬롭 anti-pattern 0건
! grep -i -E "backdrop-filter|linear-gradient|box-shadow.*glow|rounded-2xl" packages/web/src/Switch/Switch.tsx

# 공개 표면에 Switch 노출
grep -q "export { Switch }" packages/web/src/index.ts

# forwardRef 사용
grep -q "forwardRef" packages/web/src/Switch/Switch.tsx

# scoped CSS 안에 토큰 reference 사용
grep -q "var(--color-primary)" packages/web/src/Switch/Switch.tsx

# role="switch" 부착
grep -q 'role="switch"' packages/web/src/Switch/Switch.tsx

# React 19-only API 사용 0
! grep -E "useFormStatus|useOptimistic|use\(" packages/web/src/Switch/Switch.tsx
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 체크리스트:
   - TDD: `Switch.test.tsx`가 `Switch.tsx` 전에 작성됐나?
   - 토큰 hex 0건? (모두 reference)
   - `:checked` 분기 CSS가 module-scoped, 토큰 reference 유지?
   - `role="switch"` 부착?
   - controlled/uncontrolled 둘 다 동작?
   - `forwardRef`로 native input 노출?
   - 회귀 없음: 기존 테스트 통과?
3. 결과에 따라 `phases/05-form-atoms-2/index.json`의 step 1을 업데이트:
   - 성공 → `"status": "completed"`, `"summary": "@wonik/web Switch atom 추가. native checkbox + role=switch + label wrapper + visual track/thumb. :checked 분기를 위한 scoped CSS 1회 inject (토큰 reference). controlled/uncontrolled, forwardRef, 3 size, invalid·disabled. 다음 step에서 Radio가 native name 그룹으로."`
   - 실패 → `"status": "error"`, `"error_message": "구체 사유"`

## 금지사항

- **hex 리터럴 금지** — scoped CSS 안에서도 `var(--color-...)` reference만.
- **CSS-in-JS 라이브러리 도입 금지** (styled-components/emotion/stitches/vanilla-extract). 자체 1회 inject로 충분.
- **module CSS·import './Switch.css' 도입 금지** — 빌드 산출물이 dist에 CSS 파일을 만들면 consumer가 import 추가로 해야 한다. 1단계는 zero-import (단일 import만으로 동작).
- **Snapshot test 금지.**
- **AI 슬롭 anti-pattern 금지.**
- **React 19-only API 금지.**
- **internal `useState` 도입 금지** — controlled/uncontrolled는 native input.
- **Checkbox 코드 수정 금지** — Switch는 별도 컴포넌트로.
- **Stack/Box로 wrapping 금지** — Switch는 atom. 외부 spacing은 consumer 책임.
- **다른 패키지 폴더 만들지 마라.**
- **기존 테스트를 깨뜨리지 마라.**
