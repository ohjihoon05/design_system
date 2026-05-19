---
'@wonik/web': minor
---

`InlineEditableText` atom 추가 — ROADMAP §M2.b Phase 5a (분할 closure).

ppt OutlineCard.tsx 75-93줄의 인라인 편집 boilerplate(useState×2 + useEffect sync + Input+keydown+blur 토글 30줄)를 한 줄로 흡수.

**API**:
```tsx
<InlineEditableText
  value={title}
  onChange={setTitle}
  trigger="single"        // 'single' | 'double'
  saveOnBlur={true}       // false면 onBlur=cancel
  selectOnFocus={true}    // 편집 진입 시 select-all
  as="h2"                 // 표시 모드 element tag — span / p / h1-h4
  size="md"               // sm / md / lg (Input pass-through)
  placeholder="..."       // empty value 시 표시
  disabled={false}
  ariaLabel="슬라이드 제목"
/>
```

**키보드**: 표시 모드에서 Enter / Space로 편집 진입. 편집 모드에서 Enter=save, Escape=cancel.
**a11y**: 표시 모드 `role="button"` + `aria-label` 자동 (value fallback). focus indicator outline 2px (WCAG 2.4.7 AA).
**토큰**: 모두 `interfaceColors.*` + `fontSize.*` + `fontFamily.base` 경유, 하드코딩 0.

dogfood 자리(별도 ppt PR): `ppt/.../OutlineCard.tsx` 30→3줄 교체.

**관련**: Phase 5b SortableList는 별도 phase로 분리(dnd-kit wrap + WAI-ARIA keyboard drag 패턴 필요).
