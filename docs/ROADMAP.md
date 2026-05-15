# ROADMAP

> **목적**: 다음 step + 미해결 결정 + 위치를 한 페이지에 모음. 매 작업 시작 전에 본다.
> **갱신 주기**: trial/phase 완료 시 즉시. ADR 신설/supersede 시 즉시.

**최종 갱신**: 2026-05-15 (trial 8 닫음, 다음 호흡 결정 대기 중)

---

## 🧭 현재 위치

> **Layer A 1차 채움 ✅ — atom 14개 안정화. trial 7(packaging contract), trial 8(Home substitution)까지 닫음.**
> 다음 호흡 = 사용자 결정 필요 (3개 옵션 — §3).
> Layer B(publish/registry/CI)는 layer A 사이클 마감 후 마지막 phase로 분리 — **본 ROADMAP 시야 외**.

| 영역 | 진행 | 다음 |
|---|---|---|
| Layer A — atom 1차 채움 | ✅ 완료 (14 atoms) | (마감) |
| Layer A — 2차 채움 | 🔍 evidence 수집 중 | 누적 3회 자동 trigger |
| 시각 정체성 통일 (host 토큰 적용) | ⏸️ 보류 | 사용자 시점 결정 |
| host page dogfood | 🔄 Home / Outline / Presentation 1차 마침 | 재dogfood or 새 컴포넌트 |
| 다른 host product 발굴 | ⏸️ ppt만 | 사내 후보 식별 여부 |
| ▷ Layer B (publish / registry / CI) | 🔚 마지막 phase | 회사 PC + IT 협의 (시야 외) |

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

## 🛣️ 다음 호흡 — 사용자 결정 보류

| # | 결정 | 옵션 | 추천 (왜) |
|---|---|---|---|
| ① | **시각 정체성 통일 시점** | (a) 즉시 trial 9 / (b) 다른 page 좀 더 후 / (c) layer A 사이클 마감 후 한꺼번에 | **(a)** — 30분 견적, 시각 임팩트 큼, ADR-010 cascade 모델 첫 실증 |
| ② | **다음 dogfood 대상** | Outline 재dogfood(Alert/Badge 추가) / Presentation 재dogfood / 새 컴포넌트(PromptRefineChat 등) | **Outline 재dogfood** — 가장 작음, evidence 수집 자동 |
| ③ | **다른 host product 발굴** | ppt 한 곳 깊이 / 사내 다른 service 후보 식별 | **ppt 깊이** 우선 — host 다양화는 layer B 진입 후 |

→ ①이 가장 짧고 시각적 임팩트 큼. ②는 evidence 자동 수집의 일환이라 부담 적음.

---

## 🛠️ 큰 milestone — 집에서 가능 (사용자 결정 후)

### M1. 시각 정체성 통일 (trial 9 후보) — **30분 견적**

| step | 작업 | 시간 |
|---|---|---|
| 1 | ppt `main.tsx`에 `import '@wonik/tokens/tokens.css'` 한 줄 추가 | 1분 |
| 2 | ppt `index.css`에서 자체 정의 4개 interface variable 제거 (`--color-bg` `--color-surface` `--color-border` `--color-primary`) | 5분 |
| 3 | dev server 검증 — WONIK BLUE `#273E82` 통일 + anti-pattern 인디고 제거 확인 | 15분 |
| 4 | ppt 잔여 hover 변수(`--color-primary-hover` 등) 정리 vs 유지 결정 | 5분 |
| 5 | `dogfood-trial-9.md` 작성 + commit (양쪽 repo) | 5분 |

**기대 효과**: 모든 페이지 색감이 한 번에 변함. ADR-010 cascade override 모델을 host에서 첫 실증. 보라/인디고 anti-pattern 제거.

### M2. Layer A 2차 채움 (evidence-driven, trigger 시 자동)

> 원칙: "다음 atom 뭐 만들지" → "host에서 같은 게 3번 나오면" trigger.

| atom 후보 | 누적 evidence | 남은 거리 | 출처 |
|---|---|---|---|
| **ToggleGroup** (chip selector — verbosity 같은 것) | **2/3** | 1회 | Trial 5 + 8 |
| **FormField** (label + Input + error 묶음) | **1/3** | 2회 | Trial 7 |
| **RadioGroup** | **1/3** | 2회 | Trial 5 |
| Modal/Dialog · Tabs · Tooltip | **0/3** | 3회 | — |

→ ToggleGroup이 가장 가까움. 다음 host page에서 비슷한 selector 한 번 더 나오면 phase 18-toggle-group으로 진입.

### M3. 추가 host page / 컴포넌트 dogfood

| 후보 | 이전 trial 기록 | 다음 작업 후보 | 추정 시간 |
|---|---|---|---|
| **Outline.tsx** | trial 4 (통째) | Alert(error) / Badge(상태표시) 추가 적용 | 30분 |
| **Presentation.tsx** | trial 6 (통째 일부) | trial 6 미완 영역 + Alert / Badge | 1시간 |
| PromptRefineChat / AiChatPanel / OutlineCard | 0회 | 첫 dogfood (작은 컴포넌트 단위) | 30분~ |

---

## 📌 작은 cleanup 거리

- ⬜ ppt `frontend/vendor/wonik-{tokens,web}-0.0.0.tgz` 삭제 (trial 7로 0.1.0 교체됨, 잔재)
- ⬜ design_system root `*.tgz` 삭제 (`.gitignore`로 git에선 안 보이지만 디스크 잔존)

→ 모두 5분 이내. 다른 작업과 묶어 처리 가능.

---

## 🌐 의존성 매트릭스 (집에서 가능한 것만)

| 작업 | 집 PC | 사용자 결정 |
|---|---|---|
| M1. 시각 정체성 통일 (trial 9) | ✅ | ✅ 시점 |
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

→ 누적 8 trial. Layer A가 14 atoms로 안정화됨. host 적용은 Home 깊게 / Outline·Presentation 1차 마침.

---

## 📚 reference

- 1단계 큰 그림: [`PRD.md`](./PRD.md)
- 결정 누적: [`ADR.md`](./ADR.md)
  - 핵심 ADR: **010** (cascade override) · **011** (module-scope CSS) · **019** (peer-only contract)
  - Layer B 결정: **018** (지금 시야 외, 마지막 phase에 다시 진입)
- host 사용 가이드: [`QUICKSTART.md`](./QUICKSTART.md)
- 외부 install 가이드: [`INSTALL.md`](./INSTALL.md)
- dogfood 사이클: `dogfood-trial-1.md` ~ `dogfood-trial-8.md` (+ trial-3-recapture)
- 옵시디언 메타인지 노트: `Knowledge-Gaps/Design-System/`
