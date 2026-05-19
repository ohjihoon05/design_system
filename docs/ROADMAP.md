# ROADMAP

> **목적**: 다음 step + 미해결 결정 + 위치를 한 페이지에 모음. 매 작업 시작 전에 본다.
> **갱신 주기**: trial/phase 완료 시 즉시. ADR 신설/supersede 시 즉시.

**최종 갱신**: 2026-05-19 (Ladle 도입 ✅ — atom 21개 카탈로그 + 토큰 시각화 23 stories. Phase 21 Tooltip + Phase 22 Ladle 차례 closure)

---

## 🧭 현재 위치

> **🏁 Layer A 1차 사이클 마감 (2026-05-15)** — atom 14개 × ppt 3 main 페이지 적용 + 시각 정체성 통일 + evidence-driven cycle 한 바퀴 입증. 11 trial 누적.
>
> **다음 큰 단계**: **Layer B (publish & adopt 인프라)** — 집 시뮬레이션 한 바퀴 ✅ (trial 12, Verdaccio 14873). 사내 진입 시 *URL 2 곳만 교체*하면 즉시 작동 상태. ADR-018에 결정 누적.
>
> **집에서 가능한 작은 호흡**: cleanup 거리 + doc 갱신 + (선택) sub-component dogfood. 자세한 건 §4.

| 영역 | 진행 |
|---|---|
| Layer A — atom 1차 채움 | ✅ 14 atoms 안정화 |
| Layer A — host page dogfood (Home/Outline/Presentation) | ✅ trial 7+8+10+11 |
| Layer A — 시각 정체성 통일 (host 토큰) | ✅ trial 9 |
| Layer A — 2차 채움 evidence cycle | ✅ 한 바퀴 입증 (Phase 14 Badge → trial 10 적용 + dashed 격하 reaffirm) |
| ▷ Layer B — publish & adopt | 🟢 dry run ✅ (trial 12) — 사내 URL 결정만 대기 |
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

## 🧱 Layer A 현재 atom 20개

| 분류 | atom |
|---|---|
| 레이아웃 | `Box` · `Stack` · `Text` |
| 액션 | `Button` · `IconButton` |
| 입력 | `Input` · `Textarea` |
| 상태 | `Checkbox` · `Radio` · `Switch` |
| 로딩 | `Spinner` · `Skeleton` |
| 표시 | `Card` · `Badge` · `Alert` · `ProgressBar` · `Avatar` |
| 선택 | `FilterChip` |
| 오버레이 | `Modal` · `Toast` (+ `ToastProvider`/`useToast`) |

> 부가: `ThemeProvider` (provider, atom 카운트 외).
> → **21 atom 도달** (Tooltip 합류). Storybook(15+) 통과 + **Chromatic(20+) trigger 통과**. **Ladle 도입 완료 (2026-05-19, phase 22)** — `pnpm -F ladle dev`로 atom 카탈로그 + 토큰 시각화 23 stories. Chromatic은 사내 진입 시(CI 의존) 별도.

---

## 🛣️ 다음 호흡

**큰 흐름은 Layer B 진입 대기 (사내 registry URL 결정만 남음 — dry run trial 12로 모든 cycle 검증 완료).** 집에서 할 수 있는 작은 호흡:

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

### M2.b — 부족 컴포넌트 리스트 (2026-05-18 추가)

> demo-fab-monitor 한 바퀴 dogfood로 internal 4개 승격 후보가 가시화 + PRD §1.4.2 명시 6개 + ROADMAP M2 명시 Tooltip 1개 = **11개 부족**. 다 채우면 14 + 11 = 25개 → Storybook(15+) ✅ + Chromatic(20+) ✅ 트리거 둘 다 충족.

| Layer | 컴포넌트 | 출처 | 추산 |
|---|---|---|---|
| A — PRD 핵심 | Modal/Dialog | PRD §1.4.2 (M2 명시) | 2-3h (focus trap + ESC + portal) |
| A — PRD 핵심 | Toast/Notification | PRD §1.4.2 | 2-3h (queue + auto-dismiss) |
| A — PRD 핵심 | Tabs | PRD §1.4.2 (M2 명시) | 1.5h |
| A — PRD 핵심 | Dropdown/Select | PRD §1.4.2 | 3-4h (keyboard nav + search 옵션) |
| A — PRD 핵심 | SortableList | PRD §1.4.2 (ppt-derived) | 큰 단위 (드래그) |
| A — PRD 핵심 | InlineEditableText | PRD §1.4.2 (ppt-derived) | 큰 단위 |
| B — M2 명시 | Tooltip | ROADMAP M2 (positioning) | 1-1.5h |
| C — demo 승격 | IconButton | demo internal (Topbar/Sidebar/Alarms dogfood ✅) | 1h |
| C — demo 승격 | FilterChip | demo internal (Alarms/Equipment/Settings ✅) | 1-1.5h |
| C — demo 승격 | Avatar | demo internal (Sidebar ✅) | 1h |
| C — demo 승격 | ProgressBar | demo components (Dashboard/Equipment ✅) | 1-1.5h |

