# Step 0: input-primitive

## 읽어야 할 파일

먼저 아래 파일을 읽고 1단계 우선순위·기존 컴포넌트 패턴·토큰 구조를 파악하라:

- `/CLAUDE.md` (CRITICAL — 토큰 하드코딩 금지 + stateless 우선 + controlled/uncontrolled 둘 다 지원 + React 18·19 dual peer)
- `/docs/UI_GUIDE.md` (AI 슬롭 anti-pattern, Input 시각 명세 후보)
- 이전 phase 산출물:
  - `/packages/tokens/src/colors.ts` (`primary.base`, `text.*`, `borders.*`, `surfaces.*`, status `alarm.text`/`alarm.border`)
  - `/packages/tokens/src/spacing.ts` (`space[1..8]`, `radius`)
  - `/packages/tokens/src/typography.ts` (`fontSize`, `fontWeight`, `fontFamily`)
  - `/packages/web/src/Button/Button.tsx` (size 24/32/40px 패턴, inline style + 토큰 import)
  - `/packages/web/src/Box/Box.tsx`, `/packages/web/src/Stack/Stack.tsx`, `/packages/web/src/Text/Text.tsx` (polymorphic·token-driven 패턴)
  - `/packages/web/src/index.ts` (공개 표면)

## 작업

`@wonik/web`에 **첫 번째 form atom인 `Input`** 을 추가한다. Input은 지금까지 만든 stateless 시각 요소(Button/Box/Stack/Text)와 다르게 **상태가 있는 atom** — controlled (`value` + `onChange`)와 uncontrolled (`defaultValue`) 둘 다 지원해야 하며, 시각 state가 5개(default/hover/focus/invalid/disabled)이다. 이 step의 목적은 "텍스트 입력 atom 1개가 토큰 시스템과 React form 표준 위에서 정상 동작한다"를 가장 작은 단위로 증명하는 것.

**중요 — Input은 *순수 atom*이다.** label·helperText·errorText 같은 composition은 별도 phase(FormField)에서 처리한다. 이번 step은 `<input>` 박스 그 자체만 — 토큰 적용·5 state·size 3종·controlled/uncontrolled·native attr forwarding.

### 핵심 설계 결정 (왜 이렇게 만드는가)

1. **Pure atom**: label·helper·error 텍스트 출력 책임 없음. 단일 책임 원칙 — 그건 후속 FormField 컴포넌트에서. Radix·Headless UI 동일 접근.
2. **Controlled + uncontrolled 둘 다**: React 표준대로 `value`/`defaultValue`를 둘 다 받는다. consumer가 form 라이브러리(`react-hook-form`/`formik`/...) 아무거나 쓸 수 있어야 한다 (CLAUDE.md "consumer가 자유롭게 선택").
3. **`invalid` boolean prop** (`error` 아님): HTML 표준 `aria-invalid`와 1:1 매칭되도록 명명. 이 prop이 true면 (a) border 색이 alarm으로 바뀌고 (b) `aria-invalid="true"` 자동 설정. 메시지 텍스트 출력은 책임지지 않음.
4. **size = 'sm' | 'md' | 'lg'**, height 24/32/40px — Button과 동일 size system (시각 리듬 통일).
5. **`leftAddon` / `rightAddon` prop**: ReactNode를 받아 입력 박스 좌·우에 붙인다. 검색 icon, 단위 표시(`$`), 비밀번호 reveal 등 **흔한 패턴**을 미리 노출. Icon 컴포넌트가 아직 없어도 string·`<Text>$</Text>` 같은 임시 콘텐츠로 사용 가능. 추후 Icon 추가 시 자연스럽게 연결.
6. **forwardRef**: form 라이브러리들이 ref를 통해 `<input>`에 직접 접근(`focus()`, `select()`, `validity`)하는 게 표준이다. React 18·19 공통 API.
7. **stateless component, but stateful element**: 컴포넌트 자체는 internal `useState` 0 — `<input>`이 알아서 자기 값을 들고 있거나(uncontrolled) consumer가 들고 있다(controlled). hook 사용 0.
8. **focus ring은 토큰 기반 box-shadow 1개로**: WONIK BLUE의 옅은 그림자 (`primary.bg` 또는 `primary.stroke` 활용). AI 슬롭 glow는 금지.

### 1. 디렉토리 구조

