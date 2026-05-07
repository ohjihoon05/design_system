import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useState } from 'react';
import { Input } from './Input';

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input data-testid="i" />);
    expect(screen.getByTestId('i').tagName).toBe('INPUT');
  });

  it('uncontrolled — defaultValue is honored', () => {
    render(<Input defaultValue="hello" data-testid="i" />);
    expect((screen.getByTestId('i') as HTMLInputElement).value).toBe('hello');
  });

  it('controlled — value updates via consumer state', () => {
    function Wrapper() {
      const [v, setV] = useState('');
      return <Input value={v} onChange={(e) => setV(e.target.value)} data-testid="i" />;
    }
    render(<Wrapper />);
    const input = screen.getByTestId('i') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'typed' } });
    expect(input.value).toBe('typed');
  });

  it('does not call onChange when disabled', () => {
    const onChange = vi.fn();
    render(<Input disabled onChange={onChange} data-testid="i" />);
    fireEvent.change(screen.getByTestId('i'), { target: { value: 'x' } });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('invalid=true sets aria-invalid="true"', () => {
    render(<Input invalid data-testid="i" />);
    expect(screen.getByTestId('i')).toHaveAttribute('aria-invalid', 'true');
  });

  it('invalid=false (default) sets aria-invalid="false" or omits it', () => {
    render(<Input data-testid="i" />);
    const el = screen.getByTestId('i');
    const ai = el.getAttribute('aria-invalid');
    expect(ai === null || ai === 'false').toBe(true);
  });

  it('invalid=true applies alarm border color via status token', () => {
    render(<Input invalid data-testid="i" />);
    const el = screen.getByTestId('i') as HTMLInputElement;
    expect(el.style.borderColor).toBe('var(--color-status-alarm-text)');
  });

  it('size="sm" renders height 24px', () => {
    render(<Input size="sm" data-testid="i" />);
    expect(screen.getByTestId('i')).toHaveStyle({ height: '24px' });
  });

  it('size="md" (default) renders height 32px', () => {
    render(<Input data-testid="i" />);
    expect(screen.getByTestId('i')).toHaveStyle({ height: '32px' });
  });

  it('size="lg" renders height 40px', () => {
    render(<Input size="lg" data-testid="i" />);
    expect(screen.getByTestId('i')).toHaveStyle({ height: '40px' });
  });

  it('leftAddon renders before the input', () => {
    render(<Input leftAddon={<span data-testid="prefix">$</span>} placeholder="amount" />);
    expect(screen.getByTestId('prefix')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('amount')).toBeInTheDocument();
  });

  it('rightAddon renders after the input', () => {
    render(<Input rightAddon={<span data-testid="suffix">kg</span>} placeholder="weight" />);
    expect(screen.getByTestId('suffix')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('weight')).toBeInTheDocument();
  });

  it('forwards native input attributes (type, name, placeholder, autoComplete)', () => {
    render(
      <Input
        type="email"
        name="email"
        placeholder="you@example.com"
        autoComplete="email"
        data-testid="i"
      />
    );
    const el = screen.getByTestId('i');
    expect(el).toHaveAttribute('type', 'email');
    expect(el).toHaveAttribute('name', 'email');
    expect(el).toHaveAttribute('placeholder', 'you@example.com');
    expect(el).toHaveAttribute('autoComplete', 'email');
  });

  it('forwards ref to the underlying <input>', () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<Input ref={ref} data-testid="i" />);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('INPUT');
  });

  it('uses fontFamily from tokens (Segoe UI / Inter / system-ui)', () => {
    render(<Input data-testid="i" />);
    const ff = window.getComputedStyle(screen.getByTestId('i')).fontFamily || '';
    expect(ff.toLowerCase()).toContain('segoe ui');
  });

  it('does not use AI slop visual decoration (gradient/glass/glow)', () => {
    render(<Input data-testid="i" />);
    const styles = window.getComputedStyle(screen.getByTestId('i'));
    expect(styles.backdropFilter || '').not.toMatch(/blur/);
    expect(styles.backgroundImage || '').not.toMatch(/gradient/);
    expect(styles.boxShadow || '').not.toMatch(/glow/i);
  });
});
