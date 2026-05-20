# Phase 23 — InlineEditableText: Tasks (의존성 순)

## T1. Input atom ref forwarding 점검
- [ ] `packages/web/src/Input/Input.tsx` 읽고 forwardRef 적용 여부 확인.
- [ ] 미적용 시: `forwardRef<HTMLInputElement, InputProps>` 변환. type-only 변경이라 기존 tests 영향 0.
- **완료 기준**: native input element ref를 외부에서 받을 수 있음. 기존 14 Input tests 그대로 통과.
- **보안 관련**: 없음 (type signature 확장만).

## T2. types.ts 작성
- [ ] `packages/web/src/InlineEditableText/types.ts` — `InlineEditableTextProps` interface export.
- 필드: `value`, `onChange`, `placeholder?`, `disabled?`, `trigger?: 'single' | 'double'`, `saveOnBlur?: boolean`, `selectOnFocus?: boolean`, `as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4'`, `size?: 'sm' | 'md' | 'lg'`, `ariaLabel?: string`, `className?`, `style?`.
- **완료 기준**: TS compile 통과, 모든 prop optional default 명시 (jsdoc).
- **보안 관련**: 없음.

## T3. 테스트 작성 (TDD test-first)
- [ ] `packages/web/src/InlineEditableText/InlineEditableText.test.tsx` — plan §4의 8개 카테고리에서 **16 tests**:
  - 렌더 (3): value, `as` prop, placeholder
  - 진입 (4): single-click, Enter, Space, trigger="double"
  - commit/cancel (4): Enter save, ESC cancel, onBlur save, saveOnBlur=false
  - drift (2): non-editing sync, editing ignore
  - select-all (1): selection range
  - disabled (1): no-entry + tabIndex
  - a11y (1): role="button" + aria-label
- 이 시점에 `InlineEditableText.tsx`가 없으므로 모든 test FAIL이 정상. tasks T4까지 가야 통과.
- **완료 기준**: 16 test 모두 작성됨. 실행 시 모듈 not found error 또는 모든 test fail.
- **보안 관련**: a11y test가 button role + aria-label 검증 (screen reader 접근성).

## T4. 구현 작성 (TDD impl)
- [ ] `packages/web/src/InlineEditableText/InlineEditableText.tsx` 작성.
- 핵심:
  - `useState(editing)` + `useState(draft)` + `useRef(inputRef)`.
  - `useEffect`로 외부 value sync (editing false일 때만).
  - `useEffect`로 select-all on focus (editing true 직후).
  - `handleSave`/`handleCancel` 함수.
  - 표시 모드: `as` prop으로 동적 tag.
  - 편집 모드: `Input` atom + `ref={inputRef}` + autoFocus.
  - module-scope CSS inject (ADR-011): `wonik-inline-editable` className + hover/focus pseudo.
- **완료 기준**: T3의 16 test 모두 PASS. `pnpm -F @wonik/web test InlineEditableText` 통과.
- **보안 관련**: XSS 방지는 React textContent escape에 위임 (별도 sanitize 불필요).

## T5. barrel + export
- [ ] `packages/web/src/InlineEditableText/index.ts` — re-export Component + types.
- [ ] `packages/web/src/index.ts` — `export * from './InlineEditableText'` 라인 추가.
- **완료 기준**: `import { InlineEditableText } from '@wonik/web'` 가능. `pnpm -F @wonik/web build` 통과.
- **보안 관련**: 없음.

## T6. sandbox 시각 case 추가
- [ ] `apps/web-sandbox/src/App.tsx`에 InlineEditableText section 추가.
- 6 case: single-click / double-click / saveOnBlur=false / disabled / placeholder / `as="h2"`.
- 각 case마다 controlled `useState` value.
- **완료 기준**: `pnpm -F web-sandbox dev` 시 6 case 모두 보이고 동작.
- **보안 관련**: 없음.

## T7. Ladle story 추가
- [ ] `apps/ladle/src/stories/input-InlineEditableText.stories.tsx` — 6 export (sandbox 6 case와 동일).
- 그룹: `input/InlineEditableText`.
- **완료 기준**: `pnpm -F ladle dev` 시 6 story 모두 보이고 동작.
- **보안 관련**: 없음.

