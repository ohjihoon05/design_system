# Step 1: tokens-focus-and-border-strong

## 작업

ADR-011이 결정한 토큰을 emit한다. design_system 코드 변경:

1. **`packages/tokens/scripts/build-css.ts`** — Interface Variables (ADR-010) section에 alias 2개 추가 (light/dark 양쪽 emit):
   - `--color-focus: var(--color-primary);` (focus ring color, host override hook)
   - `--color-border-strong: var(--color-border-mid);` (hover state internal fallback)
2. **`packages/tokens/src/colors.ts`** — `interfaceColors`에 새 키 추가:
   - `focus: 'var(--color-focus, var(--color-primary))'` (host override 미정의 시 우리 primary로 자연 fallback)

### 결정 (spec 명확화)

- `--color-border-strong`은 **interface variable이 아님** — 우리 internal hover state fallback일 뿐. ADR-010의 6 + ADR-011의 1 = **interface variable 7개**라는 결정과 정합. host가 override 안 함이 의도 (hover state는 host가 own 안 함).
- `--color-border-strong`의 값을 `--color-border-mid`로 alias한 이유: 현재 우리 border scale에 "stronger than mid"가 없음. Light theme `borders.dark`(`#5C5C5C`)는 너무 강함. mid를 그대로 쓰면 hover 시 시각 변화 0이지만, 향후 별도 hex token 추가는 별도 phase. 일단 alias로 인터페이스만 갖춤.

## 변경 위치

```
packages/tokens/scripts/build-css.ts    # Interface Variables section 확장 (2 alias 추가)
packages/tokens/src/colors.ts            # interfaceColors.focus 추가
```

## 빌드 + 검증

```bash
pnpm -F @wonik/tokens build
# dist/tokens.css에 --color-focus, --color-border-strong 추가 emit (light + dark)
```

## Acceptance Criteria

```bash
cd C:/Users/ohjih/design_system

pnpm -F @wonik/tokens build

# alias 2개 light + dark 양쪽
grep -c "^  --color-focus:" packages/tokens/dist/tokens.css            # 2
grep -c "^  --color-border-strong:" packages/tokens/dist/tokens.css    # 2

# 값 검증
grep -E "^  --color-focus:\s+var\(--color-primary\)" packages/tokens/dist/tokens.css
grep -E "^  --color-border-strong:\s+var\(--color-border-mid\)" packages/tokens/dist/tokens.css

# Step 1 ADR-010 결과 보존 (회귀 0)
grep -q "^  --color-bg:" packages/tokens/dist/tokens.css
grep -q "^  --color-text:" packages/tokens/dist/tokens.css

# interfaceColors.focus TS export
grep -q "focus" packages/tokens/dist/index.mjs
grep -q "interfaceColors" packages/tokens/dist/index.d.ts

# 컴포넌트 코드 미변경 (step 2의 영역)
git diff packages/web/src/ | wc -l    # 0
```

## 검증 절차

1. AC 커맨드 실행.
2. 체크리스트:
   - alias 2개 light + dark 양쪽 emit?
   - 기존 ADR-010 interface variable 3개 (bg/text/text-muted) 보존?
   - interfaceColors.focus TS export 노출?
   - 컴포넌트 코드 변경 0?
3. 성공 → `phases/10-form-polish/index.json` step 1 → completed.

## 금지사항

- **`@wonik/web` 컴포넌트 변경 금지** — step 2의 영역.
- **interface variable 7개 외 추가 금지** — `--color-placeholder` 격상 안 함 (ADR-011 결정 6 그대로).
- **`--color-border-strong`을 interface variable로 격상 금지** — host가 own 안 하는 internal fallback.
- **theme-light/dark hex 변경 금지** — 색 정체성 그대로.
- **TS export 기존 `surfaces`/`text`/`borders` 변경 금지** — 추가만.
- **AI 슬롭 anti-pattern 도입 0**.
- **React 19-only API 금지** (tokens엔 React 없지만 일관성).
