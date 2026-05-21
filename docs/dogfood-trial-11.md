# Dogfood Trial 11: ppt Presentation 재dogfood — Alert/Input/Textarea 첫 적용 + 보라 anti-pattern 제거

**날짜**: 2026-05-15
**대상 product**: ppt (Factory PPT)
**적용 범위**: `frontend/src/pages/Presentation.tsx` 미완 영역 12 element
**목표**: trial 6 후속 (Alert/Input/Textarea 추가 적용) + EditableField sub-component 정리 + AI 수정 button의 hardcoded 보라 `#8b5cf6` anti-pattern 제거. layer A 사이클 마감 직전 마지막 raw-element 청소.

## 적용 방식

trial 6는 main에 머지되어 Spinner/Button/Card/Badge가 이미 적용됨. trial 11은 그 사이 비어 있던 영역(error block, regenerate 패널, EditableField 안의 5 element, dashed Add Slide)을 일괄 substitution.

### 12 element 변경

| # | 위치 | Before | After | 비고 |
|---|---|---|---|---|
| 1 | import 라인 | `Spinner, Button, Card, Badge` | `+ Alert, Input, Textarea` | — |
| 2 | Error fallback (line 482-509) | raw `<div role="alert">` + raw 재시도 | `<Alert>{error}</Alert>` + `<Button variant="text" size="sm">` | Alert 외부 적용 4번째 |
| 3 | 개선 요청 toggle button | raw `<button border ...>` | `<Button variant="outline" size="sm">` | — |
| 4 | 재생성 input | raw `<input>` | `<Input>` (flex-1 wrapper) | Input 첫 외부 적용 |
| 5 | 재생성 submit button | raw `<button bg-primary>` | `<Button variant="primary" size="sm">` | — |
| 6 | 좌측 sidebar Add Slide dashed | raw dashed `<button>` | `<Button variant="outline" size="sm">` (dashed 손실) | dashed evidence 3/3 → trigger |
| 7 | EditableField AI 수정 button | raw `<button text-[var(--color-accent,#8b5cf6)]>` | `<Button variant="text" size="sm" style={{color: 'var(--color-status-processed-text)'}}>` | ⚠️ **anti-pattern fix** |
| 8 | EditableField 편집 button | raw `<button>` | `<Button variant="text" size="sm">` | — |
| 9 | EditableField multiline textarea | raw `<textarea>` | `<Textarea size="sm" resize="none">` | Textarea 외부 적용 2번째 (Home + Presentation) |
| 10 | EditableField single-line input | raw `<input>` | `<Input size="sm">` | — |
| 11 | EditableField 저장 button + inline spinner svg | raw `<button>` + 5줄 svg | `<Button variant="primary" size="sm">` + `<Spinner size="sm">` child | inline svg 5줄 제거 |
| 12 | EditableField 취소 button | raw `<button>` | `<Button variant="text" size="sm">` | — |

## 발견사항

### F19 — 보라 `#8b5cf6` anti-pattern이 host에서 발견 (CLAUDE.md violation)

`EditableField`의 "AI 수정" button이 `var(--color-accent, #8b5cf6)`로 정의돼있었다. `--color-accent`는 우리 토큰에도 ppt에도 정의 안 됨 → **fallback `#8b5cf6` (보라)이 항상 win**. CLAUDE.md "보라/인디고 brand color 금지" anti-pattern 정확 위반.

**해결**: 우리 토큰의 `--color-status-processed-text: #7C3AED` (semantic 보라, "processed status"용)로 위임. semantic purple은 status로 정의되어 있어 brand violation이 아님 — AI = "processed by AI"의 의미적 매핑.

```tsx
<Button
  variant="text"
  style={{ color: "var(--color-status-processed-text)" }}
>
  AI 수정
</Button>
```

→ design system 안에 *의미별 보라가 이미 있음*을 host가 모르면 host가 hardcode하게 됨. **token vocabulary가 host에 documentation으로 흘러야 한다**는 패턴.

### F20 — Add Slide dashed evidence가 trial 11에서 3/3에 도달 → atom 후보 자동 trigger

| trial | 위치 | dashed 사용 |
|---|---|---|
| 4 | Outline.tsx Add Slide | 1회 (격하 결정) |
| 6 | Presentation.tsx Add Slide (left sidebar) | 1회 (격하 reaffirm) |
| 11 | Presentation.tsx Add Slide (left sidebar) | 1회 (substituted, dashed 시각 손실 명시) |

→ 누적 3회. M2 evidence-driven 규칙에 따라 **trigger**. 그러나 trial 4·6·11 모두 evidence는 "약함"으로 평가됐고, outline variant로 우회가 자연스러웠음. **수치는 trigger지만 본질적 needs는 약함** — atom 추가 vs 단순 dashed visual prop 추가 vs 그대로 outline 사용 결정 거리.

### F21 — Input/Textarea가 EditableField에서 일관 적용 — sub-component-level dogfood

