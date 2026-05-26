import type { StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Button, Stack, Text } from '@wonik/web';

// ADR-027 backlog: pre-existing a11y violations — `a11y.test: 'todo'`. See TODOS.md.
export default { title: 'action/Button', parameters: { a11y: { test: 'todo' } } };

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
    {(['primary', 'secondary', 'text', 'outline', 'danger'] as const).map((v) => (
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

// 디자인 토큰 CSS가 테스트 브라우저에 실제로 로드됐는지 검증하는 단 하나의 story.
// primary 배경 = var(--color-primary) = WONIK BLUE #273E82 = rgb(39, 62, 130).
// @wonik/tokens 의 tokens.css 가 로드 안 되면 var() 가 풀리지 않아 이 단언이 실패한다.
export const CssCheck: StoryObj<typeof Button> = {
  render: () => <Button variant="primary">Submit</Button>,
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: /submit/i });
    await expect(getComputedStyle(button).backgroundColor).toBe('rgb(39, 62, 130)');
  },
};
