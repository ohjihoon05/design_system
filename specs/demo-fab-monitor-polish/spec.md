# Spec — demo-fab-monitor 1차 polish

## 1. 배경

`apps/demo-fab-monitor`는 design system이 만든 데모(WONIK Fab Monitor). 1차 build·dev server 모두 통과했지만, 사용 중·코드 검토에서 design system 자체 원칙을 어기거나 사용자 경험을 헤치는 잔여 이슈가 다수 발견됨. 본 spec은 그 이슈들을 모두 인벤토리화하고 한 사이클에 정리한다.

## 2. 사용자 / 사용 맥락

- **Demo 시연자**: 디자이너·PM에게 design system 가치를 보여주려는 본 프로젝트 owner. 시각 일관성·미세한 인터랙션 품질이 곧 design system 신뢰도.
- **Operator persona (시뮬레이션)**: 알람 큐를 받아 처리하는 fab 운영자. 키보드만으로도 워크플로우가 끊기지 않아야 함.

## 3. 인벤토리 — 부족한 점·문제점

### 3.1 접근성 (critical — design system 원칙 위반)
| # | 위치 | 문제 | 근거 |
|---|------|------|------|
| A1 | `Topbar.tsx` Bell / Theme toggle button | `:focus-visible` outline 없음 | CLAUDE.md CRITICAL: focus indicator `outline: 2px solid var(--color-focus)` 표준 (WCAG 2.4.7 AA, ADR-011) |
| A2 | `Sidebar.tsx` nav button 5개 | focus indicator 없음 | 동일 |
| A3 | `EquipmentPage.tsx` type filter chip 5개 | focus indicator 없음 | 동일 |
| A4 | `EquipmentPage.tsx` close 버튼 (×), `Settings` theme 버튼 | focus indicator 없음 | 동일 |
| A5 | `AlarmsPage.tsx` tab button, `<select>` assignee, "Assign to me" 텍스트 버튼 | focus indicator 없음 | 동일 |
| A6 | `Topbar.tsx` LIVE dot box-shadow glow | "border-only elevation, box-shadow glow 금지"(UI_GUIDE 슬롭 anti-pattern) 위반 가능 | UI_GUIDE.md 표 |

### 3.2 반응성 / 실시간 데이터 버그
| # | 위치 | 문제 |
|---|------|------|
| R1 | `useSimulation.ts` 알람 array가 `.slice(0, 30)`으로 잘릴 때 `selectedAlarmId`가 dangling → 디테일 영역이 갑자기 다른 알람으로 점프 |
| R2 | `seed.ts:63` `const now = Date.now()` module top-level 호출 → import 시점에 평가, 시간 흐를수록 "1h ago"가 "어제"로 점점 부정확 (long-running session) |
| R3 | `useSimulation.ts` `alarmCounter` module-level 카운터 → HMR 시 reset 가능 + StrictMode 이중 mount 시 race 가능 (큰 영향 없지만 sensible default 위반) |
| R4 | `Topbar.tsx` Pause 중에도 `now` state는 1초마다 업데이트 → "12s ago" 같은 상대시간이 paused 상태에서도 흐름. 의미상 OK일 수도 있으나 "PAUSED" 의도와 약간 모순 (이건 of design — 시간 자체는 멈추지 않음. **wontfix 후보**, 기록만) |

### 3.3 코드 중복 / 유지보수성
| # | 위치 | 문제 |
|---|------|------|
| M1 | 8개 native `<button>`에 `onMouseEnter`/`onMouseLeave`로 hover 처리 → CSS pseudo로 한 번에 풀 수 있음. design system의 `ensureCssInjected` 패턴 (Switch/Card)을 따르는 게 일관됨 |
| M2 | "type filter chip"이 EquipmentPage와 AlarmsPage 양쪽에 비슷하게 등장 → `Chip`/`SegmentedItem` 같은 도메인 컴포넌트 추출 후보 (단 design system 자체에 올리는 건 별 spec — 여기선 demo 내부 컴포넌트로 추출) |
| M3 | EquipmentPage 디테일 / AlarmsPage 디테일 모두 "× close 버튼" 동일 패턴 → 데모 내부 `IconButton`으로 통일 |
| M4 | Sidebar `김` 원형 avatar 인라인 → `Avatar` 데모 컴포넌트로 추출 |

