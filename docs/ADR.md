# Architecture Decision Records

## 철학

지속 가능한 인프라가 트렌드보다 우선한다. 디자인 시스템은 시한 있는 프로젝트가 아니라 회사가 살아있는 한 계속 키워가는 자산이다. 작은 시작 → 실제 사용 검증 → 점진 확장의 순서를 지키고, "토스급 150+ 컴포넌트"는 단번에 만들 목표가 아니라 6개월·1년·3년에 걸쳐 도달할 방향이다.

핵심 원칙 세 가지:
1. **첫 customer 없이는 추상화하지 않는다.** 컴포넌트는 진짜 dogfood 사용처(ppt, WARP)에서 도출되거나, 거기서 검증된 후에야 라이브러리에 들어간다.
2. **모드는 분리하되 토큰은 공유한다.** WARP의 산업용 미적과 일반 web service의 ergonomic한 미적은 다르되, 색·타이포·spacing 같은 base 토큰은 한 곳에서만 정의된다.
3. **유지보수자(= 본인)가 1인이라는 사실을 architecture에 반영한다.** 자동화·복잡한 파이프라인 도입 전에, 1인이 6개월 후에도 유지할 수 있는 단순함을 우선한다.

---

### ADR-001: 공통 토큰 베이스 + Web 컴포넌트 단일 패키지로 시작
**결정**: 모노레포 안에 `@wonik/tokens`(공통 토큰)과 `@wonik/web`(Web 컴포넌트) 두 패키지로 시작한다. 다른 form factor(모바일 앱·HMI 등)용 별도 패키지(`@wonik/app`, `@wonik/warp` 등)는 **진짜 product가 등장하는 시점**에 그 형태(별도 패키지 vs 컴포넌트 variant prop)를 보고 결정한다 — 미리 architecture에 박지 않는다.
**이유**: (a) **첫 customer 없이 추상화하지 않는다** — 1단계 첫 customer는 ppt(web). 다른 form factor의 진짜 product는 아직 없으므로 패키지 형태 결정은 시기상조. (b) **분리의 적합성은 form factor에 달림** — 모바일이 React Native라면 분리 필요, PWA/Electron이라면 분리 무의미. 형태가 정해져야 판단 가능. (c) **추가는 쉽고 통합은 어렵다** — 처음부터 단일로 시작했다가 분리는 쉽지만, 처음부터 분리해뒀다가 통합 필요해지면 prop signature·import 경로 마이그레이션 부담. (d) **1인 운영 부담 최소화** — 패키지 수가 적을수록 빌드·테스트·publish·changelog 운영이 단순.
**트레이드오프**: (1) WARP 시안의 시각 언어가 `@wonik/web`과 다르므로 진짜 HMI product 등장 시 `@wonik/web`에서 흡수할지 `@wonik/warp`로 분리할지 다시 결정해야 함 — 단 그 시점에 진짜 needs가 명확해진 상태이므로 결정 부담 적음. (2) 토큰 공유(`@wonik/tokens`)는 어떤 결정 path든 그대로 valid — base는 미래에도 안 바뀐다.

---

### ADR-002: Stack은 React + TypeScript + Tailwind CSS v4 + Vite
**결정**: 컴포넌트는 React 함수형, TypeScript strict, 빌드 도구는 Vite. 스타일은 Tailwind CSS v4 + CSS 변수로 토큰 노출. **React peer는 `^18.0.0 || ^19.0.0` dual 지원 (ADR-008).** 개발·테스트 환경은 React 19로 통일 (ppt와 일치).
**이유**: (a) 첫 dogfood인 ppt가 React 19 + Vite + TS + Tailwind v4 → 우리 개발 환경도 그대로. (b) AI 시대 사내에서 새로 등장할 web service들도 React-first일 가능성 높음 (AI SDK들이 React 위주). (c) Tailwind v4의 CSS 변수 기반 테마는 토큰 시스템과 자연스럽게 매핑. (d) dual peer는 ppt(19) + Figma Make Kit(18 요구)을 한 패키지로 모두 만족시키는 토스 OSS 표준 — 자세한 결정은 ADR-008.
**트레이드오프**: Vue/Angular/Svelte 사용 팀이 등장하면 별도 작업 필요. 현재로선 그런 팀이 회사 내에 없다고 가정.

---

### ADR-003: 첫 dogfood는 ppt(Factory PPT) 프로젝트
**결정**: `@wonik/web`의 첫 사용처는 ppt 프로젝트. ppt가 MVP 단계라 디자인 시스템을 일괄 적용하기에 적합. 일반 web service 컴포넌트의 ergonomic은 ppt에서 검증된다.
**이유**: 디자인 시스템의 #1 실패 패턴은 "추상적인 컴포넌트만 쌓이고 실 적용처가 없는 것". ppt는 (1) 사용자 본인이 운영해 fast feedback 가능, (2) 이미 사내 팀원이 실사용 중, (3) Stack이 정확히 일치. WARP는 이미 자체 디자인이 정착돼 있어 first-customer 부담을 안 줌.
**트레이드오프**: ppt 도메인에 편향된 컴포넌트가 만들어질 위험(예: SortableList의 default behavior가 슬라이드 썸네일에 맞춰짐). → 두 번째 dogfood가 등장하면 일반화 리팩토링 필요. 그 전까지는 의도적으로 specific하게 둠(YAGNI).

---

### ADR-004: WARP HMI 시안은 토큰·시각 언어 reference로만 사용
**결정**: `WONIK IPS — WARP Design System/`은 사용자분이 만든 **HMI(Human-Machine Interface) 디자인 시안(concept)**으로, 어떤 production product에도 적용된 적 없다. 1단계에서는 이 시안에서 (1) 토큰 베이스(`@wonik/tokens`)와 (2) 시각 언어 원칙(border-only elevation, no glass/gradient, dense data UI)만 추출하고, 시안의 산업용 컴포넌트(DataPanel/StatusIndicator/Toolbar)는 production화하지 않는다. WARP 시안 폴더는 보존된다.
**이유**: (a) **첫 customer 없이 추상화하지 않는다** (ADR-001) — HMI product가 아직 등장 안 했으므로 산업용 컴포넌트 production화는 시기상조. (b) HMI 시안의 컴포넌트는 매우 도메인-specific(PMC, LPT, Wafer Mapping, Macro Steps 등) — 진짜 사용처 없이는 추상화 형태(별도 패키지 vs 컴포넌트 variant)를 결정하기 어렵다. (c) 시안 폴더는 그대로 보존 — 시각·토큰 reference로 가치 있고, 진짜 HMI product 등장 시 참조한다. (d) 시안에 있던 inconsistency(`#2B7FFF` 컴포넌트 코드 vs `#273D7F` CSS, undefined CSS vars)는 시안이 production 아니므로 즉시 정리 대상 아님 — 단 토큰 추출 시 정확한 공식 brand color(WONIK BLUE `#273E82`)로 통일(ADR-007).
**트레이드오프**: 진짜 HMI product 등장 시 시안을 production-grade로 만드는 작업 발생 — 단 시안이 잘 보존돼 있어 시간 비용 적고, 그 시점에 진짜 needs가 명확해진 상태에서 형태 결정 가능.

---

### ADR-005: ~~1단계는 light-mode 전용~~ → ADR-009로 일부 변경
**결정 (초기)**: 첫 단계의 모든 컴포넌트는 light mode + 데스크톱 해상도(WARP 1920×1080 고정, Web 1280px+ 우선). 다크 모드와 모바일 반응형은 1단계 범위 외.
**이유**: (a) 첫 customer(ppt, WARP) 둘 다 데스크톱 web. 모바일 needs가 현재 0. (b) light/dark 두 테마를 1단계부터 만들면 토큰 수가 2배가 되고, 1인 운영에서 sustaining 비용이 부담. (c) 다크 모드는 industry standard로 자리잡았지만, 만들어두고 안 쓰는 것보다 첫 모바일/다크 needs가 명확해진 후 추가하는 게 sustainable.
**트레이드오프**: 향후 다크 모드 추가 시 토큰 architecture 리팩토링 비용 발생 (semantic naming은 미리 잡아둘 수 있도록 ADR-006).

**갱신 (2026-05-08, ADR-009로 일부 supersede)**: ppt(다크 모드 + indigo primary)를 dogfood로 분석한 결과 ppt는 우리 light-mode 시스템과 정면 충돌이고, "ppt를 light로 마이그레이션"보다 "우리가 dark theme도 지원"이 PRD 장기 비전과 일치한다. 다크 모드는 **1단계 범위 외 → 1단계 핵심**으로 승격(ADR-009). 모바일·반응형은 본 ADR-005 그대로 1단계 외 유지.

---

### ADR-006: 토큰은 CSS 변수 + TypeScript 상수 양쪽으로 export
**결정**: `@wonik/tokens`은 빌드 시 두 가지 산출물 생성 — (1) CSS 변수 정의 파일(`tokens.css`, 런타임에서 사용), (2) TypeScript 상수 export(`import { colors } from '@wonik/tokens'`, 빌드 타임 타입 안전). 두 표현은 동일 source(TypeScript)에서 생성.
**이유**: Tailwind v4 + CSS 변수로 동적 테마 전환(향후 다크 모드)을 자연스럽게 지원하면서, 컴포넌트 코드에서는 IDE 자동완성·타입 안전이 필요. 두 형태를 동시에 export하면 use case에 맞게 선택 가능.
**트레이드오프**: 빌드 step 추가 + sync 책임. → Style Dictionary 같은 도구 도입할 수 있지만 1단계에서는 단순한 자체 빌드 스크립트로 충분(YAGNI).

---

### ADR-007: Brand color는 원익IPS 공식 CI를 source of truth로
**결정**: Primary는 **WONIK BLUE `#273E82`** (RGB 39, 62, 130 / CMYK 70-52-0-49), Secondary는 **WONIK GRAY `#ACACAC`** (RGB 172, 172, 172 / CMYK 0-0-0-33)로 통일. 출처는 원익IPS 공식 CI 가이드 (`https://www.ips.co.kr/ko/company/ci.php`).
**이유**: (a) 회사 공식 brand 가이드가 실재하므로 자체 결정보다 공식 source가 우선. WONIK BLUE는 "future, youth, vitality"를, WONIK GRAY는 "advanced technology foundation"을 상징. 사내 프로덕트가 이 brand 위에서 일관되게 보이려면 단 하나의 정확한 hex만 통용돼야 한다. (b) 자산 CSS의 `#273D7F`는 사용자가 공식 brand로 마이그레이션 시도하던 잔재였고 G/B 채널이 약간 drift된 상태였다 — 이 PR로 정확한 값으로 통일. (c) 컴포넌트 코드에 사용 중인 `#2B7FFF`는 구 brand color로, 정리 대상.
**트레이드오프**: (1) 모든 컴포넌트(`StatusIndicator`, `Toolbar`, `DataPanel` 등)의 hex 일괄 변경. (2) Derived primary 토큰(`--color-primary-bg`, `--color-primary-stroke`, `--color-primary-pale`, `--color-primary-selected`)을 새 base에서 다시 계산해 보정. (3) `--color-primary`가 status용 도트·텍스트 색에도 쓰이므로(예: Run 상태) 새 색의 contrast/가독성 재검토 필요 — `#273E82`는 RGB 채널 합이 `#2B7FFF`보다 훨씬 어두워 light 배경 위 가독성은 유리하지만 dark toolbar 위 active state 강조도는 떨어질 수 있음. (4) Status semantic colors (ok=green, warn=amber, alarm=red, init=yellow, processed=purple)는 brand color가 아니므로 변경 없음.

