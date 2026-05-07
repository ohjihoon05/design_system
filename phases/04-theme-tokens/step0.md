# Step 0: theme-css-infra

## 읽어야 할 파일

먼저 아래 파일을 읽고 현재 토큰 구조와 ADR-009의 의도를 파악하라:

- `/CLAUDE.md` (CRITICAL — 토큰 하드코딩 금지)
- `/docs/ADR.md` 특히 **ADR-009** (다크 모드 1단계 핵심 승격) + ADR-005 (light-only 갱신 노트) + ADR-006 (CSS var + TS 양쪽 export) + ADR-007 (WONIK BLUE)
- `/docs/UI_GUIDE.md` (AI 슬롭 anti-pattern)
- `/packages/tokens/src/colors.ts` (현재 light hex 값 — light theme 값으로 보존)
- `/packages/tokens/src/spacing.ts`, `typography.ts`, `status.ts` (테마 비의존 토큰 — 그대로 유지)
- `/packages/tokens/scripts/build-css.ts` (현재 빌드 스크립트 — `:root { ... }` 단일 블록 생성)
- `/packages/tokens/dist/tokens.css` (현재 출력 — refactor 후 형태 비교용)

## 작업

`@wonik/tokens`의 빌드 산출물 `tokens.css`를 **light + dark 두 테마를 모두 정의**하도록 재구성한다. 색 hex 값은 두 가지 source-of-truth(`theme-light.ts`, `theme-dark.ts`)로 분리하고, 빌드 스크립트가 둘을 읽어 `:root, [data-theme="light"]` + `[data-theme="dark"]` 두 블록을 emit한다. 

이 step은 **CSS 인프라만** 다룬다 — TypeScript 토큰 export 형태(`primary.base`)를 `var(...)` reference로 바꾸는 작업은 step 1, ThemeProvider는 step 2, sandbox 토글은 step 3.

### 핵심 설계 결정

1. **`:root, [data-theme="light"]` = 기본값**: `data-theme` 속성을 안 단 페이지도 light로 자동 동작 (backwards compatible).
2. **`[data-theme="dark"]` = override**: 같은 변수명, 다른 값. 컴포넌트 코드는 변수명만 보므로 자동 대응.
3. **두 테마의 변수 키는 1:1 매칭**: light에 있는 모든 `--color-*`가 dark에도 정의돼야 한다. 없으면 dark에서 그 변수만 fallback 안 되어 broken.
4. **다크 값 결정 권한**: 본 step이 명시적으로 정의 (아래 표). ppt slate 계열 + WONIK BLUE를 dark용으로 조정한 시작점. 추후 디자이너가 refine 가능.
5. **테마 비의존 토큰은 그대로**: spacing/radius/typography/componentSize는 light/dark 무관 → `:root` 안에 한 번만 정의.
6. **status 토큰**: 일단 light 값을 dark에서도 그대로 사용 (semantic 색은 보통 잘 invert 안 함). 추후 contrast 문제가 생기면 별도 step에서 refine.

### 1. 디렉토리 구조

```
packages/tokens/src/
├── colors.ts                     # 그대로 — light hex 값 source (호환성)
├── spacing.ts, typography.ts, status.ts   # 그대로
├── theme-light.ts                # 신규 — light 테마 source-of-truth (colors.ts에서 re-export)
└── theme-dark.ts                 # 신규 — dark 테마 source-of-truth
└── index.ts                      # 그대로
```

### 2. `theme-light.ts` (신규)

기존 `colors.ts`의 모든 hex 값을 그대로 재구성해 단일 객체로 export. `colors.ts`는 backwards-compat을 위해 그대로 두고, `theme-light.ts`는 build-css.ts 입력 전용.

```typescript
// 모든 light 테마 hex 값을 한 객체로 모은다. 빌드 스크립트의 입력.
import { surfaces, borders, primary, secondary, text } from './colors';
import { statusTokens } from './status';

export const themeLight = {
  surfaces,
  borders,
  primary,
  secondary,
  text,
  statusTokens,
} as const;
```

### 3. `theme-dark.ts` (신규)

