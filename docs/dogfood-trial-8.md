# Dogfood Trial 8: Home.tsx — Textarea 1개 + Button 3개 (verbosity chip 5개 포함) 적용

**날짜**: 2026-05-15
**대상 product**: ppt (Factory PPT)
**적용 범위**: `frontend/src/pages/Home.tsx`의 `GenerationForm` 안 4개 element
**목표**: trial 7에서 packaging contract가 정상화된 상태에서, **순수한 컴포넌트 substitution이 host 코드를 어떻게 바꾸는지** 측정. 즉, 인프라 검증이 아니라 *일상 사용*의 첫 dogfood.

## 적용 방식

import 1줄에 `Textarea` 추가 (`Spinner, Button, Alert, Textarea`).

### Sub 1 — `<textarea>` → `<Textarea>` (prompt 입력)

```tsx
// BEFORE
<textarea
  id="prompt"
  value={prompt}
  onChange={...}
  placeholder="..."
  rows={4}
  maxLength={PROMPT_MAX_LENGTH}
  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent resize-none transition-shadow"
  required
  aria-describedby="prompt-hint"
/>

// AFTER
<Textarea
  id="prompt"
  value={prompt}
  onChange={...}
  placeholder="..."
  rows={4}
  maxLength={PROMPT_MAX_LENGTH}
  required
  aria-describedby="prompt-hint"
/>
```

→ 긴 className(14개 utility class) 제거. Textarea가 토큰 기본값 + focus 처리 자동.

### Sub 2 — `<button>` → `<Button variant="outline">` (AI 다듬기)

```tsx
// BEFORE: className 1줄 + style={{ background, color, border }} 4줄
<button className="..." style={{ background: "var(--color-surface)", color: "var(--color-primary)", border: "1px solid var(--color-primary)" }}>...</button>

// AFTER
<Button type="button" variant="outline" size="sm" onClick={...} disabled={...}>
  <svg style={{ marginRight: 6 }}>...</svg>
  AI와 주제 다듬기
</Button>
```

→ outline variant가 색·border·hover·disabled 다 책임. host는 의도(`variant="outline"`)만 선언.

### Sub 3 — `<button>` → `<Button variant="danger">` (PDF 삭제)

```tsx
// BEFORE
<button className="ml-2 text-xs text-red-400 hover:text-red-300 underline">삭제</button>

// AFTER
<Button type="button" variant="danger" size="sm" style={{ marginLeft: 8 }}>삭제</Button>
```

→ `red-400`/`red-300` raw Tailwind palette → Button danger variant (status.error 토큰 경유).

### Sub 4 — `<button>` × 5 → `<Button variant>` × 5 (verbosity chip selector)

```tsx
// BEFORE: 5줄짜리 ternary className (선택 상태에 따라 다른 색·border)
<button className={`... ${verbosity === opt.value ? "border-[...] bg-[...]/15 text-[...]" : "border-[...] bg-[...] text-[...] hover:bg-[...]"}`}>{opt.label}</button>

// AFTER
<Button variant={verbosity === opt.value ? "primary" : "outline"} size="sm">{opt.label}</Button>
```

→ "선택됨/안됨" 상태 표현이 `primary` ↔ `outline` variant 스왑으로 단순화. 5개 chip이 4개 atom variant로 표현됨.

### Vite HMR

```
[vite] (client) hmr update /src/pages/Home.tsx (×4)
```
타입 에러 0, import 에러 0, 런타임 에러 0.

## 발견사항

### F5 — 컴포넌트 substitution은 라인 절감보다 *결정 절감*이 본질

총 라인 수 변화는 4 element 합쳐서 약 -12줄(약 18%). 크지 않다. **진짜 변화는 host 코드에서 사라진 것들**:

| 사라진 것 | 양 |
|---|---|
| Tailwind utility class chain (`px-3 py-1.5 rounded-md transition-colors disabled:opacity-40 ...`) | 4 element 모두 |
| `style={{ background, color, border }}` inline 객체 | 1개 |
| 색 결정 (`var(--color-primary)`, `bg-red-500/10` 등) | 7곳 |
| selected/unselected 상태별 className ternary | 1개 (5 chip 분량) |

