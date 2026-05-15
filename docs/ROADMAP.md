# ROADMAP

> **목적**: 다음 step + 미해결 결정 + 위치를 한 페이지에 모음. 매 작업 시작 전에 본다.
> **갱신 주기**: trial/phase 완료 시 즉시. ADR 신설/supersede 시 즉시.

**최종 갱신**: 2026-05-15 (🏁 Layer A 1차 사이클 마감 선언 — 11 trial 누적)

---

## 🧭 현재 위치

> **🏁 Layer A 1차 사이클 마감 (2026-05-15)** — atom 14개 × ppt 3 main 페이지 적용 + 시각 정체성 통일 + evidence-driven cycle 한 바퀴 입증. 11 trial 누적.
>
> **다음 큰 단계**: **Layer B (publish & adopt 인프라)** — 회사 PC + IT 협의 의존, 사용자가 사내 환경 진입 신호 시 시작. ADR-018에 결정 누적.
>
> **집에서 가능한 작은 호흡**: cleanup 거리 + doc 갱신 + (선택) sub-component dogfood. 자세한 건 §4.

| 영역 | 진행 |
|---|---|
| Layer A — atom 1차 채움 | ✅ 14 atoms 안정화 |
| Layer A — host page dogfood (Home/Outline/Presentation) | ✅ trial 7+8+10+11 |
| Layer A — 시각 정체성 통일 (host 토큰) | ✅ trial 9 |
| Layer A — 2차 채움 evidence cycle | ✅ 한 바퀴 입증 (Phase 14 Badge → trial 10 적용 + dashed 격하 reaffirm) |
| ▷ Layer B — publish & adopt | ⏳ 회사 PC + IT 협의 대기 |
| ▷ 다른 host product 발굴 | ⏸️ Layer B 진입 후 |

---

## 🏁 Layer A 마감 — 얻은 것

### 정량
- **14 atoms** 안정화 (Box / Stack / Text / Button / Input / Textarea / Checkbox / Radio / Switch / Spinner / Skeleton / Card / Badge / Alert)
- **3 host pages** 풀 적용 — ppt Home / Outline / Presentation (main 전체)
- **11 trial** 누적 dogfood
- **anti-pattern 2종 제거** — 인디고 `#6366f1` (trial 9), 보라 `#8b5cf6` (trial 11)

### 정성 (cycle / 모델 단위 입증)
- **evidence-driven cycle 첫 closure** — host 3회 evidence 누적 → atom 추가 → 적용 한 바퀴 (Badge: trial 4·5·6 → Phase 14 → trial 10 적용)
- **trigger ≠ atom 추가** — dashed Add Slide button 3/3 trigger 도달 후 본질 needs 약함 평가, atom 추가 안 함 (격하 reaffirm). evidence count는 trigger지 결정은 아님이 명확
- **ADR-009 dual mode 첫 host 활성화** — trial 9에서 ppt `data-theme="dark"` cascade 입증
- **token vocabulary가 host에 흘러야 한다** — host가 우리 토큰 모르면 hex hardcode (F19, 보라 anti-pattern 발생 원인)

### 검증된 ADR
| ADR | 입증 trial |
|---|---|
| **007** WONIK BLUE `#273E82` | Figma swatch 595:2633 정합 |
| **009** light/dark dual | trial 9 host 활성화 |
| **010** cascade override | 4 페이지 dogfood 다중-컴포넌트 회귀 0 |
| **011** module-scope CSS | focus/hover/placeholder polish 입증 |
| **018** layer B publish-ready | packaging 검증 (trial 7) |
| **019** peer-only contract | trial 7에서 cascade로 도출 |

→ Layer A의 *재료 창고*가 안정화됨. 다음은 Layer B(배포 인프라)로 host 다양화 가능 상태로 전환.

---

## 🧱 Layer A 현재 atom 14개

| 분류 | atom |
|---|---|
| 레이아웃 | `Box` · `Stack` · `Text` |
| 액션 | `Button` |
| 입력 | `Input` · `Textarea` |
| 상태 | `Checkbox` · `Radio` · `Switch` |
| 로딩 | `Spinner` · `Skeleton` |
| 표시 | `Card` · `Badge` · `Alert` |

> 부가: `ThemeProvider` (provider, atom 카운트 외).
> → 14 atom을 host에서 충분히 사용해본 다음, 정말로 부족한 게 누적 3회 evidence 모이면 2차 채움 (§5.M2).

---

## 🛣️ 다음 호흡

**큰 흐름은 Layer B 진입 대기 (회사 PC + IT 협의 의존).** 집에서 할 수 있는 작은 호흡:

| 후보 | 내용 | 시간 | 우선도 |
|---|---|---|---|
| cleanup #1 | ppt `frontend/vendor/wonik-{tokens,web}-0.0.0.tgz` 삭제 (trial 7로 0.1.0 교체된 잔재) | 5분 | 낮음 |
| cleanup #2 | design_system root `*.tgz` 삭제 (디스크 잔존) | 5분 | 낮음 |
| cleanup #3 | trial-N narrative 주석 일괄 제거 (`/* trial 8: ... */` 누적, CLAUDE.md 주석 정책 위배) | 30분 | 중간 |
| doc #1 | QUICKSTART에 "host inline px 대신 Stack gap 사용" 한 줄 추가 (F23) | 10분 | 중간 |
| doc #2 | AI semantic purple ADR — `--color-status-processed-text: #7C3AED` 의미 확장(AI 처리)을 ADR-007에 짧게 추가 (F19) | 15분 | 중간 |
| (선택) sub-component dogfood | PromptRefineChat / AiChatPanel — ToggleGroup 추가 evidence 가능성 | 30분~ | 낮음 (Layer A 이미 마감) |
| (선택) ppt branch merge to main | `trial-6-presentation` branch에 누적된 trial 7~11 commit을 main으로 정리 | 사용자 판단 | 낮음 |

---

## 🛠️ Layer A milestone history (모두 ✅ 완료)

> 아래는 history reference. 자세한 trial별 finding은 §7 trial history + `dogfood-trial-N.md`.

### M1. 시각 정체성 통일 — ✅ 완료 (trial 9, 옵션 B 격상)

| step | 결과 |
|---|---|
| Phase A (1줄 제거) | ❌ contrast 1.7:1 fail 발견 → phase B로 격상 |
| Phase B 1 — `<html data-theme="dark">` 추가 | ✅ |
| Phase B 2 — ppt index.css hand-rolled 5 vars 제거 | ✅ |
| Phase B 3 — `--color-primary-hover: var(--color-primary-selected)` 위임 | ✅ |
| 시각 검증 | ⏭️ 후속 cycle로 미룸 (사용자 "continue") |

**얻은 것**: ADR-009 dual mode 첫 host 활성화. 인디고 anti-pattern 완전 제거. ppt의 hand-rolled dark vars 5개 → 우리 dark tokens 단일 출처. 자세한 finding은 `docs/dogfood-trial-9.md` (F9~F13).

### M2. Layer A 2차 채움 (evidence-driven, trigger 시 자동)

> 원칙: "다음 atom 뭐 만들지" → "host에서 같은 게 3번 나오면" trigger.

| atom 후보 | 누적 evidence | 결정 |
|---|---|---|
| **ToggleGroup** (chip selector — verbosity 같은 것) | **2/3** | 1회 더 trigger 대기 |
| ~~Add-dashed Button variant~~ | **3/3 trigger** → 본질 needs 약함 | **보류 (격하 reaffirm)** — outline 우회로 충분, dashed visual 손실 수용 |
| **FormField** (label + Input + error 묶음) | **1/3** | 2회 더 |
| **RadioGroup** | **1/3** | 2회 더 |
| **Card with hover variant** | **1/3** | 2회 더 |
| **host 측 inline px helper 가이드** (Stack 권장) | **4/3** | doc 갱신 거리 (atom 아님) — QUICKSTART.md에 한 줄 추가 검토 |
| Modal/Dialog · Tabs · Tooltip | **0/3** | — |

→ ToggleGroup이 가장 가까움. 다음 host page에서 비슷한 selector 한 번 더 나오면 phase 18-toggle-group으로 진입.

### M3. 추가 host page / 컴포넌트 dogfood

| 후보 | 이전 trial 기록 | 다음 작업 후보 | 추정 시간 |
|---|---|---|---|
| ~~Outline.tsx~~ | trial 4 + **trial 10 ✅ main 적용 + Alert/Badge/Card 도입** | (마감) | — |
| ~~Presentation.tsx~~ | trial 6 + **trial 11 ✅ Alert/Input/Textarea + 보라 anti-pattern 제거** | (마감) | — |
| PromptRefineChat / AiChatPanel | 0회 | 첫 dogfood (작은 컴포넌트 단위) | 30분~ |

---

## ▷ Layer B 진입 준비 (회사 PC + IT 협의 시 시작)

ADR-018에 결정 누적. 진입 시 6단계 흐름:

| step | 작업 | 의존 |
|---|---|---|
| 1 | IT 협의 → registry 옵션 확정 (Verdaccio / GitHub Packages / Tarball-via-Release) | IT |
| 2 | registry URL / token 발급 | IT |
| 3 | `publishConfig.registry` 실제 URL 교체 + Changesets 도입 | 집 PC OK (URL 결정 후) |
| 4 | `pnpm publish` 첫 실행 (manual) | 회사 PC |
| 5 | ppt가 published 버전으로 install 전환 → dual-direction 입증 | 회사 PC |
| 6 | (선택) CI 자동 publish workflow | 회사 PC |

> **진입 신호**: 사용자가 사내 환경 진입(회사 PC) 알릴 때까지 ROADMAP에서 push 안 함.

---

## 🌐 의존성 매트릭스 (집에서 가능한 것만)

| 작업 | 집 PC | 사용자 결정 |
|---|---|---|
| ~~M1. 시각 정체성 통일 (trial 9)~~ | ✅ 완료 | — |
| M2. Layer A 2차 atom 추가 | ✅ | (evidence 3회 자동 trigger) |
| M3. 추가 page / 컴포넌트 dogfood | ✅ | ✅ 대상 |
| cleanup 거리 | ✅ | — |

> Layer B(사내 registry / Changesets / publish / dual-direction 입증)는 회사 PC + IT 협의 의존이라 매트릭스 외. 결정은 ADR-018에 누적 보존.

---

## 📜 trial 누적 history

| # | 날짜 | 적용 / 발견 핵심 | doc |
|---|---|---|---|
| 1 | 2026-05-08 | Spinner 첫 적용 (Home의 inline SVG 교체) | `dogfood-trial-1.md` |
| 2 | 2026-05-08 | Button submit 적용 (Home 메인 hero) | `dogfood-trial-2.md` |
| 3 | 2026-05-11 | Textarea 적용 (Home prompt) | `dogfood-trial-3.md` |
| 3-recapture | 2026-05-11 | ADR-010 cascade 적용 후 invisibility 해결 입증 | `dogfood-trial-3-recapture.md` |
| 4 | 2026-05-12 | Outline.tsx 통째 dogfood (페이지 전체) | `dogfood-trial-4.md` |
| 5 | 2026-05-13 | Home.tsx 통째 dogfood — RadioGroup/ToggleGroup needs 첫 발견 | `dogfood-trial-5.md` |
| 6 | 2026-05-13 | Presentation.tsx 통째 dogfood (3-panel) | `dogfood-trial-6.md` |
| 7 | 2026-05-15 | packaging contract 검증 — ADR-019 신설, ppt 0.0.0→0.1.0 + Alert 첫 적용 | `dogfood-trial-7.md` |
| 8 | 2026-05-15 | Home Textarea + Button 3종 — 라인 -18% / 결정 절감 본질 발견 | `dogfood-trial-8.md` |
| 9 | 2026-05-15 | 시각 정체성 통일 — ppt `data-theme="dark"` 활성화 + hand-rolled dark vars 정리. ADR-009 dual mode 첫 실증 | `dogfood-trial-9.md` |
| 10 | 2026-05-15 | Outline 통째 재dogfood — trial 4 main 머지 closure + Alert/Badge/Card 첫 적용. Card 4회 evidence 정확 입증 | `dogfood-trial-10.md` |
| 11 | 2026-05-15 | Presentation 재dogfood — trial 6 미완 청소 + Alert/Input/Textarea + AI 수정 보라 anti-pattern 제거. dashed 3/3 trigger도 격하 reaffirm | `dogfood-trial-11.md` |

→ 누적 11 trial. **Layer A 14 atoms × ppt 3 main 페이지 (Home/Outline/Presentation) 모두 적용 완료.** evidence-driven cycle 한 바퀴 closure(Phase 14 Badge → trial 10 적용) + dashed atom 후보 trigger 후 격하 reaffirm. **Layer A 사이클 마감 선언 가능 상태.**

---

## 📚 reference

- 1단계 큰 그림: [`PRD.md`](./PRD.md)
- 결정 누적: [`ADR.md`](./ADR.md)
  - 핵심 ADR: **010** (cascade override) · **011** (module-scope CSS) · **019** (peer-only contract)
  - Layer B 결정: **018** (지금 시야 외, 마지막 phase에 다시 진입)
- host 사용 가이드: [`QUICKSTART.md`](./QUICKSTART.md)
- 외부 install 가이드: [`INSTALL.md`](./INSTALL.md)
- dogfood 사이클: `dogfood-trial-1.md` ~ `dogfood-trial-11.md` (+ trial-3-recapture)
- 옵시디언 메타인지 노트: `Knowledge-Gaps/Design-System/`
