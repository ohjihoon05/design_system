import { useState } from 'react';
import { Input, Stack, Text } from '@wonik/web';

export default { title: 'input/Input' };

export const Basic = () => {
  const [v, setV] = useState('');
  return <Input value={v} onChange={(e) => setV(e.target.value)} placeholder="Type here…" />;
};

export const Sizes = () => (
  <Stack gap={3} style={{ maxWidth: 320 }}>
    <Stack gap={1}>
      <Text variant="labelSm" color="dim">size="sm"</Text>
      <Input size="sm" placeholder="sm 24px" />
    </Stack>
    <Stack gap={1}>
      <Text variant="labelSm" color="dim">size="md" (default)</Text>
      <Input size="md" placeholder="md 32px" />
    </Stack>
    <Stack gap={1}>
      <Text variant="labelSm" color="dim">size="lg"</Text>
      <Input size="lg" placeholder="lg 40px" />
    </Stack>
  </Stack>
);

export const Disabled = () => (
  <Stack gap={3} style={{ maxWidth: 320 }}>
    <Input disabled placeholder="disabled empty" />
    <Input disabled value="disabled with value" readOnly />
  </Stack>
);

export const WithLeftAddon = () => {
  const SearchIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
  return (
    <Stack style={{ maxWidth: 320 }}>
      <Input placeholder="Search…" leftAddon={<SearchIcon />} />
    </Stack>
  );
};
