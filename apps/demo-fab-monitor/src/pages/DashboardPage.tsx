import { useMemo } from 'react';
import { Card, Stack, Text } from '@wonik/web';
import type { Equipment, AlarmEvent } from '../data/types';
import { KpiCard } from '../components/KpiCard';
import { EquipmentRow } from '../components/EquipmentRow';
import { AlarmRow } from '../components/AlarmRow';
import { UtilizationChart } from '../components/UtilizationChart';

interface DashboardPageProps {
  equipment: Equipment[];
  alarms: AlarmEvent[];
  now: number;
  onSelectAlarm: (id: string) => void;
  onSelectEquipment: (id: string) => void;
}

export function DashboardPage({ equipment, alarms, now, onSelectAlarm, onSelectEquipment }: DashboardPageProps) {
  const kpi = useMemo(() => {
    const total = equipment.length;
    const running = equipment.filter((e) => e.status === 'run').length;
    const alarming = equipment.filter((e) => e.status === 'alarm').length;
    const openAlarms = alarms.filter((a) => !a.acknowledged).length;
    const wafers = equipment.reduce((sum, e) => sum + e.wafersToday, 0);
    const utilization = Math.round((running / total) * 100);
    return { total, running, alarming, openAlarms, wafers, utilization };
  }, [equipment, alarms]);

  // 가짜 sparkline — 보여주기 용. 실 데이터 hookup 없이 시각만.
  const utilSpark = [0.6, 0.55, 0.7, 0.65, 0.8, 0.75, 0.78, 0.82, kpi.utilization / 100];
  const waferSpark = [0.3, 0.4, 0.45, 0.55, 0.6, 0.65, 0.72, 0.8, 0.88];

  const recentEquipment = [...equipment].sort((a, b) => {
    // alarm 먼저, run 다음, 나머지 마지막
    const order: Record<string, number> = { alarm: 0, init: 1, run: 2, ready: 3, maintenance: 4, idle: 5 };
    return order[a.status] - order[b.status];
  });

  const openAlarms = alarms.filter((a) => !a.acknowledged).slice(0, 6);

  return (
    <Stack gap={6}>
      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <KpiCard
          label="Running Equipment"
          value={kpi.running}
          unit={`/ ${kpi.total}`}
          accent="primary"
          sparkline={utilSpark}
        />
        <KpiCard
          label="Open Alarms"
          value={kpi.openAlarms}
          delta={{ value: 2, suffix: ' vs 1h' }}
          accent={kpi.openAlarms > 0 ? 'alarm' : 'neutral'}
        />
        <KpiCard
          label="Fab Utilization"
          value={kpi.utilization}
          unit="%"
          accent="ready"
          delta={{ value: 3, suffix: 'pp' }}
        />
        <KpiCard
          label="Wafers Today"
          value={kpi.wafers.toLocaleString()}
          accent="neutral"
          sparkline={waferSpark}
        />
      </div>

      <UtilizationChart currentUtilization={kpi.utilization} />

      {/* 2-column main area */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: 16 }}>
        <Card padding="md">
          <Stack gap={4}>
            <Stack direction="row" justify="between" align="center">
              <Text variant="titleSm" weight="medium" color="dark">Equipment Status</Text>
              <Text variant="labelSm" color="dim">{kpi.alarming > 0 ? `${kpi.alarming} alarm` : 'All clear'}</Text>
            </Stack>
            <Stack gap={1}>
              {recentEquipment.map((eq) => (
                <EquipmentRow key={eq.id} equipment={eq} onClick={onSelectEquipment} />
              ))}
            </Stack>
          </Stack>
        </Card>

        <Card padding="md">
          <Stack gap={4}>
            <Stack direction="row" justify="between" align="center">
              <Text variant="titleSm" weight="medium" color="dark">Active Alarms</Text>
              <Text variant="labelSm" color="dim">{openAlarms.length} open</Text>
            </Stack>
            {openAlarms.length === 0 ? (
              <EmptyState message="No active alarms — fab nominal." />
            ) : (
              <Stack gap={1}>
                {openAlarms.map((a) => (
                  <AlarmRow key={a.id} alarm={a} now={now} onClick={onSelectAlarm} />
                ))}
              </Stack>
            )}
          </Stack>
        </Card>
      </div>
    </Stack>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 16px',
        border: '1px dashed var(--color-border-mid)',
        borderRadius: 5,
        color: 'var(--color-text-dim)',
        fontSize: 13,
      }}
    >
      {message}
    </div>
  );
}
