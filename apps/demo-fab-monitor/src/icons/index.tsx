// 외부 아이콘 라이브러리 없이 inline SVG로 구성. stroke="currentColor"라
// Text/Stack의 color를 그대로 상속한다. 모두 24×24 viewBox, stroke-width 1.5.

import type { CSSProperties } from 'react';

interface IconProps {
  size?: number;
  style?: CSSProperties;
}

const base = (size = 16, style?: CSSProperties): React.SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  style: { display: 'inline-block', flexShrink: 0, ...style },
});

export function IconDashboard({ size, style }: IconProps) {
  return (
    <svg {...base(size, style)}>
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  );
}

export function IconEquipment({ size, style }: IconProps) {
  return (
    <svg {...base(size, style)}>
      <rect x="3" y="4" width="18" height="14" rx="1" />
      <path d="M3 9h18" />
      <path d="M8 14h2M14 14h2" />
      <path d="M7 21l2-3M17 21l-2-3" />
    </svg>
  );
}

export function IconAlarm({ size, style }: IconProps) {
  return (
    <svg {...base(size, style)}>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10 21a2 2 0 0 0 4 0" />
    </svg>
  );
}

export function IconSettings({ size, style }: IconProps) {
  return (
    <svg {...base(size, style)}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

export function IconSearch({ size, style }: IconProps) {
  return (
    <svg {...base(size, style)}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export function IconBell({ size, style }: IconProps) {
  return (
    <svg {...base(size, style)}>
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

export function IconPause({ size, style }: IconProps) {
  return (
    <svg {...base(size, style)}>
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}

export function IconPlay({ size, style }: IconProps) {
  return (
    <svg {...base(size, style)}>
      <polygon points="6 4 20 12 6 20 6 4" />
    </svg>
  );
}

export function IconChevronRight({ size, style }: IconProps) {
  return (
    <svg {...base(size, style)}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export function IconCheck({ size, style }: IconProps) {
  return (
    <svg {...base(size, style)}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function IconX({ size, style }: IconProps) {
  return (
    <svg {...base(size, style)}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function IconSun({ size, style }: IconProps) {
  return (
    <svg {...base(size, style)}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

export function IconMoon({ size, style }: IconProps) {
  return (
    <svg {...base(size, style)}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function IconWonikLogo({ size = 28, style }: IconProps) {
  // 원익IPS의 'W' 모노그램을 단순화한 마크. 실제 CI가 아닌 데모용 stand-in.
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={style}>
      <rect width="32" height="32" rx="6" fill="var(--color-primary)" />
      <path d="M7 9 L11 23 L14.5 14 L18 23 L22 9" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
