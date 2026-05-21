# Phase 14 — Badge 컴포넌트 (spec.md)

> autopilot PHASE 1 (SPECIFY) 산출물. Trial 4 + Trial 5 누적 4회 evidence(`docs/dogfood-trial-4.md`·`dogfood-trial-5.md`)로 needs ✅ 거의 확정된 Badge를 `@wonik/web`에 1차 추가한다.

## 1. 목표

`@wonik/web`에 `Badge` 컴포넌트를 추가해 host product에서 반복되는 *small inline label/count pill* 패턴을 디자인 시스템이 책임지게 한다.

- **Trial 4 evidence**: OutlineCard layout 표시 3회 (subtle label 패턴).
- **Trial 5 evidence**: Home slideCount "{N}장" 1회 (primary-emphasized count pill).
- **누적 4회 = 디자인 시스템 영역** — 한 페이지 4회 반복(Card)이든, 여러 페이지 4회 누적(Badge)이든 동일 threshold.
- **목표 시각 형태**: 작은 rounded-rectangle pill + 작은 padding + 작은 fontSize. variant=primary는 strong attention, variant=neutral는 subtle.
- **계약**: ADR-010 cascade — `interfaceColors.primary` / `interfaceColors.surface` / `interfaceColors.text` / `interfaceColors.border` 사용. host 변수 정의 시 자동 흡수.

## 2. 사용자 (누가 쓰나)

- **1차**: 원익IPS 사내 React 개발자. `import { Badge } from '@wonik/web'` 한 줄로 사용.
- **첫 dogfood 사용처**: ppt `OutlineCard.tsx` layout 표시 + `Home.tsx` slideCount "{N}장". 다음 trial 6에서 본 Badge로 교체.
- **2차**: 향후 사내 web service들. 상태 라벨, 카운터, 카테고리 태그 등 동일 패턴 예상.

## 3. 범위 (in-scope)

`packages/web/src/Badge/`:
- `Badge.tsx` — 컴포넌트 본체. polymorphic `as` (default `span`).
- `Badge.test.tsx` — Vitest + @testing-library/react. TDD 순서.
- `types.ts` — `BadgeProps`, `BadgeVariant` 정의 + named export.
- `index.ts` — re-export.

`packages/web/src/index.ts`:
- `export { Badge } from './Badge'` + type re-export 추가.

`apps/web-sandbox/`:
- Badge variant 매트릭스 시각 검증 섹션 추가 (Card 패턴 그대로).

`docs/ADR.md`:
- **ADR-016: Badge 컴포넌트 — primary/neutral × inline-flex span + interfaceColors 의존** 추가.

`docs/PRD.md`:
- "1단계 진행 현황" 표에 Phase 14 행 추가.

`phases/14-badge/`:
- `spec.md` (본 문서) / `plan.md` / `tasks.md` / `step{0,1,...}.md` / `index.json`.

Changesets:
- `.changeset/*-badge.md` — minor bump (`@wonik/web`).

### 컴포넌트 API (signature 확정)

```tsx
type BadgeVariant = 'primary' | 'neutral';

interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, never> {
  variant?: BadgeVariant;   // default 'neutral'
  as?: ElementType;          // default 'span'
  // children, className, style 등 native 통과
}
```

**default variant = `neutral`** — Trial 4 layout label 패턴(누적 3회)이 더 보편. slideCount는 `variant="primary"` 명시.

시각 매핑 (`@wonik/tokens` 토큰만 사용 — hex/px 리터럴 0):

| variant | background | color (text) | border |
|---|---|---|---|
| `neutral` (default) | `interfaceColors.surface` | `interfaceColors.text` | `1px solid ${interfaceColors.border}` |
| `primary` | `interfaceColors.primary` | `surfaces.surfaceWhite` | none |

공통 시각 토큰:

| 속성 | 토큰 | 값 |
|---|---|---|
| padding | `${space[1]} ${space[3]}` | 4px 8px |
| borderRadius | `radius.sm` | 5px |
| fontSize | `fontSize.label` | 12px |
| fontWeight | `fontWeight.medium` | 500 |
| lineHeight | `lineHeight.tight` | 1 |
| display | `inline-flex` | — |
| alignItems | `center` | — |
| fontVariantNumeric | `tabular-nums` | — (count 숫자 정렬용) |

## 4. 범위 외 (out-of-scope) — "이건 안 한다"

