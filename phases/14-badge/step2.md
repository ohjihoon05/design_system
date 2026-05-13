# Step 2 — Badge.tsx 구현 (TDD green)

## 작업 (실행 결과)

`packages/web/src/Badge/Badge.tsx`:
- `BASE_STYLE` — display inline-flex, alignItems center, padding `${space[1]} ${space[3]}`, borderRadius `radius.sm`, fontSize `fontSize.label`, fontWeight `fontWeight.medium`, lineHeight `lineHeight.tight`, fontVariantNumeric tabular-nums.
- `VARIANT_STYLE` map:
  - `neutral`: bg `interfaceColors.surface`, color `interfaceColors.text`, border `1px solid ${interfaceColors.border}`.
  - `primary`: bg `interfaceColors.primary`, color `surfaces.surfaceWhite`.
- Composed style spread 순서: BASE → VARIANT → user style (override 우선).
- className: `wonik-badge` + user (Card 답습).
- `as` polymorphic (default `'span'`). forwardRef 미사용.

`packages/web/src/Badge/index.ts` — re-export Badge + types.

## 통과 조건

- 2.1·2.2 ✅
- 2.T1 (Badge.test.tsx 9/9 green) ✅ — `pnpm -F @wonik/web test Badge` 결과 9 passed in 219ms
- 2.S1 (hex 0, raw px는 표준 `1px solid` 1회 — Card 동일 관례) ✅
