import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// ATLAS 화면을 자가포함 HTML 1개로 빌드 — JS·CSS(@wonik/tokens :root 시트 포함)를 전부 인라인.
// 산출물 dist/index.html을 더블클릭하면 서버·IT 없이 file://로 열린다 (컨시어지 c 납품, ADR-043).
// singlefile-gate로 file:// 색-붕괴 silent 실패를 검증한다.
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  server: { port: 5177 },
});
