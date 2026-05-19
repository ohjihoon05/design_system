import type { CSSProperties, ReactNode } from 'react';

export type SortableListDirection = 'vertical' | 'horizontal';

/**
 * Args injected into each `renderItem` invocation.
 * Consumer decides where to attach the drag handle and how to render the
 * dragging state.
 */
export interface SortableRenderItemArgs {
  /** Spread these props onto the element that should grab/drag the item. */
  dragHandleProps: Record<string, unknown>;
  /** True while this item is the one being dragged. */
  isDragging: boolean;
  /** Attach to the item's root for dnd-kit transform to apply. */
  setNodeRef: (el: HTMLElement | null) => void;
  /** Transform/transition/opacity style — apply to the item's root. */
  itemStyle: CSSProperties;
}

export interface SortableListProps<T> {
  /** Ordered data array. */
  items: T[];
  /**
   * Returns a stable string id for each item. The atom uses this id to track
   * drag state. Index-based ids cause reorder bugs — use a real domain id.
   */
  getKey: (item: T, idx: number) => string;
  /**
   * Render callback for each item. Use `args.setNodeRef` on the root,
   * `args.dragHandleProps` on the handle, and `args.itemStyle` on the root.
   */
  renderItem: (item: T, idx: number, args: SortableRenderItemArgs) => ReactNode;
  /**
   * Called with the source and destination indices when the user commits a
   * reorder. Same-position drops do not fire this.
   */
  onReorder: (from: number, to: number) => void;
  /** Layout direction. Default `'vertical'`. */
  direction?: SortableListDirection;
  /** When true, drag and keyboard reorder are blocked. renderItem still runs. */
  disabled?: boolean;
  /** Optional class applied to the list container. */
  className?: string;
  /** Optional inline style applied to the list container. */
  style?: CSSProperties;
}
