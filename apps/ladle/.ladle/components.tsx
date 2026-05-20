import type { GlobalProvider } from '@ladle/react';
import { ThemeProvider, ToastProvider } from '@wonik/web';
import '@wonik/tokens/tokens.css';
import './global.css';

export const Provider: GlobalProvider = ({ children, globalState }) => {
  const mode = globalState?.mode === 'dark' ? 'dark' : 'light';
  return (
    <ThemeProvider defaultTheme={mode} key={mode}>
      <ToastProvider position="top-right">
        <div style={{ padding: 24, fontFamily: 'inherit' }}>{children}</div>
      </ToastProvider>
    </ThemeProvider>
  );
};
