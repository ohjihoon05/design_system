# Step 1 — types.ts + Card.test.tsx (실패하는 테스트 먼저, TDD)

tasks.md §Step 1 의 1:1 풀어쓰기.

## 1.1 packages/web/src/Card/types.ts
- `CardVariant = 'surface' | 'elevated'`
- `CardPadding = 'none' | 'sm' | 'md' | 'lg'`
- `CardOwnProps { variant?, padding?, as?, children?, ref? }` (ref는 plan §5 R1 결정으로 *생략*. `as` only.)
- `CardProps extends CardOwnProps, Omit<HTMLAttributes<HTMLDivElement>, keyof CardOwnProps>` (Box 패턴 답습)

## 1.2 Card.test.tsx 작성 (plan §6.1 10케이스)
1. renders children
2. default variant `surface` — border `1px solid var(--color-border, ...)` 적용
3. variant `elevated` — border `none` + boxShadow 적용
4. default padding `md` — `padding: 16px`
5. padding `none` — `padding: 0`
6. padding `sm` — `padding: 10px`
7. padding `lg` — `padding: 32px`
8. as=`section` — `<section>` 태그
9. className 합성 — `wonik-card` + 외부 className 공존
10. style override — 외부 style이 default 위에 적용
11. (보너스) interfaceColors 사용 입증 — bg style이 `var(--color-surface` 포함
12. (보너스) ensureCssInjected once — `<style data-wonik-card>` 1회 삽입
13. (보너스) elevated 시 className suffix `wonik-card-elevated` 부여
14. (보너스) AI 슬롭 anti-pattern 0 — backdrop-filter blur·gradient bg·glow shadow 0

## 1.3 테스트 *fail* 확인 (Card 미구현)
- `pnpm -F @wonik/web test Card` non-zero. TDD 의도된 상태.

## 통과 조건
- 1.T1 tsc --noEmit OK on types.ts (Card.tsx 없어도 types.ts 자체는 strict 통과)
- 1.T2 14 `it()` 블록 grep
- 1.S1 fixture children 텍스트 비밀 0 (Card content 등 무해 문자열)
