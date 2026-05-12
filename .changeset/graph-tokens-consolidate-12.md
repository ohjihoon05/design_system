---
"@wonik/tokens": minor
---

graph 도메인 토큰 19 → 12개로 축소 (chrome 제거 + duplicate label 통합)

### ADR

- **ADR-013**: ADR-012를 부분 supersede. 의미축(limit/signal/pass) 3개와 9개 property는 유지, chrome 그룹 3개(`action`/`annotation`/`axis`)와 hex가 line과 동일한 duplicate `.label` 2개를 제거.

### `@wonik/tokens` (minor — 토큰 surface area 축소)

**제거된 7개**:

| 제거 토큰 | runtime 대체 | CSS variable 대체 |
|---|---|---|
| `graphTokens.limitUpper.label` | `graphTokens.limitUpper.line` | `var(--color-graph-limit-upper-line)` |
| `graphTokens.limitLower.label` | `graphTokens.limitLower.line` | `var(--color-graph-limit-lower-line)` |
| `graphTokens.action.line` | `graphTokens.limitUpper.line` | `var(--color-graph-limit-upper-line)` |
| `graphTokens.annotation.fg` | `text.dark` | `var(--color-text-dark)` |
| `graphTokens.annotation.surface` | `surfaces.surfaceWhite` | `var(--color-surface-white)` |
| `graphTokens.axis.label` | `text.primary` | `var(--color-text-primary)` |
| `graphTokens.axis.grid` | `borders.light` | `var(--color-border)` |

**최종 12개 토큰 / 6 그룹**:

- `limitUpper` `{line, surface}` — line이 라벨 텍스트까지 겸용
- `limitLower` `{line, surface}` — 동일
- `signalPrimary` `{line, surface}`
- `signalTuned` `{line, surface}` — `#273E82` WONIK BLUE (ADR-007)
- `signalReference` `{line}` — `#ACACAC` WONIK GRAY (ADR-007)
- `pass` `{line, surface, label}` — label만 명도 다른 hex 유지

### `tokens.css` 변화

- `--color-graph-*` light/dark 각 19 → 12 (총 38 → 24).
- 제거된 7 variable: `--color-graph-limit-upper-label`, `--color-graph-limit-lower-label`, `--color-graph-action-line`, `--color-graph-annotation-fg`, `--color-graph-annotation-surface`, `--color-graph-axis-label`, `--color-graph-axis-grid`.

### Figma

- `UI-UX-Standardization-2.0` 파일의 `Graph` collection 7개 variable 제거 동기화 필요 (수동 또는 use_figma).

### BC

- `@wonik/web` 컴포넌트는 graph 토큰을 import 안 하므로 컴포넌트 prop signature 영향 없음.
- 외부 consumer 0 (graph 토큰 도입은 ADR-012로 직전 phase, dogfood 사용 전).
- 그래도 토큰 삭제는 ADR + minor bump 규칙(CLAUDE.md) 준수.

자세한 결정·트레이드오프·migration 표는 ADR-013 + `docs/GRAPH_TOKENS.md` 참조.