## T8. Changeset
- [ ] `.changeset/23-inline-editable-text.md` — `@wonik/web` minor bump.
- 본문: 어떤 컴포넌트가 추가됐고 어떤 API를 제공하는지, 그리고 dogfood 자리(ppt OutlineCard) 명시.
- Input atom에 forwardRef 추가됨도 명시(있다면).
- **완료 기준**: changeset 파일 생성됨. `pnpm changeset status` 에 entry 1개 노출.
- **보안 관련**: 없음.

## T9. ROADMAP closure 표시
- [ ] `docs/ROADMAP.md` §M2.b 표에 Phase 5a 결과 추가:
  - "Phase 5 (옵션)" 행을 5a/5b로 분할.
  - 5a (InlineEditableText) `✅ 2026-05-19 (Phase 23)` 마킹.
  - 5b (SortableList) 보류 표시.
- **완료 기준**: ROADMAP 표가 22 atom 달성 반영.
- **보안 관련**: 없음 (문서).

## T10. (security task) 토큰 하드코딩 grep
- [ ] `grep -nE "#[0-9a-fA-F]{3,8}|[0-9]+px|[0-9]+rem" packages/web/src/InlineEditableText/*.tsx` — 0건 결과.
- 단, font-related raw 값(`size: 'sm'` 등 string token)은 OK.
- **완료 기준**: hex / pixel literal 검출 0건. CLAUDE.md CRITICAL 룰 (raw 값 하드코딩 금지) 준수 확인.
- **보안 관련**: 디자인 시스템 무결성 보안. 하드코딩이 host의 theme override를 깬다.

## T11. (security task) a11y self-check
- [ ] 표시 모드: `role="button"` + `aria-label` 노출 확인.
- [ ] 표시 모드: focus indicator outline 2px 가시 (WCAG 2.4.7 AA).
- [ ] 표시 모드: keyboard (Tab → Enter/Space) 진입 가능.
- [ ] disabled: `tabIndex={-1}` + 진입 차단.
- **완료 기준**: 4개 a11y 항목 모두 test로 커버됨 또는 sandbox 수동 확인 완료.
- **보안 관련**: 접근성 (legal/compliance ground).

## T12. Self-test (PHASE 6 대비)
- [ ] `pnpm -F @wonik/web test --run InlineEditableText` — 16 tests PASS.
- [ ] `pnpm -F @wonik/web test --run` — 전체 302+ tests PASS (회귀 0).
- [ ] `pnpm -F @wonik/web build` — DTS + ESM + CJS 빌드 성공.
- [ ] `pnpm -F @wonik/tokens build` — 토큰 변경 없으므로 통과 기본.
- **완료 기준**: 모두 PASS.

## T13. Commit + push (PHASE 8 대비)
- [ ] git add: 변경 파일만 명시 add (`.changeset/`, `packages/web/src/InlineEditableText/`, `packages/web/src/Input/`, `packages/web/src/index.ts`, `apps/web-sandbox/`, `apps/ladle/src/stories/`, `phases/23-inline-editable-text/`, `docs/ROADMAP.md`).
- [ ] commit: conventional commit `feat(23-inline-editable-text): ...`. Co-Authored-By 포함.
- [ ] push origin feat/demo-fab-monitor-polish.
- **완료 기준**: 원격 반영, log에 commit 노출.

---

## 의존성 그래프

```
T1 (Input forwardRef) ───┐
                         ▼
T2 (types) ───────► T3 (test-first) ───► T4 (impl)
                                            │
                                            ├─► T5 (barrel + export)
                                            │       │
                                            │       ├─► T6 (sandbox)
                                            │       │
                                            │       └─► T7 (ladle)
                                            │
                                            ├─► T8 (changeset)
                                            │
                                            └─► T9 (ROADMAP)

T10 (hardcoding grep) ── T4 끝난 후 검사
T11 (a11y self-check) ── T4 끝난 후 검사

T12 (self-test) ── T5 ~ T9 끝난 후
T13 (commit + push) ── T12 통과 후
```
