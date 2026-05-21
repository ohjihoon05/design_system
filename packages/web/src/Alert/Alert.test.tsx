import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Alert } from './Alert';

describe('Alert', () => {
  it('renders children', () => {
    render(<Alert data-testid="alert">에러 메시지</Alert>);
    expect(screen.getByTestId('alert')).toHaveTextContent('에러 메시지');
  });

  it('role="alert" is enforced (a11y for screen readers)', () => {
    render(<Alert data-testid="alert">x</Alert>);
    expect(screen.getByTestId('alert')).toHaveAttribute('role', 'alert');
  });

  it('uses statusTokens.alarm bg (no hex literal)', () => {
    render(<Alert data-testid="alert">x</Alert>);
    const styleAttr = screen.getByTestId('alert').getAttribute('style') || '';
    expect(styleAttr).toMatch(/background:\s*var\(--color-status-alarm-bg/);
  });

  it('uses statusTokens.alarm border (1px solid)', () => {
    render(<Alert data-testid="alert">x</Alert>);
    const styleAttr = screen.getByTestId('alert').getAttribute('style') || '';
    expect(styleAttr).toMatch(/border:\s*1px solid var\(--color-status-alarm-border/);
  });

  it('uses statusTokens.alarm text color', () => {
    render(<Alert data-testid="alert">x</Alert>);
    const styleAttr = screen.getByTestId('alert').getAttribute('style') || '';
    expect(styleAttr).toMatch(/color:\s*var\(--color-status-alarm-text/);
  });

  it('does NOT render dismiss button when onDismiss is undefined', () => {
    render(<Alert data-testid="alert">x</Alert>);
    expect(screen.queryByRole('button', { name: '닫기' })).toBeNull();
  });

  it('renders dismiss × button when onDismiss is provided + calls callback on click', () => {
    const onDismiss = vi.fn();
    render(<Alert onDismiss={onDismiss} data-testid="alert">에러</Alert>);
    const btn = screen.getByRole('button', { name: '닫기' });
    expect(btn).toBeTruthy();
    fireEvent.click(btn);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('as="section" — renders <section> with role="alert"', () => {
    render(<Alert as="section" data-testid="alert">x</Alert>);
    const el = screen.getByTestId('alert');
    expect(el.tagName).toBe('SECTION');
    expect(el).toHaveAttribute('role', 'alert');
  });

  it('className composition — wonik-alert + external className coexist', () => {
    render(<Alert className="my-alert" data-testid="alert">x</Alert>);
    const el = screen.getByTestId('alert');
    expect(el).toHaveClass('wonik-alert');
    expect(el).toHaveClass('my-alert');
  });

  it('external style overrides defaults (spread last)', () => {
    render(<Alert style={{ padding: '99px' }} data-testid="alert">x</Alert>);
    expect(screen.getByTestId('alert')).toHaveStyle({ padding: '99px' });
  });

  it('common visual tokens — flex, items-center, fontSize 14px, radius 10px', () => {
    render(<Alert data-testid="alert">x</Alert>);
    const el = screen.getByTestId('alert');
    expect(el).toHaveStyle({ display: 'flex' });
    expect(el).toHaveStyle({ alignItems: 'center' });
    expect(el).toHaveStyle({ fontSize: '14px' });
    expect(el).toHaveStyle({ borderRadius: '10px' });
  });

  it('no AI slop visual decoration (no backdrop blur / gradient bg / glow shadow)', () => {
    render(<Alert data-testid="alert">x</Alert>);
    const styles = window.getComputedStyle(screen.getByTestId('alert'));
    expect(styles.backdropFilter || '').not.toMatch(/blur/);
    expect(styles.backgroundImage || '').not.toMatch(/gradient/);
    expect(styles.boxShadow || '').not.toMatch(/glow/i);
  });
});
