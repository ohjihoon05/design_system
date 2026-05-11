# Step 2: components-cascade-reference

## 작업

`@wonik/web` 컴포넌트의 inline style에서 **ADR-010 interface variable에 매핑되는 internal token**을 `interfaceColors.*`로 갱신한다. cascade fallback 패턴(`var(host, fallback)`)이 자동 적용되어 host가 같은 이름 변수를 정의하면 host 우선, 미정의 시 우리 internal로 fallback.

### 매핑 규칙 (interface로 변경할 vs 그대로 internal 유지할)

✅ **interface로 변경**: 의미가 ADR-010 interface variable과 일치할 때
- 일반 form 컨트롤 text → `interfaceColors.text`
- 일반 form 컨트롤 background (panel·card·input 배경) → `interfaceColors.surface`
- 일반 border → `interfaceColors.border`
- placeholder/dim text → `interfaceColors.textMuted`
- brand primary → `interfaceColors.primary`

❌ **그대로 internal 유지**: 의미가 interface와 다를 때
- "primary 위 흰 텍스트" (Button primary variant `color`) — interface variable 미정의 영역. `surfaces.surfaceWhite` 그대로.
- "thumb 흰 점" (Switch thumb background) — 의미상 surface 아님. `surfaces.surfaceWhite` 그대로.
- 매핑 안 된 internal token (`text.primary`, `text.secondary`, `borders.dark` 등) — 그대로.

### 컴포넌트별 변경 라인 (예상)

| 파일 | 변경 항목 | 라인 |
|------|------|------|
| `Button/Button.tsx` | `background: primary.base` (line 18) → `interfaceColors.primary` <br> `background: surfaces.surface` (line 23) → `interfaceColors.surface` <br> `border: 1px solid ${borders.mid}` (line 25) → `interfaceColors.border` <br> `color: primary.base` (line 34) → `interfaceColors.primary` <br> `border: 1px solid ${primary.base}` (line 35) → `interfaceColors.primary` <br> ❌ `color: surfaces.surfaceWhite` (line 19, 39) — primary-on-text, 그대로 | 5 |
| `Input/Input.tsx` | `color: text.dark` (line 25) → `interfaceColors.text` <br> `background: surfaces.surfaceWhite` (line 26) → `interfaceColors.surface` <br> `border: 1px solid ${borders.mid}` (line 27) → `interfaceColors.border` <br> `color: text.dim` (line 41) → `interfaceColors.textMuted` | 4 |
| `Textarea/Textarea.tsx` | `color: text.dark` (line 31) → `interfaceColors.text` <br> `background: surfaces.surfaceWhite` (line 32) → `interfaceColors.surface` <br> `border: 1px solid ${borders.mid}` (line 33) → `interfaceColors.border` <br> `color: text.dim` (line 49) → `interfaceColors.textMuted` | 4 |
| `Spinner/Spinner.tsx` | `borderColor: borders.mid` (line 47) → `interfaceColors.border` <br> `borderTopColor: primary.base` (line 48) → `interfaceColors.primary` | 2 |
| `Switch/Switch.tsx` | `border: 1px solid ${borders.mid}` (line 97) → `interfaceColors.border` <br> ❌ `background: surfaces.surfaceWhite` (line 111) — thumb 흰 점, 그대로 | 1 |
| `Radio/Radio.tsx` | `accentColor: primary.base` (line 19) → `interfaceColors.primary` | 1 |
| `Checkbox/Checkbox.tsx` | `accentColor: primary.base` (line 19) → `interfaceColors.primary` | 1 |
| `Text/Text.tsx` | `brand: primary.base` (line 20) → `interfaceColors.primary` | 1 |

총 약 **19 라인** 변경.

### 테스트 갱신

각 컴포넌트 테스트가 inline style의 CSS variable 문자열을 정확히 assert하면 갱신 필요. 예:
- 기존: `expect(el).toHaveStyle({background: 'var(--color-surface-white)'})`
- 갱신: `expect(el).toHaveStyle({background: 'var(--color-surface, var(--color-surface-white))'})`

