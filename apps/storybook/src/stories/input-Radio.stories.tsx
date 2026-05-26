import { useState } from 'react';
import { Radio, Stack, Text } from '@wonik/web';

// ADR-027 backlog: pre-existing a11y violations — `a11y.test: 'todo'`. See TODOS.md.
export default { title: 'input/Radio', parameters: { a11y: { test: 'todo' } } };

export const Group = () => {
  const [v, setV] = useState('a');
  return (
    <Stack gap={2}>
      {['a', 'b', 'c'].map((opt) => (
        <label key={opt} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <Radio name="grp" value={opt} checked={v === opt} onChange={() => setV(opt)} />
          <Text variant="label" color="dark">Option {opt.toUpperCase()}</Text>
        </label>
      ))}
    </Stack>
  );
};

export const Sizes = () => (
  <Stack gap={3}>
    {(['sm', 'md', 'lg'] as const).map((s) => (
      <Stack key={s} direction="row" align="center" gap={2}>
        <Radio size={s} name={`sz-${s}`} defaultChecked />
        <Text variant="labelSm" color="dim">size="{s}"</Text>
      </Stack>
    ))}
  </Stack>
);

export const States = () => (
  <Stack gap={3}>
    <Stack direction="row" align="center" gap={2}>
      <Radio name="st" />
      <Text variant="labelSm" color="dim">unchecked</Text>
    </Stack>
    <Stack direction="row" align="center" gap={2}>
      <Radio name="st2" defaultChecked />
      <Text variant="labelSm" color="dim">checked</Text>
    </Stack>
    <Stack direction="row" align="center" gap={2}>
      <Radio name="st3" disabled />
      <Text variant="labelSm" color="dim">disabled</Text>
    </Stack>
    <Stack direction="row" align="center" gap={2}>
      <Radio name="st4" defaultChecked disabled />
      <Text variant="labelSm" color="dim">disabled checked</Text>
    </Stack>
  </Stack>
);
