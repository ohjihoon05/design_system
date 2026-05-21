# Phase 13 — Trial 5 (tasks.md)

> autopilot PHASE 4 (TASKS) 산출물. plan §7의 5단계를 의존성 순서로 분해. 각 task = 완료 기준 + 테스트 + 보안 체크.

각 task는 step0.md~step4.md에 풀어 쓴다 (tasks.md는 *목록*, step{N}.md는 *실행 가이드*).

---

## Step 0 — 사전 준비 + branch + fixture 확인

| # | Task | 완료 기준 | 테스트 task | 보안 체크 |
|---|------|-----------|-------------|-----------|
| 0.1 | design_system 빌드 + tgz pack (Trial 4 직후면 timestamp 확인만, 변경 있으면 다시 빌드) | `pkg-out/wonik-tokens-*.tgz`, `wonik-web-*.tgz` 최신 dist 반영 | 0.T1 | — |
| 0.2 | ppt 측 reinstall (file: protocol) | `pnpm --dir C:/Users/ohjih/ppt/frontend list @wonik/web` 정상 (Trial 4 lockfile 잔재는 stash로 격리) | 0.T2 | — |
| 0.3 | ppt branch `trial-5-home` 체크아웃 (main에서 분기, Trial 4 branch 잔재 격리) | `git -C C:/Users/ohjih/ppt branch --show-current` == `trial-5-home` | — | S0.S1 ppt main 위 직접 작업 금지 |
| 0.4 | Home.tsx 사전 grep — React 19-only API(`useFormStatus`/`useOptimistic`/`use(`) 자취 0 확인 | grep 결과 0 line | — | — |
| 0.5 | spec §3 매핑 8행 — 코드상 위치 line 번호 재확인 (ppt main 최신 반영) | step0.md에 8행 line 표 갱신 | — | — |
| 0.T1 | 빌드 산출물 sanity | `test -d packages/web/dist && test -d packages/tokens/dist` | — | — |
| 0.T2 | ppt에서 `import { Button, Spinner, Textarea, Card } from "@wonik/web"` resolve | `pnpm --dir C:/Users/ohjih/ppt/frontend exec tsc --noEmit` 또는 dev server boot 성공 | — | — |
| 0.S1 | (보안) ppt main 위 작업 방지 | 0.3 이전 `git -C C:/Users/ohjih/ppt status` clean 확인 (필요 시 stash) + branch 분기 | — | — |

**Step 0 통과 조건**: 0.1~0.5 완료 + 0.T1·0.T2·0.S1 통과.

---

## Step 1 — Home.tsx 교체 part 1 (Textarea + AI 다듬기 Button + PDF 영역)

| # | Task | 완료 기준 | 테스트 task | 보안 체크 |
|---|------|-----------|-------------|-----------|
| 1.1 | `import { Textarea, Button, Card } from "@wonik/web"` 추가 (기존 Spinner·Button import 합치기) | 단일 import 라인 | 1.T1 | — |
| 1.2 | inline `<textarea>` (line 184–199) → `<Textarea>` 교체. `id`/`value`/`onChange`/`placeholder`/`rows`/`maxLength`/`required`/`aria-describedby` native attr 모두 통과 | TSC 통과, 폼 동작 동일 | 1.T1 | — |
| 1.3 | "AI와 주제 다듬기" inline `<button>` (line 208–233) → `<Button variant="outline" size="sm">` + `<svg/>` + text children. inline `style={{background, color, border}}` 제거 | hex/raw color literal 0, 시각도 inline 0 | 1.T1 | S1.S1 |
| 1.4 | PDF dropzone `<div>` (line 259–303) 외부 wrapper만 `<Card variant="surface" padding="md">`로 감싸기 — onDrop/onDragOver/onClick·className은 Card에 그대로 전달 (`<Card onClick={...} className="...">`) | dashed border 손실은 의도된 evidence, dropzone 동작은 그대로 | 1.T1 | — |
| 1.5 | "삭제" inline text button (line 288–298) → `<Button variant="danger" size="sm">` (e.stopPropagation 보존, onClick 동작 그대로) | 동작 보존, 시각 무거우면 step1.md에 1줄 메모 | 1.T1 | — |
| 1.6 | step1.md 끝에 "Card dashed 손실 첫 인상" + "Verbosity 토글 단계 직전 메모" 1~2줄 | step1.md 메모 존재 | — | — |
| 1.T1 | `tsc --noEmit` ppt 통과 + dev server boot 성공 | 0 errors | — | — |
| 1.S1 | (보안/CRITICAL) ppt 신규 코드에 hex/raw 색 리터럴 0 | `git -C C:/Users/ohjih/ppt diff` 신규 라인 중 `#[0-9a-fA-F]{6}` 0 | — | — |

