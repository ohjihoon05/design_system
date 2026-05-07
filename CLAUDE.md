# 프로젝트: WONIK IPS Design System

원익IPS 사내 web service 전체에서 사용할 디자인 시스템 모노레포. WARP HMI 시안에서 추출한 토큰을 base로, **`@wonik/tokens` + `@wonik/web` 두 패키지로 시작**한다. 다른 form factor(모바일 앱·HMI 등)용 별도 패키지는 진짜 product 등장 시 그 형태를 보고 결정 — 미리 박지 않는다 (ADR-001). ppt(Factory PPT)가 첫 dogfood.

상세 결정은 `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/ADR.md`, `docs/UI_GUIDE.md`를 참조. 본 문서는 매 step 프롬프트에 inject되는 가드레일이다.

## 1단계 범위 (CRITICAL — 모든 작업의 출발점)

| 항목 | 상태 |
|------|------|
| `@wonik/tokens` | 1단계 작성 |
| `@wonik/web` | 1단계 작성 (Button부터) |
| 다른 form factor 패키지 (모바일/HMI 등) | **1단계 외** — 진짜 product 등장 시 결정 |
| WARP 시안 폴더 (`WONIK IPS — WARP Design System/`) | 보존, 컴포넌트 production화 안 함 (ADR-004) |

**모든 작업은 web에 집중한다.** App·HMI 관련 패키지를 1단계에서 만들지 않는다 (ADR-001).

## 기술 스택

- **모노레포**: pnpm workspaces (Turborepo는 선택 도입)
- **언어**: TypeScript strict mode (모든 패키지)
- **프레임워크**: React 함수형 — peer `^18 || ^19` dual 지원 (ADR-008). 개발/테스트 환경은 React 19로 통일 (ppt와 일치).
- **빌드**: Vite (패키지별), tsup도 검토 가능
- **스타일링**: Tailwind CSS v4 + CSS 변수 (디자인 토큰은 CSS variable로 노출)
- **버전 관리**: Changesets (`@changesets/cli`) — semver + 변경 이력
- **테스트**: Vitest + @testing-library/react

## 아키텍처 규칙

### CRITICAL — 절대 위반 금지

- **CRITICAL**: 1단계는 **`@wonik/tokens` + `@wonik/web` 두 패키지만**. `packages/app/`·`packages/warp/`·`packages/{기타}/`를 만들지 마라. `WONIK IPS — WARP Design System/` 폴더의 컴포넌트(.jsx/.tsx)를 import 금지 — reference로만 본다.
- **CRITICAL**: 색·spacing·typography·border·radius 같은 raw 값을 컴포넌트 코드에 하드코딩 금지. 모두 `@wonik/tokens`에서 import해 사용한다 (예: `import { colors } from '@wonik/tokens'` 또는 CSS 변수 `var(--color-primary)`). hex/px 리터럴이 보이면 토큰화 대상.
- **CRITICAL**: 컴포넌트 패키지는 `@wonik/tokens`만을 의존성으로 가진다. 향후 다른 컴포넌트 패키지가 추가되더라도 동일한 원칙(공통 base만 의존, 컴포넌트 패키지끼리 import 금지).
- **CRITICAL**: Primary color는 **WONIK BLUE `#273E82`** (공식 CI, ADR-007). 다른 hex(`#2B7FFF`, `#273D7F` 등)로 사용 금지. Secondary는 **WONIK GRAY `#ACACAC`**.
- **CRITICAL**: 컴포넌트는 stateless 우선. 글로벌 state 라이브러리(Zustand/Redux/MobX/Jotai) 의존 금지 — consumer가 자유롭게 선택해야 한다. controlled + uncontrolled 패턴은 React 표준대로 둘 다 지원한다.
- **CRITICAL**: 토큰 추가·이름 변경·삭제는 반드시 ADR 작성 + Changesets minor 이상 bump. patch로 처리 금지. 컴포넌트 prop signature 변경(이름·타입·필수 여부)은 major bump.
- **CRITICAL**: 컴포넌트 코드에서 React 19-only API(`useFormStatus`/`useOptimistic`/`use()`/React Compiler 자동 메모 등) 사용 금지. peer는 `^18 || ^19` dual이므로 18에서도 import해 작동해야 한다 (ADR-008). 18·19 공통 API(`useState`/`useEffect`/`useRef`/`useMemo`/`useCallback` 등)만 사용.