또는 더 robust한 assertion으로:
- `expect(el).toHaveStyle({background: interfaceColors.surface})` (테스트가 `interfaceColors`를 import해 비교)

후자가 토큰 source-of-truth 일치 + 미래 변경에 robust. 점진 적용.

### 빌드 + 테스트

```bash
pnpm -F @wonik/tokens build
pnpm -F @wonik/web build
pnpm -F @wonik/web test --run
```

기존 약 163개 테스트 모두 통과해야 함 (assertion 일부 갱신 후).

## Acceptance Criteria

```bash
cd C:/Users/ohjih/design_system

# 빌드 성공
pnpm -F @wonik/tokens build
pnpm -F @wonik/web build

# 컴포넌트 8개 모두 interfaceColors import
grep -q "interfaceColors" packages/web/src/Button/Button.tsx
grep -q "interfaceColors" packages/web/src/Input/Input.tsx
grep -q "interfaceColors" packages/web/src/Textarea/Textarea.tsx
grep -q "interfaceColors" packages/web/src/Spinner/Spinner.tsx
grep -q "interfaceColors" packages/web/src/Switch/Switch.tsx
grep -q "interfaceColors" packages/web/src/Radio/Radio.tsx
grep -q "interfaceColors" packages/web/src/Checkbox/Checkbox.tsx
grep -q "interfaceColors" packages/web/src/Text/Text.tsx

# 매핑 잘못된 케이스 회귀 — primary-on-text·thumb는 그대로
grep -q "surfaces.surfaceWhite" packages/web/src/Button/Button.tsx       # 유지 (Button primary text)
grep -q "surfaces.surfaceWhite" packages/web/src/Switch/Switch.tsx       # 유지 (thumb)

# 빌드 산출물에 cascade pattern 존재 (적용 증거)
grep -q "var(--color-surface, var(--color-surface-white))" packages/web/dist/index.mjs
grep -q "var(--color-primary)" packages/web/dist/index.mjs

# 모든 테스트 통과
pnpm -F @wonik/web test --run

# tokens 변경 0 (step 1 결과 보존)
git diff packages/tokens/ | wc -l    # 0

# AI 슬롭 anti-pattern 0
! grep -i -E "backdrop-filter|linear-gradient|box-shadow.*glow|rounded-2xl" packages/web/src/Button/Button.tsx packages/web/src/Input/Input.tsx packages/web/src/Textarea/Textarea.tsx
```

## 검증 절차

1. AC 커맨드 실행.
2. 체크리스트:
   - 컴포넌트 8개 모두 `interfaceColors` import?
   - 매핑 예외(`surfaces.surfaceWhite` of Button text·Switch thumb) 보존?
   - 테스트 약 163건 모두 통과?
   - prop signature 변경 0? (breaking 0)
   - 토큰 패키지 변경 0?
3. 성공 → `phases/09-namespace-contract/index.json` step 2 → completed.

## 금지사항

- **prop signature 변경 금지** — 모든 컴포넌트의 ButtonProps·InputProps 등 그대로. breaking 0.
- **새 토큰 추가 금지** — interface variable 6개 외 다른 host-friendly 이름 추가 금지.
- **`surfaces`/`text`/`borders` 기존 export 변경 금지** — step 1의 영역. 기존 export 그대로 두고 신규 컴포넌트는 `interfaceColors`만 사용.
- **하드코딩 hex 도입 0** — 모든 색 reference는 토큰 export 통해서만.
- **AI 슬롭 anti-pattern 도입 0**.
- **React 19-only API 금지** (dual peer 보존).
- **컴포넌트 prop·variant·size 의미 변경 금지** — reference 패턴만 변경, 의도 그대로.
- **테스트 assertion 임의 제거 금지** — 변경하더라도 의미 같게 유지.
- **storybook·sandbox 컴포넌트 변경 금지** (필요 시 별도 step).
