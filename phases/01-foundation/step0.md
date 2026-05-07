# Step 0: monorepo-setup

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 아키텍처와 설계 의도를 파악하라:

- `/CLAUDE.md` (프로젝트 가드레일)
- `/docs/ARCHITECTURE.md` (모노레포 디렉토리 구조 명세)
- `/docs/ADR.md` (특히 ADR-001 모노레포 아키텍처, ADR-002 stack)

이전 step 없음 (첫 step).

## 작업

`design_system/` 루트에 pnpm workspaces 기반 모노레포 인프라를 셋업한다. 이 step은 빈 골격을 만드는 단계로, 실제 토큰·컴포넌트 코드는 다음 step에서 채운다.

### 1. `pnpm-workspace.yaml` 생성

```yaml
packages:
  - "packages/*"
  - "apps/*"
```

### 2. Root `package.json` 생성

다음 시그니처를 따른다:

```json
{
  "name": "wonik-design-system",
  "private": true,
  "version": "0.0.0",
  "scripts": {
    "build": "pnpm -r build",
    "test": "pnpm -r test",
    "lint": "pnpm -r lint",
    "changeset": "changeset",
    "version-packages": "changeset version",
    "publish-packages": "pnpm build && changeset publish"
  },
  "devDependencies": {
    "@changesets/cli": "^2.27.0",
    "typescript": "^5.7.0"
  },
  "packageManager": "pnpm@9.0.0"
}
```

정확한 버전은 latest stable로 보정 가능. `packageManager` 필드는 반드시 포함 (pnpm 강제).

### 3. `tsconfig.base.json` 생성

모든 패키지가 `extends`로 사용할 공통 TypeScript strict 설정. 다음 옵션 포함:
- `"strict": true`
- `"target": "ES2020"`
- `"module": "ESNext"`
- `"moduleResolution": "bundler"`
- `"jsx": "react-jsx"`
- `"declaration": true`
- `"esModuleInterop": true`
- `"skipLibCheck": true`
- `"forceConsistentCasingInFileNames": true`

### 4. `.gitignore` 업데이트

기존 `.gitignore`에 다음 추가:

```
# Build outputs
dist/
*.tsbuildinfo

# pnpm
node_modules/
.pnpm-store/

# Turbo cache
.turbo/

# Env
.env
.env.local
```

### 5. `.npmrc` 생성

```
auto-install-peers=true
strict-peer-dependencies=false
```

이유: React 19 peer dependency 처리 + 모노레포 내부 의존성 호이스팅 단순화.

### 6. 패키지 디렉토리 골격 (1단계 — tokens + web만)

다음 디렉토리와 placeholder `package.json`만 생성. `src/` 안 코드는 비워둔다 (다음 step의 일).

```
packages/
├── tokens/
│   └── package.json
└── web/
    └── package.json
```

**중요**: `packages/warp/`, `packages/app/`, 기타 form factor 패키지를 1단계에서 만들지 않는다 (ADR-001). 진짜 product 등장 시 그때 결정.

각 placeholder `package.json`은 다음 시그니처:

- `name`: `@wonik/tokens` / `@wonik/web`
- `version`: `0.0.0`
- `private`: `true` (사내 npm 발행 인프라 셋업 전까지)
- `type`: `"module"`
- `main`/`module`/`types`: `dist/index.js` / `dist/index.mjs` / `dist/index.d.ts` (빌드 산출물 경로 — 실제 산출물은 다음 step)
- `scripts.build`: `"echo 'build placeholder'"` (다음 step에서 실제 빌드로 교체)
- `dependencies`: `@wonik/web`만 `"@wonik/tokens": "workspace:*"` 추가. `@wonik/tokens`은 의존 없음.

### 7. Changesets 초기화

`pnpm install` 후 `pnpm changeset init`을 실행해 `.changeset/` 디렉토리를 생성한다. 발행 모드는 사내 환경이므로 `.changeset/config.json`의 `access`를 `"restricted"`로 설정.

## Acceptance Criteria

```bash
cd C:/Users/ohjih/design_system
pnpm install
pnpm -r --filter "./packages/*" build
ls packages/tokens packages/web
# packages/warp는 1단계에서 만들지 않으므로 존재해서는 안 된다
! test -d packages/warp
test -f .changeset/config.json
```

위 명령이 모두 에러 없이 통과해야 한다.

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 아키텍처 체크리스트:
   - `docs/ARCHITECTURE.md` 디렉토리 구조와 일치하는가? (packages/{tokens,web} + apps/ + docs/, warp는 1단계 외)
   - `docs/ADR.md` ADR-002 stack에서 벗어나지 않았는가? (pnpm + TypeScript + React)
   - `/CLAUDE.md` CRITICAL 규칙: 1단계는 `@wonik/tokens` + `@wonik/web` 두 패키지만. 다른 form factor 패키지는 만들지 않는다 (ADR-001).
3. 결과에 따라 `phases/01-foundation/index.json`의 step 0를 업데이트:
   - 성공 → `"status": "completed"`, `"summary": "pnpm 워크스페이스 + 3개 placeholder 패키지 + Changesets 초기화 완료. 다음 step에서 packages/tokens 실제 토큰 작성."`
   - 실패 (3회 재시도 후) → `"status": "error"`, `"error_message": "구체적 실패 사유"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체 사유"`

## 금지사항

- **워크스페이스 외부에서 `npm install` 또는 `yarn` 사용 금지.** 이유: lockfile이 분산되면 모노레포 의존성 추적이 깨진다. pnpm만 사용한다.
- **개별 패키지 안에 `package-lock.json`이나 `yarn.lock` 생성 금지.** 이유: 모노레포는 root 한 곳에만 `pnpm-lock.yaml`이 존재한다.
- **이번 step에서 `src/` 안에 코드 작성 금지.** 이유: 토큰 정의는 step 1, 컴포넌트 마이그레이션은 step 2의 일이다. 이 step은 인프라 셋업만.
- **WONIK IPS — WARP Design System/ 폴더를 건드리지 마라.** 이유: 이 폴더는 HMI 시안(reference)이며 1단계에서 production화하지 않는다 (ADR-004).
- **`packages/{tokens, web}` 외 다른 패키지 디렉토리를 만들지 마라.** 이유: 1단계는 tokens + web만. 다른 form factor 패키지는 진짜 product 등장 시 결정 (ADR-001).
- **기존 `docs/`, `CLAUDE.md`, `scripts/execute.py`를 수정하지 마라.** 이유: 이미 작성된 가드레일·실행 스크립트는 변경 대상이 아니다.
