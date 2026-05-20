import { Button, Stack, Text } from '@wonik/web';

export default { title: 'action/Button' };

export const Variants = () => (
  <Stack direction="row" gap={3}>
    <Button variant="primary">Primary</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="text">Text</Button>
    <Button variant="outline">Outline</Button>
    <Button variant="danger">Danger</Button>
  </Stack>
);

export const Sizes = () => (
  <Stack direction="row" gap={3} align="center">
    <Button size="sm">sm</Button>
    <Button size="md">md (default)</Button>
    <Button size="lg">lg</Button>
  </Stack>
);

export const VariantSizeMatrix = () => (
  <Stack gap={3}>
    {(['primary', 'secondary', 'outline', 'danger'] as const).map((v) => (
      <Stack key={v} gap={2}>
        <Text variant="labelSm" color="dim">variant="{v}"</Text>
        <Stack direction="row" gap={2} align="center">
          <Button variant={v} size="sm">sm</Button>
          <Button variant={v} size="md">md</Button>
          <Button variant={v} size="lg">lg</Button>
        </Stack>
      </Stack>
    ))}
  </Stack>
);

export const Disabled = () => (
  <Stack direction="row" gap={3}>
    <Button variant="primary" disabled>Disabled</Button>
    <Button variant="outline" disabled>Disabled</Button>
    <Button variant="text" disabled>Disabled</Button>
  </Stack>
);
