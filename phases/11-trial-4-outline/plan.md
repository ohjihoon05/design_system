# Phase 11 — Trial 4 (plan.md)

> autopilot PHASE 3 (PLAN) 산출물. spec.md의 결승선을 어떻게 만족시킬지 — 도구·순서·아키텍처 근거·리스크.

## 1. 접근 방식 (전체 그림)

Trial 1·2·3와 동일한 dogfood 사이클을 답습:

```
[1] design_system 빌드 + pack
       ↓
[2] ppt 측 reinstall (pkg-out tgz)
       ↓
[3] ppt Outline.tsx + OutlineCard.tsx 컴포넌트 교체 (별도 branch trial-4-outline)
       ↓
[4] 더미 outline seed로 ppt 실행 → headless Chrome 캡쳐
       ↓
[5] 캡쳐 보고 H2/H3 검증 → docs/dogfood-trial-4.md
       ↓
[6] phase index.json 업데이트 + 후속 needs 우선순위 정리
```

본 phase의 "구현"은 **ppt 측에서 일어남**. design_system repo는 spec/plan/tasks/step 문서 + trial 결과 문서만 변경 (spec §4 in-scope 그대로).

## 2. 기술 선택 근거 (왜 이 도구·이 순서)

### 2.1 dogfood 사이클을 또 도는 이유 (vs 우리가 컴포넌트 추가부터 만들기)

- **검증 안 한 채 컴포넌트를 만들면 over-engineering 위험**: Card·Alert·IconButton·Badge·EmptyState 5개 모두를 우리가 *추정*해서 만들면 실제 needs와 다른 모양으로 빠질 가능성. CLAUDE.md "dogfood needs로 부상해야 추가" 원칙.
- **H2(시각 일관성)는 *합쳐 깔지 않으면* 측정 불가**: 컴포넌트 1개씩 sandbox로 보면 항상 예쁨. 한 페이지에 3종이 동시에 있어야 회귀가 보인다.
- **dogfood가 가장 빠른 needs ranking**: 5개 후보의 우선순위는 토론보다 *반복 횟수*로 결정하는 게 정직. Outline 페이지에서 Card는 4회 반복, Badge는 1회 — 데이터가 답.

### 2.2 ppt를 본진으로 쓰는 이유 (vs 다른 사내 product)

- 사내 product 중 우리가 *직접 빌드/실행* 가능한 게 ppt 하나 (`C:/Users/ohjih/ppt`). Trial 1·2·3 모두 ppt에서 진행 — 환경 일관성. 다른 product는 미래 trial(5+)에서.

### 2.3 별도 branch(`trial-4-outline`)로 ppt 작업하는 이유

- ppt main에 trial 결과를 직접 푸시하면 trial이 실패했을 때 ppt 사용자가 시각 회귀를 받음. branch로 격리하면 trial이 *발견*에 그치고 사용자에게 영향 0.
- merge 결정은 trial 완료 후 사용자 영역(spec §4 + Trial 3 패턴 동일).

### 2.4 더미 outline 3개 fixture를 만드는 이유 (vs 실데이터)

- 캡쳐 PNG가 commit·repo에 들어감. 실데이터(사용자가 만든 outline 제목/내용)가 들어가면 정보 노출. 더미는 공개 가능.
- ADR-010 cascade·시각 일관성 검증에는 outline 내용 자체가 중요하지 않음. 길이만 비슷하면 시각 회귀 측정 가능.
- fixture는 ppt 측 임시 mock(예: store seed, 또는 ppt API mock)으로 주입. ppt 코드 핵심 로직은 변경 0.

## 3. 의존성 (외부 라이브러리·서비스·환경)

- **외부 라이브러리** (이미 존재, 새로 추가 0):
  - `react@^19`, `react-dom@^19` (ppt + design_system 공통)
  - `@wonik/web@workspace`, `@wonik/tokens@workspace`
  - `vite`, `tailwindcss@v4`, `typescript@5.7` (ppt 기본 스택)
  - `vitest@^2`, `@testing-library/react` (회귀 테스트)
