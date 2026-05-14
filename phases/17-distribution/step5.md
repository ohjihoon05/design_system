# Step 5 — Finalize

## spec §5 결승선 self-check

| 기준 | 결과 |
|---|---|
| S1 메타데이터 필드 (description/repository/homepage/license/version 0.1.0/publishConfig.access/files/sideEffects) × 2 패키지 | ✅ |
| S2 prepublishOnly = build + test | ✅ |
| S3 INSTALL.md H1 1개 + H2 ≥4개 | ✅ (H2 5개) |
| S4 ADR-018 3-옵션 비교 + 권장안 + 거부된 대안 ≥2 + 결정 보류 | ✅ (거부 대안 4개) |
| S5 PRD Phase 17 행 + "layer A 1차 채움 종료" + "layer B 진입" | ✅ |
| S6 dry-run report (파일목록/크기/resolved package.json) × 2 | ✅ |
| S7 빌드 성공 + ≥198 passing | ✅ (198/198) |
| S8 .changeset/17-distribution.md (양쪽 minor) | ✅ |
| S9 AI 슬롭 0 (글래스모피즘/gradient text/장식 emoji 없음) | ✅ |
| S10 hardcode hex/raw px 0 (컴포넌트 변경 없음) | ✅ |
| S11 INSTALL.md install 명령 실행 가능 형태 (`pnpm add @wonik/web @wonik/tokens`) | ✅ |
| S12 ADR-018에 scope 결정 보류 명시 | ✅ |

## phases/index.json
- 17-distribution entry 추가 status=completed ✅

## phases/17-distribution/index.json
- 6개 step 모두 completed ✅

## 5.S1 commit 직전 diff 시각 검토
- 의도된 파일: packages/{tokens,web}/package.json, docs/{ADR,PRD,INSTALL}.md, .gitignore, .npmrc.example, .changeset/17-distribution.md, phases/17-distribution/{spec,plan,tasks,step0~5,dry-run-report}.md + index.json, phases/index.json
- 제외 의도: .obsidian/*, color_token/, .claude/scheduled_tasks.lock — git add 시 명시적 path만 add

## phase closure
Phase 17 완료. **layer A 1차 채움 종료 선언 + layer B 진입 (publish-ready)**. 다음 phase는 사내 IT 협의 후 첫 publish.
