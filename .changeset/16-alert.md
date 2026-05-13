---
"@wonik/web": minor
---

Phase 16: Alert 컴포넌트 추가

### `@wonik/web` (minor)

새 named export: `Alert` + types (`AlertProps`/`AlertOwnProps`).

- variant prop **없음** (strict YAGNI) — Trial 4+5+6 누적 3회 evidence 모두 error만. info/warning/success는 needs 부상 시 minor bump.
- `onDismiss?: () => void` — 제공 시 우측에 × 닫기 버튼 자동 렌더 + `aria-label="닫기"`.
- `as?: ElementType` (default `'div'`) — polymorphic.
- `role="alert"` 컴포넌트가 강제 (consumer override 차단) — screen reader 알림 a11y.
- 시각 토큰: `background=statusTokens.alarm.bg`, `border=1px solid statusTokens.alarm.border`, `color=statusTokens.alarm.text`, `padding=12px 16px`(space[5]/space[6]), `borderRadius=10px`(radius.md), `fontSize=14px`(fontSize.titleSm), `display=flex`, `alignItems=center`, `gap=8px`.
- dark theme: statusTokens가 CSS variable이라 theme-dark.ts에서 자동 분기.
- variant 확장, leading icon, title/description split, auto-dismiss, animation 모두 *out-of-scope* (Trial 4+5+6 evidence 0, YAGNI).
- 12 tests 추가, 186+12=198 passing. 회귀 0. ADR-017 추가.

Trial evidence: Outline error inconclusive (Trial 4) + Home form error 1회 (Trial 5) + Presentation error 1회 (Trial 6) = 누적 3회.

**layer A 1차 채움 종료 후보**: Alert 추가로 14 atoms 도달.
