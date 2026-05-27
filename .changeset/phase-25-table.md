---
"@wonik/web": minor
---

feat(Table): Phase 25 — plain HTML `<table>` + `tableTokens` 흡수 atom 신설 (ADR-029).

### 동기

사용자 요구 (2026-05-27): **"회사에서 grid/table 많이 사용 — 꼭 만들어야"**. Layer A 1차 사이클 마감 (atom 23) 후 사내 evidence trigger 도달로 신규 atom 추가. web/app 영역 ("HMI는 이미지 베이스" 도메인 분리, ADR-001 유지).

### 변경

`Table` atom 신설 — generic `<T>` row 타입. props 4개 (`stickyHeader` / `zebra` / `emptyMessage` / `renderCell`) + 필수 `columns`/`data` + a11y `caption`. ~50줄, peer dep 0.

```tsx
import { Table } from '@wonik/web';
import type { Column } from '@wonik/web';

const cols: Column<Row>[] = [
  { id: 'name', header: 'Chamber', accessor: 'name' },
  { id: 'status', header: 'Status', accessor: 'status',
    cell: (v) => <Badge>{String(v)}</Badge> },
];
<Table columns={cols} data={rows} stickyHeader zebra caption="Chambers" />;
```

- 시각: `tableTokens`(ADR-025) 흡수 — bg / text / outline / titleBg / title. 새 토큰 추가 0.
- a11y: native `<table>` + `<caption>` + `<th scope="col">` — ADR-027 3-layer gate 통과.
- zebra는 module-scope CSS 1회 inject 패턴 (ADR-011, Card/Switch 동일).
- Column shape `{ id, header, accessor, cell }`은 TanStack `ColumnDef` 호환 — 확장 trigger 도달 시 props 안 깨짐.

### 확장 trigger (ADR-029a로 promote 시점)

사내 product 2자리 이상에서 sort/filter/pagination 요구 도착 시 → TanStack Table 도입 + 내부 리팩토링. props interface 안 바뀜.

### scope

- 신규 atom만 추가 — 기존 atom·토큰 영향 0, backward-compatible.
- 16 unit tests (Table.test.tsx) + 6 Storybook stories (Basic/WithCaption/Zebra/StickyHeader/StatusBadgeCell/Empty).
- atom count: 23 → 24 (Phase 25).

ADR-029. 매핑/도메인 분리: `docs/FIGMA_SEMANTIC_MAPPING_PLAN.md` §9.
