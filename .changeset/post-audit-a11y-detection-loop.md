---
"@wonik/web": patch
---

ADR-027 a11y detection loop — eslint-plugin-jsx-a11y + Storybook addon-a11y test mode (Phase H.5 + H.6)

### 동기

`/design-review` (2026-05-26)에서 Button + Alert에 WCAG 2.1 AA color-contrast 위반(3.9:1, 4.5:1 미달)이 발견됐는데, Storybook addon-a11y는 이미 violation을 감지하고 있었음 — 단지 *자동 gate*가 없어서 Accessibility 탭에서 무한정 방치된 상태였음. `/autoplan` dual-voice review가 같은 패턴이 누적될 거라 경고 → **detection→fix loop를 enforce 단계까지 닫는 게 본 cycle의 ADR-027 거리**.

### 변경 (이번 patch 범위)

#### 정적 검사 (ESLint flat config — ADR-026 위에 build)

- root `package.json`에 `eslint-plugin-jsx-a11y@^6.10.2` 추가
- `eslint.config.mjs`에 jsx-a11y recommended preset block 추가 (TSX 한정)
- 6개 pre-existing finding 정리:
  - `packages/web/src/Modal/Modal.tsx:158` — backdrop click handler에 justified disable (`no-static-element-interactions` — keyboard dismiss는 panel ESC handler가 처리)
  - `packages/web/src/InlineEditableText/InlineEditableText.tsx:163` — autoFocus prop에 justified disable (`no-autofocus` — 편집 모드 진입의 UX 약속)
  - `packages/web/src/Radio/Radio.tsx:67` — aria-invalid attribute에 justified disable (`role-supports-aria-props` — jsx-a11y@6.10이 ARIA 1.1 spec 사용해서 form-control용 global aria-invalid를 인식 못 함; WAI-ARIA 1.2 §6.3 기준으로는 합법)
  - `apps/demo-fab-monitor/src/pages/EquipmentPage.tsx:97` — implicit-control checkbox label
  - `apps/storybook/src/stories/input-Checkbox.stories.tsx:9` — 같음
  - `apps/web-sandbox/src/App.tsx:340` — sandbox autoFocus demo
- `packages/web/src/Button/Button.tsx`에서 사용 안 하는 `text` import 제거 (이전 `322f3e8` Button 컨트라스트 fix에서 누락된 cleanup)

#### 런타임 검사 (Storybook addon-a11y + vitest browser mode)

- `apps/storybook/package.json`에 5개 devDep 추가 + Storybook trio 10.4.0→10.4.1 bump:
  - `@storybook/addon-vitest@^10.4.1`
  - `vitest@^4.1.7`
  - `@vitest/browser@^4.1.7`
  - `@vitest/browser-playwright@^4.1.7`
  - `playwright@^1.60.0`
- `apps/storybook/.storybook/preview.tsx`에 `a11yAddonAnnotations` spread → 각 story 렌더 후 axe scan, Serious+ violation에서 throw
- 신규 `apps/storybook/.storybook/vitest.setup.ts` — `setProjectAnnotations`로 preview decorator 전파
- 신규 `apps/storybook/vitest.config.ts` — Chromium headless via Playwright
- `apps/storybook/package.json scripts.test = "vitest run"` 추가
- pre-existing 19개 a11y violation은 9개 story 파일에 `parameters: { a11y: { test: 'todo' } }` 태그 → backlog 처리, 새 violation만 gate가 막음 (burndown 목록은 TODOS.md "[a11y-gate-backlog]")
- `apps/storybook/src/stories/overlay-Toast.stories.tsx` 4 stories는 a11y와 무관한 decorator runtime issue → `vitest.config.ts test.exclude`로 일단 분리 (TODOS.md에 follow-up 등록)

### 검증

- `pnpm lint` → 0 errors (jsx-a11y 6 finding 모두 triage 끝남)
- `pnpm -F storybook-app test` → 24 test files / 103 tests pass, 0 fail (todo-tagged 19개는 axe가 잡지만 gate fail 안 함, 새 violation은 gate fail)
- 기존 `pnpm -F @wonik/web test` 30 tests 영향 0

### scope

- 컨슈머 영향: 0 (런타임/API 변동 없음, internal 검사 도구 추가만)
- `@wonik/web` source의 실질 변경: Button.tsx 1줄 import 제거 + 3개 컴포넌트에 inline-disable 주석 추가 — 패키지 빌드 산출물 unchanged
- 검사 인프라는 모두 monorepo 도구쪽 (`eslint.config.mjs`, `apps/storybook/*`)에 위치 — 사용자가 install/import할 일 없음
- ADR-027 본문은 H.4 cycle (별도 commit)에서 작성 예정; 본 patch는 implementation, ADR-027 reference는 코드 주석 + TODOS.md에 placeholder
- Phase C (사내 PC 진입 후): `.github/workflows/ci.yml`에서 `pnpm test:a11y` 호출하는 PR gate로 promote (`docs/ROADMAP.md`)
