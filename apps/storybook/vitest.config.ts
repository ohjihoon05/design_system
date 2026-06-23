import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

import { playwright } from '@vitest/browser-playwright';

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({ configDir: path.join(dirname, '.storybook') }),
        ],
        // Pre-bundle React entrypoints so Vite does not re-optimize mid-run and
        // reload tests (causes "failed to find the current suite" import errors).
        optimizeDeps: {
          include: [
            'react',
            'react-dom',
            'react-dom/client',
            'react/jsx-runtime',
            'react/jsx-dev-runtime',
            'storybook/test',
          ],
        },
        test: {
          name: 'storybook',
          setupFiles: ['./.storybook/vitest.setup.ts'],
          // Browser-mode(chromium) 스토리 테스트는 머신 부하(예: 다른 Chrome 다수)
          // 하에서 render가 기본 5s/15s timeout을 넘겨 비결정적으로 실패한다(전부
          // "Test timed out", assertion 실패 아님). 부하 없을 땐 빠르므로 헤드룸은
          // 공짜이고, 실제 a11y 위반은 결정적이라 retry로 숨겨지지 않는다.
          testTimeout: 60000,
          hookTimeout: 60000,
          retry: 1,
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
