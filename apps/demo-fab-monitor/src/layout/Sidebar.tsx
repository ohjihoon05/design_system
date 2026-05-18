import { Box, Stack, Text, Badge, Avatar } from '@wonik/web';
import {
  IconDashboard,
  IconEquipment,
  IconAlarm,
  IconSettings,
  IconWonikLogo,
} from '../icons';
import { NavButton } from '../components/internal/NavButton';
import type { PageKey } from '../App';

interface SidebarProps {
  current: PageKey;
  onNavigate: (page: PageKey) => void;
  alarmCount: number;
}

const NAV: Array<{ key: PageKey; label: string; Icon: typeof IconDashboard }> = [
  { key: 'dashboard', label: 'Dashboard', Icon: IconDashboard },
  { key: 'equipment', label: 'Equipment', Icon: IconEquipment },
  { key: 'alarms', label: 'Alarms', Icon: IconAlarm },
  { key: 'settings', label: 'Settings', Icon: IconSettings },
];

export function Sidebar({ current, onNavigate, alarmCount }: SidebarProps) {
  return (
    <Box
      as="nav"
      bg="surface"
      border="light"
      style={{
        width: 240,
        flexShrink: 0,
        borderTop: 0,
        borderBottom: 0,
        borderLeft: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Stack direction="row" align="center" gap={3} px={6} py={6} style={{ height: 64, borderBottom: '1px solid var(--color-border-mid)' }}>
        <IconWonikLogo size={28} />
        <Stack gap={1}>
          <Text variant="titleSm" weight="medium" color="dark">WONIK IPS</Text>
          <Text variant="labelSm" color="dim">Fab Monitor</Text>
        </Stack>
      </Stack>

      <Stack gap={1} p={4} style={{ flex: 1 }}>
        <Text variant="labelSm" color="dim" style={{ padding: '8px 12px', letterSpacing: 0.5, textTransform: 'uppercase' }}>
          Operations
        </Text>
        {NAV.map(({ key, label, Icon }) => (
          <NavButton
            key={key}
            active={current === key}
            onClick={() => onNavigate(key)}
            icon={<Icon size={18} />}
            label={label}
            trailing={key === 'alarms' && alarmCount > 0 ? <Badge variant="primary">{alarmCount}</Badge> : undefined}
          />
        ))}
      </Stack>

      <Stack direction="row" align="center" gap={3} px={6} py={6} style={{ borderTop: '1px solid var(--color-border-mid)' }}>
        <Avatar name="김기현" size={32} />
        <Stack gap={1} style={{ flex: 1, minWidth: 0 }}>
          <Text variant="label" weight="medium" color="dark" truncate>김기현</Text>
          <Text variant="labelSm" color="dim">Admin · Bay A–E</Text>
        </Stack>
      </Stack>
    </Box>
  );
}
