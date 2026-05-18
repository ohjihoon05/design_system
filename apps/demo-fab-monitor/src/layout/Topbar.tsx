import { Box, Stack, Text, Button, IconButton, Badge, useTheme } from '@wonik/web';
import { IconPause, IconPlay, IconSun, IconMoon, IconBell } from '../icons';

interface TopbarProps {
  title: string;
  subtitle?: string;
  paused: boolean;
  onTogglePaused: () => void;
  alarmCount: number;
  onOpenAlarms: () => void;
}

export function Topbar({ title, subtitle, paused, onTogglePaused, alarmCount, onOpenAlarms }: TopbarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <Box
      as="header"
      bg="surface"
      style={{
        height: 64,
        flexShrink: 0,
        borderBottom: '1px solid var(--color-border-mid)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        gap: 16,
      }}
    >
      <Stack gap={1} style={{ flex: 1, minWidth: 0 }}>
        <Stack direction="row" align="center" gap={3}>
          <Text variant="titleSm" weight="medium" color="dark" style={{ fontSize: 16 }}>{title}</Text>
          {!paused ? (
            <Stack direction="row" align="center" gap={2}>
              {/* Border-only ring; no box-shadow glow (UI_GUIDE anti-slop) */}
              <span style={{
                display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
                background: 'var(--color-status-run-dot)',
                outline: '2px solid var(--color-status-run-dot)',
                outlineOffset: 1,
              }} />
              <Text variant="labelSm" color="dim" style={{ letterSpacing: 0.4 }}>LIVE</Text>
            </Stack>
          ) : (
            <Text variant="labelSm" color="dim" style={{ letterSpacing: 0.4 }}>PAUSED</Text>
          )}
        </Stack>
        {subtitle && <Text variant="labelSm" color="dim">{subtitle}</Text>}
      </Stack>

      <Stack direction="row" align="center" gap={3} style={{ flexShrink: 0 }}>
        <Button size="sm" variant="outline" onClick={onTogglePaused} aria-label={paused ? 'Resume simulation' : 'Pause simulation'}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            {paused ? <IconPlay size={14} /> : <IconPause size={14} />}
            <span>{paused ? 'Resume' : 'Pause'}</span>
          </span>
        </Button>

        <span style={{ position: 'relative', display: 'inline-flex' }}>
          <IconButton
            aria-label={alarmCount > 0 ? `${alarmCount} open alarms` : 'Alarms'}
            onClick={onOpenAlarms}
          >
            <IconBell size={16} />
          </IconButton>
          {alarmCount > 0 && (
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
              {alarmCount}
            </Badge>
          )}
        </span>

        <IconButton
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          onClick={toggleTheme}
        >
          {theme === 'light' ? <IconMoon size={16} /> : <IconSun size={16} />}
        </IconButton>
      </Stack>
    </Box>
  );
}
