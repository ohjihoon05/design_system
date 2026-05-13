---
"@wonik/web": minor
---

Phase 14: Badge 컴포넌트 추가

### `@wonik/web` (minor)

새 named export: `Badge` + types (`BadgeProps`/`BadgeOwnProps`/`BadgeVariant`).

- `variant: 'neutral' | 'primary'` (default `neutral`) — neutral은 subtle label(border + surface bg + text), primary는 attention count/tag(primary bg + white text + no border).
- `as?: ElementType` (default `'span'`) — inline 본성. `<div>`/`<button>` 등 polymorphic.
- 단일 sm 크기 (size prop 없음) — Trial 4+5 evidence 모두 sm. needs 부상 시 minor bump로 size 추가.
- 시각 토큰: `padding=4px 8px`(space[1]/space[3]), `borderRadius=5px`(radius.sm), `fontSize=12px`(fontSize.label), `fontWeight=500`(medium), `display=inline-flex`, `fontVariantNumeric=tabular-nums`.
- 색은 `interfaceColors.surface`·`interfaceColors.text`·`interfaceColors.border`·`interfaceColors.primary`·`surfaces.surfaceWhite` reference — ADR-010 cascade로 host 변수 정의 시 자동 흡수.
- box-shadow 0 → dark theme 분기 CSS 불필요 (Card·Button과 달리 module-scope CSS inject 패턴 **생략**).
- size prop·semantic 색·icon slot·dismissable·count truncation 모두 *out-of-scope* (Trial 4+5 evidence 0, YAGNI).
- 9 tests 추가, 177+9=186 passing. 회귀 0. ADR-016 추가.

Trial evidence: OutlineCard layout 라벨 3회 (Trial 4) + Home slideCount "{N}장" 1회 (Trial 5) = 누적 4회.
