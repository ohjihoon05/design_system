import { Button, Stack, useToast } from '@wonik/web';

export default { title: 'overlay/Toast' };

export const FourTones = () => {
  const toast = useToast();
  return (
    <Stack direction="row" gap={2}>
      <Button onClick={() => toast.show({ tone: 'info', title: 'Info', description: '평범한 알림 메시지' })}>info</Button>
      <Button onClick={() => toast.show({ tone: 'success', title: 'Saved', description: '설정이 저장되었습니다' })}>success</Button>
      <Button onClick={() => toast.show({ tone: 'warning', title: 'Warning', description: 'Carrier gas pressure low' })}>warning</Button>
      <Button variant="danger" onClick={() => toast.show({ tone: 'error', title: 'Boom', description: 'Critical alarm 발생' })}>error</Button>
    </Stack>
  );
};

export const WithAction = () => {
  const toast = useToast();
  return (
    <Button onClick={() => toast.show({
      tone: 'info',
      title: 'Alarm closed',
      description: 'ETCH-02 · I-2204',
      action: { label: 'Undo', onClick: () => toast.show({ tone: 'success', title: 'Restored' }) },
      duration: 6000,
    })}>
      Show with Undo
    </Button>
  );
};

export const Persistent = () => {
  const toast = useToast();
  return (
    <Stack direction="row" gap={2}>
      <Button onClick={() => toast.show({ tone: 'warning', title: 'Sticky', description: 'duration=0 → 영구', duration: 0 })}>
        Persistent
      </Button>
      <Button variant="outline" onClick={() => toast.dismissAll()}>Dismiss all</Button>
    </Stack>
  );
};

export const StackOverflow = () => {
  const toast = useToast();
  return (
    <Button onClick={() => {
      for (let i = 1; i <= 7; i++) {
        toast.show({ tone: 'info', title: `Toast ${i}`, duration: 0 });
      }
    }}>
      7개 동시 발생 (max=5 → oldest drop)
    </Button>
  );
};
