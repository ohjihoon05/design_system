# @wonik/web

## 2.0.0

### Minor Changes

- 2c2c18a: Phase 18: IconButton 컴포넌트 추가 (M2.b Phase 1 — demo 승격)

  ### `@wonik/web` (minor)

  새 named export: `IconButton` + types (`IconButtonProps`/`IconButtonOwnProps`/`IconButtonVariant`/`IconButtonSize`).

  ROADMAP §M2.b sub-batch Phase 1. demo-fab-monitor 한 바퀴 dogfood로 토큰 정합·사용 패턴이 이미 검증된 internal IconButton의 승격 (C tier — 가장 안전한 첫 단계).

  - `variant`: `'outline'` (default, border 1px solid `interfaceColors.border`) / `'ghost'` (border none)
  - `size`: `'sm'` (24×24) / `'md'` (32×32, default) / `'lg'` (40×40) — Button.tsx 패턴 답습으로 inline literal. 향후 `componentSize.iconButton` 토큰 신설 거리 ROADMAP 등록.
  - `'aria-label'` **타입 레벨 필수** — icon-only는 a11y 필수 (WCAG 4.1.2 Name, Role, Value). 누락 시 TypeScript 컴파일 에러.
  - `children`: ReactNode — icon 1개. 자동 size 계산 없음, host가 명시.
  - 시각 토큰: `interfaceColors.text` / `interfaceColors.border` / `radius.sm`. background `'transparent'` 공통.
  - `:hover` → `background: var(--color-surface-subtle, transparent)` (ADR-011 module-scope CSS 1회-inject).
  - `:focus-visible` → `outline: 2px solid var(--color-focus, var(--color-primary))` + `outline-offset: 2px` (WCAG 2.4.7 AA).
  - disabled → opacity 0.5 + cursor not-allowed.
  - badge **내장 안 함** — Badge atom과 wrapper 조합 패턴 (atom 분리 원칙). demo 1/3 사용처(Topbar 알림벨)에서만 badge 사용했음.
  - 16 신규 tests, 214 passing. 회귀 0.

  ### demo 승격 closure

  internal `apps/demo-fab-monitor/src/components/internal/IconButton.tsx` 삭제. 3 사용처(`Topbar.tsx` 알림벨·테마토글 + `EquipmentPage.tsx` close)가 `@wonik/web`로 import 교체.

  알림벨 badge는 `<span style="position:relative"><IconButton/><Badge style="position:absolute..."/></span>` wrapper 패턴. alarm 색은 Badge atom inline `style` override(`var(--color-status-alarm-text)`) — Badge atom의 semantic variant는 needs 부상 시 별도 phase.

  ### Layer A atom count

  14 → 15 atoms 도달. Storybook(15+) 검토 trigger 시점 (ROADMAP 별도 결정).