```
packages/web/src/
├── Button/                       # 그대로
├── Box/                          # 그대로
├── Stack/                        # 그대로
├── Text/                         # 그대로
└── Input/
    ├── Input.tsx
    ├── Input.test.tsx
    ├── types.ts
    └── index.ts
└── index.ts                      # Input·InputProps·InputSize 추가
```

### 2. `types.ts` 시그니처

```typescript
import type { InputHTMLAttributes, ReactNode, Ref } from 'react';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputOwnProps {
  /** size 토큰 — Button과 동일 system. 기본 'md'. */
  size?: InputSize;

  /** invalid 상태 — true면 border가 alarm 색으로, aria-invalid="true" 자동 설정. */
  invalid?: boolean;

  /** 입력 박스 좌측 부착 콘텐츠 (icon, prefix 등). ReactNode. */
  leftAddon?: ReactNode;

  /** 입력 박스 우측 부착 콘텐츠 (clear button, unit, password reveal 등). ReactNode. */
  rightAddon?: ReactNode;

  /** native input ref 노출 — focus()/select()/validity 등 form 라이브러리용. */
  ref?: Ref<HTMLInputElement>;
}

/**
 * Input은 native <input>의 모든 attr을 통과시키되, size는 우리 prop이 우선.
 * (HTML의 native size attr은 거의 안 쓰이므로 충돌 무시)
 */
export interface InputProps
  extends InputOwnProps,
          Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {}
```