**총 추산**: 16-22시간. 한 세션 못 함. **sub-batch로 분배**:

| Phase | 컴포넌트 | 추산 | 달성 atom 수 | 도구 트리거 | 상태 |
|---|---|---|---|---|---|
| **1** | IconButton | 1-2h | 15 | Storybook(15+) 검토 시점 | ✅ 2026-05-18 (Phase 18) |
| **2** | FilterChip + Avatar + ProgressBar | 3-4h | 18 | — | ✅ 2026-05-18 (Phase 19, 묶음 closure) |
| **3** | Tooltip + Tabs | 3-5h | — | — | dogfood 부재 — host evidence 권장. Tabs 자리도 AlarmsPage FilterChip(single-select)이 더 적합해 약함 |
| **4 (부분)** | Modal + Toast | 5-7h | 20 | Chromatic(20+) trigger 통과 | ✅ 2026-05-18 (Phase 20, dogfood-driven 묶음 closure — 5 자리 적용) |
| **4 (잔여)** | Select | 1-2h | 21 | — | demo 자리 부족(현 inline `<select>` 1개) — 다음 dogfood로 자리 발견 시 진입 |
| **5a** | InlineEditableText | 1.5-2h | 22 | — | ✅ 2026-05-19 (Phase 23, ppt OutlineCard dogfood — 30→3줄 흡수) |
| **5b** (옵션) | SortableList | 2-3h | 23 | — | dogfood 자리 2개 확보(OutlineCard ↑↓ + Presentation thumbnails). dnd-kit wrap + WAI-ARIA keyboard drag 패턴 필요 |

> demo 승격은 dogfood로 실제 사용 패턴 + 토큰 정합도가 이미 검증된 상태라 가장 안전한 첫 단계. 도메인 specific 가정이 숨어있을 수 있으니 승격 시 generalize 필요. PRD 명시 6개는 ppt 또는 demo-fab-monitor에서 dogfood 가능성 추가 평가.

### M3. 추가 host page / 컴포넌트 dogfood

| 후보 | 이전 trial 기록 | 다음 작업 후보 | 추정 시간 |
|---|---|---|---|
| ~~Outline.tsx~~ | trial 4 + **trial 10 ✅ main 적용 + Alert/Badge/Card 도입** | (마감) | — |
| ~~Presentation.tsx~~ | trial 6 + **trial 11 ✅ Alert/Input/Textarea + 보라 anti-pattern 제거** | (마감) | — |
| PromptRefineChat / AiChatPanel | 0회 | 첫 dogfood (작은 컴포넌트 단위) | 30분~ |

---

## ▷ Layer B 진입 준비 (집 시뮬레이션 ✅, 사내 URL만 대기)

집에서 Verdaccio(`localhost:14873`)로 전체 cycle 시뮬레이션 완료 (trial 12). ADR-018에 결정 누적.

| step | 작업 | 집 dry run 상태 | 사내 진입 시 |
|---|---|---|---|
| 1 | registry 옵션 확정 (A=사내 npm / B=GitHub Packages / C=Tarball) | A 채택 (Verdaccio) | IT 협의로 1순위 reaffirm 또는 변경 |
| 2 | registry URL / token | `127.0.0.1:14873` + dev token | 사내 URL + 사내 SSO token |
| 3 | `publishConfig.registry` + `.npmrc` `@wonik:registry` 교체 | ✅ 14873로 둘 다 교체 | URL 2 곳만 다시 교체 |
| 4 | `pnpm changeset version` + `pnpm changeset publish` | ✅ tokens@0.2.0, web@1.0.0 publish | 동일 명령 |
| 5 | host product `pnpm install` (vendor → registry) → dual-direction patch | ✅ ppt 3.7초 install + 1.5초 update | 동일 흐름 |
| 6 | (선택) CI 자동 publish workflow | 보류 | GitHub Actions 추가 |

> **진입 신호**: 사용자가 사내 환경 진입 알릴 때까지 ROADMAP에서 push 안 함. dry run 결과 commit은 집에서 가능.

---

## 🌐 의존성 매트릭스 (집에서 가능한 것만)

| 작업 | 집 PC | 사용자 결정 |
|---|---|---|
| ~~M1. 시각 정체성 통일 (trial 9)~~ | ✅ 완료 | — |
| M2. Layer A 2차 atom 추가 | ✅ | (evidence 3회 자동 trigger) |
| M3. 추가 page / 컴포넌트 dogfood | ✅ | ✅ 대상 |
| cleanup 거리 | ✅ | — |
| **Layer B dry run (trial 12)** | ✅ Verdaccio 시뮬레이션 완료 | 사내 진입 시 URL만 교체 |

> Layer B 사이클 자체(Changesets / publish / install / dual-direction)는 집에서 trial 12로 한 바퀴 검증. 사내 의존은 *URL 결정* 한 가지로 축소. 결정은 ADR-018 "Verdaccio dry run 보강" 섹션에 누적.

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
