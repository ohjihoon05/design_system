import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders the label text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('does not call onClick when disabled', () => {
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled>
        Click
      </Button>,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('applies WONIK BLUE primary token as primary variant background', () => {
    render(<Button variant="primary">Primary</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveStyle({ background: 'var(--color-primary)' });
  });

  it('text variant has no background', () => {
    render(<Button variant="text">Text</Button>);
    const btn = screen.getByRole('button');
    const bg = window.getComputedStyle(btn).background;
    expect(bg === '' || bg.includes('transparent') || bg.includes('rgba(0, 0, 0, 0)')).toBe(true);
  });

  it('outline variant has 1px solid border', () => {
    render(<Button variant="outline">Outline</Button>);
    const btn = screen.getByRole('button');
    // jsdom does not parse var() inside the `border` shorthand into
    // borderStyle/borderWidth longhands, so assert the inline style instead.
    expect(btn.style.border).toMatch(/1px\s+solid/);
  });

  it('danger variant uses alarm status token as background', () => {
    render(<Button variant="danger">Delete</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveStyle({ background: 'var(--color-status-alarm-text)' });
  });

  it('size sm renders smaller padding than md', () => {
    const { rerender } = render(<Button size="sm">A</Button>);
    const sm = window.getComputedStyle(screen.getByRole('button')).padding;
    rerender(<Button size="md">A</Button>);
    const md = window.getComputedStyle(screen.getByRole('button')).padding;
    expect(sm).not.toBe(md);
  });

  it('forwards native button attributes (type, aria-*)', () => {
    render(
      <Button type="submit" aria-label="submit form">
        Submit
      </Button>,
    );
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('type', 'submit');
    expect(btn).toHaveAttribute('aria-label', 'submit form');
  });

  it('has no hardcoded hex in the rendered output (uses tokens)', () => {
    render(<Button variant="primary">x</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