### 3. `Input.test.tsx` (TDD — 먼저 작성)

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from './Input';
import { useState } from 'react';

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input data-testid="i" />);
    expect(screen.getByTestId('i').tagName).toBe('INPUT');
  });

  it('uncontrolled — defaultValue is honored', () => {
    render(<Input defaultValue="hello" data-testid="i" />);
    expect((screen.getByTestId('i') as HTMLInputElement).value).toBe('hello');
  });

  it('controlled — value updates via consumer state', () => {
    function Wrapper() {
      const [v, setV] = useState('');
      return <Input value={v} onChange={(e) => setV(e.target.value)} data-testid="i" />;
    }
    render(<Wrapper />);
    const input = screen.getByTestId('i') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'typed' } });
    expect(input.value).toBe('typed');
  });

  it('does not call onChange when disabled', () => {
    const onChange = vi.fn();
    render(<Input disabled onChange={onChange} data-testid="i" />);
    fireEvent.change(screen.getByTestId('i'), { target: { value: 'x' } });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('invalid=true sets aria-invalid="true"', () => {
    render(<Input invalid data-testid="i" />);
    expect(screen.getByTestId('i')).toHaveAttribute('aria-invalid', 'true');
  });

  it('invalid=false (default) sets aria-invalid="false" or omits it', () => {
    render(<Input data-testid="i" />);
    const el = screen.getByTestId('i');
    const ai = el.getAttribute('aria-invalid');
    expect(ai === null || ai === 'false').toBe(true);
  });

  it('invalid=true applies alarm border color (#CC0000)', () => {
    render(<Input invalid data-testid="i" />);
    const styles = window.getComputedStyle(screen.getByTestId('i'));
    // statusTokens.alarm.text === '#CC0000', alarm.border === '#FFCACA'
    // invalid border는 의도상 alarm.text(짙은 빨강)로
    expect(styles.borderColor.toLowerCase()).toMatch(/cc0000|rgb\(204, 0, 0\)/i);
  });

  it('size="sm" renders height 24px', () => {
    render(<Input size="sm" data-testid="i" />);
    expect(screen.getByTestId('i')).toHaveStyle({ height: '24px' });
  });

  it('size="md" (default) renders height 32px', () => {
    render(<Input data-testid="i" />);
    expect(screen.getByTestId('i')).toHaveStyle({ height: '32px' });
  });

  it('size="lg" renders height 40px', () => {
    render(<Input size="lg" data-testid="i" />);
    expect(screen.getByTestId('i')).toHaveStyle({ height: '40px' });
  });

  it('leftAddon renders before the input', () => {
    render(<Input leftAddon={<span data-testid="prefix">$</span>} placeholder="amount" />);
    expect(screen.getByTestId('prefix')).toBeInTheDocument();
    // input은 placeholder로 찾을 수 있어야 함
    expect(screen.getByPlaceholderText('amount')).toBeInTheDocument();
  });

  it('rightAddon renders after the input', () => {
    render(<Input rightAddon={<span data-testid="suffix">kg</span>} placeholder="weight" />);
    expect(screen.getByTestId('suffix')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('weight')).toBeInTheDocument();
  });

  it('forwards native input attributes (type, name, placeholder, autoComplete)', () => {
    render(
      <Input
        type="email"
        name="email"
        placeholder="you@example.com"
        autoComplete="email"
        data-testid="i"
      />
    );
    const el = screen.getByTestId('i');
    expect(el).toHaveAttribute('type', 'email');
    expect(el).toHaveAttribute('name', 'email');
    expect(el).toHaveAttribute('placeholder', 'you@example.com');
    expect(el).toHaveAttribute('autoComplete', 'email');
  });

  it('forwards ref to the underlying <input>', () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<Input ref={ref} data-testid="i" />);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('INPUT');
  });

  it('uses fontFamily from tokens (Segoe UI / Inter / system-ui)', () => {
    render(<Input data-testid="i" />);
    const ff = window.getComputedStyle(screen.getByTestId('i')).fontFamily || '';
    expect(ff.toLowerCase()).toContain('segoe ui');
  });

  it('does not use AI slop visual decoration (gradient/glass/glow)', () => {
    render(<Input data-testid="i" />);
    const styles = window.getComputedStyle(screen.getByTestId('i'));
    expect(styles.backdropFilter || '').not.toMatch(/blur/);
    expect(styles.backgroundImage || '').not.toMatch(/gradient/);
    expect(styles.boxShadow || '').not.toMatch(/glow/i);
  });
});
```

### 4. `Input.tsx` 구현 (테스트 통과시키는 minimal 구현)

```tsx
import { forwardRef } from 'react';
import type { CSSProperties } from 'react';
import {
  primary,
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
import type { InputProps, InputSize } from './types';

const SIZE_STYLES: Record<InputSize, CSSProperties> = {
  sm: { height: '24px', padding: `0 ${space[3]}`, fontSize: fontSize.labelSm },
  md: { height: '32px', padding: `0 ${space[5]}`, fontSize: fontSize.label },
  lg: { height: '40px', padding: `0 ${space[6]}`, fontSize: fontSize.titleSm },
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
  transition:   'border-color 0.12s ease, box-shadow 0.12s ease',
};

const INVALID_STYLE: CSSProperties = {
  borderColor: statusTokens.alarm.text,        // '#CC0000'
};

const DISABLED_STYLE: CSSProperties = {
  background: surfaces.surfaceSubtle,
  color:      text.dim,
  cursor:     'not-allowed',
  opacity:    0.6,
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { size = 'md', invalid = false, leftAddon, rightAddon, disabled, style, ...rest },
  ref
) {
  const inputStyle: CSSProperties = {
    ...BASE_STYLE,
    ...SIZE_STYLES[size],
    ...(invalid && INVALID_STYLE),
    ...(disabled && DISABLED_STYLE),
    ...style,
  };

  const inputEl = (
    <input
      ref={ref}
      disabled={disabled}
      aria-invalid={invalid || undefined}
      style={inputStyle}
      {...rest}
    />
  );

  if (!leftAddon && !rightAddon) {
    return inputEl;
  }

  // addon이 있으면 wrapper로 감싸 inline-flex로 배치.
  // addon은 시각적으로 input과 분리되어 좌·우에 붙는 형태. 1단계는 단순 inline 배치.
  const wrapperStyle: CSSProperties = {
    display:     'inline-flex',
    alignItems:  'center',
    gap:         space[3],
    width:       '100%',
  };

  return (
    <span style={wrapperStyle}>
      {leftAddon}
      {inputEl}
      {rightAddon}
    </span>
  );
});
```

**작성 원칙:**
- 모든 spacing·color·typography는 토큰 import. **hex/px 리터럴 금지** (단 size constraint `'24px'`/`'32px'`/`'40px'`는 Button과 동일 패턴으로 inline 허용 — 후속 phase에서 토큰화 검토).
- `forwardRef` 사용 — React 18·19 공통 API.
- internal `useState` 0 — controlled/uncontrolled는 native `<input>`이 처리.
- `aria-invalid`는 `invalid && true`일 때만 설정 (false일 때 false 명시 vs 생략 둘 다 OK — test가 둘 다 허용).
- AI 슬롭 anti-pattern (gradient/glass/glow) 0.

### 5. `index.ts` (Input 폴더)

```typescript
export { Input } from './Input';
export type { InputProps, InputOwnProps, InputSize } from './types';
```

### 6. `packages/web/src/index.ts` 업데이트

기존 export에 Input 추가:

```typescript
export { Button } from './Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button/types';

