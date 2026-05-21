# Phase 12 — Card 컴포넌트 (spec.md)

> autopilot PHASE 1 (SPECIFY) 산출물. Trial 4(`docs/dogfood-trial-4.md`)에서 needs ✅ 강함으로 확정된 Card를 `@wonik/web`에 1차 추가한다.

## 1. 목표

`@wonik/web`에 `Card` 컴포넌트를 추가해 host product에서 반복되는 *rounded border + surface bg + 내부 padding* 패턴을 디자인 시스템이 책임지게 한다.

- **Trial 4 evidence**: ppt Outline 페이지 한 화면에서 동일 패턴 4회 반복 (OutlineCard ×3 + loading wrapper + generation wrapper). 한 페이지에서 4회 반복되는 패턴 = 디자인 시스템이 own해야 하는 영역.
- **목표 시각 형태**: 시안의 `rounded-[10px]` + `1px solid var(--color-border)` + `bg-surface` + `padding`.
- **계약**: ADR-010 namespace contract를 따라 `interfaceColors.surface` / `interfaceColors.border`만 시각 색으로 reference. host의 `--color-surface` / `--color-border` 정의 시 자동 흡수, 미정의 시 우리 internal로 fallback.

## 2. 사용자 (누가 쓰나)

- **1차**: 원익IPS 사내 React 개발자. `import { Card } from '@wonik/web'` 한 줄로 사용.
- **첫 dogfood 사용처**: ppt `OutlineCard.tsx`(현재 자체 div + className 조합) → 다음 trial에서 본 Card로 교체. Outline 페이지 loading/generation wrapper도 동일.
- **2차**: 향후 사내 web service들. ppt Home/Presentation/History 등에서도 동일 패턴 등장 예상.

## 3. 범위 (in-scope)

`packages/web/src/Card/`:
- `Card.tsx` — 컴포넌트 본체. `forwardRef<HTMLDivElement, CardProps>` 패턴.
- `Card.test.tsx` — Vitest + @testing-library/react. TDD 순서로 작성.
- `types.ts` — `CardProps`, `CardVariant`, `CardPadding` 정의 + named export.
- `index.ts` — re-export.

`packages/web/src/index.ts`:
- `export { Card } from './Card'` + type re-export 추가.

`apps/web-sandbox/`:
- Card variant·padding matrix 시각 검증 섹션 추가 (Skeleton/Spinner 패턴 그대로).

`docs/ADR.md`:
- **ADR-015: Card 컴포넌트 — surface/elevated × sm/md/lg + interfaceColors 의존** 추가.

`docs/PRD.md`:
- "1단계 진행 현황" 표에 Phase 12 행 추가.

`phases/12-card/`:
- `spec.md` (본 문서) / `plan.md` / `tasks.md` / `step{0,1,...}.md` / `index.json`.

Changesets:
- `.changeset/*-card.md` — minor bump (`@wonik/web`). 신규 컴포넌트 = minor.

### 컴포넌트 API (signature 확정)

```tsx
type CardVariant = 'surface' | 'elevated';
type CardPadding = 'none' | 'sm' | 'md' | 'lg';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;    // default 'surface'
  padding?: CardPadding;    // default 'md'
  as?: ElementType;         // default 'div' — section/article semantic용
  // ref는 forwardRef로 받음
  // children, className, style 등 native 통과
}
```

시각 매핑 (`@wonik/tokens` 토큰만 사용 — hex/px 리터럴 0):

| variant | background | border | boxShadow |
|---|---|---|---|
| `surface` (default) | `interfaceColors.surface` | `1px solid ${interfaceColors.border}` | none |
| `elevated` | `interfaceColors.surface` | none | light: `0 1px 3px rgba(0,0,0,0.08)` / dark: **`none`** (CLARIFY 결정 — ADR-009 정신과 정합: dark에선 surface bg로 elevation 표현) |

dark theme 분기는 `[data-theme="dark"]` 셀렉터로 `box-shadow: none` 1줄 — Button과 동일한 module-scope CSS 1회-inject 패턴(`ensureCssInjected()` + `data-wonik-card`)을 사용한다.

| padding | value (from `space`) |
|---|---|
| `none` | 0 |
| `sm` | `space[4]` = 10px |
| `md` (default) | `space[6]` = 16px (Trial 4 캡쳐의 `p-4`에 대응) |
| `lg` | `space[8]` = 32px |

border-radius는 모든 variant 공통 `radius.md` = 10px (WARP 시안 + AI 슬롭 anti-pattern 회피 — `rounded-2xl` 일괄 사용 금지).

