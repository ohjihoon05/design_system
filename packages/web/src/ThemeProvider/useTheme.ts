import { createContext, useContext } from 'react';
import type { ThemeContextValue } from './types';

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (ctx === null) {
    throw new Error('useTheme must be used inside <ThemeProvider>');
  }
  return ctx;
}
