# Step 1: textarea-primitive

## 읽어야 할 파일

먼저 아래 파일을 읽고 Textarea가 Input과 어떻게 같고 어떻게 다른지 파악하라:

- `/CLAUDE.md` (CRITICAL — 토큰 하드코딩 금지 + stateless + controlled/uncontrolled + React 18·19 dual peer)
- `/docs/UI_GUIDE.md` (AI 슬롭 anti-pattern)
- 이전 step 산출물:
  - `/packages/web/src/Input/Input.tsx` (시그니처·focus·invalid·disabled·forwardRef 패턴 — Textarea의 reference)
  - `/packages/web/src/Input/types.ts` (`InputSize` 토큰)
  - `/packages/web/src/Input/Input.test.tsx` (테스트 스타일)
  - `/packages/web/src/index.ts` (공개 표면)
  - `/packages/tokens/src/spacing.ts`, `colors.ts`, `typography.ts`

## 작업

`@wonik/web`에 **Textarea** 컴포넌트를 추가한다. Textarea는 Input의 **multi-line variant** — 시각·상태·prop signature가 거의 동일하지만 element가 `<textarea>`이고 height가 row 수에 비례한다. 이 step의 목적은 **"같은 패턴을 element만 바꿔 재사용"**의 학습 — 무엇을 공유하고 무엇을 따로 두는지 판단.

**중요한 의사결정 포인트 (이번 step에서 명시적으로 한다):**

- Q: Textarea를 "Input의 multiline variant"로 합칠 것인가, 별도 컴포넌트로 둘 것인가?
- A: **별도 컴포넌트**로 둔다. 이유:
  1. HTML element가 다르다 (`<input>` vs `<textarea>`) — `type` prop으로 분기시키면 typescript상 native attr 차이가 강제로 통합돼 type 안전성이 약해진다.
  2. 자주 다른 prop을 받는다 (Textarea는 `rows`/`cols`/`autoResize?`, Input은 `type`/`pattern`/`autoComplete`).
  3. **Toss SLASH·Material·Radix 모두 별도**로 둔다.
- 단, **공통 prop 시그니처(size·invalid·leftAddon·rightAddon·forwardRef)와 시각 token은 Input과 1:1 매칭**한다 — 후속 step의 sandbox 데모에서 같은 시각 언어를 보장.

### 핵심 설계 결정 (왜 이렇게 만드는가)

1. **별도 컴포넌트, 공유는 `InputSize` 타입만 재사용** (별도 helper 모듈로 추상화하지 않는다 — premature abstraction).
2. **`rows` prop**: native `<textarea rows="..." />` 그대로 통과. 기본 4.
3. **`autoResize` prop은 1단계 외**: 자동 높이 조절은 hook 의존성이 생기고 SSR·resize observer 등 복잡성 증가. 1단계는 fixed `rows`만.
4. **`leftAddon`/`rightAddon`은 보류**: Textarea는 multi-line이라 좌·우 addon이 시각적으로 어색하다 (input과 다르게 vertical extent). 1단계는 noaddon, 후속 phase에서 footer-addon (예: 글자 수 카운터) 형태로 따로 도입 검토.
5. **height는 fixed가 아닌 `min-height`**: row 기반 자연 높이 + consumer override 가능.
6. **resize 사용자 제어 권한은 native default 유지**: `resize: vertical` (CSS) — 사용자가 textarea 모서리로 늘릴 수 있도록.
7. **forwardRef**: form 라이브러리 호환.
8. **stateless**: hook 0.

### 1. 디렉토리 구조

```
packages/web/src/
├── ... (기존 그대로)
└── Textarea/
    ├── Textarea.tsx
    ├── Textarea.test.tsx
    ├── types.ts
    └── index.ts
└── index.ts                      # Textarea·TextareaProps 추가
```

### 2. `types.ts` 시그니처

```typescript
import type { TextareaHTMLAttributes, Ref } from 'react';
import type { InputSize } from '../Input/types';

/** Textarea size — Input과 동일 토큰 (sm/md/lg). 시각 리듬 일치. */
export type TextareaSize = InputSize;

export interface TextareaOwnProps {
  /** size 토큰. 기본 'md'. */
  size?: TextareaSize;

  /** invalid 상태. true면 alarm 색 border + aria-invalid="true". */
  invalid?: boolean;

  /** native textarea ref. */
  ref?: Ref<HTMLTextAreaElement>;
}

export interface TextareaProps
  extends TextareaOwnProps,
          Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {}
```

### 3. `Textarea.test.tsx` (TDD — 먼저 작성)

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Textarea } from './Textarea';
import { useState } from 'react';

