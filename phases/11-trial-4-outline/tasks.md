# Phase 11 — Trial 4 (tasks.md)

> autopilot PHASE 4 (TASKS) 산출물. plan §7의 5단계를 의존성 순서로 task 분해. 각 task = 완료 기준 + 테스트 + 보안 체크.

각 task는 step0.md~step4.md에 풀어 쓴다 (tasks.md는 *목록*, step{N}.md는 *실행 가이드*).

---

## Step 0 — 사전 준비 + fixture 결정

| # | Task | 완료 기준 | 테스트 task | 보안 체크 |
|---|------|-----------|-------------|-----------|
| 0.1 | design_system 빌드 + tgz pack | `pkg-out/wonik-tokens-*.tgz`, `wonik-web-*.tgz` 새 timestamp로 존재 | 0.T1 | — |
| 0.2 | ppt 측 reinstall (file: protocol) | `pnpm --dir C:/Users/ohjih/ppt/frontend list @wonik/web` 가 새 버전 / file: 경로 가리킴 | 0.T2 | — |
| 0.3 | ppt branch `trial-4-outline` 체크아웃 (없으면 main에서 분기) | `git -C C:/Users/ohjih/ppt branch --show-current` == `trial-4-outline` | — | S0.S1 ppt main 위 직접 작업 금지 |
| 0.4 | fixture 방식 결정 (zero-mock 1순위 / store seed 2순위) | step0.md에 "선택: 1순위 / 2순위", 사유 1줄 명시 | — | S0.S2 더미 outline 내용이 사용자/회사 비밀 0 |
| 0.T1 | 빌드 산출물 sanity (dist 존재) | `test -d packages/web/dist && test -d packages/tokens/dist` | — | — |
| 0.T2 | ppt에서 `import { Button, Spinner, Input } from "@wonik/web"` resolve | `pnpm --dir C:/Users/ohjih/ppt/frontend exec tsc --noEmit` 또는 dev server boot 성공 | — | — |
| 0.S1 | (보안) ppt main 위 작업 방지 | 0.3 이전 `git -C C:/Users/ohjih/ppt status` clean 확인 + branch 분기 | — | — |
| 0.S2 | (보안) 더미 outline 텍스트 사전 검증 | step0.md에 더미 텍스트 3개 명시 ("AI 트렌드"/"도입 사례"/"결론"). 회사명·실고객명 0 | — | — |

**Step 0 통과 조건**: 0.1, 0.2, 0.3, 0.4 모두 완료 + 0.T1·0.T2·0.S1·0.S2 통과.

---

## Step 1 — Outline.tsx 교체 (Spinner + 일반 Button ×3)

| # | Task | 완료 기준 | 테스트 task | 보안 체크 |
|---|------|-----------|-------------|-----------|
| 1.1 | Outline.tsx 자체 Spinner 함수(line 20–43) 제거 | grep으로 함수 자취 0 | 1.T1 | — |
| 1.2 | `import { Spinner, Button } from "@wonik/web"` 추가 | 해당 import 라인 존재 | 1.T1 | — |
| 1.3 | Spinner 사용 3곳(loading wrapper / generation wrapper / error 분기 외) → `<Spinner>` | ppt-Spinner 호출 0 | 1.T1 | — |
| 1.4 | "다시 시도" `<button>` → `<Button>` (variant·size 결정 후 step1.md 명시) | 시각도 className 0 (layout className만 유지) | 1.T2 | S1.S1 className에 hex 리터럴 0 |
| 1.5 | "승인하고 생성 시작" `<button>` → `<Button>` (disabled 동작 보존) | disabled prop 동작 보존 | 1.T2 | — |
| 1.6 | "+ 슬라이드 추가" `<button>` → `<Button>` | 시각도 보정 0 | 1.T2 | — |
| 1.T1 | ppt dev server 부팅 + Outline.tsx 페이지 도달 | error 0, console error 0 | — | — |
| 1.T2 | tsc --noEmit 통과 | 0 errors | — | — |
| 1.S1 | (보안) hex/raw 색 리터럴 ppt 신규 코드에 0 | `git -C C:/Users/ohjih/ppt diff` 에서 `#[0-9a-fA-F]{6}` 0 (기존 라인 외) | — | — |

**Step 1 통과 조건**: 1.1~1.6 완료 + 1.T1·1.T2·1.S1 통과.

---

## Step 2 — OutlineCard.tsx 교체 (Input + icon-only Button ×3)

| # | Task | 완료 기준 | 테스트 task | 보안 체크 |
|---|------|-----------|-------------|-----------|
| 2.1 | `import { Button, Input } from "@wonik/web"` 추가 | import 라인 존재 | 2.T1 | — |
| 2.2 | 인라인 편집 `<input type="text">` (line 72–80) → `<Input>`. autoFocus·onBlur·onKeyDown·value·onChange 동작 보존 | Enter 저장·Escape 취소·blur 저장 동작 그대로 | 2.T2 | — |
| 2.3 | 위/아래/삭제 icon-only `<button>` ×3 → `<Button size="sm" aria-label="...">` + svg children | aria-label 보존 (스크린리더 회귀 0), disabled 동작 보존 | 2.T2 | S2.S1 aria-label 보존 |
| 2.4 | (관찰만) icon-only Button 시각 적합도 첫 인상 step2.md에 1줄 메모 | step2.md "icon-only 첫 인상: 자연스러움 / 어색" 1줄 | — | — |
| 2.T1 | tsc --noEmit 통과 | 0 errors | — | — |
| 2.T2 | OutlineCard 인라인 편집 동작 manual smoke (Enter·Escape·blur) | 3개 키 모두 정상 동작 | — | — |
| 2.S1 | (보안/접근성) aria-label·role 회귀 0 | 위/아래/삭제 button의 aria-label 그대로 | — | — |

