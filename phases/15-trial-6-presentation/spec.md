# Phase 15 — Trial 6: ppt Presentation 페이지 dogfood (spec.md)

> autopilot PHASE 1 (SPECIFY) 산출물.

## 1. 목표

ppt `Presentation.tsx` 한 페이지(3패널 슬라이드 편집기)를 통째로 dogfood해 네 가지 가설을 검증한다.

- **H2 (시각 일관성, 3-panel 복잡 layout)**: ADR-010 cascade가 list(Outline) + form(Home) 외 *복잡 3패널 편집기* 환경에서도 회귀 없이 작동하는가.
- **H3 (Trial 4+5 needs 누적 확정/반증)**:
  - **Badge** 첫 dogfood 적용 — phase 14가 ppt에서 실제 동작하는가
  - **Alert/Banner** 3회째 evidence — needs 확정 여부
  - **IconButton** 부활 가능성 — Trial 6 Presentation은 nav prev/next + slide delete 등 icon-only 다수. Trial 5에서 0회로 격하했던 needs가 재상승하는가
  - **ToggleGroup** 2회째 evidence — Verbosity(Trial 5) 외 toggle 패턴이 있나
- **H4 (3-panel 신규 needs)**: drag-and-drop, panel resize, dense info bar 등 Presentation 특유 패턴이 신규 needs 부상시키나.

## 2. 사용자

- **1차**: 원익IPS 사내 React 개발자. dogfood로 ranking 갱신된 needs는 Phase 16+ input.
- **2차**: ppt 사용자 — `trial-6-presentation` branch로 격리, main 영향 0.

## 3. 범위 (in-scope)

design_system repo:
- `phases/15-trial-6-presentation/` 폴더 (spec/plan/tasks/step{0,1,...}.md/index.json)
- `docs/dogfood-trial-6.md` 신규 — 발견사항 정리
- `pkg-out/trial-6-presentation-*.png` — 캡쳐 evidence
- `phases/index.json` 업데이트 — phase 15 entry 추가

ppt repo (별도 branch `trial-6-presentation`):

| # | line (대략) | 현재 | 처리 |
|---|---|---|---|
| 1 | local Spinner func (~45-65) + 사용 4곳 | 자체 Spinner | `import { Spinner } from "@wonik/web"` + `<Spinner>` (Trial 4 답습) |
| 2 | 514 — generation placeholder `<div className="rounded-xl border ... p-16">` | inline rounded+border Card 패턴 | **`<Card variant="surface" padding="lg">`** (Trial 6 첫 Card dogfood) |
| 3 | 729 — `<span className="px-2 py-0.5 rounded bg-surface border-border">{current.layout}</span>` | inline subtle pill | **`<Badge variant="neutral">{current.layout}</Badge>`** (**Trial 6 첫 Badge dogfood!**) |
| 4 | 735 + 745 — slide nav prev/next icon-only `<button>` | inline icon button | **`<Button variant="text" size="sm" aria-label="이전/다음 슬라이드">`** — IconButton 부활 evidence 측정 |
| 5 | 142 — slide thumbnail delete (`x` 빨강) | inline `bg-red-500/80 rounded-full` icon | **`<Button variant="danger" size="sm" aria-label="슬라이드 N 삭제">`** — IconButton danger 변형 |
| 6 | 568 — PPTX download `<button bg-primary>` | inline primary button | **`<Button variant="primary" size="sm">`** |
| 7 | 687 — "슬라이드 추가" dashed border button | inline dashed button | **그대로 유지** — Trial 4가 이미 격하한 needs. Trial 6에서 재등장 = pattern repeat 확인만 |
| 8 | 484 — error alert `role="alert" rounded border-red bg-red`  | inline alert | **그대로 유지** — Alert 3회째 evidence 누적. 본 trial에서 교체 안 함 (Phase 16 후보) |

inline style 정책: Trial 4/5 동일. 시각도(color/border/radius/padding) inline style 0. layout(width/margin/flex/display)만 허용.

데이터: dev-only fixture로 더미 슬라이드 3개 주입 (Trial 4 store seed 패턴 답습). 실데이터·backend 호출 0.

## 4. 범위 외 (out-of-scope)

- **design_system 코드 변경 금지** — `packages/`, `apps/`, CLAUDE.md, docs(PRD/ARCHITECTURE/ADR/UI_GUIDE) 모두 0. trial 원칙(Trial 1~5 답습).
- **새 컴포넌트 추가 금지** — Alert·ToggleGroup·IconButton needs가 강해도 본 trial은 *발굴*만.
- **새 토큰 추가 금지**.
- **AiChatPanel 내부 교체 금지** — 본 trial은 Presentation.tsx 본체만. nested 컴포넌트는 별도 trial.
- **드래그앤드롭 / Sortable 영역 시각 변경 금지** — @dnd-kit 동작 우선, 시각 변경 위험. layout만.
- **regenerate flow / SSE 트리거 금지** — backend 호출 0.
- **시각도 inline style 0** — color/border/radius/padding (Trial 4·5 답습).
- **`tokens.css` import 금지**.
- **AI 슬롭 anti-pattern 도입 0**.
- **React 19-only API 금지** (ADR-008).
- **테스트 변경 금지** — 186 passing 유지.
- **여러 페이지 동시 교체 금지** — Presentation 한 페이지만.

## 5. 성공 기준 (S1~S10)

