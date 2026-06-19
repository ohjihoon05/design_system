---
"@wonik/tokens": minor
"@wonik/web": minor
---

feat: web 타입 스케일 + 본문 line-height 토큰 추가 (ADR-040)

- `@wonik/tokens`: `fontSize`에 `body`(14) / `h3`(20) / `h2`(28) / `h1`(40) leaf 추가,
  `lineHeight`에 `normal`(1.5) 추가. CSS 변수 `--font-size-{body,h3,h2,h1}` ·
  `--line-height-normal` emit (기존 `--line-height` 별칭 유지).
- `@wonik/web`: `Text`의 `variant`가 새 web 스케일을 노출하고, `body`/`h1`~`h3`는
  line-height 1.5를 자동 적용 (그 외 dense variant는 1 유지). 의미 태그(`as`)와
  시각 크기(`variant`)는 계속 분리.
- 하위호환(기존 variant·prop signature 불변) → minor.

추가 (ADR-042): `primitives`·`componentSize`·`graphTokens`에 `@internal` JSDoc 부착
— 소비 0이 정상인 Figma-sync/HMI/chart 레이어임을 명시(주석 전용, 동작 불변).

추가 (ADR-041 §B): `Text` 기본 `color`를 `primary`(#71717B) → `dark`로 변경.
bare `<Text>`가 page canvas에서 WCAG AA(4.5:1)를 통과하도록 하는 접근성 수정.
muted 라벨은 명시적으로 `color="primary"`/`"dim"` 사용. 기본값 변경이라 minor.

추가 (ADR-041 §A): status 토큰 6쌍의 text/dot 색을 WCAG AA(text 4.5:1, dot 3:1)로
darken — 각 hue 보존(신호색 정체성 유지). idle/ready/processEnd/warning/abort
text + warning dot. 값 drift라 minor (ADR-024). ADR-037 무채색 비전과는 orthogonal.
