# Phase 24 — SortableList

> ROADMAP §M2.b Phase 5b closure. PRD §1.4.2 ppt-derived.

## 1. 배경 & 동기

ppt에 dnd-kit + sortable 패턴이 두 자리 박혀있음:

| 자리 | 현재 패턴 | 라인 수 |
|---|---|---|
| `Presentation.tsx:43-160` | `SortableThumbnail` 컴포넌트 + `DndContext` + `SortableContext` + `useSortable` + `arrayMove` 직접 구현 | ~120 lines |
| `OutlineCard.tsx:117-156` | `↑/↓ icon Button × 2` + `onMove(index, 'up' \| 'down')` (드래그 미적용) | ~40 lines |

두 자리 모두 reorder 패턴이지만 구현 형태가 다름 (드래그 vs 화살표). atom으로 흡수하면:
- Presentation: ~120 lines → renderItem callback 1개 + onReorder 1개 (~15 lines)
- OutlineCard: 화살표 button 제거 + drag handle 도입 가능 (또는 둘 다 유지하는 prop 옵션)

PRD §1.4.2 SortableList는 ppt-derived 명시. **dogfood 자리 2개**가 atom API generalize 근거를 단단히 잡아준다 (single-consumer 가정 위험 회피).

## 2. 사용자 정의

- **Primary user**: ppt 같은 host 개발자 — `<SortableList items renderItem onReorder />` 한 wrap으로 dnd-kit boilerplate 흡수.
- **Secondary user**: design system 유지보수자 — drag UI a11y(WAI-ARIA grab/move/drop) 일관성 보장.
- **End user**: 마우스 드래그 + 키보드 사용자 모두 reorder 가능 (Space grab → 방향키 move → Space drop → Esc cancel).

## 3. 범위

### In-scope (이번 phase)

`@wonik/web`에 `SortableList` atom 1개 추가. **23 atom 도달.**

- **Generic API**: `items: T[]` + `getKey: (item, idx) => string` + `renderItem: (item, idx, args) => ReactNode` + `onReorder: (from: number, to: number) => void`.
- **renderItem args**: `{ dragHandleProps: object, isDragging: boolean }`. consumer가 어디에 핸들 부착할지 결정.
- **direction**: `'vertical'` (default) | `'horizontal'`. dnd-kit `verticalListSortingStrategy` vs `horizontalListSortingStrategy`.
- **disabled**: prop true 시 드래그/키보드 reorder 차단 (renderItem은 그대로 호출).
- **keyboard a11y**: dnd-kit `KeyboardSensor` + `sortableKeyboardCoordinates`. Space grab, 화살표 move, Space drop, Esc cancel.
- **PointerSensor 활성**: 마우스/터치 드래그.
- **announcements**: 스크린리더 안내 (drag start/move/end/cancel). dnd-kit `accessibility` prop으로 한국어 default.

### Out-of-scope

- **horizontal grid layout** (2D reorder). dnd-kit `rectSortingStrategy`. 다음 phase.
- **virtualization**. 100+ items 자리 등장 시 별도 phase.
- **drag-to-other-container** (drag between lists). 별도 atom (`SortableMulti`)일 가능성.
- **reorder animation 세부 커스터마이즈** (timing/easing). dnd-kit default 사용.
- **drag preview override** (ghost overlay). consumer가 renderItem에서 isDragging 받아 자체 처리.

### 결정점 (autopilot default)

| 결정점 | 채택 | 이유 |
|---|---|---|
| dnd-kit dep type | **regular `dependencies`** (peer 아님) | atom이 자체 동작하려면 dep. tree-shakable + sideEffects:false라 bundle 영향 작음. ppt도 dep으로 사용 중 |
| dnd-kit 버전 | `^6.3.1` (core) + `^9.0.0` (sortable) + `^3.2.2` (utilities) | ppt의 lock 버전 그대로 — drift 회피 |
| 핸들 위치 | **consumer 결정** (renderItem args의 dragHandleProps spread) | 두 자리 패턴이 다름(Presentation 핸들 / OutlineCard 화살표) — atom이 강제하면 한 자리 fit 깨짐 |
| activationConstraint | PointerSensor `distance: 8px` | dnd-kit 표준 — 클릭과 drag 구분 |
| disabled 시 키보드 a11y | drag 차단되더라도 renderItem은 그대로 (consumer가 ↑↓ button을 대체로 둘 수 있도록) | OutlineCard pattern 호환 |
| 한국어 announcements | dnd-kit default 영어 → 한국어 string 5개 override | 한국 host 환경 |
| 시각 토큰 | drag 중 `opacity: 0.4` + `cursor: grabbing`. 별도 색 토큰 없음 | dnd-kit 표준, host CSS와 충돌 0 |
| Sandbox case | 미작성 (Ladle story로 대체) — Phase 23과 동일 정책 | sandbox 1017줄, Ladle이 표준 검증 도구 |

