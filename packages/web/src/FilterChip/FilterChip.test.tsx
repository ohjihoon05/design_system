import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterChip } from './FilterChip';

describe('FilterChip', () => {
  it('renders children', () => {
    render(<FilterChip>All</FilterChip>);
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
  });

  it('defaults to inactive (aria-pressed="false")', () => {
    render(<FilterChip>x</FilterChip>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
  });

  it('active=true sets aria-pressed="true" and data-active="true"', () => {
    render(<FilterChip active>x</FilterChip>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('aria-pressed', 'true');
    expect(btn).toHaveAttribute('data-active', 'true');
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<FilterChip onClick={onClick}>x</FilterChip>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('inactive uses interfaceColors.surface background', () => {
    render(<FilterChip>x</FilterChip>);
    expect(screen.getByRole('button')).toHaveStyle({ background: 'var(--color-surface, var(--color-surface-white))' });
  });

  it('active uses primary.bg background', () => {
    render(<FilterChip active>x</FilterChip>);
    expect(screen.getByRole('button')).toHaveStyle({ background: 'var(--color-primary-bg)' });
  });

  it('renders type="button" by default', () => {
    render(<FilterChip>x</FilterChip>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('forwards external className after wonik-filterchip', () => {
    render(<FilterChip className="custom">x</FilterChip>);
    const cn = screen.getByRole('button').className;
    expect(cn).toContain('wonik-filterchip');
    expect(cn).toContain('custom');
  });

  it('injects module-scope CSS on first mount (data-wonik-filterchip)', () => {
    render(<FilterChip>x</FilterChip>);
    expect(document.querySelector('style[data-wonik-filterchip]')).not.toBeNull();
  });

  it('forwards native button attributes (disabled, aria-label)', () => {
    render(<FilterChip disabled aria-label="all filter">All</FilterChip>);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-label', 'all filter');
  });
});
