# Phase 11 — Trial 4: Outline 페이지 dogfood (spec.md)

> autopilot PHASE 1 (SPECIFY) 산출물.

## 1. 목표

ppt `Outline.tsx` + `OutlineCard.tsx` 한 페이지를 통째로 dogfood해 두 가지 가설을 동시 검증한다.

- **H2 (시각 일관성)**: `@wonik/web` 컴포넌트 여러 개(Spinner + Button + Input)가 한 페이지에 동시에 깔렸을 때 border-radius·focus·spacing·color가 서로 일관되는가, 아니면 회귀가 보이는가.
- **H3 (needs 발굴)**: ppt가 자체 구현한 패턴(Card, Alert/Banner, IconButton, Badge, EmptyState) 중 우리 design system이 *지금* 무엇을 우선 추가해야 하는지를 실제 사용 사례로 캡쳐한다.

## 2. 사용자 (누가 쓰나)

- **1차**: 원익IPS 사내 개발자 (이번 trial은 ppt 1개 사용처). dogfood로 발굴된 컴포넌트 needs는 향후 사내 다른 web service에 재사용된다.
- **2차 (간접)**: ppt를 사용하는 사내 사용자 — Outline 페이지의 시각·UX 회귀가 0이어야 trial 자체가 valid.

## 3. 범위 (in-scope)

design_system repo:
- `phases/11-trial-4-outline/` 폴더 (spec.md/plan.md/tasks.md/step{0,1,...}.md/index.json)
- `docs/dogfood-trial-4.md` 신규 — 발견사항 정리
- `pkg-out/trial-4-outline-*.png` — 캡쳐 evidence

ppt repo (별도 branch `trial-4-outline`):
- `frontend/src/pages/Outline.tsx`: 자체 Spinner 함수 제거 + `@wonik/web` Spinner import. 일반 `<button>` ×3 (다시 시도/승인하고 생성/+ 슬라이드) → Button.
- `frontend/src/components/OutlineCard.tsx`: 인라인 편집 `<input>` → Input. **icon-only `<button>` ×3 (위/아래/삭제)도 우리 Button(`size='sm'`)로 교체 시도** — 시각상 어색하면 캡쳐로 입증하고 IconButton needs 등록, 자연스러우면 교체 유지. (CLARIFY 결정.)
- **inline style 정책**: color/border/radius/padding 같은 시각도 보정 0 유지. 단 layout(width/margin/flex/display) 보정은 허용 — 우리 컴포넌트가 페이지 레이아웃에 *끼워지는* 데 필요한 최소 hook. (CLARIFY 결정.)
- **데이터**: 캡쳐 evidence는 공개 가능 더미 outline 3개("AI 트렌드"/"도입 사례"/"결론") 기준. 실데이터 outline 사용 금지 → PNG가 commit돼도 사용자 데이터 노출 0. (CLARIFY 결정.)

## 4. 범위 외 (out-of-scope) — "이건 안 한다"

- **design_system 코드 변경 금지** — `packages/`, `apps/web-sandbox/`, `CLAUDE.md`, `docs/PRD.md`/`ARCHITECTURE.md`/`ADR.md`/`UI_GUIDE.md` 모두 0. trial은 발견이 1차 가치, 반영은 별도 phase.
- **새 컴포넌트 추가 금지** (Card, Alert, IconButton, Badge, EmptyState 등) — 이번 trial은 needs *발굴*만. 추가 결정은 phase 12+.
- **새 토큰 추가 금지** — 새 색·spacing이 필요해 보여도 본 trial에서는 추가하지 않음.
- **ppt 측 시각도 보정 `style` 금지** — color/border/radius/padding inline style 0 (CLARIFY: layout(width/margin/flex/display)만 예외 허용).
- **`tokens.css` import 금지** — 우리 css가 ppt 변수를 덮어쓰면 발견 측정 불가. ADR-010 cascade(host 우선)가 trial의 검증 대상이기도 함.
- **ppt 측 `--color-*` 변수 이름 변경 금지** — host 변경은 trial 영역 아님.
- **여러 페이지 동시 교체 금지** — Outline 한 페이지만. Home은 Trial 3에서 다룸, Presentation/History는 후속 trial.
- **AI 슬롭 anti-pattern 도입 0** — backdrop-filter blur, gradient text, glow 애니메이션, 보라/인디고 brand color, 모든 카드에 `rounded-2xl` 일괄 적용 등 (UI_GUIDE.md).
- **React 19-only API 금지** — ppt 측 코드에도 `useFormStatus`/`useOptimistic`/`use()` 사용 금지 (ADR-008).
- **테스트 변경 금지** — 163 tests passing 상태 그대로 유지.

## 5. 성공 기준 (측정 가능, GATE 1 대상)