```bash
# (S1) design_system 코드 변경 0
git diff packages/ apps/ CLAUDE.md docs/PRD.md docs/ARCHITECTURE.md docs/ADR.md docs/UI_GUIDE.md | wc -l  # == 0

# (S2) trial 산출물
test -f docs/dogfood-trial-6.md
test -f pkg-out/trial-6-presentation-default.png

# (S3) 4가설 모두 trial 문서에 발견 명시
grep -q "H2" docs/dogfood-trial-6.md
grep -q "H3" docs/dogfood-trial-6.md
grep -q "H4" docs/dogfood-trial-6.md

# (S4) Trial 4+5+6 누적 ranking 명시
grep -E "Phase 16|누적|Trial 4.*Trial 5.*Trial 6" docs/dogfood-trial-6.md

# (S5) 슬롭 anti-pattern 0
! grep -i -E "glassmorphism|gradient orb|lottie|backdrop-filter: blur" docs/dogfood-trial-6.md

# (S6) 회귀 테스트 통과
pnpm -F @wonik/web test  # ≥ 186 passing

# (S7) phases/index.json — phase 15 추가
grep -q "15-trial-6-presentation" phases/index.json
```

정성 기준:
- (S8) 3-panel 동시 깔림 시 Card + Badge + Button 4종(primary/danger/text·variant) + Spinner 시각 회귀 0.
- (S9) Badge가 ppt 원본 inline subtle pill과 시각 호환됨 입증 (cascade ✅).
- (S10) IconButton 격하 결정의 검증 — Button text/sm이 작은 icon-only로 작동하나, 자연 OR 어색 정직 판정.

## 6. 가설 검증 매트릭스 (8행)

| # | 항목 | 가설 | 예상 | 실제 (캡쳐 보고 채움) | 결론 |
|---|---|---|---|---|---|
| 1 | 3-panel cascade (left thumb / center preview / right edit) | H2 | Trial 4+5 cascade 일관 재현 | — | ✅/❌ |
| 2 | Card variant=surface padding=lg 적용 (generation placeholder) | H2 + H3 Card 확장 | 자연 호환 | — | ✅/❌ |
| 3 | **Badge variant=neutral 첫 dogfood** (slide layout label) | H2 + H3 Badge phase 14 검증 | ppt 원본 inline pill과 시각 호환 | — | ✅/❌ |
| 4 | Button text/sm 작은 nav icon (prev/next slide) | H3 IconButton 부활 측정 | 어색하면 IconButton needs 부활, 자연하면 Trial 5 격하 유지 | — | needs ✅/❌ |
| 5 | Button danger/sm 작은 delete icon | H3 IconButton | (4와 동일 측정) | — | needs ✅/❌ |
| 6 | Button primary/sm PPTX download | H2 | Trial 4·5와 동일 일관 | — | ✅/❌ |
| 7 | "슬라이드 추가" dashed: 그대로 유지 (reaffirm Trial 4 격하) | H3 reaffirm | 1회 더 등장 — 격하 유지 | — | needs ❌ (격하 유지) |
| 8 | Error alert 그대로 유지 (Alert 3회째 evidence) | H3 누적 | Trial 4 inconclusive + Trial 5 1회 + Trial 6 1회 = 3회 누적 → needs 확정 | — | needs ✅ (확정) |

추가 관찰:
- **ToggleGroup**: Presentation에 toggle 패턴 부재 가능 — Trial 5 1회로 멈춤 (Phase 16 후보에서 보류 결정)
- **신규 needs (H4)**: drag handle / panel divider / sortable feedback / status indicator 등 3-panel 특유 패턴

## 7. 결승선

- S1–S10 모두 충족
- `phases/15-trial-6-presentation/index.json` 모든 step `completed`
- `docs/dogfood-trial-6.md` 마지막 섹션 **Phase 16 후보 ranking** (Trial 4+5+6 누적)
- `phases/index.json`에 phase 15 entry 추가
- ppt `trial-6-presentation` branch — main 머지 안 함

## 8. 향후 결정 후보

- 강한 needs (Trial 4+5+6 누적 3회+): Phase 16 후보
- 중간 needs (2회): 다음 trial까지 보류
- 약한 needs (1회): YAGNI
- H4 신규: 별도 ranking — Trial 7+ 누적 후

## 9. CLARIFY 결정사항

| # | 결정 | 사유 |
|---|---|---|
| C1 | dev fixture — 더미 slides 3개 주입 (Trial 4 store seed 패턴) | backend 호출 0 + 시각 검증 충분 |
| C2 | 시각도 inline 0 유지, layout 허용 (Trial 4·5 답습) | cascade 측정 가능성 |
| C3 | "슬라이드 추가" dashed: 그대로 유지 | Trial 4 격하 reaffirm 측정 |
| C4 | Error alert 그대로 유지 | Alert 3회째 evidence 누적이 본 trial 핵심 |
| C5 | trial branch `trial-6-presentation`, viewport 1280×1024 | 일관성 |
| C6 | 캡쳐 파일명 `pkg-out/trial-6-presentation-default.png` | 일관 |
| C7 | nav prev/next + delete: Button text/sm + danger/sm로 시도 → 어색 OR 자연 정직 측정 | Trial 4 패턴 답습 + IconButton needs 검증 |
| C8 | regenerate / AI chat / right panel edit 영역 교체 안 함 | scope 폭증 회피, 본 trial은 main view 위주 |

## 10. 보안·엣지·성능

- **보안**: trial branch isolation, dev-only fixture 가드(`import.meta.env.DEV`), 캡쳐 데이터 더미만, hex 0.
- **엣지**: dev server port fallback(Trial 5 learning), backend 미가용 → fixture 우회, headless `--virtual-time-budget=8000`.
- **성능**: 해당없음 — dogfood phase.
