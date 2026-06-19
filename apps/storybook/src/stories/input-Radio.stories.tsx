import { useState } from 'react';
import { Radio, Stack, Text } from '@wonik/web';

export default { title: 'input/Radio' };

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
        <Radio size={s} name={`sz-${s}`} defaultChecked aria-label={`라디오 size="${s}"`} />
        <Text variant="labelSm" color="dim">size="{s}"</Text>
      </Stack>
    ))}
  </Stack>
);

export const States = () => (
  <Stack gap={3}>
    <Stack direction="row" align="center" gap={2}>
      <Radio name="st" aria-label="unchecked 라디오" />
      <Text variant="labelSm" color="dim">unchecked</Text>
    </Stack>
    <Stack direction="row" align="center" gap={2}>
      <Radio name="st2" defaultChecked aria-label="checked 라디오" />
      <Text variant="labelSm" color="dim">checked</Text>
    </Stack>
    <Stack direction="row" align="center" gap={2}>
      <Radio name="st3" disabled aria-label="disabled 라디오" />
      <Text variant="labelSm" color="dim">disabled</Text>
    </Stack>
    <Stack direction="row" align="center" gap={2}>
      <Radio name="st4" defaultChecked disabled aria-label="disabled checked 라디오" />
      <Text variant="labelSm" color="dim">disabled checked</Text>
    </Stack>
  </Stack>
);