```bash
cd C:/Users/ohjih/design_system

# (S1) design_system 코드 변경 0 — packages·apps·CLAUDE.md·docs(ADR/PRD/ARCHITECTURE/UI_GUIDE)
git diff packages/ apps/ CLAUDE.md docs/PRD.md docs/ARCHITECTURE.md docs/ADR.md docs/UI_GUIDE.md | wc -l
# == 0

# (S2) trial 산출물 존재 — error/empty는 의도적 out-of-scope (CLARIFY 결정)
test -f docs/dogfood-trial-4.md
test -f pkg-out/trial-4-outline-loading.png      # 로딩 상태 캡쳐
test -f pkg-out/trial-4-outline-edit.png         # outline 편집 상태 캡쳐 (핵심, 더미 outline 3개)

# (S3) trial 문서가 두 가설 모두에 대한 발견을 담고 있음
grep -q "H2" docs/dogfood-trial-4.md
grep -q "H3" docs/dogfood-trial-4.md
grep -q "발견" docs/dogfood-trial-4.md

# (S4) 발굴된 needs가 우선순위 매겨져 있음 (다음 phase 후보)
grep -E "Phase 12|needs|후보" docs/dogfood-trial-4.md

# (S5) 슬롭 anti-pattern 도입 0
! grep -i -E "glassmorphism|gradient orb|lottie|backdrop-filter: blur" docs/dogfood-trial-4.md

# (S6) 회귀 테스트 통과
pnpm -F @wonik/web test    # == 163 passing
```

추가 정성 기준 (시각 — 캡쳐 보고 판정):
- (S7) Outline 편집 화면에서 우리 Button이 ppt 기존 button과 시각적으로 일관 (border-radius·padding·focus 차이가 *읽기 쉽게 비교됨* — 회귀 0이면 좋고, 회귀 있으면 정확히 어디서 깨졌는지 캡쳐로 입증).
- (S8) OutlineCard 인라인 편집 input에 우리 Input 적용 시 ADR-010 cascade가 작동(host의 `--color-bg`·`--color-primary` 흡수)하거나, 깨지면 그 지점을 정직하게 캡쳐.
- (S9) 발견사항이 가설 검증과 connected — "그냥 봤더니 별로였다"가 아니라 "H2/H3 어느 가설을 어떻게 입증/반증했나" 명시.

## 6. 가설 검증 매트릭스 (캡쳐 분석 시 채울 표 — trial-4.md에 들어감)

| 항목 | 가설 | 예상 | 실제 (trial 후 캡쳐 보고 채움) | 결론 |
|---|---|---|---|---|
| Spinner + Button + Input 3종 동시 깔림 | H2 | ADR-010 cascade로 시각 일관 | — | ✅/❌ |
| Button hover/focus가 ppt button과 시각 일관 | H2 | focus outline·hover bg 일관 | — | ✅/❌ |
| Input 인라인 편집(OutlineCard) 시 host bg 흡수 | H2 (ADR-010 회귀) | `--color-bg` 흡수, 시각 회귀 0 | — | ✅/❌ |
| 작은 icon-only button(위/아래/삭제)에 우리 Button 교체 시도 | H3 | size/padding 부적합 → IconButton needs 입증 가능성 큼 | — | needs ✅/❌ |
| Card 패턴 4회 반복 (loading/generation/empty/OutlineCard) | H3 | Card 컴포넌트 needs 강함 | — | needs ✅/❌ |
| Alert/Banner (error) | H3 | semantic-color + dismiss needs | — | needs ✅/❌ |
| Badge (layout 표시) | H3 | needs 약함 (1회만 등장) | — | needs ✅/❌ |
| Empty state ("아웃라인이 없습니다") | H3 | needs 약함 (1회만, 단순) | — | needs ✅/❌ |

## 7. 결승선 (Phase 11 closure 조건)

- 위 S1–S9 모두 충족
- `phases/11-trial-4-outline/index.json`의 모든 step `status: "completed"`
- `docs/dogfood-trial-4.md` 마지막 섹션에 **Phase 12 후보 needs 우선순위 1·2·3** 명시 (vague한 "더 봐야 함" 금지)
- ppt repo `trial-4-outline` 브랜치는 main에 머지하지 않음 (사용자 결정 영역)

## 8. 결승선 외 — 향후 결정 후보

trial 결과로 부상한 needs 중 phase 12+ 진입 후보:
- 강한 needs (4회+ 반복): 우선순위 1
- 중간 needs (2–3회): 우선순위 2
- 약한 needs (1회): 우선순위 3 (추가는 다음 dogfood까지 보류 — YAGNI)

각 needs는 별도 phase에서 ADR + spec + 구현 사이클로 들어간다.
