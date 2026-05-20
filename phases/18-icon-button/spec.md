# Phase 18 — IconButton 컴포넌트 (spec.md)

> ROADMAP §M2.b Phase 1 산출물. demo-fab-monitor 한 바퀴 dogfood로 internal `IconButton`이 3 사용처(Topbar 알림벨·테마토글·EquipmentPage close)에서 토큰 정합도·사용 패턴이 검증된 상태. `@wonik/web`에 1차 추가하고 demo의 internal을 교체한다.

## 1. 목표

`@wonik/web`에 `IconButton` 컴포넌트를 추가해 host product에서 반복되는 *icon-only square action button* 패턴을 디자인 시스템이 책임지게 한다.

- **demo dogfood evidence**: Topbar.tsx ×2 (알림벨 + 테마토글) + EquipmentPage.tsx ×1 (close) = 3 사용처에서 internal로 작동 중.
- **C tier (demo 승격)** — 도메인 가정이 가장 적고 토큰 정합이 이미 잡힌 상태. M2.b 표에서 "가장 안전한 첫 단계"로 명시.
- **목표 시각 형태**: 정사각 inline-flex button + icon ReactNode 1개. `outline` variant는 border 있음, `ghost`는 transparent.
- **계약**: ADR-010 cascade — `interfaceColors.border` / `interfaceColors.text` / `interfaceColors.surface` 사용. host 변수 정의 시 자동 흡수. ADR-011 module-scope CSS — :hover / :focus-visible 처리.

## 2. 사용자 (누가 쓰나)

- **1차**: 원익IPS 사내 React 개발자. `import { IconButton } from '@wonik/web'` 한 줄로 사용.
- **첫 dogfood 사용처**: demo-fab-monitor 3 사용처를 internal → @wonik/web으로 교체 (Phase 18 closure 안에서).
- **2차**: 향후 사내 web service들. toolbar action, modal close, table row action 등 동일 패턴 예상.

## 3. 범위 (in-scope)

`packages/web/src/IconButton/`:
- `IconButton.tsx` — 컴포넌트 본체. Button.tsx 패턴(ensureCssInjected + variantStyles + sizeStyles).
- `IconButton.test.tsx` — Vitest + @testing-library/react. TDD 순서.
- `types.ts` — `IconButtonProps`, `IconButtonVariant`, `IconButtonSize` 정의 + named export.
- `index.ts` — re-export.

`packages/web/src/index.ts`:
- `export { IconButton } from './IconButton'` + type re-export 추가.

`apps/web-sandbox/`:
- IconButton variant × size 매트릭스 시각 검증 섹션 추가 (Button 패턴 참고).

`apps/demo-fab-monitor/`:
- 3 사용처를 `@wonik/web` IconButton으로 교체.
- 알림벨 badge는 Badge atom 조합 wrapper로 변환 (`<span style={position:relative}><IconButton/><Badge/></span>`).
- internal `IconButton.tsx` 삭제.

Changesets:
- `.changeset/*-icon-button.md` — minor bump (`@wonik/web`).

### 컴포넌트 API (signature 확정)

```tsx
type IconButtonVariant = 'outline' | 'ghost';
type IconButtonSize = 'sm' | 'md' | 'lg';

interface IconButtonOwnProps {
  variant?: IconButtonVariant;       // default 'outline'
  size?: IconButtonSize;             // default 'md'
  'aria-label': string;              // REQUIRED — icon-only는 screen reader 텍스트 필수
}

interface IconButtonProps
  extends IconButtonOwnProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof IconButtonOwnProps | 'aria-label'> {
  children: ReactNode;               // icon 1개
}
```

**`aria-label` 필수** — TypeScript 레벨에서 강제. icon-only는 a11y 미준수 시 screen reader user에게 "버튼" 외 정보 0. WCAG 4.1.2 Name, Role, Value.

시각 매핑 (`@wonik/tokens` 토큰만 사용 — hex/px 리터럴 0):

| variant | background | color | border |
|---|---|---|---|
| `outline` (default) | `transparent` | `interfaceColors.text` | `1px solid ${interfaceColors.border}` |
| `ghost` | `transparent` | `interfaceColors.text` | none |

| size | width × height | iconSize 권장 | 토큰 |
|---|---|---|---|
| `sm` | 24×24 | 12-14px | inline literal (Button.tsx 답습) |
| `md` (default) | 32×32 | 14-16px | `space[8]` 사용 가능, Button는 inline 사용 |
| `lg` | 40×40 | 18-20px | inline literal (Button.tsx 답습) |

