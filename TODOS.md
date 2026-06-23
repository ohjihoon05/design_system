# TODOS

Post-audit + ADR-027 burndown. 우선순위순.

## [a11y-gate-backlog] — Storybook addon-a11y `test: 'todo'` 표시된 항목 (ADR-027 cycle 잔여)

19개 a11y violation이 9개 story 파일에서 발견됨 (Storybook addon-a11y 첫 가동 시점, 2026-05-26). 모두 `parameters: { a11y: { test: 'todo' } }`로 sealed → 새 violation만 gate가 막음, 옛 backlog는 천천히 갚음.

### 파일별 burndown

> **burndown 진행 (design-review 2026-06-18)**: 19개 중 **17개 수정·검증 완료** (`pnpm test:a11y` 126/126 green). 실제 위반 분포는 추정과 달랐음 — 다수가 **컨트롤 accessible-name 누락**(라벨), 4개가 **장식 텍스트 opacity 대비**. 토큰 변경 0건(전부 story-level). 남은 2개는 owner/runtime 게이트.

- [x] `action-Button.stories.tsx` — 1 (`Variants`): ✅ axe runtime 확인 — 5개 variant 라벨 전부 통과, **un-seal 완료, green**.
- [x] `display-ProgressBar.stories.tsx` — 4: ✅ `aria-label` 추가(progressbar name), un-seal, green
- [x] `input-Checkbox.stories.tsx` — 2: ✅ `aria-label` + Basic story `id`/`htmlFor`(jsx-a11y disable 제거), un-seal, green
- [ ] `input-InlineEditableText.stories.tsx` — 2: Realistic Outline Card ✅(opacity→`--color-text-dim`) + 나머지 5 story **un-seal 완료**. **`As Heading`만 narrow seal**: axe `aria-allowed-role`(best-practice, minor) — `role="button"` on `<h2>`가 heading 의미 파괴. **컴포넌트 contract 변경(owner/ADR) 필요** — 권장: `<h2><button>…</button></h2>` 또는 as=heading+editable 조합 prop 차단.
- [x] `input-Input.stories.tsx` — 1: ✅ `aria-label`, un-seal, green
- [x] `input-Radio.stories.tsx` — 2: ✅ `aria-label`, un-seal, green
- [x] `input-Switch.stories.tsx` — 3: ✅ `aria-label`, un-seal, green
- [x] `input-Textarea.stories.tsx` — 1: ✅ `aria-label`, un-seal, green
- [x] `layout-SortableList.stories.tsx` — 3: ✅ dimmed index/id span 3개 opacity→`--color-text-dim`, un-seal, green

✅ **FilterChip/Tooltip triage 완료** (backlog가 과소 집계했던 2파일): 둘 다 **dark theme** seal(`ActiveDark`/`PlacementsDark`). 원인 = `primaryDark.base #4A65B8` border가 SC 1.4.11(3:1) 미달(2.21~2.28) = **ADR-041 §E + `PHASE2_DARK_CONTRAST_FINDINGS.md` #7**(primaryDark brand 협의 T8c 게이트). **seal 유지가 정답** — axe-core 4.11.4엔 SC 1.4.11(비텍스트/보더) rule이 없어 green이 false negative(가짜 안심 방지). owner가 primaryDark 값 정하면 un-seal.

> 🔎 **도구 한계 기록**: 현 a11y 게이트(addon-a11y + axe-core 4.11.4)는 **SC 1.4.3 텍스트 대비만** 검사, **SC 1.4.11 비텍스트/보더 대비는 rule 없음**. 보더 대비 회귀는 `scripts/contrast-audit.ts`로 별도 가드(ADR-041).

확인 방법: `pnpm -F storybook-app dev` 후 각 스토리 Accessibility 탭, 또는 `pnpm test:a11y`(vitest browser axe).

남은 파일 burndown 시 해당 `parameters: { a11y: { test: 'todo' } }` 제거 (default = `'error'`).

### Toast runtime decorator issue (a11y와 무관, 별건)

- [ ] `apps/storybook/src/stories/overlay-Toast.stories.tsx` — 4 stories가 `useToast must be used within a <ToastProvider>` 런타임 throw. `withWonikProviders` decorator가 vitest browser mode에서 적용 안 되는 듯. **vitest.config.ts test.exclude에서 일단 제외**. dev mode (storybook dev)에서는 정상 동작.

조사 거리:
1. setProjectAnnotations에 default preview export 정상 전달 확인 (현재 시도 → 효과 X)
2. storybookTest plugin이 decorator 자체적으로 로딩하는지
3. 필요 시 Toast story에 story-level decorator 추가

## [jsx-a11y-disables] — ADR-027 escape-hatch 정당화 disable 모음 (burndown 후보)