**Step 1 통과 조건**: 1.1~1.6 완료 + 1.T1·1.S1 통과.

---

## Step 2 — Home.tsx 교체 part 2 (Verbosity Button variant 토글 + 변경 안 하는 부위 기록)

| # | Task | 완료 기준 | 테스트 task | 보안 체크 |
|---|------|-----------|-------------|-----------|
| 2.1 | Verbosity 5-button group (line 376–391) → `<Button variant={verbosity === opt.value ? 'primary' : 'outline'} size="sm" onClick={() => setVerbosity(opt.value)}>` + grid는 부모 className 유지 | 시각도 inline 0, onClick·label 보존 | 2.T1 | S2.S1 |
| 2.2 | (변경 안 함 — evidence) slideCount "{slideCount}장" pill (line 316–324): Badge 부재 → 그대로 유지. step2.md에 "Badge needs Trial 4 3회 + Home 1회 = 4회 누적, Phase 14 후보 1" 1줄 명시 | step2.md 메모 존재 | — | — |
| 2.3 | (변경 안 함 — evidence) Audience `<select>` (line 356–368): Select wrapper 부재 → 그대로 유지. step2.md에 "Select needs Home 1회, evidence 약함" 1줄 명시 | step2.md 메모 존재 | — | — |
| 2.4 | (변경 안 함 — evidence) Error alert (line 395–409): Alert 부재 → 그대로 유지. step2.md에 "Alert needs Trial 4 inconclusive + Home 1회 = evidence 시작" 1줄 명시 | step2.md 메모 존재 | — | — |
| 2.5 | step2.md "Verbosity Button variant=primary 시각 첫 인상" 1줄 (자연 / 무거움) — ToggleGroup needs 판정 input | step2.md 메모 존재 | — | — |
| 2.T1 | `tsc --noEmit` 통과 | 0 errors | — | — |
| 2.S1 | (보안) hex 리터럴 0 (1.S1 동일) | git diff에 hex 0 | — | — |

**Step 2 통과 조건**: 2.1~2.5 완료 + 2.T1·2.S1 통과.

---

## Step 3 — 캡쳐 + AI 시각 분석 + 매트릭스 채움

| # | Task | 완료 기준 | 테스트 task | 보안 체크 |
|---|------|-----------|-------------|-----------|
| 3.1 | ppt dev server boot — 사전 `Get-Process node` 확인 → 충돌 시 taskkill (Trial 4 learning) | dev server listen on port 정상 | 3.T1 | — |
| 3.2 | Headless Chrome으로 default(폼 초기) state 캡쳐 → `pkg-out/trial-5-home-default.png` | 파일 존재 + 크기 > 0, 폼 8개 부위 가시 | 3.T2 | S3.S1 |
| 3.3 | (best-effort, C4) `?fixture=with-pdf` 등 URL query toggle로 PDF state 진입 → 캡쳐 `pkg-out/trial-5-home-with-pdf.png`. fixture가 없거나 어려우면 skip (trial valid) | 파일 존재 OR skip 사유 step3.md에 기록 | 3.T2 | S3.S1 |
| 3.4 | AI(Read tool)가 PNG 직접 읽고 spec §6 매트릭스 8행 채움 | 표 8행 모두 "실제" 칸 비어 있지 않음 | — | — |
| 3.5 | 매트릭스 결론으로 H2/H3/H4 각각 ✅/❌/partial 판정 | 판정 근거가 캡쳐 인용 형태 (vague 금지) | — | — |
| 3.T1 | dev server 응답 sanity — `curl -I http://localhost:<port>/` 200 | HTTP 200 | — | — |
| 3.T2 | PNG 파일 sanity (헤더 검증) | `file pkg-out/trial-5-home-*.png` PNG 헤더 OK | — | — |
| 3.S1 | (보안) 캡쳐 PNG에 사용자 데이터 0 — 더미 프롬프트("AI 트렌드 발표자료 만들어줘"), 실고객명·실 PDF 0 | PNG 시각 검사 시 더미만 보임 | — | — |

