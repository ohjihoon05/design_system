---
"@wonik/web": minor
---

Phase 20: Toast + Modal 묶음 추가 (M2.b Phase 4 부분 — dogfood-driven)

### `@wonik/web` (minor)

새 named export 5개: `ToastProvider`, `useToast`, `Toast`, `Modal`, + 타입(`ToastApi`/`ToastOptions`/`ToastTone`/`ToastPosition`/`ToastAction`/`ToastItem`/`ToastProviderProps` + `ModalProps`/`ModalOwnProps`/`ModalBodyProps`/`ModalFooterProps`/`ModalSize`).

demo-fab-monitor에 진짜 자연 자리 5개(Toast 4 + Modal 1) 발견 → dogfood-driven 동시 도입. atom **18 → 20** 도달 (Chromatic(20+) trigger 통과). ROADMAP §M2.b Phase 4 부분 closure (Select는 자리 부족으로 미룸).

#### Toast (Provider + hook + view)
- `ToastProvider` — context provider. `position?: 'top-right'|'bottom-right'|'top-center'|'bottom-center'` (default `bottom-right`) + `max?: number` (default 5, oldest-drop).
- `useToast(): { show, dismiss, dismissAll }` — Provider 밖에서 호출 시 throw.
- `tone: 'info'|'success'|'warning'|'error'` — `interfaceColors` + `statusTokens.ready/warning/alarm` 매핑.
- `duration?: number | null` (default 4000ms, `0`/`null` = persistent).
- `action?: { label, onClick }` — Undo 등 단일 action. 클릭 시 자동 dismiss.
- a11y: `role="status"` (info/success/warning) / `role="alert"` + `aria-live="assertive"` (error). 스택 region `role="region"` + `aria-label="알림"`.
- × dismiss 버튼 항상 표시 (`aria-label="닫기"`).
- 진입 애니메이션 0 (UI_GUIDE slop 회피 — 즉시 등장).

#### Modal (controlled portal)
- `isOpen` + `onClose` controlled. `title?` 제공 시 header 자동 + `aria-labelledby` 연결.
- `size: 'sm'|'md'|'lg'` (480/640/800 max-width). `closeOnBackdrop?` (default true) + `closeOnEsc?` (default true).
- compound: `Modal.Body` + `Modal.Footer` (padding/border 표준화).
- `createPortal` → `document.body` (SSR 가드 포함).
- focus trap 자체 구현 — 첫 focusable 자동 focus + Tab/Shift-Tab 순환 + close 시 트리거 element로 복귀.
- body scroll lock (open 시 `overflow:hidden`, close 시 복구).
- backdrop `rgba(0,0,0,0.5)` — backdrop-filter blur 0 (UI_GUIDE slop 회피).
- a11y: `role="dialog"` + `aria-modal="true"`.

#### demo dogfood (Phase 20 closure 내부)
- `main.tsx`: `<ToastProvider position="top-right">` 감싸기.
- `useSimulation.ts`: 새 alarm 생성(2초/20% 확률) 시 severity → tone 매핑된 toast.show.
- `AlarmsPage.tsx`:
  - `Acknowledge` → `toast.show({ tone: 'success' })`
  - `Close alarm` → Modal confirm(`size="sm"`, danger Button) → 확인 시 `closeAlarm` + Undo action toast
- `SettingsPage.tsx`: `Save changes` → `toast.show({ tone: 'success' })`.

#### 테스트
- 32 신규 (Toast 14 + Modal 18). 전체 283 passing. 회귀 0.
- focus trap, body scroll lock, ESC/backdrop, role=dialog/aria-modal/aria-labelledby, role=status/alert/region 모두 커버.

#### 거부된 대안
- Toast 진입 애니메이션 — UI_GUIDE slop 기준. needs 부상 시 별도 ADR.
- Modal drawer variant — 별개 phase.
- Modal 외부 focus-trap 라이브러리 의존 — 작은 atom 정신. 직접 구현.
- `useToast` 외 imperative `toast.show()` (전역 호출) — Provider 필수 + a11y 보장 위해 hook only.

### Layer A atom count

18 → 20 atoms 도달. Chromatic(20+) 검토 trigger 통과 (도입은 별도 결정).
