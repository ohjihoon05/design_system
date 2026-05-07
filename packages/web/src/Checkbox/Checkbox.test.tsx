import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useState } from 'react';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('renders an input of type checkbox', () => {
    render(<Checkbox data-testid="c" />);
    const el = screen.getByTestId('c') as HTMLInputElement;
    expect(el.tagName).toBe('INPUT');
    expect(el.type).toBe('checkbox');
  });

  it('uncontrolled — defaultChecked is honored', () => {
    render(<Checkbox defaultChecked data-testid="c" />);
    expect((screen.getByTestId('c') as HTMLInputElement).checked).toBe(true);
  });

  it('uncontrolled — defaultChecked=false renders unchecked', () => {
    render(<Checkbox data-testid="c" />);
    expect((screen.getByTestId('c') as HTMLInputElement).checked).toBe(false);
  });

  it('controlled — checked updates via consumer state', () => {
    function Wrapper() {
      const [v, setV] = useState(false);
      return (
        <Checkbox
          checked={v}
          onChange={(e) => setV(e.target.checked)}
          data-testid="c"
        />
      );
    }
    render(<Wrapper />);
    const el = screen.getByTestId('c') as HTMLInputElement;
    expect(el.checked).toBe(false);
    fireEvent.click(el);
    expect(el.checked).toBe(true);
  });

  it('does not call onChange when disabled', () => {
    const onChange = vi.fn();
    render(<Checkbox disabled onChange={onChange} data-testid="c" />);
    fireEvent.click(screen.getByTestId('c'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('invalid=true sets aria-invalid="true"', () => {
    render(<Checkbox invalid data-testid="c" />);
    expect(screen.getByTestId('c')).toHaveAttribute('aria-invalid', 'true');
  });

  it('size variants apply different dimensions', () => {
    const { rerender } = render(<Checkbox size="sm" data-testid="c" />);
    const sm = window.getComputedStyle(screen.getByTestId('c')).width;
    rerender(<Checkbox size="lg" data-testid="c" />);
    const lg = window.getComputedStyle(screen.getByTestId('c')).width;
    expect(sm).not.toBe(lg);
  });

  it('size="sm" renders 16x16', () => {
    render(<Checkbox size="sm" data-testid="c" />);
    const el = screen.getByTestId('c');
    expect(el).toHaveStyle({ width: '16px', height: '16px' });
  });

  it('size="md" (default) renders 20x20', () => {
    render(<Checkbox data-testid="c" />);
    const el = screen.getByTestId('c');
    expect(el).toHaveStyle({ width: '20px', height: '20px' });
  });

  it('size="lg" renders 24x24', () => {
    render(<Checkbox size="lg" data-testid="c" />);
    const el = screen.getByTestId('c');
    expect(el).toHaveStyle({ width: '24px', height: '24px' });
  });

  it('forwards native attributes (name, value, required)', () => {
    render(<Checkbox name="agree" value="yes" required data-testid="c" />);
    const el = screen.getByTestId('c');
    expect(el).toHaveAttribute('name', 'agree');
    expect(el).toHaveAttribute('value', 'yes');
    expect(el).toHaveAttribute('required');
  });

  it('forwards ref to the underlying <input>', () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<Checkbox ref={ref} data-testid="c" />);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.type).toBe('checkbox');
  });

  it('uses accentColor token for native check color', () => {
    render(<Checkbox data-testid="c" />);
    const styleAttr = screen.getByTestId('c').getAttribute('style') || '';
    expect(styleAttr).toMatch(/accent-color:\s*var\(--color-primary\)/);
  });

  it('does not use AI slop visual decoration', () => {
    render(<Checkbox data-testid="c" />);
    const styles = window.getComputedStyle(screen.getByTestId('c'));
    expect(styles.backdropFilter || '').not.toMatch(/blur/);
    expect(styles.backgroundImage || '').not.toMatch(/gradient/);
    expect(styles.boxShadow || '').not.toMatch(/glow/i);
  });

  it('uses token reference (var(--color-...)) in inline style', () => {
    render(<Checkbox data-testid="c" />);
    const styleAttr = screen.getByTestId('c').getAttribute('style') || '';
    expect(styleAttr).toMatch(/var\(--color-/);
  });
});
