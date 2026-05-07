import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Text } from './Text';

describe('Text', () => {
  it('renders a p by default', () => {
    render(<Text data-testid="t">hi</Text>);
    expect(screen.getByTestId('t').tagName).toBe('P');
  });

  it('renders polymorphically via as prop', () => {
    render(
      <Text as="h2" data-testid="t">
        heading
      </Text>,
    );
    expect(screen.getByTestId('t').tagName).toBe('H2');
  });

  it('renders children text', () => {
    render(<Text>hello world</Text>);
    expect(screen.getByText('hello world')).toBeInTheDocument();
  });

  it('applies fontSize via variant token (titleSm -> 14px)', () => {
    render(
      <Text variant="titleSm" data-testid="t">
        x
      </Text>,
    );
    expect(screen.getByTestId('t')).toHaveStyle({ fontSize: '14px' });
  });

  it('defaults to variant="label" (12px)', () => {
    render(<Text data-testid="t">x</Text>);
    expect(screen.getByTestId('t')).toHaveStyle({ fontSize: '12px' });
  });

  it('applies fontWeight via weight token (medium -> 500)', () => {
    render(
      <Text weight="medium" data-testid="t">
        x
      </Text>,
    );
    expect(screen.getByTestId('t')).toHaveStyle({ fontWeight: '500' });
  });

  it('applies color via text token (color="dark" -> text-dark var)', () => {
    render(
      <Text color="dark" data-testid="t">
        x
      </Text>,
    );
    expect(screen.getByTestId('t')).toHaveStyle({ color: 'var(--color-text-dark)' });
  });

  it('color="brand" applies WONIK BLUE primary token', () => {
    render(
      <Text color="brand" data-testid="t">
        x
      </Text>,
    );
    expect(screen.getByTestId('t')).toHaveStyle({ color: 'var(--color-primary)' });
  });

  it('applies text-align', () => {
    render(
      <Text align="center" data-testid="t">
        x
      </Text>,
    );
    expect(screen.getByTestId('t')).toHaveStyle({ textAlign: 'center' });
  });

  it('truncate=true sets ellipsis styles', () => {
    render(
      <Text truncate data-testid="t">
        a very long sentence that overflows
      </Text>,
    );
    const el = screen.getByTestId('t');
    expect(el).toHaveStyle({
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    });
  });

  it('passes through native attributes', () => {
    render(
      <Text id="title" aria-label="page title" data-testid="t">
        x
      </Text>,
    );
    const el = screen.getByTestId('t');
    expect(el).toHaveAttribute('id', 'title');
    expect(el).toHaveAttribute('aria-label', 'page title');
  });

  it('allows consumer style override via style prop', () => {
    render(
      <Text variant="titleSm" style={{ fontSize: '99px' }} data-testid="t">
        x
      </Text>,
    );
    expect(screen.getByTestId('t')).toHaveStyle({ fontSize: '99px' });
  });

  it('does NOT use gradient text (AI slop anti-pattern)', () => {
    render(<Text data-testid="t">x</Text>);
    const styles = window.getComputedStyle(screen.getByTestId('t'));
    expect(styles.backgroundImage || '').not.toMatch(/gradient/);
    expect(styles.webkitBackgroundClip || styles.backgroundClip || '').not.toMatch(/text/);
  });

  it('uses tokens.fontFamily for default font', () => {
    render(<Text data-testid="t">x</Text>);
    const ff = window.getComputedStyle(screen.getByTestId('t')).fontFamily || '';
    expect(ff.toLowerCase()).toContain('segoe ui');
  });
});