## 4. 성공 기준 (측정 가능)

| 기준 | 측정 |
|---|---|
| Presentation.tsx 코드 절감 | `SortableThumbnail` 컴포넌트 + DndContext + SortableContext 패턴 ~120줄 → SortableList 한 wrap + renderItem **~20줄**로 대체 가능 (ppt 별도 trial PR로 검증) |
| OutlineCard.tsx 코드 절감 | 화살표 button 패턴 ~40줄 → SortableList wrap + drag handle button **~15줄**, 또는 ↑↓ button 유지 + SortableList 추가(점진 a11y) |
| 테스트 coverage | **12+ tests** passing — 렌더링·reorder 콜백·keyboard a11y·disabled·a11y attributes·controlled order |
| atom 개수 | 22 → **23** |
| 토큰 하드코딩 | 0 (drag opacity는 dnd-kit standard CSS) |
| 회귀 | 기존 atom 0 영향. 전체 318 → 330+ tests passing |
| 의존성 추가 | `@dnd-kit/core` + `@dnd-kit/sortable` + `@dnd-kit/utilities` 3개 |

## 5. 엣지 케이스 / 예외

| 케이스 | 동작 |
|---|---|
| items 빈 배열 | renderItem 호출 0번, empty wrapper만 렌더 |
| 같은 자리에 drop (from === to) | onReorder 호출 안 함 (dnd-kit가 자동 처리) |
| getKey가 stable하지 않음 | dnd-kit 표준 경고. consumer 책임 — README 명시 |
| disabled=true 상태에서 키보드 Space | drag 진입 안 됨. Space는 default browser scroll (renderItem button이 받으면 button 동작) |
| 단일 item | drag 가능하나 reorder 효과 0 |
| renderItem이 인터랙티브 element 포함 (Button, Input) | dnd-kit listeners는 dragHandleProps에만 spread되므로 충돌 0 |
| drag 중 외부 items prop 변경 | dnd-kit가 active id 추적 — 변경된 items에 active가 없으면 drag cancel |
| SSR | dnd-kit는 client-only (useEffect 의존). atom 자체는 'use client' 마커 없음 — Next.js App Router host는 wrapper 추가 필요 (README 명시) |

## 6. 의존성 / 통합 지점

### 새 외부 의존성: 3개
- `@dnd-kit/core@^6.3.1` — DndContext, sensors
- `@dnd-kit/sortable@^9.0.0` — SortableContext, useSortable, arrayMove
- `@dnd-kit/utilities@^3.2.2` — CSS.Transform.toString

### 내부 의존성
- `@wonik/tokens` — 미사용 (drag UI는 dnd-kit standard CSS)
- 다른 atom 의존성 0

### 첫 dogfood
- Presentation.tsx SortableThumbnail (별도 ppt PR로 검증)
- OutlineCard.tsx 화살표 button (별도 ppt PR로 검증 또는 점진 마이그레이션)

## 7. 보안 / 인증 / 데이터

stateless presentation atom. onReorder가 받은 from/to index를 consumer가 어떻게 처리(persist·sync·undo)할지 결정. atom 책임 0.

## 8. 성능 목표

- 100 items list rendering < 50ms (dnd-kit default)
- drag latency < 16ms (60fps 유지, dnd-kit 표준)
- reorder commit < 1ms (단순 setState callback)

## 9. 생성/변경 파일 (예상)

- `packages/web/src/SortableList/SortableList.tsx` — 구현 (~180 lines)
- `packages/web/src/SortableList/SortableList.test.tsx` — 12+ tests
- `packages/web/src/SortableList/SortableItem.tsx` — 내부 sortable item wrapper
- `packages/web/src/SortableList/types.ts` — type exports
- `packages/web/src/SortableList/index.ts` — barrel
- `packages/web/src/index.ts` — SortableList export 추가
- `packages/web/package.json` — `@dnd-kit/*` 3개 dep 추가
- `apps/ladle/src/stories/layout-SortableList.stories.tsx` — Ladle catalog (4-5 stories)
- `.changeset/24-sortable-list.md` — `@wonik/web` minor bump
- `docs/ROADMAP.md` — Phase 5b closure 마킹

## 10. 다음 호흡

- ppt 측 별도 trial PR — Presentation SortableThumbnail 패턴 → SortableList atom 교체. OutlineCard도 점진 마이그레이션.
- Phase 25 후보 — `SortableMulti` (drag between containers) 또는 grid 2D reorder. 진짜 dogfood 자리 발견 시.
- atom 23 도달 후: Chromatic visual regression CI 도입 (사내 환경 진입 시).
