import { Stack, Box, Text } from '@wonik/web';

export default { title: 'layout/Stack' };

const Sample = ({ n }: { n: number }) => (
  <Box p={3} bg="surface" border="light" rounded="sm" style={{ minWidth: 40, textAlign: 'center' }}>
    <Text variant="labelSm" color="dark">{n}</Text>
  </Box>
);

export const Column = () => (
  <Stack gap={3}>
    <Sample n={1} />
    <Sample n={2} />
    <Sample n={3} />
  </Stack>
);

export const Row = () => (
  <Stack direction="row" gap={3}>
    <Sample n={1} />
    <Sample n={2} />
    <Sample n={3} />
  </Stack>
);

export const GapScale = () => (
  <Stack gap={5}>
    {[1, 2, 3, 4, 5, 6].map((g) => (
      <Stack key={g} gap={2}>
        <Text variant="labelSm" color="dim">gap={g}</Text>
        <Stack direction="row" gap={g as 1 | 2 | 3 | 4 | 5 | 6}>
          <Sample n={1} />
          <Sample n={2} />
          <Sample n={3} />
        </Stack>
      </Stack>
    ))}
  </Stack>
);

export const Justify = () => (
  <Stack gap={4} style={{ width: 360, border: '1px dashed var(--color-border-mid)' }}>
    {(['start', 'center', 'end', 'between'] as const).map((j) => (
      <Stack key={j} gap={1}>
        <Text variant="labelSm" color="dim">justify="{j}"</Text>
        <Stack direction="row" justify={j} gap={2}>
          <Sample n={1} />
          <Sample n={2} />
        </Stack>
      </Stack>
    ))}
  </Stack>
);

export const Align = () => (
  <Stack direction="row" gap={4}>
    {(['start', 'center', 'end'] as const).map((a) => (
      <Stack key={a} gap={1}>
        <Text variant="labelSm" color="dim">align="{a}"</Text>
        <Stack direction="row" align={a} gap={2} style={{ height: 60, border: '1px dashed var(--color-border-mid)' }}>
          <Sample n={1} />
          <Sample n={2} />
        </Stack>
      </Stack>
    ))}
  </Stack>
);

export const Wrap = () => (
  <Stack direction="row" gap={2} wrap style={{ width: 200, border: '1px dashed var(--color-border-mid)' }}>
    {Array.from({ length: 12 }, (_, i) => (
      <Sample key={i} n={i + 1} />
    ))}
  </Stack>
);

// Phase 1 dark mode 회귀 가드. docs/PHASE2_DARK_CONTRAST_FINDINGS.md 참조.
export const ColumnDark = () => (
  <Stack gap={3}>
    <Sample n={1} />
    <Sample n={2} />
    <Sample n={3} />
  </Stack>
);
ColumnDark.globals = { theme: 'dark' };
