# Step 4 — docs/dogfood-trial-5.md + phases/index.json 보정 + phase 닫기

## 작업 (실행 결과)

### 4.1 docs/dogfood-trial-5.md 작성

Trial 1~4 형식 답습 — 메타·적용·발견(매트릭스 8행)·결과·다음 phase 후보·산출물·절차 학습. spec S2·S3 grep 통과.

### 4.2 매트릭스 8행 삽입

spec §6 그대로. 각 행 "실제" 칸은 캡쳐 인용 형태로 채움 (vague 0).

### 4.3 다음 phase 후보 — Trial 4 + Trial 5 누적 ranking

- **우선순위 1**: Badge (누적 4회, 거의 확정)
- **우선순위 2**: Alert/Banner (2회), ToggleGroup (1회 H4 신규) — Trial 6 누적 후 결정
- **우선순위 3**: IconButton (Outline-local로 격하), Select·EmptyState (YAGNI), Card outline+dashed (Trial 6 검토)

### 4.4 phases/index.json 보정

- **phase 12 누락 entry 추가**: `{"dir": "12-card", "status": "completed", "completed_at": "2026-05-13T02:02:00+0900"}` (PR #10 머지 시점)
- **phase 13 entry 추가**: `{"dir": "13-trial-5-home", "status": "completed", "completed_at": "2026-05-13T14:25:00+0900"}`

### 4.5 결승선 S1~S10 자동 + 정성 검증

자동 (S1·S2·S3·S4·S5·S6·S7): 모두 ✅
정성 (S8·S9·S10): trial 문서 §발견·§H4에 명시 ✅

### 4.6 phases/13-trial-5-home/index.json 모든 step completed

step0~4 status `completed`로 변경, 각 summary 1줄.

### 4.7 commit 직전 diff 시각 검토

- design_system: phases/13-* + docs/dogfood-trial-5.md + pkg-out PNG 2장 + phases/index.json + pkg-out/*.tgz timestamp 갱신.
- 사용자 데이터·hex 리터럴·비밀 0.
- ppt: Home.tsx 컴포넌트 교체 + dev-only fixture 가드. main 머지 안 함.

## 통과 조건

- 4.1·4.2·4.3·4.4·4.5·4.6·4.7 ✅
- 4.T1 (S1~S7 grep) ✅
- 4.T2 (슬롭 anti-pattern 0) ✅
- 4.S1 (commit 직전 diff 시각 검토) ✅

## phase 13 closure

- Trial 5 dogfood 완료, Phase 09·10·11 closure 3회 재입증.
- needs ranking Trial 4 → Trial 5 누적 갱신 완료 — Phase 14 후보 Badge 거의 확정.
- ppt `trial-5-home` branch는 main 머지 안 함 (사용자 결정 영역).
