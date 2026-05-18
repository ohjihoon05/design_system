---
"@wonik/web": minor
---

Phase 18: IconButton 컴포넌트 추가 (M2.b Phase 1 — demo 승격)

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
