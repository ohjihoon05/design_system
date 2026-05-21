---
"@wonik/web": minor
---

SortableList: `announceItem` prop 추가 — 한국어 a11y announcement이 raw id(UUID 등)를 그대로 발음하던 한계 해소.

### 동기

Phase 24의 SortableList는 dnd-kit의 announcement 시스템을 한국어로 1:1 mapping(`${active.id} 항목을 잡았습니다...`)했지만, 실제 host(ppt Presentation thumbnail 등)에서는 `slide.id`가 UUID-like string이라 스크린리더가 "abc-123-def 항목을 잡았습니다"처럼 발음. 의미 전달 부족.

### 변경

`announceItem?: (id: string) => string` prop 추가. 기본은 id 그대로(`(id) => id`) — 기존 사용처 영향 0. host가 의미있는 label로 변환하려면:

```tsx
<SortableList<SlideSchema>
  items={slides}
  getKey={(s) => s.id}
  announceItem={(id) => {
    const idx = slides.findIndex((s) => s.id === id);
    return `슬라이드 ${idx + 1}`;
  }}
  /* ... */
/>
```

스크린리더가 "슬라이드 3 항목을 잡았습니다. 방향키로 이동..." 식으로 의미 전달.

### scope

- backward-compatible — 기존 import 모두 그대로 작동.
- internal: `KOREAN_ANNOUNCEMENTS` 상수 → `makeKoreanAnnouncements(labelOf)` factory로 전환. announceItem prop 변동 시 useMemo로 재생성.
- test +1 (announceItem prop 받아도 정상 render smoke). web 총 331 tests passing.

ROADMAP §"다음 호흡" polish #1 거리 closure.
