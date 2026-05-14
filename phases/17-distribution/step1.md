# Step 1 — package.json publish-ready

## packages/tokens/package.json
- `private: true` 제거 ✅
- `version: "0.1.0"` (0.0.0 → 0.1.0) ✅
- `description` / `repository` / `homepage` / `license: "UNLICENSED"` 추가 ✅
- `publishConfig.access: "restricted"` + `registry: "https://npm.pkg.github.com/RESOLVE_BEFORE_PUBLISH"` (placeholder, 실수 publish 시 404) ✅
- `sideEffects: ["**/*.css"]` (CSS는 side-effect, tree-shaking 보존) ✅
- `prepublishOnly: "pnpm build && pnpm test"` ✅

## packages/web/package.json
- 위와 동일 + `sideEffects: false` (pure React 컴포넌트) ✅
- `peerDependencies`에 `@wonik/tokens: "^0.1.0"` 추가 (D4: dependency + peer 이중 선언) ✅

## 1.T1 grep 검증
- `"private"` count = 0 ✅
- `"version": "0.1.0"` × 2 ✅
- `RESOLVE_BEFORE_PUBLISH` × 2 (placeholder 명시) ✅

## 1.S1·1.S2 보안
- `private` key 부재 → publish-ready 명시 ✅
- placeholder registry URL → 실수 publish 방어 ✅
