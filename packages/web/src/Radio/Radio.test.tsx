import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useState } from 'react';
import { Radio } from './Radio';

describe('Radio', () => {
  it('renders an input of type radio', () => {
    render(<Radio data-testid="r" />);
    const el = screen.getByTestId('r') as HTMLInputElement;
    expect(el.tagName).toBe('INPUT');
    expect(el.type).toBe('radio');
  });

  it('uncontrolled — defaultChecked is honored', () => {
    render(<Radio defaultChecked data-testid="r" />);
    expect((screen.getByTestId('r') as HTMLInputElement).checked).toBe(true);
  });

  it('controlled — checked updates via consumer state', () => {
    function Wrapper() {
      const [v, setV] = useState('a');
      return (
        <>
          <Radio
            name="g"
            value="a"
            checked={v === 'a'}
            onChange={() => setV('a')}
            data-testid="ra"
          />
          <Radio
            name="g"
            value="b"
            checked={v === 'b'}
            onChange={() => setV('b')}
            data-testid="rb"
          />
        </>
      );
    }
    render(<Wrapper />);
    expect((screen.getByTestId('ra') as HTMLInputElement).checked).toBe(true);
    fireEvent.click(screen.getByTestId('rb'));
    expect((screen.getByTestId('rb') as HTMLInputElement).checked).toBe(true);
    expect((screen.getByTestId('ra') as HTMLInputElement).checked).toBe(false);
  });

  it('does not call onChange when disabled', () => {
    const onChange = vi.fn();
    render(<Radio disabled onChange={onChange} data-testid="r" />);
    fireEvent.click(screen.getByTestId('r'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('native grouping by name — only one selected at a time (uncontrolled)', () => {
    render(
      <>
        <Radio name="g" value="a" data-testid="ra" />
        <Radio name="g" value="b" data-testid="rb" />
        <Radio name="g" value="c" data-testid="rc" />
      </>,
    );
    fireEvent.click(screen.getByTestId('rb'));
    expect((screen.getByTestId('rb') as HTMLInputElement).checked).toBe(true);
    expect((screen.getByTestId('ra') as HTMLInputElement).checked).toBe(false);
    expect((screen.getByTestId('rc') as HTMLInputElement).checked).toBe(false);

    fireEvent.click(screen.getByTestId('rc'));
    expect((screen.getByTestId('rc') as HTMLInputElement).checked).toBe(true);
    expect((screen.getByTestId('rb') as HTMLInputElement).checked).toBe(false);
  });

  it('invalid=true sets aria-invalid="true"', () => {
    render(<Radio invalid data-testid="r" />);
    expect(screen.getByTestId('r')).toHaveAttribute('aria-invalid', 'true');
  });

  it('size variants apply different dimensions', () => {
    const { rerender } = render(<Radio size="sm" data-testid="r" />);
    const sm = window.getComputedStyle(screen.getByTestId('r')).width;
    rerender(<Radio size="lg" data-testid="r" />);
    const lg = window.getComputedStyle(screen.getByTestId('r')).width;
    expect(sm).not.toBe(lg);
  });

  it('size="sm" renders 16x16', () => {
    render(<Radio size="sm" data-testid="r" />);
    const el = screen.getByTestId('r');
    expect(el).toHaveStyle({ width: '16px', height: '16px' });
  });

  it('size="md" (default) renders 20x20', () => {
    render(<Radio data-testid="r" />);
    const el = screen.getByTestId('r');
    expect(el).toHaveStyle({ width: '20px', height: '20px' });
  });

  it('size="lg" renders 24x24', () => {
    render(<Radio size="lg" data-testid="r" />);
    const el = screen.getByTestId('r');
    expect(el).toHaveStyle({ width: '24px', height: '24px' });
  });

  it('forwards native attributes (name, value, required)', () => {
    render(<Radio name="size" value="sm" required data-testid="r" />);
    const el = screen.getByTestId('r');
    expect(el).toHaveAttribute('name', 'size');
    expect(el).toHaveAttribute('value', 'sm');
    expect(el).toHaveAttribute('required');
  });

  it('forwards ref to the underlying <input>', () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<Radio ref={ref} data-testid="r" />);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.type).toBe('radio');
  });

  it('uses accentColor token for native check color', () => {
    render(<Radio data-testid="r" />);
    const styleAttr = screen.getByTestId('r').getAttribute('style') || '';
    expect(styleAttr).toMatch(/accent-color:\s*var\(--color-primary\)/);
  });

  it('does not use AI slop visual decoration', () => {
    render(<Radio data-testid="r" />);
    const styles = window.getComputedStyle(screen.getByTestId('r'));
    expect(styles.backdropFilter || '').not.toMatch(/blur/);
    expect(styles.backgroundImage || '').not.toMatch(/gradient/);
    expect(styles.boxShadow || '').not.toMatch(/glow/i);
  });
});
