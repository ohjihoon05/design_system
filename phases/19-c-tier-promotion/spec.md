# Phase 19 — C tier 승격 묶음: FilterChip + Avatar + ProgressBar (spec.md)

> ROADMAP §M2.b Phase 2 산출물. demo-fab-monitor 한 바퀴 dogfood로 internal 3개가 토큰 정합·사용 패턴 검증된 상태. 한 phase에 묶어서 `@wonik/web` 승격. M2.b 표에서 모두 "demo dogfood ✅".

## 1. 목표

`@wonik/web`에 `FilterChip`, `Avatar`, `ProgressBar` 3 atom 추가. demo-fab-monitor internal 모두 제거 + 사용처 import 교체. atom 카운트 15 → 18 도달.

## 2. 사용처 (검증된 evidence)

| atom | 사용처 | evidence 수 |
|---|---|---|
| FilterChip | AlarmsPage 탭·EquipmentPage 다중필터·SettingsPage theme | **3 페이지 ✅** |
| Avatar | Sidebar 사용자 | 1 (단일이지만 명확한 보편 패턴) |
| ProgressBar | EquipmentRow + EquipmentPage ×2 | **3 사용처 ✅** |

## 3. 컴포넌트 API (signature 확정)

### 3.1 FilterChip

```tsx
interface FilterChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  active?: boolean;          // default false
  children: ReactNode;
}
```

- `aria-pressed={active}` 자동 (toggle button a11y).
- 시각: `interfaceColors.border` + `interfaceColors.surface` + `interfaceColors.text` (inactive).
- active 시: `primary.bg` 배경 + `interfaceColors.primary` border + `primary.selected` 글자색.
- :hover bg `surfaces.surfaceSubtle`. active:hover는 bg 유지.
- :focus-visible — module-scope CSS (ADR-011).
- single-select vs multi-select 분기 X — `active` boolean만, host가 toggle 로직 책임.

### 3.2 Avatar

```tsx
interface AvatarProps {
  name: string;              // required, 첫 글자 추출용
  size?: number;             // px, default 32
  color?: string;            // 배경색 override (default WONIK BLUE)
}
```

- `Array.from(name.trim())[0]` — surrogate-pair safe (emoji/한자 분리 방지).
- 시각: `interfaceColors.primary` bg + `surfaces.surfaceWhite` glyph. `fontSize = Math.round(size * 0.4)`.
- `borderRadius: '50%'` (정원 — atom 본성).
- `aria-hidden` 기본 (사용자 이름은 인접 텍스트에서 노출). host가 명시적 aria 필요하면 prop spread.

### 3.3 ProgressBar

```tsx
type ProgressTone = 'primary' | 'alarm' | 'ready';

interface ProgressBarProps {
  value: number;             // 0-100, 자동 clamp
  height?: number;           // px, default 4
  tone?: ProgressTone;       // default 'primary'
  'aria-label'?: string;     // optional, host가 의미 부여 가능
}
```

- `role="progressbar"` + `aria-valuenow/valuemin/valuemax` 자동.
- 시각: 트랙 `surfaces.surfaceSubtle` + 필 `interfaceColors.primary | statusTokens.alarm.text | statusTokens.ready.dot`.
- `borderRadius: height` (pill 자연 매핑).
- transition `width 600ms ease-out` (시각적 진행 표시).

## 4. 범위 외 (out-of-scope)

- FilterChip:
  - `variant` (filled/outlined) — needs 0. active toggle만으로 충분.
  - `size` (sm/md/lg) — demo 3 사용처 단일 사이즈. needs 부상 시 추가.
  - leading/trailing icon — children으로 자유.
- Avatar:
  - `src` (이미지 fallback) — demo needs 0. 1단계 정신상 minimal.
  - shape variant (square/rounded) — 1 사용처에서 needs 0.
  - status indicator (online dot) — needs 0.
