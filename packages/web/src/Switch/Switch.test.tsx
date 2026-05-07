import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useState } from 'react';
import { Switch } from './Switch';

describe('Switch', () => {
  it('renders an input of type checkbox with role="switch"', () => {
    render(<Switch data-testid="s" />);
    const el = screen.getByTestId('s') as HTMLInputElement;
    expect(el.tagName).toBe('INPUT');
    expect(el.type).toBe('checkbox');
    expect(el).toHaveAttribute('role', 'switch');
  });

  it('uncontrolled — defaultChecked is honored', () => {
    render(<Switch defaultChecked data-testid="s" />);
    expect((screen.getByTestId('s') as HTMLInputElement).checked).toBe(true);
  });

  it('controlled — checked updates via consumer state', () => {
    function Wrapper() {
      const [v, setV] = useState(false);
      return (
        <Switch
          checked={v}
          onChange={(e) => setV(e.target.checked)}
          data-testid="s"
        />
      );
    }
    render(<Wrapper />);
    const el = screen.getByTestId('s') as HTMLInputElement;
    fireEvent.click(el);
    expect(el.checked).toBe(true);
  });

  it('does not call onChange when disabled', () => {
    const onChange = vi.fn();
    render(<Switch disabled onChange={onChange} data-testid="s" />);
    fireEvent.click(screen.getByTestId('s'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('invalid=true sets aria-invalid="true"', () => {
    render(<Switch invalid data-testid="s" />);
    expect(screen.getByTestId('s')).toHaveAttribute('aria-invalid', 'true');
  });

  it('forwards native attributes (name, value)', () => {
    render(<Switch name="notify" value="on" data-testid="s" />);
    const el = screen.getByTestId('s');
    expect(el).toHaveAttribute('name', 'notify');
    expect(el).toHaveAttribute('value', 'on');
  });

  it('forwards ref to the underlying <input>', () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<Switch ref={ref} data-testid="s" />);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.type).toBe('checkbox');
  });

  it('size variants apply different widths to the track', () => {
    const { container, rerender } = render(<Switch size="sm" />);
    const trackSm = container.querySelector('span[data-switch-track]');
    const wSm = trackSm
      ? window.getComputedStyle(trackSm as Element).width
      : '';

    rerender(<Switch size="lg" />);
    const trackLg = container.querySelector('span[data-switch-track]');
    const wLg = trackLg
      ? window.getComputedStyle(trackLg as Element).width
      : '';

    expect(wSm).not.toBe(wLg);
  });

  it('renders inside a <label> wrapper for click-target inflation', () => {
    render(<Switch data-testid="s" />);
    const input = screen.getByTestId('s');
    expect(input.closest('label')).not.toBeNull();
  });

  it('input is visually hidden (opacity:0 or position:absolute) but still focusable', () => {
    render(<Switch data-testid="s" />);
    const input = screen.getByTestId('s');
    const styles = window.getComputedStyle(input);
    const hidden = styles.opacity === '0' || styles.position === 'absolute';
    expect(hidden).toBe(true);
  });

  it('does not use AI slop visual decoration', () => {
    const { container } = render(<Switch />);
    const track = container.querySelector('span[data-switch-track]');
    if (track) {
      const styles = window.getComputedStyle(track as Element);
      expect(styles.backdropFilter || '').not.toMatch(/blur/);
      expect(styles.backgroundImage || '').not.toMatch(/gradient/);
      expect(styles.boxShadow || '').not.toMatch(/glow/i);
    }
  });

  it('uses token reference (var(--color-...)) in the track style', () => {
    const { container } = render(<Switch />);
    const track = container.querySelector('span[data-switch-track]');
    const styleAttr = track?.getAttribute('style') || '';
    expect(styleAttr).toMatch(/var\(--color-/);
  });
});
