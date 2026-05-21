# Phase 17 — Distribution (tasks.md)

## Step 0 — 준비

- 0.1 `phases/17-distribution/index.json` 작성 (steps placeholder, status pending) — **완료기준**: 파일 존재
- 0.2 `.changeset/17-distribution.md` draft — `@wonik/tokens` + `@wonik/web` 둘 다 minor — **완료기준**: 파일 존재 + 두 패키지 명시
- 0.3 ADR-018 outline (`docs/ADR.md` 끝에 placeholder) — **완료기준**: `## ADR-018` 헤더 존재
- 0.S1 보안: 이미 commit된 token 없음 확인 (`grep -r "ghp_\|npm_" packages/ docs/ .changeset/`) — **완료기준**: 출력 0 line

## Step 1 — 두 package.json publish-ready 적용

- 1.1 `packages/tokens/package.json`: private 제거, version → `0.1.0`, description / repository / homepage / license / publishConfig.registry(placeholder) + publishConfig.access=restricted / sideEffects: `["**/*.css"]` / prepublishOnly — **완료기준**: 모든 필드 존재 (jq로 검증)
- 1.2 `packages/web/package.json`: 위와 동일 (sideEffects: false) + `peerDependencies`에 `@wonik/tokens: "^0.1.0"` 추가 — **완료기준**: 필드 존재 + peer 명시
- 1.T1 메타데이터 grep 검증: 두 파일 모두 `"version": "0.1.0"` + `"description"` + `"license"` + `"publishConfig"` 매치 — **완료기준**: 8개 매치 (필드 4개 × 패키지 2개)
- 1.S1 보안: 두 package.json에 `"private"` key 부재 확인 (실수로 publish 가능 의도) — **완료기준**: grep -c '"private"' = 0
- 1.S2 보안: publishConfig.registry가 명백한 placeholder (실수 publish 시 404 fail) — **완료기준**: registry URL에 "RESOLVE_BEFORE_PUBLISH" 포함

## Step 2 — install 가이드 + 보안 자료

- 2.1 `docs/INSTALL.md` 신설 — H1 1개 + H2 ≥4개 (인증 / install / import / cascade override) — **완료기준**: 파일 존재 + 헤더 카운트 충족
- 2.2 `.npmrc.example` 신설 — placeholder token, scope-registry 매핑 — **완료기준**: 파일 존재 + `<YOUR_TOKEN>` placeholder 포함
- 2.3 `.gitignore`에 `.npmrc` 추가 — **완료기준**: grep으로 entry 확인
- 2.4 ADR-018 본문 작성 — 3-옵션 비교표 + 권장안 + 거부된 대안 ≥2 + 결정 보류 — **완료기준**: ADR-018 섹션이 spec §5 S4 모든 요건 충족
- 2.S1 보안: `.npmrc.example`에 실제 token 없음 — **완료기준**: `ghp_` / `npm_` substring 0

## Step 3 — PRD 업데이트

- 3.1 `docs/PRD.md` "1단계 진행 현황" 표에 Phase 17 행 추가 — **완료기준**: `| 17 | distribution |` 형식 match
- 3.2 "layer A 1차 채움 종료 선언" 문장 추가 (Phase 17 행 다음에 코멘트 형태) — **완료기준**: "layer A 1차 채움 종료" 문자열 존재
- 3.3 "layer B 진입 — 본 phase는 publish-ready까지" 문장 추가 — **완료기준**: "layer B 진입" 문자열 존재

## Step 4 — 빌드 + dry-run report

- 4.1 `pnpm -F @wonik/tokens build` 실행 — **완료기준**: exit 0, `packages/tokens/dist/` 생성
- 4.2 `pnpm -F @wonik/web build` 실행 — **완료기준**: exit 0, `packages/web/dist/` 생성
- 4.3 `pnpm -F @wonik/web test` 실행 — **완료기준**: ≥198 passing
- 4.4 `pnpm -F @wonik/tokens publish --dry-run` 캡쳐 — **완료기준**: 출력 캡쳐 + dist/ 외 파일 없음 확인
- 4.5 `pnpm -F @wonik/web publish --dry-run` 캡쳐 — **완료기준**: 출력 캡쳐 + workspace:* → 실제 버전 변환 확인
- 4.6 `phases/17-distribution/dry-run-report.md` 작성 — 두 패키지 artifact 목록, 크기, resolved package.json — **완료기준**: 파일 존재 + spec §5 S6 3개 항목 (파일목록/크기/resolved json) 모두 포함

## Step 5 — Finalize

- 5.1 spec §5 S1~S12 self-check — **완료기준**: 12개 모두 ✅
- 5.2 ADR-018 cross-link 검증 (PRD ↔ ADR ↔ INSTALL.md) — **완료기준**: 양방향 reference 존재
- 5.3 `phases/index.json`에 17번 entry 추가 (completed) — **완료기준**: status=completed + completed_at 타임스탬프
- 5.4 `phases/17-distribution/index.json` 모든 step completed — **완료기준**: 6개 step 모두 status=completed
- 5.5 `phases/17-distribution/step0~5.md` 진행 기록 작성 — **완료기준**: 6개 파일 존재
- 5.S1 commit 직전 diff 시각 검토 — **완료기준**: 의도된 파일만 stage됨 (`.obsidian/`, `color_token/`, `.claude/scheduled_tasks.lock` 제외)

## 의존성 (순서)

```
Step 0 → 1 → 2 → 3 → 4 → 5
```

Step 0 보안(0.S1)이 가장 먼저. Step 1의 metadata 변경 → Step 2의 문서 → Step 3의 PRD → Step 4의 빌드/dry-run → Step 5의 finalize.

## 보안 task 요약 (별도 트랙)

- **0.S1** 기존 token leak 0 확인
- **1.S1** `private` key 부재로 publish-ready 명시
- **1.S2** placeholder registry URL로 실수 publish 방어
- **2.S1** `.npmrc.example`에 실제 token 0
- **5.S1** commit 직전 diff에 unintended 파일 0
