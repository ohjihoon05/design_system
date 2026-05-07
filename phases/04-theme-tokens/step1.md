# Step 1: ts-tokens-as-css-vars

## 읽어야 할 파일

먼저 아래 파일을 읽고 이전 step에서 만든 CSS 인프라와 기존 컴포넌트의 토큰 사용 패턴을 파악하라:

- `/CLAUDE.md` (CRITICAL — 토큰 하드코딩 금지)
- `/docs/ADR.md` 특히 ADR-009
- 이전 step 산출물:
  - `/packages/tokens/dist/tokens.css` (light + dark 두 블록 emit 확인)
  - `/packages/tokens/src/theme-light.ts`, `theme-dark.ts` (hex source-of-truth)
- 컴포넌트의 토큰 사용 — `primary.base` / `surfaces.surface` 등을 inline style에 spread하는 패턴:
  - `/packages/web/src/Button/Button.tsx`
  - `/packages/web/src/Input/Input.tsx`
  - `/packages/web/src/Textarea/Textarea.tsx`
  - `/packages/web/src/Box/Box.tsx`
  - `/packages/web/src/Stack/Stack.tsx`
  - `/packages/web/src/Text/Text.tsx`
- 컴포넌트 테스트 — hex 값 assertion 패턴:
  - `/packages/web/src/Button/Button.test.tsx` (`toHaveStyle({ background: '#273E82' })` 등)
  - `/packages/web/src/Input/Input.test.tsx`, `Textarea/Textarea.test.tsx`
  - `/packages/web/src/Box/Box.test.tsx`, `Text/Text.test.tsx`
- 현재 토큰 export — `primary.base = '#273E82'` 직접 hex:
  - `/packages/tokens/src/colors.ts`

## 작업

`@wonik/tokens`의 **TypeScript export를 hex 리터럴 → CSS 변수 reference로 전환**한다. 컴포넌트가 `primary.base`를 import해 `style={{background: primary.base}}`로 쓰는 코드가 그대로 작동하면서 — 다만 결과 inline style이 `style={{background: 'var(--color-primary)'}}`이 된다. 이렇게 되면 `<html data-theme="dark">` 시 CSS 변수가 dark 값으로 resolve돼 컴포넌트가 자동 다크 대응.

또한 jsdom 환경에서 CSS 변수가 `getComputedStyle`로 어떻게 보이는지 확인하고, 그 결과에 따라 기존 79개 테스트 중 hex assertion을 적절히 갱신한다.

### 핵심 설계 결정

1. **TypeScript token export는 단순 string으로 `var(...)` 반환**: `primary.base = 'var(--color-primary)'`. 함수형(`primary.base()`) 도입 안 함 — premature.
2. **테마 비의존 토큰은 그대로 hex/px**: `space[1] = '4px'`, `fontSize.label = '12px'` 등은 light/dark 무관 → 변경 없음. `colors`/`borders`/`primary`/`secondary`/`text`/`statusTokens`만 `var(...)` 전환.
3. **기존 객체 shape 보존**: `primary.base`/`primary.pale`/`primary.bg` 등 키 모두 보존, 값만 변환.
4. **jsdom CSS var resolution 검증**: 테스트 setup에서 `<html>` 요소에 light 토큰을 inline `style="--color-primary: #273E82; ..."` 식으로 주입하거나, CSS import. jsdom 25는 `getComputedStyle`이 CSS 변수를 resolve한다 — 검증 후 결정.
5. **테스트 assertion 갱신 전략 (2 옵션)**:
   - **옵션 A**: jsdom이 CSS var를 resolve하면 → 기존 `toHaveStyle({ background: '#273E82' })` 그대로 통과 (단 vitest setup에서 CSS import 필요).
   - **옵션 B**: jsdom이 resolve 못하면 → `toHaveStyle({ background: 'var(--color-primary)' })` 또는 `expect(el.style.background).toBe('var(--color-primary)')`로 갱신.
   - 본 step에서 한 컴포넌트(예: Button) 한 테스트로 빠르게 검증 후 결정.
6. **status 토큰**: invalid border 등 status 색도 `var(--color-status-alarm-text)` reference로 전환. 단 status는 step 0에서 light/dark 동일 값이므로 즉시 영향 없음.

### 1. `colors.ts` 변환

현재:
```typescript
export const surfaces = {
  canvas: '#E8E8EA',
  surface: '#FEFEFE',
  ...
} as const;

export const primary = {
  base: '#273E82',
  pale: '#EEF0F8',
  ...
} as const;
```

