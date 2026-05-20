import { Box, Stack, Text } from '@wonik/web';

export default { title: 'layout/Box' };

export const Basic = () => (
  <Box p={4} bg="surface" border="light" rounded="md">
    <Text variant="label" color="dark">Box with p=4, bg="surface", border="light", rounded="md"</Text>
  </Box>
);

export const PaddingScale = () => (
  <Stack gap={3}>
    {[1, 3, 5, 6].map((p) => (
      <Box key={p} p={p as 1 | 3 | 5 | 6} bg="surfaceSubtle" border="light" rounded="sm">
        <Text variant="labelSm" color="dark">p={p}</Text>
      </Box>
    ))}
  </Stack>
);

export const AsTag = () => (
  <Stack gap={3}>
    <Box as="section" p={4} bg="surface" border="light" rounded="sm">
      <Text variant="labelSm" color="dim">as="section"</Text>
    </Box>
    <Box as="article" p={4} bg="surface" border="light" rounded="sm">
      <Text variant="labelSm" color="dim">as="article"</Text>
    </Box>
  </Stack>
);

export const Surfaces = () => (
  <Stack gap={3}>
    {(['canvas', 'surface', 'surfaceSubtle', 'surfaceWhite'] as const).map((s) => (
      <Box key={s} p={4} bg={s} border="light" rounded="sm">
        <Text variant="labelSm" color="dark">bg="{s}"</Text>
      </Box>
    ))}
  </Stack>
);
