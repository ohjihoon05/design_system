---
"@wonik/web": patch
---

Tooltip·Toast 내부 raw px/숫자 리터럴 4건을 기존 토큰으로 치환 (R2 적합성, value 보존):

- Tooltip `padding: '6px 10px'` → `${space[2]} ${space[4]}`
- Tooltip `placementOffset = '6px'` → `space[2]`
- Tooltip `fontWeight: 400` → `fontWeight.regular`
- Toast `calc(100vw - 32px)` → `calc(100vw - ${space[8]})`

값 변화 없음(6px/10px/400/32px 동일), API 변화 없음 → patch. CRITICAL sweep 2026-06-28 결과(docs/critical-sweep-2026-06-28.md).
