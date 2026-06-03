import { Text, Stack } from '@wonik/web';

export default { title: 'layout/Text' };

export const Variants = () => (
  <Stack gap={3}>
    <Text variant="titleSm" weight="medium" color="dark">titleSm (14px)</Text>
    <Text variant="label" weight="medium" color="dark">label medium (12px)</Text>
    <Text variant="label" color="dark">label regular (12px)</Text>
    <Text variant="labelSm" color="dark">labelSm (10px)</Text>
    <Text variant="micro" color="dark">micro (8px)</Text>
  </Stack>
);

export const Colors = () => (
  <Stack gap={2}>
    <Text variant="label" color="primary">primary</Text>
    <Text variant="label" color="secondary">secondary</Text>
    <Text variant="label" color="dim">dim</Text>
    <Text variant="label" color="dark">dark</Text>
  </Stack>
);

export const Weights = () => (
  <Stack gap={2}>
    <Text variant="label" weight="regular" color="dark">weight="regular" (400)</Text>
    <Text variant="label" weight="medium" color="dark">weight="medium" (500)</Text>
  </Stack>
);

export const Truncate = () => (
  <Stack gap={3} style={{ width: 240, border: '1px dashed var(--color-border-mid)', padding: 8 }}>
    <Text variant="label" color="dark" truncate>
      이것은 매우 긴 텍스트인데 truncate 옵션 켜져 있어서 한 줄로 잘림
    </Text>
    <Text variant="label" color="dark">
      이건 truncate 없어서 wrap되는 긴 텍스트 — 자연스럽게 두 줄로
    </Text>
  </Stack>
);

export const AsTag = () => (
  <Stack gap={2}>
    <Text as="h1" variant="titleSm" weight="medium" color="dark" style={{ fontSize: 20 }}>h1 with titleSm</Text>
    <Text as="p" variant="label" color="dark">p with label</Text>
    <Text as="span" variant="labelSm" color="dim">span with labelSm</Text>
  </Stack>
);

// Phase 1 dark mode 회귀 가드. docs/PHASE2_DARK_CONTRAST_FINDINGS.md 참조.
// T8d closure: 'dim' (textDark.dim #71717B→#A0A0A8, T8b/ADR-032)가 유일 위반이었고 canvas 위
// 4.92:1로 통과 → unskip. axe 게이트 실측 PASS (2026-05-29).
export const ColorsDark = () => (
  <Stack gap={2}>
    <Text variant="label" color="primary">primary</Text>
    <Text variant="label" color="secondary">secondary</Text>
    <Text variant="label" color="dim">dim</Text>
    <Text variant="label" color="dark">dark</Text>
  </Stack>
);
ColorsDark.globals = { theme: 'dark' };
