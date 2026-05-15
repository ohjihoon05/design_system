# ROADMAP

> **이 문서의 목적**: "다음에 뭐 할지" 매번 헷갈리지 않게, 우리 위치 + 미해결 결정 + 남은 큰 step을 한 페이지에 모음. 매 작업 시작 전에 이 문서를 reference.
>
> **갱신 주기**: trial 또는 phase 완료 시 즉시. 큰 결정(ADR 신설/supersede) 발생 시 즉시.

**최종 갱신**: 2026-05-15 (Layer B를 사이클 마지막으로 미루고 layer A 사이클에 시야 집중)

---

## 🧭 현재 위치 (한 줄)

**layer A 1차 채움 완료 (atom 14개). 첫 host product(ppt)에 install 사이클(trial 7) 검증 + 컴포넌트 추가 적용(trial 8) 진행 중. 시각 정체성 통일은 아직 보류. → 지금 집중은 layer A 도구 다지기 + host 적용. Layer B(publish & adopt 본격 인프라)는 사이클 마무리 후 마지막에.**

| layer | 상태 |
|---|---|
| layer A — atom 1차 채움 | ✅ 완료 (14 atoms) |
| 시각 정체성 통일 (host에 토큰 적용) | ⏸️ 사용자 결정 보류 |
| layer A — 2차 채움 (Tabs/Tooltip/Modal/FormField/RadioGroup 등) | ⏸️ 보류 (host needs 누적 3회 후 재개) |
| 추가 host page dogfood | 🔄 진행 중 (Home → Outline / Presentation / Components 후보) |
| ▷ Layer B (사내 registry / Changesets / 첫 publish / dual-direction) | 🔚 **마지막에**. 회사 PC + IT 협의 의존 — 지금 ROADMAP 외 |

---

## ⚡ 즉시 액션 (지금 호흡 안)

순서대로. 각 항목은 30분 이내.

1. **trial 8 commit** — Home.tsx의 Textarea 1개 + Button 3개 교체(verbosity 5개 포함, 총 8개 element). uncommitted. **사용자 색 통일 결정과 무관하게 닫을 수 있음.**
2. **trial 8 dogfood doc 작성** (`docs/dogfood-trial-8.md`) — 패턴 동일, 짧게.
3. **(사용자 결정 후) 시각 정체성 통일** — 결정되면 별도 trial 9: `tokens.css` import 추가 + ppt index.css 4개 interface variable 제거.

---

## 🔀 사용자 결정 보류 (이거 정해야 다음 진행)

| 결정 항목 | 선택지 | 의존성 |
|---|---|---|
| **시각 정체성 통일 시점** | (a) 지금 trial 9로 즉시 / (b) 다른 page 적용 좀 더 한 후 / (c) layer A 사이클 마무리 후 한꺼번에 | 없음. 사용자 호흡만 |
| **다음 dogfood 대상 page** | Outline / Presentation / Components (PromptRefineChat 등) 중 어디부터 | 없음 |
| **다른 host product 발굴** | ppt 외 사내 service 중 적용 후보 식별할지, 지금은 ppt 한 곳에 집중할지 | 사용자 판단 |

---

## 🛣️ 남은 큰 milestones

> Layer B(사내 registry / Changesets / 첫 publish / dual-direction 입증)는 **layer A 사이클이 다 마무리된 후 마지막 phase**로 별도 추적. 본 ROADMAP의 시야 밖. 상세는 ADR-018에 누적.

### Layer A 2차 채움 (집에서 가능, evidence-driven)
host needs 누적 3회 evidence 모이면 atom 추가:
- 🔍 **FormField** (label + Input + error 묶음) — Trial 7에서 1회 발견
- 🔍 **RadioGroup** — Trial 5에서 1회 발견
- 🔍 **ToggleGroup** (chip selector — verbosity 같은 것) — Trial 5 + 8에서 2회 발견
- 🔍 **Modal/Dialog** — 0회 (아직 needs 안 모임)
- 🔍 **Tabs / Tooltip** — 0회

→ "내가 다음 atom 뭐 만들지"가 아니라 "host에서 같은 게 3번 나오면" trigger.

### 시각 정체성 통일 (집에서 가능, 사용자 결정 후)
- ⏳ ppt main.tsx에 `import '@wonik/tokens/tokens.css'` 추가
- ⏳ ppt index.css에서 자체 정의 4개 interface variable 제거 (`--color-primary` `--color-bg` `--color-surface` `--color-border`)
- ⏳ 결과 측정: WONIK BLUE 통일 + anti-pattern 인디고 제거
- ⏳ ppt에서 잔여 hover 변수(`--color-primary-hover` 등) 정리 또는 유지 결정

### 추가 host page dogfood (집에서 가능)
trial 8까지는 Home 위주. 다음 후보:
- Outline.tsx (button 4개)
- Presentation.tsx (button 9 + textarea 3 — trial 6에서 부분 적용)
- PromptRefineChat / OutlineCard / AiChatPanel 등 components

---

## 📌 작은 미해결 항목 (cleanup 거리)

- ⬜ ppt `frontend/vendor/wonik-{tokens,web}-0.0.0.tgz` 정리 (trial 7 이후 잔재, untracked)
- ⬜ ppt `frontend/Dockerfile` 변경 (내가 만진 적 없는 modified 상태) — 내용 확인 후 결정
- ⬜ ppt `PORTFOLIO.md` (untracked) — 내용 확인 후 결정
- ⬜ design_system root에 떨어진 `*.tgz` 정리 (`.gitignore`로 ignore되어 git status엔 안 보이지만 디스크엔 남아있음)

---

## 🌐 의존성 매트릭스

집에서 지금 닿을 수 있는 것만 (Layer B는 매트릭스 밖):

| 작업 | 집 PC 가능 | 사용자 결정 필요 |
|---|---|---|
| trial 8 commit | ✅ | |
| trial 8 doc | ✅ | |
| 시각 정체성 통일 (trial 9) | ✅ | ✅ (시점) |
| 다른 host page dogfood | ✅ | ✅ (어떤 page부터) |
| Layer A 2차 atom 추가 | ✅ | (evidence 자동 trigger — 3회 규칙) |

---

## 📚 reference

- 1단계 큰 그림: [`PRD.md`](./PRD.md)
- 결정 누적: [`ADR.md`](./ADR.md) — 특히 ADR-019(peer-only contract). Layer B 인프라 결정은 ADR-018 (지금 시야 밖, 마지막 phase에 다시 진입)
- host 사용 가이드: [`QUICKSTART.md`](./QUICKSTART.md)
- 외부 install 가이드: [`INSTALL.md`](./INSTALL.md)
- dogfood 사이클 누적: `dogfood-trial-1.md` ~ `dogfood-trial-7.md`
- 옵시디언 메타인지 노트: `Knowledge-Gaps/Design-System/` (디자인 시스템 개발 워크플로우 — 토스 모델 / Publish & adopt 사이클 — 첫 손-실행 / 디자인 시스템 패키지 host에서 쓰기)
