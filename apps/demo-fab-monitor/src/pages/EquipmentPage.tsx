import { useMemo, useState } from 'react';
import { Card, Stack, Text, Input, Checkbox, Button } from '@wonik/web';
import type { Equipment, EquipmentType } from '../data/types';
import { StatusBadge } from '../components/StatusBadge';
import { ProgressBar } from '../components/ProgressBar';
import { IconSearch, IconX } from '../icons';
import { FilterChip } from '../components/internal/FilterChip';
import { IconButton } from '../components/internal/IconButton';
import { injectCss, FOCUS_RING } from '../lib/injectCss';

injectCss('equipment-table', `
  .demo-equip-row {
    cursor: pointer;
    transition: background 100ms ease-out;
  }
  .demo-equip-row:hover {
    background: var(--color-surface-subtle);
  }
  .demo-equip-row[data-selected="true"] {
    background: var(--color-primary-bg);
  }
  .demo-equip-row[data-selected="true"]:hover {
    background: var(--color-primary-bg);
  }
  .demo-equip-row:focus-visible {
    ${FOCUS_RING}
  }
  .demo-equip-check-label {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--color-text-dark);
    cursor: pointer;
    padding: 4px 6px;
    border-radius: 5px;
  }
  .demo-equip-check-label:focus-within {
    ${FOCUS_RING}
  }
`);

