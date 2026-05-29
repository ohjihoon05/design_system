import { Tooltip, Button, IconButton, Stack, Text } from '@wonik/web';

const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

export default { title: 'overlay/Tooltip' };

export const Placements = () => (
  <Stack direction="row" gap={6} align="center" style={{ padding: 60 }}>
    {(['top', 'right', 'bottom', 'left'] as const).map((p) => (
      <Tooltip key={p} content={`${p} tooltip`} placement={p}>
        <Button variant="outline" size="sm">{p}</Button>
      </Tooltip>
    ))}
  </Stack>
);

export const OnIconButton = () => (
  <Stack direction="row" gap={3}>
    <Tooltip content="알림 (현재 16개)">
      <IconButton aria-label="알림">
        <InfoIcon />
      </IconButton>
    </Tooltip>
    <Tooltip content="설정">
      <IconButton aria-label="설정" variant="ghost">
        <InfoIcon />
      </IconButton>
    </Tooltip>
  </Stack>
);

export const LongContent = () => (
  <Stack style={{ padding: 60 }}>
    <Tooltip content="여러 줄에 걸친 긴 tooltip 내용. maxWidth 280px이라 자연스럽게 wrap됨. UX는 잘 잡힘.">
      <Button>Hover for long tooltip</Button>
    </Tooltip>
  </Stack>
);

export const Delays = () => (
  <Stack direction="row" gap={3} style={{ padding: 40 }}>
    <Tooltip content="openDelay=0 (즉시)" openDelay={0}>
      <Button variant="outline" size="sm">no delay</Button>
    </Tooltip>
    <Tooltip content="openDelay=200 (default)">
      <Button variant="outline" size="sm">200ms</Button>
    </Tooltip>
    <Tooltip content="openDelay=600 (느림)" openDelay={600}>
      <Button variant="outline" size="sm">600ms</Button>
    </Tooltip>
  </Stack>
);

export const Disabled = () => (
  <Stack direction="row" gap={3} align="center">
    <Tooltip content="안 보임" disabled>
      <Button>disabled tooltip</Button>
    </Tooltip>
    <Text variant="labelSm" color="dim">disabled=true → tooltip 노출 안 됨</Text>
  </Stack>
);

// Phase 1 dark mode 회귀 가드. docs/PHASE2_DARK_CONTRAST_FINDINGS.md 참조.
// Tooltip trigger Button outline border + 'dim' text 위반 risk → todo.
export const PlacementsDark = () => (
  <Stack direction="row" gap={6} align="center" style={{ padding: 60 }}>
    {(['top', 'right', 'bottom', 'left'] as const).map((p) => (
      <Tooltip key={p} content={`${p} tooltip`} placement={p}>
        <Button variant="outline" size="sm">{p}</Button>
      </Tooltip>
    ))}
  </Stack>
);
PlacementsDark.globals = { theme: 'dark' };
PlacementsDark.parameters = { a11y: { test: 'todo' } };
