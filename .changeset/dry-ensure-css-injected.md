---
"@wonik/web": patch
---

refactor(web): `ensureCssInjected` 1회-주입 패턴 공통 helper로 통합 (eng-review 2026-06-17)

동일한 `let cssInjected = false` boolean + 자체 `ensureCssInjected()` 8줄 블록이
14개 web 아톰에 복제돼 있던 triplication을 공통 helper 1개로 통합한다.

- `packages/web/src/utils/ensureCssInjected.ts` 신규 — `(id, css)` 시그니처 +
  module-scope `Set` dedup + `typeof document === 'undefined'` SSR 가드.
  주입된 `<style data-wonik-{id}="true">` 속성 규약(CLAUDE.md CRITICAL)은 동일하게
  보존돼 DOM은 바이트 동일.
- 14개 아톰(Button/Switch/Card/Input/Checkbox/Radio/Textarea/Table/Tooltip/
  IconButton/FilterChip/InlineEditableText/Skeleton/Spinner)이 각자 구현을
  지우고 공통 helper를 호출하도록 migrate.
- 공개 API·prop signature 불변(내부 util은 package root에서 export하지 않음) → patch.
  helper 계약은 `ensureCssInjected.test.ts`(주입·dedup·다중 id)로 가드.
