---
"@wonik/tokens": minor
---

button: `buttonTokens` component 토큰 신설 — Figma `Standardization 2.0` button 16색 (ADR-023).

### 동기

Figma "UI/UX Standardization 2.0" semantic 토큰 적용 Phase 2a. 매핑 계획서 §5 hybrid 접근에서 "컴포넌트 고유 상태 → component 토큰"의 첫 적용. 버튼 3-state는 배경/글자처럼 role 토큰으로 흩어 담을 수 없어 component 토큰으로 둔다.

### 변경

`buttonTokens` export 신설 — `statusTokens`/`graphTokens`와 동일한 2-level 구조:

```ts
import { buttonTokens } from '@wonik/tokens';

buttonTokens.default.bg;     // var(--color-button-default-bg)
buttonTokens.pressed.top;    // var(--color-button-pressed-top)
buttonTokens.disabled.text;  // var(--color-button-disabled-text)
```

- 3-state(`default`/`pressed`/`disabled`) × `{bg, outline, imageBg, image, text}`, `pressed`만 `top` 추가 (16 토큰).
- hex source: `theme-light.ts`/`theme-dark.ts`. runtime `var()`: `button.ts`. CSS: `--color-button-{state}-{prop}` (`build-css.ts`).

### `#2B7FFF` 치환

`button pressed/outline`·`text`·`top`이 Figma에서 `#2B7FFF`(ADR-007 금지) → `#273E82`(WONIK BLUE)로 치환. pressed의 그 외 blue shade는 Figma 값 유지.

### scope

- 신규 export만 추가 — 기존 토큰·컴포넌트 영향 0, backward-compatible.
- light/dark 값이 달라 `buttonTokensDark`는 별도 객체. key set은 light와 1:1.
- 범위 밖(후속): `table` component 토큰(Phase 2b), `Button` 컴포넌트가 `buttonTokens`를 소비하도록 배선.

ADR-023. 매핑 계획: `docs/FIGMA_SEMANTIC_MAPPING_PLAN.md`.
