import { useState, useEffect, useCallback, useMemo } from 'react';
import { ThemeContext } from './useTheme';
import type { ThemeProviderProps, ThemeMode, ThemeContextValue } from './types';

export function ThemeProvider({
  theme: controlledTheme,
  onThemeChange,
  defaultTheme = 'light',
  scope = 'html',
  persist = false,
  children,
}: ThemeProviderProps) {
  const persistKey = typeof persist === 'string' ? persist : 'wonik-theme';

  const [internalTheme, setInternalTheme] = useState<ThemeMode>(() => {
    if (controlledTheme !== undefined) return controlledTheme;
    if (persist && typeof window !== 'undefined') {
      const stored = window.localStorage.getItem(persistKey);
      if (stored === 'light' || stored === 'dark') return stored;
    }
    return defaultTheme;
  });

  const isControlled = controlledTheme !== undefined;
  const currentTheme = isControlled ? controlledTheme : internalTheme;

  const setTheme = useCallback(
    (next: ThemeMode) => {
      if (!isControlled) setInternalTheme(next);
      onThemeChange?.(next);
    },
    [isControlled, onThemeChange],
  );

  const toggleTheme = useCallback(() => {
    setTheme(currentTheme === 'light' ? 'dark' : 'light');
  }, [currentTheme, setTheme]);

  useEffect(() => {
    if (scope === 'html' && typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', currentTheme);
    }
  }, [scope, currentTheme]);

  useEffect(() => {
    if (persist && typeof window !== 'undefined') {
      window.localStorage.setItem(persistKey, currentTheme);
    }
  }, [persist, persistKey, currentTheme]);

  const contextValue: ThemeContextValue = useMemo(
    () => ({ theme: currentTheme, setTheme, toggleTheme }),
    [currentTheme, setTheme, toggleTheme],
  );

  if (scope === 'self') {
    return (
      <ThemeContext.Provider value={contextValue}>
        <div data-theme={currentTheme}>{children}</div>
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
  );
}
