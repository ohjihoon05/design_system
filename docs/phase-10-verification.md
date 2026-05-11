# Phase 10 Visual Verification — ADR-011 적용 후

**날짜**: 2026-05-11
**대상**: ppt `Home.tsx`, 그리고 `@wonik/web` form 컨트롤 전체
**기준**: Phase 09 closure(Trial 3 invisibility 해결) 위에 ADR-011 적용 후 상태

## 자동 검증 (Chrome headless)

### Default state — 회귀 0

- **캡쳐**: `pkg-out/trial-3-phase10-default.png`
- **비교 대조**: `pkg-out/trial-3-recapture-home.png` (Phase 09 closure 시점)
- **결과**: 두 캡쳐 시각 동일 — ADR-011의 CSS injection(`:focus-visible`/`:hover`/`::placeholder`)이 default state(focus/hover 아닐 때)에 영향 0. 의도된 동작 입증.

### 회귀 검증된 항목
- Textarea background/border/text가 ppt panel과 자연 융합 유지 (ADR-010 cascade 작동 보존)
- placeholder가 native default가 아닌 우리 token (var(--color-placeholder, var(--color-text-dim))) 적용됨 — 단 ppt에는 `--color-placeholder` 미정의이므로 우리 internal text-dim으로 fallback. 시각상 Phase 09와 동일 (text-dim도 dark theme에서 light gray)
- 163 tests passing (회귀 0)

## Manual 검증 권장 (자동화 비용 큼)

### Focus state — Tab key navigation

ppt dev server에서 `Tab` 키로 textarea·button·checkbox·radio·switch에 키보드 focus 이동 후 시각 확인:
- outline 2px solid가 `var(--color-focus, var(--color-primary))`로 보이는가
- Input/Textarea: outline-offset 0 (border-통합 dual-cue)
- Button/Checkbox/Radio/Switch: outline-offset 2px (분리 ring)
- ppt에서는 `--color-focus` 미정의 → primary로 fallback → WONIK BLUE가 ppt indigo 위에 잘 식별되는지 검증
- `--color-focus` 미정의 시 host가 정의한 `--color-primary`(indigo)로 cascade하므로 host 색으로 보임 — 의도 그대로

### Hover state — 마우스 hover

Input/Textarea에 마우스 hover:
- border-color가 `var(--color-border-strong, var(--color-border-mid))`로 transition (선 진해짐)
- ppt에 `--color-border-strong` 미정의 → 우리 `--color-border-mid` fallback → light theme에서 `#D4D4D8`, dark theme에서 `#3F4A5C`. ppt dark는 border-mid value 그대로라 시각 변화 미세 (의도된 internal-only fallback). 추후 host가 더 진한 border 색 정의 시 의미 명확해짐.

### Placeholder color

textarea/input에 텍스트 비우고 placeholder 시인성 확인:
- WCAG 1.4.3 (4.5:1 small text) 충족 여부
- `opacity: 1` 명시되어 Firefox default <1 함정 회피

### Textarea resize prop

```tsx
<Textarea resize="none" />  // resize handle 제거
<Textarea resize="vertical" />  // default, 우측 하단 handle
<Textarea resize="both" />  // 우측 하단 양방향 handle
<Textarea disabled />  // disabled 시 resize 'none' 강제
```

## 다음 단계

Phase 10 closure 후 후속 dogfood 후보:
- **Trial 4 (Outline page)**: Home 외 페이지로 표면 확장, layout primitive(Box/Stack/Text)도 검증.
- **Phase 11 후보**: trial-4에서 발견된 needs 반영.
- **future-work** (ADR-011 트레이드오프 6 그대로): aria-disabled / autofill webkit / readonly / Card overflow + focus obscured / AAA 2.4.13 — dogfood needs 등장 시 별도 ADR.

## 산출물

- `pkg-out/trial-3-phase10-default.png` — ADR-011 적용 후 default 회귀 0 입증
- `docs/dogfood-trial-3-recapture.md` — 비교 대조 (Phase 09)
- ADR-011 (`docs/ADR.md`)
- `packages/web/src/{Button,Input,Textarea,Checkbox,Radio,Switch}/*.tsx` — ensureCssInjected 패턴
