import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@wonik/web';
import { App } from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" persist="wonik-fab-monitor-theme">
      <App />
    </ThemeProvider>
  </StrictMode>,
);
