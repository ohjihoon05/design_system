import { Avatar, Stack, Text } from '@wonik/web';

export default { title: 'display/Avatar' };

export const Default = () => <Avatar name="김기현" />;

export const Sizes = () => (
  <Stack direction="row" gap={3} align="center">
    {[24, 32, 48, 64, 96].map((s) => (
      <Stack key={s} gap={1} align="center">
        <Avatar name="김기현" size={s} />
        <Text variant="micro" color="dim">{s}px</Text>
      </Stack>
    ))}
  </Stack>
);

export const Names = () => (
  <Stack direction="row" gap={3} align="center">
    <Avatar name="김기현" />
    <Avatar name="Alice" />
    <Avatar name="🙂 user" />
    <Avatar name="" />
  </Stack>
);

export const Colors = () => (
  <Stack direction="row" gap={3} align="center">
    <Avatar name="A" />
    <Avatar name="B" color="var(--color-status-alarm-text)" />
    <Avatar name="C" color="var(--color-status-ready-dot)" />
    <Avatar name="D" color="var(--color-status-warning-text)" />
  </Stack>
);

// Phase 1 dark mode 회귀 가드. docs/PHASE2_DARK_CONTRAST_FINDINGS.md 참조.
export const DefaultDark = () => <Avatar name="김기현" />;
DefaultDark.globals = { theme: 'dark' };
