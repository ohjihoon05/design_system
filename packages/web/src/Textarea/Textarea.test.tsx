import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useState } from 'react';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('renders a textarea element', () => {
    render(<Textarea data-testid="t" />);
    expect(screen.getByTestId('t').tagName).toBe('TEXTAREA');
  });

  it('uncontrolled — defaultValue is honored', () => {
    render(<Textarea defaultValue={'multi\nline'} data-testid="t" />);
    expect((screen.getByTestId('t') as HTMLTextAreaElement).value).toBe('multi\nline');
  });

  it('controlled — value updates via consumer state', () => {
    function Wrapper() {
      const [v, setV] = useState('');
      return <Textarea value={v} onChange={(e) => setV(e.target.value)} data-testid="t" />;
    }
    render(<Wrapper />);
    const el = screen.getByTestId('t') as HTMLTextAreaElement;
    fireEvent.change(el, { target: { value: 'typed multi\nline' } });
    expect(el.value).toBe('typed multi\nline');
  });

  it('does not call onChange when disabled', () => {
    const onChange = vi.fn();
    render(<Textarea disabled onChange={onChange} data-testid="t" />);
    fireEvent.change(screen.getByTestId('t'), { target: { value: 'x' } });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('invalid=true sets aria-invalid="true"', () => {
    render(<Textarea invalid data-testid="t" />);
    expect(screen.getByTestId('t')).toHaveAttribute('aria-invalid', 'true');
  });

  it('invalid=true applies alarm border via status token', () => {
    render(<Textarea invalid data-testid="t" />);
    const el = screen.getByTestId('t') as HTMLTextAreaElement;
    expect(el.style.borderColor).toBe('var(--color-status-alarm-text)');
  });

  it('passes through rows native attribute', () => {
    render(<Textarea rows={6} data-testid="t" />);
    expect(screen.getByTestId('t')).toHaveAttribute('rows', '6');
  });

  it('size variants apply different fontSize', () => {
    const { rerender } = render(<Textarea size="sm" data-testid="t" />);
    const sm = window.getComputedStyle(screen.getByTestId('t')).fontSize;
    rerender(<Textarea size="lg" data-testid="t" />);
    const lg = window.getComputedStyle(screen.getByTestId('t')).fontSize;
    expect(sm).not.toBe(lg);
  });

  it('forwards native textarea attributes (placeholder, name, autoComplete)', () => {
    render(
      <Textarea
        placeholder="message"
        name="message"
        autoComplete="off"
        data-testid="t"
      />
    );
    const el = screen.getByTestId('t');
    expect(el).toHaveAttribute('placeholder', 'message');
    expect(el).toHaveAttribute('name', 'message');
    expect(el).toHaveAttribute('autoComplete', 'off');
  });

  it('forwards ref to the underlying <textarea>', () => {
    const ref = { current: null as HTMLTextAreaElement | null };
    render(<Textarea ref={ref} data-testid="t" />);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('TEXTAREA');
  });

  it('uses fontFamily from tokens', () => {
    render(<Textarea data-testid="t" />);
    const ff = window.getComputedStyle(screen.getByTestId('t')).fontFamily || '';
    expect(ff.toLowerCase()).toContain('segoe ui');
  });

  it('does not use AI slop visual decoration', () => {
    render(<Textarea data-testid="t" />);
    const styles = window.getComputedStyle(screen.getByTestId('t'));
    expect(styles.backdropFilter || '').not.toMatch(/blur/);
    expect(styles.backgroundImage || '').not.toMatch(/gradient/);
    expect(styles.boxShadow || '').not.toMatch(/glow/i);
  });
});