다크 테마 hex 값을 새로 정의. 명시적으로 inline.

```typescript
// 다크 테마 source-of-truth. ADR-009 결정값.
// 시작점: ppt의 slate 계열 + WONIK BLUE를 다크에 맞춰 조정.
// 추후 디자이너가 refine 가능 — 단 light와 동일 키 셋을 유지해야 한다.

export const surfacesDark = {
  canvas:        '#0F141C',  // page bg — slate-900 톤
  surface:       '#1A2230',  // card surface — 한 단계 밝게
  surfaceSubtle: '#1F2937',
  surfaceInset:  '#1A2230',
  surfaceMid:    '#2D3748',
  surfaceWhite:  '#FFFFFF',  // pure white는 다크에서도 보존 — 강조 surface로 사용
  darkBase:      '#0A0E15',  // 가장 어두운 surface (panel·sidebar 깊이)
  darkHeader:    '#1A2230',
  darkHover:     '#2D3748',
} as const;

export const bordersDark = {
  light:     '#2D3748',  // 주요 border — light 테마의 #E1E1E4 대응
  mid:       '#3F4A5C',
  dark:      '#5C6677',
  panelDark: '#5C6677',
} as const;

// WONIK BLUE를 다크 모드용으로 조정 — 어두운 배경 위 가독성 위해 약간 밝게.
// 단 brand identity는 보존하므로 hue는 동일, lightness만 ↑.
export const primaryDark = {
  base:     '#4A65B8',  // 다크 위 primary — light의 #273E82를 +20% lightness
  pale:     '#1F2A4D',  // 다크 위 옅은 brand bg
  bg:       '#2A3556',
  stroke:   '#4A65B8',
  selected: '#6B82CC',
} as const;

export const secondaryDark = {
  base: '#ACACAC',  // gray는 양 테마에서 동일 의도 — 변경 없음
} as const;

export const textDark = {
  primary:    '#94A3B8',  // 다크 위 본문 — light의 #71717B 대응 (medium gray, slightly lighter)
  secondary:  '#B0B7C2',
  dim:        '#64748B',
  dark:       '#F1F5F9',  // semantic name "dark" = "강조 텍스트". 다크 모드에서 강조는 밝게 (역설적이지만 의미 일관)
  onDark:     '#303030',  // semantic name "onDark" = "어두운 surface 위 텍스트". 다크 모드에선 surface가 어두우므로 "다크 위" = 밝게... 단 양 테마의 의미가 헷갈릴 수 있으므로 추후 semantic 재명명 검토 (1단계 외)
  onDarkVal:  '#1A2230',
  onDarkDim:  '#5C5C66',
} as const;

// status 토큰 — 일단 light 값 그대로 사용 (semantic 색은 invert 잘 안 함).
// dark 위 contrast 문제 발견 시 별도 step에서 refine.
import { statusTokens } from './status';
export const statusTokensDark = statusTokens;

// 구조 export — build-css.ts가 themeLight과 동일 shape으로 받도록.
export const themeDark = {
  surfaces:      surfacesDark,
  borders:       bordersDark,
  primary:       primaryDark,
  secondary:     secondaryDark,
  text:          textDark,
  statusTokens:  statusTokensDark,
} as const;
```

### 4. `build-css.ts` 수정

현재 단일 `:root { ... }` 블록 emit → 두 블록 emit으로 변경. 테마 비의존 토큰(spacing/radius/typography/componentSize)은 `:root`에만 한 번.

