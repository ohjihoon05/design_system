import { useMemo, useState } from 'react';
import { Card, Stack, Text, Button, Textarea, Alert, Badge } from '@wonik/web';
import type { AlarmEvent } from '../data/types';
import type { SimulationApi } from '../data/useSimulation';
import { AlarmRow } from '../components/AlarmRow';
import { SeverityBadge } from '../components/StatusBadge';
import { formatRelative } from '../data/useSimulation';
import { operators } from '../data/seed';
import { FilterChip } from '../components/internal/FilterChip';
import { injectCss, FOCUS_RING } from '../lib/injectCss';

injectCss('alarms-page', `
  .demo-alarm-select {
    padding: 8px 10px;
    font-size: 13px;
    line-height: 1;
    border-radius: 5px;
    border: 1px solid var(--color-border-mid);
    background: var(--color-surface);
    color: var(--color-text-dark);
    font-family: inherit;
  }
  .demo-alarm-select:focus-visible {
    ${FOCUS_RING}
  }
  .demo-alarm-link {
    align-self: flex-start;
    background: transparent;
    border: none;
    padding: 2px 4px;
    margin: -2px -4px;
    color: var(--color-primary);
    cursor: pointer;
    font-size: 12px;
    line-height: 1;
    border-radius: 3px;
    font-family: inherit;
  }
  .demo-alarm-link:hover {
    text-decoration: underline;
  }
  .demo-alarm-link:focus-visible {
    ${FOCUS_RING}
  }
`);

type FilterTab = 'all' | 'critical' | 'warning' | 'info' | 'mine';

interface AlarmsPageProps {
  api: SimulationApi;
  now: number;
  selectedAlarmId: string | null;
  onSelectAlarm: (id: string | null) => void;
}

export function AlarmsPage({ api, now, selectedAlarmId, onSelectAlarm }: AlarmsPageProps) {
  const { alarms, acknowledgeAlarm, closeAlarm, assignAlarm, isAlarmExpired } = api;
  const [tab, setTab] = useState<FilterTab>('all');
  const [note, setNote] = useState('');
  const MY_NAME = '김기현';

  const counts = useMemo(() => ({
    all: alarms.length,
    critical: alarms.filter((a) => a.severity === 'critical').length,
    warning: alarms.filter((a) => a.severity === 'warning').length,
    info: alarms.filter((a) => a.severity === 'info').length,
    mine: alarms.filter((a) => a.assignee === MY_NAME).length,
  }), [alarms]);

  const visible = useMemo(() => {
    return alarms.filter((a) => {
      if (tab === 'mine') return a.assignee === MY_NAME;
      if (tab === 'all') return true;
      return a.severity === tab;
    });
  }, [alarms, tab]);

  const explicit = alarms.find((a) => a.id === selectedAlarmId) ?? null;
  const expired = isAlarmExpired(selectedAlarmId);
  // Fall back to first visible only when nothing is explicitly selected.
  const selected: AlarmEvent | null = explicit ?? (selectedAlarmId == null ? visible[0] ?? null : null);

  const criticalUnack = alarms.filter((a) => a.severity === 'critical' && !a.acknowledged);

  const tabs: Array<{ key: FilterTab; label: string }> = [
    { key: 'all', label: 'All' },
    { key: 'critical', label: 'Critical' },
    { key: 'warning', label: 'Warning' },
    { key: 'info', label: 'Info' },
    { key: 'mine', label: 'Assigned to me' },
  ];

  return (
    <Stack gap={5}>
      {criticalUnack.length > 0 && (
        <Alert>
          <Stack direction="row" align="center" gap={3} style={{ flexWrap: 'wrap' }}>
            <Text variant="titleSm" weight="medium" style={{ color: 'inherit' }}>
              {criticalUnack.length} unacknowledged critical alarm{criticalUnack.length > 1 ? 's' : ''}
            </Text>
            <Text variant="labelSm" style={{ color: 'inherit', opacity: 0.85 }}>
              · {criticalUnack.map((a) => a.equipmentName).slice(0, 3).join(', ')}
              {criticalUnack.length > 3 ? `, +${criticalUnack.length - 3}` : ''}
            </Text>
          </Stack>
        </Alert>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '380px minmax(0, 1fr)', gap: 16, alignItems: 'start' }}>
        <Card padding="md">
          <Stack gap={4}>
            <Stack direction="row" gap={1} wrap>
              {tabs.map((t) => (
                <FilterChip key={t.key} active={t.key === tab} onClick={() => setTab(t.key)}>
                  <span>{t.label}</span>
                  <Badge variant={t.key === tab ? 'primary' : 'neutral'}>{counts[t.key]}</Badge>
                </FilterChip>
              ))}
            </Stack>

            <Stack gap={1} style={{ maxHeight: 'calc(100vh - 280px)', overflowY: 'auto' }}>
              {visible.length === 0 ? (
                <div style={{ padding: 32, textAlign: 'center', color: 'var(--color-text-dim)', fontSize: 13 }}>
                  No alarms in this view.
                </div>
              ) : visible.map((a) => (
                <AlarmRow key={a.id} alarm={a} now={now} onClick={onSelectAlarm} selected={selected?.id === a.id} />
              ))}
            </Stack>
          </Stack>
        </Card>

        {selected ? (
          <AlarmDetail
            alarm={selected}
            now={now}
            note={note}
            onNoteChange={setNote}
            onAck={() => acknowledgeAlarm(selected.id)}
            onClose={() => { closeAlarm(selected.id); onSelectAlarm(null); setNote(''); }}
            onAssign={(name) => assignAlarm(selected.id, name)}
            myName={MY_NAME}
          />
        ) : expired ? (
          <ExpiredPlaceholder onDismiss={() => onSelectAlarm(null)} />
        ) : (
          <Card padding="lg">
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-text-dim)' }}>
              <Text variant="titleSm" color="dim">Select an alarm to view detail</Text>
            </div>
          </Card>
        )}
      </div>
    </Stack>
  );
}

