# Step 2 — Card.tsx 구현 (테스트 그린)

tasks.md §Step 2 의 1:1 풀어쓰기.

## 2.1 Card.tsx — Box 패턴 (function component + `as` prop, forwardRef 미사용 — plan §5 R1)

## 2.2 module-scope CSS 1회-inject
- `CARD_CSS` 상수: `[data-theme="dark"] .wonik-card-elevated { box-shadow: none; }`
- `ensureCssInjected()` 함수 (Spinner/Skeleton/Button 패턴 동일).
- `data-wonik-card` style 태그 attribute.
- SSR 가드(`typeof document === 'undefined'`).

## 2.3 variant 스타일
- `surface`: `background: interfaceColors.surface`, `border: '1px solid ' + interfaceColors.border`, `boxShadow: 'none'`.
- `elevated`: `background: interfaceColors.surface`, `border: 'none'`, `boxShadow: '0 1px 3px rgba(0,0,0,0.08)'`, className suffix `wonik-card-elevated`.

## 2.4 padding 매핑
```tsx
const PADDING_MAP: Record<CardPadding, string> = {
  none: '0',
  sm: space[4],   // 10px
  md: space[6],   // 16px
  lg: space[8],   // 32px
};
```

## 2.5 border-radius
- `radius.md` (10px) — surface/elevated 공통.

## 2.6 className 합성
- base: `'wonik-card'`
- elevated 시: `'wonik-card wonik-card-elevated'`
- 외부 className: 뒤에 공백+연결 (`'wonik-card ' + (props.className ?? '')`)

## 2.7 14 테스트 그린

## 통과 조건
- 2.T1 hex 리터럴 0 + bare px 리터럴 0 (boxShadow `'0 1px 3px rgba(0,0,0,0.08)'`는 *예외* — `// elevation, 토큰화는 사용처 2+ 부상 시 (plan.md §2.6)` 주석 부착)
- 2.S1 user input → inline style 직접 삽입 0 (spread만)
