# Step 1: tokens-base

## 읽어야 할 파일

먼저 아래 파일들을 읽고 토큰 정의의 출처와 결정 사항을 파악하라:

- `/CLAUDE.md` (프로젝트 가드레일, 특히 토큰 하드코딩 금지 규칙)
- `/docs/UI_GUIDE.md` (전체 색·타이포·spacing·status 토큰 명세)
- `/docs/ADR.md` (ADR-006 토큰 dual export, ADR-007 WONIK BLUE `#273E82`)
- `/WONIK IPS — WARP Design System/colors_and_type.css` (기존 자산 — 참고용. 단, 이 파일의 `#273D7F`는 잘못된 값이므로 그대로 복사 금지)
- 이전 step에서 생성된 파일:
  - `/packages/tokens/package.json` (placeholder)
  - `/pnpm-workspace.yaml`, `/tsconfig.base.json`

이전 step 산출물을 꼼꼼히 읽고 설계 의도를 이해한 뒤 작업하라.

## 작업

`packages/tokens/`를 실제 디자인 토큰 패키지로 채운다. **TypeScript source가 single source of truth**이며, 빌드 시 (1) `dist/tokens.css` (CSS 변수)와 (2) `dist/index.{js,d.ts}` (TypeScript 상수 + 타입) 양쪽이 생성된다.

이 토큰은 `@wonik/web`의 base가 되고, 향후 다른 컴포넌트 패키지가 추가되더라도 동일하게 import할 공통 base다. WARP HMI 시안(`WONIK IPS — WARP Design System/colors_and_type.css`)에서 추출하되 (1) WONIK BLUE는 공식 CI 정확값 `#273E82`로 통일, (2) 시안의 `#273D7F`/`#2B7FFF`는 사용 금지.

### 1. 디렉토리 구조

```
packages/tokens/
├── src/
│   ├── colors.ts         # 색 토큰 (surfaces, borders, primary, secondary, text)
│   ├── typography.ts     # 폰트 패밀리, scale, weights, line-height
│   ├── spacing.ts        # space-1~8, radius (sm/md/full), panel/component constants
│   ├── status.ts         # status semantic (idle/init/ready/run/...)
│   └── index.ts          # public API: 위 4개 named export 재export
├── scripts/
│   └── build-css.ts      # TS 토큰 → tokens.css CSS 변수 생성
├── package.json
├── tsconfig.json         # extends "../../tsconfig.base.json"
└── vite.config.ts (또는 tsup.config.ts)
```

### 2. `src/colors.ts` 시그니처

```typescript
// Surfaces
export const surfaces = {
  canvas:       '#E8E8EA',
  surface:      '#FEFEFE',
  surfaceSubtle:'#F4F5F5',
  surfaceInset: '#F5F5F5',
  surfaceMid:   '#E7E7E7',
  surfaceWhite: '#FFFFFF',
  darkBase:     '#1E1E21',
  darkHeader:   '#252528',
  darkHover:    '#2D2D31',
} as const;

// Borders
export const borders = { ... } as const; // light, mid, dark, panelDark

// Primary — WONIK BLUE (공식 CI, ADR-007)
export const primary = {
  base:     '#273E82',  // WONIK BLUE
  pale:     '#EEF0F8',
  bg:       '#D6DCF0',
  stroke:   '#A8B4D8',
  selected: '#1C2E60',
} as const;

// Secondary — WONIK GRAY (공식 CI)
export const secondary = {
  base: '#ACACAC',  // WONIK GRAY
} as const;

// Text
export const text = { ... } as const; // primary, secondary, dim, dark, onDark, onDarkVal, onDarkDim
```

각 그룹은 `as const`로 type narrowing을 지킨다.

### 3. `src/typography.ts` 시그니처

