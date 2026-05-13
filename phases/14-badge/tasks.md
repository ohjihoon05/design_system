# Phase 14 — Badge (tasks.md)

> autopilot PHASE 4 (TASKS) 산출물.

---

## Step 0 — 준비 (디렉토리·index·Changeset·ADR outline)

| # | Task | 완료 기준 | 테스트 task | 보안 체크 |
|---|------|-----------|-------------|-----------|
| 0.1 | `phases/14-badge/` 디렉토리 생성 + index.json 초기화 (steps pending) | 디렉토리·파일 존재 | — | — |
| 0.2 | `.changeset/feat-badge.md` draft — `@wonik/web` minor bump | 파일 존재 + `@wonik/web` 명시 | — | — |
| 0.3 | ADR-016 outline `docs/ADR.md`에 추가 (제목 + Status + Context + Decision skeleton). 본문은 Step 5에서 finalize | grep "ADR-016" 통과 | — | — |
| 0.S1 | 보안 — Trial 4+5 evidence reference가 spec/plan에 명시 (vague 결정 금지) | spec §1, plan §2.3 모두 "Trial 4+5 누적 4회" 언급 | — | — |

**Step 0 통과**: 0.1·0.2·0.3 + 0.S1.

---

## Step 1 — TDD: types.ts + Badge.test.tsx (실패하는 테스트 먼저)

| # | Task | 완료 기준 | 테스트 task | 보안 체크 |
|---|------|-----------|-------------|-----------|
| 1.1 | `packages/web/src/Badge/types.ts` — `BadgeVariant`·`BadgeOwnProps`·`BadgeProps` 정의 | type export 존재 | — | — |
| 1.2 | `packages/web/src/Badge/Badge.test.tsx` — 7개 테스트 케이스 (plan §6.1) | 파일 존재, 7개 `it(...)` 블록 | 1.T1 | — |
| 1.T1 | `pnpm -F @wonik/web test --no-coverage Badge` 실행 — 7개 모두 fail (구현 부재) | 의도된 fail, error는 "Cannot find module" 또는 명확한 assertion fail | — | — |

**Step 1 통과**: 1.1·1.2 작성 + 1.T1 의도된 fail 확인.

---

## Step 2 — Badge.tsx 구현 (TDD green)

| # | Task | 완료 기준 | 테스트 task | 보안 체크 |
|---|------|-----------|-------------|-----------|
| 2.1 | `packages/web/src/Badge/Badge.tsx` — plan §4 스타일 매핑 그대로 구현 | 파일 존재, default export `Badge` | 2.T1 | S2.S1 |
| 2.2 | `packages/web/src/Badge/index.ts` — re-export Badge + types | re-export 라인 | — | — |
| 2.T1 | `pnpm -F @wonik/web test` — 7개 신규 + 177 기존 = 184 passing | 모두 green | — | — |
| 2.S1 | hex·px raw 0 검증 — `grep` | spec S3 통과 | — | — |

**Step 2 통과**: 2.1·2.2 + 2.T1·2.S1.

---

## Step 3 — Public export + 빌드

| # | Task | 완료 기준 | 테스트 task | 보안 체크 |
|---|------|-----------|-------------|-----------|
| 3.1 | `packages/web/src/index.ts`에 `export { Badge } from './Badge'` + type re-export 추가 | grep S2 통과 | 3.T1 | — |
| 3.2 | `pnpm -F @wonik/tokens build && pnpm -F @wonik/web build` | dist/ ESM+CJS+DTS 모두 정상 | 3.T2 | — |
| 3.T1 | `pnpm -F @wonik/web test` 재실행 — 회귀 0 | 184 passing | — | — |
| 3.T2 | tsc --noEmit (web 패키지) | 0 errors | — | — |

**Step 3 통과**: 3.1·3.2 + 3.T1·3.T2.

---

## Step 4 — Sandbox 매트릭스 + 캡쳐 + AI 시각 분석

| # | Task | 완료 기준 | 테스트 task | 보안 체크 |
|---|------|-----------|-------------|-----------|
| 4.1 | `apps/web-sandbox/` Badge 섹션 추가 — 2 variant × 4 컨텐츠(라벨/숫자/짧은/길이 다양) 매트릭스 | sandbox dev에서 노출 | — | — |
| 4.2 | `pnpm -F web-sandbox dev` 부팅 → headless Chrome 캡쳐 `pkg-out/phase-14-badge-matrix.png` | 파일 존재, PNG 헤더 정상 | 4.T1 | — |
| 4.3 | AI(Read tool) PNG 시각 분석 → spec S11·S12·S13 정성 판정 | step4.md에 판정 결과 명시 | — | — |
| 4.T1 | PNG sanity | file 명령 PNG 헤더 OK | — | — |

**Step 4 통과**: 4.1·4.2·4.3 + 4.T1.

---

## Step 5 — Finalize: ADR-016 + PRD + Changeset + closure

| # | Task | 완료 기준 | 테스트 task | 보안 체크 |
|---|------|-----------|-------------|-----------|
| 5.1 | `docs/ADR.md` ADR-016 본문 완성 — Status `Accepted`, Decision 본문, Trial 4+5 evidence 참조 | ADR-016 완성형 | 5.T1 | — |
| 5.2 | `docs/PRD.md` "1단계 진행 현황" Phase 14 행 추가 | grep S9 통과 | — | — |
| 5.3 | `.changeset/feat-badge.md` finalize — Badge 추가 minor bump 설명 | 파일 완성형 | — | — |
| 5.4 | `phases/14-badge/index.json` 모든 step `status: "completed"` + summary | 6 step 모두 completed | — | — |
| 5.5 | spec S1~S10 자동 grep 모두 통과 | 전부 ✅ | 5.T1 | — |
| 5.6 | commit 직전 diff 시각 검토 | 통과 | — | S5.S1 |
| 5.T1 | spec S1~S10 grep 자동 검증 스크립트 | 모두 통과 | — | — |
| 5.S1 | (보안 최종) commit 직전 diff — 비밀·하드코딩 색·R19-only 0 | 통과 | — | — |

**Step 5 통과 (= phase closure)**: 5.1~5.6 + 5.T1·5.S1.

---

## 의존성 그래프

```
Step 0 → Step 1 → Step 2 → Step 3 → Step 4 → Step 5
```

순차. Step 1 (TDD 실패 테스트) → Step 2 (green) 강제.

---

## 보안 task 별도 명시 (GATE 4)

- **0.S1** Trial 4+5 evidence reference 명시 (preemption·추측 도입 방지)
- **2.S1** hex·px raw 0 (CRITICAL — CLAUDE.md 토큰화 우회 차단)
- **5.S1** commit 직전 diff 시각 검토 (비밀·하드코딩·R19-only 0)

---

## 완료 기준 (전체 phase)

- 모든 Task 0.x ~ 5.x ✅
- 모든 Test task 0.T~5.T ✅
- 모든 Security task 0.S~5.S ✅
- spec §5 S1~S10 ✅
- 회귀 테스트 184 passing (177 기존 + 7 신규)
