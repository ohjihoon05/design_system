# Phase 17 — Distribution (layer B 진입 준비)

## §1. 배경 / Why

Phase 01~16에서 layer A 1차 채움이 완료됐다. **14 atoms** (Button, Box, Stack, Text, Input, Textarea, Checkbox, Switch, Radio, Spinner, Skeleton, Card, Badge, Alert) × **ppt 3 페이지 dogfood** (Outline / Home / Presentation) × **interface variable cascade(ADR-010)** 입증.

다음 도달점은 PRD가 정의한 **layer B = 사내 패키지 배포**. 지금까지 dogfood는 `workspace:*` 또는 `file:`/`link:` 같은 *로컬 링크*로만 검증됐다 — 이는 "디자인 시스템이 작동한다"는 약한 증명이지, "사내 host product가 한 줄 `pnpm add`로 설치해 쓸 수 있다"는 진짜 layer B 증명이 아니다.

Phase 17의 목표는 **두 패키지(`@wonik/tokens`, `@wonik/web`)를 "publish-ready" 상태로 만들고 dry-run으로 검증**하는 것이다. 실제 첫 publish는 사내 npm registry / org 결정 후 별도 minor phase. 이 phase는 그 사이의 *모든 코드/메타데이터/문서 준비*를 끝낸다.

## §2. 사용자

- **1차 사용자**: 본인 (UI/UX 디자이너, 1인 운영자) — IT팀과 사내 npm registry 협의를 시작하기 전에 "기술적 준비"를 끝내 두는 단계. 협의 시 결정 옵션과 비용을 명확히 제시할 수 있어야 함.
- **2차 사용자**: 사내 SW팀 개발자들 (host product 측) — 결정된 registry로부터 `pnpm add @wonik/web`으로 설치, README의 install 가이드 1회 읽고 바로 import 가능해야 함.

## §3. 범위 (In-scope)

1. **두 패키지 publish-ready 메타데이터**
   - `packages/tokens/package.json` + `packages/web/package.json`: `private` 제거(또는 publish 허용 형태), `version`을 `0.1.0`으로 bump (atoms 1차 채움 신호), `description` / `repository` / `homepage` / `license` 필드 추가.
   - `publishConfig` 명시: registry URL은 *명확한 placeholder*로 두되 (사내 IT 결정 전), `access`는 `restricted`로 고정.
   - `files` 필드 검증: `dist`만 publish, source는 제외.
   - `sideEffects` 명시 (tree-shaking 최적화): `tokens`는 `["**/*.css"]`, `web`은 `false`.

2. **`@wonik/web`의 `peerDependencies`에 `@wonik/tokens` 추가** (이미 dependency지만 호환성 명확화)
   - host product가 직접 `@wonik/tokens`를 install할 수 있도록 peer로 노출. 단, dependency 그대로 두면 host가 안 install해도 작동 — peer 추가는 *명시적 contract*만 강화.
   - 결정: dependency 유지 + peer로 *중복* 선언 (npm/pnpm은 dependency 우선, peer는 *문서 효과*).

3. **publish 가드** (사고 방지)
   - `prepublishOnly` script: build + test가 통과해야만 publish 가능. tokens/web 양쪽 모두.
   - root `package.json`의 `publish-packages` 스크립트는 그대로 (`changeset publish` 활용).

4. **사내 host product 측 install 가이드** (`docs/INSTALL.md` 신규)
   - npm registry 인증 방법 (예: `.npmrc` token 설정)
   - 한 줄 install 명령 + 기본 import 예제 (Button + tokens CSS)
   - host product 측 cascade override 예제 (ADR-010 재사용)
   - "사내 registry는 IT 결정 후 URL 업데이트 예정" 명시

5. **ADR-018 — layer B 진입 + registry 옵션 비교**
   - 3가지 옵션 비교 (사내 npm registry / GitHub Packages / tarball-via-release)
   - 권장 1순위 + 2순위 fallback
   - 첫 publish 전에 결정해야 할 항목 목록 (org/scope 이름, token 발급, CI 자동화 시점)
   - **결정 자체는 본 phase에서 닫지 않음** — 사내 IT 협의 결과에 따라 ADR-018의 "결정" 섹션을 후속 minor phase가 채움.

