# @wonik/web

## 1.0.0

### Minor Changes

- 1faf4ad: Phase 12: Card 컴포넌트 추가

  ### `@wonik/web` (minor)

  새 named export: `Card` + types(`CardProps`/`CardOwnProps`/`CardVariant`/`CardPadding`).

  - `variant: 'surface' | 'elevated'` (default `surface`) — surface는 `1px solid border`, elevated는 light theme에서 약한 `box-shadow: 0 1px 3px rgba(0,0,0,0.08)` + dark theme에서 그림자 0 (ADR-009 정신).
  - `padding: 'none' | 'sm' | 'md' | 'lg'` (default `md`) — `space[4]/space[6]/space[8]` 토큰 매핑. md=16px가 Trial 4 ppt `p-4`에 대응.
  - `as?: ElementType` (default `'div'`) — `<section>`/`<article>` 등 semantic HTML로 polymorphic.
  - 시각 색은 `interfaceColors.surface`·`interfaceColors.border` 만 reference — ADR-010 cascade로 host의 `--color-surface`/`--color-border` 정의 시 자동 흡수.
  - module-scope CSS 1회-inject (`data-wonik-card`) — dark theme `box-shadow: none` 분기 + Button/Spinner/Skeleton 패턴 일치.
  - Header/Body/Footer subcomponent·interactive(hover/click) Card·shadow 토큰·image media slot 모두 _out-of-scope_ (Trial 4 evidence 부족, YAGNI).
  - 14 tests 추가, 163+14=177 passing. 회귀 0. ADR-015 추가.

- 4d01176: Phase 14: Badge 컴포넌트 추가

  ### `@wonik/web` (minor)

  새 named export: `Badge` + types (`BadgeProps`/`BadgeOwnProps`/`BadgeVariant`).

  - `variant: 'neutral' | 'primary'` (default `neutral`) — neutral은 subtle label(border + surface bg + text), primary는 attention count/tag(primary bg + white text + no border).
  - `as?: ElementType` (default `'span'`) — inline 본성. `<div>`/`<button>` 등 polymorphic.
  - 단일 sm 크기 (size prop 없음) — Trial 4+5 evidence 모두 sm. needs 부상 시 minor bump로 size 추가.
  - 시각 토큰: `padding=4px 8px`(space[1]/space[3]), `borderRadius=5px`(radius.sm), `fontSize=12px`(fontSize.label), `fontWeight=500`(medium), `display=inline-flex`, `fontVariantNumeric=tabular-nums`.
  - 색은 `interfaceColors.surface`·`interfaceColors.text`·`interfaceColors.border`·`interfaceColors.primary`·`surfaces.surfaceWhite` reference — ADR-010 cascade로 host 변수 정의 시 자동 흡수.
  - box-shadow 0 → dark theme 분기 CSS 불필요 (Card·Button과 달리 module-scope CSS inject 패턴 **생략**).
  - size prop·semantic 색·icon slot·dismissable·count truncation 모두 _out-of-scope_ (Trial 4+5 evidence 0, YAGNI).
  - 9 tests 추가, 177+9=186 passing. 회귀 0. ADR-016 추가.

  Trial evidence: OutlineCard layout 라벨 3회 (Trial 4) + Home slideCount "{N}장" 1회 (Trial 5) = 누적 4회.

- b4fe097: Phase 16: Alert 컴포넌트 추가

  ### `@wonik/web` (minor)

  새 named export: `Alert` + types (`AlertProps`/`AlertOwnProps`).

  - variant prop **없음** (strict YAGNI) — Trial 4+5+6 누적 3회 evidence 모두 error만. info/warning/success는 needs 부상 시 minor bump.
  - `onDismiss?: () => void` — 제공 시 우측에 × 닫기 버튼 자동 렌더 + `aria-label="닫기"`.
  - `as?: ElementType` (default `'div'`) — polymorphic.
  - `role="alert"` 컴포넌트가 강제 (consumer override 차단) — screen reader 알림 a11y.
  - 시각 토큰: `background=statusTokens.alarm.bg`, `border=1px solid statusTokens.alarm.border`, `color=statusTokens.alarm.text`, `padding=12px 16px`(space[5]/space[6]), `borderRadius=10px`(radius.md), `fontSize=14px`(fontSize.titleSm), `display=flex`, `alignItems=center`, `gap=8px`.
  - dark theme: statusTokens가 CSS variable이라 theme-dark.ts에서 자동 분기.
  - variant 확장, leading icon, title/description split, auto-dismiss, animation 모두 _out-of-scope_ (Trial 4+5+6 evidence 0, YAGNI).
  - 12 tests 추가, 186+12=198 passing. 회귀 0. ADR-017 추가.

  Trial evidence: Outline error inconclusive (Trial 4) + Home form error 1회 (Trial 5) + Presentation error 1회 (Trial 6) = 누적 3회.

  **layer A 1차 채움 종료 후보**: Alert 추가로 14 atoms 도달.

