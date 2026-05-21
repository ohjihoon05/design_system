import { useState } from 'react';
import { Checkbox, Stack, Text } from '@wonik/web';

export default { title: 'input/Checkbox' };

export const Basic = () => {
  const [c, setC] = useState(false);
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
      <Checkbox checked={c} onChange={(e) => setC(e.target.checked)} />
      <Text variant="label" color="dark">동의합니다</Text>
    </label>
  );
};

export const Sizes = () => (
  <Stack gap={3}>
    {(['sm', 'md', 'lg'] as const).map((s) => (
      <Stack key={s} direction="row" align="center" gap={2}>
        <Checkbox size={s} defaultChecked />
        <Text variant="labelSm" color="dim">size="{s}"</Text>
      </Stack>
    ))}
  </Stack>
);

export const States = () => (
  <Stack gap={3}>
    <Stack direction="row" align="center" gap={2}>
      <Checkbox />
      <Text variant="labelSm" color="dim">unchecked</Text>
    </Stack>
    <Stack direction="row" align="center" gap={2}>
      <Checkbox defaultChecked />
      <Text variant="labelSm" color="dim">checked</Text>
    </Stack>
    <Stack direction="row" align="center" gap={2}>
      <Checkbox disabled />
      <Text variant="labelSm" color="dim">disabled unchecked</Text>
    </Stack>
    <Stack direction="row" align="center" gap={2}>
      <Checkbox defaultChecked disabled />
      <Text variant="labelSm" color="dim">disabled checked</Text>
    </Stack>
  </Stack>
);
