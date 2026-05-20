# Phase 24 — SortableList: Implementation Plan

## 1. 아키텍처

### 모듈 분리
SortableList는 atom 1개지만 **2개 파일**로 분리하면 가독성/테스트성 ↑:
- `SortableList.tsx` — public API. DndContext + SortableContext wrap + sensors 설정 + items map.
- `SortableItem.tsx` — internal. useSortable hook을 받는 wrapper. renderItem 호출 + dragHandleProps/isDragging 전달.

### Public API
```tsx
<SortableList<T>
  items={T[]}                                                  // generic data
  getKey={(item, idx) => string}                               // stable id
  renderItem={(item, idx, args) => ReactNode}                  // render callback
  onReorder={(from: number, to: number) => void}               // commit
  direction="vertical"                                         // 'vertical' | 'horizontal'
  disabled={false}
  className={string}
  style={CSSProperties}
/>
```

`renderItem`의 `args`:
```ts
{
  dragHandleProps: object;  // attributes + listeners spread 대상
  isDragging: boolean;
  setNodeRef: (el: HTMLElement | null) => void;  // item root에 부착 (transform 적용 위해)
  itemStyle: CSSProperties;  // transform/transition/opacity 적용된 style
}
```

### dnd-kit 통합
```tsx
const sensors = useSensors(
  useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
);

const handleDragEnd = ({ active, over }: DragEndEvent) => {
  if (!over || active.id === over.id) return;
  const from = items.findIndex((it, idx) => getKey(it, idx) === active.id);
  const to = items.findIndex((it, idx) => getKey(it, idx) === over.id);
  if (from === -1 || to === -1) return;
  onReorder(from, to);
};
```

### 키보드 a11y announcements
한국어 5문장 default:
- `onDragStart`: "{label} 항목 잡음. 방향키로 이동, Space 또는 Enter로 놓음, Esc로 취소."
- `onDragOver`: "{label}이 새 위치로 이동 중."
- `onDragEnd`: "{label}을 이동 완료."
- `onDragCancel`: "이동이 취소됨."

label은 `getKey(item, idx)` 또는 `String(active.id)`. consumer가 더 정확한 label 원하면 prop `getItemLabel?: (item, idx) => string` 추가.

### 시각
drag 중 item: `opacity: 0.4` + `zIndex: 10`. transform은 dnd-kit이 inline style로 자동 처리. 별도 토큰 사용 안 함 (interfaceColors와 무관).

## 2. 의존성

### 새 외부 deps (3개)
| Package | Version | 용도 |
|---|---|---|
| `@dnd-kit/core` | `^6.3.1` | DndContext, sensors, DragEndEvent |
| `@dnd-kit/sortable` | `^9.0.0` | SortableContext, useSortable, arrayMove, vertical/horizontal strategy |
| `@dnd-kit/utilities` | `^3.2.2` | CSS.Transform.toString |

ppt의 lock 버전과 동일 — drift 회피. peer가 아닌 regular dep으로 추가 (atom 자체 동작 보장).

### 내부 deps
- `@wonik/tokens`: 사용 안 함 (drag UI는 dnd-kit standard)
- 다른 atom: 사용 안 함

## 3. 위험 / 트레이드오프

| 위험 | 완화 |
|---|---|
| **dnd-kit dep 추가로 bundle size 증가** | dnd-kit는 sideEffects:false + tree-shakable. atom 분리되어 host가 SortableList 미사용 시 dep만 추가될 뿐 bundle X (Vite tree-shaking) |
| **테스트 환경에서 PointerEvent 미지원 (jsdom)** | dnd-kit 테스트는 reorder logic을 직접 호출 (handleDragEnd) — 실제 drag simulation 대신 callback test. keyboard sensor도 fireEvent로 시뮬 가능 |
| **getKey가 idx에 의존 (`String(idx)`)하면 reorder 후 key drift 발생** | spec §5 명시. consumer 책임. README에 stable id 권장 |
| **dragHandleProps를 잘못 부착 (interactive child에 spread)** | renderItem args로 명시적 분리. 잘못 사용하면 click이 drag로 오인되지만 PointerSensor의 distance:8 조건이 일부 완화 |
| **SSR (Next.js App Router)** | dnd-kit는 client-only. 'use client' 마커 없으면 server render 시 useEffect 미발화. README에 client component wrapper 권장 명시 |
| **horizontal direction 미지원 자리에서 사용** | strategy prop으로 명시. default vertical (ppt 두 자리 모두 vertical) |
| **dnd-kit a11y default가 영어** | 한국어 announcements 5문장 override |
| **drag 중 items prop이 외부에서 변경됨** | dnd-kit이 active id 추적. items에 없으면 drag cancel (dnd-kit default 동작) |

## 4. 테스트 전략

TDD. Vitest + @testing-library/react + fireEvent (프로젝트 표준).

### 테스트 카테고리 (12+ tests)

1. **렌더링** (3)
   - items 길이만큼 renderItem 호출
   - 빈 items → 0번 호출 + empty wrapper
   - `direction="horizontal"` prop 전달

2. **a11y attributes** (3)
   - 각 item에 `role="button"` + `aria-roledescription` + `tabIndex={0}`
   - dragHandleProps spread 시 button 받는 element가 tabbable
   - disabled=true → tabIndex=-1 + aria-disabled

3. **reorder 콜백** (3)
   - handleDragEnd가 (from, to) 정확히 onReorder 호출
   - active === over → onReorder 호출 안 함
   - active나 over가 items에 없음 → onReorder 호출 안 함 (safety)

4. **controlled order** (1)
   - items prop 변경 시 즉시 렌더 반영 (rerender)

5. **disabled** (2)
   - disabled=true → useSortable disabled 전달
   - disabled=true 상태에서도 renderItem은 호출됨 (consumer 대체 UI 가능)

### Ladle stories (4-5)
- `Basic` — text list 5개, drag reorder
- `WithCustomHandle` — renderItem이 핸들 ⠿ 부분에만 dragHandleProps 부착
- `Horizontal` — direction="horizontal"
- `Disabled` — disabled=true
- `RealisticOutlineCard` — ppt OutlineCard 모방 (Card + Badge + InlineEditableText 조합)

### 미적용
- Sandbox 6 case 추가 X (Phase 23과 동일 정책, Ladle로 대체)
- E2E drag simulation X (jsdom 한계 — handleDragEnd unit test로 대체)

## 5. 변경 파일 목록

| 파일 | 변경 |
|---|---|
| `packages/web/src/SortableList/SortableList.tsx` | 신규 (~120 lines) |
| `packages/web/src/SortableList/SortableItem.tsx` | 신규 (~50 lines) |
| `packages/web/src/SortableList/SortableList.test.tsx` | 신규 (12+ tests) |
| `packages/web/src/SortableList/types.ts` | 신규 |
| `packages/web/src/SortableList/index.ts` | 신규 (barrel) |
| `packages/web/src/index.ts` | 신규 export 추가 |
| `packages/web/package.json` | `@dnd-kit/*` 3 dep 추가 |
| `apps/ladle/src/stories/layout-SortableList.stories.tsx` | 신규 (4-5 stories) |
| `.changeset/24-sortable-list.md` | `@wonik/web` minor |
| `docs/ROADMAP.md` | Phase 5b closure |