- **외부 서비스 / 도구**:
  - **Headless Chrome**: `C:/Program Files/Google/Chrome/Application/chrome.exe --headless=new --disable-gpu --screenshot=...`. Trial 1·2·3에서 검증됨.
  - **ppt backend**: Outline 페이지가 SSE로 backend에서 데이터 받음. 더미 fixture 주입 시 backend 우회 가능 (캡쳐 정직성을 위해 *가능하면* 실 backend 사용, 안 되면 store 직접 seed).
  - **pnpm workspace + file: protocol**: design_system pkg를 ppt에 link. Trial 3 절차 답습.
- **새로 추가하는 의존성**: 없음.

## 4. 아키텍처 결정 (이 trial 안에서)

### 4.1 inline style 정책: 시각도 0 / layout 허용

- **이유**: ADR-010 cascade가 깨지는 지점을 시각도(color/border/radius/padding)에서 측정해야 H2 가설이 valid. layout(width/margin/flex)을 막으면 컴포넌트가 페이지에 끼워지지도 못해 trial이 시작도 안 됨.
- **운용**: Button은 `<Button>`만 쓰고 `style={{...}}` 추가 0. 단 `<div className="shrink-0 flex flex-col gap-1">` 같은 부모 layout className은 그대로 유지.

### 4.2 icon-only button: 교체 시도 → 실패 시 needs

- **이유**: 우리 Button에 icon-only mode가 없는지를 *추측*보다 *시도*로 판정. trial이 끝났을 때 둘 중 하나의 evidence가 남음 (① "size='sm'으로도 자연스러움 = needs 약함" ② "어색 = IconButton 강한 needs").
- **운용**: `<Button size="sm" aria-label="위로 이동">` + `<svg>` children. 캡쳐 보고 판정.

### 4.3 ppt fixture 주입 방식

- **1순위 (zero-mock)**: 실 backend로 진짜 outline 1개 생성, 그 outline의 슬라이드 제목만 더미("AI 트렌드"/"도입 사례"/"결론")로 교체. 가장 정직.
- **2순위 (store seed)**: `usePresentationStore` 직접 setState로 더미 outline 주입. backend 우회. 빠름.
- 실 backend가 트리거 가능하면 1순위, 안 되면 2순위.

## 5. 위험 요소 (예상 리스크)

| # | 리스크 | 영향 | 완화 |
|---|--------|------|------|
| R1 | ADR-010 cascade가 *너무 잘* 작동해서 회귀 0이 나옴 — H2 가설이 입증도 반증도 안 됨 | trial 가치 하락 | 캡쳐 비교를 ppt 기존 button과 *나란히* 두기. "회귀 0"도 valid 결과 — Phase 09 closure를 한 번 더 입증한 것으로 기록 |
| R2 | ppt가 React 19-only API를 쓰고 있어 우리 컴포넌트가 18 호환 안 됨 (ADR-008 위반) | 즉시 깨짐 | spec §4 명시. 컴포넌트는 18·19 공통 API만 쓰는지 사전 확인 |
| R3 | OutlineCard 인라인 편집 input이 우리 Input에 없는 prop(autoFocus, onBlur, onKeyDown) 사용 | 컴파일·런타임 실패 | Input은 native input attribute 다 통과시키도록 설계됨. 사전 grep으로 확인 |
| R4 | icon-only Button 교체 결과가 모호해서 needs 판정 못함 | H3 결정 흐려짐 | 캡쳐 + 정성 표 7항목으로 강제 판정 (spec §6) |
| R5 | ppt 측 fixture 주입이 backend 의존이라 자동 reproduce 어려움 | 회귀 검증 어려움 | step에 fixture 주입 절차를 *명시적으로 기록*. 다음 trial이 재현 가능하도록 |
| R6 | Headless Chrome이 SSE로 도착 전 캡쳐 → 빈 화면 PNG | trial 무효 | `--virtual-time-budget=8000` 옵션 추가, 또는 fixture로 SSE 우회 |
| R7 | Trial 3 패턴 답습 중 *놓친* 차이점이 있어 결과 비교 불가 | 분석 노이즈 | step 0에 Trial 3 절차와 다른 점만 diff로 명시 |
| R8 | autopilot이 강제하는 spec/plan/tasks 분할이 phases/ 관행과 어색하게 공존 | 관리 혼선 | spec/plan/tasks는 phases/11-*/ 안에 두고, step{N}.md는 tasks를 풀어 쓴 형태로 (하나의 디렉토리, 두 layer) |