→ host 개발자가 매번 "이 button 어떤 색?" "border-radius 얼마?" "hover 색은?"을 결정 안 해도 됨. **variant 이름만 고름**. 디자인 시스템의 진짜 가치.

### F6 — `variant="primary"` ↔ `variant="outline"` 토글이 chip selector를 자연스레 흡수

verbosity 같은 5-chip selector를 위해 별도 `ToggleGroup` atom이 필요한지 의심해봤는데, **trial 8에서 Button variant 토글로 충분**. Stack `direction="row" gap={2}` 없이 `grid grid-cols-5 gap-1.5`(host의 layout 결정)만 두면 됨.

→ ToggleGroup 추가는 **3회 evidence 규칙으로 trigger 시점 미루기**. trial 5 + trial 8에서 2회 누적, 1회 더 모이면 그때 atom화 결정.

### F7 — host 코드에 raw px(`marginRight: 6`, `marginLeft: 8`) 들어감

Button 안의 svg와 텍스트 사이 spacing, 그리고 PDF 삭제 button 앞 spacing을 inline `style={{ marginRight: 6 }}` / `style={{ marginLeft: 8 }}`로 박았다. 이건 **host 코드라 CRITICAL 위반은 아님** (`@wonik/tokens` 컴포넌트 내부가 아니라 ppt 측). 그래도 이상적이지 않음.

→ 두 가지 후속 옵션:
  - (a) host에서 `import { space } from '@wonik/tokens'` 후 `marginRight: space[3]` 사용 (ppt 측 결정)
  - (b) `Stack direction="row" gap={2}` 패턴으로 wrap하면 inline px 자체가 사라짐 (더 이상적)

본 trial에서는 그대로 두고 넘김. 본질 패턴 발견만 기록.

### F8 — Dockerfile 1줄 추가 (`COPY vendor/ vendor/`)는 trial 7의 미해결 잔여물

ppt가 Docker 빌드 시 `vendor/` 폴더를 image context에 포함시키지 않으면 `pnpm install`이 vendor tarball을 못 찾음. trial 7 검증 당시 dev에서만 성공했고 production Docker 빌드는 안 돌렸음. trial 8 작업 도중 발견.

→ 같이 commit. trial 7에 속하지만 별도 commit 아니라 trial 8 같이 묶음.

## 결정

- **ToggleGroup atom 추가 보류** — evidence 2/3. 1회 더 host에서 같은 패턴 발견되면 그때 phase 18-toggle-group으로 진입.
- **host의 inline px(`marginRight/marginLeft`) 정리는 후속 trial로 미룸** — 본 trial은 substitution 자체 검증에 집중. layout 정련은 별도 cycle.
- **Dockerfile vendor copy는 trial 8에 묶음** — packaging contract의 production 환경 검증으로 의미 부여.

## 가설 검증

| 가설 | 검증 방법 | 결과 |
|---|---|---|
| H5: 컴포넌트 substitution이 host 코드 라인을 크게 줄인다 | 라인 카운트 비교 | △ 부분 참 — 약 -18%, 라인 절감보다 결정 절감이 더 큰 가치 |
| H6: 5-chip selector에 별도 ToggleGroup atom 필요 | Button variant 토글로 대체 시도 | ❌ (현재) — 충분히 표현됨. 3회 누적까진 보류 |
| H7: 컴포넌트 import만으로 색·spacing이 host 자체 토큰과 자연스레 어울린다 | 시각 확인 | ✅ 부분 참 — Alert/Button/Textarea 모두 ppt cascade에 자연 합류. 단, 시각 정체성 통일(WONIK BLUE 적용)은 별도 trial 9로 보류 |

## 후속 작업 (미완 / 후보)

- [ ] (트리거 시) ToggleGroup atom (evidence 3회 누적 후)
- [ ] host 측 inline px → Stack 또는 token 사용 (별도 cycle)
- [ ] 시각 정체성 통일(trial 9): `tokens.css` import 추가 + ppt index.css 4개 interface variable 제거 — 사용자 결정 후
- [ ] 다음 host page dogfood 대상 결정 (Outline / Presentation / Components 중)
