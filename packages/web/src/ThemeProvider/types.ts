import type { ReactNode } from 'react';

export type ThemeMode = 'light' | 'dark';

export interface ThemeProviderProps {
  /** controlled 모드 — 외부에서 theme 직접 통제. 지정 시 defaultTheme 무시. */
  theme?: ThemeMode;

  /** controlled 모드의 변경 콜백. */
  onThemeChange?: (theme: ThemeMode) => void;

  /** uncontrolled 모드의 초기값. 기본 'light'. */
  defaultTheme?: ThemeMode;

  /**
   * data-theme 속성을 어디에 설정할지.
   * - 'html' (default): document.documentElement.dataset.theme — 페이지 전역
   * - 'self': ThemeProvider가 렌더하는 <div data-theme="..."> 안쪽만 영향
   */
  scope?: 'html' | 'self';

  /**
   * localStorage 기억.
   * - false (default): 기억 안 함
   * - true: 기본 key 'wonik-theme'으로 기억
   * - string: 지정 key로 기억
   */
  persist?: boolean | string;

  children: ReactNode;
}

export interface ThemeContextValue {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}
