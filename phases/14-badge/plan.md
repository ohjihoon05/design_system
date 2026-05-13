# Phase 14 — Badge (plan.md)

> autopilot PHASE 3 (PLAN) 산출물.

## 1. 접근 방식

```
[1] ADR-016 작성 + spec.md 합의 (signature 확정)
       ↓
[2] TDD: types.ts + Badge.test.tsx 먼저 → Badge.tsx 구현
       ↓
[3] index.ts + packages/web/src/index.ts re-export + 빌드
       ↓
[4] sandbox 매트릭스 섹션 + headless 캡쳐 + AI 시각 분석
       ↓
[5] Changeset minor + ADR-016 finalize + PRD 업데이트
       ↓
[6] phase index closure
```

design_system 내부 완결. dogfood(ppt 적용)는 Phase 15(Trial 6) 후보.

## 2. 기술 선택 근거

### 2.1 Card 패턴 답습 — 새 패턴 도입 안 함

Phase 12 Card에서 검증된 패턴:
- types.ts 분리
- `as` polymorphic (Card는 div, Badge는 span)
- `interfaceColors` cascade
- inline style 합성, user style spread 마지막
- className 합성 (`wonik-X` + user)
- Card.test.tsx 패턴 답습

차이점:
- Badge는 dark mode 분기 CSS **불필요** (boxShadow 0) → `ensureCssInjected()` 패턴 **생략**. Card·Button·Skeleton보다 *더 단순*.
- forwardRef **사용 안 함** — Card 답습.

### 2.2 size prop 없는 이유

- Trial 4+5 evidence: sm 단일.
- size prop 미리 추가 = preemption. needs 부상 시 minor bump로 추가는 non-breaking.
- API 단순 = 학습 부담 ↓.

### 2.3 variant 2개로 시작

- primary (강조) + neutral (subtle) = 두 가지 시각 의도가 evidence로 명확.
- semantic 색(info/success/warning/danger)은 status 사용처 부상 시 추가.

### 2.4 tabular-nums 디폴트 on

- primary variant는 거의 항상 카운트(slideCount, NEW 카운터 등). tabular-nums가 자연.
- neutral variant도 라벨 안에 숫자 포함 가능 (예: "v1.0", "draft 3"). 손해 0.
- always on이 prop 추가보다 단순.

## 3. 의존성

- 이미 존재, 새로 추가 0:
  - `react@^18 || ^19` peer (ADR-008).
  - `@wonik/tokens@workspace` (interfaceColors, surfaces, space, radius, fontSize, fontWeight, lineHeight).
  - `vitest@^2` + `@testing-library/react`.
  - `typescript@5.7` strict.
  - `tsup` (web 패키지 빌드).
- Headless Chrome (sandbox 캡쳐).
- 새 의존성 0.

## 4. 아키텍처 결정

### 4.1 polymorphic `as` — Card 답습 (default 'span')

- inline 본성: `<span>` 자연. `<div>` 강제는 layout 문제.
- host가 button·a·div로 변경 가능 (`as` prop).

### 4.2 className: `wonik-badge` + user

- Card 패턴 답습. user override 우선.

### 4.3 variant별 inline style 합성

- 두 variant 작아서 conditional map보다 if/else 또는 ternary 적합. switch도 OK. spec map table 그대로 코드.

### 4.4 padding/radius/font 토큰 매핑

```tsx
const STYLE_BASE = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: `${space[1]} ${space[3]}`,  // 4px 8px
  borderRadius: radius.sm,              // 5px
  fontSize: fontSize.label,             // 12px
  fontWeight: fontWeight.medium,        // 500
  lineHeight: lineHeight.tight,         // 1
  fontVariantNumeric: 'tabular-nums',
};
```

### 4.5 variant별 시각 매핑

```tsx
const VARIANT_STYLES: Record<BadgeVariant, CSSProperties> = {
  neutral: {
    background: interfaceColors.surface,
    color: interfaceColors.text,
    border: `1px solid ${interfaceColors.border}`,
  },
  primary: {
    background: interfaceColors.primary,
    color: surfaces.surfaceWhite,
    // border: none (default browser '0' or 'none')
  },
};
```

## 5. 위험 요소

