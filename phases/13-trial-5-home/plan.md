# Phase 13 — Trial 5 (plan.md)

> autopilot PHASE 3 (PLAN) 산출물. spec.md의 결승선을 어떻게 만족시킬지 — 도구·순서·아키텍처 근거·리스크.

## 1. 접근 방식 (전체 그림)

Trial 4와 동일 사이클, 대상 페이지만 교체:

```
[1] design_system 빌드 + pack (Trial 4 직후 상태 그대로면 skip 가능)
       ↓
[2] ppt 측 reinstall — Trial 4 lockfile 변경 stash → trial-5-home branch 분기
       ↓
[3] ppt Home.tsx 8개 부위 교체 (spec §3 매핑) — 별도 branch trial-5-home
       ↓
[4] dev fixture 주입 (선택 — PDF mock 상태용) → headless Chrome 캡쳐
       ↓
[5] 캡쳐 보고 H2/H3/H4 검증 → docs/dogfood-trial-5.md
       ↓
[6] phase index.json 업데이트 (12 누락 + 13 추가) + 후속 needs 우선순위 정리
```

본 phase의 "구현"은 **ppt 측에서 일어남**. design_system repo는 phase 문서 + trial 결과 문서 + index 보정만 변경.

## 2. 기술 선택 근거

### 2.1 dogfood 사이클을 한 번 더 도는 이유 (vs IconButton/Badge 바로 만들기)

- **Trial 4가 자체 결론에서 "Card 도입 후 needs 누적 확인"을 권고함**. 권고를 무시하고 컴포넌트 추가로 건너뛰면 design system 개발 프로세스 자체의 신뢰성이 깨짐.
- **단일 페이지(Outline) 기반 needs ranking은 page-local일 위험**. IconButton needs는 Trial 4에서 mid였지만, Home은 icon-only가 거의 없음 — 만약 Trial 5에서도 IconButton evidence가 0이면 needs는 *Outline-local*임이 정직히 드러남.
- **form-heavy 페이지에서만 부상하는 needs(Textarea cascade, ToggleGroup, Select)가 있을 가능성** — Trial 4는 list 페이지만 봤기에 측정 못 함.

### 2.2 Home 페이지를 고른 이유 (vs Presentation/History)

- 사용자 선택: Trial 5 후보 4개 중 Home (수익 진입점, 컴포넌트 다양성 ↑).
- **컴포넌트 다양성 ↑**: textarea + button + drop zone + slider + select + pill group + alert = 8종이 한 페이지에 동시 깔림 — H2 cascade를 다양한 component 조합에서 측정 가능.
- **predictable behavior**: backend 의존 없이 폼 상태만 렌더 가능 (submit 트리거 X) — 캡쳐 reproducible.

### 2.3 별도 branch(`trial-5-home`)로 ppt 작업 — 답습

Trial 4와 동일. ppt main에 시각 회귀 0. merge 결정은 trial 종료 후 사용자 영역.

### 2.4 fixture 방식 (PDF mock state)

C2 결정: dev-only `import.meta.env.DEV` 가드 + URL query(`?fixture=with-pdf`) 토글로 `pdfFile` state 강제 설정. 실제 PDF 바이너리 0, 외부 데이터 노출 0.

## 3. 의존성 (외부 라이브러리·서비스·환경)

- **외부 라이브러리** (이미 존재, 새로 추가 0):
  - `react@^19`, `react-dom@^19` (ppt + design_system 공통)
  - `@wonik/web@workspace`, `@wonik/tokens@workspace`
  - `vite`, `tailwindcss@v4`, `typescript@5.7` (ppt 스택)
  - `vitest@^2`, `@testing-library/react` (회귀 테스트)
- **외부 서비스/도구**:
  - **Headless Chrome**: Trial 1~4 검증된 명령 패턴.
  - **ppt backend**: Home submit에 필요하지만 본 trial은 **사용 X** (C2·C4).
  - **pnpm workspace + file: protocol**: Trial 3·4 답습.
- **새로 추가하는 의존성**: 0.

## 4. 아키텍처 결정 (이 trial 안에서)