- 0d83772: Phase 19: C tier 승격 묶음 — FilterChip + Avatar + ProgressBar (M2.b Phase 2)

  ### `@wonik/web` (minor)

  새 named export 3개: `FilterChip`, `Avatar`, `ProgressBar` + 각 type.

  demo-fab-monitor 한 바퀴 dogfood로 internal 3개의 토큰 정합·사용 패턴이 검증된 상태. ROADMAP §M2.b Phase 2 C tier 승격. atom 15 → 18.

  #### FilterChip

  - `active?: boolean` — `aria-pressed` 자동 (toggle button a11y).
  - 시각: inactive `interfaceColors.surface/border/text`, active `primary.bg/selected` + `interfaceColors.primary` border.
  - :hover bg `surfaces.surfaceSubtle`. active 시 `primary.bg` 유지.
  - :focus-visible — module-scope CSS (ADR-011).
  - single·multi-select 분기 X — host가 toggle 로직 책임.
  - 사용 evidence: 3 페이지 (AlarmsPage 탭, EquipmentPage 다중필터, SettingsPage theme mode).

  #### Avatar

  - `name: string` (required) + `size?: number` (px, default 32) + `color?: string` (default `interfaceColors.primary`).
  - `Array.from(name.trim())[0]` — surrogate-pair safe (emoji/한자 분리 방지).
  - `aria-hidden` 기본 (인접 텍스트에 이름 노출 가정). `aria-label` 제공 시 자동 off.
  - `borderRadius: '50%'` (정원). `fontSize = round(size * 0.4)`.
  - size를 sm/md/lg tier로 박지 않음 — header/list/profile에서 자유 size 본성.
  - 사용 evidence: 1 (Sidebar `김기현`).

  #### ProgressBar

  - `value: number` (0-100 자동 clamp) + `height?: number` (default 4) + `tone?: 'primary'|'alarm'|'ready'` (default `primary`).
  - `role="progressbar"` + `aria-valuenow/valuemin/valuemax` 자동.
  - 트랙 `surfaces.surfaceSubtle`, 필 `interfaceColors.primary | statusTokens.alarm.text | statusTokens.ready.dot`.
  - `borderRadius: height` (자연 pill 매핑). transition `width 600ms ease-out`.
  - 사용 evidence: 3 (EquipmentRow primary, EquipmentPage ×2).

  ### demo 승격 closure

  3 internal 파일 삭제 — `apps/demo-fab-monitor/src/components/internal/FilterChip.tsx`, `internal/Avatar.tsx`, `components/ProgressBar.tsx`. 7 사용처(AlarmsPage·EquipmentPage·SettingsPage·Sidebar·EquipmentRow) 모두 `@wonik/web` import로 교체.

  ### 테스트

  37 신규 (FilterChip 10 + Avatar 13 + ProgressBar 14). 전체 251 passing. 회귀 0.

  ### Layer A atom count

  15 → 18 atoms 도달. M2.b Phase 2 closure. 다음 sub-batch Phase 3 = Tooltip + Tabs (dogfood 없는 영역, 별도 host evidence 권장).

- 0c451f8: Phase 20: Toast + Modal 묶음 추가 (M2.b Phase 4 부분 — dogfood-driven)

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

- ea5673a: Phase 21: Tooltip 컴포넌트 추가 (M2.b Phase 3 — positioning + a11y)

  ### `@wonik/web` (minor)

  새 named export 1개: `Tooltip` + types(`TooltipProps`/`TooltipOwnProps`/`TooltipPlacement`).

  ROADMAP §M2.b sub-batch Phase 3 일부 closure (Tooltip). Tabs는 dogfood 자리 미발견으로 별도 phase 보류.

  #### API

  - `children: ReactElement` — trigger element (button/anchor/IconButton 등). cloneElement로 핸들러 + `aria-describedby` 자동 wire.
  - `content: ReactNode` — bubble 내용 (plain text 또는 inline node).
  - `placement?: 'top'|'right'|'bottom'|'left'` (default `'top'`).
  - `openDelay?: number` (default 200ms) — hover/focus 후 노출 지연 (flicker 방지).
  - `closeDelay?: number` (default 0ms) — mouseLeave/blur 후 hide 지연.
  - `id?: string` — 명시 안 하면 `useId()` 기반 auto-generated.
  - `disabled?: boolean` — true면 절대 노출 안 함 (핸들러는 no-op).

  #### 동작

  - 노출 트리거: `mouseenter` + `focus`. 키보드 사용자 접근성(WCAG 2.1 SC 1.4.13) 보장.
  - 숨김 트리거: `mouseleave` + `blur` + `Escape` 키.
  - pending openTimer는 mouseLeave/blur 시 cancel — 짧은 hover에 깜빡이지 않음.
  - cleanup에서 모든 timer clear.

  #### 시각 토큰 (모두 CSS 변수 경유 — 하드코딩 0)

  - background: `interfaceColors.text` (host inverted bg)
  - color: `interfaceColors.surface`
  - padding: `'6px 10px'`
  - borderRadius: `radius.sm` (5px)
  - fontSize: `fontSize.label` (12px)
  - maxWidth: `'280px'`
  - z-index: 1000

  #### A11y

  - `role="tooltip"` + auto-generated id
  - `aria-describedby` chain — 사용자 정의 값 보존하면서 open 시 우리 id 추가
  - pointer-events: none — bubble 자체는 hover hijack 안 함

  #### 거부된 대안

  - portal 사용 — atom 단순성 우선. host가 overflow:hidden 자르면 wrap 후 portal 별도 phase.
  - 자동 flip (BoundaryDetector) — 큰 단위. 첫 단계는 host placement 지정 책임.
  - 진입 애니메이션 — UI_GUIDE slop 회피 (즉시 등장).
  - click trigger — 별도 Popover atom 후보.

  #### 테스트

  20 신규 tests. 회귀 0 목표 (테스트 환경 lock 차단으로 자동 검증 미실행 — 사용자 검수 후 `pnpm -F @wonik/web test --run`).

  ### Layer A atom count

  20 → 21 atoms. ROADMAP §M2.b Phase 3 partial (Tabs 별도 보류).

