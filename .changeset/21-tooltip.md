---
"@wonik/web": minor
---

Phase 21: Tooltip 컴포넌트 추가 (M2.b Phase 3 — positioning + a11y)

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