```typescript
// build-css.ts 새 구조 (개략 — 기존 함수 재사용 + 블록 분기)

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { themeLight } from '../src/theme-light';
import { themeDark } from '../src/theme-dark';
import {
  fontFamily, fontSize, fontWeight, lineHeight,
} from '../src/typography';
import { space, radius, componentSize } from '../src/spacing';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(__dirname, '../dist/tokens.css');

const camelToKebab = (s: string): string =>
  s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

// theme별 색 변수만 emit하는 함수
function colorVars(theme: typeof themeLight | typeof themeDark): string[] {
  const lines: string[] = [];
  const push = (name: string, value: string) => lines.push(`  ${name}: ${value};`);

  // Surfaces
  for (const [key, value] of Object.entries(theme.surfaces)) {
    push(`--color-${camelToKebab(key)}`, value as string);
  }
  // Borders
  for (const [key, value] of Object.entries(theme.borders)) {
    if (key === 'light') push('--color-border', value as string);
    else push(`--color-border-${camelToKebab(key)}`, value as string);
  }
  // Primary
  for (const [key, value] of Object.entries(theme.primary)) {
    if (key === 'base') push('--color-primary', value as string);
    else push(`--color-primary-${camelToKebab(key)}`, value as string);
  }
  // Secondary
  push('--color-brand-secondary', theme.secondary.base);
  // Text
  for (const [key, value] of Object.entries(theme.text)) {
    push(`--color-text-${camelToKebab(key)}`, value as string);
  }
  // Status
  for (const [stateKey, group] of Object.entries(theme.statusTokens)) {
    const stateKebab = camelToKebab(stateKey);
    for (const [propKey, value] of Object.entries(group as Record<string, string>)) {
      push(`--color-status-${stateKebab}-${propKey}`, value);
    }
  }
  return lines;
}

// 테마 비의존 변수 (양 테마 공통 — :root 안에 한 번만)
function staticVars(): string[] {
  const lines: string[] = [];
  const push = (name: string, value: string | number) => lines.push(`  ${name}: ${value};`);
  push('--font-family', fontFamily.base);
  for (const [key, value] of Object.entries(fontSize)) push(`--font-size-${camelToKebab(key)}`, value);
  for (const [key, value] of Object.entries(fontWeight)) push(`--font-weight-${camelToKebab(key)}`, String(value));
  push('--line-height', String(lineHeight.tight));
  for (const [key, value] of Object.entries(space)) push(`--space-${key}`, value);
  for (const [key, value] of Object.entries(radius)) {
    if (key === 'panelHeader') push('--radius-panel-header', value);
    else push(`--radius-${camelToKebab(key)}`, value);
  }
  for (const [key, value] of Object.entries(componentSize)) push(`--${camelToKebab(key)}`, value);
  return lines;
}

const lightLines = colorVars(themeLight);
const darkLines  = colorVars(themeDark);
const sharedLines = staticVars();

const css = `:root, [data-theme="light"] {
${lightLines.join('\n')}

  /* Theme-independent tokens (typography, spacing, radius, component sizes) */
${sharedLines.join('\n')}
}

[data-theme="dark"] {
${darkLines.join('\n')}
}
`;

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, css, 'utf8');

const totalVars = lightLines.length + darkLines.length + sharedLines.length;
console.log(`✓ wrote ${outPath} (${totalVars} variables across light/dark)`);
```

### 5. 출력 검증 — `dist/tokens.css` 형태

빌드 후 출력은 다음과 같은 형태여야 한다:

```css
:root, [data-theme="light"] {
  --color-canvas: #E8E8EA;
  --color-surface: #FEFEFE;
  /* ... light values ... */
  --color-primary: #273E82;
  /* ... */

  /* Theme-independent tokens (typography, spacing, radius, component sizes) */
  --font-family: 'Segoe UI', 'Inter', system-ui, sans-serif;
  --space-1: 4px;
  /* ... */
}

[data-theme="dark"] {
  --color-canvas: #0F141C;
  --color-surface: #1A2230;
  /* ... dark values ... */
  --color-primary: #4A65B8;
  /* ... */
}
```

### 6. `index.ts` 변경 (선택)

`themeLight`/`themeDark` 객체를 외부에서 사용할 일은 거의 없지만, future migration tooling이나 docs 사이트에서 활용 가능하도록 export 검토. 1단계는 export하지 않음 — internal API로 두고 빌드 스크립트만 사용.

## Acceptance Criteria

