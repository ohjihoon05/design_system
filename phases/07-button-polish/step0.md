# Step 0: button-lg-hero

## 읽어야 할 파일

먼저 아래 파일을 읽고 1단계 우선순위·기존 컴포넌트 패턴·dogfood feedback 맥락을 파악하라:

- `/CLAUDE.md` (CRITICAL — 토큰 하드코딩 금지 + AI 슬롭 anti-pattern + React 18·19 dual peer)
- `/docs/UI_GUIDE.md` (특히 "no bold weights" 정신 — `medium`(500)이 강조 천장)
- `/docs/dogfood-trial-2.md` (본 phase의 motivation — ppt에 hero submit button을 적용해본 결과 weight regular(400)이 약하고 radius sm(5px)이 hero에 너무 각져 보였음. 우리 토큰에 이미 `fontWeight.medium`(500)과 `radius.md`(10px)이 있으므로 prop 추가 없이 size lg의 의미를 "hero / CTA 강조"로 풍부화)
- 이전 phase 산출물:
  - `/packages/web/src/Button/Button.tsx` (size별 sizeStyles 테이블에 weight·radius 추가)
  - `/packages/web/src/Button/Button.test.tsx` (기존 10건 — sm vs md padding 비교만, lg weight·radius 검증 없음)
  - `/packages/web/src/Button/types.ts` (signature 변경 0)
  - `/packages/tokens/src/typography.ts` (`fontWeight.medium = 500` 이미 정의됨)
  - `/packages/tokens/src/spacing.ts` (`radius.md = '10px'` 이미 정의됨)

## 작업

`@wonik/web` Button의 size `lg`를 **hero / CTA 강조** 의미로 풍부화한다. 토큰 추가·prop 추가 0건 — 기존 size 토큰의 default 값만 변경.

이 step의 목적은 **"dogfood가 알려준 진짜 needs를 컴포넌트에 반영하는 사이클의 첫 사례 — Trial 2 → Phase 07 closed loop"**.

### 핵심 설계 결정

1. **prop 추가 없음 (`weight`/`hero` 등 X)** — 1단계 단순성. `size` 토큰의 의미가 "padding 크기"에서 "강조 layer"로 자연 확장. consumer는 size만 결정, weight/radius는 자동 따라옴.
2. **변경 범위 — `sizeStyles[lg]`만**:
   - 추가: `fontWeight: fontWeight.medium` (현재 baseStyle의 regular를 lg에서만 override)
   - 추가: `borderRadius: radius.md` (10px — 현재 baseStyle의 `radius.sm` 5px를 lg에서만 override)
3. **md / sm은 그대로**: regular + sm radius. 회귀 0.
4. **`semibold`(600) 도입 안 함** — UI_GUIDE의 "no bold weights" 정신 보존. ppt가 semibold이지만 우리는 medium이 강조 천장. dogfood가 "더 강한 weight" 필요로 하더라도 우리 시각 언어를 깨면서까지 따라가지 않음 — 이게 "디자인 시스템이 host보다 자기 정체성을 우선"하는 결정.
5. **`radius.lg` 추가 안 함** — `radius.md`(10px)이 ppt의 8px과 거의 동일 시각. 새 토큰 없이도 needs 충족. 진짜 더 큰 radius needs가 나타나면 그때 추가.
6. **breaking change 0** — prop signature 동일, variant 동일, default size 동일(md). 기존 sandbox·test 모두 그대로 작동. md·sm size 시각도 그대로.

### 1. 변경 위치

```
packages/web/src/Button/
├── Button.tsx          ← sizeStyles[lg] 확장
└── Button.test.tsx     ← lg weight·radius 신규 테스트 4건 추가
```

### 2. `Button.tsx` 변경

기존 import에 `fontWeight`은 이미 있음. 변경은 `sizeStyles` 테이블만:

```typescript
const sizeStyles: Record<ButtonSize, CSSProperties> = {
  sm: { padding: `${space[1]} ${space[3]}`, fontSize: fontSize.labelSm, height: '24px' },
  md: { padding: `${space[3]} ${space[5]}`, fontSize: fontSize.label, height: '32px' },
  lg: {
    padding: `${space[3]} ${space[6]}`,
    fontSize: fontSize.titleSm,
    height: '40px',
    fontWeight: fontWeight.medium,   // 추가 — hero 강조
    borderRadius: radius.md,          // 추가 — hero 시각 부드러움
  },
};
```

`baseStyle`의 `fontWeight: fontWeight.regular`와 `borderRadius: radius.sm`은 그대로. `composed` 객체에서 `sizeStyles[lg]`의 fontWeight·borderRadius가 baseStyle을 override한다 (객체 spread 순서 — baseStyle 먼저, sizeStyles 나중).

### 3. `Button.test.tsx` 신규 테스트 4건 추가 (TDD — 먼저 작성)

기존 10건 그대로 보존. 끝에 4건 추가:

