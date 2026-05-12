# Step 2: components-focus-hover-placeholder-resize

## 작업

ADR-011이 결정한 form 컨트롤 정책을 `@wonik/web` 6개 컴포넌트에 적용한다.

### 컴포넌트별 변경

| 컴포넌트 | 작업 |
|------|------|
| **Button** | `ensureCssInjected()` + `.wonik-button:focus-visible { outline: 2px solid var(--color-focus, var(--color-primary)); outline-offset: 2px; }` + className `wonik-button` |
| **Input** | `ensureCssInjected()` + className `wonik-input` + CSS: `:focus-visible` (offset 0px, border-통합), `:hover { border-color: var(--color-border-strong, var(--color-border-mid)) }`, `::placeholder { color: var(--color-placeholder, var(--color-text-dim)); opacity: 1 }`. inline `outline: 'none'`은 유지(focus-visible CSS가 ring 책임). |
| **Textarea** | Input과 동일 CSS 패턴 + **`resize?: 'none' \| 'vertical' \| 'both'` prop 추가** (default `vertical`). disabled 시 `'none'` 강제. types.ts에 prop 추가. |
| **Checkbox** | `ensureCssInjected()` + className `wonik-checkbox` + `:focus-visible { outline: 2px solid var(--color-focus, var(--color-primary)); outline-offset: 2px; }` |
| **Radio** | Checkbox 동일 패턴, className `wonik-radio` |
| **Switch** | 기존 `SWITCH_CSS`의 `var(--color-primary)` 두 곳을 `var(--color-focus, var(--color-primary))`로 갱신. 다른 변경 없음. |

### 공통 패턴 (Switch.tsx 참조)

```typescript
const X_CSS = `
.wonik-X:focus-visible { outline: 2px solid var(--color-focus, var(--color-primary)); outline-offset: 2px; }
.wonik-X:hover { border-color: var(--color-border-strong, var(--color-border-mid)); }
.wonik-X::placeholder { color: var(--color-placeholder, var(--color-text-dim)); opacity: 1; }
`;
let cssInjected = false;
function ensureCssInjected() {
  if (cssInjected || typeof document === 'undefined') return;
  const style = document.createElement('style');
  style.setAttribute('data-wonik-X', 'true');
  style.textContent = X_CSS;
  document.head.appendChild(style);
  cssInjected = true;
}
```

컴포넌트 export 함수 첫 줄에 `ensureCssInjected()` 호출. inline `style`와 추가 `className`(consumer가 줄 수도 있음) 모두 보존.

### Textarea resize prop 디테일

`types.ts`:
```typescript
export interface TextareaOwnProps {
  size?: TextareaSize;
  invalid?: boolean;
  resize?: 'none' | 'vertical' | 'both';  // 신규, default 'vertical'
  ref?: Ref<HTMLTextAreaElement>;
}
```

`Textarea.tsx`:
- prop destructure에 `resize = 'vertical'` 추가
- BASE_STYLE에서 `resize: 'vertical'` 제거 (composed에서 결정)
- composed style:
  ```typescript
  const composed: CSSProperties = {
    ...BASE_STYLE,
    fontSize: SIZE_FONT[size],
    padding: SIZE_PADDING[size],
    resize: disabled ? 'none' : resize,
    ...(invalid && INVALID_STYLE),
    ...(disabled && DISABLED_STYLE),
    ...style,
  };
  ```
- DISABLED_STYLE의 `resize: 'none'`은 그대로 (방어적 — 위 `disabled ? 'none' : resize`가 우선이지만 spread 순서로 disabled 보장).

### 테스트 갱신 가능 항목

각 컴포넌트 테스트가 다음을 검증하면 신규 케이스 추가 필요:
- Textarea: `resize` prop이 props로 전달되는지 + default `'vertical'` + disabled override.
- 다른 컴포넌트의 focus·hover·placeholder는 inline style 아닌 module-scope CSS라 jsdom에서 `toHaveStyle` 검증 어려움. **신규 테스트는 가능한 범위에서만**(class name 존재 확인, ensureCssInjected이 document.head에 style 추가하는지).

## Acceptance Criteria

```bash
cd C:/Users/ohjih/design_system

pnpm -F @wonik/tokens build
pnpm -F @wonik/web build
pnpm -F @wonik/web test --run

# 모든 컴포넌트에 ensureCssInjected 패턴
grep -l "ensureCssInjected" packages/web/src/Button/Button.tsx
grep -l "ensureCssInjected" packages/web/src/Input/Input.tsx
grep -l "ensureCssInjected" packages/web/src/Textarea/Textarea.tsx
grep -l "ensureCssInjected" packages/web/src/Checkbox/Checkbox.tsx
grep -l "ensureCssInjected" packages/web/src/Radio/Radio.tsx

# Switch는 이미 ensureCssInjected 있음 + color-focus 갱신
grep -q "var(--color-focus" packages/web/src/Switch/Switch.tsx

# CSS rule 키워드 (각 컴포넌트의 module-scope CSS block)
grep -q ":focus-visible" packages/web/src/Button/Button.tsx
grep -q ":focus-visible" packages/web/src/Input/Input.tsx
grep -q ":hover" packages/web/src/Input/Input.tsx
grep -q "::placeholder" packages/web/src/Input/Input.tsx
grep -q ":focus-visible" packages/web/src/Textarea/Textarea.tsx

# Textarea resize prop
grep -q "resize?:" packages/web/src/Textarea/types.ts
grep -q "resize = 'vertical'" packages/web/src/Textarea/Textarea.tsx

# className wonik-* 부여
grep -q "wonik-button" packages/web/src/Button/Button.tsx
grep -q "wonik-input" packages/web/src/Input/Input.tsx
grep -q "wonik-textarea" packages/web/src/Textarea/Textarea.tsx
grep -q "wonik-checkbox" packages/web/src/Checkbox/Checkbox.tsx
grep -q "wonik-radio" packages/web/src/Radio/Radio.tsx

# 토큰 변경 0 (step 1 결과 보존)
git diff packages/tokens/ | wc -l    # 0

# 모든 테스트 통과 (assertion 갱신 + Textarea resize 신규 케이스 포함)
pnpm -F @wonik/web test --run
```

## 검증 절차

1. AC 커맨드 실행.
2. 체크리스트:
   - 6개 컴포넌트 모두 ensureCssInjected 패턴?
   - Textarea resize prop 추가 + default 'vertical' + disabled 시 'none'?
   - Switch의 focus color가 var(--color-focus, var(--color-primary))로 갱신?
   - prop signature 변경: Textarea의 `resize?` 추가만 (기존 prop 보존)?
   - 모든 테스트 통과 (회귀 0)?
   - 토큰 변경 0?
3. 성공 → `phases/10-form-polish/index.json` step 2 → completed.

## 금지사항

- **token 변경 금지** — step 1의 영역.
- **prop signature 다른 변경 금지** — Textarea `resize?` 추가만. 다른 컴포넌트 prop signature 변경 0.
- **inline `outline: 'none'` 제거 금지** — focus-visible CSS가 ring 책임. 기본 browser outline은 막아야 동일한 시각.
- **className 강제 override 금지** — consumer가 className 전달하면 우리 `wonik-X` + consumer className 둘 다 적용.
- **AI 슬롭 anti-pattern 도입 0**.
- **React 19-only API 금지**.
- **inline style에 pseudo-class 시도 금지** — inline은 못 풀음. 반드시 module-scope CSS.
- **CSS inject가 SSR에서 깨지지 않게** — `typeof document === 'undefined'` 가드 필수 (Switch 패턴 그대로).
- **테스트 임의 제거 금지**.
