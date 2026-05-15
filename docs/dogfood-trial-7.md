# Dogfood Trial 7: ppt 0.0.0 → 0.1.0 마이그레이션 + Alert 첫 외부 적용

**날짜**: 2026-05-15
**대상 product**: ppt (Factory PPT)
**적용 범위**: ppt 전체(`@wonik/web` 패키지 자체 마이그레이션) + `frontend/src/pages/Home.tsx` Alert 1개
**목표**: 토스 ⑤ Publish & adopt 사이클을 손으로 한 바퀴 돌려 layer B 진입 전 packaging contract 검증.

## 적용 방식

1. **design_system 빌드 + pack** (0.1.0 — atom 14개 도달 시점):
   ```powershell
   pnpm -F @wonik/tokens build
   pnpm -F @wonik/web build
   pnpm -F @wonik/tokens pack    # → wonik-tokens-0.1.0.tgz (root)
   pnpm -F @wonik/web pack       # → wonik-web-0.1.0.tgz (root)
   ```
   `pnpm pack`이 `workspace:*` → 실제 버전(`0.1.0`) 자동 변환됨을 tarball 내 `package.json` 검사로 확인.

2. **ppt 마이그레이션** — 기존 vendor 0.0.0 tarball을 0.1.0으로 교체:
   ```powershell
   cp wonik-tokens-0.1.0.tgz C:/Users/ohjih/ppt/frontend/vendor/
   cp wonik-web-0.1.0.tgz   C:/Users/ohjih/ppt/frontend/vendor/
   ```
   `frontend/package.json` 두 군데 버전 ref 0.0.0 → 0.1.0.

3. **첫 install 시도 → 실패** (학습 포인트):
   ```
   ERR_PNPM_FETCH_404  GET https://registry.npmjs.org/@wonik%2Ftokens: Not Found
   ```
   원인 진단: `@wonik/web` tarball 내 `dependencies."@wonik/tokens": "0.1.0"` 선언이 공개 npm registry lookup을 유발. 사내 registry 미정 상태에서는 broken contract.

4. **packaging contract 정상화** (ADR-019 결정):
   - `packages/web/package.json`의 `dependencies."@wonik/tokens"` 제거
   - `devDependencies`에 `"@wonik/tokens": "workspace:*"` 추가 (workspace dev 시점 link 유지)
   - `peerDependencies."@wonik/tokens": "^0.1.0"` 그대로 (host 계약)
   - design_system: `pnpm install` → `pnpm -F @wonik/web build` → `pnpm -F @wonik/web pack` 재실행
   - 새 tarball을 ppt vendor에 덮어씀

5. **ppt 두 번째 install 시도 → 성공**:
   - `frontend/package.json`에서 `pnpm.overrides` 섹션 제거 (불필요해짐)
   - `dependencies`에 `@wonik/tokens` 직접 추가 (vendor tarball)
   - `pnpm-lock.yaml` 삭제 + `node_modules/@wonik` 삭제 후 `pnpm install`
   - 결과: `+ @wonik/tokens 0.1.0 / + @wonik/web 0.1.0` (Done in 8.1s)

6. **Alert 첫 외부 적용** — `Home.tsx` line 394-409의 raw `<div>` 14줄 error UI를 1줄로 교체:
   ```tsx
   // BEFORE (raw)
   {error && (
     <div role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 flex items-center justify-between">
       <span>{error}</span>
       <button type="button" onClick={clearError} className="text-red-400 hover:text-red-300 ml-3 text-xs underline">닫기</button>
     </div>
   )}

   // AFTER (Alert)
   {error && <Alert onDismiss={clearError}>{error}</Alert>}
   ```
   import: `import { Spinner, Button, Alert } from "@wonik/web";`

7. **Vite HMR 검증**:
   ```
   [vite] (client) hmr update /src/pages/Home.tsx, /src/index.css   (×2)
   ```
   타입 에러 0, import 에러 0, 런타임 에러 0.

