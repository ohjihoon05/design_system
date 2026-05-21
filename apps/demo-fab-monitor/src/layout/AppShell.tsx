import type { ReactNode } from 'react';
import { Box } from '@wonik/web';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import type { PageKey } from '../App';

interface AppShellProps {
  page: PageKey;
  onNavigate: (page: PageKey) => void;
  title: string;
  subtitle?: string;
  paused: boolean;
  onTogglePaused: () => void;
  openAlarmCount: number;
  onOpenAlarms: () => void;
  children: ReactNode;
}

export function AppShell({
  page, onNavigate, title, subtitle,
  paused, onTogglePaused, openAlarmCount, onOpenAlarms, children,
}: AppShellProps) {
  return (
    <Box style={{ display: 'flex', height: '100vh' }}>
      <Sidebar current={page} onNavigate={onNavigate} alarmCount={openAlarmCount} />
      <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar
          title={title}
          subtitle={subtitle}
          paused={paused}
          onTogglePaused={onTogglePaused}
          alarmCount={openAlarmCount}
          onOpenAlarms={onOpenAlarms}
        />
        <Box
          as="main"
          style={{
            flex: 1,
            overflow: 'auto',
            padding: 24,
            background: 'var(--color-canvas)',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
