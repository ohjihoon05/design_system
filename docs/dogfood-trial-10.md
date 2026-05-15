# Dogfood Trial 10: ppt Outline 통째 재dogfood — Alert/Badge/Card 첫 적용

**날짜**: 2026-05-15
**대상 product**: ppt (Factory PPT)
**적용 범위**: `frontend/src/pages/Outline.tsx` + `frontend/src/components/OutlineCard.tsx` 전체
**목표**: trial 4(branch-only, main 미머지) 후속 작업을 main에 closure + trial 4 이후 추가된 atoms(Alert, Badge, Card)의 첫 Outline 적용. trial 4의 H3 evidence(Card 4+ 반복, Badge 3회, Alert evidence 부족)를 *실제 production 적용*으로 입증/갱신.

## 적용 방식

trial 4에서 만든 `trial-4-outline` branch는 main에 머지되지 않았다. 그 결과 main의 Outline.tsx + OutlineCard.tsx는 **`@wonik/web` 적용 0%**인 상태였다. trial 10은 이를 바로잡으면서 trial 4 이후 추가된 atoms도 함께 도입.

### Outline.tsx 변경 (10 element)

| # | 위치 | Before | After | 새 atom 첫 적용? |
|---|---|---|---|---|
| 1 | line 19-43 | 자체 inline `function Spinner` (24줄) | 삭제 + `import { Spinner } from "@wonik/web"` | — |
| 2 | Loading state | `<Spinner className="h-8 w-8 ...">` | `<Spinner size="lg">` | — |
| 3 | Error fallback alert div (6줄) | raw `<div role="alert">` | `<Alert>{error}</Alert>` | ⭐ Alert (Outline) |
| 4 | Error 재시도 button | raw `<button>` + className | `<Button variant="text" size="sm">` | — |
| 5 | Outline-generating wrapper | raw rounded+border+bg+padding (5 utility) | `<Card variant="elevated" padding="lg">` | ⭐ Card (1번째) |
| 6 | Generation-progress wrapper | raw 동일 패턴 | `<Card variant="elevated" padding="lg">` | ⭐ Card (2번째) |
| 7 | 승인 button | raw `<button>` + 8 utility class | `<Button variant="primary" size="md">` | — |
| 8 | Error banner with dismiss (14줄) | raw `<div role="alert">` + 닫기 button | `<Alert onDismiss={clearError}>{error}</Alert>` | ⭐ Alert with onDismiss (Outline) |
| 9 | Empty state wrapper | raw rounded+border+bg+padding | `<Card padding="md">` | ⭐ Card (3번째) |
| 10 | "+ 슬라이드 추가" dashed button | raw `<button>` + dashed border | `<Button variant="outline" size="md" style={{width: '100%'}}>` | — |

### OutlineCard.tsx 변경 (6 element)

| # | 위치 | Before | After | 새 atom 첫 적용? |
|---|---|---|---|---|
| 1 | Card outer wrapper | raw rounded+border+bg+padding+hover-border | `<Card variant="surface" padding="md">` | ⭐ Card (4번째) |
| 2 | 인라인 편집 input | raw `<input>` + 6 utility class | `<Input size="sm">` | — |
| 3 | Layout indicator span | raw `<span>` + 8 utility class | `<Badge variant="neutral">{slide.layout}</Badge>` | ⭐ Badge (Outline) |
| 4 | 위로 이동 icon button | raw `<button>` + svg | `<Button variant="text" size="sm" aria-label>` | — |
| 5 | 아래로 이동 icon button | raw `<button>` + svg | `<Button variant="text" size="sm" aria-label>` | — |
| 6 | 삭제 icon button | raw `<button>` + svg + red hover | `<Button variant="danger" size="sm" aria-label>` | — |

### 시각 polish 손실 (트레이드오프)

- OutlineCard outer의 `hover:border-[var(--color-primary)]/30` (마우스 올리면 border 강조) → Card에 hover variant 없어 손실
- Add-slide button의 `border-2 border-dashed` (점선 테두리) → Button outline은 solid border. 트레이드오프 명시
- editing input의 `focus:ring-1 focus:ring-[var(--color-primary)]` → Input 자체 focus 처리 (ADR-011 module-scope CSS, focus indicator 표준)로 대체

## 발견사항

### F14 — branch-only trial은 main과 자동 분리된다

trial 4가 `trial-4-outline` branch에서 검증 후 main 머지 안 된 채 4 phase 지나가면서 main의 Outline은 **0% 적용 상태로 결빙**. 사용자가 ppt를 빌드/실행할 때 보는 건 *영원히 trial 4 이전*. trial 10에서 처음 main에 들어간다.

→ **branch dogfood는 검증 도구지 적용 도구가 아님**. 머지 전제로 진행하거나, "검증만"임을 명시해야 함. 본 trial 10에서는 main에 직접 적용으로 패턴 변경.

### F15 — trial 4 H3 우선순위 1(Card)이 trial 10에서 정확히 입증

trial 4 doc은 Card needs를 "강함, 4+ 반복"으로 예측. trial 10 적용 결과:

| 위치 | trial 4 예측 | trial 10 적용 |
|---|---|---|
| loading wrapper | 1회 | `<Card variant="elevated" padding="lg">` |
| outline-generating wrapper | 1회 | `<Card variant="elevated" padding="lg">` |
| generation-progress wrapper | 1회 | `<Card variant="elevated" padding="lg">` |
| empty state wrapper | 1회 | `<Card padding="md">` |
| OutlineCard outer | 카드당 1회 | `<Card variant="surface" padding="md">` |
| **합** | **4+ (페이지) + 카드당 1** | **4 + 카드당 1 = 정확** |

