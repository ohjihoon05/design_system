# Phase 23 — InlineEditableText: Implementation Plan

## 1. 아키텍처

### 위치
`packages/web/src/InlineEditableText/` — 다른 atom과 동일 폴더 구조 (`Component.tsx` + `Component.test.tsx` + `types.ts` + `index.ts`).

### 모듈 분리 — 안 함
이 atom은 단일 파일로 충분. switch state + `<Input>` wrap이 핵심이고 분기가 적음. 별도 hook 추출(`useInlineEdit`) 안 함 — useState 2개만 쓰는 단순 로직, 추출은 indirection cost만 늘림 (CLAUDE.md "premature abstraction 금지").

### 상태 관리
- `editing: boolean` — 표시/편집 모드 토글
- `draft: string` — 편집 중 임시값. 외부 `value`와 분리 (commit/cancel을 위해 필요).
- 외부 `value` 변경 sync: `useEffect`로 — 편집 중이 아닐 때만 draft를 외부 value로 sync. 편집 중이면 외부 prop ignore (편집 우선).

### 표시/편집 모드 토글

```tsx
// 표시 모드
<span/h1/h2/.../p
  role="button"
  tabIndex={disabled ? -1 : 0}
  aria-label={ariaLabel ?? value}
  onClick={enterEdit}
  onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? enterEdit() : null}
>
  {value || placeholder}
</span>

// 편집 모드
<Input
  ref={inputRef}
  size={size}
  value={draft}
  onChange={(e) => setDraft(e.target.value)}
  onKeyDown={handleKeyDown}  // Enter=save / ESC=cancel
  onBlur={saveOnBlur ? handleSave : handleCancel}
  autoFocus
/>
```

### autoFocus 후 select-all
```tsx
useEffect(() => {
  if (editing && inputRef.current && selectOnFocus) {
    inputRef.current.select();
  }
}, [editing]);
```

`Input` atom에 native input ref forward — 이미 forwardRef 되어 있는지 확인 필요 (PHASE 5에서 점검). 없으면 atom에 ref forward 추가 (별도 작업으로 다룸).

### 시각 토큰

| 위치 | 토큰 |
|---|---|
| 표시 모드 텍스트 | `interfaceColors.text` |
| 표시 모드 hover | `interfaceColors.primary` |
| placeholder | `interfaceColors.textMuted` |
| 표시 모드 cursor | `cursor: text` (편집 가능 hint) |
| 표시 모드 focus | `outline: 2px solid var(--color-focus, var(--color-primary))` (WCAG 2.4.7) — module-scope CSS inject (ADR-011) |
| 편집 모드 시각 | 기존 `Input` atom이 처리 |
| disabled | `opacity: 0.5` + `cursor: not-allowed` |

### CSS inject 필요
`:hover`와 `:focus-visible` pseudo-class 필요 → inline style로 못 풀어서 **ADR-011 module-scope CSS 1회-inject 패턴** 사용. `ensureInlineEditableCssInjected()` + `data-wonik-inline-editable` style 태그 + className `wonik-inline-editable` 부여. SSR 가드 필수.

## 2. 의존성

### 새 외부 의존성: 0
순수 React (`useState`, `useEffect`, `useRef`) + 기존 `@wonik/web` `Input` atom + `@wonik/tokens`.

### 내부 의존성
- `@wonik/web` `Input` (편집 모드)
- `@wonik/tokens` `interfaceColors`, `radius`, `fontSize`

### Input atom ref forwarding 점검 필요
편집 모드 autoFocus + select-all을 위해 native input element ref 필요. `Input` atom이 이미 `forwardRef`로 native input ref를 노출하는지 확인. 안 노출하면:
- 옵션 A: `Input` atom에 `forwardRef` 추가 (`packages/web/src/Input/Input.tsx` 수정). minor bump.
- 옵션 B: native `<input>`을 InlineEditableText 안에서 직접 렌더링 (Input atom 우회) — 일관성 손실.

**default**: 옵션 A. `Input`은 atom이라 ref forwarding 못 한 게 누락이지 의도가 아님. 한 번에 해결.

## 3. 위험 / 트레이드오프

