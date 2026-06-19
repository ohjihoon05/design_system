import { useState } from 'react';
import { InlineEditableText, Stack, Text, Button } from '@wonik/web';

export default { title: 'input/InlineEditableText' };

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

// ADR-027 backlog — DESIGN_CHOICE(owner/ADR 후보), seal 유지.
// InlineEditableText는 `as`와 무관하게 항상 role="button"을 부여한다(컴포넌트 계약).
// 따라서 as="h2"는 <h2 role="button">을 렌더 → role 오버라이드로 heading 의미가 사라진다
// (스크린리더 heading 탐색·문서 개요에서 누락).
//   exact axe rule: `aria-allowed-role` (cat.aria, **best-practice**, impact: minor).
//     - axe 4.11.4 jsdom에서는 violation으로 throw됨.
//     - 실 게이트(addon-a11y + playwright Chromium)에서는 WCAG-tagged 위반이 아니라 PASS(green)로
//       나오나, 이는 enforced ruleset이 best-practice를 막지 않을 뿐 실제 의미 결함은 존재 → 거짓
//       안심 방지를 위해 seal 유지(green이어도 un-seal하지 않음).
//   story-level로는 안전 수정 불가: heading 의미를 살리려면 컴포넌트가 as="h2"일 때 role="button"을
//     떼야 하므로 컴포넌트 계약 변경(owner 결정)이 필요. 데모 의도(as="h2" 시연) 자체가 이 결함을 노출.
//   recommended owner fix (component, 별도 ADR + Changesets): heading 시맨틱이 필요하면 inner span에
//     role="button"/tabIndex를 두고 바깥 <h2>는 순수 heading으로 두거나, 편집 가능 heading 패턴을
//     <h2><button>…</button></h2> 합성으로 분리. (또는 as=heading 조합을 prop으로 금지.)
export const AsHeading = () => {
  const [v, setV] = useState('슬라이드 제목');
  return (
    <Stack gap={2} style={{ maxWidth: 480 }}>
      <InlineEditableText value={v} onChange={setV} as="h2" size="lg" />
      <Text variant="labelSm" color="dim">as="h2" — semantic 태그 + size="lg"</Text>
    </Stack>
  );
};
AsHeading.parameters = { a11y: { test: 'todo' } };

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
          <div style={{ fontSize: 11, color: 'var(--color-text-dim)', marginTop: 4 }}>{item.body}</div>
        </div>
      ))}
      <Button size="sm" variant="outline" onClick={() => setItems(items.map((it) => ({ ...it, title: '(reset)' })))}>
        외부 value 일괄 변경 (drift sync 시연)
      </Button>
    </Stack>
  );
};
