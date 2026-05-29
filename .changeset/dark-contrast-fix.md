---
"@wonik/tokens": minor
---

theme-dark: WCAG 2.1 AA contrast fix — 3 leaf hex 조정 (ADR-032).

### 동기

Phase 2 (2026-05-28) 측정에서 dark mode contrast 7 violations 발견 (`docs/PHASE2_DARK_CONTRAST_FINDINGS.md`). Phase 1·3·5 회귀 가드 완료 (2026-05-29 commit `26ed34b`) 후 본 변경으로 5 violations closure (Input/Textarea border + placeholder, InlineEditableText muted, FilterChip active text). FilterChip active border / Button outline border 2 violations는 사내 design 협의 대기로 보류 (`primaryDark.base` brand 영향).

### 변경 — 3 leaf (key set 불변)

- `bordersDark.mid`: `#52525C` → `#82828A`
  → Input/Textarea/Button outline border가 surface(#1E1E21) 위 2.15·canvas(#343434) 위 1.61 (UI 3.0:1 미달) → 새 값은 surface 위 ≈ 4.59 · canvas 위 ≈ 3.41 통과.
- `textDark.dim`: `#71717B` → `#A0A0A8`
  → Input/Textarea placeholder + InlineEditableText muted text가 canvas 위 2.58 (Text 4.5:1 미달) → 새 값은 canvas 위 ≈ 4.92 · surface 위 ≈ 6.61 통과.
- `primaryDark.selected`: `#6B82CC` → `#8FA3DD`
  → FilterChip active text on `primaryDark.bg` (#2A3556) 가 3.27 (Text 4.5:1 미달) → 새 값은 ≈ 4.93 통과.

### 보류 (사내 design 협의 후 별도)

- `primaryDark.base` (`#4A65B8`) / `primaryDark.stroke` (`#4A65B8`) — FilterChip active border + Button outline 의 brand color. ADR-007 WONIK BLUE 의 dark 적응이라 brand 인지 영향 — 사내 협의 후 별도 ADR.
- `primaryDark.bg` (`#2A3556`) — `selected` 변경만으로 4.5:1 충족이라 조정 불필요. 추가 buffer 필요 시 follow-up.

### 변경 안 함 (Figma 정합 별개 source)

- `buttonTokensDark.default.outline` `#52525C` — ADR-023 source-of-truth (Figma).
- `tableTokensDark.surface.outline` `#52525C` + `littleTableOutline` `#52525C` — ADR-025 source.
- `tableTokensDark.empty.text` `#71717B` — ADR-025 source.
- `bordersDark.panelDark` `#52525C` — 패널용 별개 토큰.

### scope

- **값만 변경, key set 불변** — `theme-light`과 1:1 유지(ADR-020 룰 4). API 변동 0.
- dark 모드 consumer는 시각 변화 발생 (border 더 밝게 / placeholder + muted 더 밝게 / active chip text 더 밝게). light 모드 영향 0.
- **bump 분류 — minor 강제** (ADR-024 정책 후속 3축 미충족: Figma source 아님 + perceptible threshold 초과). visible to host → explicit upgrade decision 필요.

ADR-032. 측정 원문: `docs/PHASE2_DARK_CONTRAST_FINDINGS.md`. 회귀 guard: 25 test files / 347 tests passed (no regression).