| 위험 | 완화 |
|---|---|
| **Input ref forwarding이 없어서 select-all 못 함** | 옵션 A — Input atom에 forwardRef 추가 (한 번에 처리, minor bump 별도 처리 필요 없음 — 같은 changeset에서 다룸) |
| **편집 중 외부 value drift** | `editing` flag로 sync 차단. 편집 끝나면 외부 value 우선 적용 |
| **onBlur + Enter 동시 발화 → 중복 save** | `editing` state guard — handleSave 안에서 `setEditing(false)`를 가장 먼저, onBlur는 `editing` false면 no-op |
| **disabled + tabIndex 처리 누락** | TDD로 `tabIndex={disabled ? -1 : 0}` 명시 테스트 |
| **a11y label 누락 시 screen reader가 텍스트만 읽고 button임을 인지 못 함** | `role="button"` + `aria-label` (없으면 value 자동) |
| **single-click trigger가 텍스트 선택을 막을 수 있음** | trigger="double" prop으로 우회 가능. default single (OutlineCard 일관) |
| **ESC 후 외부 value가 바뀐 경우** | spec §5에 명시 — ESC = "현재 외부 value 복원" (편집 시작 시점 value 아닌 현재 외부 value). 직관적 |
| **편집 모드에서 enter가 form submit을 trigger할 수 있음** | `onKeyDown` 안에서 `e.preventDefault()` + `e.stopPropagation()` Enter 처리 |

## 4. 테스트 전략

TDD: 테스트 먼저 작성하고 통과시키는 구현. Vitest + @testing-library/react + userEvent.

### 테스트 카테고리 (목표 14+ tests)

1. **표시 모드 렌더링** (3)
   - 값을 텍스트로 렌더
   - `as` prop으로 element tag 변경 (span/h2/p)
   - placeholder 표시 (빈 value)

2. **편집 모드 진입** (4)
   - single-click → 편집 모드 진입
   - Enter 키 (표시 모드) → 편집 모드 진입
   - Space 키 (표시 모드) → 편집 모드 진입
   - trigger="double" + single-click → 진입 안 됨

3. **편집 모드 commit/cancel** (4)
   - Enter → onChange(draft) 호출 + 표시 모드 복귀
   - ESC → onChange 호출 안 됨 + 표시 모드 복귀 + 외부 value 복원
   - onBlur (default saveOnBlur=true) → save
   - saveOnBlur=false + onBlur → cancel

4. **외부 value drift** (2)
   - 편집 중이 아닐 때 외부 value 변경 → 표시 즉시 sync
   - 편집 중 외부 value 변경 → 표시 무시 (draft 우선)

5. **select-all on focus** (1)
   - 편집 진입 시 input value 전체 selection 확인 (`selectionStart === 0`, `selectionEnd === value.length`)

6. **disabled** (1)
   - disabled=true → 클릭/Enter/Space 진입 차단 + `tabIndex={-1}`

7. **a11y** (1)
   - 표시 모드 `role="button"` + `aria-label` 동작

8. **토큰 하드코딩 0** — 별도 lint(grep hex)로 검증 (test 외)

### sandbox 시각 검증

`apps/web-sandbox/src/App.tsx`에 InlineEditableText 자리 추가. controlled value state로 6개 case 시각 검증:
- single-click trigger
- double-click trigger
- saveOnBlur=false
- disabled
- placeholder
- `as="h2"` 큰 텍스트

### Ladle catalog story

`apps/ladle/src/stories/input-InlineEditableText.stories.tsx` — 6개 export (위 6 case와 동일).

## 5. 변경 파일 목록

| 파일 | 변경 |
|---|---|
| `packages/web/src/InlineEditableText/InlineEditableText.tsx` | 신규 (~150 lines) |
| `packages/web/src/InlineEditableText/InlineEditableText.test.tsx` | 신규 (16 tests) |
| `packages/web/src/InlineEditableText/types.ts` | 신규 (Props 타입 export) |
| `packages/web/src/InlineEditableText/index.ts` | 신규 (barrel) |
| `packages/web/src/Input/Input.tsx` | 수정 — `forwardRef` 추가 (없을 시) |
| `packages/web/src/index.ts` | 신규 export 추가 |
| `apps/web-sandbox/src/App.tsx` | sandbox case 추가 |
| `apps/ladle/src/stories/input-InlineEditableText.stories.tsx` | 신규 |
| `.changeset/23-inline-editable-text.md` | `@wonik/web` minor |
| `docs/ROADMAP.md` | Phase 5a closure 마킹 |
