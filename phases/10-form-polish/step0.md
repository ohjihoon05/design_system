# Step 0: ADR-011 — form control polish 정책

## 읽어야 할 파일

먼저 아래를 읽고 ADR 형식 + Switch.tsx의 CSS injection 패턴 + 기존 미해결 발견을 파악하라:

- `/CLAUDE.md` (CRITICAL — 토큰 변경 ADR + Changesets minor, React 18·19 dual peer)
- `/docs/dogfood-trial-3.md` (Trial 3 1차 발견 2·3·4 — resize·focus·placeholder 미해결)
- `/docs/dogfood-trial-3-recapture.md` (Phase 09 closure 시점에서 남은 발견 명시)
- `/docs/ADR.md` (특히 ADR-010 line 142 — `--color-focus` future hook 언급)
- `/packages/web/src/Switch/Switch.tsx` (CSS injection pattern reference — `ensureCssInjected()` + `:focus-visible + outline 2px + outline-offset 2px + var(--color-primary)` 이미 채택)
- `/packages/web/src/Input/Input.tsx`, `/packages/web/src/Textarea/Textarea.tsx` (현재 `outline: 'none'`만 — focus 처리 0)

## 작업

`docs/ADR.md`에 **ADR-011: form 컨트롤 focus·resize·placeholder·hover 정책**을 추가한다. design_system 코드 변경 0 — 본 step은 ADR 결정 단독. 후속 step 1·2·3에서 토큰·컴포넌트·검증 구현.

이 step의 목적: **Trial 3 1차에서 발견한 form 컨트롤 미해결(invisibility 외 focus·resize·placeholder)에 대한 정책 결정 + 부수 발견(hover state universal gap) 일괄 처리**.

### 외부 조사 evidence (요약, full source는 ADR에 인용)

| 항목 | 산업 표준 (조사 결과) |
|------|------|
| Focus selector | `:focus-visible` (2022-03 Safari ship으로 baseline widely available, MDN) |
| Focus ring | outline 2px, WCAG 1.4.11 비텍스트 3:1 contrast 충족 필수 |
| Focus offset | Input/Textarea: 0px (border 통합, Material 3 outlined 패턴) / 그 외: 2px (Radix Themes 패턴) |
| Focus style | `outline` (box-shadow 아님 — Radix가 마이그레이션, border-radius 자동 추적) |
| Focus color | 분리파(Primer/Radix/Chakra) vs 재사용파(Material/Bootstrap) 양분 — layer A 정신상 별도 격상이 우월 |
| Resize default | vertical(MDN 권장) vs none(layout 보존) 양분. 1단계 dogfood(ppt)는 vertical 자연 |
| Placeholder | WCAG 1.4.3 contrast 대상. `::placeholder` `opacity: 1` 명시 필수 (Firefox default <1 함정) |
| Hover state | Material 3·Radix universal pattern — 현재 우리 시스템 gap |

### 핵심 결정 (조사 결과 기반)

1. **Focus selector**: `:focus-visible` only. fallback 없음 (2026 환경 안전).
2. **Focus ring**: `outline: 2px solid var(--color-focus, var(--color-primary, var(--color-primary-internal)))` 3-단 cascade. **`--color-focus`를 7번째 interface variable로 격상** — ADR-010 line 142의 future hook을 실현.
3. **Focus offset**: Input/Textarea는 0px (border 통합 dual-cue). Button/Checkbox/Radio/Switch는 2px (Switch 기존 패턴 일관).
4. **Resize default**: `vertical` 유지 + `Textarea`에 `resize?: 'none' | 'vertical' | 'both'` prop 노출 (default `vertical`). BC 깨지 않음, host product별 선택권.
5. **Placeholder color**: `::placeholder { color: var(--color-placeholder, var(--color-text-muted-internal)); opacity: 1; }`. **interface variable 격상 안 함** (YAGNI — text-muted fallback으로 1단계 충분).
6. **Hover state 추가**: Input/Textarea에 `:hover { border-color: var(--color-border-strong, var(--color-border-mid-internal)) }` 1줄. universal gap 보충.
7. **구현 방식**: `ensureCssInjected()` 1회-inject pattern (Switch.tsx 참조). pseudo-class를 inline style로 못 풀기 때문. 각 컴포넌트가 자기 CSS block 정의.

### ADR-011 작성 형식

기존 ADR 패턴 (결정/이유/트레이드오프 3-section + 필요 시 구현 방향). 다음 본문 구조:

