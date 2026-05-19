# Phase 23 — InlineEditableText

> ROADMAP §M2.b Phase 5a (분할 closure — Phase 5b는 SortableList 별도).

## 1. 배경 & 동기

`ppt/.../OutlineCard.tsx:75-93`에 **30줄 boilerplate** 인라인 편집 패턴이 직접 박혀있음:
- `useState(editing)` + `useState(editTitle)` + `useEffect(slide.title sync)`
- 표시 모드 `<p onClick={() => setEditing(true)}>...`
- 편집 모드 `<Input autoFocus onKeyDown={Enter→save/ESC→cancel} onBlur={save} />`

이 패턴이 다른 자리(예: Presentation 슬라이드 제목 rename, History list rename)에서도 반복될 예정. 같은 패턴을 3번 베끼기 전에 atom으로 흡수.

PRD §1.4.2가 **InlineEditableText**를 ppt-derived 명시. 첫 customer = ppt OutlineCard (dogfood 1개 자리 확인).

## 2. 사용자 정의

- **Primary user**: ppt 같은 host product의 개발자 — `<InlineEditableText value={x} onChange={fn} />` 한 줄로 인라인 편집 패턴을 끝낸다.
- **Secondary user**: design system 유지보수자 — 인라인 편집 패턴을 한 곳에서 a11y/포커스/키보드 일관성 보장.
- **End user** (ppt 사용자): 슬라이드 제목 클릭 → 즉시 편집 → Enter/ESC 키보드로 commit/cancel.

## 3. 범위

### In-scope (이번 phase)

`@wonik/web`에 `InlineEditableText` atom 1개 추가. **22 atom 도달.**

- Controlled API: `value: string` + `onChange: (next: string) => void`
- 토글 트리거: 표시 모드 클릭 → 편집 모드 (single-click, double-click 옵션은 prop)
- 편집 종료: **Enter** = save → `onChange` 호출, **Escape** = cancel → 외부 value 복원, **onBlur** = save (default, prop으로 disable 가능)
- 자동 포커스: 편집 모드 진입 시 input autoFocus
- 표시 모드 시각: 텍스트 + hover 시각 변화 (커서 text + 색 변화)
- 편집 모드 시각: 기존 `Input` atom 재사용 (`size` prop pass-through)
- a11y: 표시 모드 `role="button"` + `aria-label` (prop), 편집 모드는 native `<input>` semantics
- placeholder: empty value 시 placeholder 표시
- 외부 value 변경 시 (예: undo) 표시값 자동 sync (현재 OutlineCard의 `useEffect` 패턴 흡수)

### 결정점 (autopilot default)

| 결정점 | 채택 | 이유 |
|---|---|---|
| 편집 진입 트리거 | **single-click** default. `trigger: 'single' \| 'double'` prop으로 옵션 | OutlineCard가 single-click 사용, 가장 직관 |
| 표시 모드 키보드 진입 | **Enter + Space** 둘 다 (`role="button"` 표준) | WAI-ARIA button pattern |
| onBlur 동작 | **save** default. `saveOnBlur: false`로 disable 가능 | rename UX 일반 패턴, OutlineCard도 동일 |
| autoFocus 시 cursor | **select-all** default. `selectOnFocus: false`로 disable 가능 | macOS Finder / Slack channel rename / GitHub repo rename 모두 select-all 패턴 |
| 표시 모드 element tag | `as: 'p' \| 'span' \| 'h1' \| 'h2' \| 'h3' \| 'h4'` prop, default `'span'` | semantic 보존 — slide title은 h2/h3 사용처에 맞춤 |
| placeholder 토큰 | `interfaceColors.textMuted` | 일반 placeholder 시각 |
| hover 시각 | `interfaceColors.primary`로 텍스트 색 전환 + `cursor: text` | OutlineCard의 `hover:text-primary` 패턴 흡수 |
| disabled 시각 | `opacity: 0.5` + `cursor: not-allowed` + 키보드/클릭 진입 차단 | 일반 패턴 |
| 편집 모드 Input | 기존 `Input` atom 재사용. `size: 'sm' \| 'md' \| 'lg'` prop pass-through | 기존 atom 흡수 |

### Out-of-scope (다음 phase 또는 별도 spec)

