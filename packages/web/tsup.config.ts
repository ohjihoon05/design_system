import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  external: ['react', 'react-dom'],
  // Inline @wonik/tokens so the JS export carries the resolved var(--color-...)
  // strings directly. Consumers still install @wonik/tokens separately for the
  // CSS variable definitions (`@wonik/tokens/tokens.css`).
  noExternal: ['@wonik/tokens'],
});