- ProgressBar:
  - tone semantic 확장 (warning/idle/init 등) — demo evidence 0.
  - label 내장 — host가 `<Stack>`으로 텍스트 위/아래 배치.
  - indeterminate (loading 무한 애니메이션) — needs 0 (Spinner 있음).
  - vertical orientation — needs 0.
- AI 슬롭 anti-pattern.
- React 19-only API.
- 글로벌 state 의존.
- hex·px 리터럴 (단, size/height 같은 numeric prop은 inline px 자연 — Button 답습).

## 5. 성공 기준

```bash
# 신규 파일
test -f packages/web/src/FilterChip/FilterChip.tsx
test -f packages/web/src/Avatar/Avatar.tsx
test -f packages/web/src/ProgressBar/ProgressBar.tsx

# public export
grep -q "export { FilterChip }" packages/web/src/index.ts
grep -q "export { Avatar }" packages/web/src/index.ts
grep -q "export { ProgressBar }" packages/web/src/index.ts

# 토큰 의존 (raw hex 0)
! grep -E "#[0-9a-fA-F]{3,6}" packages/web/src/FilterChip/FilterChip.tsx
! grep -E "#[0-9a-fA-F]{3,6}" packages/web/src/Avatar/Avatar.tsx
! grep -E "#[0-9a-fA-F]{3,6}" packages/web/src/ProgressBar/ProgressBar.tsx

# 빌드 + 테스트
pnpm -F @wonik/web build
pnpm -F @wonik/web test   # 회귀 0 + 신규 ≥ 24개 (8/atom 평균)

# demo 교체 closure
test ! -f apps/demo-fab-monitor/src/components/internal/FilterChip.tsx
test ! -f apps/demo-fab-monitor/src/components/internal/Avatar.tsx
test ! -f apps/demo-fab-monitor/src/components/ProgressBar.tsx

# Changeset
test -f .changeset/19-c-tier-promotion.md
```

## 6. CLARIFY 결정사항

| atom | # | 결정점 | 선택 |
|---|---|---|---|
| FilterChip | F1 | `active` toggle 로직 | host 책임 (controlled only). `aria-pressed` 자동. |
| FilterChip | F2 | hover bg active 시 | `primary.bg` 유지 (변화 0) — demo internal과 동일 |
| Avatar | A1 | size tier vs number | **number** 유지. Avatar는 header(32)/list(24)/profile(64) 등 자유 size 본성 |
| Avatar | A2 | color override | `color?: string` 추가 (default WONIK BLUE). 1 사용처가 단일이라 유연성 ↑ |
| Avatar | A3 | image src 옵션 | 없음. needs 부상 시 추가 |
| Avatar | A4 | aria-hidden 기본 | 인접 텍스트에 이름 노출 가정 (Sidebar 패턴). host가 override 가능. |
| ProgressBar | P1 | tone 어휘 | `primary`/`alarm`/`ready` 그대로 (status 도메인 의미 유지) |
| ProgressBar | P2 | value out-of-range | 0-100 자동 clamp |
| ProgressBar | P3 | aria-label | optional — host가 의미 명시 가능. role=progressbar 자체로 valuenow 노출. |
| ProgressBar | P4 | transition 600ms | 유지 — demo 시각 자연 |

## 7. 결승선 (Phase 19 closure 조건)

- S1–S6 측정 통과
- demo-fab-monitor build 통과, 시각 회귀 0
- internal 3 파일 삭제
- ROADMAP §M2.b Phase 2 ✅, atom 15→18
- Changeset minor bump

## 8. 향후 거리 (out of this phase)

- Avatar `src` 이미지 fallback — host product 사용처 부상 시
- ProgressBar `indeterminate` — loading UX needs 부상 시
- FilterChip `size` tier — 다양한 사이즈 needs 부상 시
- IconButton·Button과 묶어서 size 토큰 정합(`componentSize.action.*`) 신설 — 별도 ADR
