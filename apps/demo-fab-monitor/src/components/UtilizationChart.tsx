import { useMemo } from 'react';
import { Card, Stack, Text } from '@wonik/web';

// 24h utilization (% running equipment) — mock series. Inline SVG; no charting lib.
const HOURS_OF_DAY = 24;

function generateSeries(seed: number, currentUtil: number): number[] {
  // Deterministic-ish mock — produce 24 values that drift around base 60–95%, end at current.
  const out: number[] = [];
  let v = 55 + (seed % 20);
  for (let i = 0; i < HOURS_OF_DAY - 1; i++) {
    v += Math.sin((i + seed) * 0.6) * 8 + (Math.cos(i * 1.3) * 3);
    out.push(Math.max(45, Math.min(98, Math.round(v))));
  }
  out.push(currentUtil);
  return out;
}

interface UtilizationChartProps {
  currentUtilization: number; // 0..100
  startSeed?: number;
}

export function UtilizationChart({ currentUtilization, startSeed = 7 }: UtilizationChartProps) {
  const series = useMemo(() => generateSeries(startSeed, currentUtilization), [startSeed, currentUtilization]);

  return (
    <Card padding="md">
      <Stack gap={4}>
        <Stack direction="row" justify="between" align="center">
          <Stack gap={1}>
            <Text variant="labelSm" color="dim" style={{ letterSpacing: 0.4, textTransform: 'uppercase' }}>
              Fab Utilization · 24h
            </Text>
            <Text variant="titleSm" color="dark">
              Avg {Math.round(series.reduce((a, b) => a + b, 0) / series.length)}% · Now {currentUtilization}%
            </Text>
          </Stack>
          <Stack direction="row" gap={3} align="center">
            <LegendDot label="Utilization %" color="var(--color-primary)" />
            <LegendDot label="Target 80%" color="var(--color-text-dim)" dashed />
          </Stack>
        </Stack>
        <Chart series={series} />
      </Stack>
    </Card>
  );
}

function LegendDot({ label, color, dashed }: { label: string; color: string; dashed?: boolean }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--color-text-dim)' }}>
      <span style={{
        display: 'inline-block', width: 14, height: 2,
        background: dashed ? `repeating-linear-gradient(to right, ${color} 0 3px, transparent 3px 6px)` : color,
      }} />
      {label}
    </span>
  );
}

function Chart({ series }: { series: number[] }) {
  const W = 800;
  const H = 200;
  const padL = 36;
  const padR = 12;
  const padT = 12;
  const padB = 24;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  // y-scale 0..100
  const x = (i: number) => padL + (i * innerW) / (series.length - 1);
  const y = (v: number) => padT + innerH - (v / 100) * innerH;

  const points = series.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const areaPath = `M ${x(0)} ${y(0)} ${series.map((v, i) => `L ${x(i)} ${y(v)}`).join(' ')} L ${x(series.length - 1)} ${y(0)} Z`;

  // y-axis labels at 0, 50, 100
  const yTicks = [0, 50, 100];
  // x labels every 4 hours
  const xLabels = Array.from({ length: 7 }, (_, i) => i * 4);

  const targetY = y(80);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="24-hour fab utilization line chart" style={{ width: '100%', height: 200, display: 'block' }}>
      <defs>
        <linearGradient id="util-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* y grid lines + labels */}
      {yTicks.map((t) => (
        <g key={t}>
          <line x1={padL} x2={W - padR} y1={y(t)} y2={y(t)} stroke="var(--color-border)" strokeWidth="1" />
          <text x={padL - 8} y={y(t)} dy="0.32em" textAnchor="end" fontSize="10" fill="var(--color-text-dim)" fontFamily="inherit">
            {t}%
          </text>
        </g>
      ))}

      {/* target line at 80% */}
      <line
        x1={padL} x2={W - padR} y1={targetY} y2={targetY}
        stroke="var(--color-text-dim)" strokeWidth="1" strokeDasharray="3 3" opacity="0.6"
      />

      {/* x labels */}
      {xLabels.map((h) => {
        const i = h === 24 ? series.length - 1 : Math.min(series.length - 1, h);
        return (
          <text key={h} x={x(i)} y={H - 6} textAnchor="middle" fontSize="10" fill="var(--color-text-dim)" fontFamily="inherit">
            {h.toString().padStart(2, '0')}h
          </text>
        );
      })}

      {/* area + line */}
      <path d={areaPath} fill="url(#util-area)" />
      <polyline points={points} fill="none" stroke="var(--color-primary)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />

      {/* current point dot */}
      <circle cx={x(series.length - 1)} cy={y(series[series.length - 1])} r="3" fill="var(--color-primary)" />
    </svg>
  );
}
