import { useState } from 'react';
import type { StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Modal, Button, Stack, Text } from '@wonik/web';

export default { title: 'overlay/Modal' };

export const Basic = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      <Modal isOpen={open} onClose={() => setOpen(false)} title="Basic modal">
        <Modal.Body>
          <Text variant="label" color="dark">기본 modal — title 자동 header + aria-labelledby 자동 연결.</Text>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="text" onClick={() => setOpen(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export const Sizes = () => {
  const [size, setSize] = useState<'sm' | 'md' | 'lg' | null>(null);
  return (
    <>
      <Stack direction="row" gap={2}>
        <Button onClick={() => setSize('sm')}>sm (480)</Button>
        <Button onClick={() => setSize('md')}>md (640)</Button>
        <Button onClick={() => setSize('lg')}>lg (800)</Button>
      </Stack>
      {size && (
        <Modal isOpen onClose={() => setSize(null)} title={`size="${size}"`} size={size}>
          <Modal.Body>
            <Text variant="label" color="dark">max-width 사이즈 비교용 modal.</Text>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="text" onClick={() => setSize(null)}>Close</Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export const DestructiveConfirm = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>Delete item</Button>
      <Modal isOpen={open} onClose={() => setOpen(false)} title="정말 삭제할까요?" size="sm">
        <Modal.Body>
          <Text variant="label" color="dark">이 동작은 되돌릴 수 없습니다.</Text>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="text" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="danger" onClick={() => setOpen(false)}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export const NoTitle = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open (no title header)</Button>
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <Modal.Body>
          <Text variant="label" color="dark">title 없을 때 header 자체 렌더 X. host가 직접 배치.</Text>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="text" onClick={() => setOpen(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export const NoCloseOnBackdrop = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open (backdrop 잠금)</Button>
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="backdrop 클릭으로 닫히지 않음"
        size="sm"
        closeOnBackdrop={false}
      >
        <Modal.Body>
          <Text variant="label" color="dark">closeOnBackdrop=false. × 또는 Cancel 버튼으로만 닫힘.</Text>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setOpen(false)}>OK</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

// 트리거 클릭 → modal 이 열려 dialog 가 나타나는지 검증.
export const OpensOnClick: StoryObj<typeof Modal> = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open modal</Button>
        <Modal isOpen={open} onClose={() => setOpen(false)} title="Basic modal">
          <Modal.Body>
            <Text variant="label" color="dark">play 함수로 열림을 검증하는 modal.</Text>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="text" onClick={() => setOpen(false)}>Close</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: /open modal/i }));
    // Modal 은 document.body 로 portal → canvas 밖. ownerDocument 로 조회.
    const dialog = await within(canvasElement.ownerDocument.body).findByRole('dialog');
    await expect(dialog).toBeVisible();
  },
};