- **size prop** (sm/md/lg) — Trial 4+5 evidence는 sm 단일 사이즈. 추가는 needs 부상 후 minor bump. **size prop 0**.
- **semantic 색 variant** (`info`/`success`/`warning`/`danger`) — Trial 4+5 needs 0. `status` 토큰 있지만 사용처 부재. YAGNI. needs 부상 시 추가.
- **icon slot** (`leadingIcon`/`trailingIcon` prop) — needs 0. `children`으로 자유롭게 `<Badge><svg/>label</Badge>` 가능.
- **dismissable Badge** (`onClose` X 버튼) — needs 0.
- **count truncation** (`max={99}` "99+" 표기) — needs 0.
- **dogfood trial 6** — Phase 14 closure 후 별도 phase. 이번 phase는 컴포넌트 도입까지만.
- **AI 슬롭 anti-pattern** — `rounded-2xl`, gradient bg, glow shadow, 보라/인디고 brand (UI_GUIDE.md).
- **React 19-only API** (ADR-008).
- **글로벌 state 의존** (CLAUDE.md CRITICAL).
- **hex·px 리터럴** — 컴포넌트 코드에 raw 값 0.
- **fontWeight.bold** 추가 — `medium`이 시각상 충분. needs 부상 시 토큰 추가.
- **radius.pill** (999px 풀 pill) 추가 — `radius.sm`가 ppt 시각과 가장 가까움.

## 5. 성공 기준 (측정 가능, GATE 1 대상)

```bash
# (S1) 신규 파일 존재
test -f packages/web/src/Badge/Badge.tsx
test -f packages/web/src/Badge/Badge.test.tsx
test -f packages/web/src/Badge/types.ts
test -f packages/web/src/Badge/index.ts

# (S2) public export
grep -q "export { Badge }" packages/web/src/index.ts
grep -q "BadgeProps\|BadgeVariant" packages/web/src/index.ts

# (S3) 토큰 의존 (raw 값 0)
! grep -E "#[0-9a-fA-F]{3,6}" packages/web/src/Badge/Badge.tsx
! grep -E "\b[0-9]+px\b" packages/web/src/Badge/Badge.tsx
grep -q "interfaceColors\|surfaces\|space\|radius\|fontSize\|fontWeight" packages/web/src/Badge/Badge.tsx

# (S4) 빌드 통과
pnpm -F @wonik/tokens build && pnpm -F @wonik/web build

# (S5) 회귀 0 + 신규 테스트 ≥7개 — 177 + N passing
pnpm -F @wonik/web test

# (S6) sandbox 시각 검증 — Badge 섹션 노출 + headless 캡쳐
test -f pkg-out/phase-14-badge-matrix.png

# (S7) Changesets minor bump
test -f .changeset/*-badge.md
grep -q "@wonik/web" .changeset/*-badge.md

# (S8) ADR-016
grep -q "ADR-016" docs/ADR.md
grep -q "Badge" docs/ADR.md

# (S9) PRD 진행 현황
grep -q "Phase 14" docs/PRD.md

# (S10) AI 슬롭 anti-pattern 0
! grep -i -E "backdrop-filter: blur|rounded-2xl|rounded-3xl|gradient|glow" packages/web/src/Badge/Badge.tsx
```

### 정성 기준 (사용자 시각 검증)

- (S11) sandbox 매트릭스 캡쳐에서 primary 변형이 ppt slideCount(`"8장"`)와 시각적으로 자연 호환 추측 가능.
- (S12) neutral 변형이 ppt OutlineCard layout 표시와 자연 호환 추측 가능.
- (S13) 두 variant 모두 글래스모피즘·glow·gradient 0 (UI_GUIDE.md 슬롭 anti-pattern 회피).

## 6. variant × 사용 예 매트릭스 (sandbox 검증 대상)

| variant | 사용 예 | 시각 의도 |
|---|---|---|
| `neutral` (default) | "layout" / "title-and-body" / "draft" / "v1.0" 같은 작은 라벨 | subtle, 정보성 |
| `primary` | "8장" / "NEW" / 카운트 / 강조 태그 | attention, 강조 |

sandbox에 2 variant × 3 컨텐츠 종류(짧은 라벨 / 숫자 / 긴 텍스트) = 6셀 매트릭스 + light/dark 토글 캡쳐.

## 7. 결승선 (Phase 14 closure 조건)

- S1–S10 측정 통과
- S11–S13 정성 OK (`pkg-out/phase-14-badge-matrix.png` 검토)
- `phases/14-badge/index.json` 모든 step `status: "completed"`
- Trial 4+5 evidence 매트릭스에서 Badge 행 "needs ✅ 누적 4회 → Phase 14로 closure" 참조가 spec/plan/tasks에 명시
- 다음 phase(Phase 15 후보) 진입 조건이 plan.md "후속 결정" 섹션에 한 줄로 기록 — "Trial 6 (ppt Presentation/History)에서 Badge 적용 + Alert·ToggleGroup 누적 측정"

