# Phase 15 — Trial 6 (tasks.md)

> autopilot PHASE 4 산출물.

## Step 0 — 준비

| # | Task | 완료 기준 | 보안 |
|---|------|---|---|
| 0.1 | design_system tokens+web 빌드 + tgz pack (Trial 5/phase 14 후 최신) | pkg-out tgz 최신 | — |
| 0.2 | ppt frontend reinstall (Trial 5 잔재 stash) | install 통과 | S0.S1 main 위 작업 금지 |
| 0.3 | trial-6-presentation branch (main에서 분기) | branch 활성 | — |
| 0.4 | Presentation.tsx R19-only API grep | 0 매칭 | — |
| 0.5 | spec §3 8개 매핑 line 재확인 | step0.md 명시 | — |

## Step 1 — Presentation.tsx 교체 part 1 (Spinner + Card + Badge)

| # | Task | 완료 기준 | 보안 |
|---|------|---|---|
| 1.1 | `import { Spinner, Button, Card, Badge } from "@wonik/web"` 추가 | import 라인 | — |
| 1.2 | local `function Spinner({className})` 제거 + 사용 4곳 모두 `<Spinner>` | local def 0, hex 0 | S1.S1 |
| 1.3 | generation placeholder `<div rounded-xl border ...>` (line 514) → `<Card variant="surface" padding="lg">` | inline color/border 0 | — |
| 1.4 | slide layout label `<span px-2 py-0.5 rounded bg-surface border-border>` (line 729) → **`<Badge variant="neutral">`** (Trial 6 첫 Badge dogfood) | inline padding/border/bg 0 | — |
| 1.T1 | tsc --noEmit | 0 errors | — |
| 1.S1 | git diff hex 0 | 통과 | — |

## Step 2 — Presentation.tsx 교체 part 2 (Buttons + 메모)

| # | Task | 완료 기준 | 보안 |
|---|------|---|---|
| 2.1 | slide nav prev/next (line 735/745) → `<Button variant="text" size="sm" aria-label>` + svg child | aria-label 보존 | S2.S1 |
| 2.2 | slide thumbnail delete (line 142) → `<Button variant="danger" size="sm" aria-label>` + "x" child | aria-label 보존 | — |
| 2.3 | PPTX download (line 568) → `<Button variant="primary" size="sm">` + icon child | 시각도 inline 0 | — |
| 2.4 | "+ 슬라이드 추가" dashed button (line 687): **그대로 유지** + step2.md 메모 "Trial 4 격하 reaffirm Trial 6 1회 등장" | step2.md 메모 | — |
| 2.5 | Error alert (line 484): **그대로 유지** + step2.md "Alert needs 3회째 evidence (Trial 4 inconclusive + Trial 5 1 + Trial 6 1)" | step2.md 메모 | — |
| 2.6 | step2.md "IconButton 부활 측정 첫 인상" 1줄 (자연/어색) | step2.md 메모 | — |
| 2.T1 | tsc --noEmit | 0 errors | — |
| 2.S1 | aria-label 회귀 0 | 통과 | — |

## Step 3 — Fixture + 캡쳐 + 매트릭스

| # | Task | 완료 기준 | 보안 |
|---|------|---|---|
| 3.1 | Presentation.tsx useEffect에 dev-only fixture 가드 (slides 3개 + currentPresentation status READY) | fixture 적용 시 페이지 렌더 | — |
| 3.2 | ppt dev server boot — port fallback OK | dev ready | — |
| 3.3 | Headless Chrome 캡쳐 `pkg-out/trial-6-presentation-default.png` | 파일 존재 + 3패널 가시 | S3.S1 더미 데이터만 |
| 3.4 | AI 시각 분석 → 매트릭스 8행 채움 | "실제" 칸 vague 0 | — |
| 3.5 | H2/H3/H4 판정 | 근거 캡쳐 인용 | — |

## Step 4 — docs/dogfood-trial-6.md + phase 닫기

| # | Task | 완료 기준 | 보안 |
|---|------|---|---|
| 4.1 | `docs/dogfood-trial-6.md` 신규 — Trial 1~5 형식 | spec S2·S3 grep | — |
| 4.2 | 매트릭스 8행 삽입 | 표 존재 | — |
| 4.3 | Phase 16 후보 — Trial 4+5+6 누적 ranking | spec S4 grep | — |
| 4.4 | `phases/index.json` phase 15 entry 추가 | spec S7 grep | — |
| 4.5 | spec S1~S10 모두 ✅ | 통과 | — |
| 4.6 | `phases/15-trial-6-presentation/index.json` 모든 step completed | 5개 step | — |
| 4.7 | commit 직전 diff 시각 검토 | 통과 | S4.S1 |

## 의존성 그래프

```
Step 0 → Step 1 → Step 2 → Step 3 → Step 4
```

## 보안 task

- 0.S1: ppt main 위 작업 방지
- 1.S1: hex 리터럴 0
- 2.S1: aria-label 보존
- 3.S1: 캡쳐 더미 데이터만
- 4.S1: commit 직전 diff
