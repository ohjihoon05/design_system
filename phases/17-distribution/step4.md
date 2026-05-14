# Step 4 — 빌드 + dry-run report

## 빌드
- `pnpm -F @wonik/tokens build` ✅ (ESM/CJS/DTS + tokens.css)
- `pnpm -F @wonik/web build` ✅ (ESM 29.27 KB / CJS 31.39 KB)

## 테스트
- `pnpm -F @wonik/web test` → **198 passing / 15 test files** ✅ (Phase 16과 동일, 컴포넌트 unchanged)

## dry-run
- `pnpm -F @wonik/tokens publish --dry-run --no-git-checks`
  - prepublishOnly 트리거 ✅
  - tarball: 6 files (dist만), 4.7 kB
  - placeholder URL 출력에 명시
- `pnpm -F @wonik/web publish --dry-run --no-git-checks`
  - prepublishOnly 트리거 ✅ (build + 198 test)
  - tarball: 5 files (dist만), 17.2 kB

## workspace:* 변환 검증
- `pnpm pack` artifact 추출 → resolved `package.json` 확인
- 🎯 `"@wonik/tokens": "workspace:*"` → **`"0.1.0"`** 자동 변환됨 ✅
- publishConfig / peer / sideEffects / files / license 모두 반영 ✅
- inspect/ 디렉토리는 검증 후 제거 (commit 제외)

## 산출
- `phases/17-distribution/dry-run-report.md` 작성 ✅ (spec §5 S6 모든 항목)
