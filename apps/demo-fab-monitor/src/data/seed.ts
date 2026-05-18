import type { Equipment, AlarmEvent, Operator } from './types';

export const operators: Operator[] = [
  { id: 'op-1', name: '김기현', role: 'Admin' },
  { id: 'op-2', name: '이수민', role: 'Operator' },
  { id: 'op-3', name: '박지훈', role: 'Operator' },
  { id: 'op-4', name: '정유진', role: 'Viewer' },
];

export const equipmentSeed: Equipment[] = [
  {
    id: 'CVD-01', name: 'CVD-01', type: 'CVD', bay: 'Bay A',
    status: 'run', recipe: 'STD-OX-450', lotId: 'LT-2026-0518-A',
    progress: 64, temperature: 451, pressure: 2.1, wafersToday: 184, uptime: 72.4,
  },
  {
    id: 'CVD-02', name: 'CVD-02', type: 'CVD', bay: 'Bay A',
    status: 'ready', recipe: 'STD-OX-450', lotId: null,
    progress: 0, temperature: 380, pressure: 5.0, wafersToday: 162, uptime: 120.1,
  },
  {
    id: 'CVD-03', name: 'CVD-03', type: 'CVD', bay: 'Bay A',
    status: 'alarm', recipe: 'STD-OX-450', lotId: 'LT-2026-0518-B',
    progress: 32, temperature: 488, pressure: 2.3, wafersToday: 94, uptime: 41.0,
  },
  {
    id: 'ETCH-01', name: 'ETCH-01', type: 'ETCH', bay: 'Bay B',
    status: 'alarm', recipe: 'DRY-ETCH-21', lotId: 'LT-2026-0518-C',
    progress: 12, temperature: 65, pressure: 12.4, wafersToday: 71, uptime: 18.9,
  },
  {
    id: 'ETCH-02', name: 'ETCH-02', type: 'ETCH', bay: 'Bay B',
    status: 'run', recipe: 'DRY-ETCH-21', lotId: 'LT-2026-0518-D',
    progress: 88, temperature: 62, pressure: 11.8, wafersToday: 142, uptime: 96.3,
  },
  {
    id: 'PVD-01', name: 'PVD-01', type: 'PVD', bay: 'Bay C',
    status: 'idle', recipe: null, lotId: null,
    progress: 0, temperature: 25, pressure: 760, wafersToday: 0, uptime: 4.2,
  },
  {
    id: 'PVD-02', name: 'PVD-02', type: 'PVD', bay: 'Bay C',
    status: 'maintenance', recipe: null, lotId: null,
    progress: 0, temperature: 25, pressure: 760, wafersToday: 0, uptime: 0,
  },
  {
    id: 'ALD-01', name: 'ALD-01', type: 'ALD', bay: 'Bay D',
    status: 'run', recipe: 'ALD-HF-300', lotId: 'LT-2026-0518-E',
    progress: 47, temperature: 305, pressure: 0.8, wafersToday: 88, uptime: 53.7,
  },
  {
    id: 'ALD-02', name: 'ALD-02', type: 'ALD', bay: 'Bay D',
    status: 'init', recipe: 'ALD-HF-300', lotId: null,
    progress: 0, temperature: 220, pressure: 1.2, wafersToday: 32, uptime: 12.1,
  },
  {
    id: 'CMP-01', name: 'CMP-01', type: 'CMP', bay: 'Bay E',
    status: 'ready', recipe: 'POLISH-A', lotId: null,
    progress: 0, temperature: 28, pressure: 760, wafersToday: 76, uptime: 64.0,
  },
];

// Factory — alarms with relative timestamps computed at app start, not at import time.
export function createAlarmsSeed(now: number): AlarmEvent[] {
  return [
    {
      id: 'AL-2001', equipmentId: 'CVD-03', equipmentName: 'CVD-03',
      severity: 'critical', code: 'E-1042',
      message: 'Chamber temperature out of range (488 °C > 470 °C)',
      occurredAt: now - 12 * 1000, acknowledged: false, assignee: '김기현',
    },
    {
      id: 'AL-2002', equipmentId: 'ETCH-01', equipmentName: 'ETCH-01',
      severity: 'critical', code: 'E-2017',
      message: 'Process pressure spike — Δ +2.6 mTorr in 3 s',
      occurredAt: now - 3 * 60 * 1000, acknowledged: false, assignee: null,
    },
    {
      id: 'AL-2003', equipmentId: 'PVD-02', equipmentName: 'PVD-02',
      severity: 'info', code: 'M-0101',
      message: 'Preventive maintenance due (cycle 5,000 reached)',
      occurredAt: now - 60 * 60 * 1000, acknowledged: true, assignee: '이수민',
    },
    {
      id: 'AL-2004', equipmentId: 'ALD-02', equipmentName: 'ALD-02',
      severity: 'warning', code: 'W-3304',
      message: 'Precursor level low — refill within 4 h',
      occurredAt: now - 22 * 60 * 1000, acknowledged: false, assignee: null,
    },
    {
      id: 'AL-2005', equipmentId: 'CVD-01', equipmentName: 'CVD-01',
      severity: 'info', code: 'I-0007',
      message: 'Recipe step 3/5 completed',
      occurredAt: now - 8 * 60 * 1000, acknowledged: true, assignee: null,
    },
  ];
}
