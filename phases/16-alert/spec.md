# Phase 16 — Alert 컴포넌트 (spec.md)

> autopilot PHASE 1 산출물. Trial 4+5+6 누적 3회 evidence(`docs/dogfood-trial-4.md`·`trial-5.md`·`trial-6.md`)로 needs ✅ 거의 확정된 Alert를 `@wonik/web`에 1차 추가한다.

## 1. 목표

`@wonik/web`에 `Alert` 컴포넌트를 추가해 host product에서 반복되는 *error message banner with dismiss* 패턴을 디자인 시스템이 책임지게 한다.

- **Trial 4 evidence**: ppt Outline error inconclusive (코드상 1회 등장)
- **Trial 5 evidence**: ppt Home form error 1회
- **Trial 6 evidence**: ppt Presentation error 1회
- **누적 3회 — 모두 error 변형, 동일 패턴**: `role="alert"` + red bg + red border + red text + dismiss × 버튼
- **계약**: `statusTokens.alarm` (이미 존재 — bg/border/text) 사용. 별도 interfaceColors 추가 0.

## 2. 사용자

- **1차**: 원익IPS 사내 React 개발자. `import { Alert } from '@wonik/web'` 한 줄로 사용.
- **첫 dogfood 사용처**: ppt `Outline.tsx` + `Home.tsx` + `Presentation.tsx`의 error alert 3개. 다음 trial 7에서 본 Alert로 교체.
- **2차**: 향후 사내 web service들. form validation error, API failure 등.

## 3. 범위 (in-scope)

`packages/web/src/Alert/`:
- `Alert.tsx` — 컴포넌트 본체.
- `Alert.test.tsx` — Vitest + @testing-library/react. TDD 순서.
- `types.ts` — `AlertProps` 정의 + named export.
- `index.ts` — re-export.

`packages/web/src/index.ts`:
- `export { Alert } from './Alert'` + type re-export.

`apps/web-sandbox/`:
- Alert 시각 검증 섹션 — 짧은/긴 메시지 × dismiss 유/무.

`docs/ADR.md`:
- **ADR-017: Alert 컴포넌트 — error-only(YAGNI) + onDismiss + statusTokens.alarm 의존** 추가.

`docs/PRD.md`:
- "1단계 진행 현황" 표에 Phase 15 + Phase 16 행 추가, 1단계 layer A 1차 채움 종료 후보 명시.

`phases/16-alert/`:
- `spec/plan/tasks/step{N}.md/index.json`.

Changesets:
- `.changeset/*-alert.md` — minor bump (`@wonik/web`).

### 컴포넌트 API (signature 확정)

```tsx
interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'role'> {
  /** dismiss 버튼 — 제공 시 우측에 ×버튼 + `aria-label="닫기"` 렌더 */
  onDismiss?: () => void;

  /** HTML 요소 — default 'div'. */
  as?: ElementType;

  children?: ReactNode;
}
```

`role="alert"`는 컴포넌트가 *강제* — consumer가 override 불가 (Spinner의 role/aria-busy 패턴 답습).

variant prop **없음** — Trial 4+5+6 evidence 모두 error만. info/warning/success는 needs 부상 시 minor bump.

### 시각 매핑 (statusTokens.alarm + 기본 토큰)

| 속성 | 토큰 | 값 |
|---|---|---|
| background | `statusTokens.alarm.bg` | `#FFE2E2` (light) — 자동 dark 분기 |
| border | `1px solid ${statusTokens.alarm.border}` | `#FFCACA` (light) |
| color | `statusTokens.alarm.text` | `#CC0000` (light) |
| padding | `${space[5]} ${space[6]}` | 12px 16px (ppt `px-4 py-3` 대응) |
| borderRadius | `radius.md` | 10px |
| fontSize | `fontSize.titleSm` | 14px (ppt `text-sm` 대응) |
| lineHeight | `lineHeight.tight` | 1 |
| display | `flex` | — |
| alignItems | `center` | — |
| justifyContent | `space-between` (when has dismiss) / 없으면 default | — |
| gap | `${space[3]}` | 8px (children과 dismiss × 사이) |

### dismiss × 버튼 (onDismiss 제공 시)

- 작은 inline button: padding `${space[1]}`, background transparent, color inherit, fontSize 동일, cursor pointer, no border.
- 내용: `×` (unicode U+00D7)
- aria-label: "닫기" (한국어 default — 이 design system은 WONIK IPS 사내, i18n needs 부상 시 prop 추가)
- onClick: `onDismiss`

## 4. 범위 외 (out-of-scope)

- **variant prop (info/warning/success)** — Trial 4+5+6 evidence 0. needs 부상 시 minor bump로 추가 (`variant?: 'info' | 'warning' | 'error' | 'success'` default 'error').
- **leading icon prop** — needs 0. children으로 자유롭게 `<Alert>⚠️ 메시지</Alert>` 가능 (단 emoji는 슬롭 anti-pattern 위반).
- **title + description split** — ppt는 단일 메시지만. needs 부상 시 컴파운드.
- **auto-dismiss timer** — needs 0.
- **animation 등장/사라짐** — slop 위험, needs 0.
- **dismissLabel i18n prop** — "닫기" 한국어 default 고정. needs 부상 시 추가.
- **AI 슬롭 anti-pattern** — `rounded-2xl`, gradient bg, glow, 보라/인디고 (UI_GUIDE.md).
- **R19-only API** (ADR-008).
- **글로벌 state 의존** (CLAUDE.md CRITICAL).
- **hex·px 리터럴** — 컴포넌트 코드에 raw 값 0.

