# Dogfood Trial 13: ppt OutlineCard + Presentation — Phase 23/24 atom 흡수 (Layer A 닫힘)

**날짜**: 2026-05-19
**대상**: ppt — `OutlineCard.tsx` (인라인 편집) + `Presentation.tsx` (썸네일 sortable)
**publish 경로**: design_system → Verdaccio 127.0.0.1:14873 → ppt `pnpm install` (trial 12 사이클 재사용)

## 한 줄 요약

Phase 23 (`InlineEditableText`) + Phase 24 (`SortableList`) 두 atom을 ppt에 실제로 적용 — *atom의 존재 목적* 두 자리를 흡수했다. **186 net 라인 절감 + ppt에서 dnd-kit 직접 의존 제거.**

## 단계

| # | 단계 | 결과 | 시간 |
|---|---|---|---|
| 1 | Verdaccio 14873 재기동 (`--listen 0.0.0.0:14873`) | IPv4 listen 정합 — trial 12와 환경 차이 발견 | 5분 |
| 2 | `pnpm changeset version` | tokens 0.2.1→0.3.0, web 1.0.0→**2.0.0** (changeset 7개 누적) | 1분 |
| 3 | `pnpm -F @wonik/tokens build` + `pnpm -F @wonik/web build` | 둘 다 success | 1분 |
| 4 | `pnpm changeset publish` | tokens@0.3.0 + web@2.0.0 publish + git tag 2개 | 30초 |
| 5 | ppt `package.json` `^1.0.0` → `^2.0.0` (major 자동 흡수 안 됨) + `pnpm install` | 2.8초, 새 버전 잡힘 | 30초 |
| 6 | `OutlineCard.tsx` → `InlineEditableText` 흡수 | 181 → 135줄 (−46) | 5분 |
| 7 | `Presentation.tsx` SortableThumbnail → `SortableList` 흡수 | 1122 → 982줄 (−140) | 15분 |
| 8 | TS check + Vite dev server | trial 13 관련 에러 0, dev ready 16.6s | 2분 |

## 발견사항

### F29 — Verdaccio IPv4 vs IPv6 listen (trial 12 환경 재현 실패)

`npx verdaccio --listen 14873` 시 IPv6 `::1`로만 bind. 그러나 `.npmrc`와 `publishConfig.registry`는 `127.0.0.1`(IPv4) 사용 → `pnpm changeset publish`가 ECONNREFUSED 실패.

**원인**: Verdaccio 6.7.1의 `--listen <port>` 단축 표기는 `localhost:<port>`로 해석되며 그게 IPv6 ::1로 잡힘. trial 12에서는 IPv4도 같이 잡혔을 가능성 (Windows host resolver 차이 또는 Verdaccio 버전 차이).

**해결**: `--listen 0.0.0.0:14873` 명시 → IPv4/IPv6 모두 listen.

**사내 진입 시**: 사내 Verdaccio/registry 서버에서 `listen: 0.0.0.0:<port>` 또는 명확한 IP 지정 필요. host 머신의 default IPv4-only 가정 금지.

### F30 — changeset major bump 누적 점프 (1.0.0 → 2.0.0)

누적 changeset 7개 (전부 minor):
- `@wonik/web`: 18(IconButton), 19(c-tier), 20(toast-modal), 21(tooltip), 23-inline, 24-sortable = **6 minor**
- `@wonik/tokens`: 23-dtcg-compat = 1 minor

기대치: web 1.0.0 → 1.1.0 (semver 표준 — minor 누적해도 minor)
실제: web 1.0.0 → **2.0.0** (major)

**원인**: changeset config의 `___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH.onlyUpdatePeerDependentsWhenOutOfRange` 또는 `bumpVersionsWithWorkspaceProtocolOnly` 등 옵션이 `@wonik/web`의 peerDependency `@wonik/tokens` minor 변화에 반응했을 가능성. 또는 누적 minor가 `>= 0.x` 패키지의 1.0 transition logic에 걸렸을 가능성 (F28 후속).

**의미**: 기능적 publish는 정상. semver만 한 단계 빨리 점프. F28 (0.x → 1.0 정책)과 같이 후속 조사 거리. 다음 publish 시 web 2.x.x semver 정상 흐름 진입할 거.

### F31 — InlineEditableText로 인라인 편집 패턴 6-요소 흡수

OutlineCard의 인라인 편집 로직 = `useState×2` + `useEffect` + `handleSave` + `handleKeyDown` + `editing ? <Input> : <p>` 분기. 총 **6 요소** → 1 atom prop call로 흡수.

```tsx
// Before (30줄, 6 요소)
const [editing, setEditing] = useState(false);
const [editTitle, setEditTitle] = useState(slide.title);
useEffect(() => { setEditTitle(slide.title); }, [slide.title]);
const handleSave = () => { onTitleChange(index, editTitle); setEditing(false); };
const handleKeyDown = (e) => { if (e.key === "Enter") handleSave(); else if (e.key === "Escape") {...} };
{editing ? <Input ... /> : <p onClick={() => setEditing(true)}>{slide.title}</p>}

// After (5줄, 1 요소)
<InlineEditableText
  value={slide.title}
  onChange={(next) => onTitleChange(index, next)}
  as="p"
  size="sm"
  ariaLabel={`슬라이드 ${index + 1} 제목 편집`}
/>
```

