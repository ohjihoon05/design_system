import { Stack, Text, Card } from '@wonik/web';

export default {
  title: 'intro',
};

export const Welcome = () => (
  <Stack gap={5} style={{ maxWidth: 720 }}>
    <Stack gap={2}>
      <Text variant="titleSm" weight="medium" color="dark" style={{ fontSize: 22 }}>
        WONIK IPS — Design System
      </Text>
      <Text variant="label" color="dim">
        원익IPS 사내 web service 전체에서 공통 사용할 디자인 시스템.
      </Text>
    </Stack>

    <Card padding="md">
      <Stack gap={3}>
        <Text variant="label" weight="medium" color="dark">현재 상태</Text>
        <Text variant="labelSm" color="secondary">
          • Layer A — atom 21개 안정화 (Box·Stack·Text·Button·IconButton·Input·Textarea·Checkbox·Radio·Switch·Spinner·Skeleton·Card·Badge·Alert·FilterChip·Avatar·ProgressBar·Modal·Toast·Tooltip)
        </Text>
        <Text variant="labelSm" color="secondary">
          • Layer B — Verdaccio dry run ✅, 사내 npm registry URL 대기
        </Text>
        <Text variant="labelSm" color="secondary">
          • dogfood — ppt(3 페이지) + demo-fab-monitor(전 atom 적용 + 15 자리)
        </Text>
      </Stack>
    </Card>

    <Card padding="md">
      <Stack gap={3}>
        <Text variant="label" weight="medium" color="dark">탐색 안내</Text>
        <Text variant="labelSm" color="secondary">
          좌측 사이드바에서 atom 카테고리별로 시각 매트릭스 확인. 상단 툴바의 Theme 토글로 light/dark 동시 검수.
        </Text>
      </Stack>
    </Card>
  </Stack>
);