각각 `// eslint-disable-next-line jsx-a11y/<rule> -- <justification>` 패턴으로 inline-disable. 정당화 주석 필수. burndown 시점:

- [ ] `packages/web/src/Modal/Modal.tsx:158` — `no-static-element-interactions` (backdrop click). 해법: `<button>` 또는 role + role-appropriate handlers
- [ ] `packages/web/src/InlineEditableText/InlineEditableText.tsx:163` — `no-autofocus` (UX 핵심). 해법 없음. 영구 disable 적절
- [ ] `packages/web/src/Radio/Radio.tsx:67` — `role-supports-aria-props` (jsx-a11y@6.10 ARIA 1.1 stale). 해법: jsx-a11y v7 대기 또는 우리 ARIA 사용이 진짜 적법한지 재확인
- [ ] `apps/demo-fab-monitor/src/pages/EquipmentPage.tsx:97` — `label-has-associated-control` (implicit-control pattern). 해법: `htmlFor` 명시
- [ ] `apps/storybook/src/stories/input-Checkbox.stories.tsx:9` — 같음
- [ ] `apps/web-sandbox/src/App.tsx:340` — `no-autofocus` (sandbox demo). 해법 없음, 영구 disable 적절

## [ensureCssInjected-dry] — CSS 1회-주입 패턴 triplication 통합 (eng-review 2026-06-17 발견)

`ensureCssInjected`(module-scope `<style>` 1회 주입 + SSR 가드 + dedup)가 web 컴포넌트마다 재구현됨 + demo 앱에 복제본 존재. 공통 helper 1개로 통합.

> **web-internal 통합 완료 (2026-06-23)**: web 패키지 14개 아톰 triplication 제거. `pnpm -F @wonik/web test` 355 green(신규 util 3 포함) + lint clean + build green. demo 복제본 제거만 별건으로 defer(아래).

- [x] `packages/web/src/utils/ensureCssInjected.ts` 신규 — `(id: string, css: string)` 시그니처, `typeof document === 'undefined'` 가드 + `Set` dedup. `<style data-wonik-{id}="true">` 규약 보존(DOM 바이트 동일). 계약은 `ensureCssInjected.test.ts`(주입·dedup·다중 id)로 가드.
- [x] 컴포넌트 1개(Button) 먼저 migrate해 증명 → 나머지 web 아톰 일괄(13개, 정규식 변환). 14개 전부 자체 구현 삭제 후 공통 helper 호출.
- [ ] **demo 복제본 제거 — defer**: `apps/demo-fab-monitor/src/lib/injectCss.ts`를 web helper로 치환하려면 `ensureCssInjected`를 `@wonik/web` **public export**로 승격해야 함(현재 internal). demo는 발행 소비처 아니고, 그 파일은 demo 전용 `FOCUS_RING` 합성 export도 겸함 → 공개 API 확장(minor)을 단일 내부 demo 중복 제거에 쓰는 건 scope 과함(ADR-001 speculative 경계). web-publish가 이 helper를 공개하기로 결정될 때 합류.
- [x] Changesets patch 항목 (내부 리팩터, prop signature 불변) — `.changeset/dry-ensure-css-injected.md`

make-the-change-easy-then-easy-change 리팩터. **이번 컨시어지 단일-HTML 스파이크와 무관** — 스파이크는 기존 컴포넌트를 tarball로 소비할 뿐 이 패턴을 건드리지 않음(scope creep 방지로 defer).

## [devex-review 2026-06-17] — DX 리뷰 backlog (R1만 적용, R2~R6 defer)

`/plan-devex-review`가 두 개발자-대상 표면(컨시어지 단일-HTML 파이프라인 + `singlefile-gate`, `@wonik/web` 라이브러리 온보딩)을 점검. **R1(버전·atom 개수 단일화)만 적용 완료** — README/QUICKSTART/web package.json의 `v2.0.0`/`v0.3.0`/"14·23 atoms"/Table 누락/깨진 storybook 명령(`@wonik/storybook`→`storybook-app`)을 ground truth(24 atoms+ThemeProvider / 둘 다 1.0.0)로 정합화. 아래는 의도적으로 defer한 나머지.

