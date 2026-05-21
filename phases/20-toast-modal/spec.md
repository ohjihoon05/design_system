# Phase 20 — Toast + Modal 묶음 (spec.md)

> ROADMAP §M2.b Phase 4 부분 산출물. demo-fab-monitor에 진짜 자연 자리가 발견된 두 atom을 묶어 추가. Select는 자리 부족으로 다음 phase로 미룸. atom 18 → 20 도달 (Chromatic(20+) trigger 통과).

## 1. 목표

`@wonik/web`에 `Toast` (ToastProvider + useToast + Toast 뷰) + `Modal` (controlled portal) 추가. demo-fab-monitor에서 동시 dogfood로 사용 패턴 검증.

## 2. 사용처 (dogfood evidence)

### Toast — 4 자리 ✅

| # | 자리 | tone | 비간섭 정도 |
|---|---|---|---|
| 1 | `useSimulation` 새 alarm 발생 (2초/20%) — 다른 페이지 사용자에게 비간섭 알림 | `info` 또는 severity별 | 핵심 — 다른 페이지 작업 방해 안 함 |
| 2 | AlarmsPage `Acknowledge` 클릭 후 UX 피드백 | `success` | mid |
| 3 | AlarmsPage `Close` 클릭 후 + (선택) Undo action | `info` + action | mid |
| 4 | SettingsPage `Save changes` 후 | `success` | mid |

### Modal — 1 자리 ✅

| # | 자리 | 이유 |
|---|---|---|
| 1 | AlarmsPage `Close alarm` confirm | destructive(데이터 삭제) — confirm modal 안전망 |

## 3. 컴포넌트 API (signature 확정)

### 3.1 Toast — Provider + hook 패턴

```tsx
type ToastTone = 'info' | 'success' | 'warning' | 'error';

interface ToastOptions {
  tone?: ToastTone;          // default 'info'
  title: string;
  description?: string;
  duration?: number;         // ms, default 4000. null/0 = persistent.
  action?: { label: string; onClick: () => void };  // (선택)
}

interface ToastApi {
  show(options: ToastOptions): string;       // returns toast id
  dismiss(id: string): void;
  dismissAll(): void;
}

// Provider — 한 번 root에 감싸기
<ToastProvider position="top-right">  // 또는 'bottom-right'(default)
  {children}
</ToastProvider>

// Hook — 자식 어디서든
const toast = useToast();
toast.show({ tone: 'success', title: 'Alarm acknowledged' });
```

- queue: 최대 동시 5개 표시. 초과 시 가장 오래된 것 dismiss.
- auto-dismiss: `duration` 후 자동 사라짐. `duration: 0` 또는 `null`이면 persistent.
- × dismiss 버튼 항상 표시 (aria-label="닫기").
- role="status" (info/success/warning) vs "alert" (error) — severity-aware.
- 위치: `top-right` 또는 `bottom-right` (default bottom-right, demo는 top-right 권장 — Topbar 하단 자리).

### 3.2 Modal — controlled portal

```tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;            // header 영역 자동 렌더 + aria-labelledby 자동 연결
  closeOnBackdrop?: boolean; // default true
  closeOnEsc?: boolean;      // default true
  size?: 'sm' | 'md' | 'lg'; // default 'md' (max-width 480/640/800)
  children: ReactNode;
}

<Modal isOpen={open} onClose={close} title="Close alarm">
  <Modal.Body>...</Modal.Body>
  <Modal.Footer>
    <Button variant="text" onClick={close}>Cancel</Button>
    <Button variant="danger" onClick={confirm}>Close alarm</Button>
  </Modal.Footer>
</Modal>
```

- `createPortal` → `document.body`로 렌더. SSR 가드 (`typeof document === 'undefined'`).
- `role="dialog"` + `aria-modal="true"` + `aria-labelledby={titleId}` 자동.
- focus trap: 모달 열림 시 첫 focusable로 포커스 이동. Tab 순환. close 시 트리거 element로 복귀.
- ESC 키 닫기 (`closeOnEsc`).
- backdrop 클릭 닫기 (`closeOnBackdrop`). 내부 클릭은 stopPropagation.
- backdrop: `surfaces.surfaceWhite`가 아닌 반투명 black overlay (다크/라이트 공통 시각).
- 진입 애니메이션 0 (UI_GUIDE 슬롭 회피 — flash-out instant OK).

### 3.3 Modal.Body / Modal.Footer (compound)

