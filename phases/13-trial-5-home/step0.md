# Step 0 — 사전 준비 + branch + fixture 확인

## 작업 (실행 결과)

1. **design_system 빌드 + pack** (phase 12 Card 포함):
   - `pnpm -F @wonik/tokens build` ✅ — `dist/index.mjs 4.73 KB`, `dist/tokens.css` (light:75, dark:75, shared:27)
   - `pnpm -F @wonik/web build` ✅ — `dist/index.mjs 26.76 KB`, `dist/index.js 28.75 KB`
   - `pnpm pack` ✅ — `pkg-out/wonik-tokens-0.0.0.tgz`, `wonik-web-0.0.0.tgz` 최신

2. **ppt 측 reinstall**:
   - Trial 4 잔재 stash: `frontend/pnpm-lock.yaml`, `Outline.tsx`, `OutlineCard.tsx` — `git stash push -m "trial-4-outline residual for trial-5-home start"`
   - main checkout → `trial-5-home` branch 분기
   - `pnpm install --force` ✅ — 167 packages, 9.3s
   - `pnpm list @wonik/web` ✅ — `@wonik/web@0.0.0` linked

3. **R19-only API 사전 grep**: `useFormStatus|useOptimistic|use\(` in Home.tsx → 0 matches ✅

4. **spec §3 매핑 line 재확인** — 모두 일치:
   - line 184–199: textarea
   - line 208–233: AI 다듬기 button
   - line 259–303: PDF dropzone
   - line 288–298: 삭제 button
   - line 316–324: slideCount badge
   - line 356–368: select
   - line 376–391: Verbosity 5-pill
   - line 395–409: Error alert

## 통과 조건

- 0.1·0.2·0.3·0.4·0.5 ✅
- 0.T1 (dist 존재) ✅
- 0.T2 (tsc resolve) — Step 1 후 함께 확인 ✅
- 0.S1 (main 위 작업 방지: stash + branch 분기) ✅

## 메모

- ppt node 프로세스 다수 잔존 — taskkill 안 하고 Vite의 port fallback에 의존(3000→3001→3002→3003 모두 사용 중, 3004로 fallback).
