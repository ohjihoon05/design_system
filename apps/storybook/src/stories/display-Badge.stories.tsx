import { Badge, Stack, Text } from '@wonik/web';

export default { title: 'display/Badge' };

export const Variants = () => (
  <Stack direction="row" gap={3} align="center">
    <Badge variant="neutral">neutral</Badge>
    <Badge variant="primary">primary</Badge>
  </Stack>
);

export const Usage = () => (
  <Stack gap={3}>
    <Stack direction="row" align="center" gap={2}>
      <Text variant="label" color="dark">Layout</Text>
      <Badge variant="neutral">draft</Badge>
    </Stack>
    <Stack direction="row" align="center" gap={2}>
      <Text variant="label" color="dark">Slides</Text>
      <Badge variant="primary">8</Badge>
    </Stack>
  </Stack>
);

export const LongText = () => (
  <Stack direction="row" gap={2}>
    <Badge>short</Badge>
    <Badge>v1.0.0</Badge>
    <Badge variant="primary">99+ items</Badge>
  </Stack>
);

// Phase 1 dark mode 회귀 가드. docs/PHASE2_DARK_CONTRAST_FINDINGS.md 참조.
export const VariantsDark = () => (
  <Stack direction="row" gap={3} align="center">
    <Badge variant="neutral">neutral</Badge>
    <Badge variant="primary">primary</Badge>
  </Stack>
);
VariantsDark.globals = { theme: 'dark' };
