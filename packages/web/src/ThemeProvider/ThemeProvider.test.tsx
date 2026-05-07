import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from './ThemeProvider';
import { useTheme } from './useTheme';

function ThemeReader() {
  const { theme, setTheme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="cur">{theme}</span>
      <button onClick={() => setTheme('dark')}>set-dark</button>
      <button onClick={toggleTheme}>toggle</button>
    </div>
  );
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme');
    localStorage.clear();
  });

  it('uncontrolled — defaults to "light"', () => {
    render(
      <ThemeProvider>
        <ThemeReader />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('cur').textContent).toBe('light');
  });

  it('uncontrolled — defaultTheme honored', () => {
    render(
      <ThemeProvider defaultTheme="dark">
        <ThemeReader />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('cur').textContent).toBe('dark');
  });

  it('sets data-theme on <html> by default (scope="html")', () => {
    render(
      <ThemeProvider defaultTheme="dark">
        <ThemeReader />
      </ThemeProvider>,
    );
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('setTheme updates state and html attribute', () => {
    render(
      <ThemeProvider>
        <ThemeReader />
      </ThemeProvider>,
    );
    fireEvent.click(screen.getByText('set-dark'));
    expect(screen.getByTestId('cur').textContent).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('toggleTheme flips between light and dark', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <ThemeReader />
      </ThemeProvider>,
    );
    fireEvent.click(screen.getByText('toggle'));
    expect(screen.getByTestId('cur').textContent).toBe('dark');
    fireEvent.click(screen.getByText('toggle'));
    expect(screen.getByTestId('cur').textContent).toBe('light');
  });

  it('controlled — theme prop wins over internal state', () => {
    const { rerender } = render(
      <ThemeProvider theme="dark">
        <ThemeReader />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('cur').textContent).toBe('dark');
    rerender(
      <ThemeProvider theme="light">
        <ThemeReader />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('cur').textContent).toBe('light');
  });

  it('controlled — onThemeChange called when setTheme invoked', () => {
    const onChange = vi.fn();
    render(
      <ThemeProvider theme="light" onThemeChange={onChange}>
        <ThemeReader />
      </ThemeProvider>,
    );
    fireEvent.click(screen.getByText('set-dark'));
    expect(onChange).toHaveBeenCalledWith('dark');
  });

  it('scope="self" — sets data-theme on rendered wrapper, not html', () => {
    render(
      <ThemeProvider defaultTheme="dark" scope="self">
        <ThemeReader />
      </ThemeProvider>,
    );
    expect(document.documentElement.getAttribute('data-theme')).toBeNull();
    const reader = screen.getByTestId('cur');
    const wrapper = reader.closest('[data-theme]');
    expect(wrapper?.getAttribute('data-theme')).toBe('dark');
  });

  it('persist=true — stores theme in localStorage as "wonik-theme"', () => {
    render(
      <ThemeProvider defaultTheme="dark" persist>
        <ThemeReader />
      </ThemeProvider>,
    );
    expect(localStorage.getItem('wonik-theme')).toBe('dark');
  });

  it('persist=string — uses custom key', () => {
    render(
      <ThemeProvider defaultTheme="dark" persist="my-app">
        <ThemeReader />
      </ThemeProvider>,
    );
    expect(localStorage.getItem('my-app')).toBe('dark');
  });

  it('persist=true — restores theme from localStorage on mount', () => {
    localStorage.setItem('wonik-theme', 'dark');
    render(
      <ThemeProvider defaultTheme="light" persist>
        <ThemeReader />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('cur').textContent).toBe('dark');
  });

  it('useTheme outside ThemeProvider throws', () => {
    const original = console.error;
    console.error = () => {};
    expect(() => render(<ThemeReader />)).toThrow(
      /useTheme must be used inside <ThemeProvider>/,
    );
    console.error = original;
  });
});
