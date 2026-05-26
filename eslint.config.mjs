// ESLint flat config — ADR-026 + ADR-027 (a11y detection loop).
// 게시 패키지(@wonik/tokens·@wonik/web)에 실제 정적 검사를 도입한다.
//
// 룰셋: 직접 만들지 않고 검증된 recommended 세트만 채택한다.
//   - @eslint/js recommended         — 일반 JS 버그 패턴
//   - typescript-eslint recommended  — 타입 인지 없는(non-type-checked) TS 룰
//   - eslint-plugin-react-hooks      — Hooks 규칙 위반 (실버그 차단)
//   - eslint-plugin-jsx-a11y         — JSX a11y 정적 검사 (ADR-027 detection loop)
// type-checked 룰은 의도적으로 제외 — 첫 도입은 빠르고 단순하게.
//
// jsx-a11y@6.10.2는 ESLint v10 peer를 아직 선언하지 않음(^3..^9). 런타임은 v10에서
// 정상 작동 — cosmetic peer warning만 발생. ADR-027 본문에 결정 기록.

import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
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
      '.claude/worktrees/**', // throwaway spike worktrees — not source of truth
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

  // JSX a11y — ADR-027. recommended preset만 채택, 룰 커스터마이즈 없음.
  // 위반 escape hatch: per-line `// eslint-disable-next-line jsx-a11y/<rule> -- <justification>`
  // — 정당화 주석 필수. packages/web/ 안에서의 disable은 reviewer 승인 필요.
  // consumer apps의 disable은 자유.
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: { 'jsx-a11y': jsxA11y },
    rules: { ...jsxA11y.configs.recommended.rules },
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
