import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card data-testid="card">Card content</Card>);
    expect(screen.getByTestId('card')).toHaveTextContent('Card content');
  });

  it('default variant "surface" — 1px solid border with interfaceColors.border', () => {
    render(<Card data-testid="card">x</Card>);
    const styleAttr = screen.getByTestId('card').getAttribute('style') || '';
    expect(styleAttr).toMatch(/border:\s*1px solid var\(--color-border/);
  });

  it('variant "elevated" — no border, box-shadow present', () => {
    render(
      <Card variant="elevated" data-testid="card">
        x
      </Card>,
    );
    const styleAttr = screen.getByTestId('card').getAttribute('style') || '';
    expect(styleAttr).toMatch(/box-shadow/);
    expect(styleAttr).not.toMatch(/border:\s*1px solid/);
  });

  it('default padding "md" — 16px', () => {
    render(<Card data-testid="card">x</Card>);
    expect(screen.getByTestId('card')).toHaveStyle({ padding: '16px' });
  });

  it('padding "none" — 0', () => {
    render(
      <Card padding="none" data-testid="card">
        x
      </Card>,
    );
    expect(screen.getByTestId('card')).toHaveStyle({ padding: '0px' });
  });

  it('padding "sm" — 10px', () => {
    render(
      <Card padding="sm" data-testid="card">
        x
      </Card>,
    );
    expect(screen.getByTestId('card')).toHaveStyle({ padding: '10px' });
  });

  it('padding "lg" — 32px', () => {
    render(
      <Card padding="lg" data-testid="card">
        x
      </Card>,
    );
    expect(screen.getByTestId('card')).toHaveStyle({ padding: '32px' });
  });

  it('as="section" — renders <section>', () => {
    render(
      <Card as="section" data-testid="card">
        x
      </Card>,
    );
    expect(screen.getByTestId('card').tagName).toBe('SECTION');
  });

  it('className composition — wonik-card + external className coexist', () => {
    render(
      <Card className="my-card" data-testid="card">
        x
      </Card>,
    );
    const el = screen.getByTestId('card');
    expect(el).toHaveClass('wonik-card');
    expect(el).toHaveClass('my-card');
  });

  it('external style overrides defaults (spread last)', () => {
    render(
      <Card style={{ padding: '99px' }} data-testid="card">
        x
      </Card>,
    );
    expect(screen.getByTestId('card')).toHaveStyle({ padding: '99px' });
  });

  it('uses interfaceColors for background (no hex literal)', () => {
    render(<Card data-testid="card">x</Card>);
    const styleAttr = screen.getByTestId('card').getAttribute('style') || '';
    expect(styleAttr).toMatch(/var\(--color-surface/);
  });

  it('injects scoped CSS once into document head', () => {
    render(<Card>a</Card>);
    render(<Card>b</Card>);
    const styleTags = document.head.querySelectorAll('style[data-wonik-card]');
    expect(styleTags.length).toBe(1);
    expect(styleTags[0].textContent).toMatch(/\[data-theme="dark"\]\s*\.wonik-card-elevated/);
  });

  it('elevated variant gets className suffix "wonik-card-elevated"', () => {
    render(
      <Card variant="elevated" data-testid="card">
        x
      </Card>,
    );
    expect(screen.getByTestId('card')).toHaveClass('wonik-card-elevated');
  });

  it('no AI slop visual decoration (no backdrop blur / gradient bg / glow shadow)', () => {
    render(<Card variant="elevated" data-testid="card">x</Card>);
    const styles = window.getComputedStyle(screen.getByTestId('card'));
    expect(styles.backdropFilter || '').not.toMatch(/blur/);
    expect(styles.backgroundImage || '').not.toMatch(/gradient/);
    expect(styles.boxShadow || '').not.toMatch(/glow/i);
  });
});
