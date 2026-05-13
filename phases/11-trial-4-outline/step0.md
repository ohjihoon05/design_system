# Step 0 — 사전 준비 + fixture 결정

## 읽어야 할 파일

- `phases/11-trial-4-outline/spec.md` (목표·범위·결승선)
- `phases/11-trial-4-outline/plan.md` §3 (의존성), §4.3 (fixture 정책)
- `docs/dogfood-trial-3.md` (Trial 3 절차 답습 + 차이점 식별)
- `C:/Users/ohjih/ppt/frontend/src/pages/Outline.tsx`, `components/OutlineCard.tsx` (현재 상태)
- `C:/Users/ohjih/ppt/frontend/src/index.css` (host CSS variable 정의 — ADR-010 cascade 입력)
- `C:/Users/ohjih/ppt/frontend/src/stores/presentationStore.ts` (fixture 주입 후보 location)

## 작업

### 0.1 design_system 빌드 + tgz pack

```powershell
pnpm -F @wonik/tokens build
pnpm -F @wonik/web build
pnpm -F @wonik/tokens pack --pack-destination ./pkg-out
pnpm -F @wonik/web pack --pack-destination ./pkg-out
```

새 timestamp의 `pkg-out/wonik-tokens-*.tgz`, `wonik-web-*.tgz` 가 생성되어야 함.

### 0.2 ppt 측 reinstall

```powershell
pnpm --dir C:/Users/ohjih/ppt/frontend install --force
```

`ppt/frontend/package.json`의 `pnpm.overrides`에 `@wonik/tokens`/`@wonik/web` file: 매핑이 이미 있어야 함 (Trial 1~3에서 wired up). 없으면 추가.

### 0.3 ppt branch 생성

```powershell
cd C:/Users/ohjih/ppt
git status                         # clean 확인
git checkout -b trial-4-outline    # 또는 git switch -c
```

이미 `trial-4-outline` 브랜치가 있으면 checkout만. 다른 trial 브랜치(`trial-3-textarea`)와 헷갈리지 말 것.

### 0.4 fixture 방식 결정

두 옵션 중 1순위 가능성 먼저 시도:

**1순위 (zero-mock)**: ppt 백엔드를 띄워 진짜 outline 1개 생성. 슬라이드 제목만 더미("AI 트렌드"/"도입 사례"/"결론")로 바꿈.
- 시도 절차: `cd C:/Users/ohjih/ppt && pnpm dev` → Home → prompt 입력 → outline 생성 대기 → DB 또는 store에서 제목 교체.

**2순위 (store seed)**: `usePresentationStore` 직접 setState. backend 우회.
- `presentationStore.ts`에 임시 export `__seedDummy()` 또는 dev 시 main.tsx에서 1회 setState.

선택을 step0.md 끝에 1줄 추가:

```markdown
## fixture 결정 결과
- 선택: 1순위 (zero-mock) / 2순위 (store seed)
- 사유: [실제 backend 가용 여부]
```

### 0.5 ppt 환경 sanity 체크

```powershell
pnpm --dir C:/Users/ohjih/ppt/frontend exec tsc --noEmit       # 0 errors
```

## Acceptance Criteria

```bash
# pkg-out tgz 존재
test -f pkg-out/wonik-tokens-0.0.0.tgz
test -f pkg-out/wonik-web-0.0.0.tgz

# ppt branch
test "$(git -C C:/Users/ohjih/ppt branch --show-current)" = "trial-4-outline"

# tsc clean
cd C:/Users/ohjih/ppt/frontend && pnpm exec tsc --noEmit       # 0 errors

# fixture 결정 명시
grep -E "선택: (1순위|2순위)" phases/11-trial-4-outline/step0.md
```

## 보안 체크

- ppt main 위 직접 작업 0 (반드시 trial-4-outline branch)
- 더미 outline 텍스트 사전 검증: 회사명·실고객명·실프로젝트명 0

## 금지사항

- design_system 코드 변경 0 (이번 step은 빌드·pack·환경 준비만)
- ppt 측 `--color-*` 변수 정의 변경 0
- `tokens.css` import 0
- React 19-only API 사용 0

## 검증 절차

1. AC 명령 모두 통과
2. fixture 결정이 1순위 / 2순위 중 명시됐는지 확인
3. `index.json`의 step 0 → `"status": "completed"`, summary 1줄 (예: "빌드+pack+ppt link 확인. trial-4-outline branch on. fixture: 2순위 store seed (backend 미가용).")

## fixture 결정 결과 (Step 0.4 실행 결과)

- 선택: **2순위 (store seed)**
- 사유: ppt에 backend·docker-compose 있어 zero-mock 가능하지만, trial의 본질은 시각 검증(ADR-010 cascade는 view layer에서 작동, data layer 무관). backend 부팅 + LLM 호출 1~2분 + DB 직접 수정 비용이 store seed `setState` 1줄 대비 trial 핵심 가치 추가 0. CLAUDE.md "필요 없는 일 만들지 마라" 원칙과 정합.
- 더미 outline 3개 (캡쳐 evidence): "AI 트렌드 — 2026 시장 변화" / "도입 사례 — 제조업" / "결론 — 도입 로드맵". 회사명·실고객명·실프로젝트명 0.
