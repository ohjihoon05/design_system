import { Skeleton, Stack, Card, Text } from '@wonik/web';

export default { title: 'feedback/Skeleton' };

export const Text_ = () => (
  <Stack gap={2} style={{ maxWidth: 320 }}>
    <Skeleton variant="text" />
    <Skeleton variant="text" />
    <Skeleton variant="text" style={{ width: '60%' }} />
  </Stack>
);

export const Rect = () => (
  <Skeleton variant="rect" style={{ width: 240, height: 120 }} />
);

export const Circle = () => (
  <Skeleton variant="circle" style={{ width: 48, height: 48 }} />
);

export const CardPattern = () => (
  <Card padding="md" style={{ maxWidth: 320 }}>
    <Stack gap={3}>
      <Stack direction="row" gap={3} align="center">
        <Skeleton variant="circle" style={{ width: 40, height: 40 }} />
        <Stack gap={1} style={{ flex: 1 }}>
          <Skeleton variant="text" style={{ width: '60%' }} />
          <Skeleton variant="text" style={{ width: '40%' }} />
        </Stack>
      </Stack>
      <Skeleton variant="rect" style={{ width: '100%', height: 80 }} />
      <Text variant="micro" color="dim">로딩 중 카드 스켈레톤 예시</Text>
    </Stack>
  </Card>
);

// Phase 1 dark mode 회귀 가드. docs/PHASE2_DARK_CONTRAST_FINDINGS.md 참조.
export const TextDark = () => (
  <Stack gap={2} style={{ maxWidth: 320 }}>
    <Skeleton variant="text" />
    <Skeleton variant="text" />
    <Skeleton variant="text" style={{ width: '60%' }} />
  </Stack>
);
TextDark.globals = { theme: 'dark' };
