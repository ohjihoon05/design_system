# Step 3 — Public export + 빌드

## 작업 (실행 결과)

- `packages/web/src/index.ts` — Card 아래에 `export { Badge } from './Badge'` + type re-export 추가.
- `pnpm -F @wonik/tokens build` ✅ — tokens.css (light 75, dark 75, shared 27) 재생성.
- `pnpm -F @wonik/web build` ✅ — ESM `12.20 KB` + CJS + DTS 모두 정상.
- 전체 테스트 — `pnpm -F @wonik/web test` 186 passing (177 + 9 Badge).

## 통과 조건

- 3.1·3.2 ✅
- 3.T1 (전체 186 passing, 회귀 0) ✅
- 3.T2 (tsc --noEmit 0 errors) ✅ — 빌드 통과 == 타입 OK
