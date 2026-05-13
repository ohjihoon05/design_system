import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge data-testid="badge">8장</Badge>);
    expect(screen.getByTestId('badge')).toHaveTextContent('8장');
  });

  it('default variant "neutral" — interfaceColors.surface bg + 1px border', () => {
    render(<Badge data-testid="badge">label</Badge>);
    const styleAttr = screen.getByTestId('badge').getAttribute('style') || '';
    expect(styleAttr).toMatch(/background:\s*var\(--color-surface/);
    expect(styleAttr).toMatch(/border:\s*1px solid var\(--color-border/);
  });

  it('variant "primary" — interfaceColors.primary bg + white text + no border', () => {
    render(
      <Badge variant="primary" data-testid="badge">
        8장
      </Badge>,
    );
    const styleAttr = screen.getByTestId('badge').getAttribute('style') || '';
    expect(styleAttr).toMatch(/background:\s*var\(--color-primary\)/);
    expect(styleAttr).toMatch(/color:\s*var\(--color-surface-white\)/);
    expect(styleAttr).not.toMatch(/border:\s*1px solid/);
  });

  it('default tag is <span>', () => {
    render(<Badge data-testid="badge">x</Badge>);
    expect(screen.getByTestId('badge').tagName).toBe('SPAN');
  });

  it('as="div" — renders <div>', () => {
    render(
      <Badge as="div" data-testid="badge">
        x
      </Badge>,
    );
    expect(screen.getByTestId('badge').tagName).toBe('DIV');
  });

  it('className composition — wonik-badge + external className coexist', () => {
    render(
      <Badge className="my-badge" data-testid="badge">
        x
      </Badge>,
    );
    const el = screen.getByTestId('badge');
    expect(el).toHaveClass('wonik-badge');
    expect(el).toHaveClass('my-badge');
  });

  it('external style overrides defaults (spread last)', () => {
    render(
      <Badge style={{ padding: '99px' }} data-testid="badge">
        x
      </Badge>,
    );
    expect(screen.getByTestId('badge')).toHaveStyle({ padding: '99px' });
  });

  it('common visual tokens — inline-flex, tabular-nums, fontSize 12px, radius 5px', () => {
    render(<Badge data-testid="badge">1</Badge>);
    const el = screen.getByTestId('badge');
    expect(el).toHaveStyle({ display: 'inline-flex' });
    expect(el).toHaveStyle({ alignItems: 'center' });
    expect(el).toHaveStyle({ fontSize: '12px' });
    expect(el).toHaveStyle({ borderRadius: '5px' });
    const styleAttr = el.getAttribute('style') || '';
    expect(styleAttr).toMatch(/font-variant-numeric:\s*tabular-nums/);
  });

  it('no AI slop visual decoration (no backdrop blur / gradient bg / glow shadow)', () => {
    render(<Badge variant="primary" data-testid="badge">x</Badge>);
    const styles = window.getComputedStyle(screen.getByTestId('badge'));
    expect(styles.backdropFilter || '').not.toMatch(/blur/);
    expect(styles.backgroundImage || '').not.toMatch(/gradient/);
    expect(styles.boxShadow || '').not.toMatch(/glow/i);
  });
});