```tsx
interface ModalBodyProps extends HTMLAttributes<HTMLDivElement> { children: ReactNode }
interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> { children: ReactNode }
```

- Body: padding `space[5] space[6]` (16/16).
- Footer: padding `space[5] space[6]` + `display: flex` + `justifyContent: flex-end` + `gap: space[3]` (8) + `borderTop: 1px solid interfaceColors.border`.

## 4. 시각 매핑 (토큰만)

### Toast

| 속성 | 토큰 |
|---|---|
| width | `min-width: 280px, max-width: 420px` |
| padding | `${space[5]} ${space[6]}` (12/16) |
| borderRadius | `radius.md` (10px) |
| fontSize title | `fontSize.label` (12px) |
| fontSize desc | `fontSize.labelSm` (10px) |
| gap (icon-text) | `space[3]` (8px) |
| shadow | none (anti-slop, border만으로 분리) |
| info bg | `interfaceColors.surface` + 1px border `interfaceColors.border` |
| success bg | `statusTokens.ready.bg` + border `statusTokens.ready.text` |
| warning bg | `statusTokens.warning.bg` + border `statusTokens.warning.text` |
| error bg | `statusTokens.alarm.bg` + border `statusTokens.alarm.border` |

### Modal

| 속성 | 토큰 |
|---|---|
| panel bg | `interfaceColors.surface` |
| panel border | `1px solid interfaceColors.border` |
| panel borderRadius | `radius.md` (10px) |
| panel max-width sm/md/lg | 480 / 640 / 800 px |
| panel margin | `space[6]` from viewport edge |
| header padding | `${space[5]} ${space[6]}` (12/16) |
| header border-bottom | `1px solid interfaceColors.border` |
| title fontSize | `fontSize.titleSm` (14) + `fontWeight.medium` |
| close × button | IconButton ghost size=sm 패턴 |
| backdrop | `rgba(0,0,0,0.5)` (anti-slop — backdrop-filter blur 0) |
| z-index | backdrop 1000, modal 1001 |

## 5. 범위 외 (out-of-scope)

- Toast:
  - 진입/사라짐 애니메이션 (slide/fade) — needs 부상 시 추가. 지금은 instant 등장 (UI_GUIDE flash slop 회피 기준에 부합).
  - swipe-to-dismiss (mobile) — 1단계 모바일 외 (ADR-005).
  - rich content (커스텀 ReactNode body) — `title + description + action`로 충분.
  - 다중 stack 시 그룹화 (collapse) — needs 0.
- Modal:
  - drawer variant (side-slide) — 별도 phase. 사용 의미 다름.
  - nested modal — 위험 패턴 (UX). 명시적 금지 안 하지만 권장도 안 함.
  - 진입 애니메이션 — 즉시 표시 (slop 회피).
  - size full-screen — needs 0.
  - 외부에서 ref로 imperative open/close — controlled만.
- Select — Phase 4 명시지만 demo 자리 부족(현 inline `<select>` 1개)으로 다음 phase로 미룸.
- AI 슬롭: `backdrop-filter: blur`, glow shadow, gradient bg.
- React 19-only API.
- 글로벌 state 의존 (Toast 내부 state는 Provider context로, Redux 등 의존 0).

## 6. 성공 기준

```bash
# 신규 파일
test -f packages/web/src/Toast/ToastProvider.tsx
test -f packages/web/src/Toast/useToast.ts
test -f packages/web/src/Toast/Toast.tsx
test -f packages/web/src/Modal/Modal.tsx

# public export
grep -q "export { ToastProvider, useToast }" packages/web/src/index.ts
grep -q "export { Modal }" packages/web/src/index.ts

# 토큰 의존 (hex 0)
! grep -E "#[0-9a-fA-F]{3,6}" packages/web/src/Toast/*.tsx
! grep -E "#[0-9a-fA-F]{3,6}" packages/web/src/Modal/*.tsx
# rgba(0,0,0,0.5) backdrop은 hex 아님 — 통과

# 빌드 + 테스트
pnpm -F @wonik/web build
pnpm -F @wonik/web test   # 회귀 0 + 신규 ≥ 20개

# demo dogfood
grep -q "useToast\|ToastProvider" apps/demo-fab-monitor/src/App.tsx
grep -q "Modal" apps/demo-fab-monitor/src/pages/AlarmsPage.tsx
pnpm -F demo-fab-monitor build

# Changeset
test -f .changeset/20-toast-modal.md

# a11y
grep -q "role=\"dialog\"" packages/web/src/Modal/Modal.tsx
grep -q "aria-modal" packages/web/src/Modal/Modal.tsx
grep -q "aria-live\|role=\"status\"\|role=\"alert\"" packages/web/src/Toast/Toast.tsx
```

