# Phase 12 — Card (plan.md)

> autopilot PHASE 3 (PLAN) 산출물. spec.md의 결승선을 어떻게 만족시킬지 — 도구·순서·아키텍처 근거·리스크·테스트.

## 1. 접근 방식 (전체 그림)

```
[1] ADR-015 작성 + Card spec 합의 (이미 spec.md에 signature 확정)
       ↓
[2] TDD: types.ts + Card.test.tsx 먼저 → Card.tsx 구현
       ↓
[3] sandbox에 8개 조합 매트릭스 섹션 추가
       ↓
[4] pnpm build (tokens → web) + pnpm test (163+N passing)
       ↓
[5] sandbox 캡쳐(headless Chrome) → pkg-out/phase-12-card-matrix.png 시각 검토
       ↓
[6] Changesets minor + ADR-015 + PRD 진행 현황 업데이트
       ↓
[7] phase index.json 닫고 closure
```

본 phase는 **design_system 내부 완결**. dogfood(ppt 적용)는 Phase 13 후보(별도 Trial 5).

## 2. 기술 선택 근거 (왜 이 도구·이 패턴)

### 2.1 컨테이너 1개 컴포넌트만 — 왜 Header/Body/Footer subcomp 없이

- Trial 4 evidence: ppt OutlineCard는 명확한 Header/Body/Footer 구획이 없음. 자유로운 children 컨테이너 패턴. subcomp를 미리 만들면 *추정 over-engineering* (CLAUDE.md "첫 customer 없이 추상화 금지").
- 4 reps 모두 단일 컨테이너 패턴 → 단일 `<Card>`만으로 needs 100% 충족.
- 미래 needs 부상 시 minor bump로 subcomp 추가 가능 (`Card.Header` 같은 compound pattern은 breaking change 아님).

### 2.2 `as` prop으로 generic ElementType 노출 — Box와 일치

- semantic HTML 필요 시(`as="section"`, `as="article"`) host가 결정. a11y는 host 영역.
- Box (`packages/web/src/Box/Box.tsx`)와 동일 인터페이스 → 학습 부담 0.
- TypeScript polymorphic 컴포넌트의 type 복잡도 회피 위해 `as?: ElementType` 단순 형태(Box 답습).

### 2.3 module-scope CSS 1회-inject (`ensureCssInjected()`) — Button/Skeleton 패턴 답습

- dark theme 그림자 분기(`[data-theme="dark"] .wonik-card-elevated { box-shadow: none }`)는 attribute 셀렉터 필요 → inline style로 못 풀어냄.
- ADR-011·Spinner·Skeleton·Button에서 검증된 패턴. SSR 가드(`typeof document === 'undefined'`) 동일.
- `data-wonik-card` style 태그 1회 삽입, 이후 zero overhead.

### 2.4 `interfaceColors`만 시각 색으로 사용 — ADR-010 cascade 답습

- `surface`·`border`는 host product가 own한 의미 색 → `interfaceColors.surface`·`interfaceColors.border`로 reference. host의 `--color-surface`·`--color-border` 정의 시 자동 흡수, 미정의 시 우리 internal로 fallback.
- Trial 4가 다중-컴포넌트 환경에서 cascade 무회귀 입증. Card도 같은 계약 위에서 자연스럽게 host와 통합.

### 2.5 padding은 `space[N]` 토큰 매핑 — hex/px 리터럴 0

- `sm=space[4]=10px`, `md=space[6]=16px`, `lg=space[8]=32px`. Tailwind v4의 `p-4(=16px)`이 md에 자연 매핑.
- `none`은 `0`. raw 값 *0*이 우리 토큰 시스템에서는 보편 상수 — `space` 테이블에 0 추가는 over-engineering. `padding: 0` 명시 OK.

### 2.6 boxShadow를 토큰화 *안 하는* 이유

- 그림자 사용처가 elevated variant 1개뿐 → 토큰 추가는 사용처 2+ 부상 시 (ADR + minor bump). 지금은 컴포넌트 내부 상수 `'0 1px 3px rgba(0,0,0,0.08)'`.
- 사용처가 늘면 그때 `shadow.sm/md/lg` + `interfaceColors.shadow` ADR로 격상. YAGNI 원칙.

## 3. 의존성 (외부 라이브러리·서비스·환경)