## 8. 결승선 외 — 향후 결정 후보

- **Trial 6 (Phase 15 후보)**: Badge 도입 후 ppt Presentation 또는 History 페이지에 적용. **Alert/Banner needs 누적 시 Phase 15 = Alert, ToggleGroup 누적 시 Phase 15 = ToggleGroup, 둘 다 누적 시 우선순위 ranking 후 한쪽** 진입.
- **Badge size prop** (sm/md) 추가는 dogfood에서 *큰* Badge 사용 사례 부상 시 minor bump.
- **semantic 색 variant** 추가는 status 사용처 부상 시 별도 ADR.

## 9. CLARIFY 결정사항 (autopilot PHASE 2 산출물)

| # | 결정점 | 선택 | 사유 |
|---|---|---|---|
| C1 | size prop 도입 여부 | **size prop 없음, 단일 sm 크기** | Trial 4+5 evidence 모두 sm. 미리 추가는 over-engineering. needs 부상 시 minor bump. |
| C2 | variant 개수 | **2개 (primary/neutral)** | 두 사용 패턴이 evidence로 명확. semantic은 needs 0. |
| C3 | default variant | **neutral** | Trial 4 layout label 3회(neutral) > Trial 5 slideCount 1회(primary). 더 보편이 default. |
| C4 | borderRadius | **radius.sm (5px)** | ppt slideCount `rounded-md`(Tailwind 6px)와 가장 근접. `radius.md`(10px)는 너무 둥글, `radius.full`은 pill. |
| C5 | fontWeight | **fontWeight.medium (500)** | ppt는 bold(700) 사용했으나 우리 tokens에 bold 없음. medium도 시각 emphasis 충분. needs 강할 때 bold 토큰 추가. |
| C6 | padding | **`${space[1]} ${space[3]}` = 4px 8px** | ppt `px-2 py-0.5`(8px/2px) 근사. space[1]=4px(2px 부재). 살짝 더 큰 padding이지만 시각 균형 OK. |
| C7 | as default | **span** | inline label 본성. Card는 div(block), Badge는 span(inline). |
| C8 | forwardRef | **사용 안 함 (Card 답습)** | host가 Badge DOM ref 필요한 use case 0. needs 부상 시 추가. |
| C9 | tabular-nums | **always on** | count·숫자 사용처가 거의 모든 primary variant. neutral도 손해 0. 일관성 위해 항상 on. |
| C10 | dark mode 그림자/배경 분기 | **none** | Badge에 box-shadow 0. dark에서 surface bg 자동 흡수(cascade). 분기 CSS 필요 없음 → module-scope CSS 1회-inject 패턴 **불필요**. |

## 10. 보안·엣지 케이스·성능 (GATE 2 대상)

### 10.1 보안

- **XSS 0** — `children`만 통과 (React escape). `dangerouslySetInnerHTML` 0.
- **prop injection 0** — `style`·`className`은 React normalize.
- **인증·권한·데이터** — 해당 없음 (presentational).

### 10.2 엣지 케이스 (테스트 케이스로 명시)

| 엣지 | 처리 |
|---|---|
| `variant` 미지정 | default `neutral` |
| `children` 0개 | 빈 inline-flex span 렌더. 시각상 작은 빈 pill. 의도된 동작. |
| 매우 긴 텍스트 | inline-flex로 wrap 없음. host가 width 제어 시 ellipsis 가능. 기본은 자연 inline. |
| `as="div"` | block-level Badge — host 결정. 시각 동일. |
| `as="button"` | clickable Badge — interactive. cursor·focus는 host 책임. Badge 자체는 시각만. |
| `className` 외부 추가 | `wonik-badge` 클래스 뒤에 합성. |
| `style` 외부 override | inline style 우선 (default 위 spread). |
| 숫자 children (예: "1" / "99" / "1000") | tabular-nums로 width 일관. |
| SSR | inline style만 — `document` 의존 0. 안전. |
| theme 전환 | interfaceColors가 CSS variable이라 자동 반영. 분기 CSS 0. |

### 10.3 성능

- 단순 `<span>` + style 객체 1회. 명시적 성능 목표 **해당 없음**.
- module-scope CSS inject **불필요** (C10) — 첫 마운트도 zero CSS overhead.
- React 19 컴파일러 자동 메모 의존 0 (ADR-008).