**Step 3 통과 조건**: 3.1·3.2·3.4·3.5 완료 (3.3는 best-effort) + 3.T1·3.T2·3.S1 통과.

---

## Step 4 — docs/dogfood-trial-5.md + phases/index.json 보정 + phase 닫기

| # | Task | 완료 기준 | 테스트 task | 보안 체크 |
|---|------|-----------|-------------|-----------|
| 4.1 | `docs/dogfood-trial-5.md` 신규 — Trial 1~4 형식(메타·적용·발견·결과·다음 phase) | spec S2·S3 grep 통과 | 4.T1 | — |
| 4.2 | §발견에 spec §6 매트릭스 8행 그대로 삽입 | 표 존재 | 4.T1 | — |
| 4.3 | §다음 phase 후보에 **Trial 4 + Trial 5 누적 ranking** 명시 (우선순위 1·2·3, 반복 횟수·페이지 evidence) | spec S4 grep 통과, vague 0 | — | — |
| 4.4 | `phases/index.json` 보정: phase 12 entry 추가 (`dir: "12-card", status: "completed", completed_at: "2026-05-13T02:02:00+0900"`) + phase 13 entry 추가 | spec S7 grep 통과 — `"12-card"`·`"13-trial-5-home"` 둘 다 존재 | 4.T1 | — |
| 4.5 | spec §7 결승선 S1~S10 자동 grep + 정성 판정 모두 ✅ | 자동 grep 모두 통과, 정성 §S8·S9·S10 trial 문서에 명시 | 4.T2 | — |
| 4.6 | `phases/13-trial-5-home/index.json` 모든 step `status: "completed"` + summary 1줄씩 | 5개 step 완료 처리 | — | — |
| 4.7 | commit 직전 git diff 시각 검토 — 비밀·실데이터 0 | 검토 통과 | — | S4.S1 |
| 4.T1 | spec S1~S7 grep 자동 검증 | 모두 ✅ | — | — |
| 4.T2 | trial 문서 안에 AI 슬롭 anti-pattern 0 (S5) | grep 0 hit | — | — |
| 4.S1 | (보안 최종) commit 직전 diff 시각 검토 | 통과 | — | — |

**Step 4 통과 조건 (= phase closure)**: 4.1~4.7 완료 + 4.T1·4.T2·4.S1 통과.

---

## 의존성 그래프

```
Step 0 (사전 준비)
   └─→ Step 1 (Home.tsx part 1)
          └─→ Step 2 (Home.tsx part 2)
                 └─→ Step 3 (캡쳐 + 분석)
                        └─→ Step 4 (문서 + index 보정 + 닫기)
```

순차 실행. Step 1·2는 동일 파일 편집이라 사실상 분리만 명목적 (autopilot에서 한 번에 처리).

---

## 보안 task 별도 명시 (GATE 4 항목)

- **0.S1** ppt main 위 직접 작업 방지
- **1.S1 / 2.S1** 신규 코드에 hex 리터럴 0 (CLAUDE.md CRITICAL)
- **3.S1** 캡쳐 PNG에 사용자 데이터 0 (더미만)
- **4.S1** commit 직전 diff 시각 검토

aria-label·role 회귀 체크: Trial 5는 icon-only 교체가 거의 없어 Trial 4 수준 a11y 회귀 위험 낮음. 단 Textarea·Button 교체 시 `aria-describedby`·`aria-label`·`required` 보존 확인 (1.2·2.1·1.5).

---

## 완료 기준 (전체 phase)

- 모든 Task 0.x ~ 4.x ✅ (3.3은 best-effort, skip 가능)
- 모든 Test task 0.T1 ~ 4.T2 ✅
- 모든 Security task 0.S1 ~ 4.S1 ✅
- spec §5 S1~S10 ✅
- 사용자 confirm은 autopilot mode이므로 생략 — 결과는 최종 요약에 명시