**Step 2 통과 조건**: 2.1~2.4 완료 + 2.T1·2.T2·2.S1 통과.

---

## Step 3 — 캡쳐 + AI 시각 분석 + 매트릭스 채움

| # | Task | 완료 기준 | 테스트 task | 보안 체크 |
|---|------|-----------|-------------|-----------|
| 3.1 | 더미 outline 3개 fixture 주입 (Step 0.4 결정 방식대로) | 페이지 로드 시 3개 카드 보임 | 3.T1 | S3.S1 |
| 3.2 | Headless Chrome으로 loading state 캡쳐 → `pkg-out/trial-4-outline-loading.png` | 파일 존재 + 크기 > 0 | 3.T2 | — |
| 3.3 | edit state 캡쳐 → `pkg-out/trial-4-outline-edit.png` | 파일 존재 + 더미 outline 3개 보임 | 3.T2 | — |
| 3.4 | AI(Read tool)가 두 PNG 직접 읽고 spec §6 매트릭스 8행 채움 | 표 8행 모두 "실제" 칸 비어 있지 않음 | — | — |
| 3.5 | 매트릭스 결론으로 H2/H3 각각 ✅/❌/부분 판정 | 판정 근거가 캡쳐 인용 형태 (vague 금지) | — | — |
| 3.T1 | fixture 정직성 — 실제 backend 동작과 동일한 화면 흐름 | 매뉴얼 비교 (1순위 fixture 시 자동) | — | — |
| 3.T2 | PNG 파일 sanity (열어서 손상 0) | `file pkg-out/trial-4-outline-*.png` PNG 헤더 확인 | — | — |
| 3.S1 | (보안) 캡쳐 PNG에 사용자 데이터 0 — 더미만 보임 | PNG 시각 검사 시 회사명·실데이터 0 | — | — |

**Step 3 통과 조건**: 3.1~3.5 완료 + 3.T1·3.T2·3.S1 통과.

---

## Step 4 — docs/dogfood-trial-4.md 작성 + needs 우선순위 + phase 닫기

| # | Task | 완료 기준 | 테스트 task | 보안 체크 |
|---|------|-----------|-------------|-----------|
| 4.1 | docs/dogfood-trial-4.md 신규 — Trial 1·2·3 형식(메타·적용·발견·결과·다음 phase) | spec S2·S3 grep 통과 | 4.T1 | — |
| 4.2 | §발견에 spec §6 매트릭스 8행 그대로 삽입 | 표 존재 | 4.T1 | — |
| 4.3 | §다음 phase 후보에 needs 우선순위 1·2·3 명시 (반복 횟수·사용 사례 evidence) | spec S4 grep 통과, vague 0 | — | — |
| 4.4 | spec §7 결승선 8개(S1·S2·S3·S4·S5·S6·S7·S8·S9) 모두 ✅ 확인 | 9개 항목 모두 통과 | 4.T2 | — |
| 4.5 | `phases/11-trial-4-outline/index.json` 모든 step `status: "completed"` + summary 1줄 | 5개 step 완료 처리 | — | — |
| 4.6 | (선택) PNG 캡쳐 commit 여부 결정 — 사용자 confirm | 더미만 있음 확인 후 commit | — | S4.S1 |
| 4.T1 | spec S1~S9 grep 자동 검증 스크립트 실행 | 모두 ✅ | — | — |
| 4.T2 | trial 문서 안에 AI 슬롭 anti-pattern 0 (S5) | S5 grep 0 hit | — | — |
| 4.S1 | (보안 최종) commit 직전 git diff 시각 검토 — 비밀 토큰·사용자 데이터 0 | 검토 통과 | — | — |

**Step 4 통과 조건 (= phase closure)**: 4.1~4.6 완료 + 4.T1·4.T2·4.S1 통과 + 사용자 confirm.

---

## 의존성 그래프

```
Step 0 (사전 준비)
   └─→ Step 1 (Outline.tsx 교체)
          └─→ Step 2 (OutlineCard.tsx 교체)
                 └─→ Step 3 (캡쳐 + 분석)
                        └─→ Step 4 (문서 + 닫기)
```

순차 실행. 병렬 0 — 캡쳐는 교체가 끝나야, 분석은 캡쳐가 있어야, 문서는 분석이 있어야.

---

## 보안 task 별도 명시 (GATE 4 항목)

본 trial은 인증/권한/SQL/API 보안 영역 0 — design system dogfood 성격. 그러나 *해당 trial 맥락의 보안 체크*는 다음 5개 task로 분리됨:

- **0.S1** ppt main 위 직접 작업 방지 (사용자 product 회귀 차단)
- **0.S2** 더미 텍스트가 비밀 0
- **1.S1** 신규 코드에 hex 리터럴 0 (CLAUDE.md CRITICAL — 토큰화 우회 차단)
- **2.S1** aria-label·role 보존 (접근성 회귀 0)
- **3.S1** 캡쳐 PNG에 사용자 데이터 0
- **4.S1** commit 직전 diff 시각 검토

---

## 완료 기준 (전체 phase)

- 모든 Task 1.x ~ 4.x ✅
- 모든 Test task 0.T1 ~ 4.T2 ✅
- 모든 Security task 0.S1 ~ 4.S1 ✅
- spec §5 S1~S9 ✅
- 사용자가 needs 우선순위 1·2·3에 confirm