## 7. CLARIFY 결정사항

### Toast

| # | 결정점 | 선택 | 사유 |
|---|---|---|---|
| T1 | API 패턴 | **Provider + hook** | imperative `toast.show()` 호출이 가장 자연. controlled `<Toast/>`는 queue 관리 복잡. |
| T2 | tone 어휘 | **info/success/warning/error** | 4 tone 충분. statusTokens에 매핑 가능. |
| T3 | default position | **bottom-right** | 표준 web UX. demo는 top-right로 override (Topbar 하단). |
| T4 | duration default | **4000ms** | sonner/react-hot-toast 답습. error는 `null`(persistent) 권장. |
| T5 | queue max | **5개** | 화면 자리 한계. 초과 시 oldest dismiss. |
| T6 | role | **info/success/warning = status, error = alert** | a11y 정합. |
| T7 | 진입 애니메이션 | **0 (instant)** | UI_GUIDE slop 회피. needs 부상 시 별도 ADR. |
| T8 | action prop | **단일 action `{label, onClick}`** | "Undo" 패턴 매우 흔함. 다중 action 0. |

### Modal

| # | 결정점 | 선택 | 사유 |
|---|---|---|---|
| M1 | 제어 패턴 | **controlled (isOpen + onClose)** | host state 책임. imperative open 0. |
| M2 | size tier | **sm/md/lg (480/640/800px)** | 표준 web 사이즈. Button과 다름(width 단위). |
| M3 | close 트리거 | **ESC + backdrop + × 버튼** | 표준 a11y. backdrop은 `closeOnBackdrop=false`로 끌 수 있음. |
| M4 | focus trap | **자체 구현** | 작은 atom — `react-focus-lock` 의존 추가 없음. tab/shift-tab 순환만. |
| M5 | portal | **document.body** | z-index 충돌 회피. SSR 가드 필수. |
| M6 | backdrop 시각 | **`rgba(0,0,0,0.5)`** | UI_GUIDE — blur 슬롭 회피. 단순 overlay. |
| M7 | title prop | **있음 (선택)** | 제공 시 header 자동 렌더 + aria-labelledby 자동. 미제공 시 host가 Body 안에 직접 배치. |
| M8 | compound (Body/Footer) | **사용** | Card 패턴 답습. layout 표준화 + 유연성. |

## 8. 보안·엣지 케이스

### Toast

| 엣지 | 처리 |
|---|---|
| Provider 없이 useToast 호출 | console.error + no-op (또는 throw — 사용자 체감상 throw 권장) |
| 동시 6개+ | oldest 자동 dismiss |
| duration=0 | persistent (자동 dismiss 안 함) |
| action 누락 + dismiss 누락 | × button만으로 닫음 |
| SSR | Provider mount 시점에 `typeof document` 가드 |

### Modal

| 엣지 | 처리 |
|---|---|
| isOpen=false | portal 자체 mount 안 함 |
| 첫 mount 시 focus | 첫 focusable element 자동 |
| close 시 focus 복귀 | useRef로 트리거 element 저장 → close 시 `.focus()` |
| 외부 라이브러리 focus-trap 없이 | tabIndex 순환 직접 구현 (작은 atom 정신) |
| nested modal | 명시 금지 안 함 — 동작은 보장하나 권장도 안 함 |
| Body 안 textarea의 ESC | Modal ESC 우선 (host가 stopPropagation 필요 시 직접) |

## 9. 결승선 (Phase 20 closure 조건)

- S1–S9 통과 (위 6장)
- demo-fab-monitor 5 dogfood 자리 모두 적용 + build 통과
- atom 18 → 20 도달
- ROADMAP §M2.b Phase 4 부분 closure (Modal+Toast ✅, Select 미룸 명시)
- Changeset minor bump

## 10. 향후 거리 (out of this phase)

- Toast 진입/사라짐 애니메이션 (별도 ADR — slop 회피 기준 확립 후)
- Modal drawer variant (별도 phase)
- Select atom (자리 부족으로 미룸 — 다음 dogfood로 발견)
- Tooltip + Tabs (Phase 3 — dogfood 부재, 별도 evidence 권장)