- [x] **R2 (orphaned gate 봉합) — 닫힘 (2026-06-19, ADR-043, `/deep-interview`)**: T2 gate 커밋(`4a95b41`) + **T1 대표 소비자**(`apps/singlefile-spike/` — Button/Input/Card/SortableList[dnd-kit]/Modal/Toast → `vite-plugin-singlefile`로 270KB 단일 HTML, **게이트 7/7 PASS**) + **T3 재현 러너**(`run-singlefile-spike.bat` + 바탕화면 바로가기 + ADR-043 recipe). **보류(명시)**: **T4** pre-pack `tokens.css` guard = tarball 납품 경로 등장 시(현재 workspace-link라 silent 실패 거의 0, H.2 동일 근거). **C4** 별도 ACCEPTANCE 문서 = done 정의가 게이트 7-check에 박혀 중복이라 미작성. spec: `.omc/specs/deep-interview-r2-singlefile-gate.md`.
- [ ] **R3 (= 기존 H.2와 동일 건)**: dev 모드에서 `--color-primary` 미해결 시 `console.warn`. → **[Deferred] H.2** 항목과 통합 관리, 외부 publish 직전 처리.
- [ ] **R4**: `docs/INSTALL.md` §1이 dead path(사내 registry 동결 상태인데 `.npmrc`/registry-install로 시작)로 리드함. 실제 현재 배급 경로(tarball / workspace-link)를 §1로 끌어올리고 registry-install은 "해동 후" 하위로. (registry URL 확정은 사내 PC 작업 → [Phase C])
- [ ] **R5 (gate polish)**: `gate.mjs`에 ① 첫 실행 Chromium 미설치 hint(pnpm postinstall 차단으로 자동 다운로드 안 됨), ② `--help`, ③ 실패 시 contract 메시지(어떤 색 assert가 깨졌는지). README의 "캐시된 Chromium 사용, 설치 불필요" 문구도 fresh install 기준 사실과 다름 → 수정.
- [ ] **R6 (= 기존 H.12와 동일 건)**: `CONTRIBUTING.md`. → **[Deferred] H.12** 항목과 동일, 중복 생성 말 것.

진입 순서 권고: R2(안전망) → R4(현재 사실 반영) → R5(gate 신뢰성) → R3/R6은 각각 H.2/H.12 일정에 합류.

## [design-review 2026-06-18] — 디자인 차원 0-10 sweep (owner/Figma 게이트 항목)

`/plan-design-review`가 8개 디자인 차원 채점 + AI 탐지 + 객관 검증. **Typography(ADR-040 비준·구현 완료)** + **컴포넌트 a11y backlog burndown(아래 [a11y-gate-backlog] 갱신)** 은 적용. 아래는 **토큰 값/구조 변경이라 ADR-024 Figma 게이트·owner 결정 대기** (자동 변경 안 함). 측정 도구: `packages/tokens/scripts/contrast-audit.ts` (83쌍 대비, 재실행=회귀 가드).