interface EquipmentPageProps {
  equipment: Equipment[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

const TYPES: EquipmentType[] = ['CVD', 'ETCH', 'PVD', 'ALD', 'CMP'];

export function EquipmentPage({ equipment, selectedId, onSelect }: EquipmentPageProps) {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<Set<EquipmentType>>(new Set());
  const [onlyAlarming, setOnlyAlarming] = useState(false);

  const filtered = useMemo(() => {
    return equipment.filter((eq) => {
      if (typeFilter.size > 0 && !typeFilter.has(eq.type)) return false;
      if (onlyAlarming && eq.status !== 'alarm') return false;
      if (query) {
        const q = query.toLowerCase();
        if (!eq.name.toLowerCase().includes(q) && !(eq.lotId ?? '').toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [equipment, query, typeFilter, onlyAlarming]);

  const selected = equipment.find((e) => e.id === selectedId) ?? null;

  const toggleType = (t: EquipmentType) => {
    setTypeFilter((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: selected ? 'minmax(0,1fr) 360px' : '1fr', gap: 16, alignItems: 'start' }}>
      <Card padding="md">
        <Stack gap={4}>
          <Stack direction="row" gap={3} align="center" wrap>
            <div style={{ flex: 1, minWidth: 220, maxWidth: 360 }}>
              <Input
                size="md"
                placeholder="Search by name or lot id…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                leftAddon={<IconSearch size={14} style={{ color: 'var(--color-text-dim)' }} />}
              />
            </div>
            <Stack direction="row" gap={2} align="center">
              {TYPES.map((t) => (
                <FilterChip key={t} active={typeFilter.has(t)} onClick={() => toggleType(t)}>
                  {t}
                </FilterChip>
              ))}
            </Stack>
            <label className="demo-equip-check-label">
              <Checkbox size="sm" checked={onlyAlarming} onChange={(e) => setOnlyAlarming(e.target.checked)} />
              <span>Alarming only</span>
            </label>
          </Stack>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ textAlign: 'left', color: 'var(--color-text-dim)', fontWeight: 500, fontSize: 11, letterSpacing: 0.4, textTransform: 'uppercase' }}>
                  <Th>Equipment</Th>
                  <Th>Type</Th>
                  <Th>Bay</Th>
                  <Th>Recipe</Th>
                  <Th>Lot</Th>
                  <Th>Progress</Th>
                  <Th>Temp</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ padding: 32, textAlign: 'center', color: 'var(--color-text-dim)' }}>
                      No equipment matches the filter.
                    </td>
                  </tr>
                )}
                {filtered.map((eq) => {
                  const isSelected = eq.id === selectedId;
                  return (
                    <tr
                      key={eq.id}
                      tabIndex={0}
                      data-selected={isSelected}
                      className="demo-equip-row"
                      onClick={() => onSelect(isSelected ? null : eq.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onSelect(isSelected ? null : eq.id);
                        }
                      }}
                      style={{ borderTop: '1px solid var(--color-border)' }}
                    >
                      <Td><Text variant="label" weight="medium" color="dark">{eq.name}</Text></Td>
                      <Td><Text variant="labelSm" color="dim">{eq.type}</Text></Td>
                      <Td><Text variant="labelSm" color="dim">{eq.bay}</Text></Td>
                      <Td><Text variant="labelSm" color="secondary">{eq.recipe ?? '—'}</Text></Td>
                      <Td><Text variant="labelSm" color="secondary">{eq.lotId ?? '—'}</Text></Td>
                      <Td style={{ width: 120 }}>
                        {eq.status === 'run'
                          ? <Stack gap={1}><Text variant="labelSm" color="dark" style={{ fontVariantNumeric: 'tabular-nums' }}>{eq.progress}%</Text><ProgressBar value={eq.progress} /></Stack>
                          : <Text variant="labelSm" color="dim">—</Text>}
                      </Td>
                      <Td><Text variant="labelSm" color="secondary" style={{ fontVariantNumeric: 'tabular-nums' }}>{eq.temperature.toFixed(1)} °C</Text></Td>
                      <Td><StatusBadge status={eq.status} /></Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Stack>
      </Card>

      {selected && (
        <Card padding="md">
          <Stack gap={5}>
            <Stack direction="row" justify="between" align="start">
              <Stack gap={1}>
                <Text variant="titleSm" weight="medium" color="dark" style={{ fontSize: 18 }}>{selected.name}</Text>
                <Text variant="labelSm" color="dim">{selected.type} · {selected.bay}</Text>
              </Stack>
              <IconButton
                aria-label="Close detail"
                variant="ghost"
                icon={<IconX size={14} />}
                onClick={() => onSelect(null)}
              />
            </Stack>

            <Stack direction="row" gap={2}>
              <StatusBadge status={selected.status} />
              <Text variant="labelSm" color="dim" style={{ alignSelf: 'center' }}>
                Uptime {selected.uptime.toFixed(1)} h
              </Text>
            </Stack>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Metric label="Recipe" value={selected.recipe ?? '—'} />
              <Metric label="Lot" value={selected.lotId ?? '—'} />
              <Metric label="Temperature" value={`${selected.temperature.toFixed(1)} °C`} />
              <Metric label="Pressure" value={`${selected.pressure.toFixed(2)} mTorr`} />
              <Metric label="Wafers today" value={selected.wafersToday.toString()} />
              <Metric label="Progress" value={selected.status === 'run' ? `${selected.progress}%` : '—'} />
            </div>

            {selected.status === 'run' && (
              <Stack gap={2}>
                <Text variant="labelSm" color="dim">Recipe progress</Text>
                <ProgressBar value={selected.progress} height={6} />
              </Stack>
            )}

            <Stack direction="row" gap={2}>
              <Button variant="primary" size="sm" onClick={() => console.info(`[demo] Open console for ${selected.id}`)}>Open in console</Button>
              <Button variant="outline" size="sm" onClick={() => console.info(`[demo] Show history for ${selected.id}`)}>History</Button>
            </Stack>
          </Stack>
        </Card>
      )}
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th style={{ padding: '10px 12px', borderBottom: '1px solid var(--color-border-mid)' }}>{children}</th>;
}

function Td({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <td style={{ padding: '12px', verticalAlign: 'middle', ...style }}>{children}</td>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <Stack gap={1}>
      <Text variant="labelSm" color="dim" style={{ letterSpacing: 0.3, textTransform: 'uppercase' }}>{label}</Text>
      <Text variant="label" weight="medium" color="dark" style={{ fontVariantNumeric: 'tabular-nums' }}>{value}</Text>
    </Stack>
  );
}