function ExpiredPlaceholder({ onDismiss }: { onDismiss: () => void }) {
  return (
    <Card padding="lg">
      <Stack gap={3} align="center" style={{ padding: '40px 16px', textAlign: 'center' }}>
        <Text variant="titleSm" weight="medium" color="dark">This alarm is no longer active</Text>
        <Text variant="label" color="dim">
          The alarm was either closed or pushed out of the recent list (cap {30}).
        </Text>
        <Button variant="outline" size="sm" onClick={onDismiss}>Dismiss</Button>
      </Stack>
    </Card>
  );
}

interface AlarmDetailProps {
  alarm: AlarmEvent;
  now: number;
  note: string;
  onNoteChange: (v: string) => void;
  onAck: () => void;
  onClose: () => void;
  onAssign: (assignee: string | null) => void;
  myName: string;
}

function AlarmDetail({ alarm, now, note, onNoteChange, onAck, onClose, onAssign, myName }: AlarmDetailProps) {
  return (
    <Card padding="lg">
      <Stack gap={5}>
        <Stack direction="row" justify="between" align="start">
          <Stack gap={2}>
            <Stack direction="row" gap={2} align="center">
              <SeverityBadge severity={alarm.severity} />
              <Text variant="labelSm" color="dim">{alarm.code}</Text>
              <Text variant="labelSm" color="dim">· {formatRelative(alarm.occurredAt, now)}</Text>
            </Stack>
            <Text variant="titleSm" weight="medium" color="dark" style={{ fontSize: 18 }}>{alarm.equipmentName}</Text>
            <Text variant="label" color="secondary">{alarm.message}</Text>
          </Stack>
          <Stack direction="row" gap={2}>
            {!alarm.acknowledged && (
              <Button variant="outline" size="sm" onClick={onAck}>Acknowledge</Button>
            )}
            <Button variant="primary" size="sm" onClick={onClose}>Close alarm</Button>
          </Stack>
        </Stack>

        <div style={{ borderTop: '1px solid var(--color-border)' }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Stack gap={2}>
            <Text variant="labelSm" color="dim" style={{ letterSpacing: 0.3, textTransform: 'uppercase' }}>Assignee</Text>
            <select
              value={alarm.assignee ?? ''}
              onChange={(e) => onAssign(e.target.value || null)}
              className="demo-alarm-select"
            >
              <option value="">Unassigned</option>
              {operators.map((op) => (
                <option key={op.id} value={op.name}>{op.name} · {op.role}</option>
              ))}
            </select>
            {alarm.assignee !== myName && (
              <button type="button" onClick={() => onAssign(myName)} className="demo-alarm-link">
                Assign to me
              </button>
            )}
          </Stack>

          <Stack gap={2}>
            <Text variant="labelSm" color="dim" style={{ letterSpacing: 0.3, textTransform: 'uppercase' }}>Status</Text>
            <Text variant="label" weight="medium" color="dark">
              {alarm.acknowledged ? 'Acknowledged' : 'Unacknowledged'}
            </Text>
          </Stack>
        </div>

        <Stack gap={2}>
          <Text variant="labelSm" color="dim" style={{ letterSpacing: 0.3, textTransform: 'uppercase' }}>Notes</Text>
          <Textarea
            size="md"
            value={note}
            onChange={(e) => onNoteChange(e.target.value)}
            placeholder="조치 내용 / 원인 분석을 기록…"
            rows={4}
          />
          <Stack direction="row" justify="end">
            <Button variant="text" size="sm" disabled={!note.trim()}>Save note</Button>
          </Stack>
        </Stack>

        <div style={{ borderTop: '1px solid var(--color-border)' }} />

        <Stack gap={3}>
          <Text variant="labelSm" color="dim" style={{ letterSpacing: 0.3, textTransform: 'uppercase' }}>Timeline</Text>
          <Stack gap={3}>
            <TimelineEvent label="Detected" at={formatRelative(alarm.occurredAt, now)} description={`Code ${alarm.code} raised by ${alarm.equipmentName}`} />
            {alarm.acknowledged && <TimelineEvent label="Acknowledged" at="just now" description={`by ${alarm.assignee ?? 'system'}`} />}
            {alarm.assignee && <TimelineEvent label="Assigned" at="just now" description={alarm.assignee} muted />}
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
}

function TimelineEvent({ label, at, description, muted }: { label: string; at: string; description: string; muted?: boolean }) {
  return (
    <Stack direction="row" gap={3} align="start">
      <span style={{ width: 6, height: 6, borderRadius: '50%', marginTop: 6, background: muted ? 'var(--color-border-mid)' : 'var(--color-primary)', flexShrink: 0 }} />
      <Stack gap={1} style={{ flex: 1 }}>
        <Stack direction="row" gap={2} align="center">
          <Text variant="label" weight="medium" color="dark">{label}</Text>
          <Text variant="labelSm" color="dim">{at}</Text>
        </Stack>
        <Text variant="labelSm" color="secondary">{description}</Text>
      </Stack>
    </Stack>
  );
}
