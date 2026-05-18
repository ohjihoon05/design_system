import { Stack, Text } from '@wonik/web';
import type { Equipment } from '../data/types';
import { StatusBadge } from './StatusBadge';
import { ProgressBar } from './ProgressBar';
import { injectCss, FOCUS_RING } from '../lib/injectCss';

injectCss('equipment-row', `
  .demo-eq-row {
    display: flex;
    align-items: center;
    gap: 12px;
    border-radius: 5px;
    border: 1px solid transparent;
    background: transparent;
    transition: background 100ms ease-out;
  }
  .demo-eq-row[data-interactive="true"] {
    cursor: pointer;
  }
  .demo-eq-row[data-interactive="true"]:hover {
    background: var(--color-surface-subtle);
  }
  .demo-eq-row[data-selected="true"] {
    background: var(--color-primary-bg);
    border-color: var(--color-primary-stroke);
  }
  .demo-eq-row[data-selected="true"]:hover {
    background: var(--color-primary-bg);
  }
  .demo-eq-row[data-interactive="true"]:focus-visible {
    ${FOCUS_RING}
  }
`);

interface EquipmentRowProps {
  equipment: Equipment;
  onClick?: (id: string) => void;
  selected?: boolean;
  dense?: boolean;
}

export function EquipmentRow({ equipment, onClick, selected, dense }: EquipmentRowProps) {
  const interactive = !!onClick;
  return (
    <div
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      data-interactive={interactive}
      data-selected={!!selected}
      className="demo-eq-row"
      onClick={interactive ? () => onClick!(equipment.id) : undefined}
      onKeyDown={interactive
        ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick!(equipment.id); } }
        : undefined
      }
      style={{ padding: dense ? '8px 12px' : '12px 12px' }}
    >
      <Stack gap={1} style={{ minWidth: 100 }}>
        <Text variant="titleSm" weight="medium" color="dark">{equipment.name}</Text>
        <Text variant="labelSm" color="dim">{equipment.type} · {equipment.bay}</Text>
      </Stack>

      <div style={{ flex: 1, minWidth: 0 }}>
        {equipment.status === 'run' && equipment.lotId ? (
          <Stack gap={2}>
            <Stack direction="row" justify="between" align="center" gap={3}>
              <Text variant="labelSm" color="dim" truncate>{equipment.lotId} · {equipment.recipe}</Text>
              <Text variant="labelSm" color="dark" style={{ fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>{equipment.progress}%</Text>
            </Stack>
            <ProgressBar value={equipment.progress} tone="primary" />
          </Stack>
        ) : (
          <Text variant="labelSm" color="dim" truncate>
            {equipment.recipe ? `${equipment.recipe}` : '—'}
          </Text>
        )}
      </div>

      <div style={{ flexShrink: 0 }}>
        <StatusBadge status={equipment.status} />
      </div>
    </div>
  );
}
