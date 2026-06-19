import { useState } from 'react';
import {
  Stack,
  Text,
  Card,
  Input,
  Button,
  Modal,
  SortableList,
  useToast,
} from '@wonik/web';

type Equip = { id: string; name: string };

const SEED: Equip[] = [
  { id: 'cvd-01', name: 'CVD-01 챔버' },
  { id: 'etch-02', name: 'ETCH-02 챔버' },
  { id: 'cmp-03', name: 'CMP-03 모듈' },
];

// 컨시어지 단일-HTML 납품의 "대표 화면" — file://로 열려도 색(토큰 var)·focus 링·
// dnd-kit 드래그·portal modal·toast가 전부 살아야 한다. singlefile-gate 검증 대상.
export function App() {
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Equip[]>(SEED);
  const toast = useToast();

  const reorder = (from: number, to: number) => {
    setItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  return (
    <Stack gap={6} p={6} style={{ maxWidth: 560, margin: '0 auto' }}>
      <Text as="h1" variant="h2" weight="medium">
        단일-HTML 납품 스파이크
      </Text>
      <Text variant="body" color="dim">
        file://로 열려도 색·focus·드래그·모달·토스트가 살아야 한다 (singlefile-gate 검증 대상).
      </Text>

      <Card variant="elevated" padding="md">
        <Stack gap={4}>
          <Input
            aria-label="설비 이름"
            placeholder="설비 이름 입력"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Stack direction="row" gap={3}>
            <Button
              id="primary-btn"
              onClick={() =>
                toast.show({
                  tone: 'success',
                  title: '저장됨',
                  description: name || '(이름 없음)',
                })
              }
            >
              저장
            </Button>
            <Button variant="danger" onClick={() => setName('')}>
              초기화
            </Button>
            <Button variant="outline" onClick={() => setOpen(true)}>
              상세 열기
            </Button>
          </Stack>
        </Stack>
      </Card>

      <Card variant="surface" padding="md">
        <Stack gap={3}>
          <Text as="h2" variant="h3" weight="medium">
            설비 순서 (드래그)
          </Text>
          <SortableList
            items={items}
            getKey={(it) => it.id}
            onReorder={reorder}
            renderItem={(item, _idx, args) => (
              <div
                ref={args.setNodeRef}
                style={{
                  ...args.itemStyle,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 10px',
                  border: '1px solid var(--color-border)',
                  borderRadius: 6,
                  background: 'var(--color-surface)',
                }}
              >
                <button
                  type="button"
                  aria-label={`${item.name} 드래그 핸들`}
                  style={{
                    cursor: 'grab',
                    border: 'none',
                    background: 'transparent',
                    fontSize: 16,
                  }}
                  {...args.dragHandleProps}
                >
                  ⠿
                </button>
                <Text variant="body" color="dark">
                  {item.name}
                </Text>
              </div>
            )}
          />
        </Stack>
      </Card>

      <Modal isOpen={open} onClose={() => setOpen(false)} title="설비 상세">
        <Text variant="body" color="dark">
          {name || '(이름 미입력)'} — file:// 단일 HTML에서 portal modal이 정상 렌더되는지 검증.
        </Text>
      </Modal>
    </Stack>
  );
}