```typescript
it('size lg uses fontWeight medium for hero emphasis', () => {
  render(<Button size="lg">Hero</Button>);
  const btn = screen.getByRole('button');
  expect(btn).toHaveStyle({ fontWeight: '500' });
});

it('size lg uses radius.md for hero softness', () => {
  render(<Button size="lg">Hero</Button>);
  const btn = screen.getByRole('button');
  expect(btn).toHaveStyle({ borderRadius: '10px' });
});

it('size md keeps regular weight (no hero emphasis)', () => {
  render(<Button size="md">Default</Button>);
  const btn = screen.getByRole('button');
  expect(btn).toHaveStyle({ fontWeight: '400' });
});

it('size sm keeps radius.sm (no hero softness)', () => {
  render(<Button size="sm">Compact</Button>);
  const btn = screen.getByRole('button');
  expect(btn).toHaveStyle({ borderRadius: '5px' });
});
```

이 4건은 lg가 hero 의미를 가지고 md/sm은 그대로라는 계약을 명시.

### 4. 회귀 검증

기존 10건 테스트 모두 그대로 통과해야 한다. 특히:
- "size sm renders smaller padding than md" — padding 비교만 → 영향 없음
- "applies WONIK BLUE primary token as primary variant background" — variant primary 색만 → 영향 없음

신규 4건 + 기존 10건 = Button 14건. 전체 테스트는 159 → 163.

## Acceptance Criteria

```bash
cd C:/Users/ohjih/design_system

pnpm -F @wonik/web test --run     # 14 Button + 기존 모두 = 163 passed (현재 159 + 4)
pnpm -F @wonik/web build          # 빌드 성공

# 빌드 산출물 검증
test -f packages/web/dist/index.js
grep -q "Button" packages/web/dist/index.js

# 하드코딩 hex 금지
! grep -E "['\"]#[0-9A-Fa-f]{6}['\"]" packages/web/src/Button/Button.tsx

# AI 슬롭 anti-pattern 0건
! grep -i -E "backdrop-filter|linear-gradient|box-shadow.*glow|rounded-2xl" packages/web/src/Button/Button.tsx

# 토큰 reference 사용 — fontWeight.medium · radius.md
grep -q "fontWeight.medium" packages/web/src/Button/Button.tsx
grep -q "radius.md" packages/web/src/Button/Button.tsx

# semibold 도입 0 (no bold weights 보존)
! grep -E "fontWeight\.semibold|fontWeight\.bold|600\b|700\b" packages/web/src/Button/Button.tsx

# Button prop signature 변경 0 (breaking 0)
grep -q "ButtonVariant" packages/web/src/Button/types.ts
grep -q "ButtonSize" packages/web/src/Button/types.ts
! grep -E "weight\?\s*:" packages/web/src/Button/types.ts

# React 19-only API 사용 0
! grep -E "useFormStatus|useOptimistic|use\(" packages/web/src/Button/Button.tsx
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 체크리스트:
   - TDD: 새 테스트 4건이 `Button.tsx` 변경 전에 작성됐나?
   - lg에서 fontWeight medium · radius md 자동 적용?
   - md/sm은 회귀 0?
   - prop signature 변경 0 (breaking 0)?
   - hex 0건? semibold 도입 0?
   - 회귀 없음: 기존 159 + 신규 4 = 163 모두 통과?
3. 결과에 따라 `phases/07-button-polish/index.json`의 step 0을 업데이트:
   - 성공 → `"status": "completed"`, `"summary": "@wonik/web Button size lg를 hero/CTA 강조 의미로 풍부화. fontWeight medium(500) + radius md(10px) 자동 적용. md/sm 회귀 0, prop signature 변경 0(breaking 0). 토큰 추가 0(이미 있던 medium·md 활용). dogfood trial 2 → phase 07 closed loop의 첫 사례. semibold(600)는 의도적으로 도입 안 함 — UI_GUIDE의 'no bold weights' 정신 보존."`
   - 실패 → `"status": "error"`, `"error_message": "구체 사유"`

## 금지사항

- **`weight`/`hero` prop 추가 금지** — 1단계 단순성. size 토큰의 의미만 풍부화.
- **`fontWeight.semibold`(600)/`fontWeight.bold`(700) 도입 금지** — UI_GUIDE의 "no bold weights" 정신. dogfood가 더 강한 weight 요구해도 우리 시각 언어 우선.
- **`radius.lg` 등 새 radius 토큰 추가 금지** — md(10px)로 hero 표현 충분.
- **prop signature 변경 금지** — `ButtonVariant`/`ButtonSize` 타입 그대로. breaking 0.
- **md/sm size 시각 변경 금지** — 회귀 0이 필수.
- **토큰 파일(`packages/tokens/src/`) 변경 금지** — 본 step의 변경 범위는 Button.tsx + Button.test.tsx만.
- **다른 컴포넌트 코드 수정 금지** — Button.tsx만.
- **AI 슬롭 anti-pattern 금지** (backdrop-filter / gradient / glow / rounded-2xl).
- **CSS-in-JS 라이브러리 도입 금지.**
- **Snapshot test 금지.**
- **React 19-only API 금지.**
- **기존 docs/CLAUDE.md/scripts/execute.py 수정 금지.**
- **기존 테스트를 깨뜨리지 마라.**
