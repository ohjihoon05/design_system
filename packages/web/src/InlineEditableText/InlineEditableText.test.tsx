import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useState } from 'react';
import { InlineEditableText } from './InlineEditableText';
import type { InlineEditableTextProps } from './types';

function Harness(props: Omit<InlineEditableTextProps, 'value' | 'onChange'> & { initial: string; onCommit?: (v: string) => void }) {
  const { initial, onCommit, ...rest } = props;
  const [v, setV] = useState(initial);
  return (
    <InlineEditableText
      {...rest}
      value={v}
      onChange={(next) => {
        onCommit?.(next);
        setV(next);
      }}
    />
  );
}

describe('InlineEditableText', () => {
  /* ── 렌더 ─────────────────────────────────────────── */

  it('renders the current value as text in display mode', () => {
    render(<Harness initial="Hello" />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('renders with the `as` prop element tag', () => {
    render(<Harness initial="Title" as="h2" />);
    const el = screen.getByText('Title');
    expect(el.tagName).toBe('H2');
  });

  it('renders placeholder when value is empty', () => {
    render(<Harness initial="" placeholder="Click to edit" />);
    expect(screen.getByText('Click to edit')).toBeInTheDocument();
  });

  /* ── 편집 모드 진입 ──────────────────────────────── */

  it('enters edit mode on single click (default trigger)', () => {
    render(<Harness initial="Hello" />);
    fireEvent.click(screen.getByText('Hello'));
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('enters edit mode on Enter key in display mode', () => {
    render(<Harness initial="Hello" />);
    fireEvent.keyDown(screen.getByText('Hello'), { key: 'Enter' });
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('enters edit mode on Space key in display mode', () => {
    render(<Harness initial="Hello" />);
    fireEvent.keyDown(screen.getByText('Hello'), { key: ' ' });
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('does NOT enter edit mode on single click when trigger="double"', () => {
    render(<Harness initial="Hello" trigger="double" />);
    fireEvent.click(screen.getByText('Hello'));
    expect(screen.queryByRole('textbox')).toBeNull();
    fireEvent.doubleClick(screen.getByText('Hello'));
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  /* ── commit / cancel ─────────────────────────────── */

  it('commits draft via Enter and returns to display mode', () => {
    const onCommit = vi.fn();
    render(<Harness initial="Hello" onCommit={onCommit} />);
    fireEvent.click(screen.getByText('Hello'));
    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'World' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onCommit).toHaveBeenCalledWith('World');
    expect(screen.queryByRole('textbox')).toBeNull();
    expect(screen.getByText('World')).toBeInTheDocument();
  });

  it('cancels via Escape, restores external value, no onChange call', () => {
    const onCommit = vi.fn();
    render(<Harness initial="Hello" onCommit={onCommit} />);
    fireEvent.click(screen.getByText('Hello'));
    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Draft' } });
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(onCommit).not.toHaveBeenCalled();
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('commits via onBlur by default (saveOnBlur=true implicit)', () => {
    const onCommit = vi.fn();
    render(<Harness initial="Hello" onCommit={onCommit} />);
    fireEvent.click(screen.getByText('Hello'));
    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Blurred' } });
    fireEvent.blur(input);
    expect(onCommit).toHaveBeenCalledWith('Blurred');
  });

  it('cancels via onBlur when saveOnBlur=false', () => {
    const onCommit = vi.fn();
    render(<Harness initial="Hello" onCommit={onCommit} saveOnBlur={false} />);
    fireEvent.click(screen.getByText('Hello'));
    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Draft' } });
    fireEvent.blur(input);
    expect(onCommit).not.toHaveBeenCalled();
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  /* ── 외부 value drift ─────────────────────────────── */

  it('syncs display when external value changes outside edit mode', () => {
    const { rerender } = render(<InlineEditableText value="A" onChange={() => {}} />);
    expect(screen.getByText('A')).toBeInTheDocument();
    rerender(<InlineEditableText value="B" onChange={() => {}} />);
    expect(screen.getByText('B')).toBeInTheDocument();
  });

  it('ignores external value change while editing (draft wins)', () => {
    const { rerender } = render(
      <InlineEditableText value="Hello" onChange={() => {}} />,
    );
    fireEvent.click(screen.getByText('Hello'));
    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Draft' } });
    // External value change while editing — should be ignored, draft wins.
    rerender(<InlineEditableText value="ExternalUpdate" onChange={() => {}} />);
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('Draft');
  });

  /* ── select-all on focus ──────────────────────────── */

  it('selects all text on edit-mode entry by default', () => {
    render(<Harness initial="Selectable" />);
    fireEvent.click(screen.getByText('Selectable'));
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.selectionStart).toBe(0);
    expect(input.selectionEnd).toBe('Selectable'.length);
  });

  /* ── disabled ─────────────────────────────────────── */

  it('blocks entry into edit mode when disabled', () => {
    render(<Harness initial="Locked" disabled />);
    fireEvent.click(screen.getByText('Locked'));
    expect(screen.queryByRole('textbox')).toBeNull();
    expect(screen.getByText('Locked').getAttribute('tabindex')).toBe('-1');
  });

  /* ── a11y ─────────────────────────────────────────── */

  it('exposes role="button" with aria-label fallback to value in display mode', () => {
    render(<Harness initial="Click me" />);
    const btn = screen.getByRole('button', { name: 'Click me' });
    expect(btn).toBeInTheDocument();
  });
});