- ff27e4e: `InlineEditableText` atom 추가 — ROADMAP §M2.b Phase 5a (분할 closure).

  ppt OutlineCard.tsx 75-93줄의 인라인 편집 boilerplate(useState×2 + useEffect sync + Input+keydown+blur 토글 30줄)를 한 줄로 흡수.

  **API**:

  ```tsx
  <InlineEditableText
    value={title}
    onChange={setTitle}
    trigger="single" // 'single' | 'double'
    saveOnBlur={true} // false면 onBlur=cancel
    selectOnFocus={true} // 편집 진입 시 select-all
    as="h2" // 표시 모드 element tag — span / p / h1-h4
    size="md" // sm / md / lg (Input pass-through)
    placeholder="..." // empty value 시 표시
    disabled={false}
    ariaLabel="슬라이드 제목"
  />
  ```

  **키보드**: 표시 모드에서 Enter / Space로 편집 진입. 편집 모드에서 Enter=save, Escape=cancel.
  **a11y**: 표시 모드 `role="button"` + `aria-label` 자동 (value fallback). focus indicator outline 2px (WCAG 2.4.7 AA).
  **토큰**: 모두 `interfaceColors.*` + `fontSize.*` + `fontFamily.base` 경유, 하드코딩 0.

  dogfood 자리(별도 ppt PR): `ppt/.../OutlineCard.tsx` 30→3줄 교체.

  **관련**: Phase 5b SortableList는 별도 phase로 분리(dnd-kit wrap + WAI-ARIA keyboard drag 패턴 필요).

- 3568955: `SortableList` atom 추가 — ROADMAP §M2.b Phase 5b closure. **23 atom 도달.**

  ppt 두 자리(Presentation.tsx SortableThumbnail 패턴 ~120줄 + OutlineCard.tsx 화살표 button ~40줄)를 generic atom으로 흡수.

  **API**:

  ```tsx
  <SortableList<T>
    items={data}
    getKey={(item, idx) => stableId}
    renderItem={(item, idx, { dragHandleProps, isDragging, setNodeRef, itemStyle }) => (
      <div ref={setNodeRef} style={itemStyle}>
        <button {...dragHandleProps}>⠿</button>
        <span>{item.name}</span>
      </div>
    )}
    onReorder={(from, to) => /* commit */}
    direction="vertical"   // 'vertical' (default) | 'horizontal'
    disabled={false}
  />
  ```

  **핵심**:

  - Generic `<T>` — array of any shape
  - `renderItem` callback이 `dragHandleProps`/`isDragging`/`setNodeRef`/`itemStyle` 제공 — 핸들 위치는 consumer가 결정 (전체 또는 ⠿ 핸들만)
  - `onReorder(from, to)` index callback — items 외부 state는 consumer 관리
  - direction prop — vertical/horizontal sortable strategy

  **a11y**:

  - WAI-ARIA drag pattern (Space grab, 방향키 move, Space/Enter drop, Esc cancel)
  - 한국어 announcements 4개 default (drag start/over/end/cancel)
  - dragHandle button에 role="button" + aria-roledescription="sortable" + tabIndex=0 자동 (dnd-kit)
  - disabled=true → aria-disabled + drag/keyboard 차단

  **의존성 추가**:

  - `@dnd-kit/core@^6.3.1`
  - `@dnd-kit/sortable@^9.0.0`
  - `@dnd-kit/utilities@^3.2.2`

  (ppt가 이미 같은 lock 버전 사용 중. peer가 아닌 regular dep으로 atom 자체 동작 보장. sideEffects:false + tree-shakable.)

  **테스트**: 12 tests PASS (렌더링 3, a11y 3, reorder logic 2, controlled 1, disabled 2, horizontal 1).

  **dogfood 자리**(별도 ppt PR 예정):

  - `Presentation.tsx` SortableThumbnail 패턴 → SortableList 1 wrap (120→20줄)
  - `OutlineCard.tsx` 화살표 button → drag handle 마이그레이션 (또는 ↑↓ 유지하면서 SortableList 추가)

