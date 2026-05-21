import { useState, useEffect } from 'react';
import { AppShell } from './layout/AppShell';
import { DashboardPage } from './pages/DashboardPage';
import { EquipmentPage } from './pages/EquipmentPage';
import { AlarmsPage } from './pages/AlarmsPage';
import { SettingsPage } from './pages/SettingsPage';
import { useSimulation } from './data/useSimulation';

export type PageKey = 'dashboard' | 'equipment' | 'alarms' | 'settings';

const PAGE_META: Record<PageKey, { title: string; subtitle?: string }> = {
  dashboard: { title: 'Fab A — Overview', subtitle: 'Realtime equipment & alarm summary' },
  equipment: { title: 'Equipment', subtitle: '10 tools across 5 bays' },
  alarms: { title: 'Alarms', subtitle: 'Triage active and historical alarms' },
  settings: { title: 'Settings' },
};

export function App() {
  const [page, setPage] = useState<PageKey>('dashboard');
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);
  const [selectedAlarmId, setSelectedAlarmId] = useState<string | null>(null);
  const api = useSimulation();

  // 매 초 now 업데이트 → 상대시간 ("12s ago") 자동 갱신
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const openAlarmCount = api.alarms.filter((a) => !a.acknowledged).length;

  const handleNavigate = (next: PageKey) => {
    setPage(next);
    if (next !== 'equipment') setSelectedEquipmentId(null);
    if (next !== 'alarms') setSelectedAlarmId(null);
  };

  const handleSelectEquipmentFromDashboard = (id: string) => {
    setSelectedEquipmentId(id);
    setPage('equipment');
  };

  const handleSelectAlarmFromDashboard = (id: string) => {
    setSelectedAlarmId(id);
    setPage('alarms');
  };

  return (
    <AppShell
      page={page}
      onNavigate={handleNavigate}
      title={PAGE_META[page].title}
      subtitle={PAGE_META[page].subtitle}
      paused={api.paused}
      onTogglePaused={api.togglePaused}
      openAlarmCount={openAlarmCount}
      onOpenAlarms={() => handleNavigate('alarms')}
    >
      {page === 'dashboard' && (
        <DashboardPage
          equipment={api.equipment}
          alarms={api.alarms}
          now={now}
          onSelectAlarm={handleSelectAlarmFromDashboard}
          onSelectEquipment={handleSelectEquipmentFromDashboard}
        />
      )}
      {page === 'equipment' && (
        <EquipmentPage
          equipment={api.equipment}
          selectedId={selectedEquipmentId}
          onSelect={setSelectedEquipmentId}
        />
      )}
      {page === 'alarms' && (
        <AlarmsPage
          api={api}
          now={now}
          selectedAlarmId={selectedAlarmId}
          onSelectAlarm={setSelectedAlarmId}
        />
      )}
      {page === 'settings' && <SettingsPage />}
    </AppShell>
  );
}
