# Tasks — demo-fab-monitor 1차 polish

순서는 의존성 따라 고정. T1~T3 끝나야 T4 시작.

| # | Task | 파일 | 완료 기준 |
|---|------|------|-----------|
| T1 | CSS inject util 작성 | `src/lib/injectCss.ts` | `injectCss(id, css)` 함수 export, SSR 가드, 중복 inject 방지 |
| T2 | `FilterChip` primitive | `src/components/internal/FilterChip.tsx` | active/inactive 시각 + `:focus-visible` outline + hover bg, CSS inject 사용 |
| T3 | `IconButton` primitive | `src/components/internal/IconButton.tsx` | 36×36 native button, hover bg, `:focus-visible` outline, optional badge prop |
| T4 | `Avatar` primitive | `src/components/internal/Avatar.tsx` | size prop, name → 첫 글자(Array.from safe), bg=primary |
| T5 | `NavButton` primitive (sidebar용) | `src/components/internal/NavButton.tsx` | active/inactive + icon + label + optional trailing badge, focus indicator |
| T6 | `Sidebar.tsx` 교체 | `src/layout/Sidebar.tsx` | onMouseEnter/Leave 0개. nav 5 button을 NavButton으로. Avatar 사용 |
| T7 | `Topbar.tsx` 교체 + LIVE glow 제거 | `src/layout/Topbar.tsx` | bell/theme/Pause 버튼을 IconButton/Button으로. LIVE dot은 `outline` ring 1px로 (box-shadow glow 제거) |
| T8 | `EquipmentPage.tsx` 교체 | `src/pages/EquipmentPage.tsx` | type filter 5개 FilterChip, 디테일 X 버튼 IconButton, table tr hover를 CSS class로 (inject 사용), Equipment detail 버튼 onClick에 console.info placeholder |
| T9 | `AlarmsPage.tsx` 교체 | `src/pages/AlarmsPage.tsx` | tab button FilterChip 변형 (badge in chip 허용) or 별 컴포넌트, invalid selection placeholder 표시 |
| T10 | `SettingsPage.tsx` 교체 | `src/pages/SettingsPage.tsx` | theme button (light/dark)을 FilterChip으로 |
| T11 | `EquipmentRow` / `AlarmRow` hover CSS화 | `src/components/EquipmentRow.tsx`, `AlarmRow.tsx` | onMouseEnter/Leave 제거, className + CSS inject |
| T12 | `useSimulation.ts` selection invariant | `src/data/useSimulation.ts` | `isAlarmActive(id)` helper export 또는 `selectAlarm(id)`이 자동 무효화 처리할 방법 제공 |
| T13 | `seed.ts` factory + Alarms seed timestamp 정리 | `src/data/seed.ts` | `createAlarmsSeed(now)` factory, module top-level `Date.now()` 제거 |
| T14 | `useSimulation`이 factory 호출 | `src/data/useSimulation.ts` | useState init callback에서 `createAlarmsSeed(Date.now())` |
| T15 | `UtilizationChart` 컴포넌트 | `src/components/UtilizationChart.tsx` | 24h utilization mock 데이터, inline SVG line + axis, dark/light 자동 적응 |
| T16 | Dashboard에 chart 합치기 | `src/pages/DashboardPage.tsx` | UtilizationChart 카드 KPI row 아래 full-width로 추가 |
| T17 | Build 통과 | (검증) | `pnpm -F demo-fab-monitor build` exit 0 |
| T18 | 보안 점검 | (검증) | 변경 코드에 새 user input/외부 fetch/eval/dangerouslySetInnerHTML 없음 확인 |

## 의존성

- T1 → T2, T3, T5 (CSS util 사용)
- T2 → T8, T9, T10 (FilterChip 사용)
- T3 → T6, T7, T8, T9 (IconButton 사용)
- T4 → T6 (Avatar 사용)
- T5 → T6 (NavButton 사용)
- T1 → T11 (CSS util 사용)
- T13 → T14 (factory 사용)
- T12, T14 → T9 (alarms page가 invariant 사용)
- T15 → T16
- 모든 T1~T16 → T17 (build)
- T17 → T18

## 테스트 / 보안 태스크 명시

- **T17**: 빌드 통과 — 테스트 대용 (데모 앱은 unit test 없음)
- **T18**: 보안 점검 — 새 input/외부 호출/SSR 위험 없음 확인. 변경 사항이 모두 시각·인터랙션이라 보안 surface 0
