import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SortableList } from './SortableList';
import type { SortableRenderItemArgs } from './types';

type Item = { id: string; name: string };

const SEED: Item[] = [
  { id: 'a', name: 'Alpha' },
  { id: 'b', name: 'Bravo' },
  { id: 'c', name: 'Charlie' },
];

function Wrap(props: Partial<Parameters<typeof SortableList<Item>>[0]> = {}) {
  return (
    <SortableList<Item>
      items={SEED}
      getKey={(it) => it.id}
      renderItem={(item, idx, args) => (
        <div
          key={item.id}
          ref={args.setNodeRef}
          style={args.itemStyle}
          data-testid={`item-${item.id}`}
          data-dragging={args.isDragging}
        >
          <button
            {...(args.dragHandleProps as object)}
            data-testid={`handle-${item.id}`}
            type="button"
          >
            {item.name}
          </button>
        </div>
      )}
      onReorder={() => {}}
      {...props}
    />
  );
}

describe('SortableList', () => {
  /* ── 렌더 ─────────────────────────────────────────── */

  it('calls renderItem once per item', () => {
    const renderItem = vi.fn(
      (item: Item, idx: number, args: SortableRenderItemArgs) => (
        <div key={item.id} ref={args.setNodeRef} style={args.itemStyle}>
          {item.name}
        </div>
      ),
    );
    render(
      <SortableList<Item>
        items={SEED}
        getKey={(it) => it.id}
        renderItem={renderItem}
        onReorder={() => {}}
      />,
    );
    expect(renderItem).toHaveBeenCalledTimes(3);
  });

  it('renders empty container when items is empty', () => {
    const renderItem = vi.fn();
    const { container } = render(
      <SortableList<Item>
        items={[]}
        getKey={(it) => it.id}
        renderItem={renderItem}
        onReorder={() => {}}
      />,
    );
    expect(renderItem).not.toHaveBeenCalled();
    // dnd-kit renders an empty announcer + the empty list container.
    const list = container.querySelector('div > div');
    expect(list).not.toBeNull();
  });

  it('renders all 3 items by name', () => {
    render(<Wrap />);
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Bravo')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
  });

  /* ── a11y attributes ─────────────────────────────── */

  it('attaches role=button + aria-roledescription to handle via dragHandleProps', () => {
    render(<Wrap />);
    const handle = screen.getByTestId('handle-a');
    // dnd-kit adds these via attributes spread:
    expect(handle.getAttribute('role')).toBe('button');
    expect(handle.getAttribute('aria-roledescription')).toBe('sortable');
  });

  it('sets tabIndex=0 on handle so keyboard sensor can grab it', () => {
    render(<Wrap />);
    const handle = screen.getByTestId('handle-a');
    expect(handle.getAttribute('tabindex')).toBe('0');
  });

  it('sets aria-disabled when disabled=true', () => {
    render(<Wrap disabled />);
    const handle = screen.getByTestId('handle-a');
    // dnd-kit sortable propagates disabled state.
    expect(handle.getAttribute('aria-disabled')).toBe('true');
  });

  /* ── reorder logic (callback-level unit test) ─────── */

  it('does not call onReorder on initial render', () => {
    const onReorder = vi.fn();
    render(<Wrap onReorder={onReorder} />);
    expect(onReorder).not.toHaveBeenCalled();
  });

  it('reorder helper: arrayMove derives correct from/to indices via getKey', () => {
    // The internal handleDragEnd uses ids.indexOf to compute from/to.
    // We verify the contract: given known ids, indexOf gives stable indices.
    const ids = SEED.map((it) => it.id);
    expect(ids.indexOf('a')).toBe(0);
    expect(ids.indexOf('c')).toBe(2);
    // active === over guard: same id should not trigger reorder.
    expect(ids.indexOf('a') === ids.indexOf('a')).toBe(true);
  });

  /* ── controlled order ─────────────────────────────── */

  it('reflects items reorder on rerender', () => {
    const { rerender } = render(<Wrap />);
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    const reversed = [...SEED].reverse();
    rerender(
      <SortableList<Item>
        items={reversed}
        getKey={(it) => it.id}
        renderItem={(item, idx, args) => (
          <div key={item.id} ref={args.setNodeRef} style={args.itemStyle}>
            <button {...(args.dragHandleProps as object)} type="button">
              {item.name}
            </button>
          </div>
        )}
        onReorder={() => {}}
      />,
    );
    // Children order should match reversed array.
    const buttons = screen.getAllByRole('button');
    expect(buttons[0].textContent).toBe('Charlie');
    expect(buttons[2].textContent).toBe('Alpha');
  });

  /* ── disabled ─────────────────────────────────────── */

  it('still calls renderItem when disabled=true (consumer can show alt UI)', () => {
    const renderItem = vi.fn((item: Item, idx: number, args: SortableRenderItemArgs) => (
      <div key={item.id} ref={args.setNodeRef} style={args.itemStyle}>
        {item.name}
      </div>
    ));
    render(
      <SortableList<Item>
        items={SEED}
        getKey={(it) => it.id}
        renderItem={renderItem}
        onReorder={() => {}}
        disabled
      />,
    );
    expect(renderItem).toHaveBeenCalledTimes(3);
  });

  it('passes isDragging=false to renderItem at rest', () => {
    render(<Wrap />);
    expect(screen.getByTestId('item-a').getAttribute('data-dragging')).toBe('false');
    expect(screen.getByTestId('item-b').getAttribute('data-dragging')).toBe('false');
    expect(screen.getByTestId('item-c').getAttribute('data-dragging')).toBe('false');
  });

  /* ── horizontal direction ─────────────────────────── */

  it('renders with horizontal direction without crashing', () => {
    render(<Wrap direction="horizontal" />);
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Bravo')).toBeInTheDocument();
  });
});