---

### ADR-008: React peer는 `^18 || ^19` dual 지원 (토스 OSS 표준 + Figma Make Kit 호환)
**결정**: 모든 컴포넌트 패키지(현재 `@wonik/web`, 향후 추가될 패키지 포함)의 React peer는 `"^18.0.0 || ^19.0.0"`. 한 패키지가 React 18·19 환경 모두에서 import해 작동. 개발·테스트 환경은 React 19로 통일.
**이유**: (a) **토스 OSS 표준** — `@suspensive/react`(v3.21.0, 2026 활발 운영) 등 토스 신규 라이브러리들이 동일 정책(`peerDependencies: "react": "^18 || ^19"`, devDeps는 React 19) 채택. 토스급을 지향하는 본 시스템도 같은 표준. (b) **Figma Make Kit 호환** — Figma Make는 React 18 호환을 요구한다. dual peer로 디자이너가 Figma Make에서 `@wonik/web`을 Make Kit으로 등록 가능 → 디자이너 → 코드 path 단축. (c) **ppt(React 19) 그대로 작동** — peer가 19도 포함하므로 ppt에서 import 시 다운그레이드 불필요. (d) **미래 사내 web service 대응** — 18 또는 19 어느 쪽이든 마이그레이션 비용 0. (e) **부담 없음** — 1단계 컴포넌트(Button부터 시작)는 plain React API(`useState`/`onClick` 수준)만 사용해 18·19 자연 호환.
**트레이드오프**: (1) 컴포넌트 코드에서 React 19-only API(`useFormStatus`/`useOptimistic`/`use()`/React Compiler 자동 메모 등) 사용 금지 — 진짜 필요해지면 conditional 또는 별도 변형으로 대응. 1단계 영향 없음. (2) 18 호환 검증을 위해 추후 CI matrix(React 18·19 양쪽 install + 빌드·테스트) 추가 필요 — 1단계 외, ppt와 web-sandbox 검증으로 19는 충분히 확인되고 18은 Figma Make Kit 등록 시 검증.

---

### ADR-009: 다크 모드를 1단계 핵심으로 승격 (ADR-005 일부 supersede)

**결정**: 다크 모드를 **1단계 핵심**으로 승격한다. `@wonik/tokens`은 light + dark 두 테마를 동시에 정의하고, `@wonik/web` 컴포넌트는 두 테마 모두에서 자동 동작한다. 테마 전환은 `<html data-theme="light|dark">` 속성 + CSS 변수 reference로 구현 — 컴포넌트 코드는 테마를 의식하지 않는다 (산업 표준: Radix Themes / Chakra v3 / Toss SLASH 동일).

**이유**: 

1. **첫 dogfood(ppt) 분석 결과 ppt는 다크 모드 전용** — `--color-bg: #0f172a` (slate-900), `--color-primary: #6366f1` (indigo). 우리 단일 light 시스템으로는 dogfood가 본질적으로 불가능. ppt를 light로 마이그레이션하는 것도 가능하지만, ppt 사용자(사내 팀원)의 시각 경험을 갈아엎는 부담.

2. **"결국 다크모드는 만들어야 한다"** — 원익IPS는 24시간 fab 운영 환경. 미래 등장할 사내 web service(monitoring·alarm·night shift 도구)는 다크 모드를 요구할 가능성이 높다. retrofit으로 미루면 모든 미래 컴포넌트가 single-mode 가정으로 짜여 retrofit 비용이 시간에 따라 비대화.

3. **지금이 가장 작은 refactor surface** — 현재 atom 6개 × 토큰 reference ~25곳. phase 04~07에 form-atoms-2 + composition + Card·Modal 추가하면 컴포넌트 12-15개 × reference ~100곳. 지금 박는 비용 ≪ 미래 retrofit 비용.

4. **PRD 장기 비전(사내판 앱인토스)과 일치** — 사내 팀이 자유롭게 frontend를 만들려면 다크 모드는 기본 옵션. 토스 SLASH도 동일.

**구현 방향**:
- **CSS 변수 + `data-theme` 속성** 표준 패턴 (Radix Themes / Chakra v3 / Toss SLASH 동일).
- `tokens.css`에 `[data-theme="light"]` + `[data-theme="dark"]` 두 블록. `:root`에 `data-theme` 미설정 시 light 기본값.
- TypeScript 토큰은 hex 리터럴 대신 `var(--color-...)` reference 반환. 컴포넌트 코드는 그대로 — `style={{background: primary.base}}`이 `style={{background: 'var(--color-primary)'}}`로 컴파일됨.
- `<ThemeProvider>` + `useTheme()` 제공 (`<html data-theme="...">` 토글, localStorage 기억).

**트레이드오프**:

1. **Phase 04를 visible 컴포넌트 진척이 0인 infra phase로 사용** — Box/Stack 같은 컴포넌트 추가 없음. 대신 이후 모든 phase는 자동 dark 대응.
2. **기존 79개 테스트의 hex assertion 일부 갱신 필요** — `toHaveStyle({background: '#273E82'})`가 jsdom의 CSS 변수 해상도에 따라 그대로 살거나 `var(...)` literal 어선션으로 갱신. phase 04 step 1에서 결정.
3. **다크 모드 색상 결정** — base hex(text·border·surface)를 새로 정해야 함. 본 ADR은 결정 위임 — phase 04 step 0이 명시적으로 정의. 시작점은 ppt의 slate-900 계열 + WONIK BLUE를 dark 모드용으로 조정한 값.
4. **ADR-005 일부 supersede** — light-only 결정만 갱신. 모바일·반응형 미지원 부분은 ADR-005 그대로 유지.

---

### ADR-010: 호스트-디자인 시스템 CSS variable contract

**결정**: `@wonik/web` 컴포넌트가 의존하는 색 변수 중 6개를 **interface variable**로 표준화한다 — host product가 정의할 가능성이 높은 표준 이름이다. `@wonik/tokens`의 `tokens.css`는 이 6개를 default로 emit하고, `@wonik/web` 컴포넌트는 `var(--color-surface, var(--color-surface-white))` 형태의 cascade fallback 패턴으로 reference한다. host가 같은 이름의 변수를 정의하면 자연 cascade로 host 우선 (Trial 2 모델 일반화). 정의 안 하면 우리 default 동작 (web-sandbox standalone에서도 작동).

**interface variable 6개** (1단계, ppt dogfood 기준):

| 이름 | 의미 | 우리 internal fallback |
|------|------|------|
| `--color-bg` | 가장 어두운 canvas / page 배경 | `--color-canvas` |
| `--color-surface` | panel·card 배경 | `--color-surface-white` |
| `--color-border` | 기본 border | `--color-border-mid` |
| `--color-text` | 기본 text | `--color-text-dark` |
| `--color-text-muted` | 보조·부가 text | `--color-text-dim` |
| `--color-primary` | brand primary | `--color-primary` (이미 일치) |

hover state(`--color-surface-hover`·`--color-primary-hover`)·primary 색조 변형(`--color-primary-pale`·`bg`·`stroke`)은 interface variable에서 **제외** — host가 own (Trial 3에서 host의 hover·variant 정책은 host의 자유로 확인됨).

**이유**:

1. **Trial 3가 입증한 invisibility 결함의 근본 원인은 contract 부재** — 우리 컴포넌트의 inline style이 `var(--color-surface-white)` 같은 우리 namespace 변수를 reference하는데, host(ppt)에는 그 이름이 정의되지 않아 CSS variable이 invalid로 떨어지고 declaration 통째로 무시됨 → textarea가 dark surface와 구분 안 됨. namespace 정책을 명시화하지 않으면 다음 form/display atom도 같은 결함 노출. evidence: `docs/dogfood-trial-3.md` 발견 1.

2. **interface variable은 layer A 모델의 명시화** — Trial 2(Button)가 작동한 건 `--color-primary` 이름의 우연 일치였다. 그 우연 패턴을 6개로 격상해 의도적 contract로 만든다. design_system은 *시각 형태*만 제공하고 *색*은 host가 own한다는 1단계 layer A 정신을 코드 단위로 보존.

3. **Cascade fallback은 progressive enhancement** — host가 interface variable 6개 모두 정의·일부 정의·미정의 세 경우 모두 동작한다. host 학습 곡선 0 (host는 자기 변수 이름을 그대로 쓰면 됨). 우리 컴포넌트는 host 의존성 0 (standalone 환경에서 우리 default 색으로 작동).

4. **interface variable 6개는 dogfood evidence 기반** — ppt의 8개 변수에서 hover/variant 2개를 제외한 6개. 추측이 아니라 실제 host가 정의한 contract surface. 다른 사내 product 등장 시 추가 후보는 그때 dogfood로 확인 후 ADR 갱신.

5. **1인 운영 부담 최소** — 우리 internal token(`--color-surface-white` 등)의 이름·구조는 그대로 유지. tokens.css에 interface variable 6개를 default로 emit하는 작은 추가만으로 contract 만족. 컴포넌트 코드도 `var(host, fallback)` 패턴 적용만 — 큰 refactor 없음.

**구현 방향** (후속 step에서 진행):

- **Step 1 (tokens)**: `packages/tokens/scripts/build-css.ts`에서 `tokens.css` emit 시 interface variable 6개를 default block (light/dark 양쪽)에 추가. internal token은 그대로 유지. `packages/tokens/src/colors.ts`는 두 reference path 모두 export.
- **Step 2 (components)**: `@wonik/web`의 모든 컴포넌트(Button·Textarea·Input·Spinner·Checkbox·Switch·Radio·Box·Stack·Text 등)의 inline style을 `var(--color-X, var(--color-X-internal))` 패턴으로 갱신. prop signature 변경 0. 기존 테스트의 hex/CSS variable assertion 일부 갱신 필요.
- **Step 3 (검증)**: Trial 3을 재캡쳐해 invisibility 해결 입증 (`docs/dogfood-trial-3-recapture.md`).

**트레이드오프**:

1. **tokens.css 크기 약간 증가** — interface variable 6개 default emit. light + dark 양쪽이라 12 lines 추가. 무시 가능.

2. **컴포넌트 reference 코드 약간 복잡** — `var(--color-surface)` 대신 `var(--color-surface, var(--color-surface-white))`. 가독성 손실 작지만 0은 아님. 헬퍼 함수 도입은 1단계 외 — 명시성 우선.