```markdown
### ADR-011: form 컨트롤 focus·resize·placeholder·hover 정책

**결정**: `@wonik/web`의 form 컨트롤(Button/Input/Textarea/Checkbox/Radio/Switch)에 다음 7개 정책을 일괄 적용한다.

1. **Focus selector**: `:focus-visible` only (fallback 없음, baseline widely available 2026)
2. **Focus ring**: `outline: 2px solid var(--color-focus, var(--color-primary, var(--color-primary-internal)))`
3. **Focus offset**: Input/Textarea 0px (border-통합 dual-cue) / Button·Checkbox·Radio·Switch 2px (분리 ring)
4. **Resize default**: `vertical` 유지 + Textarea `resize?: 'none' | 'vertical' | 'both'` prop 노출
5. **Placeholder color**: `::placeholder { color: var(--color-placeholder, var(--color-text-muted-internal)); opacity: 1; }`
6. **Hover state**: Input/Textarea `:hover { border-color: var(--color-border-strong, var(--color-border-mid-internal)) }`
7. **구현 방식**: `ensureCssInjected()` 1회-inject (Switch.tsx 패턴) — pseudo-class·pseudo-element 처리

**interface variable 격상**: ADR-010이 결정한 6개 → 7개로 확장.
- 추가: `--color-focus` (focus ring color, primary fallback)
- 격상 안 함: `--color-placeholder` (text-muted fallback로 1단계 충분, YAGNI)

**이유**:

1. **WCAG 2.1 SC 2.4.7 (AA) 충족 필수** — 키보드 focus indicator visible. 현재 Input/Textarea의 `outline: 'none'`은 a11y regression. SC 1.4.11이 정량 보충 — 3:1 contrast. WONIK BLUE `#273E82` on 흰 surface ≈ 9:1로 안전.

2. **`:focus-visible`이 modern 표준 (2022-03 Safari ship)** — 키보드 focus만 indicator 보이고 마우스 click focus는 숨기는 패턴이 MDN/Igalia/caniuse 모두 baseline. 1단계 dogfood(ppt, React 19 + Vite + 최신 Chromium)는 fallback 불필요.

3. **outline > box-shadow** — Radix Themes가 box-shadow → outline으로 마이그레이션한 명시적 이유: Chrome anti-aliasing 안정, border-radius 자동 추적 (Chromium 94+/Safari 16.4+). modern 표준.

4. **`--color-focus`를 7번째 interface variable로 격상** — layer A 정신(host가 색을 own) 일관 적용. ADR-010 line 142가 이미 future hook으로 언급. Primer/Radix/Chakra가 분리 token 채택한 이유 — form-heavy product에서 brand-tinted ring이 산만할 수 있고, dark theme/high-contrast 모드에서 brand와 독립 조정 필요. default fallback이 primary라 host 미정의 시 회귀 0.

5. **`resize: vertical` default 유지 + prop opt-out** — MDN 권장 (사용자 자유 우선). 1단계 dogfood ppt는 long-form 설문/리서치 폼 — vertical 자연. layout-sensitive 산업용(반도체 dashboard) 등 future host는 prop으로 `'none'` 명시. BC 0.

6. **placeholder는 interface variable 격상 안 함 (YAGNI)** — WCAG 1.4.3 적용 대상이지만 1단계 dogfood에 별도 host override needs 없음. text-muted fallback으로 충분. dogfood로 needs 등장 시 ADR 갱신.

7. **hover state는 universal pattern, 1줄로 보충** — Material 3·Radix 모두 input의 hover 시 border-color 진해짐을 universal로 채택. 현재 우리 시스템 gap. Phase 10에서 같이 묶음(별도 phase로 분리 시 marginal value).

**구현 방향** (후속 step):

- **Step 1 (tokens)**: `build-css.ts`에 `--color-focus: var(--color-primary)` alias emit (light/dark 양쪽) + `interfaceColors`에 `focus` 추가 (3-단 cascade 형태) + `--color-border-strong: var(--color-border-mid)` alias (hover state용 internal fallback).
- **Step 2 (components)**: Button/Input/Textarea/Checkbox/Radio에 `ensureCssInjected()` 추가 — `:focus-visible`/`:hover`/`::placeholder` CSS block. Switch는 이미 패턴 적용됨 (focus만 검토, hover·placeholder 없음). Textarea에 `resize?: 'none' | 'vertical' | 'both'` prop 추가 (default `vertical`).
- **Step 3 (검증)**: ppt 또는 sandbox에서 focus/hover/placeholder 시각 캡쳐로 검증. focus state는 Chrome devtools `:focus-visible` toggle 또는 demo 페이지에서 Tab key simulate. trial-4 후보로 다른 dogfood surface 확장.

**트레이드오프**:

1. **interface variable 7개로 증가** — ADR-010의 6 set이 7로 확장. tokens.css 추가 emit 1개 (light/dark = 2 lines). host 학습 부담은 미미 (focus는 자연스러운 표준 이름).

2. **CSS injection이 form 컨트롤 8개 중 6개에 추가됨** — 현재 Switch만 inject 중. Button/Input/Textarea/Checkbox/Radio에 동일 패턴 추가 → tree-shake 시에도 1회/컴포넌트 inject. SSR 안전성은 `typeof document === 'undefined'` 가드로 이미 처리(Switch 패턴).

