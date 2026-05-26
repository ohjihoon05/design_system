# TODOS

Post-audit + ADR-027 burndown. 우선순위순.

## [a11y-gate-backlog] — Storybook addon-a11y `test: 'todo'` 표시된 항목 (ADR-027 cycle 잔여)

19개 a11y violation이 9개 story 파일에서 발견됨 (Storybook addon-a11y 첫 가동 시점, 2026-05-26). 모두 `parameters: { a11y: { test: 'todo' } }`로 sealed → 새 violation만 gate가 막음, 옛 backlog는 천천히 갚음.

### 파일별 burndown

- [ ] `apps/storybook/src/stories/action-Button.stories.tsx` — 1 story (`Variants`) 위반
- [ ] `apps/storybook/src/stories/display-ProgressBar.stories.tsx` — 4 stories (`Tones`, `Heights`, `Values`, `Clamp`)
- [ ] `apps/storybook/src/stories/input-Checkbox.stories.tsx` — 2 stories (`Sizes`, `States`)
- [ ] `apps/storybook/src/stories/input-InlineEditableText.stories.tsx` — 2 stories (`As Heading`, `Realistic Outline Card`)
- [ ] `apps/storybook/src/stories/input-Input.stories.tsx` — 1 story (`Disabled`)
- [ ] `apps/storybook/src/stories/input-Radio.stories.tsx` — 2 stories (`Sizes`, `States`)
- [ ] `apps/storybook/src/stories/input-Switch.stories.tsx` — 3 stories (`Basic`, `Sizes`, `States`)
- [ ] `apps/storybook/src/stories/input-Textarea.stories.tsx` — 1 story (`Disabled`)
- [ ] `apps/storybook/src/stories/layout-SortableList.stories.tsx` — 3 stories (`Basic`, `With Announce Item`, `Realistic Outline Card`)

확인 방법: `pnpm -F storybook-app dev` 후 각 스토리 Accessibility 탭 열어 axe violation 확인. 대부분 color-contrast 또는 form-label-association 추정.

burndown 한 파일씩 끝나면 해당 파일의 `parameters: { a11y: { test: 'todo' } }` 줄을 제거 (default = `'error'`).

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

## [Phase C — 사내 PC 진입 후]

- [ ] `.github/workflows/ci.yml` — `pnpm lint:a11y` + `pnpm test:a11y` 를 PR gate로 wiring
- [ ] `.github/ISSUE_TEMPLATE/component-request.md` — 3회 evidence rule + variants/use-case 양식
- [ ] 사내 npm registry URL 확정 (ADR-018 IT 협의) → `packages/{web,tokens}/package.json` publishConfig.registry 재추가
- [ ] 사내 npm 첫 publish → README 의 "사내 registry 결정 후" 단서 제거 + INSTALL 갱신
- [ ] QUICKSTART.md 작성자 path generalization (`C:\Users\ohjih\ppt\frontend` → `<your-app>/frontend` 형태)

## [Deferred — 트리거 조건 충족 시]

- [ ] **트리거: atom count ≥40 OR 3번째 a11y violation slip** — ADR-028 작성, axe severity threshold를 Serious에서 Moderate로 tighten
- [ ] **트리거: 사내 컨슈머 3개 이상 도입** — TDS/Radix 수준의 본격 a11y 거버넌스 (자동 burndown 리포트, PR comment bot 등)

## [완료된 cycle]

- [x] 2026-05-26 `/retro` (28 commits 7일 회고)
- [x] 2026-05-26 `/devex-review` (DX 5.9/10 → top 5 fix)
- [x] 2026-05-26 `/design-review` (5 finding, 2 fix commit `322f3e8` + `50204e8`)
- [x] 2026-05-26 `/office-hours` → `/autoplan` (design doc + dual-voice review + revise)
- [x] 2026-05-26 H.0 spike (3개 precondition 검증 PASS)
- [x] 2026-05-26 H.3 publishConfig 정리 (commit `cba3a46`)
- [x] 2026-05-26 H.1 README (commit `6b858b3`)
- [x] 2026-05-26 H.5 jsx-a11y ESLint wiring + 6 finding triage
- [x] 2026-05-26 H.6 Storybook addon-a11y + vitest browser mode + 19 todo tag

남은 cycle: H.7 (permanent regression fixture + a11y-gate test), H.8 (pre-commit hook), H.2 (tokens.css silent-failure warn), H.4 (ADR-027 본문 작성), H.11/H.12/H.13/H.14 (Storybook intro + CONTRIBUTING + 자잘한 finding).
