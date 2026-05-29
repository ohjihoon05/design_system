import { Stack, Text, Box } from '@wonik/web';

export default {
  title: 'tokens',
};

const Swatch = ({ name, varName }: { name: string; varName: string }) => (
  <Stack direction="row" align="center" gap={3}>
    <Box
      style={{
        width: 48,
        height: 32,
        background: `var(${varName})`,
        border: '1px solid var(--color-border-mid)',
        borderRadius: 5,
        flexShrink: 0,
      }}
    />
    <Stack gap={1} style={{ minWidth: 0, flex: 1 }}>
      <Text variant="labelSm" weight="medium" color="dark">{name}</Text>
      <Text variant="micro" color="dim">{varName}</Text>
    </Stack>
  </Stack>
);

export const Color_Brand = () => (
  <Stack gap={3} style={{ maxWidth: 480 }}>
    <Text variant="titleSm" weight="medium" color="dark">Brand</Text>
    <Swatch name="WONIK BLUE" varName="--color-primary" />
    <Swatch name="Primary pale" varName="--color-primary-pale" />
    <Swatch name="Primary bg" varName="--color-primary-bg" />
    <Swatch name="Primary selected" varName="--color-primary-selected" />
    <Swatch name="WONIK GRAY" varName="--color-brand-secondary" />
  </Stack>
);

// Phase 1 dark mode 회귀 가드. docs/PHASE2_DARK_CONTRAST_FINDINGS.md 참조.
export const Color_BrandDark = () => (
  <Stack gap={3} style={{ maxWidth: 480 }}>
    <Text variant="titleSm" weight="medium" color="dark">Brand (dark)</Text>
    <Swatch name="WONIK BLUE (dark)" varName="--color-primary" />
    <Swatch name="Primary pale" varName="--color-primary-pale" />
    <Swatch name="Primary bg" varName="--color-primary-bg" />
    <Swatch name="Primary selected" varName="--color-primary-selected" />
    <Swatch name="WONIK GRAY" varName="--color-brand-secondary" />
  </Stack>
);
Color_BrandDark.globals = { theme: 'dark' };

export const Color_Surface = () => (
  <Stack gap={3} style={{ maxWidth: 480 }}>
    <Text variant="titleSm" weight="medium" color="dark">Surface</Text>
    <Swatch name="canvas" varName="--color-canvas" />
    <Swatch name="surface" varName="--color-surface" />
    <Swatch name="surface-subtle" varName="--color-surface-subtle" />
    <Swatch name="surface-white" varName="--color-surface-white" />
  </Stack>
);

export const Color_Status = () => (
  <Stack gap={3} style={{ maxWidth: 480 }}>
    <Text variant="titleSm" weight="medium" color="dark">Status (semantic)</Text>
    <Swatch name="run-dot" varName="--color-status-run-dot" />
    <Swatch name="ready-dot" varName="--color-status-ready-dot" />
    <Swatch name="warning-text" varName="--color-status-warning-text" />
    <Swatch name="alarm-text" varName="--color-status-alarm-text" />
  </Stack>
);

export const Color_Text = () => (
  <Stack gap={3} style={{ maxWidth: 480 }}>
    <Text variant="titleSm" weight="medium" color="dark">Text</Text>
    <Swatch name="primary" varName="--color-text-primary" />
    <Swatch name="secondary" varName="--color-text-secondary" />
    <Swatch name="dim" varName="--color-text-dim" />
    <Swatch name="dark" varName="--color-text-dark" />
  </Stack>
);

export const Spacing = () => (
  <Stack gap={3} style={{ maxWidth: 480 }}>
    <Text variant="titleSm" weight="medium" color="dark">Spacing (space token)</Text>
    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
      <Stack key={n} direction="row" align="center" gap={3}>
        <Box style={{ height: 16, background: 'var(--color-primary)', width: `var(--space-${n}, 8px)`, flexShrink: 0 }} />
        <Text variant="labelSm" color="secondary">space[{n}]</Text>
      </Stack>
    ))}
  </Stack>
);

export const Typography = () => (
  <Stack gap={4} style={{ maxWidth: 480 }}>
    <Text variant="titleSm" weight="medium" color="dark" style={{ fontSize: 14 }}>titleSm (14px)</Text>
    <Text variant="label" weight="medium" color="dark">label (12px) · medium</Text>
    <Text variant="label" color="dark">label (12px) · regular</Text>
    <Text variant="labelSm" color="dark">labelSm (10px)</Text>
    <Text variant="micro" color="dark">micro (8px)</Text>
  </Stack>
);

export const Radius = () => (
  <Stack direction="row" gap={5} align="center">
    {[
      { name: 'sm (5px)', r: '5px' },
      { name: 'md (10px)', r: '10px' },
      { name: 'full (50%)', r: '50%' },
    ].map((x) => (
      <Stack key={x.name} gap={2} align="center">
        <Box style={{ width: 56, height: 56, background: 'var(--color-primary)', borderRadius: x.r }} />
        <Text variant="labelSm" color="dim">{x.name}</Text>
      </Stack>
    ))}
  </Stack>
);
