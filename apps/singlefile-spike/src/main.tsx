import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, ToastProvider } from '@wonik/web';
// CRITICAL (ADR-043): 이 import가 토큰 :root 시트를 번들에 넣고,
// vite-plugin-singlefile이 그걸 HTML에 인라인한다. 이 줄이 빠지면 모든 var(--color-*)가
// 미해결 → 색 silent 붕괴. singlefile-gate가 정확히 그 실패를 잡는다.
import '@wonik/tokens/tokens.css';
import { App } from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light">
      <ToastProvider position="top-right">
        <App />
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>,
);