### 3.4 다크 모드 시각 검증
| # | 위치 | 문제 |
|---|------|------|
| D1 | Topbar `border-bottom: 1px solid var(--color-border-mid)` — light/dark 모두 `--color-border-mid` 토큰 사용 OK, but inline literal로 들어가 있어 dark 자동 적응됨 (검증 필요) |
| D2 | Sidebar nav active background `var(--color-primary-bg)` — dark에서 `#2A3556` (theme-dark) — 대비 OK |
| D3 | StatusBadge — light·dark에서 status hex가 동일 (theme-dark.ts statusTokens = statusTokensLight). yellow `init` 상태가 dark surface에서 너무 밝을 수 있음 — **별 spec 후보** (design system 자체 이슈, 여기선 wontfix + ADR 메모만) |
| D4 | Sidebar/Topbar의 인라인 button `background: 'var(--color-surface)'` — dark에서 정상 |

### 3.5 데모 density / 가치 전달
| # | 위치 | 문제 |
|---|------|------|
| V1 | Dashboard에 시계열 차트가 없음 — KPI sparkline 2개만으로는 "엔터프라이즈" density 부족. design system에 차트 컴포넌트가 없음을 알면서, 데모 내부 inline SVG로 24h utilization line chart 1개 추가 (gap 시연 강화) |
| V2 | Equipment detail의 "Open in console" / "History" 버튼 onClick 없음 — 데모니까 OK지만 console.info로 데모용 placeholder 행동이라도 |
| V3 | Sidebar nav에 keyboard shortcut hint(예: `G D` for Dashboard) 없음 — 엔터프라이즈 앱 디테일. **wontfix** (scope creep) |

## 4. Out of scope (이 spec에서 안 다룸)

- design system 자체 컴포넌트 추가 (Chip, IconButton, Avatar, Tabs, Select, Table, ProgressBar, Chart, Icon system). 이는 별 spec.
- 다크 모드용 status token 재조정 (ADR + tokens 변경 필요 — 별 spec).
- 모바일 반응형 (ADR-005 1단계 외).
- react-router 도입.

## 5. 성공 기준 (측정 가능)

- A1~A5: 8개 native button 모두 `:focus-visible` 시 `outline: 2px solid var(--color-focus, var(--color-primary))` 표시됨. Tab 키로 nav 순회 시 각 stop이 시각적으로 명확.
- A6: LIVE dot glow `box-shadow`를 제거하고, dot 자체 size·border로 강조하거나 단순 ring 1px로 대체 (slop anti-pattern 회피).
- R1: 알람 디테일 selection이 list cap-out 후에도 안정 — selected가 사라지면 시각적으로 "Closed/expired" 표시 또는 자동 null화.
- R2: `now` 기준이 매번 `Date.now()` 호출되도록 정리.
- M1: 8개 hover handler를 0개로 줄이고 module-scope CSS로 통일.
- M3~M4: `IconButton`, `Avatar` 데모 내부 컴포넌트로 추출, 중복 사이트 일괄 교체.
- V1: Dashboard에 24h utilization line chart 1개 추가 (가짜 데이터, inline SVG).
- 빌드(`pnpm -F demo-fab-monitor build`) 통과, lint(있다면) 0.

## 6. 엣지 케이스

- 알람이 list cap(30)을 넘었을 때 selectedAlarmId가 가리키는 알람이 사라짐 → 디테일 영역이 placeholder("이 알람은 만료/종료되어 더 이상 표시되지 않습니다")로 graceful 처리.
- theme toggle 즉시 + persist — 새 브라우저 탭에서 새로고침해도 동일 테마 유지(이미 작동, 회귀 없는지 확인).
- 키보드만 사용: Tab으로 sidebar → topbar → main 순환, Enter/Space로 모든 인터랙티브 요소 활성화 가능.

## 7. 보안

- 본 데모는 로컬 정적 데이터만 다루며 외부 API/입력 미사용. 기존 인증 체계 없음 (데모). 따라서 별도 보안 surface 없음.

## 8. 성능

- 해당없음 (mock 데이터 10대·tick 2s).
