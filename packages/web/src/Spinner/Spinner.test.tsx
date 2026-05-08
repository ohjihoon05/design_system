import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('renders a span with role="status"', () => {
    render(<Spinner data-testid="s" />);
    const el = screen.getByTestId('s');
    expect(el.tagName).toBe('SPAN');
    expect(el).toHaveAttribute('role', 'status');
  });

  it('sets aria-live="polite" + aria-busy="true"', () => {
    render(<Spinner data-testid="s" />);
    const el = screen.getByTestId('s');
    expect(el).toHaveAttribute('aria-live', 'polite');
    expect(el).toHaveAttribute('aria-busy', 'true');
  });

  it('default label is "Loading"', () => {
    render(<Spinner data-testid="s" />);
    expect(screen.getByTestId('s')).toHaveAttribute('aria-label', 'Loading');
  });

  it('custom label overrides default', () => {
    render(<Spinner label="AI 생성 중" data-testid="s" />);
    expect(screen.getByTestId('s')).toHaveAttribute('aria-label', 'AI 생성 중');
  });

  it('size="sm" renders 16x16', () => {
    render(<Spinner size="sm" data-testid="s" />);
    const el = screen.getByTestId('s');
    expect(el).toHaveStyle({ width: '16px', height: '16px' });
  });

  it('size="md" (default) renders 24x24', () => {
    render(<Spinner data-testid="s" />);
    const el = screen.getByTestId('s');
    expect(el).toHaveStyle({ width: '24px', height: '24px' });
  });

  it('size="lg" renders 40x40', () => {
    render(<Spinner size="lg" data-testid="s" />);
    const el = screen.getByTestId('s');
    expect(el).toHaveStyle({ width: '40px', height: '40px' });
  });

  it('uses token reference for primary color (no hex literal)', () => {
    render(<Spinner data-testid="s" />);
    const styleAttr = screen.getByTestId('s').getAttribute('style') || '';
    // borderTopColor 또는 컴포넌트가 사용하는 token reference가 var(--color-...)로 노출돼야 한다.
    expect(styleAttr).toMatch(/var\(--color-/);
  });

  it('uses border-radius 50% for circular shape', () => {
    render(<Spinner data-testid="s" />);
    expect(screen.getByTestId('s')).toHaveStyle({ borderRadius: '50%' });
  });

  it('forwards ref to the underlying span', () => {
    const ref = { current: null as HTMLSpanElement | null };
    render(<Spinner ref={ref} data-testid="s" />);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('SPAN');
  });

  it('forwards extra attributes (data-* / className)', () => {
    render(<Spinner className="my-spin" data-foo="bar" data-testid="s" />);
    const el = screen.getByTestId('s');
    expect(el).toHaveClass('my-spin');
    expect(el).toHaveAttribute('data-foo', 'bar');
  });

  it('does not use AI slop visual decoration', () => {
    render(<Spinner data-testid="s" />);
    const styles = window.getComputedStyle(screen.getByTestId('s'));
    expect(styles.backdropFilter || '').not.toMatch(/blur/);
    expect(styles.backgroundImage || '').not.toMatch(/gradient/);
    expect(styles.boxShadow || '').not.toMatch(/glow/i);
  });

  it('injects scoped @keyframes once into document head', () => {
    render(<Spinner />);
    render(<Spinner />);
    const styleTags = document.head.querySelectorAll('style[data-wonik-spinner]');
    expect(styleTags.length).toBe(1);
    expect(styleTags[0].textContent).toMatch(/@keyframes\s+wonik-spin/);
  });

  it('applies animation referencing wonik-spin keyframes', () => {
    render(<Spinner data-testid="s" />);
    const styleAttr = screen.getByTestId('s').getAttribute('style') || '';
    expect(styleAttr).toMatch(/animation/);
    expect(styleAttr).toMatch(/wonik-spin/);
  });
});