export { Box } from './Box';
export type { BoxProps, BoxOwnProps, SpaceToken, RadiusToken, SurfaceToken, BorderToken } from './Box/types';

export { Stack } from './Stack';
export type { StackProps, StackOwnProps, StackDirection, StackAlign, StackJustify } from './Stack/types';

export { Text } from './Text';
export type { TextProps, TextOwnProps, TextVariant, TextWeight, TextColor, TextAlign, TextAs } from './Text/types';

export { Input } from './Input';
export type { InputProps, InputOwnProps, InputSize } from './Input/types';
```

## Acceptance Criteria

```bash
cd C:/Users/ohjih/design_system

pnpm -F @wonik/web test          # Button + Box + Stack + Text + Input 모두 통과
pnpm -F @wonik/web build         # 빌드 성공

# 빌드 산출물 검증
test -f packages/web/dist/index.js
test -f packages/web/dist/index.mjs
test -f packages/web/dist/index.d.ts

# 하드코딩 hex 금지
! grep -E "['\"]#[0-9A-Fa-f]{6}['\"]" packages/web/src/Input/Input.tsx

# AI 슬롭 anti-pattern 0건
! grep -i -E "backdrop-filter|linear-gradient|box-shadow.*glow|rounded-2xl" packages/web/src/Input/Input.tsx

# 공개 표면에 Input 노출
grep -q "export { Input }" packages/web/src/index.ts

# forwardRef 사용 (form 라이브러리 호환성)
grep -q "forwardRef" packages/web/src/Input/Input.tsx

# 기존 phase 회귀 0
pnpm -F @wonik/web test --run 2>&1 | grep -qE "Button|Box|Stack|Text"
```

위 명령이 모두 통과해야 한다.

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 체크리스트:
   - TDD: `Input.test.tsx`가 `Input.tsx` 전에 작성됐나?
   - 토큰 하드코딩 금지: `Input.tsx` 안에 hex 리터럴 0건? (단순 px 일부 허용)
   - controlled + uncontrolled 둘 다 동작? (테스트가 둘 다 검증)
   - `invalid` prop이 `aria-invalid` HTML 표준과 1:1 매칭?
   - `forwardRef`로 `<input>` 노출? (form 라이브러리 호환)
   - 회귀 없음: 기존 Button + Box + Stack + Text 테스트 모두 통과?
3. 결과에 따라 `phases/03-form-primitives/index.json`의 step 0을 업데이트:
   - 성공 → `"status": "completed"`, `"summary": "@wonik/web Input atom 추가. 5 state(default/hover/focus/invalid/disabled) × 3 size. controlled/uncontrolled 둘 다 지원. forwardRef로 native input 노출. leftAddon/rightAddon으로 icon·prefix·suffix 패턴 미리 지원. 다음 step에서 Textarea가 동일 패턴으로 multi-line."`
   - 실패 → `"status": "error"`, `"error_message": "구체 사유"`

## 금지사항

- **hex 리터럴 금지** (모두 `@wonik/tokens` import). 단 `'24px'`/`'32px'`/`'40px'` size constraint는 Button과 동일 패턴으로 inline 허용.
- **`useState`/`useReducer` 등 internal state 도입 금지** — controlled/uncontrolled는 native `<input>`이 처리.
- **CSS-in-JS 라이브러리 도입 금지** (styled-components/emotion/stitches/vanilla-extract).
- **Snapshot test 금지.**
- **AI 슬롭 anti-pattern 금지** (backdrop-filter / gradient / glow shadow / rounded-2xl).
- **React 19-only API 금지** (`useFormStatus`/`useOptimistic`/`use()`/React Compiler 자동 메모 등). peer는 18·19 dual.
- **label/helperText/errorText prop 도입 금지** — 이건 후속 FormField composition phase의 일. Input은 pure atom.
- **form 라이브러리(`react-hook-form`/`formik`/`zod`/...) 의존 금지** — consumer 자유.
- **다른 패키지 폴더 만들지 마라** (`packages/{tokens,web}` 외 금지).
- **기존 docs/CLAUDE.md/scripts/execute.py/Button/Box/Stack/Text 코드 수정 금지** — 단 `packages/web/src/index.ts`에 Input export 추가는 허용.
- **기존 테스트를 깨뜨리지 마라.**