- **Textarea 지원** (multiline). 별도 prop이나 별도 컴포넌트(`InlineEditableTextarea`)로. 이번 phase X.
- **Validation** (length/regex/required). consumer가 `onChange`에서 처리. atom에 spec 없음.
- **Async save 상태 표시** (saving spinner, save error). consumer가 outer state로 처리.
- **Rich text / formatting**. 이번 phase X.
- **SortableList atom** (Phase 5b — 별도 phase 24).

## 4. 성공 기준 (측정 가능)

| 기준 | 측정 |
|---|---|
| OutlineCard 코드 절감 | inline 패턴 30줄 → `<InlineEditableText>` **3줄 이하**로 대체 가능 (ppt 측 별도 trial PR로 검증) |
| 테스트 coverage | 14개 이상 test passing (편집 진입·Enter·ESC·onBlur·외부 sync·placeholder·a11y·disabled·controlled value drift) |
| atom 개수 | 21 → **22** (Storybook 15+ trigger 통과 유지) |
| 토큰 하드코딩 | 0 (모두 `interfaceColors`/`radius`/`fontSize` 경유) |
| 회귀 | 기존 atom 0 영향 (분리된 새 모듈) |

## 5. 엣지 케이스 / 예외

| 케이스 | 동작 |
|---|---|
| 빈 string으로 save | `onChange('')` 호출 (consumer가 validation 결정). atom은 강제 X. |
| ESC 후 외부 value가 그동안 바뀐 경우 | ESC = "외부 value 복원" — 외부가 바뀌었으면 그 새 외부 value 표시 |
| 외부 value가 prop으로 변경됨 (controlled drift) | 편집 중이 아니면 즉시 표시 sync. 편집 중이면 외부 prop은 ignore (편집 우선) |
| disabled prop true | 클릭/포커스로 편집 모드 진입 차단. cursor `not-allowed` |
| onBlur 발생 + Enter 동시 trigger | Enter가 먼저 처리됨 (handleKeyDown이 onBlur보다 빠름). 동일 결과 (save). 중복 호출 방지 (state guard) |
| placeholder 클릭 | 편집 모드 진입 + 빈 input |
| 표시 모드에서 키보드 접근 | `tabIndex=0` + Enter/Space 키 = 편집 모드 진입 (마우스 사용자와 동일 access) |

## 6. 의존성 / 통합 지점

- **`@wonik/web`의 기존 `Input` atom 재사용** — 편집 모드 input. `size` prop pass-through.
- **`@wonik/tokens`** — `interfaceColors`, `radius.sm`, `fontSize.label` 등. 토큰 하드코딩 0.
- **외부 라이브러리 신규 의존성 0** — 순수 React.
- **첫 dogfood = ppt OutlineCard** — atom merge 후 ppt 측 별도 trial PR로 30줄 → 3줄 교체 검증.

## 7. 보안 / 인증 / 데이터

본 atom은 **stateless presentation atom**. 인증·권한·데이터 저장 책임 없음. consumer가 `onChange`로 받은 string을 어떻게 처리할지(저장·validate·sanitize) 결정. XSS는 React가 textContent로 자동 escape — 별도 sanitize 책임 없음.

## 8. 성능 목표

- atom rendering overhead < 1ms (현재 OutlineCard inline 패턴과 동일 수준)
- 편집 모드 진입 latency < 50ms (autoFocus + state toggle)

## 9. 생성/변경 파일 (예상)

- `packages/web/src/InlineEditableText/InlineEditableText.tsx` — 구현 (~120 lines)
- `packages/web/src/InlineEditableText/InlineEditableText.test.tsx` — 14+ tests
- `packages/web/src/InlineEditableText/types.ts` — type exports
- `packages/web/src/InlineEditableText/index.ts` — barrel
- `packages/web/src/index.ts` — InlineEditableText export 추가
- `.changeset/23-inline-editable-text.md` — `@wonik/web` minor bump
- `apps/ladle/src/stories/input-InlineEditableText.stories.tsx` — Ladle catalog
- `docs/ROADMAP.md` — Phase 5a closure 마킹

## 10. 다음 호흡

- ppt 측 별도 trial PR — OutlineCard.tsx 30줄 → 3줄 교체 (dogfood 검증). 이번 phase 범위 외, 사용자가 ppt 환경 진입 시 진행.
- Phase 24 — SortableList (M2.b Phase 5b). dogfood 자리 2개(OutlineCard ↑↓ button + Presentation drag thumbnails) + dnd-kit wrap + WAI-ARIA drag 키보드 패턴.
