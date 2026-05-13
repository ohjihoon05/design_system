# Step 1 — TDD: types.ts + Badge.test.tsx (실패하는 테스트 먼저)

## 작업 (실행 결과)

- `packages/web/src/Badge/types.ts` — `BadgeVariant` (`'neutral' | 'primary'`), `BadgeOwnProps`, `BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, never>`.
- `packages/web/src/Badge/Badge.test.tsx` — 9개 테스트:
  1. renders children
  2. default variant `neutral` — surface bg + 1px border
  3. variant `primary` — primary bg + white text + no border
  4. default tag = `<span>`
  5. `as="div"` polymorphic
  6. className 합성 (`wonik-badge` + user)
  7. style override (spread 마지막)
  8. 공통 시각 토큰 (inline-flex, items-center, fontSize 12px, radius 5px, tabular-nums)
  9. AI 슬롭 anti-pattern 0 (backdrop-filter blur / gradient bg / glow shadow)

## 통과 조건

- 1.1·1.2 ✅
- 1.T1 (TDD red — Badge.tsx 부재로 9 fail) ✅ (vitest "Cannot find module './Badge'" 에러)
