import { Stack, Text } from '@wonik/web';
import type { AlarmEvent } from '../data/types';
import { SeverityBadge } from './StatusBadge';
import { formatRelative } from '../data/useSimulation';
import { injectCss, FOCUS_RING } from '../lib/injectCss';

injectCss('alarm-row', `
  .demo-alarm-row {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 12px;
    border-radius: 5px;
    border: 1px solid transparent;
    background: transparent;
    transition: background 100ms ease-out;
  }
  .demo-alarm-row[data-interactive="true"] {
    cursor: pointer;
  }
  .demo-alarm-row[data-interactive="true"]:hover {
    background: var(--color-surface-subtle);
  }
  .demo-alarm-row[data-selected="true"] {
    background: var(--color-primary-bg);
    border-color: var(--color-primary-stroke);
  }
  .demo-alarm-row[data-selected="true"]:hover {
    background: var(--color-primary-bg);
  }
  .demo-alarm-row[data-acked="true"] {
    opacity: 0.7;
  }
  .demo-alarm-row[data-interactive="true"]:focus-visible {
    ${FOCUS_RING}
  }
`);

interface AlarmRowProps {
  alarm: AlarmEvent;
  onClick?: (id: string) => void;
  selected?: boolean;
  now: number;
}

export function AlarmRow({ alarm, onClick, selected, now }: AlarmRowProps) {
  const interactive = !!onClick;
  const dotColor =
    alarm.severity === 'critical' ? 'var(--color-status-alarm-text)'
    : alarm.severity === 'warning' ? 'var(--color-status-warning-dot)'
    : 'var(--color-text-dim)';

  return (
    <div
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      data-interactive={interactive}
      data-selected={!!selected}
      data-acked={alarm.acknowledged}
      className="demo-alarm-row"
      onClick={interactive ? () => onClick!(alarm.id) : undefined}
      onKeyDown={interactive
        ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick!(alarm.id); } }
        : undefined
      }
    >
      <span style={{ marginTop: 4, width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: dotColor }} />
      <Stack gap={1} style={{ flex: 1, minWidth: 0 }}>
        <Stack direction="row" align="center" gap={2}>
          <Text variant="label" weight="medium" color="dark">{alarm.equipmentName}</Text>
          <Text variant="labelSm" color="dim">· {alarm.code}</Text>
          {alarm.acknowledged && (
            <Text variant="labelSm" color="dim" style={{ marginLeft: 'auto' }}>ack</Text>
          )}
        </Stack>
        <Text variant="labelSm" color="secondary" truncate>{alarm.message}</Text>
        <Stack direction="row" gap={2} align="center">
          <SeverityBadge severity={alarm.severity} />
          <Text variant="labelSm" color="dim">{formatRelative(alarm.occurredAt, now)}</Text>
          {alarm.assignee && (
            <Text variant="labelSm" color="dim">· {alarm.assignee}</Text>
          )}
        </Stack>
      </Stack>
    </div>
  );
}