3. **interface variable 6개는 1단계 dogfood 기준 (closure 아님)** — 다른 host product 등장 시 추가 후보 가능 (예: form 컨트롤의 focus ring 색이 host마다 다를 수 있음 → `--color-focus`). 그 시점에 ADR-010 갱신 또는 새 ADR. 6개를 처음부터 8개·10개로 늘리지 않음 — 추측 추상화 금지(YAGNI).

4. **우리 internal token namespace 정리 부수 issue 미해결** — Trial 3가 발견한 부수 issue(`--color-surface-white`가 dark theme에서 dark 색 반환 — 색조 이름이 semantic 위반)는 본 ADR 범위 외. 후속 phase(`Phase 10` 또는 별도 ADR)에서 정리. 본 ADR은 contract 명시화에 집중해 일관성·검증 가능성 보존.

5. **ADR-007의 WONIK BLUE 정체성 보존, 단 host 우선** — ADR-007("Primary = WONIK BLUE #273E82")은 그대로 유효 — 우리 default 색. 단 host가 `--color-primary`로 자기 색을 정의하면 host 우선 (cascade). design_system 정체성은 (a) web-sandbox standalone (b) host 미정의 시 fallback 두 군데서 WONIK BLUE 유지. supersede 아님 — 보완.

---

### ADR-011: form 컨트롤 focus·resize·placeholder·hover 정책

**결정**: `@wonik/web`의 form 컨트롤(Button/Input/Textarea/Checkbox/Radio/Switch)에 다음 7개 정책을 일괄 적용한다.

1. **Focus selector**: `:focus-visible` only — fallback 없음 (Safari 15.4 ship 후 baseline widely available).
2. **Focus ring**: `outline: 2px solid var(--color-focus, var(--color-primary, var(--color-primary-internal)))` 3-단 cascade.
3. **Focus offset**: Input/Textarea는 `outline-offset: 0px` (border-통합 dual-cue, Material 3 outlined input 패턴). Button/Checkbox/Radio/Switch는 `outline-offset: 2px` (Switch 기존 패턴 일관 — 컨트롤과 ring 시각 분리).
4. **Resize default**: Textarea의 `resize: 'vertical'` default 유지. 다만 `resize?: 'none' | 'vertical' | 'both'` prop을 노출해 host별 선택 가능.
5. **Placeholder color**: `::placeholder { color: var(--color-placeholder, var(--color-text-muted-internal)); opacity: 1; }`. **interface variable 격상 안 함** (1단계 YAGNI).
6. **Hover state**: Input/Textarea에 `:hover { border-color: var(--color-border-strong, var(--color-border-mid-internal)) }` 1줄 추가.
7. **구현 방식**: `ensureCssInjected()` 1회-inject pattern (Switch.tsx 참조) — 각 컴포넌트가 자기 module-scope CSS block 정의. pseudo-class·pseudo-element를 inline style로 못 풀기 때문.

**interface variable 격상**: ADR-010이 결정한 6개를 **7개로 확장**.
- 추가: `--color-focus` (default fallback `--color-primary`) — focus ring 색을 host가 분리 own할 수 있는 hook.
- 격상 안 함: `--color-placeholder` (1단계 dogfood에 host override needs 없음 — text-muted internal로 fallback 충분).

**이유**:

1. **WCAG 2.1 SC 2.4.7 (AA) 충족 필수** — 키보드 focus indicator visible. 현재 Input/Textarea의 `outline: 'none'`은 a11y regression. SC 1.4.11이 정량 보충 — 비텍스트 3:1 contrast. WONIK BLUE `#273E82` on 흰 surface ≈ 9:1로 안전.