```bash
cd C:/Users/ohjih/design_system

# 토큰 빌드
pnpm -F @wonik/tokens build       # tokens.css 재생성

# tokens.css에 두 테마 블록이 모두 존재
grep -q ":root, \[data-theme=\"light\"\]" packages/tokens/dist/tokens.css
grep -q "\[data-theme=\"dark\"\]" packages/tokens/dist/tokens.css

# WONIK BLUE light 보존
grep -q "#273E82" packages/tokens/dist/tokens.css
# dark primary 추가됨
grep -q "#4A65B8" packages/tokens/dist/tokens.css

# 변수 키 1:1 매칭 — light에 있는 --color-* 키가 dark에도 모두 있어야 함
# (간단 sanity: 양쪽 블록의 변수 개수 비교)
LIGHT_VARS=$(grep -c "  --color-" packages/tokens/dist/tokens.css || true)
# 두 블록 모두 카운트하므로 light 블록만의 정확한 비교는 step 1 이후 검증으로 미루고,
# 여기서는 "양쪽 블록이 존재하고 dark에 최소 20개 이상 변수가 있다"로 sanity check
DARK_BLOCK=$(awk '/\[data-theme="dark"\]/,/^}/' packages/tokens/dist/tokens.css)
echo "$DARK_BLOCK" | grep -c "  --color-" | awk '{exit ($1 < 20)}'

# 테마 비의존 변수는 :root 블록에만 한 번 (font-family·space·radius)
grep -c "^  --font-family:" packages/tokens/dist/tokens.css | awk '{exit ($1 != 1)}'

# 기존 컴포넌트 빌드·테스트 회귀 0 (테마 변환은 컴포넌트에 아직 영향 없음)
pnpm -F @wonik/web build
pnpm -F @wonik/web test --run 2>&1 | tail -20

# 새 source 파일 존재
test -f packages/tokens/src/theme-light.ts
test -f packages/tokens/src/theme-dark.ts
```

위 명령이 모두 통과해야 한다.

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 체크리스트:
   - `tokens.css`에 `:root, [data-theme="light"]` + `[data-theme="dark"]` 두 블록이 정확히 emit?
   - 두 블록의 변수 키가 1:1 매칭? (다크에 빠진 키 없는지 sanity check)
   - 테마 비의존 토큰(font/space/radius/componentSize)은 light 블록에만 한 번?
   - WONIK BLUE light 값 `#273E82` 보존?
   - 다크 primary `#4A65B8` 등 ADR-009 시작점 값 정확히 적용?
   - 기존 79개 테스트 전부 통과? (이 step은 컴포넌트에 영향 없어야 함)
3. 결과에 따라 `phases/04-theme-tokens/index.json`의 step 0을 업데이트:
   - 성공 → `"status": "completed"`, `"summary": "@wonik/tokens에 light/dark 양 테마 CSS 인프라 추가. theme-light.ts/theme-dark.ts source-of-truth, build-css.ts가 :root[data-theme=light/dark] 두 블록 emit. 컴포넌트 회귀 0 (TS 토큰 reference 변경은 step 1)."`
   - 실패 → `"status": "error"`, `"error_message": "구체 사유"`

## 금지사항

- **컴포넌트 코드 수정 금지** — 이번 step은 토큰 인프라만. `packages/web/` 변경 0.
- **TypeScript 토큰 export 형태 변경 금지** — `colors.ts`의 `primary.base = '#273E82'` 그대로. `var(...)` 변환은 step 1.
- **다크 모드 값을 광고용으로 마음껏 바꾸지 마라** — 본 step의 시작점 값(ADR-009 + 본 spec의 표)을 정확히 사용. 디자이너 refine은 후속.
- **기존 dist/tokens.css 출력 포맷의 비테마 부분(spacing·radius·typography 변수명)을 바꾸지 마라** — 호환성 보존.
- **새 패키지 만들지 마라** (`@wonik/themes` 같은 분리 금지) — `@wonik/tokens` 안에서.
- **Style Dictionary 같은 외부 도구 도입 금지** — 자체 build-css.ts 확장으로.
- **status 토큰을 light/dark별로 다르게 정의하지 마라** — 1단계는 동일 값. 추후 contrast issue 발견 시 별도 step.
- **AI 슬롭 anti-pattern 금지** (gradient·glass·glow 등 — 토큰에 등장 자체가 없어야).
- **기존 테스트를 깨뜨리지 마라.**
