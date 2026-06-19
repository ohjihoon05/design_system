import { ProgressBar, Stack, Text } from '@wonik/web';

export default { title: 'display/ProgressBar' };

export const Tones = () => (
  <Stack gap={4} style={{ maxWidth: 360 }}>
    {(['primary', 'alarm', 'ready'] as const).map((t) => (
      <Stack key={t} gap={1}>
        <Stack direction="row" justify="between">
          <Text variant="labelSm" color="dim">tone="{t}"</Text>
          <Text variant="labelSm" color="dark">62%</Text>
        </Stack>
        <ProgressBar value={62} tone={t} aria-label={`진행률 62% (tone=${t})`} />
      </Stack>
    ))}
  </Stack>
);

export const Heights = () => (
  <Stack gap={4} style={{ maxWidth: 360 }}>
    {[2, 4, 6, 10].map((h) => (
      <Stack key={h} gap={1}>
        <Text variant="labelSm" color="dim">height={h}</Text>
        <ProgressBar value={40} height={h} aria-label={`진행률 40% (height=${h})`} />
      </Stack>
    ))}
  </Stack>
);

export const Values = () => (
  <Stack gap={4} style={{ maxWidth: 360 }}>
    {[0, 25, 50, 75, 100].map((v) => (
      <Stack key={v} gap={1}>
        <Stack direction="row" justify="between">
          <Text variant="labelSm" color="dim">value={v}</Text>
          <Text variant="labelSm" color="dark">{v}%</Text>
        </Stack>
        <ProgressBar value={v} aria-label={`진행률 ${v}%`} />
      </Stack>
    ))}
  </Stack>
);

export const Clamp = () => (
  <Stack gap={2} style={{ maxWidth: 360 }}>
    <Text variant="labelSm" color="dim">value=-20 → 0 / value=150 → 100</Text>
    <ProgressBar value={-20} aria-label="진행률 (value=-20 → 0으로 clamp)" />
    <ProgressBar value={150} aria-label="진행률 (value=150 → 100으로 clamp)" />
  </Stack>
);
