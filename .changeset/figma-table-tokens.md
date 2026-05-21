---
"@wonik/tokens": minor
---

table: `tableTokens` component 토큰 신설 — Figma `Standardization 2.0` table 25색 (ADR-025).

### 동기

Figma "UI/UX Standardization 2.0" semantic 토큰 적용 Phase 2b. 매핑 계획서 §5 hybrid 접근의 두 번째 component 토큰. Table 셀 점유 상태(ready/manual/occupied/processed/aborted/empty)는 Fab 슬롯 상태라 role 토큰에 흩어 담을 수 없어 component 토큰으로 둔다.

### 변경

`tableTokens` export 신설 — `buttonTokens`와 동일한 2-level 구조:

```ts
import { tableTokens } from '@wonik/tokens';

tableTokens.surface.bg;        // var(--color-table-surface-bg)
tableTokens.ready.circle;      // var(--color-table-ready-circle)
tableTokens.aborted.text;      // var(--color-table-aborted-text)
```

- `surface`(table chrome 8) + cell 상태(`ready`/`manual` ×{base,circle}, `information` ×{circle}, `empty`/`occupied`/`processed`/`aborted` ×{text,bg,outline}) = 25 토큰.
- hex source: `theme-light.ts`/`theme-dark.ts`. runtime `var()`: `table.ts`. CSS: `--color-table-{group}-{prop}` (`build-css.ts`).

### 네이밍 교정 · `#2B7FFF` 치환

- Figma 변수 오타 `table/oborted` → 코드 `aborted` (계획서 §8 충돌 2).
- `table/information(circle)` Dark `#2B7FFF`(ADR-007 금지) → `#273E82`(WONIK BLUE). Light `#155DFC`는 `#2B7FFF`가 아니라 Figma 값 유지.
- standalone `little table(outline)`은 `table/outline`과 중복-성격이라 매핑 제외.

### scope

- 신규 export만 추가 — 기존 토큰·컴포넌트 영향 0, backward-compatible.
- light/dark 값이 달라 `tableTokensDark`는 별도 객체. key set은 light와 1:1.
- 범위 밖(보류): `tob/buttom/menu bar` chrome 토큰(앱 셸, ADR-001 인접), 장비 상태색(충돌 4).

ADR-025. 매핑 계획: `docs/FIGMA_SEMANTIC_MAPPING_PLAN.md`.
