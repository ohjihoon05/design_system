import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  it('renders the first character of name', () => {
    const { container } = render(<Avatar name="김기현" />);
    expect(container.textContent).toBe('김');
  });

  it('trims whitespace before extracting initial', () => {
    const { container } = render(<Avatar name="  Alice" />);
    expect(container.textContent).toBe('A');
  });

  it('handles empty name with ? fallback', () => {
    const { container } = render(<Avatar name="" />);
    expect(container.textContent).toBe('?');
  });

  it('handles surrogate-pair safe (emoji as single char)', () => {
    const { container } = render(<Avatar name="🙂 user" />);
    expect(container.textContent).toBe('🙂');
  });

  it('default size is 32×32', () => {
    const { container } = render(<Avatar name="A" />);
    const span = container.querySelector('span');
    expect(span).toHaveStyle({ width: '32px', height: '32px' });
  });

  it('custom size is applied', () => {
    const { container } = render(<Avatar name="A" size={64} />);
    const span = container.querySelector('span');
    expect(span).toHaveStyle({ width: '64px', height: '64px' });
  });

  it('default background is interfaceColors.primary', () => {
    const { container } = render(<Avatar name="A" />);
    const span = container.querySelector('span');
    expect(span).toHaveStyle({ background: 'var(--color-primary)' });
  });

  it('color override is applied', () => {
    const { container } = render(<Avatar name="A" color="red" />);
    const span = container.querySelector('span');
    expect(span).toHaveStyle({ background: 'red' });
  });

  it('renders as a circular span (border-radius 50%)', () => {
    const { container } = render(<Avatar name="A" />);
    expect(container.querySelector('span')).toHaveStyle({ borderRadius: '50%' });
  });

  it('default has aria-hidden when no aria-label provided', () => {
    const { container } = render(<Avatar name="A" />);
    expect(container.querySelector('span')).toHaveAttribute('aria-hidden');
  });

  it('aria-label overrides aria-hidden (interactive avatar)', () => {
    render(<Avatar name="A" aria-label="User Alice" />);
    const span = screen.getByLabelText('User Alice');
    expect(span).not.toHaveAttribute('aria-hidden');
  });

  it('fontSize scales with size (size*0.4 rounded)', () => {
    const { container, rerender } = render(<Avatar name="A" size={50} />);
    const span = container.querySelector('span');
    expect(span).toHaveStyle({ fontSize: '20px' });
    rerender(<Avatar name="A" size={100} />);
    expect(container.querySelector('span')).toHaveStyle({ fontSize: '40px' });
  });

  it('attaches wonik-avatar class', () => {
    const { container } = render(<Avatar name="A" />);
    expect(container.querySelector('span')?.className).toContain('wonik-avatar');
  });
});
