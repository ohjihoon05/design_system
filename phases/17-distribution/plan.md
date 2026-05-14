# Phase 17 — Distribution (plan.md)

## §1. 기술 결정 ("왜")

### D1. publish-ready vs. 실제 publish 분리
**결정**: 본 phase는 "publish-ready 상태"까지만. 실제 첫 publish는 별도 phase.
**왜**: 사내 npm registry / GitHub Packages org 결정은 IT팀 협의 필요 — 본인 1인 결정 불가. 코드/메타데이터 준비를 끝내 두면, 협의 진행 중 동시에 host product README/사용 가이드를 사내 SW팀과 review 가능. layer B의 *기술적* 80%는 본 phase가 잡는다.

### D2. `private: true` 제거 + placeholder registry URL
**결정**: 두 패키지의 `private: true` 제거 + `publishConfig.registry`를 placeholder (`https://npm.pkg.github.com/<RESOLVE_BEFORE_PUBLISH>`)로 설정.
**왜**: `private: true`를 유지하면 dry-run조차 막혀서 publish-ready를 진짜로 입증할 수 없음 (`npm pack --dry-run`은 동작하지만 `publish --dry-run`은 `private: true`에서 fail). placeholder URL은 실수 publish를 *404 즉시 fail*로 막아 R1 방어.
**대안 1 (거부)**: `private: true` 유지 + `--access public` 임시 풀기 — flag 빼먹으면 동작 변함, 일관성 부족.
**대안 2 (거부)**: 실제 registry URL을 결정 후에만 `private` 해제 — 본 phase의 핵심 목적(publish-ready 입증)을 미루는 셈.

### D3. `publishConfig.access: "restricted"`
**결정**: 두 패키지 모두 `restricted`. `.changeset/config.json`과 일치.
**왜**: 사내 전용. public 노출 사고 방지. `restricted`는 npm/GitHub Packages 양쪽에서 표준 키.

### D4. peer + dependency 이중 선언
**결정**: `@wonik/web`은 `@wonik/tokens`를 `dependencies` + `peerDependencies` 양쪽에 선언.
**왜**: dependency 단독이면 host가 `@wonik/tokens`를 직접 install 안 해도 동작 — 하지만 host가 token CSS를 import하려면(`@wonik/tokens/tokens.css`) 명시적 install이 필요. peer 추가는 그 *명시적 contract*. 중복 선언으로 인한 install 사고는 npm/pnpm이 dependency 우선 처리하므로 0.
**대안 (거부)**: peer만 두고 dependency 제거 — host가 install 누락 시 web이 작동 안 함. 학습 곡선 ↑.

### D5. prepublishOnly = build + test
**결정**: 두 패키지에 `"prepublishOnly": "pnpm build && pnpm test"`.
**왜**: 가장 단순하고 강력한 publish guard. 코드 깨진 채로 publish 불가능. `npm publish` / `pnpm publish` 양쪽이 표준으로 hook 실행.

### D6. `files: ["dist"]` 재확인
**결정**: 두 패키지 모두 이미 `files: ["dist"]`. 본 phase에서 변경 없음.
**왜**: source / test / config 누출 방지는 이미 적용. 검증만 (dry-run report에서).

### D7. `sideEffects` 선언
**결정**: `@wonik/tokens` → `"sideEffects": ["**/*.css"]` (CSS는 side-effect), `@wonik/web` → `"sideEffects": false` (pure React 컴포넌트).
**왜**: bundler tree-shaking 최적화. host product의 bundle 크기 ↓. ADR-011 module-scope CSS 1회-inject 패턴은 *함수 호출 side-effect*라 컴포넌트 import 시 트리거 — `sideEffects: false`여도 작동 (호출되는 함수 안의 side-effect는 tree-shaking 영향 받지 않음).

### D8. ADR-018 결정 보류 명시
**결정**: ADR-018은 3가지 옵션을 비교하되, "결정" 섹션은 *비워두지 않고 "결정 보류: IT 협의 후 후속 phase에서 확정"* 명시.
**왜**: ADR은 *결정 기록*이어야 함 — 비워두면 ADR의 정의 위반. "결정 보류"를 *명시적 결정*으로 기록.