- [x] **ADR-041 §B ✅ 구현(2026-06-18)**: `Text` 기본 `color` `primary`→`dark` (bare `<Text>` canvas AA 통과, minor + 테스트). 토큰 darken(옵션 a)은 text 사다리 붕괴라 기각. `color="primary"`는 surface 라벨용 유지.
- [x] **ADR-041 §A ✅ 구현(2026-06-18)**: status 6쌍 text/dot을 hue 보존하며 AA로 darken (idle/ready/processEnd/warning/abort + warning dot, `contrast-audit` green, web 352 테스트 green). **ADR-037 무채색 베이스 비전은 orthogonal** — 별도 진행 가능(이후 contrast-audit으로 AA 가드).
- [ ] **ADR-041 §E (architecture/owner)**: 폼 보더 SC 1.4.11 3:1 — 폼 컨트롤이 공유 `--color-border`(#E1E1E4)를 써서, 고치려면 (i) 전역 보더 darken(모든 카드/패널 medium-gray = "subtle elevation" Brand 원칙 훼손) 또는 (ii) 전용 control-border interface 변수 신설(7-var cascade 계약 변경, ADR-010/011). 둘 다 architecture/brand 결정 → owner. 장식 카드 보더는 1.4.11 예외 여지.
- [ ] **ADR-041 §C/D/F**: button.default 라벨 3.83, table.empty 2.22/2.99, graph.pass label 3.00 — Figma source 재선정(ADR-024). D는 disabled-유사 예외 여지.
- [x] **ADR-042 ✅ 채택(option 1)**: primitives/componentSize/graphTokens에 `@internal` JSDoc 부착 완료 — 소비 0이 정상임을 명시(Figma sync 보존). prune 비채택(ADR-021 위배).

채점 요약(2026-06-18): Typography 3→9 · 컴포넌트 7→9(a11y burndown) · Brand 9·Theming 9(대비 검증) · Primitives 5→8·Spacing 7→8(ADR-042 @internal) · Surface 8→8.5(§B `Text` 기본색 구현, §E 보더 architecture는 owner) · Status 7→8(§A status text/dot AA darken 구현; 무채색 ADR-037 비전 orthogonal). **8/8 차원 모두 측정 가능한 a11y/대비 결함 = 권한 내 수정 완료.** 남은 forward item: §C/D(button/table Figma 값)·§E(보더 architecture)·As Heading(컴포넌트 contract) — 전부 owner/Figma/architecture 결정.

## [Phase C — 사내 PC 진입 후]

- [ ] `.github/workflows/ci.yml` — `pnpm lint:a11y` + `pnpm test:a11y` 를 PR gate로 wiring
- [ ] `.github/ISSUE_TEMPLATE/component-request.md` — 3회 evidence rule + variants/use-case 양식
- [ ] 사내 npm registry URL 확정 (ADR-018 IT 협의) → `packages/{web,tokens}/package.json` publishConfig.registry 재추가
- [ ] 사내 npm 첫 publish → README 의 "사내 registry 결정 후" 단서 제거 + INSTALL 갱신
- [ ] QUICKSTART.md 작성자 path generalization (`C:\Users\ohjih\ppt\frontend` → `<your-app>/frontend` 형태)

## [Deferred — 트리거 조건 충족 시]

- [ ] **트리거: atom count ≥40 OR 3번째 a11y violation slip** — ADR-028 작성, axe severity threshold를 Serious에서 Moderate로 tighten
- [ ] **트리거: 사내 컨슈머 3개 이상 도입** — TDS/Radix 수준의 본격 a11y 거버넌스 (자동 burndown 리포트, PR comment bot 등)
- [ ] **트리거: 컨시어지 납품이 비윈도우/타이포 통제 환경에 도달** — 폰트 결정성 결정. 현재 `fontFamily.base = "'Segoe UI','Inter',system-ui,sans-serif"`(typography.ts:2)는 사내 윈도우 PC에서 Segoe UI native라 무embed로 충분 → 단일-HTML 스파이크가 "폰트 base64 인라인" 요구를 **phantom scope로 떨굼**(eng-review 2026-06-17). 비윈도우 납품 시 'Inter'/Segoe 미존재로 system-ui 조용한 폴백 발생 → 그때 결정: 웹폰트 base64 임베드 vs system 폴백 수용. 트리거 전엔 손대지 말 것(speculative).

## [완료된 cycle]

- [x] 2026-05-26 `/retro` (28 commits 7일 회고)
- [x] 2026-05-26 `/devex-review` (DX 5.9/10 → top 5 fix)
- [x] 2026-05-26 `/design-review` (5 finding, 2 fix commit `322f3e8` + `50204e8`)
- [x] 2026-05-26 `/office-hours` → `/autoplan` (design doc + dual-voice review + revise)
- [x] 2026-05-26 H.0 spike (3개 precondition 검증 PASS)
- [x] 2026-05-26 H.3 publishConfig 정리 (commit `cba3a46`)
- [x] 2026-05-26 H.1 README (commit `6b858b3`)
- [x] 2026-05-26 H.5 jsx-a11y ESLint wiring + 6 finding triage (commit `3e8f181`)
- [x] 2026-05-26 H.6 Storybook addon-a11y + vitest browser mode + 19 todo tag (commit `3e8f181`)
- [x] 2026-05-26 H.8 + H.10 pre-commit hook (simple-git-hooks + lint-staged) + `lint:a11y`/`test:a11y` scripts (commit `4c17a6f`)
- [x] 2026-05-26 H.4 ADR-027 본문 작성 (commit `d2bc182`)
- [x] 2026-05-26 H.14 VariantSizeMatrix `text` row 추가 (FINDING-003 closure)
- [x] 2026-05-26 H.13 N/A close (FINDING-002는 fix 불필요 — 위 [N/A] 섹션)

## [Deferred — 이번 cycle에서 의도적으로 skip]

- **H.7 (permanent regression fixture + a11y-gate test)**: 원래 plan은 fixture story + vitest test + ESLint self-test 3개 파일이었으나, H.6 결과 19개 todo-tagged 스토리가 이미 *gate 작동의 산증거*로 backlog에 존재 → 별도 fixture는 중복. **재평가 트리거**: backlog burndown ≤ 5 시점, 그때 1개 fixture 남겨서 gate self-test.
- **H.2 (tokens.css silent-failure warn)**: 다음 cycle. 사내 npm registry 결정 후로 미뤄도 OK — `pnpm` workspace 환경에서는 자동 link라 silent failure가 거의 안 일어남. 외부 publish 직전에 처리.
- **H.11 (Storybook Introduction.mdx 랜딩)**: 다음 cycle. 30분 작업, findability 큰 win이지만 a11y cycle과 직교.
- **H.12 (CONTRIBUTING.md)**: 다음 cycle. 1페이지, 3회 evidence rule + ADR + Changesets 흐름 + pre-commit bypass 정책 + ADR-027 escape-hatch 사용 가이드.

## [N/A — 조사 결과 fix 불필요]

- **H.13 (stale story ID grep+fix)**: docs에 `tokens-colors--` 참조 **0건** — `/design-review` audit이 story ID를 *추측*해서 404 본 거지 실제 stale 참조는 어디에도 없었음. 2026-05-26 grep으로 확인. 본 항목 close.