- **이미 존재, 새로 추가 0**:
  - `react@^18 || ^19` peer (ADR-008 — dual 지원).
  - `@wonik/tokens@workspace` (interfaceColors, space, radius).
  - `vitest@^2` + `@testing-library/react` (회귀 테스트).
  - `typescript@5.7` strict mode.
  - `tsup` 또는 `vite` (패키지 빌드 — 현 설정 답습).
- **외부 서비스 / 도구**:
  - Headless Chrome: sandbox 매트릭스 캡쳐 (Trial 1·2·3·4에서 검증된 명령).
- **새 의존성**: 없음.

## 4. 아키텍처 결정 (이 phase 안에서)

### 4.1 forwardRef 사용 — Skeleton 동일

- host가 Card DOM 노드에 `ref`로 접근할 수 있어야 (scroll-into-view, focus 관리 등). Skeleton·Box도 ref forwarding을 위해 `forwardRef<HTMLDivElement>` 사용 중. Card는 더 핵심적인 컨테이너라 ref 필요성 확실.

### 4.2 className 합성: `className: 'wonik-card ' + (props.className ?? '')`

- module-scope CSS 셀렉터(`.wonik-card-elevated`)가 필요. user className은 *뒤*에 붙여 user override 우선.
- Skeleton(`role="status"`)·Button(`wonik-button`)과 동일 패턴.

### 4.3 elevated variant의 className suffix: `wonik-card-elevated`

- variant=elevated일 때만 추가 → dark theme 분기 셀렉터(`[data-theme="dark"] .wonik-card-elevated`)가 작동.
- variant=surface는 className suffix 없음 (불필요).

### 4.4 type 정의 위치: `types.ts` 분리

- Skeleton/Button과 일치. types만 import하는 사용처(예: ppt의 wrapper component prop forwarding)에서 트리 셰이킹 친화적.

### 4.5 padding token mapping table — 모듈 상수

```tsx
const PADDING_MAP: Record<CardPadding, string> = {
  none: '0',
  sm: space[4],   // 10px
  md: space[6],   // 16px — Trial 4 `p-4` 대응
  lg: space[8],   // 32px
};
```

룩업 1회 + spread. switch문보다 짧고 명시적.

## 5. 위험 요소 (예상 리스크)

| # | 리스크 | 영향 | 완화 |
|---|--------|------|------|
| R1 | `forwardRef`의 generic ElementType과 type 충돌 — `as` prop과 `forwardRef<HTMLDivElement>` 결합 시 TS 에러 가능 | 컴파일 실패 | Skeleton은 `forwardRef`만 쓰고 `as` 없음, Box는 `as` 있고 `forwardRef` 없음 — **Card는 Box처럼 `as`만 쓰고 forwardRef 안 쓰는 안 1순위**. ref 필요는 향후 추가 (minor bump). |
| R2 | dark theme box-shadow 분기 CSS 셀렉터가 host의 `data-theme` 외 다른 dark 활성 패턴(클래스 기반 등)을 못 잡음 | dark에서 elevated가 light shadow 남김 | ADR-009 표준이 `<html data-theme="dark">`. host가 다른 패턴 쓰면 host CSS로 override 가능 — 우리는 표준만 보장 |
| R3 | host가 우리 `wonik-card` className을 *재정의*해서 시각 깨짐 | 시각 회귀 | className은 우리 *셀렉터 hook* 용도. host는 user-className으로 추가하면 됨. README/types JSDoc에 명시 |
| R4 | Tailwind v4 사용자가 `className="bg-blue-500"` 같이 우리 bg 위에 덮어쓸 때 우선순위 충돌 | host가 우리 bg 덮어쓸 수 있어야 함 | inline style이 className보다 우선이라 *우리 bg가 이김*. 의도된 동작 — host는 `style={{background: ...}}` 또는 우리 variant를 surface가 아닌 다른 값으로. README 안내 |
| R5 | 빈 children + padding=none 시 0×0 div가 layout 깨짐 | 사용처 버그 | spec §9.2에 명시. 의도된 동작. host가 width/height 또는 children 주입 |
| R6 | 신규 컴포넌트 + ADR-015 + PRD update + Changesets — 한 phase에 변경 다발 | 리뷰 어려움 | tasks.md에서 단계별 commit으로 쪼개고, step{N}.md로 진행 기록 |
| R7 | sandbox 매트릭스가 너무 커서 다른 컴포넌트 캡쳐 영역을 밀어냄 | sandbox UX 저하 | Card 섹션을 sandbox의 별도 영역(scroll segment)로 추가, 기존 컴포넌트 영역 건드리지 않음 |

## 6. 테스트 전략 (어떻게 검증)

