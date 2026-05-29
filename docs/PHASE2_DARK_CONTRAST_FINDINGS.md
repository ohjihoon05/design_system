# Phase 2 — Dark Mode Token Contrast Findings

**Date**: 2026-05-28 (측정) · 2026-05-29 (T8b closure 3/7)
**Scope**: Layer A 23 atoms — dark mode (`data-theme="dark"`) 색상 토큰 WCAG 2.1 AA contrast 측정
**Status**: **5/7 violations closure** (commit pending T8b, ADR-032). **2/7 보류** (primaryDark.base — brand 영향, 사내 design 협의 대기).

## 측정 기준

- **Text (small)**: 4.5:1 (WCAG 2.1 SC 1.4.3 AA)
- **Text (large 18pt+/14pt bold)**: 3.0:1
- **UI components / graphical objects**: 3.0:1 (WCAG 2.1 SC 1.4.11 AA)

## 위반 요약 — 7건 (영향 atom 5개)

> **T8b closure (2026-05-29)**: ADR-032로 5건 통과 (1·2·3·4·5·6·8 = bordersDark.mid + textDark.dim + primaryDark.selected 3 leaf 조정). 2건 (7 = primaryDark.base/stroke) 보류.

| # | 위치 | 색 페어 | 측정값 | 기준 | 결과 | T8b 결과 |
|---|------|---------|--------|------|------|---------|
| 1 | Input border on Input bg=surface (#1E1E21) | borderDark.mid (#52525C → **#82828A**) | **2.15** | UI 3.0 | ❌ FAIL | ✅ ≈ 4.59 |
| 2 | Input border on Input bg=canvas (#343434) | borderDark.mid (#52525C → **#82828A**) | **1.61** | UI 3.0 | ❌ FAIL | ✅ ≈ 3.41 |
| 3 | Input placeholder on Input bg=canvas | textDark.dim (#71717B → **#A0A0A8**) | **2.58** | Text 4.5 | ❌ FAIL | ✅ ≈ 4.92 |
| 4 | InlineEditableText muted on surface | textDark.dim (#71717B → **#A0A0A8**) | **3.44** | Text 4.5 | ❌ FAIL | ✅ ≈ 6.61 |
| 5 | InlineEditableText muted on canvas | textDark.dim (#71717B → **#A0A0A8**) | **2.58** | Text 4.5 | ❌ FAIL | ✅ ≈ 4.92 |
| 6 | FilterChip active text on active bg | primaryDark.selected (#6B82CC → **#8FA3DD**) on primaryDark.bg (#2A3556) | **3.27** | Text 4.5 | ❌ FAIL | ✅ ≈ 4.93 |
| 7 | FilterChip active border on active bg / surrounding canvas | interfaceColors.primary (#4A65B8) — cascade → **primaryDark.base** | **2.21 / 2.28** | UI 3.0 | ❌ FAIL | ⏸ 보류 (brand 협의) |
| 8 | Button outline border on surface | borderDark.mid (#52525C → **#82828A**) on #1E1E21 | **2.15** | UI 3.0 | ❌ FAIL | ✅ ≈ 4.59 (#1 동일) |

(Textarea는 Input과 동일 토큰을 공유하므로 #1·#2·#3 동일 위반.)

## 영향 atom 5개

| Atom | 위반 항목 | 영향 |
|------|-----------|------|
| Input | border, placeholder | dark mode에서 input 영역 경계 보이지 않음 + placeholder hint 판독 불가 |
| Textarea | border, placeholder | Input과 동일 (토큰 공유) |
| InlineEditableText | muted color | secondary text가 dark bg에서 묻힘 |
| FilterChip | active text, active border | 선택된 chip을 dark에서 구분하기 어려움 |
| Button | outline variant border | outline 버튼이 surface 위에서 거의 안 보임 |

## 근본 원인 — 토큰 leaf 5개

조정이 필요한 dark 토큰:

```ts
// packages/tokens/src/theme-dark.ts
bordersDark.mid: '#52525C'        // → 더 밝게 (예: #6B6B75 이상, surface 위에서 3.0:1 달성)
textDark.dim: '#71717B'           // → 더 밝게 (예: #A0A0A8 이상, surface 위에서 4.5:1 달성)
primaryDark.base: '#4A65B8'       // → cascade로 interfaceColors.primary 영향. 단 ADR-007 WONIK BLUE 제약으로 design 결정 별도 필요
primaryDark.selected: '#6B82CC'   // → FilterChip active text. 더 밝게 (#8FA3DD 수준)
primaryDark.bg: '#2A3556'         // → active chip bg. selected text와 contrast 확보 위해 더 어둡게 가능
```

## ADR-007 제약 (primaryDark.base)

ADR-007은 WONIK BLUE `#273E82`를 light mode primary로 고정. dark mode의 `primaryDark.base: #4A65B8`은 이미 dark 적응한 변종이므로 ADR-007 직접 위반은 아님. 단:

- FilterChip active border가 canvas 위에서 2.28 — dark에서 brand 색이 안 보이는 건 brand 인지도 측면에서 design 결정 필요
- 해법 후보: (a) primaryDark.base를 더 밝게 (#5A78D0 수준) — design 승인 필요, 또는 (b) FilterChip active 시 border를 두껍게 (1px → 2px) 또는 background contrast로 시각 분리 보강

## 처리 방향 — 회귀 가드 우선

사용자 결정 (2026-05-28): **finding만 문서화하고 Phase 1 (axe-core dark 확장)부터 진행**.

이유:
- Phase 1·3·5를 먼저 완료해 회귀 가드를 깔아두면, 토큰 조정 시 dark 회귀를 자동 detect 가능
- 토큰 hex 조정은 ADR + Changesets minor bump 필수 (CLAUDE.md CRITICAL) — 별도 호흡 필요
- primaryDark.base 조정은 design 측면 사전 협의 필요 (사내 환경 진입 후)

## 후속 작업 (Phase 5 회귀 가드 완료 후)

1. **ADR-030 (가칭)**: dark mode 토큰 contrast 조정 — 위 5개 leaf hex 변경 사유 + 새 값 결정 근거
2. **Changesets minor bump**: `@wonik/tokens`
3. **Contrast 측정 자동화**: build 시 contrast script를 CI에 incorporate (현재는 scripts/check-dark-contrast.ts 수동 실행)
4. **Storybook a11y addon**: dark mode 시각 검증 시 axe-core가 위반을 자동 flag (Phase 1 완료 후 자동 동작)

## 측정 스크립트 위치

- `packages/tokens/scripts/check-dark-contrast.ts` (또는 본 측정에 사용된 임시 스크립트)
- minor bug: `target.startsWith('text')` 분기에서 'placeholder-AA' label이 'placeholder'로 시작해 3.0 기준 적용됨 (PASS 표시되지만 실제 4.5:1 기준에선 FAIL). 후속 작업 시 fix.

## 참고 ADR

- ADR-007: WONIK BLUE #273E82 (Primary)
- ADR-009: Light/dark dual mode (data-theme)
- ADR-010: Cascade override (host product)
- ADR-011: Module-scope CSS injection + focus indicator
- ADR-027: addon-a11y axe-core afterEach hook (현재 light only — Phase 1에서 dark 확장 예정)