## 발견사항

### F1 — sandbox에선 안 보이는 packaging 버그가 외부 product에서 1초 만에 터진다

monorepo 내부 sandbox(`apps/web-sandbox`)는 workspace link로 모든 패키지가 hoist되어 dep 누락이 가려짐. 외부 product(별도 repo + 별도 lockfile + tarball install)에서만 contract 위반이 드러남.

→ **이게 토스가 매 release마다 host product dogfood를 강제하는 이유**. sandbox 검증만으로는 부족.

### F2 — `workspace:*` 자동 변환은 작동하지만 그게 정답은 아님

`pnpm pack`이 `workspace:*` → `0.1.0`으로 변환해주는 건 사실. 하지만 변환된 결과가 host에서 풀릴 수 있는지는 **host의 install 환경(registry 가용성)에 의존**. sandbox에선 link라 우회되고, 외부 host에선 registry lookup으로 fail.

→ design system 컴포넌트 패키지가 토큰 패키지를 `dependencies`로 두면 안 되는 본질적 이유.

### F3 — `pnpm.overrides`는 우회로지 해결책이 아니다

ppt가 처음에 `pnpm.overrides`로 `@wonik/tokens`을 vendor tarball로 강제 매핑한 것은 0.0.0 시절 임시방편. 0.1.0 마이그레이션 시 lockfile cache와 충돌하며 깨짐. 정상화 후에는 host도 평범한 dependency 두 개로 단순화 (코드 14줄 → 0줄).

### F4 — `@wonik/web` Alert가 host 코드를 14줄 → 1줄로 압축

raw Tailwind error UI(border/bg/text/hover 모두 hex 또는 Tailwind palette) → Alert 한 줄로 교체. 시각적으로는 거의 동일하나 색상이 토큰화되어 dark 테마 자동 대응 가능 + a11y `role="alert"` 컴포넌트가 자동 보장.

→ design system의 진짜 가치를 **host 코드 라인 수 감소**라는 정량 지표로 첫 측정.

## 결정

- **ADR-019** 신설 — `@wonik/web`은 `@wonik/tokens`를 peer + dev로만 선언. dependency에서 제거. ADR-018 #4 "dependency도 유지" 부분 supersede.
- **ppt main 머지 보류** — 별도 branch에서 검증 후 IT 협의 일정과 맞춰 머지 결정.
- **layer B 진입 전제 변경** — registry 옵션 결정과 무관하게 packaging contract는 미리 확정 가능. ADR-018의 일부 결정은 본 trial로 앞당겨 닫음.

## 가설 검증

| 가설 | 검증 방법 | 결과 |
|---|---|---|
| H1: sandbox 검증만으로 layer B 진입 가능 | ppt에 install 시도 | ❌ 거짓 — packaging 버그 즉시 드러남 |
| H2: `workspace:*` 자동 변환이 충분 | tarball 내 package.json 검사 + host install | △ 부분 참 — 변환은 됨, 풀이는 환경 의존 |
| H3: design system 채택이 host 코드 단순화 | line count 측정 | ✅ 14줄 → 1줄, line 93% 감소 |
| H4: 토스 ⑤ 사이클을 손으로 돌릴 수 있다 | 이번 trial 7 전체 | ✅ 4-step(build/pack/install/import) 한 바퀴 완료 |

## 후속 작업 (미완)

- [ ] ADR-018 항목 #4에 ADR-019 supersede 마커 추가
- [ ] `docs/INSTALL.md` 갱신: host에서 `@wonik/tokens` 직접 install 필요 명시
- [ ] `docs/QUICKSTART.md` 갱신: 같은 반영
- [ ] root에 떨어진 `*.tgz` ignore (`.gitignore` 갱신)
- [ ] ppt에 추가 atom 적용(예: Switch — 자동 저장 토글, Checkbox — 옵션 메뉴) — 후속 trial 8 후보
