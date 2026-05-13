---
"@wonik/web": minor
---

Phase 12: Card 컴포넌트 추가

### `@wonik/web` (minor)

새 named export: `Card` + types(`CardProps`/`CardOwnProps`/`CardVariant`/`CardPadding`).

- `variant: 'surface' | 'elevated'` (default `surface`) — surface는 `1px solid border`, elevated는 light theme에서 약한 `box-shadow: 0 1px 3px rgba(0,0,0,0.08)` + dark theme에서 그림자 0 (ADR-009 정신).
- `padding: 'none' | 'sm' | 'md' | 'lg'` (default `md`) — `space[4]/space[6]/space[8]` 토큰 매핑. md=16px가 Trial 4 ppt `p-4`에 대응.
- `as?: ElementType` (default `'div'`) — `<section>`/`<article>` 등 semantic HTML로 polymorphic.
- 시각 색은 `interfaceColors.surface`·`interfaceColors.border` 만 reference — ADR-010 cascade로 host의 `--color-surface`/`--color-border` 정의 시 자동 흡수.
- module-scope CSS 1회-inject (`data-wonik-card`) — dark theme `box-shadow: none` 분기 + Button/Spinner/Skeleton 패턴 일치.
- Header/Body/Footer subcomponent·interactive(hover/click) Card·shadow 토큰·image media slot 모두 *out-of-scope* (Trial 4 evidence 부족, YAGNI).
- 14 tests 추가, 163+14=177 passing. 회귀 0. ADR-015 추가.
