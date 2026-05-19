import { Spinner, Stack, Text } from '@wonik/web';

export default { title: 'feedback/Spinner' };

export const Sizes = () => (
  <Stack direction="row" gap={5} align="center">
    {(['sm', 'md', 'lg'] as const).map((s) => (
      <Stack key={s} gap={2} align="center">
        <Spinner size={s} />
        <Text variant="labelSm" color="dim">{s}</Text>
      </Stack>
    ))}
  </Stack>
);

export const InContext = () => (
  <Stack direction="row" align="center" gap={2}>
    <Spinner size="sm" />
    <Text variant="label" color="dim">불러오는 중…</Text>
  </Stack>
);