변환 후:
```typescript
export const surfaces = {
  canvas:        'var(--color-canvas)',
  surface:       'var(--color-surface)',
  surfaceSubtle: 'var(--color-surface-subtle)',
  surfaceInset:  'var(--color-surface-inset)',
  surfaceMid:    'var(--color-surface-mid)',
  surfaceWhite:  'var(--color-surface-white)',
  darkBase:      'var(--color-dark-base)',
  darkHeader:    'var(--color-dark-header)',
  darkHover:     'var(--color-dark-hover)',
} as const;

export const borders = {
  light:     'var(--color-border)',
  mid:       'var(--color-border-mid)',
  dark:      'var(--color-border-dark)',
  panelDark: 'var(--color-border-panel-dark)',
} as const;

export const primary = {
  base:     'var(--color-primary)',
  pale:     'var(--color-primary-pale)',
  bg:       'var(--color-primary-bg)',
  stroke:   'var(--color-primary-stroke)',
  selected: 'var(--color-primary-selected)',
} as const;

export const secondary = {
  base: 'var(--color-brand-secondary)',
} as const;

export const text = {
  primary:    'var(--color-text-primary)',
  secondary:  'var(--color-text-secondary)',
  dim:        'var(--color-text-dim)',
  dark:       'var(--color-text-dark)',
  onDark:     'var(--color-text-on-dark)',
  onDarkVal:  'var(--color-text-on-dark-val)',
  onDarkDim:  'var(--color-text-on-dark-dim)',
} as const;
```

CSS 변수명은 step 0 빌드 산출물 `tokens.css` 의 변수명과 정확히 일치해야 한다 (camelToKebab 일관성).

### 2. `status.ts` 변환

```typescript
export const statusTokens = {
  idle:    { bg: 'var(--color-status-idle-bg)',    border: 'var(--color-status-idle-border)', text: 'var(--color-status-idle-text)' },
  init:    { bg: 'var(--color-status-init-bg)',    border: 'var(--color-status-init-border)', text: 'var(--color-status-init-text)' },
  ready:   { bg: 'var(--color-status-ready-bg)',   dot: 'var(--color-status-ready-dot)',      text: 'var(--color-status-ready-text)' },
  run:     { bg: 'var(--color-status-run-bg)',     border: 'var(--color-status-run-border)',  dot: 'var(--color-status-run-dot)',     text: 'var(--color-status-run-text)' },
  processEnd: { bg: 'var(--color-status-process-end-bg)', text: 'var(--color-status-process-end-text)' },
  accessReady: { bg: 'var(--color-status-access-ready-bg)', text: 'var(--color-status-access-ready-text)' },
  warning: { bg: 'var(--color-status-warning-bg)', dot: 'var(--color-status-warning-dot)',    text: 'var(--color-status-warning-text)' },
  alarm:   { bg: 'var(--color-status-alarm-bg)',   border: 'var(--color-status-alarm-border)', text: 'var(--color-status-alarm-text)' },
  abort:   { bg: 'var(--color-status-abort-bg)',   border: 'var(--color-status-abort-border)', text: 'var(--color-status-abort-text)' },
  processed: { bg: 'var(--color-status-processed-bg)', border: 'var(--color-status-processed-border)', text: 'var(--color-status-processed-text)' },
  ok:      { dot: 'var(--color-status-ok-dot)',    text: 'var(--color-status-ok-text)' },
} as const;
```

기존 키 셋·shape 그대로, 값만 변환. status 토큰은 build-css.ts가 자동 생성한 변수명 `--color-status-{state}-{prop}` 그대로 reference.

### 3. `spacing.ts` / `typography.ts` — 변경 없음

```typescript
// space[1..8] → 4px..32px
// radius.sm → '5px'
// fontSize.label → '12px'
// fontFamily.base → "'Segoe UI', 'Inter', system-ui, sans-serif"
```

이 토큰들은 light/dark 무관이므로 hex/px 직접 값 그대로 유지.

### 4. 테스트 setup — CSS import (jsdom resolution 보장)

`packages/web/vitest.setup.ts`에 토큰 CSS를 import해 jsdom이 CSS 변수를 resolve할 수 있게 한다:

```typescript
// 기존
import '@testing-library/jest-dom';

// 추가 — 토큰 CSS variables를 jsdom의 :root에 등록
import '@wonik/tokens/dist/tokens.css';
```

만약 위 import이 안 통하면 (vitest의 CSS import 처리 문제), fallback으로 `vitest.config.ts`의 `test.css.modules` 또는 testing-library의 `setupFiles`에서 dynamic 주입:

```typescript
// vitest.setup.ts (fallback)
import '@testing-library/jest-dom';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

beforeAll(() => {
  // tokens.css를 읽어 :root에 inject
  const cssPath = resolve(__dirname, '../tokens/dist/tokens.css');
  const css = readFileSync(cssPath, 'utf8');
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
});
```

이 fallback이 필요하면 `import { beforeAll } from 'vitest'` 추가 + `vitest.config.ts`에 `globals: true`(이미 설정됨) 확인.

### 5. 테스트 hex assertion 갱신

검증 결과에 따라:

**시나리오 A — jsdom이 CSS var를 resolve함 (preferred)**:
- 기존 테스트 `toHaveStyle({ background: '#273E82' })` 그대로 통과.
- 추가 변경 없음.

