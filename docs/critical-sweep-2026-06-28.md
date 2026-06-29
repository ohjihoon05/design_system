# CRITICAL 적합성 sweep — 2026-06-28

> 멀티에이전트(울트라코드) 1회 sweep. `@wonik/web` 25개 컴포넌트 + `@wonik/tokens`를 CLAUDE.md의 CRITICAL 규칙 전체에 대해 검사.
> 구조: 컴포넌트당 1 에이전트(review) → 발견 건마다 독립 에이전트(adversarial verify, false positive 기각) → 종합.
> 에이전트 62개 · review 의심 29건 → 적대 검증으로 **22건 false positive 기각** → 확정 7건 + 수동 마무리 2건 = **확정 9건**.

## 점수

| 규칙 | 결과 |
|------|------|
| R1 패키지 구조 | ✅ PASS (extra package 0, WARP import 0) |
| R2 raw 값 하드코딩 | ❌ **9건** (아래) |
| R3 의존성/import | ✅ PASS |
| R4 brand hex (#273E82) | ✅ PASS (오용 0) |
| R5 글로벌 state | ✅ PASS |
| R7 DTCG 1:1 leaf | ✅ PASS¹ |
| R8 React 19-only API | ✅ PASS |
| R9 interface colors | ✅ PASS² |
| R10 CSS-inject + SSR 가드 | ✅ PASS² |
| R12 AI 슬롭 | ✅ PASS |

¹ R7/R1 은 1-shot·적대 검증 X = **medium 신뢰**. 소스만 검사(DTCG export 빌드 미실행), R1 스캔은 `packages/`만(apps/ 미스캔).
² R9·R10 은 판단 의존도가 가장 높은 축 — 오류 가능성 최상. 아래 한계 참조.

## 확정 위반 (전부 R2)

### A. 즉시 토큰 치환 완료 (값 보존, ADR 불요) — ✅ 2026-06-28 수정

| 컴포넌트 | 파일:줄 | before | after |
|---|---|---|---|
| Tooltip | `Tooltip.tsx:162` | `padding: '6px 10px'` | `` `${space[2]} ${space[4]}` `` |
| Tooltip | `Tooltip.tsx:28` | `placementOffset = '6px'` | `space[2]` |
| Tooltip | `Tooltip.tsx:166` | `fontWeight: 400` | `fontWeight.regular` |
| Toast | `Toast.tsx:45` | `calc(100vw - 32px)` | `calc(100vw - ${space[8]})` |

→ Tooltip/Toast 테스트 33/33 green. value drift 0 (6px→6px, 400→400, 32px→32px, 10px→10px).

### B. 토큰 신설 필요 → **ADR backlog** (ADR-034 관문 미통과 시 자율 수정 금지)

| 컴포넌트 | 파일:줄 | 증거 | 막힌 이유 |
|---|---|---|---|
| **Modal** (critical) | `Modal.tsx:111` | `rgba(0,0,0,0.6)` scrim | overlay/scrim 토큰이 @wonik/tokens에 **없음**. 신설 = ADR + minor bump |
| Modal (warn) | `Modal.tsx:126` | `calc(100vh - 48px)` | 48px가 space 스케일 밖(max 32px). 합성(`space[8]+space[6]`)은 가능하나 의미 확인 필요 |
| **Skeleton** (critical) | `Skeleton.tsx:14` | radius `'4px'` | radius 스케일 = sm5/md10/full. 4px 없음 → 5px로 drift(ΔE/ADR-024) 또는 토큰 신설 |
| **Skeleton** (critical) | `Skeleton.tsx:15` | radius `'8px'` | 8px 없음 → 10px drift 또는 토큰 신설 |
| **Table** (critical) | `Table.tsx:46` | `fontSize: '13px'` | fontSize 스케일에 13px 없음(`componentSize.panelPaddingX='13px'`는 @internal HMI·web 미소비). label(12)/body(14) 선택 또는 ADR |

→ B군은 **값 보존 치환이 불가**(전부 스케일에 없는 값) = 단순 리팩터 아님. 토큰 결정(ADR-034 관문 통과 = 비준 디자인 소스에 값 존재 확인) 후 처리.

## 적대 레이어가 기각한 false positive 22건 (요지)

단순 grep/single-pass였으면 전부 "위반"으로 떴을 것. 검증 에이전트가 기각:

- **`1px solid ${token}` hairline** (Alert·Badge·Box·Card·Input 등 13곳) — 색은 토큰화돼 있고 `1px`은 ADR(line 581/687)에 "표준 관례"로 문서화된 합법 예외. borderWidth 토큰 신설은 오히려 ADR-034 위반.
- **컨트롤 height `24/32/40px`** (Button·Input·Checkbox·IconButton) — R2 대상(색·spacing·typography·border·radius)에 **height 없음** + 토큰도 없음.
- **Card elevation shadow** `0 1px 3px rgba(0,0,0,0.08)` — ADR-015 §대안3에서 "사용처 2곳 전엔 토큰화 보류"로 명시 결정한 값.
- **InlineEditableText `../Input` import** — 같은 패키지 내 상대 import → R3(패키지 간 의존) 무관. `../utils/ensureCssInjected`도 동일.
- **`outline-offset: 2px`** — CLAUDE.md가 지정한 focus 표준 geometry. Switch(정전 reference)도 동일 사용.

→ 신호:잡음 = **9:22**. "가짜 안심 금지"의 반대편인 "가짜 경보 폭탄"도 차단.

## 검사 못 한 영역 / 신뢰 한계 (정직)

- 종합(synth) 에이전트 + verify 6건이 계정 rate-limit(5:40pm KST)으로 잘림 → **maintainer가 직접 파일 읽어 마무리**(Textarea·Toast·Tooltip). 이 과정에서 +2건 확정(Tooltip fontWeight, Toast 32px).
- R1/R7 구조 = 1-shot, medium 신뢰. apps/(web-sandbox·atlas) WARP-import 미스캔.
- **R10 borderline**: Toast/Alert/Modal dismiss 버튼은 브랜드 focus 링 없음 → native ring 살아있어 "CRITICAL 아님"으로 판정. 단 디자이너 일관성 관점에선 warn 거리(3곳 동일 패턴).
- 컴포넌트당 1 에이전트 = cross-cutting(같은 토큰을 두 곳이 다르게 소비) 검출은 약함.