### Patch Changes

- Updated dependencies [602f429]
  - @wonik/tokens@0.3.0

## 1.0.0

### Minor Changes

- 1faf4ad: Phase 12: Card 컴포넌트 추가

  ### `@wonik/web` (minor)

  새 named export: `Card` + types(`CardProps`/`CardOwnProps`/`CardVariant`/`CardPadding`).

  - `variant: 'surface' | 'elevated'` (default `surface`) — surface는 `1px solid border`, elevated는 light theme에서 약한 `box-shadow: 0 1px 3px rgba(0,0,0,0.08)` + dark theme에서 그림자 0 (ADR-009 정신).
  - `padding: 'none' | 'sm' | 'md' | 'lg'` (default `md`) — `space[4]/space[6]/space[8]` 토큰 매핑. md=16px가 Trial 4 ppt `p-4`에 대응.
  - `as?: ElementType` (default `'div'`) — `<section>`/`<article>` 등 semantic HTML로 polymorphic.
  - 시각 색은 `interfaceColors.surface`·`interfaceColors.border` 만 reference — ADR-010 cascade로 host의 `--color-surface`/`--color-border` 정의 시 자동 흡수.
  - module-scope CSS 1회-inject (`data-wonik-card`) — dark theme `box-shadow: none` 분기 + Button/Spinner/Skeleton 패턴 일치.
  - Header/Body/Footer subcomponent·interactive(hover/click) Card·shadow 토큰·image media slot 모두 _out-of-scope_ (Trial 4 evidence 부족, YAGNI).
  - 14 tests 추가, 163+14=177 passing. 회귀 0. ADR-015 추가.

- 4d01176: Phase 14: Badge 컴포넌트 추가

  ### `@wonik/web` (minor)

  새 named export: `Badge` + types (`BadgeProps`/`BadgeOwnProps`/`BadgeVariant`).

  - `variant: 'neutral' | 'primary'` (default `neutral`) — neutral은 subtle label(border + surface bg + text), primary는 attention count/tag(primary bg + white text + no border).
  - `as?: ElementType` (default `'span'`) — inline 본성. `<div>`/`<button>` 등 polymorphic.
  - 단일 sm 크기 (size prop 없음) — Trial 4+5 evidence 모두 sm. needs 부상 시 minor bump로 size 추가.
  - 시각 토큰: `padding=4px 8px`(space[1]/space[3]), `borderRadius=5px`(radius.sm), `fontSize=12px`(fontSize.label), `fontWeight=500`(medium), `display=inline-flex`, `fontVariantNumeric=tabular-nums`.
  - 색은 `interfaceColors.surface`·`interfaceColors.text`·`interfaceColors.border`·`interfaceColors.primary`·`surfaces.surfaceWhite` reference — ADR-010 cascade로 host 변수 정의 시 자동 흡수.
  - box-shadow 0 → dark theme 분기 CSS 불필요 (Card·Button과 달리 module-scope CSS inject 패턴 **생략**).
  - size prop·semantic 색·icon slot·dismissable·count truncation 모두 _out-of-scope_ (Trial 4+5 evidence 0, YAGNI).
  - 9 tests 추가, 177+9=186 passing. 회귀 0. ADR-016 추가.

  Trial evidence: OutlineCard layout 라벨 3회 (Trial 4) + Home slideCount "{N}장" 1회 (Trial 5) = 누적 4회.

- b4fe097: Phase 16: Alert 컴포넌트 추가

  ### `@wonik/web` (minor)

  새 named export: `Alert` + types (`AlertProps`/`AlertOwnProps`).

  - variant prop **없음** (strict YAGNI) — Trial 4+5+6 누적 3회 evidence 모두 error만. info/warning/success는 needs 부상 시 minor bump.
  - `onDismiss?: () => void` — 제공 시 우측에 × 닫기 버튼 자동 렌더 + `aria-label="닫기"`.
  - `as?: ElementType` (default `'div'`) — polymorphic.
  - `role="alert"` 컴포넌트가 강제 (consumer override 차단) — screen reader 알림 a11y.
  - 시각 토큰: `background=statusTokens.alarm.bg`, `border=1px solid statusTokens.alarm.border`, `color=statusTokens.alarm.text`, `padding=12px 16px`(space[5]/space[6]), `borderRadius=10px`(radius.md), `fontSize=14px`(fontSize.titleSm), `display=flex`, `alignItems=center`, `gap=8px`.
  - dark theme: statusTokens가 CSS variable이라 theme-dark.ts에서 자동 분기.
  - variant 확장, leading icon, title/description split, auto-dismiss, animation 모두 _out-of-scope_ (Trial 4+5+6 evidence 0, YAGNI).
  - 12 tests 추가, 186+12=198 passing. 회귀 0. ADR-017 추가.

  Trial evidence: Outline error inconclusive (Trial 4) + Home form error 1회 (Trial 5) + Presentation error 1회 (Trial 6) = 누적 3회.

  **layer A 1차 채움 종료 후보**: Alert 추가로 14 atoms 도달.