## 4. 범위 외 (out-of-scope) — "이건 안 한다"

- **Card.Header / Card.Body / Card.Footer subcomponents** — 1단계 needs 없음. ppt에서 명확한 구획이 없는 자유로운 컨테이너 사용 패턴. YAGNI.
- **interactive Card** (`onClick` 시 hover/focus visual) — Trial 4에서 클릭 가능 카드 패턴 0회. YAGNI.
- **Image media slot** — needs 0.
- **자체 elevation 토큰 신설** (`shadow.sm/md/lg` 같은) — elevated variant 1개에만 그림자 필요. 토큰 추가는 `shadow` 사용처가 2+에서 부상하면 (ADR + minor bump). 지금은 컴포넌트 내부 상수.
- **interfaceColors.shadow 같은 신규 interface variable** — host 흡수 contract 확장은 별도 ADR 사안. 본 phase 외.
- **dark mode 그림자 색 토큰 재정의** — `theme-dark.ts` 변경 없음. elevated variant는 dark에서 그림자가 약해도 OK (dark는 elevation을 surface bg로 표현하는 것이 정합).
- **packages/web/src/Box 통합·삭제** — Box는 raw container, Card는 surface 카드. role 다름. 통합 금지.
- **dogfood trial 5** — Phase 12 closure 후 별도 phase로 분리. 이번 phase는 컴포넌트 도입까지만.
- **AI 슬롭 anti-pattern 도입 금지** — 글래스모피즘(`backdrop-filter: blur`), gradient bg, glow 그림자, `rounded-2xl`/`rounded-3xl`, 보라/인디고 brand color (UI_GUIDE.md).
- **React 19-only API** — `use()`/`useFormStatus`/`useOptimistic` 등 (ADR-008).
- **글로벌 state 의존** — Zustand/Redux 등 (CLAUDE.md CRITICAL).
- **hex·px 리터럴** — 컴포넌트 코드에 raw 값 0. 모두 `@wonik/tokens` 경유.

## 5. 성공 기준 (측정 가능, GATE 1 대상)

```powershell
# (S1) 신규 파일 존재
test -f packages/web/src/Card/Card.tsx
test -f packages/web/src/Card/Card.test.tsx
test -f packages/web/src/Card/types.ts
test -f packages/web/src/Card/index.ts

# (S2) public export 정상 — `import { Card, CardProps, CardVariant, CardPadding } from '@wonik/web'`
grep -q "export { Card }" packages/web/src/index.ts
grep -q "CardProps" packages/web/src/index.ts

# (S3) 토큰 의존 (raw 값 0)
# Card.tsx에 hex literal(#XXX) / px literal 등장 0회 — border-radius·padding·color 모두 토큰 경유
! grep -E "#[0-9a-fA-F]{3,6}" packages/web/src/Card/Card.tsx
! grep -E "[^a-zA-Z0-9-][0-9]+px" packages/web/src/Card/Card.tsx
# interfaceColors 사용 입증
grep -q "interfaceColors" packages/web/src/Card/Card.tsx

# (S4) 빌드 통과
pnpm -F @wonik/tokens build
pnpm -F @wonik/web build

# (S5) 회귀 0 + 신규 테스트 포함 → 163 + N passing (N = Card 테스트 케이스 수, 최소 8개)
pnpm -F @wonik/web test    # all pass

# (S6) sandbox 시각 검증
pnpm -F web-sandbox dev    # Card 섹션이 surface×{none,sm,md,lg} + elevated×md 시각 매트릭스 노출
# headless 캡쳐 → pkg-out/phase-12-card-matrix.png

# (S7) Changesets 항목 존재 — @wonik/web minor bump
test -f .changeset/*-card.md
grep -q "@wonik/web: minor" .changeset/*-card.md

# (S8) ADR-015 추가
grep -q "ADR-015" docs/ADR.md
grep -q "Card" docs/ADR.md

# (S9) PRD 진행 현황 업데이트
grep -q "Phase 12" docs/PRD.md

# (S10) AI 슬롭 anti-pattern 도입 0
! grep -i -E "backdrop-filter: blur|rounded-2xl|rounded-3xl|gradient" packages/web/src/Card/Card.tsx
```

### 정성 기준 (사용자 시각 검증)

- (S11) sandbox 매트릭스 캡쳐에서 surface variant가 ppt OutlineCard와 시각적으로 자연스럽게 호환됨이 추측 가능 — 별도 trial 없이도 "이걸 갖고 ppt에 끼우면 회귀 0이겠다"가 한눈에 보임.
- (S12) elevated variant의 그림자가 *과하지 않음* (glow 0, `rgba(0,0,0,0.08)` 수준 — WARP 시안 톤 유지).
- (S13) border-radius `10px` = WARP/Skeleton/Button과 일관.

