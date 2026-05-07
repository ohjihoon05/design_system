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