```typescript
export const fontFamily = {
  base: "'Segoe UI', 'Inter', system-ui, sans-serif",
} as const;

export const fontSize = {
  micro:    '8px',
  labelSm:  '10px',
  label:    '12px',
  titleSm:  '14px',
} as const;

export const fontWeight = {
  regular: 400,
  medium:  500,
} as const;

export const lineHeight = {
  tight: 1, // WARP industrial
} as const;
```

### 4. `src/spacing.ts` 시그니처

```typescript
export const space = {
  1: '4px',  2: '6px',  3: '8px',  4: '10px',
  5: '12px', 6: '16px', 7: '22px', 8: '32px',
} as const;

export const radius = {
  sm:   '5px',
  md:   '10px',
  full: '50%',
  panelHeader: '10px 10px 0 0',
} as const;

export const componentSize = {
  panelPaddingX:   '13px',
  panelHeaderH:    '40px',
  toolbarH:        '67px',
  tableCellH:      '20px',
  statusChipH:     '17px',
  statusDotSize:   '4px',
  toolbarIconSize: '36px',
} as const;
```

### 5. `src/status.ts` 시그니처

```typescript
// 각 상태는 { bg, border?, text, dot? } 형태의 토큰 그룹
export const statusTokens = {
  idle:        { bg: '#F4F5F5', border: '#D4D4D8', text: '#71717B' },
  init:        { bg: '#FFFFAC', border: '#D4C800', text: '#7A6E00' },
  ready:       { bg: '#E6FAF4', dot: '#07895E', text: '#00A876' },
  run:         { bg: '#EEF0F8', border: '#A8B4D8', dot: '#273E82', text: '#273E82' }, // primary 사용
  processEnd:  { bg: '#D6F0E6', text: '#07895E' },
  accessReady: { bg: '#EEF0F8', text: '#273E82' }, // primary 사용
  warning:     { bg: '#FFF4DC', dot: '#FE9A00', text: '#D09804' },
  alarm:       { bg: '#FFE2E2', border: '#FFCACA', text: '#CC0000' },
  abort:       { bg: '#FFCACA', border: '#FFCACA', text: '#CC0000' },
  processed:   { bg: '#F3E8FF', border: '#E9D1FF', text: '#7C3AED' },
  ok:          { dot: '#07895E', text: '#00D492' },
} as const;
```

**중요**: `run`과 `accessReady`의 primary 색은 `'#273E82'` (ADR-007). `'#2B7FFF'`로 절대 쓰지 말 것.

### 6. `src/index.ts`

```typescript
export * from './colors';
export * from './typography';
export * from './spacing';
export * from './status';
```

### 7. `scripts/build-css.ts` — TS 토큰 → CSS 변수 생성

TypeScript source를 읽어 `dist/tokens.css`를 생성하는 빌드 스크립트. 시그니처:

```typescript
// 의사코드
import * as tokens from '../src';

function flatten(obj: Record<string, any>, prefix: string): string[] {
  // surfaces.canvas → "--color-surface-canvas: #E8E8EA;"
  // primary.base → "--color-primary: #273E82;"
  // primary.pale → "--color-primary-pale: #EEF0F8;"
  // space[1] → "--space-1: 4px;"
  // ...
}

writeFile('dist/tokens.css', `:root {\n${lines.join('\n')}\n}\n`);
```

CSS 변수 명명 규칙 (UI_GUIDE.md와 일치):
- 색: `--color-{group}-{key}` (예: `--color-primary`, `--color-primary-pale`, `--color-surface`, `--color-text-primary`, `--color-status-run-bg`)
- 폰트: `--font-family`, `--font-size-{key}`, `--font-weight-{key}`, `--line-height`
- spacing: `--space-{n}`, `--radius-{key}`
- 컴포넌트: `--{name}-{prop}` (예: `--toolbar-h`)

### 8. `package.json` 업데이트 (placeholder → 실제)

