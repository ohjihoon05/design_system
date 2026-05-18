---
"@wonik/web": minor
---

Phase 19: C tier 승격 묶음 — FilterChip + Avatar + ProgressBar (M2.b Phase 2)

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
