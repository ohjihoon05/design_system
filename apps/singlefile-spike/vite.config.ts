import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// 자가포함 HTML 1개로 빌드 — JS·CSS(토큰 :root 시트 포함)를 전부 인라인.
// 산출물 dist/index.html을 singlefile-gate가 file://로 검증 (ADR-043).
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  server: { port: 5176 },
});
