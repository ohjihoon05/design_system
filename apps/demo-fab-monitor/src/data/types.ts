export type EquipmentStatus =
  | 'run'
  | 'ready'
  | 'idle'
  | 'init'
  | 'alarm'
  | 'maintenance';

export type EquipmentType = 'CVD' | 'ETCH' | 'PVD' | 'ALD' | 'CMP';

export interface Equipment {
  id: string;
  name: string;
  type: EquipmentType;
  bay: string;
  status: EquipmentStatus;
  recipe: string | null;
  lotId: string | null;
  progress: number; // 0..100, run 상태에서만 의미
  temperature: number; // °C
  pressure: number; // mTorr
  wafersToday: number;
  uptime: number; // hours
}

export type AlarmSeverity = 'critical' | 'warning' | 'info';

export interface AlarmEvent {
  id: string;
  equipmentId: string;
  equipmentName: string;
  severity: AlarmSeverity;
  code: string;
  message: string;
  occurredAt: number; // epoch ms
  acknowledged: boolean;
  assignee: string | null;
}

export interface Operator {
  id: string;
  name: string;
  role: 'Admin' | 'Operator' | 'Viewer';
}
