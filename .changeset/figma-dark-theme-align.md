---
"@wonik/tokens": minor
---

theme-dark: `theme-dark.ts`의 surfaces·borders·text를 Figma `Standardization 2.0` Dark 디자인 값으로 정합 (ADR-022).

### 동기

Figma "UI/UX Standardization 2.0" semantic 토큰 적용의 Phase 1. `theme-dark.ts`는 도입 당시 ppt의 slate-900 계열 **임시값**이었고("Refinable by designer later"), Figma `Standardization 2.0` Dark 모드가 그 디자이너 refine 결과물이다. `theme-light.ts`는 검토 결과 이미 Figma Light 값과 정합되어 변경 불필요 — 실질 gap은 Dark뿐.

### 변경

`theme-dark.ts`에서 다음을 Figma Dark 값으로 교체:

- `surfacesDark` 9개 — `canvas` `#343434`, `surface` `#1E1E21`, `surfaceSubtle` `#252528`, `surfaceInset` `#1F1F1F`, `surfaceMid` `#313137` 등
- `bordersDark` 4개 — `#313137` / `#52525C` / `#676771` / `#52525C`
- `textDark`의 `primary` `#E0E0E3` · `secondary` `#D9D9DC` · `dim` `#71717B`

### scope

- **값만 변경, key 불변** — `theme-light`과 1:1 key set 유지(ADR-020 룰 4). API·토큰 이름 변동 0.
- dark 모드를 쓰는 consumer는 색이 바뀐다(`<html data-theme="dark">`). light 모드 영향 0.
- 범위 밖(후속): `textDark`의 inversion 토큰(`dark`/`onDark*`), `primaryDark`, `statusTokens`/`graphTokens` Dark 튜닝, `button`/`table` component 토큰(Phase 2), 장비 상태색(보류).

ADR-022. 매핑 계획: `docs/FIGMA_SEMANTIC_MAPPING_PLAN.md`.
