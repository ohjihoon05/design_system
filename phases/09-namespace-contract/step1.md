# Step 1: tokens-interface-variables

## 작업

ADR-010이 결정한 interface variable 6개 중 우리 `tokens.css`가 아직 emit 안 하는 **3개**(`--color-bg`, `--color-text`, `--color-text-muted`)를 default로 추가 emit하고, `@wonik/tokens`의 TypeScript export에 `interfaceColors` named export를 추가해 컴포넌트가 cascade fallback 패턴으로 reference할 수 있게 한다.

### 현재 상태 (검증 완료, `dist/tokens.css` 기준)

| Interface var | 현재 emit 여부 | 비고 |
|------|------|------|
| `--color-bg` | ❌ | `--color-canvas`만 emit |
| `--color-surface` | ✅ | `theme.surfaces.surface`로 자연 emit |
| `--color-border` | ✅ | `theme.borders.light → --color-border`로 자연 emit |
| `--color-text` | ❌ | `--color-text-dark`만 emit |
| `--color-text-muted` | ❌ | `--color-text-dim`만 emit |
| `--color-primary` | ✅ | `theme.primary.base → --color-primary`로 자연 emit |

추가할 alias 3개 (light·dark 양쪽):
- `--color-bg: var(--color-canvas);`
- `--color-text: var(--color-text-dark);`
- `--color-text-muted: var(--color-text-dim);`

### 변경 위치

1. **`packages/tokens/scripts/build-css.ts`**:
   - `colorVarLines(theme)` 함수 끝에 새 section `Interface Variables (ADR-010)` 추가
   - 위 3개 alias `push()` 호출 추가
   - light·dark 양쪽 호출에서 동일 emit (alias value는 theme-independent)

2. **`packages/tokens/src/colors.ts`**:
   - 새 `interfaceColors` named export 추가:
     ```typescript
     export const interfaceColors = {
       bg: 'var(--color-bg, var(--color-canvas))',
       surface: 'var(--color-surface, var(--color-surface-white))',
       border: 'var(--color-border, var(--color-border-mid))',
       text: 'var(--color-text, var(--color-text-dark))',
       textMuted: 'var(--color-text-muted, var(--color-text-dim))',
       primary: 'var(--color-primary)',
     } as const;
     ```
   - 기존 `surfaces`/`borders`/`text`/`primary` export는 **그대로 유지** (step 2에서 컴포넌트별로 점진 이전)

3. **`packages/tokens/src/index.ts`**:
   - `interfaceColors` re-export 추가

### 빌드 + 검증

```bash
pnpm -F @wonik/tokens build
# dist/tokens.css가 새 alias 3개 포함, light + dark 양쪽
```

## Acceptance Criteria

```bash
cd C:/Users/ohjih/design_system

# build 성공
pnpm -F @wonik/tokens build

# dist/tokens.css에 interface variable 3개 신규 추가됨
grep -c "^  --color-bg:" packages/tokens/dist/tokens.css           # 2 (light + dark)
grep -c "^  --color-text:" packages/tokens/dist/tokens.css         # 2
grep -c "^  --color-text-muted:" packages/tokens/dist/tokens.css   # 2

# 새 alias가 var() reference 형태인지
grep -E "^  --color-bg:\s+var\(--color-canvas\)" packages/tokens/dist/tokens.css
grep -E "^  --color-text:\s+var\(--color-text-dark\)" packages/tokens/dist/tokens.css
grep -E "^  --color-text-muted:\s+var\(--color-text-dim\)" packages/tokens/dist/tokens.css

# 기존 emit 보존 (회귀 0)
grep -q "^  --color-canvas:" packages/tokens/dist/tokens.css
grep -q "^  --color-surface:" packages/tokens/dist/tokens.css
grep -q "^  --color-text-dark:" packages/tokens/dist/tokens.css
grep -q "^  --color-text-dim:" packages/tokens/dist/tokens.css

# TypeScript export
grep -q "interfaceColors" packages/tokens/dist/index.mjs
grep -q "interfaceColors" packages/tokens/dist/index.js
grep -q "interfaceColors" packages/tokens/dist/index.d.ts

# 기존 export 보존
grep -q "surfaces" packages/tokens/dist/index.d.ts
grep -q "text" packages/tokens/dist/index.d.ts

# 컴포넌트 코드 미변경 (step 2의 영역)
git diff packages/web/src/ | wc -l    # 0
```

## 검증 절차

1. AC 커맨드 실행.
2. 체크리스트:
   - `dist/tokens.css` light·dark 양쪽에 새 alias 3개 존재?
   - alias가 우리 internal token으로 reference (cascade가 작동하려면)?
   - 기존 emit 회귀 0?
   - `interfaceColors` TypeScript export 노출됨?
   - 컴포넌트 코드 변경 0?
3. 성공 → `phases/09-namespace-contract/index.json` step 1 → completed.

## 금지사항

- **`@wonik/web` 컴포넌트 코드 변경 금지** — step 2의 영역.
- **기존 `surfaces`/`borders`/`text`/`primary` export 변경 금지** — 기존 컴포넌트 회귀 위험. 새 export(`interfaceColors`) 추가만.
- **theme-light.ts/theme-dark.ts hex 값 변경 금지** — default 색 그대로.
- **새 토큰 추가 금지** — interface variable 6개 외 다른 host-friendly 이름 추가는 본 phase 범위 외.
- **internal token rename 금지** — `--color-surface-white` 등 그대로. ADR-010 트레이드오프 4 그대로.
- **AI 슬롭 anti-pattern 도입 0**.
- **React 19-only API 금지** (tokens 패키지엔 React 없지만 일관성).
