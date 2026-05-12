# 아키텍처

## 디렉토리 구조

```
design_system/                          # 모노레포 루트 (이미 git init 완료)
├── packages/
│   ├── tokens/                         # @wonik/tokens — 공통 토큰 base
│   │   ├── src/
│   │   │   ├── colors.ts               # 색 토큰 (TypeScript 정의)
│   │   │   ├── typography.ts           # 타이포 scale
│   │   │   ├── spacing.ts              # spacing/radius/border
│   │   │   ├── status.ts               # status semantic 토큰 (ok/warn/alarm/init/processed)
│   │   │   └── index.ts                # public API
│   │   ├── dist/                       # 빌드 산출물 (CSS variables + JS exports)
│   │   └── package.json
│   │
│   └── web/                            # @wonik/web — Web 컴포넌트 (1단계)
│       ├── src/
│       │   ├── Button/                 # primary/secondary/text/outline/danger × sm/md/lg
│       │   ├── Input/                  # form 컨트롤 — focus/hover/placeholder polish (ADR-011)
│       │   ├── Textarea/               # Input과 패턴 동일 + resize? prop
│       │   ├── Checkbox/               # accentColor 토큰화 + focus-visible ring
│       │   ├── Switch/                 # checked 분기 module-scope CSS 패턴 reference
│       │   ├── Radio/                  # Checkbox와 패턴 동일
│       │   ├── Spinner/                # animation + label a11y
│       │   ├── Skeleton/               # text/rect 변종
│       │   ├── Box/                    # layout primitive (p/m/bg/border)
│       │   ├── Stack/                  # vertical/horizontal layout + gap
│       │   ├── Text/                   # typography variant + color 토큰화
│       │   ├── ThemeProvider/          # data-theme="light|dark" 토글 (ADR-009)
│       │   ├── Card/                   # (후속)
│       │   ├── Modal/                  # (후속)
│       │   ├── Toast/                  # (후속)
│       │   ├── Tabs/                   # (후속)
│       │   ├── Dropdown/               # Dropdown + Select (후속)
│       │   ├── SortableList/           # ppt에서 도출 (후속)
│       │   ├── InlineEditableText/     # ppt에서 도출 (후속)
│       │   └── index.ts
│       └── package.json
│
│   # 다른 form factor용 패키지(@wonik/app, @wonik/warp 등)는 진짜 product 등장 시
│   # 형태(별도 패키지 vs 컴포넌트 variant)를 보고 결정. 미리 박지 않는다.
│
├── apps/
│   ├── web-sandbox/                    # @wonik/web 시각 검증용 minimal Vite app (1단계)
│   └── docs-site/                      # (미래) docs.wonik.com — 토스 TDS docs 같은 사이트
│
├── docs/                               # 본 디자인 시스템의 결정·가이드 문서
│   ├── PRD.md
│   ├── ARCHITECTURE.md                 # 이 문서
│   ├── ADR.md
│   └── UI_GUIDE.md
│
├── WONIK IPS — WARP Design System/     # 디자인 시안 (concept reference) — production 자산 아님
│   ├── colors_and_type.css             # 토큰 베이스의 영감 source — packages/tokens/src/* 가 여기서 추출됨
│   ├── ui_kits/warp/*.jsx              # 산업용 컴포넌트 시안 — 진짜 HMI product 등장 시 참조
│   ├── preview/*.html                  # 시각 reference — 그대로 보존
│   └── assets/                         # 산업용 product 자산 (장비 다이어그램 등) — HMI product 등장 시 이전
│
├── package.json                        # 모노레포 루트 (pnpm workspaces)
├── pnpm-workspace.yaml                 # workspace 정의
└── turbo.json                          # (선택) Turborepo 빌드 캐시 설정
```

## 패턴

