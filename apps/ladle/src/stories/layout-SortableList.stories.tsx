import { useState } from 'react';
import { SortableList, Stack, Text, Card, Badge, InlineEditableText } from '@wonik/web';

export default { title: 'layout/SortableList' };

type Item = { id: string; name: string };
const SEED: Item[] = [
  { id: '1', name: '시장 분석' },
  { id: '2', name: 'WONIK IPS 포지셔닝' },
  { id: '3', name: '경쟁 우위' },
  { id: '4', name: '로드맵' },
  { id: '5', name: 'Q&A' },
];

export const Basic = () => {
  const [items, setItems] = useState(SEED);
  return (
    <Stack gap={3} style={{ maxWidth: 360 }}>
      <Text variant="labelSm" color="dim">아이템 전체가 drag handle</Text>
      <SortableList<Item>
        items={items}
        getKey={(it) => it.id}
        onReorder={(from, to) => {
          const copy = [...items];
          const [moved] = copy.splice(from, 1);
          copy.splice(to, 0, moved);
          setItems(copy);
        }}
        renderItem={(item, idx, args) => (
          <div
            ref={args.setNodeRef}
            style={{
              ...args.itemStyle,
              padding: 12,
              marginBottom: 6,
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 5,
              cursor: 'grab',
            }}
            {...(args.dragHandleProps as object)}
          >
            <span style={{ fontFamily: 'monospace', opacity: 0.5, marginRight: 8 }}>
              {String(idx + 1).padStart(2, '0')}
            </span>
            {item.name}
          </div>
        )}
      />
    </Stack>
  );
};

export const WithCustomHandle = () => {
  const [items, setItems] = useState(SEED);
  return (
    <Stack gap={3} style={{ maxWidth: 360 }}>
      <Text variant="labelSm" color="dim">⠿ 핸들만 drag 가능 (나머지 영역은 click)</Text>
      <SortableList<Item>
        items={items}
        getKey={(it) => it.id}
        onReorder={(from, to) => {
          const copy = [...items];
          const [moved] = copy.splice(from, 1);
          copy.splice(to, 0, moved);
          setItems(copy);
        }}
        renderItem={(item, idx, args) => (
          <div
            ref={args.setNodeRef}
            style={{
              ...args.itemStyle,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: 12,
              marginBottom: 6,
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 5,
            }}
          >
            <button
              {...(args.dragHandleProps as object)}
              style={{
                cursor: 'grab',
                border: 'none',
                background: 'transparent',
                padding: 4,
                color: 'var(--color-text-muted)',
                fontSize: 16,
              }}
              aria-label="drag handle"
            >
              ⠿
            </button>
            <span style={{ flex: 1 }}>{item.name}</span>
            <button
              type="button"
              style={{
                border: 'none',
                background: 'transparent',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
              }}
              onClick={() => alert(`clicked ${item.name}`)}
            >
              click me
            </button>
          </div>
        )}
      />
    </Stack>
  );
};

export const Horizontal = () => {
  const [items, setItems] = useState([
    { id: 'a', name: 'A' },
    { id: 'b', name: 'B' },
    { id: 'c', name: 'C' },
    { id: 'd', name: 'D' },
    { id: 'e', name: 'E' },
  ]);
  return (
    <Stack gap={3}>
      <Text variant="labelSm" color="dim">direction="horizontal"</Text>
      <SortableList
        items={items}
        getKey={(it) => it.id}
        direction="horizontal"
        onReorder={(from, to) => {
          const copy = [...items];
          const [moved] = copy.splice(from, 1);
          copy.splice(to, 0, moved);
          setItems(copy);
        }}
        style={{ display: 'flex', gap: 8 }}
        renderItem={(item, idx, args) => (
          <div
            ref={args.setNodeRef}
            style={{
              ...args.itemStyle,
              width: 60,
              height: 60,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--color-primary-bg)',
              border: '1px solid var(--color-primary-stroke)',
              borderRadius: 5,
              cursor: 'grab',
              fontWeight: 500,
            }}
            {...(args.dragHandleProps as object)}
          >
            {item.name}
          </div>
        )}
      />
    </Stack>
  );
};

export const Disabled = () => {
  const [items] = useState(SEED);
  return (
    <Stack gap={3} style={{ maxWidth: 360 }}>
      <Text variant="labelSm" color="dim">disabled=true — drag/keyboard reorder 차단</Text>
      <SortableList<Item>
        items={items}
        getKey={(it) => it.id}
        disabled
        onReorder={() => {}}
        renderItem={(item, idx, args) => (
          <div
            ref={args.setNodeRef}
            style={{
              ...args.itemStyle,
              padding: 12,
              marginBottom: 6,
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 5,
              opacity: 0.6,
            }}
            {...(args.dragHandleProps as object)}
          >
            {item.name}
          </div>
        )}
      />
    </Stack>
  );
};

export const RealisticOutlineCard = () => {
  const [slides, setSlides] = useState([
    { id: 's1', title: '시장 분석 — 반도체 wafer 수요', layout: 'TextOnly' },
    { id: 's2', title: 'WONIK IPS 포지셔닝', layout: 'BulletList' },
    { id: 's3', title: '경쟁 우위', layout: 'TwoColumn' },
    { id: 's4', title: '재무 전망', layout: 'Chart' },
  ]);
  return (
    <Stack gap={3} style={{ maxWidth: 480 }}>
      <Text variant="labelSm" color="dim">
        ppt OutlineCard 모방 — InlineEditableText (Phase 23) + SortableList (Phase 24) 조합
      </Text>
      <SortableList
        items={slides}
        getKey={(it) => it.id}
        onReorder={(from, to) => {
          const copy = [...slides];
          const [moved] = copy.splice(from, 1);
          copy.splice(to, 0, moved);
          setSlides(copy);
        }}
        renderItem={(slide, idx, args) => (
          <div ref={args.setNodeRef} style={{ ...args.itemStyle, marginBottom: 8 }}>
            <Card variant="surface" padding="md">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button
                  {...(args.dragHandleProps as object)}
                  style={{
                    cursor: 'grab',
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--color-text-muted)',
                    fontSize: 18,
                    padding: 4,
                  }}
                  aria-label="순서 이동 (drag 또는 Space+방향키)"
                >
                  ⠿
                </button>
                <span style={{ fontFamily: 'monospace', opacity: 0.5 }}>
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <InlineEditableText
                    value={slide.title}
                    onChange={(next) => {
                      const copy = [...slides];
                      copy[idx] = { ...copy[idx], title: next };
                      setSlides(copy);
                    }}
                    as="span"
                  />
                  <div style={{ marginTop: 4 }}>
                    <Badge variant="neutral">{slide.layout}</Badge>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      />
    </Stack>
  );
};
