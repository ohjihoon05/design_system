import type { CSSProperties, ReactNode } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { SortableRenderItemArgs } from './types';

interface SortableItemProps {
  id: string;
  disabled: boolean;
  render: (args: SortableRenderItemArgs) => ReactNode;
}

export function SortableItem({ id, disabled, render }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id, disabled });

  const itemStyle: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 10 : 'auto',
  };

  const dragHandleProps = { ...attributes, ...listeners } as Record<string, unknown>;

  return <>{render({ dragHandleProps, isDragging, setNodeRef, itemStyle })}</>;
}