```json
{
  "name": "@wonik/tokens",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".":         { "types": "./dist/index.d.ts", "import": "./dist/index.mjs", "require": "./dist/index.js" },
    "./tokens.css": "./dist/tokens.css"
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsup src/index.ts --format esm,cjs --dts && tsx scripts/build-css.ts",
    "test": "echo 'no tests yet'",
    "lint": "echo 'no lint yet'"
  },
  "devDependencies": {
    "tsup": "^8.0.0",
    "tsx":  "^4.0.0"
  }
}
```

`tsup`은 빌드 도구로 충분(별도 vite 불필요). `tsx`는 build-css 스크립트 실행용.

## Acceptance Criteria

```bash
cd C:/Users/ohjih/design_system
pnpm install
pnpm -F @wonik/tokens build

# 빌드 산출물 검증
test -f packages/tokens/dist/index.js
test -f packages/tokens/dist/index.mjs
test -f packages/tokens/dist/index.d.ts
test -f packages/tokens/dist/tokens.css

# 핵심 토큰 값 검증 (WONIK BLUE 적용 확인)
grep -q "#273E82" packages/tokens/dist/tokens.css
grep -q "#ACACAC" packages/tokens/dist/tokens.css

# 이전 brand color가 남아있지 않은지 확인
! grep -q "#2B7FFF" packages/tokens/dist/tokens.css
! grep -q "#273D7F" packages/tokens/dist/tokens.css
```

위 명령이 모두 통과해야 한다 (마지막 두 grep은 매치되면 실패해야 함).

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 아키텍처 체크리스트:
   - `docs/UI_GUIDE.md`의 색·spacing·typography 명세와 토큰 값이 일치하는가?
   - `docs/ADR.md` ADR-006 (CSS 변수 + TS 상수 양쪽 export) 준수하는가? (`dist/index.{js,mjs,d.ts}` + `dist/tokens.css` 모두 존재)
   - `docs/ADR.md` ADR-007 (WONIK BLUE `#273E82`) 정확히 적용됐는가?
   - `/CLAUDE.md` CRITICAL: 토큰을 다른 패키지에서 import하면 자동완성·타입 안전이 작동하는가? (`import { primary } from '@wonik/tokens'`)
3. 결과에 따라 `phases/01-foundation/index.json`의 step 1을 업데이트:
   - 성공 → `"status": "completed"`, `"summary": "@wonik/tokens 빌드 완료. dist/{index.{js,mjs,d.ts}, tokens.css} 산출. WONIK BLUE #273E82 + WONIK GRAY #ACACAC 적용. 다음 step에서 @wonik/web의 첫 컴포넌트(Button)가 이 토큰을 import."`
   - 실패 → `"status": "error"`, `"error_message": "구체 사유"`
   - 사용자 개입 → `"status": "blocked"`, `"blocked_reason": "구체 사유"`

## 금지사항

- **`#2B7FFF` 또는 `#273D7F` hex 사용 금지.** 이유: 구 brand color (ADR-007에서 폐기). WONIK BLUE는 정확히 `#273E82`만.
- **hex 값을 동적 계산·문자열 조합으로 만들지 마라.** 이유: 토큰은 정적 single source of truth. `chroma.js` 같은 색 조작 라이브러리도 1단계에서 도입 금지.
- **컴포넌트 코드(packages/web/src)를 작성하지 마라.** 이유: 이번 step은 토큰만. Button 컴포넌트는 step 2.
- **`packages/{tokens, web}` 외 다른 패키지 디렉토리를 만들지 마라.** 이유: 1단계는 tokens + web만 (ADR-001).
- **CSS 변수와 TS 상수의 값이 어긋나는 상황을 만들지 마라.** 이유: 두 표현 모두 동일 source(TypeScript)에서 생성돼야 한다 (ADR-006). 수동으로 CSS만 수정 금지.
- **테마 분기(라이트/다크) 토큰 추가 금지.** 이유: ADR-005에 따라 1단계는 light-mode 전용. semantic naming은 미리 잡되 다크 토큰 자체는 추가하지 않는다.
- **기존 테스트를 깨뜨리지 마라.**
