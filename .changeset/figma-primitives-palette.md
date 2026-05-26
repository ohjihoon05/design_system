---
"@wonik/tokens": minor
---

primitives: Figma `Primitives` 색 팔레트(127색) 도입 — `@wonik/tokens`에 raw primitive layer 신설 (ADR-021).

### 동기

Figma "UI/UX Standardization 2.0" 파일의 `Primitives` 컬렉션(single mode, 127 color)을 디자인 시스템에 적용하는 작업의 1단계. 사용자 결정(2026-05-20)으로 raw 팔레트를 먼저 정합하고, semantic(Dark/Light) 매핑은 후속 단계로 분리한다.

### 변경

`packages/tokens/src/primitives.ts` 신설 — hue별 그룹(`white`/`gray`/`green`/`orange`/`blue`/`purple`/`red`/`cyan`/`yellow`/`pink`)으로 127색을 export. leaf 이름은 Figma와 1:1 faithful 유지(`100b`..`100j` 등). `index.ts`에서 re-export.

```ts
import { primitives } from '@wonik/tokens';

primitives.gray['600']; // '#71717B'
primitives.blue['500']; // '#273E82'
```

### `#2B7FFF` 치환

Figma `Blue/500 = #2B7FFF`는 ADR-007이 금지하는 hex(Primary = WONIK BLUE `#273E82`). `primitives.blue['500']`을 `#273E82`로 치환했다 — 코드 토큰이 canon.

### scope

- 신규 export만 추가 — 기존 토큰·컴포넌트 영향 0, backward-compatible.
- primitive는 mode-independent raw hex라 CSS 변수 emit 없이 TypeScript 상수로만 export (테마 전환 대상 아님).
- ADR-020 DTCG 룰 준수: leaf 1개 = `$value` 1개, color group 단일 `$type`, single mode.

ADR-021. 후속: `Standardization 2.0` Dark/Light semantic 토큰 매핑.
