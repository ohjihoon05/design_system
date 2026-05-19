import { useState } from 'react';
import { Switch, Stack, Text } from '@wonik/web';

export default { title: 'input/Switch' };

export const Basic = () => {
  const [on, setOn] = useState(true);
  return (
    <Stack direction="row" align="center" gap={2}>
      <Switch checked={on} onChange={(e) => setOn(e.target.checked)} />
      <Text variant="label" color="dark">{on ? 'On' : 'Off'}</Text>
    </Stack>
  );
};

export const Sizes = () => (
  <Stack gap={3}>
    {(['sm', 'md', 'lg'] as const).map((s) => (
      <Stack key={s} direction="row" align="center" gap={2}>
        <Switch size={s} defaultChecked />
        <Text variant="labelSm" color="dim">size="{s}"</Text>
      </Stack>
    ))}
  </Stack>
);

export const States = () => (
  <Stack gap={3}>
    <Stack direction="row" align="center" gap={2}>
      <Switch />
      <Text variant="labelSm" color="dim">off</Text>
    </Stack>
    <Stack direction="row" align="center" gap={2}>
      <Switch defaultChecked />
      <Text variant="labelSm" color="dim">on</Text>
    </Stack>
    <Stack direction="row" align="center" gap={2}>
      <Switch disabled />
      <Text variant="labelSm" color="dim">disabled off</Text>
    </Stack>
    <Stack direction="row" align="center" gap={2}>
      <Switch defaultChecked disabled />
      <Text variant="labelSm" color="dim">disabled on</Text>
    </Stack>
  </Stack>
);
