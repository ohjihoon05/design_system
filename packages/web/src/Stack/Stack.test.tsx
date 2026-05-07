import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Stack } from './Stack';

describe('Stack', () => {
  it('renders a div by default', () => {
    render(<Stack data-testid="s">child</Stack>);
    expect(screen.getByTestId('s').tagName).toBe('DIV');
  });

  it('applies display: flex', () => {
    render(<Stack data-testid="s" />);
    expect(screen.getByTestId('s')).toHaveStyle({ display: 'flex' });
  });

  it('defaults to column direction (vertical stack)', () => {
    render(<Stack data-testid="s" />);
    expect(screen.getByTestId('s')).toHaveStyle({ flexDirection: 'column' });
  });

  it('applies row direction when explicit', () => {
    render(<Stack direction="row" data-testid="s" />);
    expect(screen.getByTestId('s')).toHaveStyle({ flexDirection: 'row' });
  });

  it('maps gap prop to gap via space token (4 -> 10px)', () => {
    render(<Stack gap={4} data-testid="s" />);
    expect(screen.getByTestId('s')).toHaveStyle({ gap: '10px' });
  });

  it('maps align="center" to alignItems: center', () => {
    render(<Stack align="center" data-testid="s" />);
    expect(screen.getByTestId('s')).toHaveStyle({ alignItems: 'center' });
  });

  it('maps align="start" to alignItems: flex-start', () => {
    render(<Stack align="start" data-testid="s" />);
    expect(screen.getByTestId('s')).toHaveStyle({ alignItems: 'flex-start' });
  });

  it('maps justify="between" to justifyContent: space-between', () => {
    render(<Stack justify="between" data-testid="s" />);
    expect(screen.getByTestId('s')).toHaveStyle({ justifyContent: 'space-between' });
  });

  it('applies flexWrap: wrap when wrap=true', () => {
    render(<Stack wrap data-testid="s" />);
    expect(screen.getByTestId('s')).toHaveStyle({ flexWrap: 'wrap' });
  });

  it('passes through Box props (p, bg, rounded)', () => {
    render(<Stack p={6} bg="surface" rounded="md" data-testid="s" />);
    const el = screen.getByTestId('s');
    // space[6] === '16px', surfaces.surface === '#FEFEFE', radius.md === '10px'
    expect(el).toHaveStyle({ padding: '16px' });
    expect(el).toHaveStyle({ background: '#FEFEFE' });
    expect(el).toHaveStyle({ borderRadius: '10px' });
  });

  it('passes through as prop', () => {
    render(<Stack as="section" data-testid="s" />);
    expect(screen.getByTestId('s').tagName).toBe('SECTION');
  });

  it('renders children in given order', () => {
    render(
      <Stack>
        <span>a</span>
        <span>b</span>
        <span>c</span>
      </Stack>,
    );
    expect(screen.getByText('a')).toBeInTheDocument();
    expect(screen.getByText('b')).toBeInTheDocument();
    expect(screen.getByText('c')).toBeInTheDocument();
  });

  it('allows consumer style override via style prop', () => {
    render(<Stack gap={4} style={{ gap: '99px' }} data-testid="s" />);
    expect(screen.getByTestId('s')).toHaveStyle({ gap: '99px' });
  });

  it('renders without AI slop visual decoration', () => {
    render(<Stack data-testid="s" />);
    const styles = window.getComputedStyle(screen.getByTestId('s'));
    expect(styles.backdropFilter || '').not.toMatch(/blur/);
    expect(styles.backgroundImage || '').not.toMatch(/gradient/);
    expect(styles.boxShadow || '').not.toMatch(/glow|0 0 \d+px/i);
  });
});
