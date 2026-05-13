# Phase 17 — Dry-Run Report

`pnpm publish --dry-run --no-git-checks` 실행 결과 + `pnpm pack` artifact inspection 기록. 2026-05-13.

## @wonik/tokens@0.1.0

### prepublishOnly 트리거
✅ `pnpm build && pnpm test` 실행 → exit 0
- 빌드: ESM/CJS/DTS + tokens.css (light: 75 / dark: 75 / shared: 27 변수)
- test: `echo 'no tests yet'` (tokens 패키지는 빌드 산출물 검증으로 대체)

### Tarball Contents
```
6.3kB  dist/index.d.mts
6.3kB  dist/index.d.ts
6.3kB  dist/index.js
4.8kB  dist/index.mjs
7.0kB  dist/tokens.css
1.2kB  package.json
```

- **total files: 6**
- **package size: 4.7 kB** / **unpacked: 32.0 kB**
- shasum: `1f8078570ae97857c35d98ae8110db693891abc9`
- ✅ `dist/` 외 파일 0 (src / tests / config / scripts 누출 없음)

### publishConfig 반영
- `registry: https://npm.pkg.github.com/RESOLVE_BEFORE_PUBLISH` ✅ placeholder URL → 실수 publish 시 404
- `access: restricted` ✅
- "Publishing to https://npm.pkg.github.com/RESOLVE_BEFORE_PUBLISH with tag latest and restricted access (dry-run)" 명시 출력

## @wonik/web@0.1.0

### prepublishOnly 트리거
✅ `pnpm build && pnpm test` 실행 → exit 0
- 빌드: ESM/CJS/DTS
- test: **198 passing / 15 test files** (Phase 16 시점과 동일, 본 phase는 컴포넌트 unchanged)

### Tarball Contents
```
14.4kB  dist/index.d.mts
14.4kB  dist/index.d.ts
32.2kB  dist/index.js
30.0kB  dist/index.mjs
 1.6kB  package.json
```

- **total files: 5**
- **package size: 17.2 kB** / **unpacked: 92.4 kB**
- shasum: `68e5fbe8ba6333072548c02f2c7a5e5bf4ee4fd9`
- ✅ `dist/` 외 파일 0

### Resolved package.json (pack 후 inspect)
주요 필드 — workspace:* 변환 + 메타데이터 확인:

```json
{
  "name": "@wonik/web",
  "version": "0.1.0",
  "license": "UNLICENSED",
  "sideEffects": false,
  "files": ["dist"],
  "publishConfig": {
    "access": "restricted",
    "registry": "https://npm.pkg.github.com/RESOLVE_BEFORE_PUBLISH"
  },
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0",
    "@wonik/tokens": "^0.1.0"
  },
  "dependencies": {
    "@wonik/tokens": "0.1.0"
  }
}
```

🎯 **핵심 검증 (spec §5 S6)**:

1. ✅ **`workspace:*` → `"0.1.0"`** 자동 변환됨 (R2 mitigation 성공)
2. ✅ **publishConfig 정상 반영**
3. ✅ **peer + dependency 양쪽 명시** (D4 결정 반영)
4. ✅ **scripts에서 `prepublishOnly` 제거됨** — pnpm/npm pack이 publish-only hook을 artifact에서 자동 제외 (host install 시 불필요한 build/test 실행 방지)
5. ✅ **description / repository / homepage / license** 모든 필드 반영

## 결론

두 패키지 모두 **publish-ready 상태 검증 완료**.

- 메타데이터 누락 0
- `dist/` 외 파일 누출 0
- workspace:* 변환 자동 처리 확인
- prepublishOnly 가드 작동 (build/test 실패 시 publish 불가)
- placeholder registry URL이 실수 publish 방어 (404 fail)

**다음 단계** (별도 phase): registry 옵션 확정(ADR-018) → `publishConfig.registry` 실제 URL 교체 → `pnpm publish` 첫 실행 → ppt가 published 버전으로 install 전환.
