---
'@wonik/web': minor
---

`SortableList` atom 추가 — ROADMAP §M2.b Phase 5b closure. **23 atom 도달.**

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
