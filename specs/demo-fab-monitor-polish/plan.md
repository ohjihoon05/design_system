# Plan — demo-fab-monitor 1차 polish

## 1. 전략

3개 레이어로 정리:
1. **데모 내부 primitive 추출** (`apps/demo-fab-monitor/src/components/internal/`) — IconButton, Avatar, FilterChip. design system 본체에 올리지 않고 데모 내부에 둠 (별 spec에서 본체 승급).
2. **CSS module-scope inject 패턴 통일** — design system이 이미 쓰는 `ensureCssInjected()` 패턴을 데모 primitive에도 적용. 모든 hover/focus pseudo를 인라인 event 대신 CSS로.
3. **데이터 정합성 픽스** — `seed.ts`에서 `now` 모듈 톱레벨 제거, `useSimulation`이 selection invalidation 처리.

## 2. 아키텍처 결정 — "왜"

| 결정 | 선택 | 대안 | 왜 |
|------|------|------|-----|
| Hover/focus 처리 | module-scope CSS inject | inline `onMouseEnter`/`onMouseLeave` | design system 본체가 이미 `ensureCssInjected` 패턴(`Card.tsx`, `Switch.tsx`) 사용 — 일관성. inline handler는 `:focus-visible`을 표현 못 함 |
| 데모 primitive 위치 | `apps/demo-fab-monitor/src/components/internal/` | design system 본체 (`packages/web`) 추가 | CLAUDE.md "1단계는 tokens + web 두 패키지만, 새 컴포넌트 추가는 ADR + Changesets minor 필요". polish 사이클에 본체 변경은 scope 위반. demo 내부에서 패턴을 입증한 뒤 별 spec으로 승급 |
| Selection dangling 처리 | useSimulation이 cap-out 시 `null`로 설정 | UI에서 placeholder | UI 처리는 race 가능 + 책임 분산. 데이터 소스에서 invariant 유지 |
| Now timestamp | `useEffect`에서 `Date.now()` + state | module-top-level const | module-top-level은 import 시점에 평가 — long-running에서 stale |
| 차트(V1) | 100% inline SVG | recharts/visx | "외부 lib 0개" 원칙 유지. 데모 한 화면 line chart 정도면 inline SVG가 충분 |

## 3. 의존성

- 외부 라이브러리 신규 도입: **없음** (원칙 유지).
- 기존 design system import 추가 없음 — 모두 기존 export로 충분.
- 데모 내부 새 파일 (`components/internal/*`, `data/chartData.ts` 등)만 추가.

## 4. 위험 요소

- **R-1**: CSS module-scope inject 패턴이 SSR 가드 필요(`typeof document === 'undefined'`). 데모는 SPA지만 일관성 차원에서 가드 포함.
- **R-2**: focus indicator를 native button에 outline으로 주면 hover 시 outline이 함께 보일 수 있음 → `:focus-visible`만 사용(브라우저가 키보드 focus만 트리거).
- **R-3**: `selectedAlarmId` null화는 사용자가 디테일 보고 있던 중에 일어나면 깜빡 — 자동 null 대신 "expired" placeholder가 더 부드러움 → §1과 충돌. **결정**: useSimulation은 cap-out된 id를 hook return의 별도 `selectedAlarmInvalid` flag로 알리고, UI는 그 flag 보고 placeholder 띄움 (책임 분리 + UX 부드러움).
- **R-4**: avatar 한 글자 추출이 다국어(한자/이모지) safe해야 → `Array.from(name)[0]` 사용 (surrogate pair safe).

## 5. 테스트 전략

- **Build**: `pnpm -F demo-fab-monitor build` 통과 (TS strict, vite production).
- **Lint**: 프로젝트 root에 lint 명령 있는지 확인, 있으면 실행.
- **Unit test**: 데모 앱에는 vitest 셋업 없음 (spec scope 외) — skip.
- **Manual 확인 권장**: Tab 순회·다크 모드 토글·알람 cap-out 시 placeholder — 사용자가 브라우저에서 확인.

## 6. 구현 순서 (의존성 반영)

1. **demo internal primitive** 3종 만들기 (FilterChip, IconButton, Avatar) — 이후 page에서 사용
2. **CSS inject util** (`src/lib/injectCss.ts`) — 3개 primitive가 공유
3. **모든 native button 교체** — Sidebar nav, Topbar bell/theme/pause-as-icon, Equipment chip/close, Alarms tab, Settings theme
4. **useSimulation selection invariant** — `selectedAlarmInvalid` flag 추가
5. **AlarmsPage** — invalid selection placeholder
6. **seed.ts** module top-level `now` 제거 → seed를 factory function으로
7. **Topbar LIVE dot glow 제거** → 단순 ring
8. **Dashboard utilization chart 컴포넌트 추가** (V1)
9. **Equipment detail 버튼 console.info 핸들러** (V2)
10. **Build·lint** 통과 확인