### 6.1 자동 — 객관 측정 (TDD 순서)

Vitest + @testing-library/react. 테스트 *먼저* 작성하고 통과하는 구현 (CLAUDE.md CRITICAL TDD).

테스트 케이스(최소):

1. 기본 렌더 — children 노출 (`renders children`)
2. default variant = `surface` — border 1px + bg surface
3. variant=`elevated` — border 없음, boxShadow 있음
4. default padding = `md` — `padding: 16px`
5. padding=`none` — `padding: 0`
6. padding=`sm`/`lg` — 각각 `10px` / `32px`
7. as=`section` — `<section>` 태그로 렌더
8. className 합성 — 외부 className이 `wonik-card` 뒤에 붙음
9. style override — 외부 style이 default 위에 적용
10. interfaceColors 사용 입증 — bg style이 `var(--color-surface, ...)` 포함

### 6.2 raw 값 0 검증 — spec S3

- `! grep -E "#[0-9a-fA-F]{3,6}" packages/web/src/Card/Card.tsx`
- `! grep -E "[^a-zA-Z0-9-][0-9]+px" packages/web/src/Card/Card.tsx`
- 단, boxShadow 내부 `0 1px 3px` 표현은 `rgba` literal과 함께 *예외* — 별도 SHADOW 상수로 모듈 상단에 둬서 grep 친화적이지만, raw px가 string 안에 보임. → grep 패턴을 `\b[0-9]+px\b`로 정밀화 + SHADOW 상수에는 주석 `// elevation, 토큰화는 사용처 2+ 부상 시 (plan.md §2.6)` 부착.

### 6.3 시각 — sandbox 매트릭스 캡쳐

- `pnpm -F web-sandbox dev` 시 Card 섹션 자동 노출 (2×4 매트릭스 + light/dark 버튼).
- Headless Chrome으로 `pkg-out/phase-12-card-matrix.png` 캡쳐.
- AI(Read tool)가 PNG 직접 시각 분석 — spec S11·S12·S13 정성 판정.

### 6.4 정성 — 사용자 협업

- 캡쳐 본 후 사용자가 "이대로 OK / 시각 수정 필요" 판단.
- elevated shadow 강도, surface border 톤이 ppt OutlineCard와 호환되는지 한 번 더 확인.

### 6.5 회귀 — Phase 11까지 영향 0

- 기존 컴포넌트(Box/Button/Input/Textarea/Checkbox/Switch/Radio/Spinner/Skeleton/Text/Stack/ThemeProvider) 코드 변경 0.
- 기존 테스트 163개 변경 0 — 모두 그대로 통과해야 함.

## 7. 단계 분할 (tasks.md에서 풀어쓸 단위)

- **Step 0**: ADR-015 draft + `phases/12-card/` 디렉토리·index.json 초기화 + Changeset 항목
- **Step 1**: types.ts + Card.test.tsx (실패하는 테스트 먼저, TDD)
- **Step 2**: Card.tsx 구현 → 테스트 그린
- **Step 3**: index.ts + packages/web/src/index.ts re-export + 빌드 통과
- **Step 4**: sandbox에 Card 매트릭스 섹션 추가 + headless 캡쳐 + AI 시각 분석
- **Step 5**: docs/PRD.md 진행 현황 + ADR-015 finalize + 사용자 정성 confirm + index.json closure

## 8. 산출물 (phase 종료 시 존재)

- `packages/web/src/Card/{Card.tsx,Card.test.tsx,types.ts,index.ts}`
- `packages/web/src/index.ts` re-export 추가
- `apps/web-sandbox/src/...` Card 섹션 (기존 구조 따라)
- `docs/ADR.md` ADR-015 추가
- `docs/PRD.md` Phase 12 행 추가
- `.changeset/*-card.md`
- `phases/12-card/{spec.md,plan.md,tasks.md,step{0..5}.md,index.json}`
- `pkg-out/phase-12-card-matrix.png`

## 9. 후속 결정 (1단계 진행 흐름)

- **Trial 5 (Phase 13 후보)**: Card 도입 후 ppt 다른 페이지(Home/Presentation/History 중 1개)에 적용. **IconButton·Badge needs 누적 시 합쳐 Phase 13**으로 진입, **누적 안 됨 → layer A 1차 채움 종료 → layer B(사내 npm registry 배포 인프라) 진입.**
- subcomponent(Card.Header/Body/Footer) / interactive Card / shadow 토큰 추가는 *needs 부상 후* 별도 phase로.