3. **inline style만 보고 컴포넌트 시각을 추론 못 함** — pseudo-class CSS가 외부에 있어 디버깅·snapshot 난이도 증가. 보완: 각 컴포넌트의 CSS block을 컴포넌트 파일 안에 module-scope로 두어 colocate 유지.

4. **`--color-focus`를 host가 override 안 하면 primary와 동일** — Trial 2·3 결과와 동일 시각. 분리 token의 가치는 host가 명시적으로 override할 때만 실현. 1단계 dogfood에선 가치 실현 0이지만 미래 host product 등장 시 회귀 0인 확장 hook.

5. **추가 form polish 영역(aria-disabled / autofill webkit / readonly visual / Card overflow + focus obscured) 미해결** — 1단계 dogfood 범위 외. ADR-011 본문에 future-work note로 명시. 등장 시 별도 ADR.

6. **AAA(WCAG 2.4.13 Focus Appearance) 미보장** — outline width 2px가 충족 후보지만, perimeter 면적 + pixel-level 3:1 변화 contrast의 정량 검증은 안 함. AA 목표 충족.

**Supersede / 관계**:
- ADR-010 보완: 7번째 interface variable 추가. layer A 정신 일관.
- ADR-007/008/009: 영향 없음.

**Future-work 노트** (1단계 외):
- aria-disabled 대안 패턴 (현재는 native `disabled` 충분)
- Webkit autofill 노란 배경 override (`-webkit-box-shadow inset` 트릭)
- readonly 시각 처리
- Card 컴포넌트 도입 시 focus indicator obscured (WCAG 2.2 SC 2.4.11 — padding ≥ outline-offset)
- AAA WCAG 2.4.13 Focus Appearance 정량 검증
```

(위 ADR 본문은 spec 예시 — 작성자가 ce-best-practices-researcher 산출과 사용자 의견 반영해 최종 작성)

### 산출물

1. `docs/ADR.md`에 ADR-011 추가
2. design_system 코드 변경 0 (`packages/`, `apps/`, `scripts/`, `CLAUDE.md` 그대로)

## Acceptance Criteria

```bash
cd C:/Users/ohjih/design_system

# ADR-011 추가됨
grep -q "### ADR-011" docs/ADR.md
grep -q "focus-visible" docs/ADR.md
grep -q "WCAG" docs/ADR.md
grep -q "color-focus" docs/ADR.md

# 기존 ADR 보존
grep -q "### ADR-010" docs/ADR.md
grep -q "### ADR-001" docs/ADR.md

# 결정·이유·트레이드오프 3-section
awk '/### ADR-011/,/### ADR-012|^---$/' docs/ADR.md | grep -q "\*\*결정\*\*"
awk '/### ADR-011/,/### ADR-012|^---$/' docs/ADR.md | grep -q "\*\*이유\*\*"
awk '/### ADR-011/,/### ADR-012|^---$/' docs/ADR.md | grep -q "\*\*트레이드오프\*\*"

# 핵심 결정 7개 모두 명시 (focus / resize / placeholder / hover)
awk '/### ADR-011/,/### ADR-012|^---$/' docs/ADR.md | grep -q "outline"
awk '/### ADR-011/,/### ADR-012|^---$/' docs/ADR.md | grep -q "resize"
awk '/### ADR-011/,/### ADR-012|^---$/' docs/ADR.md | grep -q "placeholder"
awk '/### ADR-011/,/### ADR-012|^---$/' docs/ADR.md | grep -q "hover"

# design_system 코드 변경 0
git diff packages/ apps/ scripts/ CLAUDE.md | wc -l    # 0

# AI 슬롭 anti-pattern 0
! grep -i -E "backdrop-filter: blur|gradient orb|lottie" docs/ADR.md
```

## 검증 절차

1. AC 커맨드 실행.
2. 체크리스트:
   - 7개 결정 모두 명시되었나? (focus selector·ring·offset·color / resize / placeholder / hover)
   - interface variable 7개 확장 명시?
   - 조사 evidence(WCAG, MDN, Material/Radix/Primer)가 ADR 본문 또는 트레이드오프에 인용?
   - layer A 정신(host가 색을 own)과 정합?
   - future-work 노트(aria-disabled·autofill·readonly·focus obscured·AAA)가 ADR-011 scope 외로 명확?
3. 결과에 따라 `phases/10-form-polish/index.json` step 0 → completed.

## 금지사항

- **design_system 코드 변경 금지** — 본 step은 ADR 작성 단독.
- **interface variable 7개 외 추가 금지** — placeholder 격상 안 함 (YAGNI 결정 보존).
- **prop signature 변경 명시 금지** — Textarea의 `resize?` prop은 후속 step 2의 영역. ADR엔 결정만 명시.
- **다른 ADR 수정 금지** — ADR-011 추가만.
- **AI 슬롭 anti-pattern 도입 0**.
- **외부 조사 결과를 ADR에 그대로 복사 금지** — evidence 인용 + 우리 결정 명시. source URL은 1-2건만.
