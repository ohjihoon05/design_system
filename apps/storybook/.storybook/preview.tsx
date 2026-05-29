import type { Decorator, Preview } from '@storybook/react-vite';
import * as a11yAddonAnnotations from '@storybook/addon-a11y/preview';
import { ThemeProvider, ToastProvider } from '@wonik/web';
import '@wonik/tokens/tokens.css';
import './global.css';

const withWonikProviders: Decorator = (Story, context) => {
  const mode = context.globals.theme === 'dark' ? 'dark' : 'light';
  return (
    <div
      data-theme={mode}
      style={{
        background: 'var(--color-canvas)',
        color: 'var(--color-text-dark)',
        minHeight: '100vh',
        padding: 24,
      }}
    >
      <ThemeProvider theme={mode} scope="self">
        <ToastProvider position="top-right">
          <Story />
        </ToastProvider>
      </ThemeProvider>
    </div>
  );
};

// addon-a11y가 자기 decorators / initialGlobals / parameters 를 export하므로
// spread를 먼저 펼친 뒤 우리 값을 마지막에 합쳐야 a11y가 우리 설정을 silent하게 덮어쓰지 않는다.
// (Storybook addon decorators spread 함정 — 2026-05-29 dark toggle 회귀 원인이었음.)
const preview: Preview = {
  ...a11yAddonAnnotations,
  decorators: [...(a11yAddonAnnotations.decorators ?? []), withWonikProviders],
  initialGlobals: {
    ...(a11yAddonAnnotations.initialGlobals ?? {}),
    theme: 'light',
  },
  globalTypes: {
    theme: {
      description: 'WONIK 디자인 시스템 light / dark 테마',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'circlehollow', title: 'Light' },
          { value: 'dark', icon: 'circle', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    ...(a11yAddonAnnotations.parameters ?? {}),
    layout: 'fullscreen',
  },
};

export default preview;
