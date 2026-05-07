import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Box } from './Box';

describe('Box', () => {
  it('renders a div by default', () => {
    render(<Box data-testid="b">child</Box>);
    expect(screen.getByTestId('b').tagName).toBe('DIV');
  });

  it('renders polymorphically via the as prop', () => {
    render(
      <Box as="section" data-testid="b">
        child
      </Box>,
    );
    expect(screen.getByTestId('b').tagName).toBe('SECTION');
  });

  it('renders children', () => {
    render(<Box>hello</Box>);
    expect(screen.getByText('hello')).toBeInTheDocument();
  });

  it('maps p prop to padding via space token (4 -> 10px)', () => {
    render(<Box p={4} data-testid="b" />);
    expect(screen.getByTestId('b')).toHaveStyle({ padding: '10px' });
  });

  it('maps px/py to logical paddings', () => {
    render(<Box px={3} py={6} data-testid="b" />);
    const el = screen.getByTestId('b');
    expect(el).toHaveStyle({ paddingLeft: '8px', paddingRight: '8px' });
    expect(el).toHaveStyle({ paddingTop: '16px', paddingBottom: '16px' });
  });

  it('maps individual side paddings', () => {
    render(<Box pt={1} pr={2} pb={3} pl={4} data-testid="b" />);
    const el = screen.getByTestId('b');
    expect(el).toHaveStyle({
      paddingTop: '4px',
      paddingRight: '6px',
      paddingBottom: '8px',
      paddingLeft: '10px',
    });
  });

  it('maps margin props', () => {
    render(<Box m={2} mt={6} data-testid="b" />);
    const el = screen.getByTestId('b');
    // mt가 m을 override해야 함 (CSS의 longhand-after-shorthand 의도와 동일)
    expect(el).toHaveStyle({ marginTop: '16px' });
  });

  it('applies bg via surfaces token', () => {
    render(<Box bg="surface" data-testid="b" />);
    // surfaces.surface === 'var(--color-surface)' (CSS variable reference)
    expect(screen.getByTestId('b')).toHaveStyle({ background: 'var(--color-surface)' });
  });

  it('applies border with 1px solid via borders token', () => {
    render(<Box border="mid" data-testid="b" />);
    // jsdom does not parse var() inside the border shorthand into longhands,
    // so assert the inline style string instead.
    const el = screen.getByTestId('b') as HTMLElement;
    expect(el.style.border).toMatch(/1px\s+solid/);
  });

  it('applies rounded via radius token', () => {
    render(<Box rounded="md" data-testid="b" />);
    // radius.md === '10px'
    expect(screen.getByTestId('b')).toHaveStyle({ borderRadius: '10px' });
  });

  it('passes through native HTML attributes', () => {
    render(<Box id="my-box" role="region" aria-label="hero" data-testid="b" />);
    const el = screen.getByTestId('b');
    expect(el).toHaveAttribute('id', 'my-box');
    expect(el).toHaveAttribute('role', 'region');
    expect(el).toHaveAttribute('aria-label', 'hero');
  });

  it('allows consumer style override via style prop', () => {
    render(<Box p={4} style={{ padding: '99px' }} data-testid="b" />);
    // 사용자 지정 style이 token-derived padding을 override해야 함 (style spread 마지막)
    expect(screen.getByTestId('b')).toHaveStyle({ padding: '99px' });
  });

  it('renders without any visual decoration by default (no glow/gradient)', () => {
    render(<Box data-testid="b">x</Box>);
    const styles = window.getComputedStyle(screen.getByTestId('b'));
    // backdrop-filter, background-image gradient, box-shadow 모두 없어야 함
    expect(styles.backdropFilter || '').not.toMatch(/blur/);
    expect(styles.backgroundImage || '').not.toMatch(/gradient/);
    expect(styles.boxShadow || '').not.toMatch(/glow|0 0 \d+px/i);
  });
});
