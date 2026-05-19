import { useState } from 'react';
import { Textarea, Stack, Text } from '@wonik/web';

export default { title: 'input/Textarea' };

export const Basic = () => {
  const [v, setV] = useState('');
  return <Textarea value={v} onChange={(e) => setV(e.target.value)} placeholder="여러 줄 입력…" rows={4} />;
};

export const Sizes = () => (
  <Stack gap={3} style={{ maxWidth: 360 }}>
    {(['sm', 'md', 'lg'] as const).map((s) => (
      <Stack key={s} gap={1}>
        <Text variant="labelSm" color="dim">size="{s}"</Text>
        <Textarea size={s} placeholder={`${s} placeholder`} rows={3} />
      </Stack>
    ))}
  </Stack>
);

export const Disabled = () => (
  <Stack style={{ maxWidth: 360 }}>
    <Textarea disabled value="disabled state" readOnly rows={3} />
  </Stack>
);