지금까지 dogfood는 page-level (Home/Outline/Presentation 자체). trial 11에서 처음으로 *page 안의 sub-component*(EditableField)에 일관 적용. EditableField는 4개 instance(title/subtitle/body/notes)에서 동시 사용되므로 substitution 1회로 4 instance 영향.

→ component-level dogfood가 page-level보다 *coverage 효율 4배*. 후속 trial 후보: `PromptRefineChat`, `AiChatPanel`, `OutlineCard`(이미 trial 10) 등 sub-component.

### F22 — `Spinner` child + `Button` parent 패턴이 raw inline svg를 5줄 청소

trial 11 #11(EditableField 저장 button)의 raw 5줄 inline svg → `<Spinner size="sm">` child 한 줄. trial 7 Alert + trial 8 Button과 같은 "componentry composition" 패턴.

```tsx
// Before (raw 5줄)
<svg className="animate-spin h-2.5 w-2.5" viewBox="0 0 24 24" ...>
  <circle ... />
  <path ... />
</svg>

// After (1줄)
<Spinner size="sm" />
```

### F23 — host 측 inline px(`marginRight: 6` × 3, `marginLeft: 6`) 추가됨 — F7 패턴 누적

trial 8 F7과 같은 패턴: Button 내부 svg/text spacing을 inline `style={{ marginRight: N }}`로 처리. host code라 CRITICAL 위반 아니지만, `<Stack direction="row" gap={2}>` wrap이 더 이상적.

→ 누적 evidence 4회 이상 (trial 8 ×2 + trial 11 ×4) — host 측 layout helper 사용 가이드 후보. QUICKSTART.md 추가 검토.

## 가설 검증

| 가설 | 검증 방법 | 결과 |
|---|---|---|
| H17: trial 6의 미완 영역이 Alert/Input/Textarea로 깔끔 청소 | 12 element 카운트 | ✅ 12/12 |
| H18: 보라 anti-pattern은 *token vocabulary 미공유*에서 발생 | AI 수정 button hardcoded `#8b5cf6` 발견 | ✅ status-processed-text 토큰 존재했지만 host가 모름 |
| H19: dashed evidence 3회 trigger가 명확한 atom needs를 의미 | 3 trial 누적 정량 분석 | △ 부분 — trigger는 됨, 본질 needs는 약함 (격하 결정 일관) |
| H20: sub-component(EditableField) dogfood가 4배 coverage | 1 substitution × 4 instance | ✅ |

## 결정

- **dashed Add Slide button**: trigger 도달했지만 본질 needs 약함. **atom 추가 보류**, 그대로 outline + 시각 손실 수용. 사용자가 "dashed visual 강력히 원함" 신호 시 재논의.
- **AI semantic purple**: `--color-status-processed-text: #7C3AED` 토큰을 AI 의미로 재사용. 새 토큰 추가 안 함. 본 결정은 "status purple = 'processed by system' semantic"으로 ADR-007에 짧게 추가 검토.
- **host inline px helper 가이드**: QUICKSTART.md에 "inline `style={{ margin }}` 대신 Stack gap 사용" 권장 한 줄 추가 후보 (별도 cleanup cycle).
- **trial-N narrative 주석**: trial 8 doc부터 누적된 결정 — 코드에 주석 둠. 후속 cleanup cycle에서 일괄 제거 고려.

## 누적 evidence 갱신 (ROADMAP M2)

| atom 후보 | 누적 → 갱신 | 결정 |
|---|---|---|
| ToggleGroup | 2/3 (변화 없음) | 1회 더 trigger 대기 |
| **Add-dashed Button** | 2/3 → **3/3 trigger** | **본질 needs 약함 — 보류 (격하 reaffirm)** |
| FormField | 1/3 (변화 없음) | 2회 더 |
| RadioGroup | 1/3 (변화 없음) | 2회 더 |
| Card with hover variant | 1/3 (변화 없음) | 2회 더 |
| **host 측 inline px helper 가이드** (Stack 권장) | 신규 → 4/3 | doc 갱신 거리 (atom 아님) |
| Modal/Dialog · Tabs · Tooltip | 0/3 | — |

## 후속 작업 (미완 / 후보)

- [ ] 시각 검증 — http://localhost:3000 에서 Presentation 페이지 들어가서 (어떤 presentation completed 상태) AI 수정 button 색상 확인 (#7C3AED semantic 보라로 보여야)
- [ ] AI semantic purple 결정을 ADR-007에 짧게 추가 (status purple 의미 확장)
- [ ] QUICKSTART.md에 "host 측 inline px 대신 Stack gap" 권장 한 줄 추가 검토
- [ ] dashed button — outline + dashed visual prop 추가 vs 별도 atom vs 그대로 결정 (사용자 의향 확인 거리)
- [ ] **layer A 사이클 마감 선언** — trial 11이 Layer A 1차 채움의 host 적용 마지막 큰 단위. ROADMAP에 마감 표시 + Layer B 진입 준비 시작