**시나리오 B — jsdom이 resolve 못함**:
- 기존 hex assertion을 다음 중 하나로 갱신:
  - `toHaveStyle({ background: 'var(--color-primary)' })` (assertion이 inline style 그대로 매치)
  - `expect(el.style.background).toBe('var(--color-primary)')` (lower-level)
- 또는 `vitest.setup.ts`에 CSS resolution helper 추가.

본 step에서 한 컴포넌트(Button.test.tsx) 검증으로 시나리오 결정 후 일괄 적용.

### 6. 빌드 산출물 검증

```bash
pnpm -F @wonik/tokens build
# tokens.css는 step 0과 동일 (변경 없음)

pnpm -F @wonik/web build
# packages/web/dist/index.js 안에 'var(--color-primary)' 등 CSS 변수 reference가 포함돼야 함 (#273E82 hex literal은 Button.tsx 코드에서 사라져야 함)
grep -q "var(--color-primary)" packages/web/dist/index.js || echo "ERROR: CSS var reference missing"
! grep -q "#273E82" packages/web/dist/index.js  # hex 직접 사용 0
```

## Acceptance Criteria

```bash
cd C:/Users/ohjih/design_system

pnpm -F @wonik/tokens build       # tokens.css 재생성 (step 0과 동일)
pnpm -F @wonik/web build          # 빌드 성공 (warning만 OK)
pnpm -F @wonik/web test --run     # 79+ 테스트 모두 통과

# colors.ts·status.ts에 hex 리터럴 0건 (theme-light.ts/theme-dark.ts에만 hex가 있어야 함)
! grep -E "['\"]#[0-9A-Fa-f]{6}['\"]" packages/tokens/src/colors.ts
! grep -E "['\"]#[0-9A-Fa-f]{6}['\"]" packages/tokens/src/status.ts

# colors.ts·status.ts가 var(...) reference 포함
grep -q "var(--color-primary)" packages/tokens/src/colors.ts
grep -q "var(--color-status" packages/tokens/src/status.ts

# 빌드 산출물에 CSS var reference 포함, hex 직접 사용 0
grep -q "var(--color-primary)" packages/web/dist/index.js
! grep -E "['\"]#273E82['\"]" packages/web/dist/index.js
! grep -E "['\"]#CC0000['\"]" packages/web/dist/index.js

# theme-light.ts·theme-dark.ts에는 hex가 그대로 (source of truth)
grep -q "#273E82" packages/tokens/src/theme-light.ts
grep -q "#4A65B8" packages/tokens/src/theme-dark.ts
```

위 명령이 모두 통과해야 한다.

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 체크리스트:
   - `colors.ts`/`status.ts`에 hex 0건? (모두 `var(...)` reference)
   - `theme-light.ts`/`theme-dark.ts`만 source-of-truth로 hex 보유?
   - 빌드 산출물(`packages/web/dist/index.js`)에 hex 직접 사용 0?
   - 79+ 테스트 모두 통과? (vitest setup 갱신으로 jsdom CSS var resolve 처리)
   - `space`/`radius`/`fontSize`/`fontFamily`는 변경 없이 그대로? (light/dark 무관)
3. 결과에 따라 `phases/04-theme-tokens/index.json`의 step 1을 업데이트:
   - 성공 → `"status": "completed"`, `"summary": "TS 토큰 export를 var(--color-...) reference로 전환. colors.ts·status.ts에 hex 0건. 빌드 산출물에서도 hex 직접 사용 0. vitest setup이 jsdom CSS var resolve 보장. 79+ 테스트 통과. 다음 step에서 ThemeProvider/useTheme로 데이터-테마 토글 인프라."`
   - 실패 → `"status": "error"`, `"error_message": "구체 사유"`

## 금지사항

- **컴포넌트 코드 (Button.tsx, Input.tsx, Box.tsx 등) 수정 금지** — 이 step은 토큰 export 형태만 변경. 컴포넌트는 그대로.
- **`space`/`radius`/`fontSize`/`fontFamily` 토큰을 `var(...)` 전환하지 마라** — light/dark 무관이므로 hex/px 직접 유지.
- **단일 inline `var(...)`을 컴포넌트 코드에 직접 작성하지 마라** — 컴포넌트는 항상 `primary.base`처럼 토큰 import 경유.
- **`@wonik/tokens` 패키지 split 금지** — colors와 theme files는 같은 패키지 안.
- **Style Dictionary·tokens-cli 같은 도구 도입 금지** — 자체 빌드.
- **status 토큰을 hex로 그대로 두지 마라** — 모두 `var(...)` 전환. status는 light/dark 동일 값이라도 일관성을 위해 reference로.
- **theme-light.ts/theme-dark.ts에서 var(...) 사용 금지** — 이건 source-of-truth (hex 직접).
- **새 dependency 추가 금지.**
- **AI 슬롭 anti-pattern 금지.**
- **기존 테스트를 깨뜨리지 마라** — 통과 못하면 vitest setup으로 해결, 컴포넌트 코드 수정으로 회피하지 마라.
