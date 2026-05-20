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