2. **`:focus-visible`이 modern 표준** — 2022-03 Safari 15.4 ship으로 모든 메이저 브라우저에서 baseline widely available ([Igalia](https://blogs.igalia.com/mrego/2022/04/08/focus-visible-is-shipping-in-safari-webkit/), [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible)). 키보드 focus만 indicator 보이고 마우스 click focus는 숨기는 패턴이 a11y + UX 표준. 1단계 dogfood(React 19 + Vite + 최신 Chromium) 환경에서 fallback 불필요.

3. **outline > box-shadow** — Radix Themes가 box-shadow → outline으로 마이그레이션한 명시적 이유 ([Radix discussion](https://github.com/radix-ui/primitives/discussions/3651)): Chrome anti-aliasing 안정, `border-radius` 자동 추적 (Chromium 94+/Safari 16.4+). modern 표준.

4. **`--color-focus`를 7번째 interface variable로 격상 (layer A 정신 일관)** — Primer/Radix Themes/Chakra v3가 모두 별도 focus color token을 둠. 그 이유는 (a) form-heavy product에서 brand-tinted ring이 산만, (b) dark/high-contrast 모드에서 brand와 독립 조정 필요, (c) brand color가 primary action button과 같아 focus와 action 시각 혼동. layer A의 "host가 색을 own" 정신상 host가 분리 override 가능한 hook이 우월. ADR-010 line 142가 이미 future hook으로 언급 — 본 ADR이 실현. default fallback이 primary라 host 미정의 시 회귀 0.

5. **`resize: vertical` default 유지 + prop opt-out** — MDN 권장은 vertical(사용자 자유). 1단계 dogfood ppt가 long-form 설문/리서치 폼이라 vertical 자연. layout-sensitive 산업용(반도체 dashboard) 등 future host는 `resize="none"` 명시. BC 0.

6. **placeholder는 interface variable 격상 안 함 (YAGNI)** — WCAG 1.4.3 적용 대상이지만 1단계 dogfood에 별도 host override needs 없음. `::placeholder` `opacity: 1` 명시는 필수 (Firefox 일부 버전 default <1). dogfood로 needs 등장 시 별도 ADR로 격상.

7. **hover state는 universal pattern, 1줄로 보충** — Material 3·Radix·Chakra 모두 input의 hover 시 border-color 진해짐을 universal pattern으로 채택. 현재 우리 시스템 gap. Phase 10에서 같이 묶음 (별도 phase 분리 시 marginal value, CSS injection 인프라 공유).

**구현 방향** (후속 step):

- **Step 1 (tokens)**: `build-css.ts`에 `--color-focus: var(--color-primary)` alias emit (light/dark 양쪽) + `--color-border-strong: var(--color-border-mid)` alias (hover state internal fallback). `interfaceColors`에 `focus` 추가.
- **Step 2 (components)**: Button/Input/Textarea/Checkbox/Radio에 `ensureCssInjected()` 추가 — `:focus-visible`·`:hover`·`::placeholder` CSS block. Switch는 이미 패턴 적용됨 (focus만 검토, placeholder 없음). Textarea에 `resize?` prop 추가 (default `vertical`).
- **Step 3 (검증)**: ppt 또는 sandbox에서 focus·hover·placeholder 시각 캡쳐. focus는 Chrome devtools `:focus-visible` toggle 또는 demo 페이지에서 Tab simulate.

**트레이드오프**:

1. **interface variable 7개로 증가** — ADR-010의 6 set이 7로 확장. tokens.css 추가 emit 1개 (light/dark = 2 lines). host 학습 부담 미미.

2. **CSS injection이 form 컨트롤 8개 중 6개에 추가됨** — 현재 Switch만 inject 중. 5개 컴포넌트에 동일 패턴 추가 → 컴포넌트당 1회 inject. SSR 안전성은 `typeof document === 'undefined'` 가드로 처리(Switch 패턴 그대로).

3. **inline style만 보고 컴포넌트 시각 추론 못 함** — pseudo-class CSS가 외부에 있어 디버깅·snapshot 난이도 증가. 보완: 각 컴포넌트의 CSS block을 컴포넌트 파일 안에 module-scope로 colocate.

4. **`--color-focus` host override 안 하면 primary와 동일** — Trial 2·3 결과와 동일 시각. 분리 token 가치는 host가 명시적 override할 때만 실현. 1단계 dogfood엔 가치 실현 0 — 미래 host product 등장 시 회귀 0인 확장 hook.

5. **AAA (WCAG 2.4.13 Focus Appearance) 미보장** — outline width 2px가 충족 후보지만, perimeter 면적 + 픽셀 3:1 변화 contrast의 정량 검증 안 함. AA(2.4.7 + 1.4.11) 목표 충족.

6. **추가 form polish 영역 미해결** — 1단계 dogfood 범위 외:
   - `aria-disabled` 대안 패턴 (현재는 native `disabled` 충분).
   - WebKit autofill 노란 배경 override (`-webkit-box-shadow inset` 트릭).
   - `readonly` 시각 처리 (Carbon/MD3는 border 옅게 + cursor:default).
   - Card 컴포넌트 도입 시 focus indicator obscured (WCAG 2.2 SC 2.4.11 — padding ≥ outline-offset).
   - AAA WCAG 2.4.13 Focus Appearance 정량 검증.
   
   각 항목은 dogfood로 needs 등장 시 별도 ADR.

**관계**:
- **ADR-010 보완** — 7번째 interface variable(`--color-focus`) 추가, layer A 정신 일관. supersede 아님.
- **ADR-007/008/009**: 영향 없음.

---

### ADR-012: 그래프(시각화) 토큰을 별도 status-driven 도메인으로 분리, brand hex는 의도적으로 재사용

**결정**: `@wonik/tokens`에 plot/chart 색을 위한 **graph 도메인**을 추가한다. 5축 status-driven taxonomy로 분류된 19개 CSS variable(`--color-graph-*`)과 runtime export `graphTokens`를 emit한다. brand hex(WONIK BLUE `#273E82`, WONIK GRAY `#ACACAC`)·text·border·surface와 hex가 일부 일치하지만 **CSS variable layer는 독립**이며, raw hex로 저장한다(alias 아님). Figma side에도 동일 hierarchy(`graph/limit/upper/line`)로 `Graph` collection을 등록(Light/Dark mode).

**5축 taxonomy** (Parameter Description 캡쳐 9장 분석):

| 축 | 의미 | 변수 |
|---|---|---|
| `limit` | 스펙 임계 zone (Range/Overshoot·Undershoot/Trim High·Low/Main·Sub Limit) | `upper.{line,surface,label}`, `lower.{line,surface,label}` |
| `signal` | 플롯 라인 | `primary.{line,surface}`, `tuned.{line,surface}`, `reference.line` |
| `pass` (status) | 판정 영역 (Spike, Pass Condition zone) | `line`, `surface`, `label` |
| `action` | 튜닝 가이드 화살표·지시 | `line` |
| `annotation` | 콜아웃 라벨 (중립) | `fg`, `surface` |
| `axis` | 축 라벨·그리드 | `label`, `grid` |

**brand hex 재사용**: 다음 graph 토큰은 의도적으로 기존 토큰과 동일 hex를 가진다 (alias 아닌 raw hex 복제):
- `graph/signal/tuned/line` `#273E82` = `primary.base` (WONIK BLUE)
- `graph/signal/tuned/surface` `#D6DCF0` = `primary.bg`
- `graph/signal/reference/line` `#ACACAC` = `secondary.base` (WONIK GRAY)
- `graph/annotation/fg` `#303030` = `text.dark`
- `graph/annotation/surface` `#FFFFFF` = `surfaces.surfaceWhite`
- `graph/axis/label` `#71717B` = `text.primary`
- `graph/axis/grid` `#E1E1E4` = `borders.light`

**이유**:

1. **graph는 host와 매핑되지 않는 internal 도메인** — ADR-010·011의 interface variable 7개(bg/surface/border/text/textMuted/primary/focus)는 host product가 own하는 컬러. plot 영역의 의미적 색(임계·신호·판정)은 host가 own하지 않고 우리 시스템이 의미·일관성을 own하는 게 자연스럽다. graph는 interface variable이 아닌 자체 domain token으로 둔다.

2. **status-driven taxonomy가 시각화 의미와 1:1** — 캡쳐 9장 전체에서 색이 데이터의 역할(임계 위/아래, 측정/튜닝/기준 신호, 판정 영역, 액션 방향, 주석)로 일관 사용됨. statusTokens(idle/run/alarm/...)와 동일한 2-level 구조(그룹 → property)로 정의해 `build-css.ts` emit loop 재사용. 컴포넌트별 ad-hoc 색이 아닌 의미 축 우선.

3. **brand hex 재사용은 정체성 보존 + 의미 분리 동시 달성** — Tuned 신호가 WONIK BLUE인 것은 brand 정체성 표현(`statusTokens.run.dot`이 `#273E82` 재사용한 선례와 동일 패턴). 단 미래에 graph 가독성 issue로 tuned 색만 미세 조정해야 할 때 brand 토큰을 건드리지 않고 graph 쪽만 변경 가능해야 하므로 **CSS variable layer는 분리**한다. raw hex로 둔 이유: alias(`var(--color-primary)`)로 두면 brand 변경이 graph로 강제 전파되어 분리 가치를 잃음.

4. **Figma side 1:1 mirror로 디자이너 인지 부담 0** — slash hierarchy(`graph/limit/upper/line`)와 CSS variable(`--color-graph-limit-upper-line`) 동형. Figma Variables `Graph` collection의 19개 변수가 코드와 1:1 매칭되어 design ↔ code 토큰 sync 비용 최소. 컴포넌트 코드 변경 시 Figma 측 분리 검토 불필요.

5. **Figma variable scope 좁힘** — `*/line`은 `SHAPE_FILL+STROKE_COLOR`, `*/surface`는 `FRAME_FILL+SHAPE_FILL`, `*/label`·`fg`는 `TEXT_FILL`로만 노출. 디자이너가 Figma에서 변수 picker 열 때 의미에 맞는 변수만 보임. `ALL_SCOPES` 기본값은 모든 property picker를 오염시키므로 회피.

6. **첫 customer 부재 우려 점검** — ADR-001 원칙("첫 customer 없이는 추상화 안 한다") 검토:
   - Parameter Description 시안의 9장 캡쳐가 **이미 존재하는 시각 언어**이며 추상화의 결과가 아니라 raw value 표준화에 해당.
   - 추상화 차원의 우려는 *컴포넌트* (예: `<Chart>` 도입)에 적용되며, 본 ADR은 *토큰* 표준화에 한정.
   - 따라서 customer 0 우려에 해당 안 함. `@wonik/web` chart 컴포넌트 도입은 1단계 외(YAGNI 보존).

**트레이드오프**:

1. **brand hex 자동 추종 안 됨** — host가 `--color-primary`를 override하거나 ADR-007이 미래에 brand color 변경 시 graph 토큰은 따라가지 않는다. **의도된 분리**이며 미래에 brand-following이 더 적합하다고 판단되면 raw hex를 `var(--color-primary)` alias로 전환 (별도 ADR). 1단계 dogfood에 brand override 시나리오 없음(ppt는 자기 indigo primary 사용, graph는 그대로 brand WONIK BLUE).

2. **dark mode는 light와 동일값 미러 상태** — `graphTokensDark = graphTokensLight`로 시작(statusTokens 동일 패턴). surface fill(연한 톤 `#FCE7F3`/`#CCFBF1`/`#EEF0FE`/`#DCFCE7`)의 어두운 배경 위 가독성은 별도 검증 안 됨. 첫 dark host product에서 issue 발견 시 dark 전용 hex 분리(별도 phase). 1단계 dogfood에 graph 컴포넌트 자체가 등장 안 함(`@wonik/web` chart 미정).

3. **action과 limit/upper가 같은 hue `#EC4899`** — 의미는 분리(threshold zone vs tuning direction)이지만 색 동일. 캡쳐 원본도 같은 hue로 사용하는 패턴(magenta 화살표 = "이 방향으로 조정")이라 의도적. 미래에 시각 혼동 issue 발견 시 action 별도 hue 분리(별도 ADR). 분리 시 회귀 영향: `action` 사용하는 컴포넌트(현재 0)만.

4. **`@wonik/web` 컴포넌트에 graph 토큰 import surface 없음** — 1단계 컴포넌트는 form 컨트롤 위주(Button/Input/Textarea/Switch/Checkbox/Radio). chart 컴포넌트는 1단계 외이므로 graph 토큰의 actual consumer는 dogfood product(ppt 후속 view 또는 recharts/visx 사용처)에서 직접 reference. 컴포넌트 prop signature 영향 0.

5. **19개 토큰 신규 추가로 tokens.css 증가** — Light/Dark 각 19 lines → 총 38 lines 증가(이전 60 → 79). 무시 가능 수준. ESM/CJS bundle dts 6.56KB 유지(타입은 var(...) string union이므로 거의 영향 없음).

6. **graph 도메인이 미래에 더 세분화될 가능성** — chart type별(line/bar/area/scatter/pie) 또는 industry별(반도체 dashboard vs 일반 BI)로 분기 needs 등장 가능. 본 ADR은 *의미 축* 5개를 base로 잡고, future variant는 그 위에 layer(예: `graph.bar.fill`, `graph.scatter.point`). base 5축은 어떤 chart type에도 적용 가능하므로 base는 안정적.

**구현 상태** (본 ADR 작성 시점에 이미 완료):

- `packages/tokens/src/graph.ts` — runtime export `graphTokens` (var refs).
- `packages/tokens/src/theme-light.ts` — `graphTokensLight` hex source.
- `packages/tokens/src/theme-dark.ts` — `graphTokensDark = graphTokensLight` (mirror).
- `packages/tokens/scripts/build-css.ts` — `Graph (semantic)` section emit.
- `packages/tokens/src/index.ts` — re-export.
- Figma `UI-UX-Standardization-2.0` 파일에 `Graph` collection 등록(19 vars, Dark/Light modes, scope 좁힘 적용).

**관계**:
- **ADR-007 일치** — `signal/tuned`·`signal/reference`가 brand color 그대로 사용. 정체성 보존.
- **ADR-009 패턴 일치** — theme-light/theme-dark의 2-layer source-of-truth, build-css emit 패턴 동일.
- **ADR-010·011와 분리** — graph는 host-overridable 도메인이 아닌 internal 도메인. interface variable 7개와 별개.
- **ADR-001/004**: 영향 없음 (토큰 표준화는 추상화 차원 아님).
- **ADR-013에 의해 부분 supersede** — 19개 → 12개로 축소. 5축 status-driven taxonomy 핵심(limit/signal/pass)은 유지되며, chrome(action/annotation/axis) 및 duplicate `.label` 7개가 제거됨. 본 ADR의 §brand hex 재사용 정책은 그대로 valid.

---

### ADR-013: graph 토큰을 19개 → 12개로 축소 (chrome 제거 + duplicate label 통합)

**상태**: ADR-012 부분 supersede (의미축은 보존, 토큰 surface area만 축소).

**결정**: ADR-012가 도입한 19개 graph 토큰을 **12개로 축소**한다. 의미축(limit/signal/pass) 3개와 그 안의 9개 property는 유지. chrome 성격의 3개 그룹(`action`/`annotation`/`axis`)과 hex가 line과 동일한 duplicate `.label` 2개를 제거한다. 제거된 use case는 기존 토큰 재사용으로 커버한다 (아래 migration 표).

**최종 12개 토큰 / 6 그룹**:

| 그룹 | property | 비고 |
|---|---|---|
| `limitUpper` | `line`, `surface` | `.label` 제거 — `.line`이 라벨 텍스트까지 겸함 (동일 hex) |
| `limitLower` | `line`, `surface` | `.label` 제거 — 동일 |
| `signalPrimary` | `line`, `surface` | 변경 없음 |
| `signalTuned` | `line`, `surface` | 변경 없음 (WONIK BLUE 정체성 유지) |
| `signalReference` | `line` | 변경 없음 (WONIK GRAY 정체성 유지) |
| `pass` | `line`, `surface`, `label` | `.label`(`#16A34A`)은 `.line`(`#22C55E`)과 hex 다름 — 명도 대비 위해 유지 |

**제거된 7개 토큰 및 migration 가이드**:

| 제거 토큰 | runtime 대체 | CSS variable 대체 | 근거 |
|---|---|---|---|
| `graphTokens.limitUpper.label` | `graphTokens.limitUpper.line` | `var(--color-graph-limit-upper-line)` | hex 완전 동일 (`#EC4899`) |
| `graphTokens.limitLower.label` | `graphTokens.limitLower.line` | `var(--color-graph-limit-lower-line)` | hex 완전 동일 (`#14B8A6`) |
| `graphTokens.action.line` | `graphTokens.limitUpper.line` | `var(--color-graph-limit-upper-line)` | hex 동일 (`#EC4899`), ADR-012도 "동일 hue"로 명시. "위험·경고 방향"이라는 의미축이 limit과 같은 family |
| `graphTokens.annotation.fg` | `text.dark` | `var(--color-text-dark)` | hex 동일 (`#303030`). graph 도메인 의미가 아닌 chrome |
| `graphTokens.annotation.surface` | `surfaces.surfaceWhite` | `var(--color-surface-white)` | hex 동일 (`#FFFFFF`) |
| `graphTokens.axis.label` | `text.primary` | `var(--color-text-primary)` | hex 동일 (`#71717B`). 축 label은 graph 의미가 아닌 일반 muted text |
| `graphTokens.axis.grid` | `borders.light` | `var(--color-border)` | hex 동일 (`#E1E1E4`). grid는 일반 경계선 |

**이유**:

1. **의미축은 유지, chrome은 분리** — ADR-012의 핵심 가치인 status-driven taxonomy(데이터 *역할*에 색 묶기)는 limit/signal/pass에서 작동한다. 반대로 `axis`/`annotation`은 차트 도메인 의미가 아닌 "차트 안에 들어간 일반 텍스트·경계선"으로, 본문 텍스트(`text.primary`)와 시각 분리 needs가 없다. `action`은 의미는 다르지만 ADR-012도 인정했듯 hex가 `limit.upper.line`과 완전 동일하고 "경고 방향" family로 묶인다.

2. **duplicate hex → duplicate token = noise** — `.label`이 `.line`과 hex 완전 동일하면 토큰 두 개가 같은 정보를 가리킨다. 미래에 라벨 텍스트 색만 분리 조정해야 할 시각 needs가 발생하면 그때 다시 갈라치는 게 YAGNI 원칙에 맞다 (ADR-001의 "첫 customer 없이 추상화 안 한다" 정신).

3. **현재 consumer 0이라 BC 부담 없음** — graph 토큰은 ADR-012로 도입된 직후이며 `@wonik/web` 컴포넌트에서 사용 안 함. `apps/web-sandbox` 및 docs를 제외하면 import 0. 깰 사용자가 없는 지금이 정리 timing으로 적합.

4. **유지보수자 인지 부하 감소** — 19개 → 12개는 한 화면에 들어와 mental model 단순화. Figma `Graph` collection의 변수 수도 같이 줄어 디자이너 picker도 가벼워짐.

5. **brand hex 재사용 정책(ADR-012 §6)은 그대로 유지** — `signal/tuned`(WONIK BLUE)·`signal/reference`(WONIK GRAY)는 brand 정체성 표현이므로 그대로. ADR-012의 raw hex 복제(alias 아님) 결정도 그대로.

**트레이드오프**:

1. **`action`이 별도 의미 token이 아니게 됨** — consumer가 `graphTokens.limitUpper.line`을 가져다 화살표를 그리면 "이게 임계인지 액션인지" 시맨틱이 코드에서 흐려진다. 완화: ADR-013 자체 + GRAPH_TOKENS.md migration 표가 "action arrow = limit.upper.line 재사용"임을 명시. 미래에 action만 hue 분리 needs가 등장하면 그때 추가(ADR-014 등).

2. **`axis`/`annotation`이 host 변경에 따라감** — 이전 19개 ADR-012 설계에서는 graph는 host-overridable이 아닌 internal로 분리됐다. 이제 axis label은 `text.primary` 추종, annotation surface는 `surfaces.surfaceWhite` 추종이라 host가 text/surface 토큰을 override하면 graph chrome도 함께 변한다. **이는 합당함** — axis/annotation은 차트의 chrome일 뿐 데이터 의미가 아니므로 host의 전체 톤(다크/라이트, 어두운 chrome/밝은 chrome)과 일관되는 게 자연스러움. 데이터 의미축(limit/signal/pass)은 여전히 graph-internal로 host 영향 안 받음.

3. **Figma `Graph` collection 동기화 필요** — 19 → 12 variables로 줄여야 함. 7개 variable 제거 시 Figma에서 reference하던 도형이 broken 표시. 1단계는 아직 chart 도형 자체가 Figma에 거의 없으므로 영향 최소 (실제 사용처는 추후 dogfood product에서 graphTokens 직접 reference). Figma 측 정리는 변수 삭제 + 도형 fill 패널 picker 재선택으로 처리.

4. **`pass.label`만 line과 다른 hex로 남음 — 비대칭** — `limitUpper`/`limitLower`는 label 제거했는데 `pass`만 label 유지. 이유: `pass.label`(`#16A34A`)은 `pass.line`(`#22C55E`)과 어두운 톤으로 다름(밝은 green 라인이 흰 배경 라벨로 쓰이면 대비 부족). 비대칭 비용보다 명도 대비 보존의 가치가 더 큼.

**구현**:

- `packages/tokens/src/theme-light.ts` — `graphTokensLight`에서 7개 property 제거.
- `packages/tokens/src/theme-dark.ts` — `graphTokensDark = graphTokensLight` 재export라 자동 반영.
- `packages/tokens/src/graph.ts` — runtime export `graphTokens`에서 7개 property 제거. 헤더 주석에 migration 가이드 inline 명시.
- `packages/tokens/scripts/build-css.ts` — 변경 없음 (generic Object.entries iterator).
- `tokens.css` 자동 재생성 — light/dark 각 `--color-graph-*` 12개로 감소 (이전 19 → 12, 총 38 → 24).
- `docs/GRAPH_TOKENS.md` — 12-token reference로 재작성, migration 표 포함.
- `.changeset/` — minor bump 신규 항목 (토큰 삭제는 minor 이상 — CLAUDE.md 규칙).

**관계**:
- **ADR-012 부분 supersede** — taxonomy axes 5개 → 3개(limit/signal/pass), 토큰 19 → 12. ADR-012의 §brand hex 재사용·§host와의 매핑 분리 정신은 limit/signal/pass에 그대로 적용.
- **ADR-007 일치** — `signal/tuned`·`signal/reference`의 brand color 유지.
- **ADR-010·011와 관계 정밀화** — 데이터 의미축(limit/signal/pass)은 여전히 host-internal. chrome(axis/annotation 등)은 ADR-013에 의해 host 추종 토큰(`text.*`/`borders.*`/`surfaces.*`) 재사용으로 위임됨.
- **ADR-001 일치** — 첫 customer(`@wonik/web` chart 컴포넌트) 등장 전이라 더 가벼운 baseline으로 출발.
- **ADR-014에 의해 추가 보완** — 토큰 12 → 13. `signalReference`에 `surface` property 추가로 signal 3개 신호의 (line, surface) 쌍 대칭 완성.

---

### ADR-014: `signalReference.surface` 추가 — signal 그룹의 (line, surface) 쌍 대칭 완성

**상태**: ADR-013 보완 (additive, supersede 아님). 토큰 surface area를 12 → 13으로 확장.

**결정**: `graphTokens.signalReference`에 `surface` property를 추가한다. hex는 `#F0F0F0` — `line`의 WONIK GRAY `#ACACAC`를 paler 톤으로 라이트닝한 값 (`signalPrimary`/`signalTuned`가 line→surface로 라이트닝하는 패턴과 동일).

**결과 shape (13개 토큰 / 6 그룹)**:

| 그룹 | property | hex (Light) |
|---|---|---|
| `limitUpper` | `line`, `surface` | `#EC4899`, `#FCE7F3` |
| `limitLower` | `line`, `surface` | `#14B8A6`, `#CCFBF1` |
| `signalPrimary` | `line`, `surface` | `#818CF8`, `#EEF0FE` |
| `signalTuned` | `line`, `surface` | `#273E82`, `#D6DCF0` |
| `signalReference` | `line`, **`surface` (신규)** | `#ACACAC`, **`#F0F0F0`** |
| `pass` | `line`, `surface`, `label` | `#22C55E`, `#DCFCE7`, `#16A34A` |

**이유**:

1. **signal 3개 신호의 시각 표현 일관성** — `signalPrimary`/`signalTuned`는 area chart fill 등에서 `.surface`를 활용할 수 있는데 `signalReference`만 `line`만 있어서 비대칭이었다. 같은 도메인의 3개 신호가 같은 property 구조를 갖는 게 사용자(consumer 컴포넌트, chart 라이브러리 wrapper) 입장에서 인지 부담 최소.

2. **ADR-012/013 분석 시 reference signal에 area fill 시안이 없었지만 미래 needs는 존재** — 캡쳐 9장 분석에서는 reference 신호가 dashed line으로만 그려졌고 area fill 시안이 없어서 ADR-013까지는 `surface` 생략했다. 그러나 (a) reference 신호도 "비교 baseline 영역"으로 area chart화될 수 있고, (b) 첫 dogfood chart 컴포넌트에서 (line, surface) 쌍을 요구할 가능성이 높다. 토큰 슬롯을 미리 확보해두는 비용은 거의 0 (1 hex + 1 CSS variable).

3. **YAGNI 위반 우려 점검** — ADR-001 "첫 customer 없이 추상화 안 함" 원칙과 충돌하는가? 본 ADR은 *컴포넌트* 추상화가 아니라 *토큰 surface area* 확장. 토큰은 디자인 시안에서 도출된 시각 언어의 정규화이며, "signal 3개 신호 = 같은 구조" 정규화는 추상화 비용이 아닌 일관성 확보. 따라서 ADR-001과 충돌 없음.

4. **chrome 통합 정신과 분리** — ADR-013은 chrome(axis/annotation/action)을 graph 토큰에서 제거하고 host 토큰 재사용으로 위임. ADR-014는 정반대 방향(추가)이지만 *의미축(signal) 내부의 대칭 완성*이라 ADR-013과 충돌 없음. ADR-013은 "graph 도메인 의미가 아닌 chrome 분리"이고 본 ADR은 "graph 도메인 의미축의 대칭".

5. **WONIK GRAY 정체성 보존** — surface hex `#F0F0F0`은 line `#ACACAC`의 paler 톤으로 brand secondary와 동일 hue family. ADR-007 brand 정체성 일치.

**트레이드오프**:

1. **현재 시안 binding 적용처 0** — `signalReference.surface` 도형이 캡쳐 9장에 없어서 Figma 시안 측 즉시 binding 적용처 없음. 토큰만 추가되고 시각 결과 변화 없음. **수용 가능** — 미래 area chart needs에 미리 슬롯 확보가 더 가치 있음.

2. **Figma `Graph` collection 동기화 필요** — 변수 1개 추가 (`graph/signal/reference/surface`, FRAME_FILL+SHAPE_FILL scope). 이미 ADR-013 동기화(7개 변수 제거)가 pending 상태였으므로 함께 처리.

3. **dark mode hex는 light 미러로 시작** — `graphTokensDark = graphTokensLight` 재export 패턴이라 자동 반영. 어두운 배경에서 `#F0F0F0`은 매우 밝게 floating할 수 있음 — first dark host product 등장 시 dark 전용 hex 분리(별도 phase).

4. **`#F0F0F0` 선택의 임의성** — line `#ACACAC` 대비 paler 톤이라는 패턴은 맞지만 정확한 명도는 디자이너 검토 필요. 1단계 dogfood까지 디자이너 의견 수용 가능 (별도 ADR 또는 본 ADR 갱신).

**구현**:

- `packages/tokens/src/theme-light.ts` — `graphTokensLight.signalReference.surface = '#F0F0F0'` 추가.
- `packages/tokens/src/theme-dark.ts` — `graphTokensDark = graphTokensLight` 재export라 자동 반영.
- `packages/tokens/src/graph.ts` — runtime export에 `signalReference.surface` 추가. 헤더 주석에 ADR-014 명시.
- `packages/tokens/scripts/build-css.ts` — 변경 없음 (generic iterator).
- `tokens.css` 자동 재생성 — light/dark 각 `--color-graph-*` 13개로 증가 (이전 12 → 13, 총 24 → 26).
- `docs/GRAPH_TOKENS.md` — 13-token reference로 갱신.
- `.changeset/` — minor bump (토큰 추가).

**관계**:
- **ADR-013 보완** — supersede 아님, additive. ADR-013의 chrome 제거 결정은 그대로 유효.
- **ADR-012 §brand hex 재사용 정책 일치** — `signalReference.line` `#ACACAC`은 WONIK GRAY와 raw hex 복제. `surface`는 paler 톤이므로 brand 토큰과 hex 일치 없음.
- **ADR-007 일치** — brand secondary(WONIK GRAY) 정체성 보존.
- **ADR-001 부합** — 추상화 아닌 의미축 대칭 정규화.

---

### ADR-015: Card 컴포넌트 — surface/elevated × none/sm/md/lg, interfaceColors 의존

**상태**: Trial 4(`docs/dogfood-trial-4.md`)에서 needs ✅ 강함(한 페이지 4 reps)으로 확정. Phase 12로 1차 도입.

**맥락**:

Trial 4 ppt Outline dogfood 결과, *rounded border + surface bg + 내부 padding* 패턴이 한 페이지에서 4회 반복(OutlineCard ×3 + loading wrapper + generation wrapper)되었다. CLAUDE.md 원칙 "한 페이지에서 4회 반복되는 패턴 = 디자인 시스템이 own해야 하는 영역"에 따라 1단계 layer A 1차 채움 마지막 컴포넌트 후보 중 가장 강한 evidence를 갖는다.

Phase 11에서 부상한 다른 후보(IconButton/Badge — mid needs, Alert/EmptyState — 약함 또는 inconclusive)는 모두 *Card 도입 이후* Trial 5에서 누적 측정하기로 보류.

**결정**:

`@wonik/web`에 `Card` 컴포넌트 1개만 추가. signature:

```tsx
type CardVariant = 'surface' | 'elevated';
type CardPadding = 'none' | 'sm' | 'md' | 'lg';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;    // default 'surface'
  padding?: CardPadding;    // default 'md'
  as?: ElementType;         // default 'div'
}
```

시각 매핑:

| variant | background | border | boxShadow (light) | boxShadow (dark) |
|---|---|---|---|---|
| `surface` (default) | `interfaceColors.surface` | `1px solid ${interfaceColors.border}` | none | none |
| `elevated` | `interfaceColors.surface` | none | `0 1px 3px rgba(0,0,0,0.08)` | **none** (data-theme="dark"에서 box-shadow 강제 0) |

padding 매핑: `none=0` / `sm=space[4]=10px` / `md=space[6]=16px` / `lg=space[8]=32px`. md=16px는 Trial 4의 ppt Tailwind `p-4`에 자연 대응.

border-radius: `radius.md` = 10px (Skeleton/Button과 일관, WARP 시안 톤).

dark theme 그림자 분기는 module-scope CSS 1회-inject 패턴(`ensureCssInjected()` + `data-wonik-card` style tag + `[data-theme="dark"] .wonik-card-elevated { box-shadow: none }`) — Button/Spinner/Skeleton과 동일.

`as` prop은 Box 패턴 답습 (polymorphic ElementType). `forwardRef`는 미사용 — Box도 ref 없이 운영 중이고 사용처에서 ref needs가 부상하면 minor bump로 추가 가능.

**대안 (검토 후 거부)**:

1. **`Card.Header` / `Card.Body` / `Card.Footer` subcomponent compound 패턴**
   - 거부: Trial 4 evidence 0. ppt OutlineCard는 명확한 구획 없는 자유 컨테이너 패턴 — subcomp를 미리 만들면 추정 over-engineering. CLAUDE.md "첫 customer 없이 추상화 금지" 위반. 미래 needs 부상 시 minor bump로 추가 가능(compound는 breaking change 아님).

2. **interactive Card** (`onClick` 시 hover state·focus ring)
   - 거부: Trial 4에서 클릭 가능 카드 패턴 0회. needs 부상 시 별도 ADR.

3. **`shadow.sm/md/lg` 토큰 신설 + `interfaceColors.shadow` interface variable 격상**
   - 거부: 그림자 사용처가 elevated variant 1개뿐. 토큰화는 사용처 2+ 부상 시 (별도 ADR + minor bump). 지금은 컴포넌트 내부 상수.

4. **`forwardRef<HTMLDivElement>` + `as` polymorphic 결합**
   - 거부: TS 타입 복잡도(`forwardRef`의 generic ElementType inference)와 1단계 가치 균형이 안 맞음. Skeleton은 ref만, Box는 `as`만 — 본 Card는 Box 답습. ref needs 부상 시 minor bump.

5. **dark theme에서 elevated에 강한 box-shadow(`rgba(0,0,0,0.4)`)**
   - 거부: ADR-009 정신("dark는 surface bg로 elevation 표현")과 충돌. CLARIFY로 사용자가 (c) `none` 선택.

6. **image media slot / cover image variant**
   - 거부: Trial 4 evidence 0. YAGNI.

**결과**:

- `packages/web/src/Card/{Card.tsx,Card.test.tsx,types.ts,index.ts}` 신규.
- 14 tests 추가, 163+14=177 passing 기대. 회귀 0.
- 컴포넌트 코드 안에 hex 리터럴 0, bare px 리터럴 0 (boxShadow `'0 1px 3px rgba(0,0,0,0.08)'`는 elevation 명시 주석 부착한 예외 1줄).
- `interfaceColors` 사용으로 host product의 `--color-surface`/`--color-border` 정의 시 자동 흡수(ADR-010 cascade).
- module-scope CSS inject 패턴(ADR-011 답습).
- `@wonik/web` minor bump (신규 컴포넌트 = minor).
- sandbox에 2×4 매트릭스 섹션 + light/dark 캡쳐 evidence.

**관계**:

- **ADR-001 부합** — 첫 customer(Trial 4 4 reps)로 입증된 후 도입. 추정 over-engineering 0.
- **ADR-008 부합** — React 19-only API 미사용. peer `^18 || ^19` dual 호환.
- **ADR-009 부합** — dark theme에서 elevated 그림자 0(surface bg로 elevation 표현).
- **ADR-010 답습** — `interfaceColors.surface`/`interfaceColors.border` reference + cascade fallback.
- **ADR-011 답습** — module-scope CSS 1회-inject + `data-wonik-card` 셀렉터.

**후속**:

- Trial 5(별도 phase, ppt 다른 페이지 dogfood)로 Card 다중-페이지 호환 측정. IconButton/Badge needs 누적 시 합쳐 Phase 13. 누적 안 됨 → **layer A 1차 채움 종료 → layer B(사내 npm registry 배포 인프라) 진입.**
- subcomponent(Header/Body/Footer) / interactive Card / shadow 토큰 / forwardRef 추가는 *needs 부상 후* 별도 minor bump.

---

### ADR-016: Badge 컴포넌트 — primary/neutral × inline span + interfaceColors 의존

**상태**: Trial 4(`docs/dogfood-trial-4.md`) + Trial 5(`docs/dogfood-trial-5.md`) 누적 4회 evidence로 needs ✅ 확정. Phase 14로 1차 도입.

**맥락**:

Trial 4 ppt OutlineCard layout 표시 3회 + Trial 5 ppt Home slideCount "{N}장" 1회 = **누적 4회**. 한 페이지 4회 반복(Card)이든 여러 페이지 4회 누적(Badge)이든 동일 threshold — "디자인 시스템이 own해야 하는 영역".

Phase 14 시점에 같이 측정한 다른 후보:
- IconButton: Trial 4 mid + Trial 5 0회 → **Outline-local로 격하**.
- Alert/Banner: Trial 4 inconclusive + Trial 5 1회 = 2회 → Trial 6 누적 후 결정.
- ToggleGroup/SegmentedControl: Trial 5 1회 H4 신규 → Trial 6 누적 후 결정.
- Select wrapper, EmptyState, Card variant=outline w/ dashed: 1회씩 — YAGNI.

이 중 Badge만 threshold 통과 — 단독 Phase 14.

**결정**:

`@wonik/web`에 `Badge` 컴포넌트 1개. signature:

```tsx
type BadgeVariant = 'neutral' | 'primary';

interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, never> {
  variant?: BadgeVariant;   // default 'neutral'
  as?: ElementType;          // default 'span'
}
```

시각 매핑:

| variant | background | text color | border |
|---|---|---|---|
| `neutral` (default) | `interfaceColors.surface` | `interfaceColors.text` | `1px solid ${interfaceColors.border}` |
| `primary` | `interfaceColors.primary` | `surfaces.surfaceWhite` | none |

공통 시각 토큰:
- padding: `${space[1]} ${space[3]}` = 4px 8px
- borderRadius: `radius.sm` = 5px
- fontSize: `fontSize.label` = 12px (ppt `text-xs` 대응)
- fontWeight: `fontWeight.medium` = 500
- lineHeight: `lineHeight.tight` = 1
- display: inline-flex + alignItems center
- fontVariantNumeric: tabular-nums (count·숫자 width 일관)

default variant **`neutral`** — Trial 4 layout label 패턴(누적 3회) > Trial 5 slideCount 1회. 더 보편이 default.

dark theme 분기 CSS **불필요** — Badge에 box-shadow 0, interfaceColors가 cascade 자동 처리. Card·Button과 달리 module-scope CSS 1회-inject 패턴 **생략**.

**대안 (검토 후 거부)**:

1. **size prop (sm/md/lg)**
   - 거부: Trial 4+5 evidence 모두 sm 단일. 미리 추가는 preemption. needs 부상 시 minor bump 추가는 non-breaking.

2. **semantic 색 variant (info/success/warning/danger)**
   - 거부: Trial 4+5 evidence 0. `status` 토큰은 graph 도메인 전용. 사내 product에 status badge needs 부상 시 별도 ADR.

3. **icon slot (`leadingIcon`/`trailingIcon` prop)**
   - 거부: needs 0. children으로 자유롭게 `<Badge><svg/>label</Badge>` 가능. prop은 over-engineering.

4. **dismissable Badge (`onClose`)**
   - 거부: needs 0. interactive Badge는 별도 컴포넌트(예: Chip)로 분리하는 것이 깔끔.

5. **count truncation (`max={99}` "99+")**
   - 거부: needs 0. 사용처에서 host가 `String(Math.min(count, 99))` 같은 1줄 가능.

6. **fontWeight.bold (700) 토큰 추가 + Badge에 적용**
   - 거부: medium(500)도 12px size에서 충분 emphasis. ppt 원본 bold와 시각 차이는 dogfood로 측정 후 needs 부상 시 bold 토큰 신설.

7. **radius.pill (999px) 토큰 추가**
   - 거부: ppt 시각은 `rounded-md`(Tailwind 6px) — `radius.sm`(5px)가 가장 가까움. 풀 pill 형태는 evidence 0.

8. **forwardRef<HTMLSpanElement>**
   - 거부: Card 답습. host가 Badge DOM ref 필요한 use case 0. needs 부상 시 minor bump.

**결과**:

- `packages/web/src/Badge/{Badge.tsx,Badge.test.tsx,types.ts,index.ts}` 신규.
- 9 tests 추가, 177+9=186 passing 기대. 회귀 0.
- 컴포넌트 코드 안에 hex 리터럴 0. bare px 리터럴은 표준 `1px solid` border width 1회 (Card와 동일 관례).
- `interfaceColors`·`surfaces`·`space`·`radius`·`fontSize`·`fontWeight`·`lineHeight` 토큰만 사용.
- `@wonik/web` minor bump (신규 컴포넌트 = minor).
- sandbox에 2 variant × 4 컨텐츠 매트릭스 + 캡쳐 evidence (`pkg-out/phase-14-badge-matrix.png`).

**관계**:

- **ADR-001 부합** — Trial 4+5 누적 evidence(4회)로 입증된 후 도입.
- **ADR-008 부합** — React 19-only API 0, peer `^18 || ^19` dual.
- **ADR-010 답습** — `interfaceColors.surface`/`border`/`text`/`primary` cascade.
- **ADR-015 패턴 답습** — `as` polymorphic, types.ts 분리, className 합성, style spread 마지막.

**후속**:

- **Trial 6 (Phase 15 후보, 별도 phase)**: ppt Presentation 또는 History 페이지 dogfood — Badge 적용 + Alert/ToggleGroup 누적 측정.
- Trial 6 결과로 Phase 15 = Alert OR ToggleGroup 결정. 둘 다 강하면 ranking 후 한쪽.
- size prop, semantic 색, icon slot 추가는 *needs 부상 후* 별도 minor bump.

---

### ADR-017: Alert 컴포넌트 — error-only(strict YAGNI) + onDismiss + statusTokens.alarm

**상태**: Trial 4(`docs/dogfood-trial-4.md`) + Trial 5(`docs/dogfood-trial-5.md`) + Trial 6(`docs/dogfood-trial-6.md`) 누적 3회 evidence로 needs ✅ 확정. Phase 16으로 1차 도입.

**맥락**:

- Trial 4 ppt Outline error inconclusive (코드상 1회 등장)
- Trial 5 ppt Home form error 1회
- Trial 6 ppt Presentation error 1회 = **누적 3회**

모두 동일 패턴: `role="alert"` + light red bg + red border + red text + 우측 dismiss 텍스트 버튼 ("닫기"). variant 다양성 0 — 전부 error.

Trial 4·5·6에서 같이 측정된 다른 후보들의 운명:
- IconButton: Trial 4 mid + Trial 5 0 + Trial 6 partial 격하 → **격하 유지**.
- ToggleGroup: Trial 5 1 + Trial 6 0 → **약함, YAGNI**.
- Card variant=outline w/ dashed: 누적 2회지만 outline+dashed는 시각 약한 needs → **YAGNI**.

Alert만 3회 누적 threshold 통과.

**결정**:

`@wonik/web`에 `Alert` 컴포넌트 1개 (variant prop **없음**). signature:

```tsx
interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'role'> {
  onDismiss?: () => void;
  as?: ElementType;
}
```

`role="alert"`는 컴포넌트가 *강제* (consumer override 차단). 시각: 단일 error 변형.

시각 매핑:

| 속성 | 토큰 |
|---|---|
| background | `statusTokens.alarm.bg` |
| border | `1px solid ${statusTokens.alarm.border}` |
| color | `statusTokens.alarm.text` |
| padding | `${space[5]} ${space[6]}` = 12px 16px |
| borderRadius | `radius.md` = 10px |
| fontSize | `fontSize.titleSm` = 14px (ppt `text-sm` 대응) |
| lineHeight | `lineHeight.tight` = 1 |
| display | flex + alignItems center, gap space[3] |
| justifyContent | space-between (when onDismiss provided) |

dismiss × 버튼: native `<button>` + inline style reset (background transparent, border none, padding `space[1]`, fontSize 동일), `aria-label="닫기"` (한국어 default, i18n needs 부상 시 prop).

dark theme: statusTokens가 CSS variable이라 `theme-dark.ts`의 status-alarm-* 정의로 자동 분기.

**대안 (검토 후 거부)**:

1. **variant prop ('info' | 'warning' | 'error' | 'success')**
   - 거부 (strict YAGNI): Trial 4+5+6 evidence 모두 error만. info/warning/success는 0회. Card·Badge precedent — variant당 1+ evidence가 원칙. needs 부상 시 minor bump 추가 (non-breaking).

2. **interfaceColors.alertBg 같은 신규 interface variable 신설**
   - 거부: host product가 alert 색을 own할 needs 0. statusTokens.alarm은 이미 존재 + 적합. 추후 needs 부상 시 별도 ADR로 격상.

3. **dismissable boolean + onClose 분리**
   - 거부: `onDismiss` callback 유무로 분기 충분. 중복 API.

4. **dismiss 버튼 텍스트 "닫기" (한글) — × icon 대신**
   - 거부: 시각 footprint 큼. × (unicode U+00D7) + aria-label="닫기"로 시각 작고 a11y 충분.

5. **dismissLabel prop으로 i18n 지원**
   - 거부 (1단계 YAGNI): 사내 한국어 default. needs 부상 시 minor bump.

6. **leading icon prop (`<Alert icon={<svg/>}>...`)**
   - 거부: children으로 자유롭게 `<Alert><svg/>메시지</Alert>` 가능. prop 추가 = over-engineering.

7. **title + description split**
   - 거부: ppt 3개 trial 모두 단일 메시지. compound 패턴은 needs 부상 후.

8. **auto-dismiss timer (자동 사라짐)**
   - 거부: needs 0. Toast 패턴과 혼동. Alert는 명시적 dismiss만.

9. **animation 등장/사라짐**
   - 거부: slop 위험(UI_GUIDE.md). needs 부상 시 별도.

10. **forwardRef<HTMLDivElement>**
    - 거부: Card·Badge 답습. ref needs 부상 시 minor bump.

**결과**:

- `packages/web/src/Alert/{Alert.tsx, Alert.test.tsx, types.ts, index.ts}` 신규.
- 12 tests 추가, 186+12=198 passing. 회귀 0.
- 컴포넌트 코드에 hex 리터럴 0. bare px 리터럴은 표준 `1px solid` 1회 (Card·Badge 동일 관례).
- `statusTokens.alarm` + `space` + `radius` + `fontSize` + `lineHeight` 토큰만 사용.
- `@wonik/web` minor bump.
- sandbox에 3 케이스(짧음 dismiss 무 / 짧음 dismiss 유 / 긺 dismiss 유) + 캡쳐 evidence (`pkg-out/phase-16-alert-matrix.png`).

**관계**:

- **ADR-001 부합** — Trial 4+5+6 누적 evidence(3회)로 입증 후 도입.
- **ADR-008 부합** — React 19-only API 0.
- **ADR-009 부합** — statusTokens가 theme-dark.ts 정의로 dark 자동 분기.
- **ADR-015·016 패턴 답습** — `as` polymorphic, types.ts 분리, className 합성, style spread 마지막, forwardRef 미사용.

**후속**:

- **layer A 1차 채움 종료 후보**: Alert 추가로 atoms 14개 도달. PRD.md "layer A의 1차 채움 + ppt dogfood 검증" 두 조건 충족 후보. 다음 단계는 (a) **layer A 종료 선언 → layer B(사내 npm registry 배포 인프라) 진입** 또는 (b) Trial 7+ 신규 needs 추가 측정. 사용자 결정 영역.
- variant 확장(info/warning/success), title/description split, leading icon, auto-dismiss 등은 *needs 부상 후* 별도 minor bump.

## ADR-018 — layer B 진입: publish-ready 전환 + registry 옵션 비교 (결정 보류)

**상태**: 결정 보류 (사내 IT 협의 결과 대기). 본 phase는 publish-ready 인프라까지 완료. 실제 첫 publish 시 본 ADR의 "결정" 섹션을 후속 minor phase가 확정.

**Context**:

Phase 01~16에서 layer A 1차 채움이 끝났다. 14 atoms (Button/Box/Stack/Text/Input/Textarea/Checkbox/Switch/Radio/Spinner/Skeleton/Card/Badge/Alert) × ppt 3페이지 (Outline/Home/Presentation) dogfood × interface variable cascade(ADR-010) 입증. PRD 도달점 layer 정의에 따르면 다음은 layer B(사내 패키지 배포). 본 ADR은 layer B 진입 시 결정해야 할 *registry 옵션*과 *준비 작업*을 정리한다.

**옵션 비교**:

| 옵션 | 인프라 | scope | token 발급 | IT 의존성 | publish 자동화 | 1순위 후보 가능성 |
|---|---|---|---|---|---|---|
| **A. 사내 npm registry (Verdaccio 호스팅 등)** | 사내 서버 + Verdaccio/Nexus 등 | `@wonik` 그대로 유지 가능 | IT가 발급 (사내 계정 연동) | ★★★ (셋업 자체가 IT 작업) | manual 시작 → CI 추후 | ◯ (사내 표준화 관점 best) |
| **B. GitHub Packages** | GitHub org 또는 personal | scope = GitHub username/org와 매칭 필요 → `@wonik` 쓰려면 GitHub `wonik` org 필요 | GitHub PAT (개인 token, scope: read/write:packages) | ★ (GitHub org 생성만) | GitHub Actions 자연스러움 | ◯ (가장 빠른 진입) |
| **C. Tarball via GitHub Release** | GitHub Release asset | scope 무관 | 없음 (public release) | 0 | 자동 가능 (gh release) | △ (host install 매번 URL 직접 지정 — 학습 곡선 ↑) |

**거부된 대안**:

1. **공개 npm registry**(npmjs.com에 public publish) — 사내 전용 디자인 시스템이 외부 노출. 보안/IP 관점 부적합. `restricted` access로 publish해도 npmjs.com 자체가 공개 인덱스에 메타데이터 등록.
2. **공유 폴더 + file: 의존성** — 진짜 "패키지 배포"가 아니라 link. version pinning 불가. 본 phase의 목표(host product가 `pnpm add`로 install)와 어긋남.
3. **Verdaccio를 본인 노트북에서 호스팅** — 가용성 0. 사내 인프라가 아니므로 다른 팀원 install 불가.
4. **scope 이름 변경 (`@wonik` → `@ohjihoon05` 등)** — host product의 모든 import path 재작성 비용 + 사내 정체성 상실. 사내 IT가 `@wonik` org를 GitHub에 만들거나 사내 registry가 scope 제약 없으면 회피 가능.

**1순위 권장 + 2순위 fallback**:

- **1순위**: 옵션 A (사내 npm registry). 사내 정체성 유지, scope 제약 없음, 사내 SSO 연동 자연스러움. 비용은 IT 셋업 시간 — 협의 후 일정 확정.
- **2순위 fallback**: 옵션 B (GitHub Packages). 사내 registry 셋업이 N주 이상 지연되면 GitHub `wonik` org 생성 + 임시 publish. scope 매칭만 풀면 즉시 진입 가능.
- **결정 보류 명시**: 본 phase에서는 어느 옵션도 *확정하지 않는다*. publish-ready 메타데이터 (publishConfig.registry는 placeholder URL `https://npm.pkg.github.com/RESOLVE_BEFORE_PUBLISH`)로 두고, 결정 후 후속 phase에서 실제 URL로 교체.

**본 phase에서 완료한 publish-ready 준비**:

1. **메타데이터** — 두 패키지 `package.json`에 description / repository / homepage / license(`UNLICENSED`) / version(`0.1.0`) / publishConfig.access(`restricted`) / sideEffects / files(`["dist"]`) 추가. `private: true` 제거.
2. **publish 가드** — `prepublishOnly: "pnpm build && pnpm test"` — 깨진 artifact publish 불가.
3. **placeholder URL 방어** — publishConfig.registry가 명백한 placeholder(`RESOLVE_BEFORE_PUBLISH`)이므로 실수 publish 시 404 즉시 fail. 결정 후 교체 필수.
4. **peer contract** — `@wonik/web`이 `@wonik/tokens`를 peer로 명시 (`^0.1.0`). ~~dependency도 유지(workspace:*는 publish 시 자동 변환).~~ host가 직접 token CSS를 import해 cascade 활성화 가능.
   > **🔄 Superseded by ADR-019 (2026-05-15)**: trial 7 dogfood(ppt 0.0.0 → 0.1.0 마이그레이션)에서 `dependencies."@wonik/tokens"` 유지가 `ERR_PNPM_FETCH_404`를 유발함을 확인. 사내 npm registry 미정 상태에서는 broken contract. ADR-019에서 `dependencies` 제거 + `devDependencies` (`workspace:*`)로 dev link만 보존하는 peer-only 패턴으로 변경.
5. **install 가이드** — `docs/INSTALL.md` 신설 (인증 / install / import / cascade override / FAQ).
6. **`.npmrc.example` + `.gitignore`** — 실제 token이 git history에 남지 않도록 보호.

**결정해야 할 항목 (후속 phase가 닫음)**:

| 항목 | default | 비고 |
|---|---|---|
| registry 옵션 | A (사내 npm) | B/C는 fallback |
| 실제 registry URL | TBD | `RESOLVE_BEFORE_PUBLISH` 자리 교체 |
| `@wonik` scope 매핑 | 사내 namespace 그대로 | GitHub Packages 선택 시 `wonik` org 필요 |
| token 발급 정책 | 사내 SSO 기반 | IT가 발급 흐름 정의 |
| CI 자동 publish | 1단계는 manual | GitHub Actions changeset/action은 후속 검토 |
| 첫 publish 후 monorepo dogfood 절차 | ppt가 workspace:* → 실제 `@wonik/web@0.1.0`으로 install 전환 | dual-direction 입증 |

**Trade-offs / 위험**:

- **R1 실수 publish**: placeholder URL + prepublishOnly로 이중 방어.
- **R2 workspace:* 미변환**: changeset publish가 자동 변환. dry-run report에서 명시적 확인 (Step 4).
- **R3 scope 충돌**: 옵션 B에서만 발생. 옵션 A 채택 시 회피.
- **R4 license `UNLICENSED` 경고**: 일부 tool이 warning. `private`/`restricted` 조합으로 host install엔 영향 없음.
- **R5 publish 후 host product workflow**: 첫 publish 성공 후 ppt가 `workspace:*` → 실제 버전으로 전환할 때 dual-direction (local dev는 link, prod는 published version) 검증 필요. 별도 phase.

**거부된 대안의 결정 근거 (요약)**:

- 공개 npm: 사내 IP 보호 ✗
- file: 의존성: version 관리 ✗, 본 phase 목적 ✗
- 본인 노트북 Verdaccio: 가용성 ✗
- scope 변경: host 마이그레이션 비용 ↑, 정체성 ✗

**POC 결과 (2026-05-14 보강)**:

회사 PC에서 GitHub Release tarball 경로로 install이 *기술적으로 작동*함을 검증 완료. 자세한 결과는 `phases/17-distribution/poc-result.md` 참조. 핵심:

- Release `v0.1.0-poc`를 회사 PC 브라우저에서 다운로드 → `pnpm add` 성공 (Done in 899ms) → `node_modules/@wonik/{web,tokens}/dist` 정상.
- 회사 SSL inspection으로 `winget`이 막혀(`0x8a15005e`) `gh` CLI 정식 설치는 차단됐지만, *브라우저로 release asset 직접 다운로드*는 통과. → 옵션 C(tarball-via-release)가 *최소한의 우회 경로*로도 작동함을 입증.
- IT 협의 시 추가 요청 항목: **winget 허용 또는 회사 root CA 신뢰 추가**(`gh` 같은 CLI 도구 사용 위해).

**후속 phase 예상 흐름**:

1. IT 협의 → 옵션 확정
2. registry URL/token 발급
3. `publishConfig.registry`를 실제 URL로 교체 + changeset 항목 추가
4. `pnpm publish` 첫 실행 (manual)
5. ppt가 published 버전으로 install 전환 → dual-direction 입증
6. (선택) CI 자동 publish workflow

**Verdaccio dry run 보강 (2026-05-15, trial 12)**:

집에서 Verdaccio(localhost:14873)로 옵션 A 흐름을 *전체 cycle* 시뮬레이션 완료. 사용자 통찰("집에 구성을 회사에서 할 수 있는 것처럼 할 수 있잖아? 나 컴퓨터 안 꺼")에서 출발. 자세한 결과는 `docs/dogfood-trial-12.md`. 핵심:

- 8 step 한 바퀴 (Verdaccio setup → 첫 publish → ppt install → dual-direction patch) 모두 성공.
- 첫 publish: `@wonik/tokens@0.2.0` + `@wonik/web@1.0.0`. 누적 8개 changeset 적용 결과(F28).
- ppt 마이그레이션: `file:vendor/...tgz` → `^0.2.0`/`^1.0.0` (3.7초). dual-direction patch 0.2.1: `pnpm update` 1.5초.
- **사내 진입 시 교체 위치 = 정확히 2 곳**:
  - `design_system/.npmrc`의 `@wonik:registry=...` + `_authToken`
  - `tokens/web/package.json`의 `publishConfig.registry`
- Verdaccio 표준 4873은 Windows excluded port range(4866-4965)에 잡혀 14873 사용. 사내 서버는 다른 머신이라 무관.
- **ADR-019 peer-only contract publish 시도 정합 입증**: web의 `@wonik/tokens` peer가 publish 과정에서 `^0.1.0` → `^0.2.0`으로 자동 caret 갱신.
- **changeset publish 자동 skip 검증**: tokens patch 시 web은 자동 제외.

→ 옵션 A 1순위 reaffirm. 사내 진입 시 *URL만 교체*하면 즉시 작동 상태.

---

## ADR-019 — `@wonik/web` packaging: peer-only token contract (Supersedes ADR-018 #4 일부)

**날짜**: 2026-05-15
**상태**: 결정 완료. 구현 + ppt dogfood trial 7로 검증.

**Context**:

ADR-018 항목 #4 "peer contract"에서는 `@wonik/web`이 `@wonik/tokens`를 **peer + dependency 둘 다** 두는 패턴을 채택했다. 동기는 "peer는 host에 install을 요구, dependency는 monorepo workspace dev 시점 link". `workspace:*`는 publish 시 자동 변환된다고 가정.

2026-05-15 dogfood trial 7(ppt에 `@wonik/web` 0.0.0 → 0.1.0 마이그레이션)에서 이 가정이 깨짐:

- `pnpm pack`이 `workspace:*` → `0.1.0`으로 변환은 정상.
- 그러나 ppt에서 `pnpm install` 시 pnpm이 `@wonik/tokens@0.1.0`을 **공개 npm registry에서** lookup → `ERR_PNPM_FETCH_404` 즉시 fail.
- 사내 npm registry 미정 상태(layer B 결정 보류)에서는 dependency 선언 자체가 broken contract. host의 `pnpm.overrides`로 우회 가능하나 변칙적 + lockfile cache와 충돌.

**결정**:

`@wonik/web`은 `@wonik/tokens`를 **`peerDependencies` + `devDependencies` 조합으로만** 선언한다. `dependencies` 섹션에서 제거.

```json
{
  "peerDependencies": {
    "@wonik/tokens": "^0.1.0"
  },
  "devDependencies": {
    "@wonik/tokens": "workspace:*"
  }
  // dependencies에서 @wonik/tokens 제거
}
```

**효과**:

1. **host 계약 명시화**: `@wonik/web`을 받는 host는 누구든 `@wonik/tokens`를 직접 install해야 한다는 강제. 이는 토스 TDS / Material UI / Radix UI / shadcn 등 모든 진짜 design system이 채택한 패턴.
2. **dev 시점 동작 보존**: monorepo 안에서는 `devDependencies`의 `workspace:*`로 link되어 `@wonik/web` 내부에서 `@wonik/tokens` import 정상 동작. `devDependencies`는 tarball에 포함되지 않음(pnpm pack 표준 동작) — host 영향 없음.
3. **registry 무관**: host가 tokens를 어떤 경로(file: / sha-pinned / 사내 registry)로 install하든 web은 신경쓰지 않음. layer B 옵션 결정과 독립적으로 동작.
4. **lockfile 충돌 제거**: pnpm.overrides 같은 우회 메커니즘 불필요. ppt도 평범한 dependency 두 개로 정상화.

**검증**:

- design_system: `pnpm install` 통과(monorepo 안 web 내부 import 동작) + `pnpm -F @wonik/web build` 통과 + sandbox 정상 동작 (`apps/web-sandbox`).
- packed tarball: `tar -xzOf wonik-web-0.1.0.tgz package/package.json` → `dependencies` 섹션 부재, `peerDependencies.@wonik/tokens: ^0.1.0`만 존재.
- ppt: `pnpm install` 통과(`+ @wonik/tokens 0.1.0 / + @wonik/web 0.1.0`) + `pnpm dev` HMR 통과 + Alert 첫 import 동작.

**Trade-offs / 위험**:

- **R1 host가 tokens install 누락**: pnpm이 unmet peer warning 출력. ESLint/TS 단계까지 가면 import 자체 실패로 즉시 발견. host 인지 비용 ↑이지만 명시적이라 실수 적음.
- **R2 tokens 버전 불일치**: host가 `@wonik/tokens@0.0.5`처럼 낮은 버전 install하면 cascade 변수 부재로 시각 깨짐. peer range `^0.1.0`이 minimum 보장.
- **R3 ADR-018 문서 drift**: ADR-018 항목 #4의 "dependency도 유지" 문구가 본 ADR과 모순. ADR-018은 history로 유지하되 본 ADR이 supersede 명시. INSTALL.md / QUICKSTART.md도 갱신 필요.

**거부된 대안**:

1. **`pnpm.overrides` 영구 사용**: trial 7에서 lockfile cache와 충돌하며 깨짐. 변칙적, host 인지 비용 동일하면서 실수 여지 ↑.
2. **`bundledDependencies` 로 tokens 함께 packing**: tarball 크기 ↑, 토큰 변경 시 web도 매번 재pack 필요, host가 cascade 위해 별도 import 불가능.
3. **공개 npm registry에 tokens 먼저 publish**: 사내 IP 노출(ADR-018 거부 대안 #1과 동일 사유).

**후속 변경 항목**:

- [ ] `docs/INSTALL.md` 갱신: host에서 `@wonik/tokens`도 명시적 `pnpm add` 필요 명시.
- [ ] `docs/QUICKSTART.md` 갱신: 같은 반영.
- [ ] ADR-018 항목 #4에 본 ADR-019 supersede 마커 추가 (별도 commit).
- [ ] sandbox `package.json`은 이미 토스 패턴(`@wonik/tokens` 직접 dep)이라 변경 불필요.
