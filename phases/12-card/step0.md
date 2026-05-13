# Step 0 — ADR-015 draft + phase 초기화

tasks.md §Step 0 의 1:1 풀어쓰기.

## 0.1 phases/12-card/index.json 생성
- 6 step (0~5) 모두 `status: "pending"` 으로 초기화.
- 완료 후 step별로 `status: "completed"` + `summary` 1줄로 closure.

## 0.2 step{0..5}.md skeleton 생성
- step0~step5 모두 1차 작성. 본 Step 0 = 자기 자신.
- step1~5는 tasks.md §해당 step의 풀어쓰기.

## 0.3 docs/ADR.md ADR-015 draft 추가
- 위치: ADR-014 다음.
- 본문 골격: 맥락(Trial 4 4 reps evidence) / 결정(API signature) / 대안(거부한 옵션) / 결과(cascade·hex·px 0).
- finalize는 Step 5에서.

## 0.4 .changeset/12-card.md 생성
- frontmatter: `"@wonik/web": minor`.
- 본문: "Add Card component — surface/elevated × none/sm/md/lg, interfaceColors cascade, no Header/Body/Footer subcomp (YAGNI), light-only boxShadow."

## 통과 조건
- 0.T1 JSON parse OK
- 0.T2 ADR.md 안 ADR-015가 ADR-014 다음 라인
- 0.T3 `pnpm changeset status` exit 0
- 0.S1 ADR/Changeset draft에 비밀·실고객명·내부 URL 0