| # | 리스크 | 영향 | 완화 |
|---|--------|------|------|
| R1 | inline-flex로 span에 padding 적용 시 일부 브라우저에서 baseline 불일치 | 시각 회귀 | display: inline-flex + alignItems: center로 vertical center 강제 |
| R2 | 매우 긴 텍스트가 inline 흐름을 깨뜨림 | layout 깨짐 | spec §10.2 명시 — host 책임. Badge는 default 행동 보존 (자연 inline) |
| R3 | `as="button"` 시 native button 기본 padding·border 충돌 | 시각 회귀 | inline style이 우선이라 우리 토큰 위 host className으로 reset 가능. 의도된 동작 |
| R4 | radius.sm(5px) + padding 4px/8px 조합이 작은 텍스트 1글자에서 시각 어색 | 시각 회귀 | sandbox 매트릭스로 "1글자/짧은/긴/숫자" 확인 |
| R5 | dark mode에서 neutral variant border가 너무 가까운 surface와 대비 부족 | 시각 회귀 | interfaceColors.border가 dark mode에서 적절한 톤(theme-dark.ts) — Card·Input에서 검증됨 |
| R6 | bold fontWeight 부재 — ppt 원본보다 약해 보일 가능성 | 시각 차이 | medium도 12px size에서 충분 emphasis. 사용처 시각 확인 후 bold 토큰 도입 결정 |

## 6. 테스트 전략

### 6.1 TDD (테스트 먼저, 통과 구현)

테스트 케이스 (최소 7개):
1. 기본 렌더 — children 노출 (`renders children text`)
2. default variant = `neutral` — border + interfaceColors.surface bg
3. variant=`primary` — interfaceColors.primary bg + surfaceWhite text + border 없음
4. as=`div` — `<div>` 태그로 렌더
5. className 합성 — 외부 className이 `wonik-badge` 뒤에 붙음
6. style override — 외부 style이 default 위에 spread
7. interfaceColors 사용 입증 — bg style이 `var(--color-primary)` 포함 (primary) 또는 `var(--color-surface, ...)` 포함 (neutral)

### 6.2 raw 값 0 검증

- `! grep -E "#[0-9a-fA-F]{3,6}" packages/web/src/Badge/Badge.tsx`
- `! grep -E "\b[0-9]+px\b" packages/web/src/Badge/Badge.tsx`
- 모든 시각 값은 `space`/`radius`/`fontSize`/`fontWeight`/`lineHeight`/`interfaceColors`/`surfaces` 토큰 경유.

### 6.3 시각 — sandbox 매트릭스

- Badge 섹션: variant × 컨텐츠 종류 매트릭스
  - 행: neutral / primary
  - 열: "label" / "8장" / "01" / "Draft v1.0"
- light + dark 토글 캡쳐 1장씩 → `pkg-out/phase-14-badge-matrix.png`(+ optional dark variant 파일)
- AI(Read tool) 시각 분석.

### 6.4 회귀

- 기존 컴포넌트 코드 변경 0.
- 기존 177 tests 변경 0.

## 7. 단계 분할

- **Step 0**: `phases/14-badge/` 디렉토리·index.json + Changeset draft + ADR-016 outline
- **Step 1**: TDD — types.ts + Badge.test.tsx (실패하는 테스트 먼저)
- **Step 2**: Badge.tsx 구현 → 모든 테스트 green
- **Step 3**: index.ts + packages/web/src/index.ts re-export + 빌드 통과
- **Step 4**: sandbox 매트릭스 섹션 + headless 캡쳐 + AI 시각 분석
- **Step 5**: ADR-016 finalize + PRD 업데이트 + Changeset finalize + phase closure

## 8. 산출물

- `packages/web/src/Badge/{Badge.tsx, Badge.test.tsx, types.ts, index.ts}`
- `packages/web/src/index.ts` re-export
- `apps/web-sandbox/...` Badge 섹션
- `docs/ADR.md` ADR-016
- `docs/PRD.md` Phase 14 행
- `.changeset/*-badge.md`
- `phases/14-badge/{spec.md, plan.md, tasks.md, step{0..5}.md, index.json}`
- `pkg-out/phase-14-badge-matrix.png`

## 9. 후속 결정

- **Phase 15 후보**: Trial 6 (Presentation 또는 History) — Badge 적용 + Alert·ToggleGroup 누적 측정. 누적 결과로 Phase 15 = Alert OR ToggleGroup 결정.
- **Badge 확장 (size, semantic 색)**: Trial 6+ needs 부상 시.