### 일반 규칙

- 새 컴포넌트는 `packages/web/src/{ComponentName}/` 폴더 안에 다음 구조로 둔다 (1단계는 web만):
  - `index.tsx` — 컴포넌트 + types export
  - `{ComponentName}.test.tsx` — 기본 동작 테스트
  - (선택) `{ComponentName}.stories.tsx` — Storybook 도입 후
- 컴포넌트 폴더 외부에 helper 함수를 만들지 않는다. 공통 helper는 `packages/{warp|web}/src/utils/`에 둔다.
- 토큰은 `packages/tokens/src/{colors|typography|spacing|status}.ts`로 분리하고, 각 파일이 named export를 한다.
- 빌드 산출물은 `dist/`로 통일. ESM + CJS 양쪽 지원.
- import path는 패키지 root에서만 (deep import 금지: `import { Button } from '@wonik/web'`만 허용, `'@wonik/web/dist/Button'` 금지).
- 1단계는 ppt 환경(React 19 + Vite + TypeScript 5.7 + Tailwind v4)을 model로 한 `apps/web-sandbox/`에서 시각 검증한다 (별도 npm install 없이 workspace link 사용).

## 개발 프로세스

- **CRITICAL**: 새 기능 구현 시 반드시 테스트를 먼저 작성하고, 테스트가 통과하는 구현을 작성할 것 (TDD).
- **CRITICAL**: AI 슬롭 anti-pattern (UI_GUIDE.md 참조) 절대 도입 금지 — 글래스모피즘(`backdrop-filter: blur`), gradient text, box-shadow glow 애니메이션, 모든 카드에 `rounded-2xl` 일괄 적용, decorative emoji, 보라/인디고 brand color, 배경 gradient orb, Lottie 자동 재생 일러스트 등.
- 커밋 메시지는 conventional commits 형식: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`, `test:`.
- 토큰·컴포넌트 변경 시 Changesets 항목을 동시 추가 (`pnpm changeset`).
- 첫 dogfood 검증: 모든 `@wonik/web` 컴포넌트는 ppt(`C:\Users\ohjih\ppt`, React 19 + Vite + TS 5.7 + Tailwind v4) 환경에서 import해 동작해야 한다. 검증 안 되면 publish 금지.

## 명령어

```bash
# 의존성
pnpm install

# 빌드 (1단계 — tokens + web만)
pnpm build                      # 전체
pnpm -F @wonik/tokens build     # tokens만
pnpm -F @wonik/web build        # web만

# 테스트
pnpm test                       # 전체
pnpm -F @wonik/web test         # web만
pnpm -F @wonik/web test --watch # watch 모드

# 시각 sandbox (1단계 검증용)
pnpm -F web-sandbox dev         # 컴포넌트 시각 검증 dev server

# 린트
pnpm lint
pnpm lint --fix

# 변경 기록 + 발행
pnpm changeset                  # 변경 항목 추가
pnpm version-packages           # 버전 bump
pnpm publish-packages           # 사내 npm 발행 (구성 후)

# Harness 실행
python3 scripts/execute.py {task-name}        # 순차 실행
python3 scripts/execute.py {task-name} --push # 실행 후 push
```

## 범위 외 (참조: PRD.md "MVP 제외 사항")

- 모바일 앱·HMI 등 web 외 form factor용 컴포넌트 — 진짜 product 등장 시 그때 형태 결정 (ADR-001).
- WARP 시안 폴더의 컴포넌트 production화 — 진짜 HMI product 등장 시 (ADR-004). 1단계는 시안에서 토큰·시각 언어만 추출.
- 토스급 150+ 컴포넌트, Figma 자동 동기화, Code Connect 자동화 — 1단계 외.
- Vue/Angular/Svelte 지원 — React 전용.
- 다크 모드, 모바일 반응형 — 1단계 외 (ADR-005).
