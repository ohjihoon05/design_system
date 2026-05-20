import { IconButton, Stack, Text, Badge } from '@wonik/web';

export default { title: 'action/IconButton' };

const BellIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const XIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const Variants = () => (
  <Stack direction="row" gap={3}>
    <IconButton aria-label="bell outline">
      <BellIcon />
    </IconButton>
    <IconButton aria-label="bell ghost" variant="ghost">
      <BellIcon />
    </IconButton>
  </Stack>
);

export const Sizes = () => (
  <Stack direction="row" gap={3} align="center">
    <IconButton aria-label="sm" size="sm">
      <BellIcon size={12} />
    </IconButton>
    <IconButton aria-label="md (default)">
      <BellIcon size={16} />
    </IconButton>
    <IconButton aria-label="lg" size="lg">
      <BellIcon size={20} />
    </IconButton>
  </Stack>
);

export const Matrix = () => (
  <Stack gap={3}>
    {(['outline', 'ghost'] as const).map((v) => (
      <Stack key={v} gap={2}>
        <Text variant="labelSm" color="dim">variant="{v}"</Text>
        <Stack direction="row" gap={2} align="center">
          <IconButton aria-label={`${v} sm`} variant={v} size="sm"><BellIcon size={12} /></IconButton>
          <IconButton aria-label={`${v} md`} variant={v}><BellIcon size={16} /></IconButton>
          <IconButton aria-label={`${v} lg`} variant={v} size="lg"><BellIcon size={20} /></IconButton>
        </Stack>
      </Stack>
    ))}
  </Stack>
);

export const Disabled = () => (
  <Stack direction="row" gap={3}>
    <IconButton aria-label="disabled outline" disabled><BellIcon /></IconButton>
    <IconButton aria-label="disabled ghost" variant="ghost" disabled><XIcon /></IconButton>
  </Stack>
);

export const WithBadge = () => (
  <span style={{ position: 'relative', display: 'inline-flex' }}>
    <IconButton aria-label="3 open alarms">
      <BellIcon />
    </IconButton>
    <Badge
      aria-hidden
      style={{
        position: 'absolute',
        top: -6,
        right: -6,
        background: 'var(--color-status-alarm-text)',
        color: 'var(--color-surface-white)',
        border: 'none',
        padding: '0 5px',
        minWidth: 18,
        height: 18,
        fontSize: 10,
      }}
    >
      3
    </Badge>
  </span>
);
