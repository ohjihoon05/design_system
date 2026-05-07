# PRD: WONIK IPS Design System

## 목표
원익IPS 사내에서 만드는 모든 web service가 동일한 토큰·컴포넌트 위에서 작동하도록 만들어, "새 web 프로젝트가 시작될 때마다 디자인을 처음부터 다시 만드는" 비용을 없앤다. WARP(반도체 장비 컨트롤 SW)에서 추출한 토큰을 공통 base로 두고, 산업용/일반 web service 두 가지 모드를 같은 기반 위에서 운영한다.

## 장기 비전 (북극성)

1단계는 작게 시작하지만 도달점은 **사내판 "앱인토스(Apps-in-Toss)"** — 사내 팀이 `@wonik/web` 위에서 frontend를 자유롭게 만들 수 있는 통합 환경이다. 토스가 외부 파트너에게 SDK를 제공해 토스 앱 안에서 미니앱을 빌드하게 하듯, 우리는 사내 형제 팀(ppt·향후 AI 도구·사내 대시보드 등)에게 동일한 시각 언어·도구·시작점을 제공한다.

### 도달점 layer

| Layer | 의미 | 1단계 적용 여부 |
|---|---|---|
| **A. 디자인 시스템** (`@wonik/tokens` + `@wonik/web`) | 토큰·컴포넌트·시각 언어 일관성 | ✓ 1단계 핵심 |
| **B. 사내 패키지 배포** | 사내 npm registry / GitHub Packages — `pnpm add @wonik/web` 한 줄로 설치 | 1단계 후반 검토 |
| **C. 프로젝트 시작 템플릿** (`npx create-wonik-app` 류) | 새 사내 프로젝트가 디자인 시스템·tooling 갖춘 상태로 즉시 시작 | 1단계 외 |
| **D. 사내 SSO 통합** | 사내 인증·권한이 한 줄 import으로 적용 | 1단계 외 |
| **E. Observability hook** | 로깅·에러 리포팅·analytics가 default로 wired | 1단계 외 |
| **F. Docs 사이트** | `design.wonik.internal` 같은 컴포넌트 카탈로그 + Storybook + Figma 매핑 | 1단계 외 |

앱인토스의 **런타임 sandbox·결제(IAP)·인앱 광고(IAA)·푸시 캠페인·심사 프로세스**는 외부 파트너 대상 슈퍼앱 모델 때문에 필요한 것들이라 **사내 컨텍스트에서는 불필요**하다(사내 팀은 자기 URL로 자기 앱을 배포하고, 결제·광고·푸시 캠페인은 우리 도메인 밖). 도달점에서도 제외한다.

### 1단계와의 관계

1단계 결승선 = **layer A의 1차 채움 + ppt dogfood 검증**. 이 두 가지가 끝나야 layer B(사내 배포 인프라)로 올라간다. 절대 layer를 건너뛰지 않는다 — A가 사내에서 검증되지 않은 상태로 B에 시간을 쓰면 "검증 안 된 디자인 시스템을 빠르게 배포하는 인프라"만 남는다. 토스도 SLASH 디자인 시스템을 사내에 정착시킨 뒤 앱인토스라는 외부 SDK를 만들었다.

## 사용자
- **1차 사용자**: 사내 SW팀 개발자들 — `npm install`로 import해서 React 앱에 사용한다.
- **첫 dogfood**: ppt(Factory PPT) 프로젝트 — 사내 팀원이 쓰는 AI 프레젠테이션 생성기. MVP 단계라 디자인 시스템을 일괄 적용하기에 적합. **본 디자인 시스템의 진짜 첫 적용 product.**
- **WARP (시안)**: 반도체 장비 운영을 위한 **HMI(Human-Machine Interface)** 디자인 시안. 1920×1080 고정 industrial UI. Production에 적용된 적 없음. 본 디자인 시스템의 시각 언어·토큰 베이스의 **영감 source**로 활용.
- **2차 사용자**: 향후 사내에 등장할 web service 프로젝트들 (AI 시대에 늘어날 사내 AI 도구·대시보드·고객 포털 등).
- **유지보수자**: 본인(UI/UX 디자이너) — 시한 없는 인프라로 지속적으로 키워간다.

## 우선순위

**1단계: Web만.** `@wonik/tokens` + `@wonik/web` 두 패키지로 시작하고, ppt가 첫 dogfood. 다른 form factor(모바일 앱·HMI 등)는 진짜 product가 등장할 때 그 형태(별도 패키지로 분리할지, 컴포넌트 variant prop으로 흡수할지)를 보고 결정한다 — 미리 architecture에 박지 않는다 ("첫 customer 없이 추상화하지 않는다" 원칙).

WARP 시안은 토큰·시각 언어의 reference로 보존.

## 핵심 기능
1. **디자인 토큰 패키지 (`@wonik/tokens`)** — 색·타이포·spacing·radius·border 토큰을 CSS 변수와 TypeScript 정의로 export. WARP 시안에서 추출한 base + 공식 CI brand color (WONIK BLUE/GRAY).
2. **Web 컴포넌트 (`@wonik/web`)** — Web service용 컴포넌트. 1단계는 Button부터 차근차근 시작 → ppt에서 검증 → 점진 확장. 최종 목표 컴포넌트 셋: Button, Input·Textarea, Card, Modal, Toast, Spinner·Skeleton, Tabs, Dropdown·Select + ppt에서 도출되는 SortableList, InlineEditableText.
3. **사내 배포** — 사내 npm 레지스트리 또는 GitHub Packages를 통해 `npm install @wonik/web` 형태로 설치 가능 (인프라는 1단계 후반에 결정).

## MVP 제외 사항
- 토스 TDS급 150+ 컴포넌트 라이브러리 — 1단계는 `@wonik/web` Button부터 차근차근. 단계별 점진 확장.
- 모바일/HMI 등 web 외 form factor용 컴포넌트 — 진짜 product 등장 시 그때 형태 결정. 1단계 범위 외.
- WARP 시안의 산업용 컴포넌트(DataPanel/StatusIndicator/Toolbar) production화 — 진짜 HMI product 등장 시. 시안은 reference로 보존.
- Figma 자동 동기화 파이프라인, Code Connect 자동화 — 점진 확장 단계에서 도입.
- 전용 docs 사이트(`docs.wonik.com` 같은) — 1단계는 README + apps/web-sandbox 정도, 풀스펙 docs는 나중.
- Vue/Angular/Svelte 지원 — React로 통일 가정.
- 다크 모드 — 1단계는 light-only.
- 반응형 디자인 — 1단계 web은 데스크톱 우선.

## 디자인
- **Web (1단계)** — 산업용 baseline 정신은 유지하되 일반 사용자(사내 팀원)에게 더 friendly한 톤. 본격적인 visual language는 ppt 적용 단계에서 본인 디자인 감각으로 결정. Tailwind CSS v4 기반.
- **WARP HMI 시안 (reference)** — Light-mode industrial. 글래스모피즘·그라데이션·애니메이션·emoji 모두 사용 안 함. Border 대비로만 elevation 표현, dense data UI, Segoe UI/Inter 폰트, no bold weights. 시각 언어와 토큰의 영감 source — 진짜 HMI product 등장 시 production화 형태 결정.
- **Brand base (모든 영역 공유)** — WONIK BLUE `#273E82` + WONIK GRAY `#ACACAC`(공식 CI), neutral gray scale, status colors(ok/warn/alarm/init/processed). Spacing scale (4/6/8/10/12/16/22/32), border-radius(5px/10px), Segoe UI 폰트.
