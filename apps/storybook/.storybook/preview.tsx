import type { Decorator, Preview } from '@storybook/react-vite';
import { ThemeProvider, ToastProvider } from '@wonik/web';
import '@wonik/tokens/tokens.css';
import './global.css';

// Ladle .ladle/components.tsx 의 GlobalProvider 를 Storybook 데코레이터로 이식.
// globalState.mode 토글 → Storybook globals.theme 토글로 대응.
const withWonikProviders: Decorator = (Story, context) => {
  const mode = context.globals.theme === 'dark' ? 'dark' : 'light';
  return (
    <ThemeProvider defaultTheme={mode} key={mode}>
      <ToastProvider position="top-right">
        <div style={{ padding: 24, fontFamily: 'inherit' }}>
          <Story />
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
};

const preview: Preview = {
  decorators: [withWonikProviders],
  initialGlobals: {
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
    layout: 'fullscreen',

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
};

export default preview;
