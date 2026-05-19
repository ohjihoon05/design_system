---
'@wonik/tokens': minor
---

DTCG 호환 audit + dead token 제거 (ADR-020).

- `radius.panelHeader` 제거 — 사용처 0개의 dead token. shorthand 값(`'10px 10px 0 0'`)이라 DTCG 1:1 매핑을 깨고 있어 제거.
- `build-css.ts`의 panelHeader special case 제거.
- 본 변경은 토큰 layer 안정화의 일부 — atom 21개 안정화된 후 토큰 layer를 DTCG-friendly 형태로 정리한다.

DTCG JSON emit 또는 변환 스크립트는 추가하지 않음 (ADR-020 — YAGNI). 구조만 1:1 매핑 가능하게 유지. 매핑 룰은 `docs/TOKEN_DTCG_COMPAT.md` 참조.