- **패키지 의존성**: `@wonik/web`은 `@wonik/tokens`에만 의존. 향후 다른 form factor용 패키지가 추가되면 동일하게 `@wonik/tokens`에만 의존하고 컴포넌트 패키지끼리는 서로 import하지 않는 게 원칙.
- **토큰-컴포넌트 분리**: 색·타이포·spacing 같은 raw 값은 토큰 패키지에만 존재. 컴포넌트 패키지는 토큰을 import해서 사용 (하드코딩된 hex/px 값 금지).
- **CSS 변수 + JS exports**: 토큰은 두 가지 형태로 export — CSS 변수(`--color-primary` 등 런타임 사용)와 TypeScript 상수(타입 안전 import). 두 표현은 동일 source에서 생성.
- **Layer A 모델 (ADR-010, ADR-011)**: 디자인 시스템은 *시각 형태*만 own하고, *색은 host product가 own*한다. 컴포넌트가 `interfaceColors.*`로 reference하면 `var(--color-X, var(--color-X-internal))` cascade fallback이 자동 적용 — host가 같은 이름 CSS variable을 정의하면 host 우선, 미정의 시 우리 internal로 fallback. host 학습 곡선 0, standalone(web-sandbox) 동작 보장. 1단계 dogfood(ppt)에서 입증됨.
- **Interface variable 7개 (contract surface)**: `bg`, `surface`, `border`, `text`, `textMuted`, `primary`, `focus`. ppt dogfood에서 도출된 host가 정의할 가능성이 높은 표준 이름. 추가는 새 dogfood evidence 등장 시 ADR로.
- **Pseudo-class·pseudo-element는 `ensureCssInjected` 패턴 (ADR-011)**: inline style로 못 풀므로 컴포넌트별 module-scope CSS 1회-inject. `data-wonik-X` style 태그 + className `wonik-X` 부여 + SSR 가드(`typeof document === 'undefined'`) 필수. focus indicator는 `outline: 2px solid var(--color-focus, var(--color-primary))` 표준 (WCAG 2.1 SC 2.4.7 AA 충족). reference 구현: `packages/web/src/Switch/Switch.tsx`.
- **Headless 우선**: 가능하면 동작과 스타일 분리. Radix UI primitives 같은 unstyled 베이스 위에 토큰을 입히는 패턴 검토.
- **ppt 적용 패턴**: ppt가 `@wonik/web`을 import하고 컴포넌트를 사용. 부족한 컴포넌트가 발견되면 ppt에서 임시로 만들지 말고 `@wonik/web`에 추가 후 import (incremental dogfood).
- **dogfood → phase 사이클**: ppt 적용에서 발견된 결함을 별도 phase로 흡수 → 재캡쳐로 closed loop 확인 (Phase 06·07·08·09·10 모두 이 사이클). trial 산출물은 `docs/dogfood-trial-N.md`로 보존.
- **시각 검증 — apps/web-sandbox/**: 1단계에서 ppt에 본격 적용 전, minimal Vite app(`apps/web-sandbox`)에서 컴포넌트가 React 19 + Vite + Tailwind v4 환경에서 정상 작동하는지 sandbox 검증. ppt 환경과 stack 동일.

## 데이터 흐름

```
[디자이너 결정]
     ↓
docs/UI_GUIDE.md 업데이트 (디자인 원칙·토큰 규칙)
     ↓
packages/tokens/src/* 업데이트 (실제 토큰 값)
     ↓
[빌드: pnpm -F @wonik/tokens build]
     ↓
@wonik/tokens dist/ — CSS 변수 + TS 정의
     ↓
packages/warp/, packages/web/ 가 import
     ↓
[빌드: pnpm -F @wonik/web build]
     ↓
사내 npm 레지스트리 / GitHub Packages 에 publish
     ↓
[ppt frontend/package.json] npm install @wonik/web
     ↓
ppt UI에서 import & 사용 → 실 사용자(사내 팀원)에게 도달
     ↓
[피드백 / 부족 발견] → 디자이너 결정으로 루프
```

## 상태 관리

디자인 시스템에서 "상태 관리"는 일반 앱과 다르게 **버전·변경 propagation**을 의미한다.

- **버전 관리**: 각 패키지는 semver 따름. 토큰 변경(예: primary color 교체)은 minor 또는 major bump. Changesets(`@changesets/cli`)로 변경 이력 관리.
- **변경 propagation**: 토큰 패키지가 bump되면 warp/web도 새 버전으로 publish하는 게 원칙. 모노레포라서 한 번의 PR에서 모든 패키지 동기화 가능.
- **Breaking change 정책**: 토큰 이름 변경·삭제는 major bump + ADR 작성. 컴포넌트 prop 변경 동일.
- **사용처 추적**: 어느 product가 어느 버전을 쓰는지 추적할 수 있도록 publish 후 Slack/사내 게시판에 공지(향후). 1단계에서는 ppt 한 군데뿐이라 수동 관리.
- **컴포넌트 내부 상태**: 컴포넌트는 가능하면 stateless (props 기반). 필요한 경우(Modal open/close, Tabs active 등)는 controlled + uncontrolled 둘 다 지원하는 React 표준 패턴 사용. 글로벌 state 라이브러리 (Zustand/Redux 등) 의존 금지 — consumer가 자유롭게 선택해야 함.
