import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('renders a div with role="status" + aria-busy="true"', () => {
    render(<Skeleton data-testid="sk" />);
    const el = screen.getByTestId('sk');
    expect(el.tagName).toBe('DIV');
    expect(el).toHaveAttribute('role', 'status');
    expect(el).toHaveAttribute('aria-busy', 'true');
  });

  it('default variant "text" — width 100%, height 1em, radius 4px', () => {
    render(<Skeleton data-testid="sk" />);
    const el = screen.getByTestId('sk');
    expect(el).toHaveStyle({ width: '100%', height: '1em', borderRadius: '4px' });
  });

  it('variant "rect" — radius 8px, no default size', () => {
    render(<Skeleton variant="rect" width={200} height={100} data-testid="sk" />);
    const el = screen.getByTestId('sk');
    expect(el).toHaveStyle({ width: '200px', height: '100px', borderRadius: '8px' });
  });

  it('variant "circle" — radius 50%', () => {
    render(<Skeleton variant="circle" width={40} height={40} data-testid="sk" />);
    const el = screen.getByTestId('sk');
    expect(el).toHaveStyle({ width: '40px', height: '40px', borderRadius: '50%' });
  });

  it('width/height props — number is treated as px', () => {
    render(<Skeleton width={120} height={24} data-testid="sk" />);
    const el = screen.getByTestId('sk');
    expect(el).toHaveStyle({ width: '120px', height: '24px' });
  });

  it('width/height props — string is passed through (e.g. percentage)', () => {
    render(<Skeleton width="50%" height="2rem" data-testid="sk" />);
    const el = screen.getByTestId('sk');
    expect(el).toHaveStyle({ width: '50%', height: '2rem' });
  });

  it('explicit width/height override variant defaults', () => {
    render(<Skeleton variant="text" width={80} height={12} data-testid="sk" />);
    const el = screen.getByTestId('sk');
    expect(el).toHaveStyle({ width: '80px', height: '12px' });
  });

  it('uses token reference for background (no hex literal)', () => {
    render(<Skeleton data-testid="sk" />);
    const styleAttr = screen.getByTestId('sk').getAttribute('style') || '';
    expect(styleAttr).toMatch(/var\(--color-/);
  });

  it('forwards ref to the underlying div', () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Skeleton ref={ref} data-testid="sk" />);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('DIV');
  });

  it('forwards extra attributes (data-* / className)', () => {
    render(<Skeleton className="my-sk" data-foo="bar" data-testid="sk" />);
    const el = screen.getByTestId('sk');
    expect(el).toHaveClass('my-sk');
    expect(el).toHaveAttribute('data-foo', 'bar');
  });

  it('does not use AI slop visual decoration', () => {
    render(<Skeleton data-testid="sk" />);
    const styles = window.getComputedStyle(screen.getByTestId('sk'));
    expect(styles.backdropFilter || '').not.toMatch(/blur/);
    expect(styles.backgroundImage || '').not.toMatch(/gradient/);
    expect(styles.boxShadow || '').not.toMatch(/glow/i);
  });

  it('injects scoped @keyframes once into document head', () => {
    render(<Skeleton />);
    render(<Skeleton />);
    const styleTags = document.head.querySelectorAll('style[data-wonik-skeleton]');
    expect(styleTags.length).toBe(1);
    expect(styleTags[0].textContent).toMatch(/@keyframes\s+wonik-skeleton-pulse/);
  });

  it('applies animation referencing wonik-skeleton-pulse keyframes', () => {
    render(<Skeleton data-testid="sk" />);
    const styleAttr = screen.getByTestId('sk').getAttribute('style') || '';
    expect(styleAttr).toMatch(/animation/);
    expect(styleAttr).toMatch(/wonik-skeleton-pulse/);
  });
});