6. **PRD.md 업데이트**
   - "1단계 진행 현황" 표에 Phase 17 행 추가.
   - "layer A 1차 채움 종료 선언" 명시 (14 atoms × 3 페이지 dogfood × cascade 입증 = 충분).
   - "layer B 진입 — 본 phase는 publish-ready까지, 실제 첫 publish는 IT 협의 후 별도 phase" 명시.

7. **publish dry-run 검증**
   - `pnpm -F @wonik/tokens publish --dry-run`, `pnpm -F @wonik/web publish --dry-run` (또는 `npm pack --dry-run`) 으로 artifact 내용 확인.
   - 산출물: 파일 목록 + 크기 + `package.json` resolved version (workspace:* → 실제 버전 변환).
   - 결과를 `phases/17-distribution/dry-run-report.md`에 기록.

8. **Changeset 항목**
   - `.changeset/17-distribution.md` — `@wonik/tokens` + `@wonik/web` 둘 다 `minor` bump (0.0.0 → 0.1.0). 이유는 "layer A 1차 채움 도달 + publish-ready transition".

## §4. 범위 외 (Out-of-scope)

- **실제 첫 publish 실행** — 사내 IT/Org 결정 후 별도 phase(18 또는 19). 본 phase는 publish-ready 상태까지만.
- **사내 npm registry 인프라 셋업** (Verdaccio 호스팅, GitHub Packages org 생성 등) — IT팀 범위.
- **CI 자동 publish workflow** (GitHub Actions changeset/action) — 첫 manual publish 성공 후 검토. 1단계 본 phase는 manual + 문서가 default.
- **provenance / SBOM / package signing** — pre-1.0 단계는 과한 인프라. 1.0.0 이후 검토.
- **`arethetypeswrong` / `publint` 등 publish 품질 검증 도구** — `npm pack --dry-run` + 수동 확인으로 충분. 자동화는 후속.
- **컴포넌트 추가/변경** — Phase 17은 *배포 인프라 phase*. layer A는 1차 종료. 컴포넌트는 layer B 안정화 후 layer A의 2차 채움으로.
- **`packages/tokens` README, `packages/web` README** 별도 신설 — 1단계는 root `README.md` + `docs/INSTALL.md` 한 군데로 통합.

## §5. 성공 기준 (결승선 — 측정 가능)

S1. **publish-ready 메타데이터** — 두 패키지 `package.json` 모두에 `description` / `repository` / `homepage` / `license` / `version: 0.1.0` / `publishConfig.access` / `files` / `sideEffects` 필드 존재. `private: true`는 두 패키지에서 제거.

S2. **publish 가드 active** — 두 패키지 `package.json`에 `prepublishOnly`가 build + test를 실행한다.

S3. **`docs/INSTALL.md` 신설** — 4개 섹션 이상 (인증 / install 명령 / import 예제 / cascade override 예제) 포함. `# `으로 시작하는 H1 1개, `## `로 시작하는 H2 ≥4개.

S4. **ADR-018 신설** — 3가지 registry 옵션 비교표 + 권장안 + 거부된 대안 ≥2개 + "결정 보류 항목" 섹션 포함.

S5. **PRD.md 업데이트** — Phase 17 행 추가 + "layer A 1차 채움 종료 선언" 문장 명시 + "layer B 진입" 문장 명시.

S6. **dry-run report 생성** — `phases/17-distribution/dry-run-report.md` 존재. tokens + web 각각에 대해 (a) artifact 파일 목록 (b) 크기 (c) resolved `package.json` 내용 (workspace:* 변환 확인) 포함.

S7. **빌드 + 테스트 무결성** — `pnpm build` 성공, `pnpm test` ≥198 passing (Phase 16 시점 198 그대로 유지; 본 phase는 컴포넌트 변경 없음).