describe('Textarea', () => {
  it('renders a textarea element', () => {
    render(<Textarea data-testid="t" />);
    expect(screen.getByTestId('t').tagName).toBe('TEXTAREA');
  });

  it('uncontrolled — defaultValue is honored', () => {
    render(<Textarea defaultValue="multi\nline" data-testid="t" />);
    expect((screen.getByTestId('t') as HTMLTextAreaElement).value).toBe('multi\nline');
  });

  it('controlled — value updates via consumer state', () => {
    function Wrapper() {
      const [v, setV] = useState('');
      return <Textarea value={v} onChange={(e) => setV(e.target.value)} data-testid="t" />;
    }
    render(<Wrapper />);
    const el = screen.getByTestId('t') as HTMLTextAreaElement;
    fireEvent.change(el, { target: { value: 'typed multi\nline' } });
    expect(el.value).toBe('typed multi\nline');
  });

  it('does not call onChange when disabled', () => {
    const onChange = vi.fn();
    render(<Textarea disabled onChange={onChange} data-testid="t" />);
    fireEvent.change(screen.getByTestId('t'), { target: { value: 'x' } });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('invalid=true sets aria-invalid="true"', () => {
    render(<Textarea invalid data-testid="t" />);
    expect(screen.getByTestId('t')).toHaveAttribute('aria-invalid', 'true');
  });

  it('invalid=true applies alarm border (#CC0000)', () => {
    render(<Textarea invalid data-testid="t" />);
    const styles = window.getComputedStyle(screen.getByTestId('t'));
    expect(styles.borderColor.toLowerCase()).toMatch(/cc0000|rgb\(204, 0, 0\)/i);
  });

  it('passes through rows native attribute', () => {
    render(<Textarea rows={6} data-testid="t" />);
    expect(screen.getByTestId('t')).toHaveAttribute('rows', '6');
  });

  it('size variants apply different fontSize', () => {
    const { rerender } = render(<Textarea size="sm" data-testid="t" />);
    const sm = window.getComputedStyle(screen.getByTestId('t')).fontSize;
    rerender(<Textarea size="lg" data-testid="t" />);
    const lg = window.getComputedStyle(screen.getByTestId('t')).fontSize;
    expect(sm).not.toBe(lg);
  });

  it('forwards native textarea attributes (placeholder, name, autoComplete)', () => {
    render(
      <Textarea
        placeholder="message"
        name="message"
        autoComplete="off"
        data-testid="t"
      />
    );
    const el = screen.getByTestId('t');
    expect(el).toHaveAttribute('placeholder', 'message');
    expect(el).toHaveAttribute('name', 'message');
    expect(el).toHaveAttribute('autoComplete', 'off');
  });

  it('forwards ref to the underlying <textarea>', () => {
    const ref = { current: null as HTMLTextAreaElement | null };
    render(<Textarea ref={ref} data-testid="t" />);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('TEXTAREA');
  });

  it('uses fontFamily from tokens', () => {
    render(<Textarea data-testid="t" />);
    const ff = window.getComputedStyle(screen.getByTestId('t')).fontFamily || '';
    expect(ff.toLowerCase()).toContain('segoe ui');
  });

  it('does not use AI slop visual decoration', () => {
    render(<Textarea data-testid="t" />);
    const styles = window.getComputedStyle(screen.getByTestId('t'));
    expect(styles.backdropFilter || '').not.toMatch(/blur/);
    expect(styles.backgroundImage || '').not.toMatch(/gradient/);
    expect(styles.boxShadow || '').not.toMatch(/glow/i);
  });
});
```

### 4. `Textarea.tsx` 구현 (테스트 통과시키는 minimal 구현)

```tsx
import { forwardRef } from 'react';
import type { CSSProperties } from 'react';
import {
  surfaces,
  text,
  statusTokens,
  borders,
  space,
  radius,
  fontSize,
  fontFamily,
  fontWeight,
} from '@wonik/tokens';
import type { TextareaProps, TextareaSize } from './types';

const SIZE_FONT: Record<TextareaSize, string> = {
  sm: fontSize.labelSm,
  md: fontSize.label,
  lg: fontSize.titleSm,
};

const SIZE_PADDING: Record<TextareaSize, string> = {
  sm: `${space[2]} ${space[3]}`,
  md: `${space[3]} ${space[5]}`,
  lg: `${space[3]} ${space[6]}`,
};

const BASE_STYLE: CSSProperties = {
  fontFamily:   fontFamily.base,
  fontWeight:   fontWeight.regular,
  color:        text.dark,
  background:   surfaces.surfaceWhite,
  border:       `1px solid ${borders.mid}`,
  borderRadius: radius.sm,
  outline:      'none',
  width:        '100%',
  boxSizing:    'border-box',
  resize:       'vertical',
  lineHeight:   1.5,
  transition:   'border-color 0.12s ease, box-shadow 0.12s ease',
};

const INVALID_STYLE: CSSProperties = {
  borderColor: statusTokens.alarm.text,
};

const DISABLED_STYLE: CSSProperties = {
  background: surfaces.surfaceSubtle,
  color:      text.dim,
  cursor:     'not-allowed',
  opacity:    0.6,
  resize:     'none',
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { size = 'md', invalid = false, rows = 4, disabled, style, ...rest },
  ref
) {
  const composed: CSSProperties = {
    ...BASE_STYLE,
    fontSize: SIZE_FONT[size],
    padding:  SIZE_PADDING[size],
    ...(invalid && INVALID_STYLE),
    ...(disabled && DISABLED_STYLE),
    ...style,
  };

  return (
    <textarea
      ref={ref}
      rows={rows}
      disabled={disabled}
      aria-invalid={invalid || undefined}
      style={composed}
      {...rest}
    />
  );
});
```

**작성 원칙:**
- spacing·color·typography 모두 토큰. **hex 리터럴 금지.**
- `forwardRef` 사용 (form 라이브러리 호환).
- internal state 0 — native `<textarea>`가 처리.
- `resize: 'vertical'`은 사용자가 textarea 모서리를 vertical 방향으로만 늘리도록 허용. native default(`both`) 대신 명시적 vertical로 두는 게 form layout 안정성에 좋다.
- AI 슬롭 0.

### 5. `index.ts` (Textarea 폴더)

```typescript
export { Textarea } from './Textarea';
export type { TextareaProps, TextareaOwnProps, TextareaSize } from './types';
```

### 6. `packages/web/src/index.ts` 업데이트

```typescript
// 기존 export들...

export { Textarea } from './Textarea';
export type { TextareaProps, TextareaOwnProps, TextareaSize } from './Textarea/types';
```

## Acceptance Criteria

```bash
cd C:/Users/ohjih/design_system

pnpm -F @wonik/web test          # Button + Box + Stack + Text + Input + Textarea 통과
pnpm -F @wonik/web build         # 빌드 성공

# 빌드 산출물 검증
test -f packages/web/dist/index.js
test -f packages/web/dist/index.mjs
test -f packages/web/dist/index.d.ts

# 하드코딩 hex 금지
! grep -E "['\"]#[0-9A-Fa-f]{6}['\"]" packages/web/src/Textarea/Textarea.tsx

# AI 슬롭 anti-pattern 0건
! grep -i -E "backdrop-filter|linear-gradient|box-shadow.*glow|rounded-2xl" packages/web/src/Textarea/Textarea.tsx

# 공개 표면에 Textarea 노출
grep -q "export { Textarea }" packages/web/src/index.ts

# forwardRef 사용
grep -q "forwardRef" packages/web/src/Textarea/Textarea.tsx

# Input·기존 phase 회귀 0
pnpm -F @wonik/web test --run 2>&1 | grep -qE "Input|Button|Box|Stack|Text"
```

위 명령이 모두 통과해야 한다.

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 체크리스트:
   - TDD: `Textarea.test.tsx`가 `Textarea.tsx` 전에 작성됐나?
   - Input과 시각 언어 일치? (size 토큰·border·radius·font·color 모두 동일)
   - controlled/uncontrolled 둘 다 동작?
   - `forwardRef`로 native textarea 노출?
   - 회귀 없음: 기존 모든 컴포넌트 테스트 통과?
3. 결과에 따라 `phases/03-form-primitives/index.json`의 step 1을 업데이트:
   - 성공 → `"status": "completed"`, `"summary": "@wonik/web Textarea atom 추가. Input과 동일 size 토큰·시각 언어, multi-line element. controlled/uncontrolled 지원, forwardRef. autoResize·addon은 1단계 외. 다음 step에서 sandbox에 5 state × 3 size 매트릭스 시각 검증."`
   - 실패 → `"status": "error"`, `"error_message": "구체 사유"`

## 금지사항

- **hex 리터럴 금지** (모두 토큰).
- **autoResize 자동 높이 조절 도입 금지** — hook 의존성·SSR·resize observer 등 복잡도 비대비 가성비 낮음. 후속 phase 검토.
- **leftAddon/rightAddon prop 도입 금지** — multi-line element에 좌·우 addon은 시각 어색. footer addon으로 검토 시 별도 phase.
- **Input과 공통 helper 모듈 분리 금지** — premature abstraction. `InputSize` 타입 재사용으로 충분.
- **CSS-in-JS 라이브러리 도입 금지.**
- **internal state(`useState`) 도입 금지.**
- **Snapshot test 금지.**
- **AI 슬롭 anti-pattern 금지** (gradient/glass/glow shadow).
- **React 19-only API 금지.**
- **Input·다른 컴포넌트 코드 수정 금지** — Textarea 폴더 안에서만 작업. 단 `packages/web/src/index.ts`에 Textarea export 추가는 허용.
- **다른 패키지 폴더 만들지 마라.**
- **기존 테스트를 깨뜨리지 마라.**
