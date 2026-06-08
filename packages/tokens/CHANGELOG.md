# @wonik/tokens

## 1.0.0

사내 첫 stable release 기준점 (ADR-035 cutover). 토큰 layer 전체 — primitives 색 팔레트(ADR-021) + light/dark theme 정합(ADR-022/024) + button/table component 토큰(ADR-023/025) + dark contrast 교정(ADR-032) + DTCG 1:1 호환 정리(ADR-020). 누적 dry-run changeset을 1.0.0으로 fold.

> 아래 0.x 이력은 집 dry-run(Verdaccio, registry **미발행**). 1.0.0이 사내 첫 공개 버전이자 **F28(peer major churn) 종결 baseline**.

## 0.3.0

### Minor Changes

- 602f429: DTCG 호환 audit + dead token 제거 (ADR-020).

  - `radius.panelHeader` 제거 — 사용처 0개의 dead token. shorthand 값(`'10px 10px 0 0'`)이라 DTCG 1:1 매핑을 깨고 있어 제거.
  - `build-css.ts`의 panelHeader special case 제거.
  - 본 변경은 토큰 layer 안정화의 일부 — atom 21개 안정화된 후 토큰 layer를 DTCG-friendly 형태로 정리한다.

  DTCG JSON emit 또는 변환 스크립트는 추가하지 않음 (ADR-020 — YAGNI). 구조만 1:1 매핑 가능하게 유지. 매핑 룰은 `docs/TOKEN_DTCG_COMPAT.md` 참조.

## 0.2.1

### Patch Changes

- Layer B dry run (집 시뮬레이션) — dual-direction 흐름 검증 patch. Verdaccio @ 127.0.0.1:14873에 0.2.0 publish 후, 변경 없는 patch bump → 0.2.1 publish → ppt가 caret(`^0.2.0`) 자동 흡수하는지 한 사이클 돌림. 코드 영향 0, version semantic만 변동.

## 0.2.0

### Minor Changes

- 422b5ea: layer A 1차 채움 종료 (14 atoms × ppt 3페이지 dogfood × interface variable cascade 입증).
  publish-ready transition: 0.0.0 → 0.1.0. 두 패키지 모두 description / repository / homepage / license / publishConfig 추가. `private: true` 제거 + placeholder registry URL로 실수 publish 방어. prepublishOnly build/test guard. `@wonik/web`의 `@wonik/tokens` peer 명시. sideEffects 선언. ADR-018 — registry 옵션 비교 (사내 npm / GitHub Packages / tarball) 및 결정 보류 (사내 IT 협의 후 확정).
  실제 첫 publish는 사내 registry 결정 후 별도 minor phase.
- 28e08ef: graph 도메인 토큰 19 → 12개로 축소 (chrome 제거 + duplicate label 통합)

  ### ADR

  - **ADR-013**: ADR-012를 부분 supersede. 의미축(limit/signal/pass) 3개와 9개 property는 유지, chrome 그룹 3개(`action`/`annotation`/`axis`)와 hex가 line과 동일한 duplicate `.label` 2개를 제거.

  ### `@wonik/tokens` (minor — 토큰 surface area 축소)

  **제거된 7개**:

  | 제거 토큰                        | runtime 대체                  | CSS variable 대체                     |
  | -------------------------------- | ----------------------------- | ------------------------------------- |
  | `graphTokens.limitUpper.label`   | `graphTokens.limitUpper.line` | `var(--color-graph-limit-upper-line)` |
  | `graphTokens.limitLower.label`   | `graphTokens.limitLower.line` | `var(--color-graph-limit-lower-line)` |
  | `graphTokens.action.line`        | `graphTokens.limitUpper.line` | `var(--color-graph-limit-upper-line)` |
  | `graphTokens.annotation.fg`      | `text.dark`                   | `var(--color-text-dark)`              |
  | `graphTokens.annotation.surface` | `surfaces.surfaceWhite`       | `var(--color-surface-white)`          |
  | `graphTokens.axis.label`         | `text.primary`                | `var(--color-text-primary)`           |
  | `graphTokens.axis.grid`          | `borders.light`               | `var(--color-border)`                 |

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

- 28e08ef: graph: `signalReference.surface` 추가 — signal 3개 신호 (line, surface) 쌍 대칭 완성

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