## 5. 성공 기준 (S1~S10)

```bash
test -f packages/web/src/Alert/Alert.tsx
test -f packages/web/src/Alert/Alert.test.tsx
test -f packages/web/src/Alert/types.ts
test -f packages/web/src/Alert/index.ts

grep -q "export { Alert }" packages/web/src/index.ts
grep -q "AlertProps" packages/web/src/index.ts

! grep -E "#[0-9a-fA-F]{3,6}" packages/web/src/Alert/Alert.tsx
! grep -E "\b[0-9]+px\b" packages/web/src/Alert/Alert.tsx  # 표준 1px solid 예외
grep -q "statusTokens" packages/web/src/Alert/Alert.tsx

pnpm -F @wonik/tokens build && pnpm -F @wonik/web build
pnpm -F @wonik/web test  # ≥186 + N 신규 passing

test -f pkg-out/phase-16-alert-matrix.png
test -f .changeset/*-alert.md
grep -q "ADR-017" docs/ADR.md
grep -q "Phase 16\|^| 16 |" docs/PRD.md  # PRD 진행 현황 갱신
! grep -i -E "backdrop-filter: blur|rounded-2xl|rounded-3xl|gradient|glow" packages/web/src/Alert/Alert.tsx
```

### 정성
- (S11) sandbox 매트릭스 캡쳐 — ppt error alert와 시각 호환 추측 가능
- (S12) dismiss × 버튼 hit area 적절, 시각 흐름 깨지지 않음
- (S13) `role="alert"` 자동 부여 + a11y 회귀 0

## 6. 사용 예 매트릭스 (sandbox)

| 케이스 | 의도 |
|---|---|
| `<Alert>짧은 에러 메시지</Alert>` | dismiss 없는 정적 alert |
| `<Alert onDismiss={fn}>긴 에러 메시지 — 여러 줄로 wrap되는 경우</Alert>` | dismiss 있는 동적 |
| `<Alert onDismiss={fn}>네트워크 연결 실패. 잠시 후 다시 시도해주세요.</Alert>` | 실제 use case |
| `<Alert as="section">role=alert 유지하면서 semantic section</Alert>` | polymorphic |

## 7. 결승선

- S1–S13 충족
- `phases/16-alert/index.json` 모든 step completed
- Trial 4+5+6 evidence 매트릭스 reference 명시
- 다음 phase 결정 — Phase 17 후보 OR **layer A 1차 채움 종료 → layer B 진입**

## 8. 결승선 외 — 향후 결정

- variant 확장 (info/warning/success) — needs 부상 시
- icon/title 분리 — needs 부상 시
- **layer A 1차 채움 종료**: Alert 추가로 13 atoms 도달 (Button/Box/Stack/Text/Input/Textarea/Checkbox/Switch/Radio/Spinner/Skeleton/Card/Badge + Alert). PRD.md 정의상 1차 채움 결승선 충족 후보.

## 9. CLARIFY 결정사항

| # | 결정점 | 선택 | 사유 |
|---|---|---|---|
| C1 | variant prop 도입 여부 | **없음 — error-only 단일** | Trial 4+5+6 evidence 0 외 변형. info/warning/success needs 부상 시 minor bump. |
| C2 | dismiss 처리 | **`onDismiss?: () => void` — 제공 시 ×버튼 자동 렌더** | 별도 `dismissable: boolean` prop은 중복. callback 유무로 결정. |
| C3 | dismiss 버튼 텍스트 | **`×` (unicode) + aria-label="닫기"** | "닫기" 텍스트보다 작은 시각 footprint. 한국어 aria 사내 표준. |
| C4 | role | **컴포넌트가 `role="alert"` 강제** | screen reader 알림 적절 (error 본성). Spinner의 role 강제 패턴 답습. |
| C5 | fontSize | **`fontSize.titleSm` (14px)** | ppt `text-sm` 대응. Badge label(12px)보다 강조. |
| C6 | borderRadius | **`radius.md` (10px)** | Card와 동일 — banner는 카드 같은 시각 위계. Badge sm(5px)는 작음. |
| C7 | padding | **`${space[5]} ${space[6]}` (12px 16px)** | ppt `px-4 py-3` (16px 12px) 대응 — 우리는 horizontal 16px / vertical 12px. |
| C8 | as default | **`div`** | block-level banner. Card 답습. |
| C9 | forwardRef | **사용 안 함** | Card·Badge 답습. ref 필요는 minor bump. |
| C10 | dark mode | **theme-dark.ts의 status-alarm-* 자동 분기** | statusTokens가 CSS variable → 자동 dark 대응. 별도 분기 CSS 불필요. |

## 10. 보안·엣지·성능

- **보안**: XSS 0 (children만), prop injection 0 (React normalize), 인증·권한·데이터 0 (presentational).
- **엣지**:
  - children 0개 → 빈 alert (의도된 동작)
  - 매우 긴 메시지 → wrap 자연 (flex + items-center가 vertical center 유지)
  - onDismiss 미제공 → × 버튼 미렌더, justify-between 미적용
  - SSR → inline style만 — `document` 의존 0
  - theme 전환 → statusTokens.alarm.* CSS variable 자동 반영
- **성능**: 단순 `<div>` + style 객체 1회. 명시적 목표 해당 없음.
