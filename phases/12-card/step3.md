# Step 3 — index.ts + re-export + 빌드 + 전체 테스트

tasks.md §Step 3 의 1:1 풀어쓰기.

## 3.1 packages/web/src/Card/index.ts
```tsx
export { Card } from './Card';
export type { CardProps, CardOwnProps, CardVariant, CardPadding } from './types';
```

## 3.2 packages/web/src/index.ts re-export 추가
```tsx
export { Card } from './Card';
export type { CardProps, CardOwnProps, CardVariant, CardPadding } from './Card/types';
```
(Skeleton/Spinner 뒤에 추가, 일관성 유지.)

## 3.3 빌드
- `pnpm -F @wonik/tokens build`
- `pnpm -F @wonik/web build`
- dist에 Card.* 산출물 (esm/cjs/d.ts) 확인.

## 3.4 전체 테스트
- `pnpm -F @wonik/web test` → 163 + 14 = 177 passing 기대.

## 통과 조건
- 3.T1 `import { Card } from '@wonik/web'` resolve
- 3.T2 dist .d.ts에 `CardProps` export
- 3.S1 package.json exports root만 노출 (deep import 차단)
