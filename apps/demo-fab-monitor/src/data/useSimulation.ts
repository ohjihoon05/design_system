import { useEffect, useState, useCallback, useRef } from 'react';
import { useToast } from '@wonik/web';
import type { Equipment, AlarmEvent } from './types';
import { equipmentSeed, createAlarmsSeed } from './seed';

const TICK_MS = 2000;
const MAX_ALARMS = 30;

function nudgeEquipment(eq: Equipment): Equipment {
  if (eq.status === 'run') {
    const nextProgress = eq.progress >= 100 ? 0 : eq.progress + 1 + Math.floor(Math.random() * 2);
    return {
      ...eq,
      progress: Math.min(100, nextProgress),
      temperature: +(eq.temperature + (Math.random() - 0.5) * 0.6).toFixed(1),
      pressure: +(eq.pressure + (Math.random() - 0.5) * 0.05).toFixed(2),
      wafersToday: nextProgress === 0 ? eq.wafersToday + 1 : eq.wafersToday,
    };
  }
  if (eq.status === 'init') {
    return { ...eq, temperature: +(eq.temperature + 1.2).toFixed(1) };
  }
  return eq;
}

const POSSIBLE_RANDOM_ALARMS: Array<Omit<AlarmEvent, 'id' | 'occurredAt' | 'acknowledged' | 'assignee'>> = [
  { equipmentId: 'CVD-01', equipmentName: 'CVD-01', severity: 'warning', code: 'W-1108', message: 'Gas flow drift detected (within tolerance)' },
  { equipmentId: 'ETCH-02', equipmentName: 'ETCH-02', severity: 'info', code: 'I-2204', message: 'Endpoint reached — wafer ejected' },
  { equipmentId: 'ALD-01', equipmentName: 'ALD-01', severity: 'warning', code: 'W-3110', message: 'Carrier gas pressure low (0.7 mTorr)' },
  { equipmentId: 'CMP-01', equipmentName: 'CMP-01', severity: 'info', code: 'I-5001', message: 'Slurry refill completed' },
];

export interface SimulationApi {
  equipment: Equipment[];
  alarms: AlarmEvent[];
  paused: boolean;
  togglePaused: () => void;
  acknowledgeAlarm: (id: string) => void;
  closeAlarm: (id: string) => void;
  assignAlarm: (id: string, assignee: string | null) => void;
  /** True if the given id existed at some point but is no longer in the list (expired or closed). */
  isAlarmExpired: (id: string | null) => boolean;
}

export function useSimulation(): SimulationApi {
  const [equipment, setEquipment] = useState<Equipment[]>(equipmentSeed);
  const [alarms, setAlarms] = useState<AlarmEvent[]>(() => createAlarmsSeed(Date.now()));
  const [paused, setPaused] = useState(false);
  const alarmCounter = useRef(9000);
  // Track every id we've ever shown so we can distinguish "never existed" from "was here, now gone".
  const seenIds = useRef<Set<string>>(new Set(alarms.map((a) => a.id)));
  const toast = useToast();

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setEquipment((prev) => prev.map(nudgeEquipment));

      if (Math.random() < 0.2) {
        const template = POSSIBLE_RANDOM_ALARMS[Math.floor(Math.random() * POSSIBLE_RANDOM_ALARMS.length)];
        const next: AlarmEvent = {
          ...template,
          id: `AL-${alarmCounter.current++}`,
          occurredAt: Date.now(),
          acknowledged: false,
          assignee: null,
        };
        seenIds.current.add(next.id);
        setAlarms((prev) => [next, ...prev].slice(0, MAX_ALARMS));
        toast.show({
          tone: next.severity === 'critical' ? 'error' : next.severity === 'warning' ? 'warning' : 'info',
          title: `${next.equipmentName} · ${next.code}`,
          description: next.message,
        });
      }
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [paused, toast]);

  const togglePaused = useCallback(() => setPaused((p) => !p), []);

  const acknowledgeAlarm = useCallback((id: string) => {
    setAlarms((prev) => prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)));
  }, []);

  const closeAlarm = useCallback((id: string) => {
    setAlarms((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const assignAlarm = useCallback((id: string, assignee: string | null) => {
    setAlarms((prev) => prev.map((a) => (a.id === id ? { ...a, assignee } : a)));
  }, []);

  const isAlarmExpired = useCallback(
    (id: string | null) => {
      if (id == null) return false;
      if (alarms.some((a) => a.id === id)) return false;
      return seenIds.current.has(id);
    },
    [alarms],
  );

  return { equipment, alarms, paused, togglePaused, acknowledgeAlarm, closeAlarm, assignAlarm, isAlarmExpired };
}

export function formatRelative(ts: number, now = Date.now()): string {
  const sec = Math.max(0, Math.floor((now - ts) / 1000));
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  return `${day}d ago`;
}
