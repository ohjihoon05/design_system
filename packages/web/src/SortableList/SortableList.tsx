import { useMemo } from 'react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent, Announcements } from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import type { SortableListProps } from './types';

function makeKoreanAnnouncements(labelOf: (id: string) => string): Announcements {
  return {
    onDragStart({ active }) {
      return `${labelOf(String(active.id))} 항목을 잡았습니다. 방향키로 이동, Space 또는 Enter로 놓음, Esc로 취소.`;
    },
    onDragOver({ active, over }) {
      if (over) {
        return `${labelOf(String(active.id))} 항목이 ${labelOf(String(over.id))} 위치로 이동 중.`;
      }
      return `${labelOf(String(active.id))} 항목이 정렬 가능한 영역을 벗어났습니다.`;
    },
    onDragEnd({ active, over }) {
      if (over) {
        return `${labelOf(String(active.id))} 항목을 ${labelOf(String(over.id))} 위치로 이동 완료.`;
      }
      return `${labelOf(String(active.id))} 항목 이동이 완료됨.`;
    },
    onDragCancel({ active }) {
      return `${labelOf(String(active.id))} 항목 이동이 취소되었습니다.`;
    },
  };
}

export function SortableList<T>({
  items,
  getKey,
  renderItem,
  onReorder,
  direction = 'vertical',
  disabled = false,
  className,
  style,
  announceItem,
}: SortableListProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const ids = useMemo(() => items.map((item, idx) => getKey(item, idx)), [items, getKey]);

  const announcements = useMemo(
    () => makeKoreanAnnouncements(announceItem ?? ((id) => id)),
    [announceItem],
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = ids.indexOf(String(active.id));
    const to = ids.indexOf(String(over.id));
    if (from === -1 || to === -1) return;
    onReorder(from, to);
  };

  const strategy =
    direction === 'horizontal' ? horizontalListSortingStrategy : verticalListSortingStrategy;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      accessibility={{ announcements }}
    >
      <SortableContext items={ids} strategy={strategy} disabled={disabled}>
        <div className={className} style={style}>
          {items.map((item, idx) => (
            <SortableItem
              key={ids[idx]}
              id={ids[idx]}
              disabled={disabled}
              render={(args) => renderItem(item, idx, args)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