### 4.1 inline style 정책: 시각도 0 / layout 허용 — Trial 4 답습

ADR-010 cascade가 깨지는 지점을 시각도(color/border/radius/padding)에서 측정해야 H2 가설 valid. layout(width/margin/flex/display)은 컴포넌트가 페이지에 끼워지는 데 필요한 최소 hook.

### 4.2 Card에 dashed border 강제 X (C1)

dropzone에 Card 적용 → dashed가 손실되어 시각 어색하면 = "Card variant=outline w/ dashed option needs" evidence. inline `border` override는 정책 위반이므로 시도 안 함. *손실 자체가 산출물*.

### 4.3 Verbosity toggle: variant prop으로만 표현 (C3)

`variant={selected ? 'primary' : 'outline'}`. 원본 ppt는 selected = primary/15 (light) + primary-hover text. variant="primary"는 solid primary bg + 흰 text — 시각 차이 큼. 이 차이가:
- **자연**: ToggleGroup needs 약함 (Button variant 토글로 충분)
- **무거움**: ToggleGroup needs mid (selected 상태가 너무 강함 — softer toggle 필요)

어느 쪽이든 H4 evidence.

### 4.4 phase 12 index.json 누락 처리

phase 12 디렉토리는 존재(`spec/plan/tasks/step0~5/index.json`)하지만 `phases/index.json` 상위 entry에서 누락. Trial 5 closure 시점(Step 4)에 함께 보정:
- phase 12 entry 추가 (`status: "completed"`, `completed_at` = phase 12 머지 시점 = `2026-05-13T02:02:00+0900` — PR #10 머지 시각)
- phase 13 entry 추가 (Trial 5 closure 시각)

## 5. 위험 요소 (예상 리스크)

| # | 리스크 | 영향 | 완화 |
|---|--------|------|------|
| R1 | ADR-010 cascade가 *너무 잘* 작동 — H2 또 회귀 0 | trial 가치 하락 | 회귀 0도 valid — Phase 09 closure를 form 페이지에서 한 번 더 재입증한 것으로 기록 |
| R2 | ppt가 React 19-only API 사용 → 18 호환 깨짐 | 즉시 깨짐 | 신규 코드는 ADR-008 공통 API만. Home.tsx에 R19-only 자취 사전 grep |
| R3 | Textarea 교체 시 ppt 원본 `maxLength`·`onChange`·`required`·`aria-describedby` 등 native attr 통과 안 됨 | 컴파일·런타임 실패 | Textarea도 Input과 동일 native attr 통과 설계됨. step0에서 확인 |
| R4 | Card에 dashed 손실로 dropzone 시각 어색 | 사용자 시각 회귀 인지? | trial 정책상 *어색해도 OK* — evidence로 기록. main에 머지 안 함 (R0 차단) |
| R5 | Verbosity Button variant 토글이 시각 균형 깨짐 (primary가 너무 무거움) | 시각 회귀 | (R4 동일) — evidence 기록. dashed/glow/blur 같은 슬롭 추가 0 |
| R6 | Headless Chrome이 폼 mount 전 캡쳐 → 빈 화면 PNG | trial 무효 | `--virtual-time-budget=6000`, Home은 SSE 미사용이라 빠르게 안정 |
| R7 | Trial 3·4의 lockfile/branch 잔재 충돌 | install 실패 | step0에서 `git stash` + branch 정리 (Trial 4 답습) |
| R8 | ppt dev server 다중 인스턴스 | port 충돌 | step3에서 사전 `Get-Process node` 확인 + 필요 시 taskkill |
| R9 | phase 12 누락 fix가 이번 phase 범위 외처럼 보임 | scope creep | spec §3·§5(S7)에 명시 포함 — phase index 일관성은 trial closure의 일부 |
| R10 | autopilot이 강제하는 spec/plan/tasks 분할이 phases/ 관행과 어색 | 관리 혼선 | Trial 4와 동일 구조 — spec/plan/tasks 하나의 phase dir 안, step{N}.md는 tasks 풀어쓰기 |

## 6. 테스트 전략 (어떻게 검증)

### 6.1 자동 — 객관 측정

- `pnpm -F @wonik/web test`: ≥163 passing (phase 12 추가분 포함, 회귀 0). spec S6.
- `git diff packages/ apps/ CLAUDE.md docs/PRD.md docs/ARCHITECTURE.md docs/ADR.md docs/UI_GUIDE.md | wc -l == 0`. spec S1.
- `test -f` 캡쳐 파일 존재. spec S2.
- `grep -E "H2|H3|H4|발견|Phase 14|needs|후보" docs/dogfood-trial-5.md`. spec S3·S4.
- `! grep -i -E "glassmorphism|gradient orb|lottie|backdrop-filter: blur"`. spec S5.
- `grep -q "12-card"·"13-trial-5-home" phases/index.json`. spec S7.

### 6.2 시각 — AI가 PNG 직접 분석

- `pkg-out/trial-5-home-default.png`을 Read tool로 읽고 spec §6 매트릭스 8행을 채움.
- 가능하면 `trial-5-home-with-pdf.png`도 캡쳐 + 분석 (best-effort, C4).
- spec S8·S9·S10 정성 기준 판정.

### 6.3 정성

- 매트릭스 결론으로 H2/H3/H4 각각 1문장 결론.
- Phase 14 후보 needs 우선순위 1·2·3 명시 (Trial 4 + Trial 5 누적).

### 6.4 회귀 검증 (trial 후)

- ppt main에 머지 안 함 (spec §7). main에 영향 0.
- design_system 코드 변경 0이라 sandbox·다른 phase에 영향 0.

## 7. 단계 분할 (tasks.md로 풀어쓸 단위)

5단계로 분할:

- **Step 0**: 사전 준비 — design_system 빌드+pack(필요 시), ppt link 확인, trial-5-home branch 분기, fixture 결정 확정
- **Step 1**: Home.tsx 교체 — Textarea + AI 다듬기 Button + PDF 영역 (3·4번 매핑)
- **Step 2**: Home.tsx 교체 (계속) — Verbosity Button variant 토글 (7번 매핑). slideCount badge·Select·Alert는 그대로 유지하되 *왜 안 바꾸는지* step2.md에 명시
- **Step 3**: fixture 주입(필요 시) + 캡쳐 + AI 시각 분석 + 매트릭스 채움
- **Step 4**: docs/dogfood-trial-5.md 작성 + phases/index.json 보정(12 + 13) + phase 닫기

## 8. 산출물 (phase 종료 시 존재)

design_system repo (commit):
- `phases/13-trial-5-home/spec.md`, `plan.md`, `tasks.md`, `step0.md` ~ `step4.md`, `index.json`
- `docs/dogfood-trial-5.md`
- `pkg-out/trial-5-home-default.png` (+ `trial-5-home-with-pdf.png` best-effort)
- `phases/index.json` 보정 (phase 12 + 13 entry)

ppt repo (별도 branch, *non-merging*):
- `trial-5-home` branch에 컴포넌트 교체 commit
- 사용자가 따로 결정하기 전까지 main에 영향 0

## 9. 후속 phase 후보 (이번 phase 종료 후 예측)

trial 결과로 부상할 가능성 (Trial 4 + Trial 5 누적):
- **우선순위 1 (강한 needs, 4회+ 누적)**: 
  - Badge (Trial 4 3회 + Home 1회 = 4회) — 거의 확정
  - Alert/Banner (Trial 4 inconclusive + Home 1회 = evidence 시작 — Trial 6에서 확정 여부 결정)
- **우선순위 2 (mid needs)**:
  - IconButton — Trial 4 evidence만, Home에서 누적 안 됨 → Outline-local일 가능성 격하
  - ToggleGroup/SegmentedControl — Home 1회 (Verbosity), 신규 발견 → Trial 6+ 누적 후 결정
  - "Card variant=outline w/ dashed" — Home 1회 (dropzone) — 약함
- **우선순위 3 (보류)**:
  - Select wrapper — Home 1회만 — YAGNI
  - EmptyState — Trial 4 1회만 — YAGNI

각 needs는 별도 phase에서 ADR + spec + 구현 사이클로 들어간다.
