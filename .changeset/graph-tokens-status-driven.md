---
"@wonik/tokens": minor
---

graph 도메인 토큰 추가 (status-driven 5축 taxonomy)

### ADR

- **ADR-012**: 그래프(시각화) 토큰을 별도 status-driven 도메인으로 분리, brand hex는 의도적으로 재사용. graph는 host-overridable이 아닌 internal 도메인으로 ADR-010·011의 interface variable과 별개 layer.

### `@wonik/tokens` (minor)

- 새 named export: `graphTokens` (9 그룹 × 19 property). 각 property는 CSS variable reference 반환.
- 새 source-of-truth: `theme-light.ts`의 `graphTokensLight`, `theme-dark.ts`의 `graphTokensDark` (현재는 light mirror).
- `tokens.css` light/dark 양쪽에 새 emit 19개: `--color-graph-{limit|signal|pass|action|annotation|axis}-...`.

### 5축 taxonomy

| 축 | 그룹 | 의미 |
|---|---|---|
| `limit` | `upper`, `lower` | 스펙 임계 zone (Range/Overshoot·Undershoot/Trim High·Low/Main·Sub Limit) |
| `signal` | `primary`, `tuned`, `reference` | 측정/튜닝/기준 신호 |
| `pass` (status) | (단일) | 판정 영역 (Spike, Pass Condition zone) |
| `action` | (단일) | 튜닝 가이드 화살표·지시 |
| `annotation` | (단일) | 콜아웃 라벨 (중립) |
| `axis` | (단일) | 축 라벨·그리드 |

### Brand hex 재사용 (raw hex 복제, alias 아님)

- `graph/signal/tuned/line` `#273E82` = WONIK BLUE (ADR-007 일치)
- `graph/signal/reference/line` `#ACACAC` = WONIK GRAY (ADR-007 일치)
- `graph/annotation/{fg,surface}`, `graph/axis/{label,grid}` 등도 brand/text/border 토큰과 hex 동일

CSS variable layer는 분리되어 있어 graph만 독립 조정 가능. 자세한 결정·트레이드오프는 ADR-012 참조.

### Figma

- `UI-UX-Standardization-2.0` 파일에 `Graph` collection 신규 등록 (Dark/Light modes, 19 vars, scope 좁힘 적용).

### BC

- 기존 export(`colors`/`statusTokens`/`interfaceColors` 등) 그대로 유지. BC 0.
- 컴포넌트 prop signature 영향 없음 (`@wonik/web`은 본 phase 내 변경 0).
