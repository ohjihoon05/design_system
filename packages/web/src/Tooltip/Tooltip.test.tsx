import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  it('renders the trigger child', () => {
    render(
      <Tooltip content="hello">
        <button>trigger</button>
      </Tooltip>,
    );
    expect(screen.getByRole('button', { name: 'trigger' })).toBeInTheDocument();
  });

  it('does not render the tooltip bubble initially', () => {
    render(
      <Tooltip content="hello">
        <button>trigger</button>
      </Tooltip>,
    );
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('shows tooltip on mouseEnter when openDelay=0', () => {
    render(
      <Tooltip content="hello" openDelay={0}>
        <button>trigger</button>
      </Tooltip>,
    );
    fireEvent.mouseEnter(screen.getByRole('button'));
    const tip = screen.getByRole('tooltip');
    expect(tip).toBeInTheDocument();
    expect(tip).toHaveTextContent('hello');
  });

  it('hides tooltip on mouseLeave', () => {
    render(
      <Tooltip content="hello" openDelay={0}>
        <button>trigger</button>
      </Tooltip>,
    );
    const btn = screen.getByRole('button');
    fireEvent.mouseEnter(btn);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    fireEvent.mouseLeave(btn);
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('shows tooltip on focus (keyboard a11y)', () => {
    render(
      <Tooltip content="hello" openDelay={0}>
        <button>trigger</button>
      </Tooltip>,
    );
    fireEvent.focus(screen.getByRole('button'));
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });

  it('hides tooltip on blur', () => {
    render(
      <Tooltip content="hello" openDelay={0}>
        <button>trigger</button>
      </Tooltip>,
    );
    const btn = screen.getByRole('button');
    fireEvent.focus(btn);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    fireEvent.blur(btn);
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('dismisses tooltip on Escape key when open', () => {
    render(
      <Tooltip content="hello" openDelay={0}>
        <button>trigger</button>
      </Tooltip>,
    );
    const btn = screen.getByRole('button');
    fireEvent.focus(btn);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    fireEvent.keyDown(btn, { key: 'Escape' });
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('wires aria-describedby on trigger when open and removes when closed', () => {
    render(
      <Tooltip content="hello" openDelay={0}>
        <button>trigger</button>
      </Tooltip>,
    );
    const btn = screen.getByRole('button');
    expect(btn.getAttribute('aria-describedby')).toBeNull();
    fireEvent.mouseEnter(btn);
    const tip = screen.getByRole('tooltip');
    expect(btn.getAttribute('aria-describedby')).toBe(tip.getAttribute('id'));
    fireEvent.mouseLeave(btn);
    expect(btn.getAttribute('aria-describedby')).toBeNull();
  });

  it('respects custom id prop', () => {
    render(
      <Tooltip content="hello" id="my-tip" openDelay={0}>
        <button>trigger</button>
      </Tooltip>,
    );
    fireEvent.mouseEnter(screen.getByRole('button'));
    expect(screen.getByRole('tooltip')).toHaveAttribute('id', 'my-tip');
  });

  it('preserves trigger handlers (chain pattern)', () => {
    const onMouseEnter = vi.fn();
    const onFocus = vi.fn();
    render(
      <Tooltip content="hello" openDelay={0}>
        <button onMouseEnter={onMouseEnter} onFocus={onFocus}>
          trigger
        </button>
      </Tooltip>,
    );
    const btn = screen.getByRole('button');
    fireEvent.mouseEnter(btn);
    expect(onMouseEnter).toHaveBeenCalledOnce();
    fireEvent.focus(btn);
    expect(onFocus).toHaveBeenCalledOnce();
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });

  it('does not show when disabled', () => {
    render(
      <Tooltip content="hello" openDelay={0} disabled>
        <button>trigger</button>
      </Tooltip>,
    );
    fireEvent.mouseEnter(screen.getByRole('button'));
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('respects openDelay (deferred show)', () => {
    vi.useFakeTimers();
    try {
      render(
        <Tooltip content="hello" openDelay={200}>
          <button>trigger</button>
        </Tooltip>,
      );
      fireEvent.mouseEnter(screen.getByRole('button'));
      expect(screen.queryByRole('tooltip')).toBeNull();
      act(() => {
        vi.advanceTimersByTime(200);
      });
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it('cancels pending open when mouseLeave fires before openDelay elapses', () => {
    vi.useFakeTimers();
    try {
      render(
        <Tooltip content="hello" openDelay={200}>
          <button>trigger</button>
        </Tooltip>,
      );
      const btn = screen.getByRole('button');
      fireEvent.mouseEnter(btn);
      act(() => {
        vi.advanceTimersByTime(100);
      });
      fireEvent.mouseLeave(btn);
      act(() => {
        vi.advanceTimersByTime(500);
      });
      expect(screen.queryByRole('tooltip')).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it('default placement is top (bottom: 100% offset)', () => {
    render(
      <Tooltip content="hello" openDelay={0}>
        <button>trigger</button>
      </Tooltip>,
    );
    fireEvent.mouseEnter(screen.getByRole('button'));
    const tip = screen.getByRole('tooltip');
    expect(tip.style.bottom).toMatch(/100%/);
  });

  it('placement=bottom positions below trigger', () => {
    render(
      <Tooltip content="hello" openDelay={0} placement="bottom">
        <button>trigger</button>
      </Tooltip>,
    );
    fireEvent.mouseEnter(screen.getByRole('button'));
    const tip = screen.getByRole('tooltip');
    expect(tip.style.top).toMatch(/100%/);
  });

  it('placement=left positions to the left', () => {
    render(
      <Tooltip content="hello" openDelay={0} placement="left">
        <button>trigger</button>
      </Tooltip>,
    );
    fireEvent.mouseEnter(screen.getByRole('button'));
    const tip = screen.getByRole('tooltip');
    expect(tip.style.right).toMatch(/100%/);
  });

  it('placement=right positions to the right', () => {
    render(
      <Tooltip content="hello" openDelay={0} placement="right">
        <button>trigger</button>
      </Tooltip>,
    );
    fireEvent.mouseEnter(screen.getByRole('button'));
    const tip = screen.getByRole('tooltip');
    expect(tip.style.left).toMatch(/100%/);
  });

  it('injects module-scope CSS on first mount (data-wonik-tooltip)', () => {
    render(
      <Tooltip content="hello">
        <button>trigger</button>
      </Tooltip>,
    );
    expect(document.querySelector('style[data-wonik-tooltip]')).not.toBeNull();
  });

  it('bubble uses CSS variable based interface colors (cascade-compatible)', () => {
    render(
      <Tooltip content="hello" openDelay={0}>
        <button>trigger</button>
      </Tooltip>,
    );
    fireEvent.mouseEnter(screen.getByRole('button'));
    const tip = screen.getByRole('tooltip');
    // background and color should both reference CSS variables (no hex literal hardcoded)
    expect(tip.style.background).toContain('var(');
    expect(tip.style.color).toContain('var(');
  });
});
