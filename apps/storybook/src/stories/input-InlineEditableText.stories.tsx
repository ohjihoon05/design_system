import { useState } from 'react';
import { InlineEditableText, Stack, Text, Button } from '@wonik/web';

// ADR-027 backlog: pre-existing a11y violations — `a11y.test: 'todo'`. See TODOS.md.
export default { title: 'input/InlineEditableText', parameters: { a11y: { test: 'todo' } } };

export const Basic = () => {
  const [v, setV] = useState('Click me to edit');
  return (
    <Stack gap={2} style={{ maxWidth: 320 }}>
      <InlineEditableText value={v} onChange={setV} />
      <Text variant="labelSm" color="dim">value: "{v}"</Text>
    </Stack>
  );
};

export const DoubleClick = () => {
  const [v, setV] = useState('Double-click to edit');
  return (
    <Stack gap={2} style={{ maxWidth: 320 }}>
      <InlineEditableText value={v} onChange={setV} trigger="double" />
      <Text variant="labelSm" color="dim">trigger="double" — single-click 무시</Text>
    </Stack>
  );
};

export const SaveOnBlurOff = () => {
  const [v, setV] = useState('Click out cancels');
  return (
    <Stack gap={2} style={{ maxWidth: 320 }}>
      <InlineEditableText value={v} onChange={setV} saveOnBlur={false} />
      <Text variant="labelSm" color="dim">saveOnBlur=false → click 외부 / blur = cancel</Text>
      <Text variant="labelSm" color="dim">Enter만 save, Escape = cancel</Text>
    </Stack>
  );
};

export const Disabled = () => {
  const [v] = useState('Locked');
  return (
    <Stack gap={2} style={{ maxWidth: 320 }}>
      <InlineEditableText value={v} onChange={() => {}} disabled />
      <Text variant="labelSm" color="dim">disabled — 클릭/Tab/Enter 진입 차단</Text>
    </Stack>
  );
};

export const Placeholder = () => {
  const [v, setV] = useState('');
  return (
    <Stack gap={2} style={{ maxWidth: 320 }}>
      <InlineEditableText value={v} onChange={setV} placeholder="제목을 입력하세요" />
      <Text variant="labelSm" color="dim">empty value → placeholder 색 자동 전환</Text>
    </Stack>
  );
};

export const AsHeading = () => {
  const [v, setV] = useState('슬라이드 제목');
  return (
    <Stack gap={2} style={{ maxWidth: 480 }}>
      <InlineEditableText value={v} onChange={setV} as="h2" size="lg" />
      <Text variant="labelSm" color="dim">as="h2" — semantic 태그 + size="lg"</Text>
    </Stack>
  );
};

export const RealisticOutlineCard = () => {
  const [items, setItems] = useState([
    { id: 1, title: '시장 분석 — 반도체 wafer 수요', body: '2026 매출 +18%' },
    { id: 2, title: 'WONIK IPS 포지셔닝', body: 'Etch 장비 시장 점유율' },
    { id: 3, title: '경쟁 우위', body: 'WARP HMI · 자체 디자인 시스템' },
  ]);
  return (
    <Stack gap={3} style={{ maxWidth: 480 }}>
      <Text variant="labelSm" color="dim">ppt OutlineCard dogfood 패턴 — 30줄 boilerplate → 1줄</Text>
      {items.map((item, idx) => (
        <div
          key={item.id}
          style={{
            padding: 12,
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 5,
          }}
        >
          <InlineEditableText
            value={item.title}
            onChange={(next) => {
              const copy = [...items];
              copy[idx] = { ...copy[idx], title: next };
              setItems(copy);
            }}
            as="span"
            size="md"
          />
          <div style={{ fontSize: 11, opacity: 0.6, marginTop: 4 }}>{item.body}</div>
        </div>
      ))}
      <Button size="sm" variant="outline" onClick={() => setItems(items.map((it) => ({ ...it, title: '(reset)' })))}>
        외부 value 일괄 변경 (drift sync 시연)
      </Button>
    </Stack>
  );
};