### D9. `docs/INSTALL.md` 위치
**결정**: `docs/` 폴더에 신설. `packages/*/README.md` 신설 안 함.
**왜**: 1단계는 단일 install 가이드로 충분. 패키지별 README는 layer B 안정화 후 layer A 2차 채움 단계에서.

### D10. `.gitignore` + `.npmrc.example`
**결정**: `.gitignore`에 `.npmrc` 추가, `.npmrc.example`을 commit (placeholder token).
**왜**: 실제 token이 history에 남는 사고 방지. example 파일만 commit해서 host product가 "이 형태로 만들어 token만 채우면 된다" 알 수 있게.

## §2. 의존성

- **외부 추가 0** — pure config/문서 phase.
- **기존 도구**: Changesets, pnpm, tsup, vitest. 모두 이미 설치/구성됨.

## §3. 변경 파일 (예상)

```
packages/tokens/package.json       (수정: private/version/description/repository/homepage/license/publishConfig/sideEffects/prepublishOnly)
packages/web/package.json          (수정: 위와 동일 + peer @wonik/tokens)
docs/ADR.md                        (수정: ADR-018 추가)
docs/PRD.md                        (수정: Phase 17 행 + layer A 종료 선언 + layer B 진입)
docs/INSTALL.md                    (신설)
.npmrc.example                     (신설)
.gitignore                         (수정: .npmrc 추가)
.changeset/17-distribution.md      (신설)
phases/17-distribution/spec.md     (이미 작성)
phases/17-distribution/plan.md     (본 파일)
phases/17-distribution/tasks.md    (다음 step)
phases/17-distribution/step0~5.md  (autopilot 진행 기록)
phases/17-distribution/dry-run-report.md  (Step 4)
phases/17-distribution/index.json  (autopilot 진행 추적)
phases/index.json                  (수정: 17번 entry 추가)
```

## §4. 위험 (spec §6 보강)

- **R1** publish 사고 — D2 placeholder URL + D5 prepublishOnly로 이중 방어
- **R2** workspace:* 미변환 — Step 4 dry-run report에서 명시적 확인
- **R3** scope 충돌 — ADR-018 결정 보류 항목
- **R4** license 경고 — `UNLICENSED` 표준 SPDX, 사내라 문제 없음
- **R5 (신규)** spec §5 S7 "≥198 passing"이 본 phase에서 깨질 가능성 — 컴포넌트 변경 없으므로 0. self-test에서 재확인

## §5. 테스트 전략

| 항목 | 방법 | 통과 기준 |
|---|---|---|
| 기존 테스트 무결성 | `pnpm -F @wonik/web test` | ≥198 passing |
| 빌드 무결성 | `pnpm build` | 두 패키지 exit 0 |
| publish artifact 검증 | `pnpm -F @wonik/tokens publish --dry-run` + `pnpm -F @wonik/web publish --dry-run` | (1) dist 외 파일 없음 (2) workspace:* 변환 (3) publishConfig 반영 |
| 메타데이터 필드 존재 | jq/grep으로 package.json 필드 확인 | description/repository/homepage/license/version/publishConfig/sideEffects 모두 존재 |
| prepublishOnly hook 동작 | publish dry-run 실행 시 prepublishOnly 트리거 확인 (또는 직접 호출) | hook 명시되어 있고 실행 시 build/test 실행 |
| 문서 형식 | INSTALL.md H1 1개 + H2 ≥4개 (§5 S3) | grep으로 검증 |

## §6. 진행 단계 요약

- **Step 0** — phases/17-distribution/ index.json + changeset draft
- **Step 1** — 두 package.json publish-ready 메타데이터 적용
- **Step 2** — INSTALL.md + .npmrc.example + .gitignore + ADR-018 작성
- **Step 3** — PRD.md Phase 17 행 + layer A 종료 선언
- **Step 4** — dry-run report 캡쳐 + 검증
- **Step 5** — Finalize (자체 검증, S1~S12 체크, 커밋 직전 diff 검토)