## 6. variant × padding 매트릭스 (sandbox 검증 대상)

| | `none` | `sm` | `md` | `lg` |
|---|---|---|---|---|
| `surface` (default) | ✓ | ✓ | ✓ (default 조합) | ✓ |
| `elevated` | ✓ | ✓ | ✓ | ✓ |

8개 조합 모두 sandbox에 렌더 + headless 캡쳐.

## 7. 결승선 (Phase 12 closure 조건)

- S1–S10 모두 측정 통과
- S11–S13 캡쳐 정성 OK (`pkg-out/phase-12-card-matrix.png`로 검토)
- `phases/12-card/index.json`의 모든 step `status: "completed"`
- Trial 4 발견 매트릭스에서 Card 행 "needs ✅ 강함 → Phase 12로 closure" 라는 reference가 spec/plan/tasks에 명시
- 다음 trial(Phase 13 후보) 진입 조건이 plan.md "후속 결정" 섹션에 한 줄로 기록 — "Trial 5 (ppt 다른 페이지)에서 IconButton·Badge needs 누적 시 합쳐 Phase 13, 아니면 layer A 1차 채움 종료"

## 9. 보안 / 엣지 케이스 / 성능 (GATE 2 대상)

### 9.1 보안 요구사항

- **XSS 노출 면 0** — `children`만 통과(React가 escape). `dangerouslySetInnerHTML` 사용 금지.
- **prop injection 위협 면 0** — `style`·`className`은 React가 normalize. CSS injection은 React가 inline style 객체로 강제하므로 raw string 주입 불가.
- **인증·권한** — 해당 없음 (presentational 컨테이너).
- **데이터 보호** — Card 자체는 데이터 저장·송신 0. 해당 없음.

### 9.2 엣지 케이스 (테스트 케이스로 명시)

| 엣지 | 처리 |
|---|---|
| `variant` 미지정 | default `surface` |
| `padding` 미지정 | default `md` (= 16px) |
| `padding="none"` | `padding: 0` — collapse 안전 |
| `children` 0개 (빈 카드) | 빈 컨테이너 그대로 렌더. 높이 = padding 합 (none 시 0) |
| `as="section"` | `<section>`으로 렌더 + 동일 시각 |
| `as` 가 invalid string | React가 warning + lowercase HTML로 렌더 (Box와 동일 거동, 의도된 동작) |
| `className` 외부 추가 | 우리 `wonik-card` 클래스와 *공존* — `className: 'wonik-card ' + (props.className ?? '')` |
| `style` 외부 override | inline style가 우리 default 위에 spread (Skeleton 패턴 동일) — host의 width/margin 조정 자유 |
| ref 전달 | `forwardRef<HTMLDivElement>` — `useRef`로 DOM 노드 직접 access 가능 |
| SSR (document undefined) | `ensureCssInjected()`가 `typeof document === 'undefined'` 가드로 no-op |
| theme 전환 (light↔dark 런타임) | CSS variable 기반이라 자동 반영. shadow는 `[data-theme="dark"] .wonik-card-elevated { box-shadow: none }` 셀렉터로 자동 분기 |

### 9.3 성능 목표

- Card는 단순 `<div>`. 렌더 비용 = native div + style 객체 1회 계산. **명시적 성능 목표 해당 없음.**
- module-scope CSS 1회-inject — 첫 마운트 시 `<style data-wonik-card>` 1회 삽입. 이후 zero overhead.
- React 19 컴파일러 자동 메모 의존 금지 (ADR-008). props가 동일하면 React 기본 reconciliation으로 충분.

## 8. 결승선 외 — 향후 결정 후보 (1단계 진행 흐름 연결)

본 phase 결과로 가능해지는 다음 결정:

- **Trial 5 (Phase 13 후보)**: Card 도입 후 ppt 다른 페이지(Home/Presentation/History 중 1개)에 적용. IconButton/Badge needs 누적 측정.
  - 누적 시 → 합쳐 Phase 13으로 (IconButton + Badge).
  - 누적 안 됨 → **layer A 1차 채움 종료** 선언 → layer B(사내 npm registry 배포 인프라) 진입.
- **Card subcomponent**(Header/Body/Footer) 또는 **interactive Card** needs는 위 Trial 5+에서 누적 측정. 본 phase에서 미리 만들지 않음.
