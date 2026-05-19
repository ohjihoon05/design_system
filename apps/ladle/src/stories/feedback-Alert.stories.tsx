import { useState } from 'react';
import { Alert, Stack, Text } from '@wonik/web';

export default { title: 'feedback/Alert' };

export const Basic = () => (
  <Alert>
    <Stack gap={1}>
      <Text variant="titleSm" weight="medium" style={{ color: 'inherit' }}>3 unacknowledged critical alarms</Text>
      <Text variant="labelSm" style={{ color: 'inherit', opacity: 0.85 }}>· CVD-01, ETCH-02, ALD-01</Text>
    </Stack>
  </Alert>
);

export const Dismissable = () => {
  const [open, setOpen] = useState(true);
  if (!open) return <Text variant="labelSm" color="dim">dismissed (refresh to restore)</Text>;
  return (
    <Alert onDismiss={() => setOpen(false)}>
      <Text variant="label" style={{ color: 'inherit' }}>닫기 가능 알람</Text>
    </Alert>
  );
};

export const LongText = () => (
  <Alert>
    <Text variant="label" style={{ color: 'inherit' }}>
      여러 줄에 걸친 긴 알람 메시지. Carrier gas pressure low (0.7 mTorr) — 점검 권장. 1시간 내 응답 없을 시 자동 escalation 정책 가동.
    </Text>
  </Alert>
);