> 24/32/40 정사각 사이즈는 `space` 스케일에 정확히 매핑되지 않음(space[7]=22, space[8]=32). Button.tsx가 24/32/40 height를 inline literal로 박은 선례를 답습한다. 향후 `componentSize.iconButton.{sm,md,lg}` 토큰 신설은 별도 ADR + minor bump 거리로 분리 (ROADMAP 후속).

공통 시각 토큰:

| 속성 | 토큰 | 값 |
|---|---|---|
| borderRadius | `radius.sm` | 5px |
| display | `inline-flex` | — |
| alignItems / justifyContent | `center` | — |
| cursor | `pointer` | — |
| transition | `background 100ms ease-out` | — |

Hover (module-scope CSS via ensureCssInjected):
- `outline` / `ghost` 공통: `background: var(--color-surface-subtle, transparent)`.

Focus (module-scope CSS):
- `:focus-visible` → `outline: 2px solid var(--color-focus, var(--color-primary))` + `outline-offset: 2px`.

Disabled (inline style):
- `opacity: 0.5` + `cursor: 'not-allowed'`.

## 4. 범위 외 (out-of-scope) — "이건 안 한다"

- **badge prop 내장** — demo internal에 있던 `badge` 빼기 결정 (질문 #2 답변). atom 분리 원칙. 사용처에서 Badge atom과 조합. needs 부상해도 추가 신중.
- **semantic 색 variant** (`primary`/`danger` 등) — demo evidence 0. icon-only는 보통 neutral. needs 부상 시 별도 ADR.
- **icon size prop 자동 계산** — `IconButton size="sm"`이 자식 icon 크기 자동 조정 X. host가 `<IconBell size={16}/>` 명시. 컴포넌트 단순 유지.
- **loading state** (`loading` prop) — needs 0. needs 부상 시 별도 추가.
- **tooltip 내장** — needs 0. 향후 Tooltip atom과 조합.
- **AI 슬롭 anti-pattern** — `rounded-2xl`, gradient bg, glow shadow, 보라/인디고 brand (UI_GUIDE.md).
- **React 19-only API** (ADR-008).
- **글로벌 state 의존** (CLAUDE.md CRITICAL).
- **hex·px 리터럴** — 컴포넌트 코드에 raw 값 0.
- **radius.pill** (정원형) — 사각 정사각이 demo 시각과 일치. needs 부상 시 추가.
- **forwardRef** — Button 답습. host가 DOM ref 필요한 use case 부상 시 추가.

## 5. 성공 기준 (측정 가능)

```bash
# (S1) 신규 파일 존재
test -f packages/web/src/IconButton/IconButton.tsx
test -f packages/web/src/IconButton/IconButton.test.tsx
test -f packages/web/src/IconButton/types.ts
test -f packages/web/src/IconButton/index.ts

# (S2) public export
grep -q "export { IconButton }" packages/web/src/index.ts
grep -q "IconButtonProps\|IconButtonVariant\|IconButtonSize" packages/web/src/index.ts

# (S3) 토큰 의존 (raw 값 0)
! grep -E "#[0-9a-fA-F]{3,6}" packages/web/src/IconButton/IconButton.tsx
! grep -E "\b[0-9]+px\b" packages/web/src/IconButton/IconButton.tsx
grep -q "interfaceColors\|space\|radius" packages/web/src/IconButton/IconButton.tsx

# (S4) 빌드 통과
pnpm -F @wonik/tokens build && pnpm -F @wonik/web build

# (S5) 회귀 0 + 신규 테스트 ≥8개
pnpm -F @wonik/web test

# (S6) demo dogfood 완료
! grep -q "from '../components/internal/IconButton'" apps/demo-fab-monitor/src/layout/Topbar.tsx
! grep -q "from '../components/internal/IconButton'" apps/demo-fab-monitor/src/pages/EquipmentPage.tsx
test ! -f apps/demo-fab-monitor/src/components/internal/IconButton.tsx
grep -q "IconButton" apps/demo-fab-monitor/src/layout/Topbar.tsx  # 교체 후에도 사용

# (S7) Changesets minor bump
test -f .changeset/*-icon-button.md
grep -q "@wonik/web" .changeset/*-icon-button.md

# (S8) AI 슬롭 anti-pattern 0
! grep -i -E "backdrop-filter: blur|rounded-2xl|rounded-3xl|gradient|glow" packages/web/src/IconButton/IconButton.tsx

# (S9) aria-label 강제 — TypeScript 레벨
grep -q "'aria-label': string" packages/web/src/IconButton/types.ts
```

### 정성 기준 (사용자 시각 검증)

- (S10) demo-fab-monitor 교체 후 Topbar 알림벨 + 테마토글 + EquipmentPage close 3 사용처가 시각상 internal과 동일하게 보임 (badge는 wrapper로 위치 유지).
- (S11) variant × size 6 셀 매트릭스 모두 글래스모피즘·glow·gradient 0.
- (S12) focus-visible로 키보드 탭 시 outline 2px 표시.

## 6. variant × size 매트릭스 (sandbox 검증 대상)

| variant \ size | sm (24) | md (32) | lg (40) |
|---|---|---|---|
| outline | 작은 toolbar action | toolbar / Topbar 표준 | 큰 emphasis action |
| ghost | dense table row | modal close 표준 | floating action button 후보 |

sandbox에 2 variant × 3 size = 6셀 + light/dark + badge 조합 1 예시 (Badge atom과 wrapper).

## 7. 결승선 (Phase 18 closure 조건)

- S1–S9 측정 통과
- S10–S12 정성 OK (demo 시각 회귀 0)
- demo-fab-monitor 3 사용처가 `@wonik/web`로 import 교체 + internal IconButton.tsx 삭제
- ROADMAP §M2.b Phase 1 행 ✅ 표시, atom 카운트 14 → 15
- (선택) Storybook(15+) trigger reference 한 줄 ROADMAP에 추가

## 8. CLARIFY 결정사항

| # | 결정점 | 선택 | 사유 |
|---|---|---|---|
| C1 | size tier | **sm/md/lg 3-tier (24/32/40)** | Button atom과 어휘 일관. demo 36px은 md(32)로 승격 — 시각 편차는 dogfood로 확인. |
| C2 | variant 종류 | **outline / ghost** | demo evidence 그대로. semantic은 needs 0. |
| C3 | default variant | **outline** | Topbar 2/3 사용처가 outline. ghost는 close 등 minor. |
| C4 | default size | **md (32px)** | demo 표준값(36) 가장 근접 + Button md와 정합. |
| C5 | badge 내장 | **빼기 (Badge atom 조합)** | atom 분리 원칙. demo 1/3 사용처만 badge — 컴포넌트 내장에 부담. |
| C6 | aria-label | **TypeScript 필수** | icon-only는 a11y 필수. 런타임 경고가 아닌 컴파일 타임 강제. |
| C7 | hover bg | **`var(--color-surface-subtle, transparent)`** | demo internal과 동일. fallback transparent로 host 미정의 시 시각 변화 0. |
| C8 | iconSize 자동 계산 | **하지 않음** | host가 size prop 명시 → 컴포넌트 단순. 유연성 ↑. |
| C9 | radius | **radius.sm (5px)** | Button과 동일. demo 5px와 일치. |

## 9. 보안·엣지 케이스·성능

### 9.1 보안

- **XSS 0** — `children`만 통과 (React escape). `dangerouslySetInnerHTML` 0.
- **aria-label injection** — string prop, React escape.

### 9.2 엣지 케이스

| 엣지 | 처리 |
|---|---|
| `variant` 미지정 | default `outline` |
| `size` 미지정 | default `md` |
| `aria-label` 누락 | TypeScript 컴파일 에러 |
| `disabled` | opacity 0.5 + cursor not-allowed + 네이티브 disabled |
| `children` 0 | 빈 정사각 button. 의도된 동작 (실수 안내는 host 책임). |
| `className` 외부 추가 | `wonik-iconbtn` 뒤에 합성 |
| `style` 외부 override | inline style 우선 |
| Badge 조합 (badge wrapper) | host가 `<span style={{position:'relative'}}>` 한 겹 + `<Badge style={{position:'absolute',top:-4,right:-4}}/>` |
| SSR | `ensureCssInjected`이 `typeof document === 'undefined'` 가드 |
| theme 전환 | interfaceColors가 CSS variable → 자동 반영 |

### 9.3 성능

- 단순 `<button>` + style 객체 1회. module-scope CSS 1회-inject (마운트 첫 회만).
- React 19 컴파일러 자동 메모 의존 0 (ADR-008).
