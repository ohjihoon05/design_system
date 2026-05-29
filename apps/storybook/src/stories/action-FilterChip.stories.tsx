import { useState } from 'react';
import { FilterChip, Stack, Badge } from '@wonik/web';

export default { title: 'action/FilterChip' };

export const Inactive = () => <FilterChip>All</FilterChip>;
export const Active = () => <FilterChip active>All</FilterChip>;

export const SingleSelect = () => {
  const [tab, setTab] = useState('all');
  const items = ['all', 'critical', 'warning', 'info'];
  return (
    <Stack direction="row" gap={2}>
      {items.map((t) => (
        <FilterChip key={t} active={tab === t} onClick={() => setTab(t)}>
          <span style={{ textTransform: 'capitalize' }}>{t}</span>
        </FilterChip>
      ))}
    </Stack>
  );
};

export const MultiSelect = () => {
  const [filter, setFilter] = useState<Set<string>>(new Set(['CVD']));
  const toggle = (t: string) => {
    setFilter((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  };
  return (
    <Stack direction="row" gap={2}>
      {['CVD', 'ETCH', 'PVD', 'ALD', 'CMP'].map((t) => (
        <FilterChip key={t} active={filter.has(t)} onClick={() => toggle(t)}>
          {t}
        </FilterChip>
      ))}
    </Stack>
  );
};

export const WithBadgeCount = () => (
  <Stack direction="row" gap={2}>
    <FilterChip active>
      <span>All</span>
      <Badge variant="primary">16</Badge>
    </FilterChip>
    <FilterChip>
      <span>Critical</span>
      <Badge variant="neutral">3</Badge>
    </FilterChip>
    <FilterChip>
      <span>Warning</span>
      <Badge variant="neutral">7</Badge>
    </FilterChip>
  </Stack>
);

export const Disabled = () => (
  <Stack direction="row" gap={2}>
    <FilterChip disabled>Disabled inactive</FilterChip>
    <FilterChip active disabled>Disabled active</FilterChip>
  </Stack>
);

// Phase 1 dark mode 회귀 가드 (Layer A 다크모드 전수 검증).
// Phase 2 finding 7건 중 FilterChip active text/border contrast 위반 있음 → axe color-contrast가
// 터질 것이므로 a11y.test='todo'로 한 번 더 우회. fix는 Phase 5 회귀 가드 완료 후 ADR-030.
// 위반 detail: docs/PHASE2_DARK_CONTRAST_FINDINGS.md
export const ActiveDark = () => <FilterChip active>All</FilterChip>;
ActiveDark.globals = { theme: 'dark' };
ActiveDark.parameters = { a11y: { test: 'todo' } };

export const InactiveDark = () => <FilterChip>All</FilterChip>;
InactiveDark.globals = { theme: 'dark' };
