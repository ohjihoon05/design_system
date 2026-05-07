import '@testing-library/jest-dom';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { beforeAll } from 'vitest';

// Inject @wonik/tokens CSS variables into jsdom so components rendered with
// inline `style={{ color: 'var(--color-primary)' }}` have a defined custom
// property to reference. jsdom 25 does not resolve var() inside
// getComputedStyle, so tests still assert on the var(...) string itself —
// but the values exist on :root, which keeps visual debugging accurate and
// keeps the path open if jsdom adds resolution later.
const __dirname = dirname(fileURLToPath(import.meta.url));
const tokensCssPath = resolve(__dirname, '../tokens/dist/tokens.css');

beforeAll(() => {
  const css = readFileSync(tokensCssPath, 'utf8');
  const style = document.createElement('style');
  style.setAttribute('data-wonik-tokens', '');
  style.textContent = css;
  document.head.appendChild(style);
});
