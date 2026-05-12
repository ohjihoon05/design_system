---
"@wonik/tokens": minor
---

graph: `signalReference.surface` 추가 — signal 3개 신호 (line, surface) 쌍 대칭 완성

### ADR

- **ADR-014**: ADR-013 보완 (additive). `signalReference`에 `surface` property 추가로 `signalPrimary`/`signalTuned`/`signalReference` 모두 (line, surface) 쌍 구조 통일. 토큰 12 → 13.

### `@wonik/tokens` (minor — additive)

- 새 property: `graphTokens.signalReference.surface` → `var(--color-graph-signal-reference-surface)`
- 새 hex (Light/Dark mirror): `#F0F0F0` — line `#ACACAC` (WONIK GRAY)의 paler 톤
- `tokens.css`: light/dark 각 `--color-graph-*` 12 → 13 (총 24 → 26).

### Figma

- `UI/UX Standardization 2.0` 파일의 `Graph` collection에 변수 1개 추가 필요 (`graph/signal/reference/surface`, scope: FRAME_FILL+SHAPE_FILL). 별도 phase.

### BC

- 기존 export 모두 유지. 컴포넌트 prop signature 영향 0.
- 토큰 슬롯 확보 — 캡쳐 9장엔 현재 binding 적용처 없음 (미래 area chart needs 대비).

자세한 결정·트레이드오프는 ADR-014 + `docs/GRAPH_TOKENS.md` 참조.
