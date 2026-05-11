# Graph Design Tokens

원익IPS 디자인 시스템의 **그래프(시각화) 영역 전용 색 토큰** 가이드. plot/chart 같은 데이터 시각화 surface에서 사용한다. 결정 근거와 트레이드오프는 [ADR-012](./ADR.md#adr-012) 참조.

## 1. 한눈에 보기

- **19개 토큰**, 9개 의미 그룹, 5개 의미 축
- **status-driven** — 색이 데이터의 *역할*에 묶임 (임계/신호/판정/액션/주석)
- **CSS variable + TypeScript named export** 양쪽 노출
- **Figma Variables** 1:1 mirror (`Graph` collection, Light/Dark mode)
- 기존 brand·text·border 토큰과 hex가 일부 겹치지만 **CSS variable layer는 독립** (자세한 정책은 §6)

## 2. 5축 status-driven taxonomy

```
graph
├── limit         스펙 임계 zone
│   ├── upper     상한 (Range2/Overshoot/Trim High/Main Limit)
│   └── lower     하한 (Range1/Undershoot/Trim Low/Sub Limit)
├── signal        플롯 라인
│   ├── primary   현재 측정값/관찰값 (Profile TC/Tuned PV/Power)
│   ├── tuned     튜닝 후 결과 (Tuned SV/P Ratio Tune)
│   └── reference 기준/이전/비활성 (Ref SV/Ref PV/PID SUM)
├── pass          판정 영역 (Spike/Pass Condition zone)
├── action        튜닝 가이드 화살표·지시
├── annotation   콜아웃 라벨 (중립)
└── axis          축 라벨·그리드
```

| 축 | 언제 쓰나 | 예시 (캡쳐 출처) |
|---|---|---|
| `limit.upper` | 위로 벗어나면 위험·warning인 임계선 | Range2, Overshoot, Trim High, Main Limit |
| `limit.lower` | 아래 임계 또는 하한 target | Range1, Undershoot, Trim Low, Sub Limit |
| `signal.primary` | 사용자가 지금 보고 있는 측정/관찰 값 | Profile TC, Tuned PV, Power |
| `signal.tuned` | 튜닝/조정 후 결과 신호 | Tuned SV, P Ratio Tune |
| `signal.reference` | 비교용 기준선 또는 비활성 신호 | Ref SV, Ref PV, PID SUM |
| `pass` | OK 판정 영역·구간 | Spike, Pass Condition box |
| `action` | "이 방향으로 조정" 같은 가이드 화살표 | RDNP Up→Slope Up, Offset Up→… |
| `annotation` | 데이터에 붙는 중립 콜아웃 라벨 | "Profile 적용 시점", "IF Wafer Count..." |
| `axis` | 축 tick 라벨·그리드 라인 | "Power (%)", "Time (min)", 점선 grid |

## 3. 19개 토큰 reference

값은 Light = Dark (현재 mirror 상태). property 의미:
- `line` — 라인·stroke·dot
- `surface` — 영역 fill·라벨 박스 배경
- `label` — 라벨 텍스트 색
- `fg` — foreground 텍스트 (annotation 전용)
- `grid` — 그리드 라인 전용

| Variable | Hex | Scope (Figma) |
|---|---|---|
| `graph/limit/upper/line` | `#EC4899` | SHAPE_FILL, STROKE_COLOR |
| `graph/limit/upper/surface` | `#FCE7F3` | FRAME_FILL, SHAPE_FILL |
| `graph/limit/upper/label` | `#EC4899` | TEXT_FILL |
| `graph/limit/lower/line` | `#14B8A6` | SHAPE_FILL, STROKE_COLOR |
| `graph/limit/lower/surface` | `#CCFBF1` | FRAME_FILL, SHAPE_FILL |
| `graph/limit/lower/label` | `#14B8A6` | TEXT_FILL |
| `graph/signal/primary/line` | `#818CF8` | SHAPE_FILL, STROKE_COLOR |
| `graph/signal/primary/surface` | `#EEF0FE` | FRAME_FILL, SHAPE_FILL |
| `graph/signal/tuned/line` | `#273E82` *(= WONIK BLUE)* | SHAPE_FILL, STROKE_COLOR |
| `graph/signal/tuned/surface` | `#D6DCF0` *(= primary.bg)* | FRAME_FILL, SHAPE_FILL |
| `graph/signal/reference/line` | `#ACACAC` *(= WONIK GRAY)* | SHAPE_FILL, STROKE_COLOR |
| `graph/pass/line` | `#22C55E` | SHAPE_FILL, STROKE_COLOR |
| `graph/pass/surface` | `#DCFCE7` | FRAME_FILL, SHAPE_FILL |
| `graph/pass/label` | `#16A34A` | TEXT_FILL |
| `graph/action/line` | `#EC4899` *(limit.upper와 동일 hue)* | SHAPE_FILL, STROKE_COLOR |
| `graph/annotation/fg` | `#303030` *(= text.dark)* | TEXT_FILL |
| `graph/annotation/surface` | `#FFFFFF` *(= surface.white)* | FRAME_FILL, SHAPE_FILL |
| `graph/axis/label` | `#71717B` *(= text.primary)* | TEXT_FILL |
| `graph/axis/grid` | `#E1E1E4` *(= border.light)* | SHAPE_FILL, STROKE_COLOR |

## 4. 사용 방법

### TypeScript (runtime)

```ts
import { graphTokens } from '@wonik/tokens';

// 컴포넌트 inline style 또는 chart 라이브러리 prop에 전달
<line stroke={graphTokens.signalTuned.line} />
<rect fill={graphTokens.limitUpper.surface} />
<text fill={graphTokens.axis.label}>Power (%)</text>
```

runtime export shape (2-level, `statusTokens`와 동일):

```ts
graphTokens.limitUpper.line          // 'var(--color-graph-limit-upper-line)'
graphTokens.limitUpper.surface
graphTokens.limitUpper.label
graphTokens.limitLower.{line,surface,label}
graphTokens.signalPrimary.{line,surface}
graphTokens.signalTuned.{line,surface}
graphTokens.signalReference.line
graphTokens.pass.{line,surface,label}
graphTokens.action.line
graphTokens.annotation.{fg,surface}
graphTokens.axis.{label,grid}
```

### CSS

```css
.power-line { stroke: var(--color-graph-signal-primary-line); }
.pass-zone  { fill:   var(--color-graph-pass-surface); }
.main-limit { stroke: var(--color-graph-limit-upper-line); stroke-dasharray: 6 4; }
```

### Figma

`UI-UX-Standardization-2.0` 파일의 좌측 사이드바 → **Local variables** → `Graph` collection.

- Hierarchy: `graph` → `limit` → `upper` → `line` (slash가 폴더가 됨)
- Mode 토글로 Light/Dark 전환 (현재 양쪽 동일값)
- 도형의 fill/stroke/text fill 패널에서 변수 picker 열면 scope에 맞는 변수만 노출

## 5. Status-driven 매핑 cheat sheet

캡쳐에서 본 데이터 → 토큰 빠른 매칭:

| 캡쳐에서 본 시각 요소 | 어느 토큰? |
|---|---|
| 빨간/마젠타 점선 (위쪽 임계) | `limit.upper.line` |
| 핑크 라벨 박스 "Main Limit"/"Trim High" | `limit.upper.surface` + `limit.upper.label` |
| 틸/시안 점선 (아래쪽 임계) | `limit.lower.line` |
| 민트 라벨 박스 "Sub Limit"/"Trim Low" | `limit.lower.surface` + `limit.lower.label` |
| 라벤더 곡선 (지금 측정 중) | `signal.primary.line` (+ area fill: `.surface`) |
| 진한 네이비 곡선 (조정 후) | `signal.tuned.line` |
| 회색 곡선/dashed (참조용) | `signal.reference.line` |
| 그린 곡선/박스 (OK 영역) | `pass.line` + `pass.surface` (+ 글자: `.label`) |
| 마젠타 화살표 ("이 방향으로 조정") | `action.line` |
| 흰 배경 + 검정 글자 콜아웃 박스 | `annotation.surface` + `annotation.fg` |
| 회색 축 라벨 텍스트 ("Power (%)", "Time (min)") | `axis.label` |
| 회색 점선 grid | `axis.grid` |

## 6. brand hex 재사용 정책

다음 graph 토큰은 기존 brand·text·border 토큰과 **hex 값이 같다** (raw hex 복제 — alias 아님):

| graph 토큰 | hex | 같은 hex 가진 기존 토큰 |
|---|---|---|
| `signal/tuned/line` | `#273E82` | `primary.base` (WONIK BLUE, ADR-007) |
| `signal/tuned/surface` | `#D6DCF0` | `primary.bg` |
| `signal/reference/line` | `#ACACAC` | `secondary.base` (WONIK GRAY) |
| `annotation/fg` | `#303030` | `text.dark` |
| `annotation/surface` | `#FFFFFF` | `surfaces.surfaceWhite` |
| `axis/label` | `#71717B` | `text.primary` |
| `axis/grid` | `#E1E1E4` | `borders.light` |

**왜 이렇게 했나**:
- Tuned 신호가 brand color인 것은 brand 정체성의 의도된 표현 (`statusTokens.run.dot`이 `#273E82` 재사용한 선례와 동일)
- 단 graph 가독성 문제로 tuned 색만 미세 조정해야 할 때 brand 토큰을 건드리지 않고 graph만 변경 가능해야 하므로 CSS variable layer는 분리
- alias로 두면 brand 변경이 graph로 자동 전파되어 분리 가치를 잃음

**한계**:
- host가 `--color-primary`를 override해도 graph는 따라가지 않음 (의도된 분리)
- 미래에 brand-following이 더 적합하다고 판단되면 raw hex를 `var(--color-primary)` alias로 전환 (별도 ADR 필요)

자세한 결정 근거는 [ADR-012](./ADR.md#adr-012) §brand-hex-재사용 항목 참조.

## 7. host 매핑과의 관계 (ADR-010/011)

- **interface variable 7개** (`bg`/`surface`/`border`/`text`/`textMuted`/`primary`/`focus`)는 **host product가 own**하는 컬러 (ADR-010·011)
- **graph 토큰은 host와 매핑되지 않는 internal 도메인** — 우리 시스템이 의미·일관성을 own
- 따라서 graph는 `interfaceColors.*`가 아닌 `graphTokens.*`로 별도 reference
- host가 brand color를 override해도 graph는 안정적으로 의미 색을 유지 (시각화 의미 보존)

## 8. dark mode 현 상태

`theme-dark.ts`의 `graphTokensDark = graphTokensLight` mirror로 시작 (`statusTokensDark`와 동일 패턴). 어두운 배경 위에서:

- ✅ `line`·`label` 톤은 충분히 채도 있어 가독성 유지 예상
- ⚠️ `surface` fill의 연한 톤 (`#FCE7F3`/`#CCFBF1`/`#EEF0FE`/`#DCFCE7`)은 dark 배경 위에서 floating할 수 있음 — 별도 검증 필요
- 첫 dark host product에서 issue 발견 시 `graphTokensDark`에 dark 전용 hex 분리 (별도 phase)

## 9. 컴포넌트 import surface (1단계)

1단계 `@wonik/web` 컴포넌트는 form 컨트롤 위주(Button/Input/Textarea/Switch/Checkbox/Radio). chart 컴포넌트는 1단계 범위 외 (ADR-001 — 첫 customer 없이 추상화 안 함).

graph 토큰의 실제 소비자는 **dogfood product** (ppt 후속 view 또는 recharts/visx 같은 chart 라이브러리 사용처)에서 직접 `graphTokens.*` 또는 CSS variable을 reference한다. 차트 라이브러리 wrapper 컴포넌트는 needs 등장 시 그때 도입.

## 10. 관련 파일

| 파일 | 역할 |
|---|---|
| `packages/tokens/src/graph.ts` | runtime export `graphTokens` (var refs) |
| `packages/tokens/src/theme-light.ts` | `graphTokensLight` hex source-of-truth |
| `packages/tokens/src/theme-dark.ts` | `graphTokensDark = graphTokensLight` mirror |
| `packages/tokens/scripts/build-css.ts` | `Graph (semantic)` section emit |
| `packages/tokens/dist/tokens.css` | 빌드 산출물 (light/dark 19개 `--color-graph-*`) |
| `docs/ADR.md` (ADR-012) | 결정 근거 + 트레이드오프 |
| `.changeset/graph-tokens-status-driven.md` | minor bump 기록 |

## 11. 변경 절차

토큰 추가·이름 변경·삭제는 ADR 추가 + Changesets minor 이상 bump (CLAUDE.md 규칙). 색 hex만 미세 조정하는 경우도 시각 영향이 있으므로 patch 아닌 minor.

1. `theme-light.ts` (필요 시 `theme-dark.ts`) hex 수정
2. (이름·구조 변경 시) `graph.ts` runtime export 갱신
3. `pnpm -F @wonik/tokens build` 로 CSS variable 재생성 확인
4. Figma `Graph` collection 동기화 (수동 또는 `use_figma`)
5. `pnpm changeset` 으로 변경 항목 추가
6. ADR 추가 또는 ADR-012 갱신
