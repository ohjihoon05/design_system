import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProgressBar } from './ProgressBar';

describe('ProgressBar', () => {
  it('renders with role="progressbar"', () => {
    render(<ProgressBar value={50} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('sets aria-valuenow to the clamped value', () => {
    render(<ProgressBar value={75} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '75');
  });

  it('clamps value above 100 down to 100', () => {
    render(<ProgressBar value={150} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  });

  it('clamps negative value up to 0', () => {
    render(<ProgressBar value={-20} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });

  it('sets aria-valuemin=0 and aria-valuemax=100', () => {
    render(<ProgressBar value={50} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
  });

  it('default height is 4 (track + radius matches)', () => {
    render(<ProgressBar value={50} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveStyle({ height: '4px' });
    expect(bar).toHaveStyle({ borderRadius: '4px' });
  });

  it('custom height is applied to both height and borderRadius', () => {
    render(<ProgressBar value={50} height={8} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveStyle({ height: '8px' });
    expect(bar).toHaveStyle({ borderRadius: '8px' });
  });

  it('track background uses surface-subtle', () => {
    render(<ProgressBar value={50} />);
    expect(screen.getByRole('progressbar')).toHaveStyle({ background: 'var(--color-surface-subtle)' });
  });

  it('default tone "primary" fills with primary color', () => {
    render(<ProgressBar value={50} />);
    const fill = screen.getByRole('progressbar').firstChild as HTMLElement;
    expect(fill.style.background).toBe('var(--color-primary)');
  });

  it('tone "alarm" fills with alarm color', () => {
    render(<ProgressBar value={50} tone="alarm" />);
    const fill = screen.getByRole('progressbar').firstChild as HTMLElement;
    expect(fill.style.background).toBe('var(--color-status-alarm-text)');
  });

  it('tone "ready" fills with ready dot color', () => {
    render(<ProgressBar value={50} tone="ready" />);
    const fill = screen.getByRole('progressbar').firstChild as HTMLElement;
    expect(fill.style.background).toBe('var(--color-status-ready-dot)');
  });

  it('fill width matches clamped percentage', () => {
    render(<ProgressBar value={37} />);
    const fill = screen.getByRole('progressbar').firstChild as HTMLElement;
    expect(fill.style.width).toBe('37%');
  });

  it('attaches wonik-progressbar class', () => {
    render(<ProgressBar value={50} />);
    expect(screen.getByRole('progressbar').className).toContain('wonik-progressbar');
  });

  it('forwards aria-label', () => {
    render(<ProgressBar value={50} aria-label="Uploading" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-label', 'Uploading');
  });
});