S8. **Changeset 추가** — `.changeset/17-distribution.md` 양쪽 패키지 `minor` bump 명시.

S9. **AI 슬롭 0** — 문서에 글래스모피즘/gradient text/장식용 emoji 추가 없음. ADR-018의 표는 표준 markdown table.

S10. **하드코드 hex / px raw 0** — 본 phase는 컴포넌트 변경 없음. 토큰 위반 0건 (`grep "#[0-9a-fA-F]\{6\}" packages/*/src` = 변경 없음).

S11. **`docs/INSTALL.md`의 install 명령이 실제로 동작 가능한 형태** — `pnpm add @wonik/web @wonik/tokens` 같은 *실행 가능 명령*이 명시. placeholder registry URL은 *명확히 placeholder임을 표기* (`<사내-registry-URL>`).

S12. **scope 이름 결정 보류 명시** — ADR-018에 "`@wonik` scope를 GitHub Packages에서 쓰려면 GitHub org 필요, 사내 npm registry는 scope 제약 없음 — IT 협의 후 결정" 명시.

## §6. 위험 (Risks)

R1. **package.json `private: true` 제거로 실수 publish 가능성** — mitigation: `prepublishOnly` + `publishConfig.registry`를 *유효하지 않은 placeholder URL*로 설정해두면 실수로 publish 시도해도 실패. 대안은 `private` 유지 후 `--access public` flag로만 임시 풀기. 본 phase는 *placeholder registry URL* 방식 채택 — publish-ready를 진짜로 입증하고 싶기 때문.

R2. **workspace:* 의존성이 publish artifact에 그대로 남을 위험** — mitigation: `changeset publish`가 자동으로 실제 버전으로 변환한다. dry-run report에서 이를 명시적으로 확인.

R3. **scope 이름 충돌** — `@wonik`이 npm public registry에 이미 squat돼있을 가능성. mitigation: 사내 registry만 쓸 거면 무관 (사내 namespace). 만약 public npm으로 발행한다면 `@wonik-ips` 같은 대안 필요. ADR-018의 결정 보류 항목으로 포함.

R4. **license `UNLICENSED`로 인한 호스트 install 실패** — 일부 도구가 `UNLICENSED` 패키지를 warning. mitigation: `private: true`이거나 `publishConfig.access: restricted`면 영향 없음. host product가 install 가능.

## §7. 의존성 / 외부

- **Changesets** (이미 설치) — version + publish 자동화에 활용.
- **pnpm@10.33.2** (이미 설치) — workspace 의존성 처리.
- **tsup** (이미 설치) — 빌드 도구. 본 phase는 빌드 설정 변경 없음.
- **외부 의존성 추가 없음** — pure config + 문서 phase.

## §8. 보안 검토

- **publish 가드** — `prepublishOnly` build/test로 broken artifact publish 방지 (§5 S2).
- **placeholder registry URL** — 실수 publish 방어 (§6 R1).
- **`files: ["dist"]`** — source / test / config 파일은 publish artifact에서 제외 (이미 적용돼있지만 phase 17에서 재확인).
- **`license: "UNLICENSED"`** — 사내 전용임을 명시. 외부 무단 사용 방지.
- **`.npmrc.example`** — 진짜 token을 commit하지 않도록 example만 제공. `.gitignore`에 `.npmrc` 추가.

## §9. 테스트 전략

- **메타데이터 검증** — `pnpm build && pnpm test` 통과 + 두 패키지의 `package.json`을 jq/grep으로 검증 (필드 존재 확인).
- **dry-run 검증** — `pnpm publish --dry-run` 결과를 dry-run report에 캡쳐. 다음 항목 확인:
  1. publish artifact에 `dist/` 외 파일이 들어가지 않는다.
  2. `workspace:*` 표기가 실제 버전(`^0.1.0` 또는 `0.1.0`)으로 변환됐다.
  3. resolved `package.json`에 publishConfig가 올바로 반영됐다.
- **빌드 무결성** — Phase 16 시점 테스트 ≥198개 모두 통과 (본 phase는 컴포넌트 unchanged).