→ trial 4의 evidence-driven 우선순위가 한 페이지 안에서 깔끔히 검증됨. **Card는 layer A 1차 채움에 들어간 게 옳았다**.

### F16 — Alert가 Outline에서 두 번째로 가치 입증 (Home 다음)

Home(trial 7)에서 한 번, Outline(trial 10)에서 두 번 — error UI 패턴이 host product 전체에서 반복됨. raw 14줄 → Alert 1줄 압축이 두 번째 입증. 두 번째 host 페이지에서 같은 가치가 나오는 게 design system 누적 가치의 본질.

| trial | 위치 | 라인 절감 |
|---|---|---|
| 7 | Home error banner | -14줄 |
| 10 | Outline error fallback | -6줄 |
| 10 | Outline error banner | -14줄 |
| **합** | 3 instance | **-34줄** |

### F17 — Badge가 *3회 evidence 모인 후* 적용으로 evidence-driven cycle의 정합 첫 입증

trial 4가 Badge needs를 "mid, 카드당 1회 × 3카드 = 3회"로 평가. atom 추가 결정 (Phase 14). trial 10에서 그 atom이 **Badge가 만들어진 페이지 그대로**(OutlineCard) 적용. Layer A의 evidence-driven cycle 한 바퀴 closure:

```
trial 4 → Badge needs 3회 발견 → Phase 14: Badge atom 추가 → trial 10: Badge 적용
```

→ 이게 ROADMAP M2의 "host needs 3회 → atom 추가" 규칙이 *실제로 작동*하는 첫 evidence.

### F18 — dashed border / hover-border-highlight 같은 polish는 atom variant로 부재 → host className 보강 vs atom 확장 결정 거리

Add-slide button의 dashed border는 trial 4에서 needs 약함(1회) 판정 → atom 확장 안 함. trial 10에서도 1회 (총 2회). 3회 trigger 멀음. host에서 className으로 보강 가능하나 본 trial은 design system 정합 우선이라 outline variant 그대로 사용. 시각 손실 명시.

OutlineCard outer의 hover-border-highlight도 비슷 케이스. Card에 hover variant 추가 vs host에서 className 보강 vs polish 포기 — trial 11+ evidence 누적 후 결정.

## 가설 검증

| 가설 | 검증 방법 | 결과 |
|---|---|---|
| H12: trial 4의 Card 4회 evidence가 trial 10 적용에서 정확히 매칭 | 위치별 카운트 | ✅ 4 + 카드당 1 (예측 그대로) |
| H13: Alert가 두 번째 host 페이지에서도 동일 가치 (라인 절감) | line count | ✅ Outline 2 instance × 평균 10줄 = -20줄 |
| H14: Badge가 atom 추가 → 적용까지 evidence-driven 사이클 매끄럽게 closure | trial 4 → Phase 14 → trial 10 흐름 | ✅ 3 step 한 사이클 한 번에 닫힘 |
| H15: dashed border 같은 polish가 trial 10에서 needs 트리거 | 추가 evidence 누적 | ❌ (현재) — 1회 더 발견(총 2/3), 3회 안 됨 |
| H16: branch dogfood가 main 적용으로 자동 흐름 | trial 4 → trial 10 흐름 추적 | ❌ — 자동 머지 없음, trial 10에서 처음 main 들어감 |

## 결정

- **trial 4 closure** — main에 적용 완료. trial 4의 모든 substitution + 이후 atoms(Alert/Badge/Card) 한 번에.
- **branch dogfood 패턴 재정의** — 검증/실험은 branch, 적용은 main 직접. ROADMAP에 dogfood 패턴 정책 한 줄 추가 후보.
- **dashed Add-button atom 화 보류** — evidence 2/3, 1회 더 모이면 결정.
- **Card hover variant 검토 보류** — evidence 1/3, 추가 needs 누적 후 결정.
- **trial-N narrative 주석은 후속 cleanup 거리** — `/* trial 10: ... */` 같은 코드 주석은 PR 메시지/dogfood doc로 이미 기록됨, 코드에서는 시간 지나면 rot. 별도 trial에서 일괄 제거 검토.

## 누적 evidence 갱신 (ROADMAP M2 표)

| atom 후보 | 누적 evidence | 변화 |
|---|---|---|
| ToggleGroup | 2/3 | 변화 없음 (Outline에 chip selector 없음) |
| FormField | 1/3 | 변화 없음 (Outline에 label+Input+error 묶음 없음) |
| RadioGroup | 1/3 | 변화 없음 |
| **Add-dashed Button variant** | 신규 등록 → **2/3** | trial 4 + trial 10에서 동일 패턴 |
| **Card with hover variant** | 신규 등록 → **1/3** | OutlineCard hover-border-highlight 손실 |
| Modal/Dialog · Tabs · Tooltip | 0/3 | — |

## 후속 작업 (미완 / 후보)

- [ ] 시각 검증 — 사용자가 브라우저(http://localhost:3000)에서 Outline 페이지 둘러보고 어색함 여부 보고
- [ ] dashed Add-button 1회 더 발견 시 atom 또는 variant 확장 결정
- [ ] OutlineCard hover-border-highlight 추가 발견 시 Card hover variant 추가 검토
- [ ] trial-N narrative 주석 일괄 제거 (별도 cleanup cycle)
- [ ] Presentation 페이지(trial 6 통째) 재dogfood — 같은 atoms 적용 가능 여부 확인 (trial 11 후보)