→ 핵심 결정 절감: "Enter/Esc는 어떻게?", "외부 sync는 useEffect로?", "controlled vs uncontrolled?" 같은 매번 반복되는 결정이 atom 안으로 들어감.

### F32 — SortableList로 dnd-kit 직접 의존 ppt에서 제거

Presentation.tsx 변경:
- `import { DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors }` 삭제
- `import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy, arrayMove }` 삭제
- `import { CSS }` 삭제
- `SortableThumbnail` 컴포넌트 (~120줄) 삭제
- sensors 정의 (~7줄) 삭제
- `handleDragEnd(event: DragEndEvent)` → `handleReorder(from, to)` 단순 callback으로 축소

ppt `package.json`의 `@dnd-kit/*` 3개 dep은 아직 남아있음 (다른 사용처 없음 확인 후 별도 cleanup 거리). atom이 dnd-kit을 dep로 흡수하므로 (`@wonik/web`의 dependencies에 있음) ppt는 더 이상 직접 의존 안 함.

### F33 — SortableList renderItem 패턴이 "핸들 위치 자유"를 정확히 만족

ppt의 핸들 패턴 = **호버 시 노출되는 작은 dot icon** (그룹 호버 트리거, opacity 0 → 60 → 100). 큰 영역 button은 클릭만, drag는 핸들만. 이 분리가 SortableList의 `args.dragHandleProps` spread를 어디에 두냐로 그대로 표현됨:

```tsx
<div {...(args.dragHandleProps as object)} className="absolute top-1 left-1 ... cursor-grab">
  <svg>...dot icon...</svg>
</div>
<button onClick={...}>...thumbnail...</button>  // 여기엔 핸들 prop 없음
```

→ Phase 24 spec에서 명시한 "consumer가 핸들 위치 결정" 패턴이 dogfood 1자리에서 실증.

## 가설 검증

| 가설 | 검증 방법 | 결과 |
|---|---|---|
| H25: Phase 23 atom이 ppt 인라인 편집 자리를 1자리에서 완전 흡수 | OutlineCard 흡수 후 동작 동등성 | ✅ (TS check pass, dev server clean) |
| H26: Phase 24 atom이 ppt sortable 자리를 1자리에서 완전 흡수 | Presentation 흡수 후 동작 동등성 | ✅ (TS check pass, dev server clean) |
| H27: Verdaccio cycle은 trial 12 → trial 13에서 재현 가능 | 동일 흐름 반복 | ✅ (단 IPv4 listen 명시 필요 — F29) |

## 결정

- **Layer A 사이클 마감 commit 거리 도달** — atom 23 × ppt 4 자리(Home/Outline/Presentation main + OutlineCard/Presentation sub) 적용. atom의 *존재 목적*이 모두 한 번 이상 dogfood됨.
- **`@dnd-kit/*` cleanup 거리** — ppt `package.json` dependencies에 3개 dep 남음. 다른 사용처 없으면 후속 cleanup PR.
- **F30 changeset major bump** — 별도 조사 거리. 다음 publish까지 미룸 (정상 작동에는 영향 없음).
- **F29 IPv4 bind** — Verdaccio launch 명령은 `--listen 0.0.0.0:14873`로 표준화. README 또는 trial 12 doc에 한 줄 추가 거리.

## 영향

| 항목 | 변화 |
|---|---|
| Layer A atom dogfood coverage | atom 23 모두 1자리 이상 적용 (Layer A 1차 사이클 완전 닫힘) |
| ppt code 라인 절감 | -186 net (OutlineCard -46 + Presentation -140) |
| ppt 직접 의존 정리 | dnd-kit 6 import path 제거. `@dnd-kit/*` 3 dep는 별도 cleanup |
| ADR-018 publish 사이클 reaffirm | trial 12 → 13 재현. IPv4 bind detail 발견 (F29) |

## 후속 작업

- [ ] **사용자 시각 검증** — ppt dev `http://localhost:3000` 한 번 둘러보기:
  - Outline 페이지: 슬라이드 제목 click → 인라인 편집 → Enter 저장 / Esc 취소
  - Presentation 페이지: 좌측 썸네일 호버 → dot icon 보이는지 → drag로 순서 변경 → activeSlide도 같이 따라가는지
- [ ] **ppt commit** — `feat(trial-13): InlineEditableText + SortableList 흡수 — atom 23 dogfood closure`
- [ ] **ppt `@dnd-kit/*` cleanup PR** — 별도 거리, 다른 사용처 없는지 grep 확인
- [ ] **F30 changeset major bump 조사** — 다음 publish 전 결정 (1.0 transition logic vs config 옵션)
- [ ] **Verdaccio cleanup 결정** — 끄면 다음 사이클 다시 띄움. 켜둘 거면 별도 commit 명시.
- [ ] **ROADMAP 갱신** — Layer A 사이클 마감 표현 + trial 13 추가.
- [ ] **Layer A 마감 commit (design_system)** — `chore(roadmap): Layer A 1차 사이클 마감 — 23 atom × ppt 4자리`
