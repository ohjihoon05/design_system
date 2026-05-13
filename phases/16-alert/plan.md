# Phase 16 — Alert (plan.md)

> autopilot PHASE 3 산출물.

## 1. 접근 방식

Card·Badge 패턴 답습:

```
[1] ADR-017 outline + Changeset draft + phase dir
       ↓
[2] TDD: types.ts + Alert.test.tsx (실패하는 테스트 먼저)
       ↓
[3] Alert.tsx 구현 → tests green
       ↓
[4] packages/web/src/index.ts re-export + 빌드
       ↓
[5] sandbox 매트릭스 섹션 + headless 캡쳐
       ↓
[6] ADR-017 finalize + PRD 업데이트(Phase 15·16 + layer A 종료 명시) + Changeset finalize + closure
```

design_system 내부 완결. dogfood(ppt 적용)는 Phase 17 후보 또는 layer A 종료 선언.

## 2. 기술 선택 근거

### 2.1 variant prop 없는 이유 (strict YAGNI)

Trial 4+5+6 evidence 모두 error 변형만. info/warning/success는 0회. Card(2 variants for 2 evidence types)·Badge(2 variants for 2 evidence types) 패턴 그대로 — variant당 1+ evidence가 원칙. Alert은 1 evidence type → 1 variant → variant prop 0.

needs 부상 시 minor bump:
```diff
- export interface AlertProps { ... }
+ export type AlertVariant = 'info' | 'warning' | 'error' | 'success';
+ export interface AlertProps {
+   variant?: AlertVariant;  // default 'error' (하위 호환)
+   ...
+ }
```

추가가 non-breaking. preemption 0.

### 2.2 onDismiss로 dismiss 처리

별도 `dismissable: boolean` + `onClose` 패턴 대신 단일 `onDismiss` callback. 유무로 분기. API 단순.

### 2.3 role="alert" 강제

Spinner의 role/aria-busy 강제 패턴 답습. screen reader 알림은 error alert의 핵심 a11y — consumer override 막아 회귀 방지.

### 2.4 statusTokens.alarm 사용 (interfaceColors 신설 0)

이미 존재하는 토큰 재활용. 새 interface variable 추가 시 ADR 부담 + host product가 override할 필요성 부상 시(`--color-alert-bg`) 다음 ADR로 격상. 1단계는 internal token으로 충분.

## 3. 의존성

- 이미 존재: react@^18||^19, @wonik/tokens(statusTokens, space, radius, fontSize, lineHeight), vitest, typescript@5.7.
- 새 의존성 0.

## 4. 아키텍처 결정

### 4.1 단순 inline style 합성

```tsx
const composed: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: onDismiss ? 'space-between' : undefined,
  gap: space[3],
  padding: `${space[5]} ${space[6]}`,
  borderRadius: radius.md,
  fontSize: fontSize.titleSm,
  lineHeight: lineHeight.tight,
  background: statusTokens.alarm.bg,
  color: statusTokens.alarm.text,
  border: `1px solid ${statusTokens.alarm.border}`,
  ...style,
};
```

### 4.2 dismiss × 버튼 — module-scope CSS inject 불필요

inline style + native `<button>`로 충분. hover 효과는 inline `:hover` 못 박지만 — Trial evidence 모두 hover 0 important. needs 부상 시 `ensureCssInjected()` 패턴 추가 (Card·Switch·Button 답습).

### 4.3 className: `wonik-alert` + user

Card·Badge 답습.

### 4.4 polymorphic `as` (default 'div')

Banner는 block-level. host가 semantic 필요 시 `as="section"` 등. role="alert"는 컴포넌트가 강제(any tag).

## 5. 위험

