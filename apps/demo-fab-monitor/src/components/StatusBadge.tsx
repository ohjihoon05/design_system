import type { CSSProperties } from 'react';
import { statusTokens } from '@wonik/tokens';
import type { EquipmentStatus, AlarmSeverity } from '../data/types';

// equipment status → status token + label 매핑.
// design system의 statusTokens가 이미 hue/contrast를 정의해 둠. 우리는 의미 매핑만 한다.
const EQUIPMENT_MAP: Record<EquipmentStatus, { label: string; bg: string; text: string; dot?: string }> = {
  run: {
    label: 'Run',
    bg: statusTokens.run.bg,
    text: statusTokens.run.text,
    dot: statusTokens.run.dot,
  },
  ready: {
    label: 'Ready',
    bg: statusTokens.ready.bg,
    text: statusTokens.ready.text,
    dot: statusTokens.ready.dot,
  },
  idle: {
    label: 'Idle',
    bg: statusTokens.idle.bg,
    text: statusTokens.idle.text,
  },
  init: {
    label: 'Init',
    bg: statusTokens.init.bg,
    text: statusTokens.init.text,
  },
  alarm: {
    label: 'Alarm',
    bg: statusTokens.alarm.bg,
    text: statusTokens.alarm.text,
  },
  maintenance: {
    label: 'Maint',
    bg: statusTokens.warning.bg,
    text: statusTokens.warning.text,
    dot: statusTokens.warning.dot,
  },
};

interface StatusBadgeProps {
  status: EquipmentStatus;
  withDot?: boolean;
  style?: CSSProperties;
}

export function StatusBadge({ status, withDot = true, style }: StatusBadgeProps) {
  const { label, bg, text, dot } = EQUIPMENT_MAP[status];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '3px 8px',
        background: bg,
        color: text,
        borderRadius: 5,
        fontSize: 11,
        fontWeight: 500,
        lineHeight: 1,
        letterSpacing: 0.2,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {withDot && dot && (
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: dot }} />
      )}
      {!withDot || !dot ? null : null}
      {label}
    </span>
  );
}

const SEVERITY_MAP: Record<AlarmSeverity, { label: string; bg: string; text: string }> = {
  critical: {
    label: 'Critical',
    bg: statusTokens.alarm.bg,
    text: statusTokens.alarm.text,
  },
  warning: {
    label: 'Warning',
    bg: statusTokens.warning.bg,
    text: statusTokens.warning.text,
  },
  info: {
    label: 'Info',
    bg: statusTokens.idle.bg,
    text: statusTokens.idle.text,
  },
};

export function SeverityBadge({ severity }: { severity: AlarmSeverity }) {
  const { label, bg, text } = SEVERITY_MAP[severity];
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '3px 8px',
      background: bg,
      color: text,
      borderRadius: 5,
      fontSize: 11,
      fontWeight: 500,
      lineHeight: 1,
      whiteSpace: 'nowrap',
    }}>{label}</span>
  );
}