## 6. 테스트 전략 (어떻게 검증)

### 6.1 자동 — 객관 측정

- `pnpm -F @wonik/web test`: 163 passing 유지 (회귀 0). spec S6.
- `git diff packages/ apps/ CLAUDE.md docs/PRD.md docs/ARCHITECTURE.md docs/ADR.md docs/UI_GUIDE.md | wc -l == 0`. spec S1.
- `test -f` 캡쳐 파일 존재. spec S2.
- `grep -E "H2|H3|발견|Phase 12|needs|후보" docs/dogfood-trial-4.md`. spec S3·S4.
- `! grep -i -E "glassmorphism|gradient orb|lottie|backdrop-filter: blur"`. spec S5.

### 6.2 시각 — AI가 PNG 직접 분석

- `pkg-out/trial-4-outline-loading.png`, `trial-4-outline-edit.png`를 Read tool로 읽어 시각 분석.
- spec §6 매트릭스 8항목을 표 형태로 채워 dogfood-trial-4.md에 삽입.
- spec S7·S8·S9 정성 기준 판정.

### 6.3 정성 — 사용자 협업

- 캡쳐와 매트릭스 본 후 사용자가 "needs 우선순위 1·2·3" 최종 결정에 동의/수정. trial closure 전 사용자 confirm.

### 6.4 회귀 검증 (trial 후)

- ppt main에 머지 안 함 (spec §7). main에 영향 0.
- design_system 코드 변경 0이라 다른 phase·sandbox에 영향 0.

## 7. 단계 분할 (tasks.md로 풀어쓸 단위)

5단계로 분할 예정 (자세한 task 목록은 tasks.md):

- **Step 0**: 사전 준비 — design_system 빌드+pack, ppt link 확인, fixture 결정 (1순위 zero-mock 가능 여부 판정)
- **Step 1**: ppt 컴포넌트 교체 (Outline.tsx Spinner·일반 Button) — 시각도 inline style 0
- **Step 2**: ppt 컴포넌트 교체 (OutlineCard.tsx Input·icon-only Button) — H3 icon-only 결정
- **Step 3**: 캡쳐 (loading + edit) + AI 시각 분석 + 매트릭스 채움
- **Step 4**: docs/dogfood-trial-4.md 작성 + needs 우선순위 → phase index 닫기

## 8. 산출물 (phase 종료 시 존재)

design_system repo (commit):
- `phases/11-trial-4-outline/spec.md`, `plan.md`, `tasks.md`, `step0.md` ~ `step4.md`, `index.json`
- `docs/dogfood-trial-4.md`
- `pkg-out/trial-4-outline-loading.png`, `trial-4-outline-edit.png`

ppt repo (별도 branch, *non-merging*):
- `trial-4-outline` branch에 컴포넌트 교체 commit
- 사용자가 따로 결정하기 전까지 main에 영향 0

## 9. 후속 phase 후보 (이번 phase 종료 후)

trial 결과로 부상할 가능성 있는 phase 12+ 후보:
- 강한 needs (caps 4회 반복): **Card** 컴포넌트 추가 phase
- 중간 needs (예상): **IconButton** 또는 **Alert/Banner** 추가 phase
- 약한 needs: **Badge/EmptyState** — 다음 dogfood까지 보류 (YAGNI)
- 보너스: hover token (`--color-surface-hover`/`--color-primary-hover`)을 ADR-010 interface variable로 격상할지 결정 phase
