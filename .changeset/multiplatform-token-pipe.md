---
"@wonik/tokens": minor
---

feat: 멀티플랫폼 토큰 파이프 추가 (ADR-047 척추 ①) — `pnpm build`가 이제 `dist/tokens.dtcg.json`(DTCG 1:1 emit), `dist/vue/tokens.{light,dark}.css`, `dist/flutter/wonik_tokens_{light,dark}.dart`도 함께 산출한다. Style Dictionary(BUY)로 구동되며 값은 기존 `dist/tokens.css`와 동일 source(theme-light/dark)에서 나와 drift 없음. 컴포넌트 패키지 신설은 아님 — `packages/tokens` 내부 산출물 확장.
