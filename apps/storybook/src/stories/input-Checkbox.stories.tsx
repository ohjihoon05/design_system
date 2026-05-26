import { useState } from 'react';
import { Checkbox, Stack, Text } from '@wonik/web';

// ADR-027 backlog: pre-existing a11y violations — `a11y.test: 'todo'`. See TODOS.md.
export default { title: 'input/Checkbox', parameters: { a11y: { test: 'todo' } } };

export const Basic = () => {
  const [c, setC] = useState(false);
  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control -- Checkbox is implicit-control inside <label>. See ADR-027.
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
