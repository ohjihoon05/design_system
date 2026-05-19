# Phase 24 — SortableList: Tasks (의존성 순)

## T1. dnd-kit 3 deps 추가
- [ ] `packages/web/package.json`에 `@dnd-kit/core@^6.3.1`, `@dnd-kit/sortable@^9.0.0`, `@dnd-kit/utilities@^3.2.2` regular dep으로 추가.
- [ ] `pnpm install` 실행 → lock 갱신.
- **완료 기준**: `node_modules/@dnd-kit/*` 3개 디렉토리 존재. `pnpm -F @wonik/web build` 진행 가능.
- **보안 관련**: 새 dep 도입은 supply-chain 영향. ppt가 이미 같은 버전 사용 중이라 검증된 surface.

## T2. types.ts 작성
- [ ] `SortableListProps<T>` generic interface — items, getKey, renderItem, onReorder, direction, disabled, className, style.
- [ ] `RenderItemArgs` — dragHandleProps, isDragging, setNodeRef, itemStyle.
- **완료 기준**: TS compile 통과. generic이라 다양한 item 타입 받기 OK.
- **보안 관련**: 없음.

## T3. 테스트 작성 (TDD test-first)
- [ ] `packages/web/src/SortableList/SortableList.test.tsx` — 12 tests:
  - 렌더 (3): items length만큼 호출 / 빈 배열 / direction 전달
  - a11y (3): role/aria-roledescription/tabIndex / dragHandleProps spread / disabled=-1
  - reorder (3): onReorder(from,to) / same → no call / not-in-items → no call
  - controlled (1): items rerender 즉시 반영
  - disabled (2): useSortable disabled / renderItem 호출 여부
- 이 시점에 SortableList.tsx 없으므로 모듈 not found fail이 정상.
- **완료 기준**: 12 test 작성됨, 모듈 not found 에러 또는 모든 test fail.
- **보안 관련**: a11y test가 keyboard accessibility 보장.

## T4. SortableItem.tsx (internal wrapper) 구현
- [ ] `useSortable({ id, disabled })` 호출 → attributes/listeners/setNodeRef/transform/transition/isDragging 받기.
- [ ] dragHandleProps = `{ ...attributes, ...listeners }`.
- [ ] itemStyle = `{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1, zIndex: isDragging ? 10 : 'auto' }`.
- [ ] renderItem(item, idx, { dragHandleProps, isDragging, setNodeRef, itemStyle }) 호출.
- **완료 기준**: useSortable의 args가 renderItem args로 정확히 전달됨.
- **보안 관련**: 없음.

## T5. SortableList.tsx (public API) 구현
- [ ] DndContext + sensors (Pointer distance:8 + Keyboard sortableKeyboardCoordinates) 설정.
- [ ] SortableContext + items.map(getKey)로 ids 배열 전달.
- [ ] strategy: vertical default, horizontal prop.
- [ ] handleDragEnd: active.id/over.id로 from/to 계산 + onReorder 호출.
- [ ] 한국어 announcements 4개 default.
- [ ] items.map → SortableItem 렌더.
- **완료 기준**: T3 12 test 모두 PASS.
- **보안 관련**: 없음 (presentation).

## T6. barrel + export
- [ ] `packages/web/src/SortableList/index.ts` — re-export.
- [ ] `packages/web/src/index.ts` — `export { SortableList } from './SortableList'` + types.
- **완료 기준**: `import { SortableList } from '@wonik/web'` 가능. `pnpm -F @wonik/web build` 통과.
- **보안 관련**: 없음.

## T7. Ladle story 추가
- [ ] `apps/ladle/src/stories/layout-SortableList.stories.tsx` — 4-5 story:
  - Basic (text list)
  - WithCustomHandle (⠿ 핸들만 drag)
  - Horizontal
  - Disabled
  - RealisticOutlineCard (Card + Badge + InlineEditableText)
- **완료 기준**: `pnpm -F ladle dev`에서 story 4-5개 보이고 마우스 drag 작동.
- **보안 관련**: 없음.

## T8. Changeset
- [ ] `.changeset/24-sortable-list.md` — `@wonik/web` minor bump.
- 본문: SortableList + dnd-kit dep 3개 추가 + generic API + a11y + dogfood 자리 명시.
- **완료 기준**: changeset 파일 생성.
- **보안 관련**: 새 dep 도입 명시는 정직성.

## T9. ROADMAP closure
- [ ] `docs/ROADMAP.md` §M2.b 표에서 Phase 5b 행을 `✅ 2026-05-19 (Phase 24)`로 마킹.
- **완료 기준**: 23 atom 도달 반영. M2.b 완료 표시.
- **보안 관련**: 없음.

## T10. (security task) 토큰 하드코딩 grep
- [ ] `grep -nE "#[0-9a-fA-F]{3,8}|[0-9]+px|[0-9]+rem" packages/web/src/SortableList/*.tsx` — opacity/zIndex 외 0건.
- 단, dnd-kit 표준 CSS 값(opacity:0.4, zIndex:10, distance:8)은 spec §3에 허용 명시 — atom이 dnd-kit standard에 맞추는 거라 OK.
- **완료 기준**: brand color / 토큰 가능한 spacing 하드코딩 0건.
- **보안 관련**: 디자인 시스템 무결성.

## T11. (security task) keyboard a11y self-check
- [ ] item에 Space/Enter로 grab 가능.
- [ ] 방향키로 move 가능.
- [ ] Space/Enter로 drop.
- [ ] Esc로 cancel.
- [ ] 한국어 announcements 발화 (DOM aria-live 영역에 텍스트 출현).
- **완료 기준**: 5개 keyboard 조작 모두 Ladle에서 manual 또는 unit test에서 simulation으로 검증.
- **보안 관련**: WCAG 2.1.1 keyboard accessibility.

## T12. Self-test
- [ ] `pnpm -F @wonik/web test --run SortableList` — 12 tests PASS.
- [ ] `pnpm -F @wonik/web test --run` — 전체 330+ PASS (회귀 0).
- [ ] `pnpm -F @wonik/web build` — ESM/CJS/DTS 성공.
- **완료 기준**: 모두 PASS.

## T13. Commit + push
- [ ] git add: 신규/수정 파일만 명시.
- [ ] commit: `feat(24-sortable-list): SortableList atom — 23 atom 도달 (M2.b Phase 5b closure)`.
- [ ] push origin feat/demo-fab-monitor-polish.
- **완료 기준**: 원격 반영.

---

## 의존성 그래프

```
T1 (dnd-kit deps) ──┐
                    ▼
T2 (types) ──► T3 (test-first) ──► T4 (SortableItem) ──► T5 (SortableList)
                                                              │
                                                              ├─► T6 (barrel + export)
                                                              ├─► T7 (Ladle)
                                                              ├─► T8 (changeset)
                                                              └─► T9 (ROADMAP)

T10 (hardcoding grep) ── T5 후
T11 (a11y check) ── T5 후

T12 (self-test) ── T5~T9 후
T13 (commit + push) ── T12 후
```