- 422b5ea: layer A 1차 채움 종료 (14 atoms × ppt 3페이지 dogfood × interface variable cascade 입증).
  publish-ready transition: 0.0.0 → 0.1.0. 두 패키지 모두 description / repository / homepage / license / publishConfig 추가. `private: true` 제거 + placeholder registry URL로 실수 publish 방어. prepublishOnly build/test guard. `@wonik/web`의 `@wonik/tokens` peer 명시. sideEffects 선언. ADR-018 — registry 옵션 비교 (사내 npm / GitHub Packages / tarball) 및 결정 보류 (사내 IT 협의 후 확정).
  실제 첫 publish는 사내 registry 결정 후 별도 minor phase.
- 28e08ef: Phase 08+09+10: layer A contract 정착 + form 컨트롤 polish

  ### ADR

  - **ADR-010**: host-디자인 시스템 CSS variable contract. interface variable 6개(`--color-bg`/`--color-surface`/`--color-border`/`--color-text`/`--color-text-muted`/`--color-primary`) + cascade fallback 패턴(`var(--color-X, var(--color-X-internal))`). host가 같은 이름 변수 정의 시 host 우선, 미정의 시 우리 internal로 fallback. ppt dogfood Trial 3에서 노출된 invisibility 결함 해결.
  - **ADR-011**: form 컨트롤 focus·resize·placeholder·hover 정책. `:focus-visible` outline 2px + `--color-focus` 7번째 interface variable 격상 + Input/Textarea `:hover` border 진해짐 + `::placeholder` opacity:1 명시 + Textarea `resize?` prop 노출. WCAG 2.1 SC 2.4.7 AA 충족.

  ### `@wonik/tokens` (minor)

  - 새 named export: `interfaceColors` (7 keys — `bg`/`surface`/`border`/`text`/`textMuted`/`primary`/`focus`). 각 키는 cascade fallback 형태 `var(--color-X, var(--color-X-internal))` 반환.
  - `tokens.css` light/dark 양쪽에 새 alias emit (5개): `--color-bg`, `--color-text`, `--color-text-muted`, `--color-focus`, `--color-border-strong`.
  - 기존 export(`surfaces`/`text`/`borders`/`primary` 등) 그대로 유지. BC 0.

  ### `@wonik/web` (minor)

  - 컴포넌트 8개(Button·Input·Textarea·Spinner·Switch·Radio·Checkbox·Text)의 색 reference를 `interfaceColors.*`로 갱신. 의미상 매핑 안 되는 경우(Button primary variant의 흰 텍스트, Switch thumb 흰 점)는 internal 그대로.
  - form 컨트롤 6개(Button·Input·Textarea·Checkbox·Radio·Switch)에 module-scope `ensureCssInjected()` 패턴 적용. `:focus-visible`/`:hover`/`::placeholder` CSS block + className `wonik-X` 부여. consumer className은 머지 보존. SSR 가드 포함.
  - **Textarea**: `resize?: 'none' | 'vertical' | 'both'` prop 추가 (default `'vertical'`, disabled 시 `'none'` 강제). BC compatible — 기존 사용처 영향 0.
  - prop signature 변경 없음 — 신규 optional prop(Textarea의 `resize?`)만 추가. breaking 0.
  - 163 tests passing (회귀 0).

### Patch Changes

- Updated dependencies [422b5ea]
- Updated dependencies [28e08ef]
- Updated dependencies [28e08ef]
- Updated dependencies [28e08ef]
- Updated dependencies [28e08ef]
  - @wonik/tokens@0.2.0