- 28e08ef: graph 도메인 토큰 추가 (status-driven 5축 taxonomy)

  ### ADR

  - **ADR-012**: 그래프(시각화) 토큰을 별도 status-driven 도메인으로 분리, brand hex는 의도적으로 재사용. graph는 host-overridable이 아닌 internal 도메인으로 ADR-010·011의 interface variable과 별개 layer.

  ### `@wonik/tokens` (minor)

  - 새 named export: `graphTokens` (9 그룹 × 19 property). 각 property는 CSS variable reference 반환.
  - 새 source-of-truth: `theme-light.ts`의 `graphTokensLight`, `theme-dark.ts`의 `graphTokensDark` (현재는 light mirror).
  - `tokens.css` light/dark 양쪽에 새 emit 19개: `--color-graph-{limit|signal|pass|action|annotation|axis}-...`.

  ### 5축 taxonomy

  | 축              | 그룹                            | 의미                                                                     |
  | --------------- | ------------------------------- | ------------------------------------------------------------------------ |
  | `limit`         | `upper`, `lower`                | 스펙 임계 zone (Range/Overshoot·Undershoot/Trim High·Low/Main·Sub Limit) |
  | `signal`        | `primary`, `tuned`, `reference` | 측정/튜닝/기준 신호                                                      |
  | `pass` (status) | (단일)                          | 판정 영역 (Spike, Pass Condition zone)                                   |
  | `action`        | (단일)                          | 튜닝 가이드 화살표·지시                                                  |
  | `annotation`    | (단일)                          | 콜아웃 라벨 (중립)                                                       |
  | `axis`          | (단일)                          | 축 라벨·그리드                                                           |

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

- 28e08ef: Phase 08+09+10: layer A contract 정착 + form 컨트롤 polish

  ### ADR

  - **ADR-010**: host-디자인 시스템 CSS variable contract. interface variable 6개(`--color-bg`/`--color-surface`/`--color-border`/`--color-text`/`--color-text-muted`/`--color-primary`) + cascade fallback 패턴(`var(--color-X, var(--color-X-internal))`). host가 같은 이름 변수 정의 시 host 우선, 미정의 시 우리 internal로 fallback. ppt dogfood Trial 3에서 노출된 invisibility 결함 해결.
  - **ADR-011**: form 컨트롤 focus·resize·placeholder·hover 정책. `:focus-visible` outline 2px + `--color-focus` 7번째 interface variable 격상 + Input/Textarea `:hover` border 진해짐 + `::placeholder` opacity:1 명시 + Textarea `resize?` prop 노출. WCAG 2.1 SC 2.4.7 AA 충족.

  ### `@wonik/tokens` (minor)

  - 새 named export: `interfaceColors` (7 keys — `bg`/`surface`/`border`/`text`/`textMuted`/`primary`/`focus`). 각 키는 cascade fallback 형태 `var(--color-X, var(--color-X-internal))` 반환.
  - `tokens.css` light/dark 양쪽에 새 alias emit (5개): `--color-bg`, `--color-text`, `--color-text-muted`, `--color-focus`, `--color-border-strong`.
  - 기존 export(`surfaces`/`text`/`borders`/`primary` 등) 그대로 유지. BC 0.

  ### `@wonik/web` (minor)

  - 컴포넌트 8개(Button·Input·Textarea·Spinner·Switch·Radio·Checkbox·Text)의 색 reference를 `interfaceColors.*`로 갱신. 의미상 매핑 안 되는 경우(Button primary variant의 흰 텍스트, Switch thumb 흰 점)는 internal 그대로.
  - form 컨트롤 6개(Button·Input·Textarea·Checkbox·Radio·Switch)에 module-scope `ensureCssInjected()` 패턴 적용. `:focus-visible`/`:hover`/`::placeholder` CSS block + className `wonik-X` 부여. consumer className은 머지 보존. SSR 가드 포함.
  - **Textarea**: `resize?: 'none' | 'vertical' | 'both'` prop 추가 (default `'vertical'`, disabled 시 `'none'` 강제). BC compatible — 기존 사용처 영향 0.
  - prop signature 변경 없음 — 신규 optional prop(Textarea의 `resize?`)만 추가. breaking 0.
  - 163 tests passing (회귀 0).
