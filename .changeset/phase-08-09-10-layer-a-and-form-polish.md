---
"@wonik/tokens": minor
"@wonik/web": minor
---

Phase 08+09+10: layer A contract 정착 + form 컨트롤 polish

### ADR

- **ADR-010**: host-디자인 시스템 CSS variable contract. interface variable 6개(`--color-bg`/`--color-surface`/`--color-border`/`--color-text`/`--color-text-muted`/`--color-primary`) + cascade fallback 패턴(`var(--color-X, var(--color-X-internal))`). host가 같은 이름 변수 정의 시 host 우선, 미정의 시 우리 internal로 fallback. ppt dogfood Trial 3에서 노출된 invisibility 결함 해결.
- **ADR-011**: form 컨트롤 focus·resize·placeholder·hover 정책. `:focus-visible` outline 2px + `--color-focus` 7번째 interface variable 격상 + Input/Textarea `:hover` border 진해짐 + `::placeholder` opacity:1 명시 + Textarea `resize?` prop 노출. WCAG 2.1 SC 2.4.7 AA 충족.

### `@wonik/tokens` (minor)

- 새 named export: `interfaceColors` (7 keys — `bg`/`surface`/`border`/`text`/`textMuted`/`primary`/`focus`). 각 키는 cascade fallback 형태 `var(--color-X, var(--color-X-internal))` 반환.
- `tokens.css` light/dark 양쪽에 새 alias emit (5개): `--color-bg`, `--color-text`, `--color-text-muted`, `--color-focus`, `--color-border-strong`.
- 기존 export(`surfaces`/`text`/`borders`/`primary` 등) 그대로 유지. BC 0.

### `@wonik/web` (minor)

- 컴포넌트 8개(Button·Input·Textarea·Spinner·Switch·Radio·Checkbox·Text)의 색 reference를 `interfaceColors.*`로 갱신. 의미상 매핑 안 되는 경우(Button primary variant의 흰 텍스트, Switch thumb 흰 점)는 internal 그대로.
- form 컨트롤 6개(Button·Input·Textarea·Checkbox·Radio·Switch)에 module-scope `ensureCssInjected()` 패턴 적용. `:focus-visible`/`:hover`/`::placeholder` CSS block + className `wonik-X` 부여. consumer className은 머지 보존. SSR 가드 포함.
- **Textarea**: `resize?: 'none' | 'vertical' | 'both'` prop 추가 (default `'vertical'`, disabled 시 `'none'` 강제). BC compatible — 기존 사용처 영향 0.
- prop signature 변경 없음 — 신규 optional prop(Textarea의 `resize?`)만 추가. breaking 0.
- 163 tests passing (회귀 0).
