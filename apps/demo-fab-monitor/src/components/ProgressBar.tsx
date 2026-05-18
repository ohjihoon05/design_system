interface ProgressBarProps {
  value: number; // 0..100
  height?: number;
  tone?: 'primary' | 'alarm' | 'ready';
}

const TONE: Record<NonNullable<ProgressBarProps['tone']>, string> = {
  primary: 'var(--color-primary)',
  alarm: 'var(--color-status-alarm-text)',
  ready: 'var(--color-status-ready-dot)',
};

export function ProgressBar({ value, height = 4, tone = 'primary' }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{
        width: '100%',
        height,
        background: 'var(--color-surface-subtle)',
        borderRadius: height,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${clamped}%`,
          height: '100%',
          background: TONE[tone],
          transition: 'width 600ms ease-out',
        }}
      />
    </div>
  );
}
