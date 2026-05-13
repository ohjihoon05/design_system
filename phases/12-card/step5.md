# Step 5 — ADR-015 finalize + PRD 업데이트 + closure

tasks.md §Step 5 의 1:1 풀어쓰기.

## 5.1 ADR-015 본문 완성
- 맥락: Trial 4 4 reps evidence 인용.
- 결정: API signature(variant·padding·as) + interfaceColors 의존 + module-scope CSS inject.
- 대안: Header/Body/Footer subcomp 거부 / shadow 토큰화 보류 / forwardRef 보류 / interactive Card 보류.
- 결과: hex/px 0, 14 tests, light/dark sandbox 매트릭스, ppt 호환 추측 가능.

## 5.2 docs/PRD.md 업데이트
- "1단계 진행 현황" 표에 Phase 12 행 추가.

## 5.3 spec S1–S10 자동 검증
- step5.md에 결과 표 inline.

## 5.4 phases/12-card/index.json closure
- 모든 step `status: "completed"`, `completed_at` 타임스탬프, `summary` 1줄.
- 최상위 `completed_at` 추가.

## 5.5 commit 직전 git diff 종합 검토
- 비밀·hex·deep import 노출 0.

## 통과 조건
- 5.T1 ADR.md markdown 파싱 OK
- 5.T2 S1–S10 표 inline
- 5.S1 최종 종합 검토 통과
