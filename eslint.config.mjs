// ESLint flat config — ADR-026.
// 게시 패키지(@wonik/tokens·@wonik/web)에 실제 정적 검사를 도입한다. 그동안
// 각 패키지의 lint 스크립트는 `echo 'no lint yet'` placeholder였다.
//
// 룰셋: 직접 만들지 않고 검증된 recommended 세트만 채택한다.
//   - @eslint/js recommended      — 일반 JS 버그 패턴
//   - typescript-eslint recommended — 타입 인지 없는(non-type-checked) TS 룰
//   - eslint-plugin-react-hooks   — Hooks 규칙 위반 (실버그 차단)
// type-checked 룰은 의도적으로 제외 — 첫 도입은 빠르고 단순하게.

import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/storybook-static/**',
      '**/*.d.ts',
      'pkg-out/**',
      'WONIK IPS — WARP Design System/**', // ADR-004: reference-only 시안
      'color_token/**',
      '.gstack/**',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },

  // React 컴포넌트 — Hooks 규칙. rules-of-hooks는 error, exhaustive-deps는 warn.
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: { 'react-hooks': reactHooks },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },

  // 테스트 파일 — Vitest globals (vitest config: globals: true 기준).
  {
    files: ['**/*.test.{ts,tsx}'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        vi: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
      },
    },
  },
);