| # | 리스크 | 영향 | 완화 |
|---|---|---|---|
| R1 | role="alert" 강제가 SSR/hydration mismatch | 경고 | div/section 어느 태그든 role 동일 — 안전 |
| R2 | onDismiss × 버튼이 native button default style 노출 | 시각 회귀 | inline style로 모두 reset (border:none, padding, color, font) |
| R3 | statusTokens.alarm가 dark mode에서 contrast 부족 | a11y | theme-dark.ts에서 적절히 정의됨 — sandbox dark 캡쳐로 확인 |
| R4 | 14px fontSize가 ppt 원본과 약간 다름 | 시각 차이 | ppt text-sm(14px)와 정확 일치. 시각 회귀 0 |
| R5 | gap이 children + dismiss 사이만 적용되어야 하는데 single child에 gap 부여 | layout 불완전 | display:flex + justifyContent 'space-between' (when dismiss) — gap은 무해 |
| R6 | aria-label "닫기" 한국어 default가 i18n 사이트에 부적합 | a11y | 1단계는 사내 한국어. minor bump로 prop 추가 가능 |

## 6. 테스트 전략

### 6.1 TDD 테스트 케이스 (최소 8개)

1. renders children
2. role="alert" 강제 (consumer가 role 못 override)
3. background = statusTokens.alarm.bg (var(--color-status-alarm-bg))
4. border = 1px solid statusTokens.alarm.border
5. color = statusTokens.alarm.text
6. onDismiss 미제공 시 × 버튼 미렌더
7. onDismiss 제공 시 × 버튼 렌더 + 클릭 시 callback 호출
8. as="section" polymorphic
9. className 합성 (`wonik-alert` + user)
10. external style override
11. AI 슬롭 anti-pattern 0

### 6.2 raw 값 0

- hex 0
- `\b[0-9]+px\b` 표준 `1px solid` 1회 (Card·Badge 관례)
- statusTokens 사용

### 6.3 sandbox 매트릭스

- 짧은 메시지 vs 긴 메시지
- dismiss 유 vs 무
- light + dark 토글
- `pkg-out/phase-16-alert-matrix.png`

### 6.4 회귀
- 기존 컴포넌트 코드 변경 0
- 기존 186 tests 변경 0

## 7. 단계 분할

- **Step 0**: phase dir + index + Changeset draft + ADR-017 outline
- **Step 1**: TDD — types.ts + Alert.test.tsx (실패하는 테스트 먼저)
- **Step 2**: Alert.tsx 구현 → green
- **Step 3**: index.ts + packages/web/src/index.ts re-export + 빌드
- **Step 4**: sandbox 섹션 + 캡쳐 + AI 시각 분석
- **Step 5**: ADR-017 finalize + PRD 업데이트(layer A 종료 명시) + Changeset finalize + closure

## 8. 산출물

- `packages/web/src/Alert/{Alert.tsx, Alert.test.tsx, types.ts, index.ts}`
- `packages/web/src/index.ts` re-export
- `apps/web-sandbox/...` Alert 섹션
- `docs/ADR.md` ADR-017
- `docs/PRD.md` Phase 15·16 행 + layer A 1차 채움 종료 후보 명시
- `.changeset/16-alert.md`
- `phases/16-alert/{spec,plan,tasks,step0~5}.md + index.json`
- `pkg-out/phase-16-alert-matrix.png`

## 9. 후속 결정 — layer A 1차 채움 종료 후보

Alert 추가로 layer A의 atoms가 다음 13종 도달:
1. Button, 2. Box, 3. Stack, 4. Text, 5. Input, 6. Textarea, 7. Checkbox, 8. Switch, 9. Radio, 10. Spinner, 11. Skeleton, 12. Card, 13. Badge, **14. Alert**

PRD.md 정의상 "layer A의 1차 채움 + ppt dogfood 검증" 두 조건 충족 후보. 다음 단계:
- (a) **layer A 1차 채움 종료 선언 → layer B 진입** (사내 npm registry 배포 인프라)
- (b) Phase 17 — 추가 atom dogfood (Trial 7+ 신규 needs)

사용자 결정 영역. 본 phase는 종료 선언 *후보*만 명시.
