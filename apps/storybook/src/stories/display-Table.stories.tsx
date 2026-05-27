import { Table, Badge, Stack, Text } from '@wonik/web';
import type { Column } from '@wonik/web';

export default { title: 'display/Table' };

// Figma node 241:6897 (HMI Fab 모니터링) Load Port Information 영감 — 단순 조회 use case.
interface Chamber {
  id: string;
  name: string;
  recipe: string;
  cycle: string;
  status: 'Ready' | 'Manual' | 'Empty';
}

const chambers: Chamber[] = [
  { id: 'pmc1', name: 'PMC1 [GasFill]', recipe: 'Recipe A', cycle: '0 / 0', status: 'Ready' },
  { id: 'pmc2', name: 'PMC2 [GasFill]', recipe: 'Recipe B', cycle: '2 / 5', status: 'Manual' },
  { id: 'pmc3', name: 'PMC3 [GasFill]', recipe: '—', cycle: '0 / 0', status: 'Empty' },
];

const basicColumns: Column<Chamber>[] = [
  { id: 'name', header: 'Chamber', accessor: 'name' },
  { id: 'recipe', header: 'Recipe', accessor: 'recipe' },
  { id: 'cycle', header: 'Cycle', accessor: 'cycle' },
  { id: 'status', header: 'Status', accessor: 'status' },
];

export const Basic = () => (
  <Table columns={basicColumns} data={chambers} style={{ maxWidth: 600 }} />
);

export const WithCaption = () => (
  <Table
    columns={basicColumns}
    data={chambers}
    caption="Chamber load port information"
    style={{ maxWidth: 600 }}
  />
);

export const Zebra = () => (
  <Table columns={basicColumns} data={chambers} zebra style={{ maxWidth: 600 }} />
);

export const StickyHeader = () => {
  // 시연을 위해 rows 30개로 늘려서 scroll 안에서 thead 고정 확인
  const many: Chamber[] = Array.from({ length: 30 }, (_, i) => ({
    id: String(i),
    name: `PMC${(i % 9) + 1} [GasFill]`,
    recipe: `Recipe ${String.fromCharCode(65 + (i % 6))}`,
    cycle: `${i % 5} / ${(i % 5) + 3}`,
    status: (['Ready', 'Manual', 'Empty'] as const)[i % 3],
  }));
  // scrollable region은 keyboard accessible 필수 (axe scrollable-region-focusable, WCAG 2.1.1):
  // tabIndex=0 + role="region" + aria-label로 sr 사용자에게 region 정체 announce.
  // jsx-a11y/no-noninteractive-tabindex는 axe와 충돌(둘이 정반대 권고) — axe 우선
  // (ADR-027 escape-hatch policy: consumer 앱 disable 자유).
  return (
    <div
      style={{ maxWidth: 600, maxHeight: 280, overflowY: 'auto' }}
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- axe scrollable-region-focusable 우선 (ADR-027)
      tabIndex={0}
      role="region"
      aria-label="Chamber list scrollable"
    >
      <Table columns={basicColumns} data={many} stickyHeader />
    </div>
  );
};

export const StatusBadgeCell = () => {
  // col.cell로 status 컬럼만 Badge로 렌더 — Figma 화면처럼 status 시각화
  const cols: Column<Chamber>[] = [
    ...basicColumns.slice(0, 3),
    {
      id: 'status',
      header: 'Status',
      accessor: 'status',
      cell: (v) => <Badge variant={v === 'Ready' ? 'primary' : 'neutral'}>{String(v)}</Badge>,
    },
  ];
  return <Table columns={cols} data={chambers} style={{ maxWidth: 600 }} />;
};

export const Empty = () => (
  <Stack gap={4}>
    <div>
      <Text variant="labelSm" color="dim">기본 emptyMessage</Text>
      <Table columns={basicColumns} data={[]} style={{ maxWidth: 600 }} />
    </div>
    <div>
      <Text variant="labelSm" color="dim">custom emptyMessage</Text>
      <Table
        columns={basicColumns}
        data={[]}
        emptyMessage="등록된 chamber가 없습니다."
        style={{ maxWidth: 600 }}
      />
    </div>
  </Stack>
);
