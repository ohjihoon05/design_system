import { Card, Stack, Text } from '@wonik/web';

export default { title: 'display/Card' };

export const Basic = () => (
  <Card padding="md" style={{ maxWidth: 360 }}>
    <Stack gap={2}>
      <Text variant="titleSm" weight="medium" color="dark" style={{ fontSize: 16 }}>Card title</Text>
      <Text variant="label" color="secondary">Default surface, medium padding, sm radius.</Text>
    </Stack>
  </Card>
);

export const Paddings = () => (
  <Stack gap={3}>
    {(['none', 'sm', 'md', 'lg'] as const).map((p) => (
      <Card key={p} padding={p}>
        <Text variant="labelSm" color="dim">padding="{p}"</Text>
      </Card>
    ))}
  </Stack>
);

export const Variants = () => (
  <Stack gap={3}>
    <Card padding="md" variant="surface">
      <Text variant="labelSm" color="dim">variant="surface" (default)</Text>
    </Card>
    <Card padding="md" variant="elevated">
      <Text variant="labelSm" color="dim">variant="elevated"</Text>
    </Card>
  </Stack>
);

// Phase 1 dark mode 회귀 가드. docs/PHASE2_DARK_CONTRAST_FINDINGS.md 참조.
export const BasicDark = () => (
  <Card padding="md" style={{ maxWidth: 360 }}>
    <Stack gap={2}>
      <Text variant="titleSm" weight="medium" color="dark" style={{ fontSize: 16 }}>Card title</Text>
      <Text variant="label" color="secondary">Default surface, medium padding, sm radius.</Text>
    </Stack>
  </Card>
);
BasicDark.globals = { theme: 'dark' };