- 422b5ea: layer A 1차 채움 종료 (14 atoms × ppt 3페이지 dogfood × interface variable cascade 입증).
  publish-ready transition: 0.0.0 → 0.1.0. 두 패키지 모두 description / repository / homepage / license / publishConfig 추가. `private: true` 제거 + placeholder registry URL로 실수 publish 방어. prepublishOnly build/test guard. `@wonik/web`의 `@wonik/tokens` peer 명시. sideEffects 선언. ADR-018 — registry 옵션 비교 (사내 npm / GitHub Packages / tarball) 및 결정 보류 (사내 IT 협의 후 확정).
  실제 첫 publish는 사내 registry 결정 후 별도 minor phase.
- 28e08ef: Phase 08+09+10: layer A contract 정착 + form 컨트롤 polish

  ### ADR

  - **ADR-010**: host-디자인 시스템 CSS variable contract. interface variable 6개(`--color-bg`/`--color-surface`/`--color-border`/`--color-text`/`--color-text-muted`/`--color-primary`) + cascade fallback 패턴(`var(--color-X, var(--color-X-internal))`). host가 같은 이름 변수 정의 시 host 우선, 미정의 시 우리 internal로 fallback. ppt dogfood Trial 3에서 노출된 invisibility 결함 해결.
  - **ADR-011**: form 컨트롤 focus·resize·placeholder·hover 정책. `:focus-visible` outline 2px + `--color-focus` 7번째 interface variable 격상 + Input/Textarea `:hover` border 진해짐 + `::placeholder` opacity:1 명시 + Textarea `resize?` prop 노출. WCAG 2.1 SC 2.4.7 AA 충족.

  ### `@wonik/tokens` (minor)

  - 새 named export: `interfaceColors` (7 keys — `bg`/`surface`/`border`/`text`/`textMuted`/`primary`/`focus`). 각 키는 cascade fallback 형태 `var(--color-X, var(--color-X-internal))` 반환.
  - `tokens.css` light/dark 양쪽에 새 alias emit (5개): `--color-bg`, `--color-text`, `--color-text-muted`, `--color-focus`, `--color-border-strong`.
  - 기존 export(`surfaces`/`text`/`borders`/`primary` 등) 그대로 유지. BC 0.

  ### `@wonik/web` (minor)

  - 컴포넌트 8개(Button·Input·Textarea·Spinner·Switch·Radio·Checkbox·Text)의 색 reference를 `interfaceColors.*`로 갱신. 의미상 매핑 안 되는 경우(Button primary variant의 흰 텍스트, Switch thumb 흰 점)는 internal 그대로.
  - form 컨트롤 6개(Button·Input·Textarea·Checkbox·Radio·Switch)에 module-scope `ensureCssInjected()` 패턴 적용. `:focus-visible`/`:hover`/`::placeholder` CSS block + className `wonik-X` 부여. consumer className은 머지 보존. SSR 가드 포함.
  - **Textarea**: `resize?: 'none' | 'vertical' | 'both'` prop 추가 (default `'vertical'`, disabled 시 `'none'` 강제). BC compatible — 기존 사용처 영향 0.
  - prop signature 변경 없음 — 신규 optional prop(Textarea의 `resize?`)만 추가. breaking 0.
  - 163 tests passing (회귀 0).

### Patch Changes

- Updated dependencies [422b5ea]
- Updated dependencies [28e08ef]
- Updated dependencies [28e08ef]
- Updated dependencies [28e08ef]
- Updated dependencies [28e08ef]
  - @wonik/tokens@0.2.0
