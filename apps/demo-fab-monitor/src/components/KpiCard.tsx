import type { ReactNode } from 'react';
import { Card, Stack, Text } from '@wonik/web';

interface KpiCardProps {
  label: string;
  value: ReactNode;
  unit?: string;
  delta?: { value: number; suffix?: string } | null;
  sparkline?: number[]; // 0..1 정규화된 값
  accent?: 'neutral' | 'primary' | 'alarm' | 'ready';
}

const ACCENT_COLOR: Record<NonNullable<KpiCardProps['accent']>, string> = {
  neutral: 'var(--color-text-dim)',
  primary: 'var(--color-primary)',
  alarm: 'var(--color-status-alarm-text)',
  ready: 'var(--color-status-ready-dot)',
};

export function KpiCard({ label, value, unit, delta, sparkline, accent = 'neutral' }: KpiCardProps) {
  return (
    <Card padding="md" style={{ minWidth: 0 }}>
      <Stack gap={3}>
        <Text variant="labelSm" color="dim" style={{ letterSpacing: 0.4, textTransform: 'uppercase' }}>
          {label}
        </Text>
        <Stack direction="row" align="end" gap={2}>
          <Text
            variant="titleSm"
            weight="medium"
            color="dark"
            style={{ fontSize: 28, lineHeight: 1, fontVariantNumeric: 'tabular-nums', color: ACCENT_COLOR[accent] }}
          >
            {value}
          </Text>
          {unit && (
            <Text variant="label" color="dim" style={{ paddingBottom: 4 }}>{unit}</Text>
          )}
        </Stack>
        {(delta || sparkline) && (
          <Stack direction="row" align="center" justify="between" gap={3} style={{ minHeight: 22 }}>
            {delta && (
              <Text
                variant="labelSm"
                style={{
                  color: delta.value >= 0 ? 'var(--color-status-ready-text)' : 'var(--color-status-alarm-text)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {delta.value >= 0 ? '▲' : '▼'} {Math.abs(delta.value)}{delta.suffix ?? ''}
              </Text>
            )}
            {sparkline && <Sparkline values={sparkline} color={ACCENT_COLOR[accent]} />}
          </Stack>
        )}
      </Stack>
    </Card>
  );
}

function Sparkline({ values, color }: { values: number[]; color: string }) {
  const w = 80;
  const h = 22;
  const step = values.length > 1 ? w / (values.length - 1) : 0;
  const pts = values
    .map((v, i) => `${(i * step).toFixed(1)},${(h - v * (h - 2) - 1).toFixed(1)}`)
    .join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ flexShrink: 0 }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
