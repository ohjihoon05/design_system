import type { ReactNode } from 'react';
import { Stack, Text, Box } from '@wonik/web';
import { primitives, buttonTokens, tableTokens } from '@wonik/tokens';

export default {
  title: 'tokens',
};

// swatch driven by a CSS variable name (theme-aware)
const Swatch = ({ name, varName }: { name: string; varName: string }) => (
  <Stack direction="row" align="center" gap={3}>
    <Box
      style={{
        width: 48,
        height: 32,
        background: `var(${varName})`,
        border: '1px solid var(--color-border-mid)',
        borderRadius: 5,
        flexShrink: 0,
      }}
    />
    <Stack gap={1} style={{ minWidth: 0, flex: 1 }}>
      <Text variant="labelSm" weight="medium" color="dark">{name}</Text>
      <Text variant="micro" color="dim">{varName}</Text>
    </Stack>
  </Stack>
);

// compact chip driven by any raw CSS color value (hex or var(...))
const Chip = ({ label, value, code }: { label: string; value: string; code?: string }) => (
  <Stack gap={1} style={{ width: 88 }}>
    <Box
      style={{
        width: 88,
        height: 44,
        background: value,
        border: '1px solid var(--color-border-mid)',
        borderRadius: 5,
      }}
    />
    <Text variant="micro" weight="medium" color="dark">{label}</Text>
    {code ? <Text variant="micro" color="dim">{code}</Text> : null}
  </Stack>
);

const Row = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{children}</div>
);

// strip `var(--x)` → `--x`
const cssName = (ref: string) => ref.replace(/^var\(/, '').replace(/\)$/, '');

export const Color_Primitives = () => (
  <Stack gap={5} style={{ maxWidth: 820 }}>
    <Stack gap={1}>
      <Text variant="titleSm" weight="medium" color="dark">Primitives — Figma 127색 (ADR-021)</Text>
      <Text variant="micro" color="dim">
        Figma "UI/UX Standardization 2.0" Primitives 컬렉션. hue 그룹 raw 팔레트 (의미 없음).
        blue/500은 ADR-007에 따라 WONIK BLUE #273E82로 remap.
      </Text>
    </Stack>
    {Object.entries(primitives).map(([hue, shades]) => (
      <Stack key={hue} gap={2}>
        <Text variant="labelSm" weight="medium" color="secondary">{hue}</Text>
        <Row>
          {Object.entries(shades).map(([leaf, hex]) => (
            <Chip key={leaf} label={leaf} value={hex} code={hex} />
          ))}
        </Row>
      </Stack>
    ))}
  </Stack>
);

export const Color_Brand = () => (
  <Stack gap={3} style={{ maxWidth: 480 }}>
    <Text variant="titleSm" weight="medium" color="dark">Brand</Text>
    <Swatch name="WONIK BLUE" varName="--color-primary" />
    <Swatch name="Primary pale" varName="--color-primary-pale" />
    <Swatch name="Primary bg" varName="--color-primary-bg" />
    <Swatch name="Primary selected" varName="--color-primary-selected" />
    <Swatch name="WONIK GRAY" varName="--color-brand-secondary" />
  </Stack>
);

// theme surfaces — Figma Standardization 2.0 Light/Dark 정합 (ADR-022, ADR-024)
export const Color_Surface = () => (
  <Stack gap={3} style={{ maxWidth: 480 }}>
    <Stack gap={1}>
      <Text variant="titleSm" weight="medium" color="dark">Surface — Figma 정합 (ADR-022·024)</Text>
      <Text variant="micro" color="dim">상단 Theme 토글로 light/dark 값 전환 확인.</Text>
    </Stack>
    <Swatch name="canvas" varName="--color-canvas" />
    <Swatch name="surface" varName="--color-surface" />
    <Swatch name="surface-subtle" varName="--color-surface-subtle" />
    <Swatch name="surface-inset" varName="--color-surface-inset" />
    <Swatch name="surface-mid" varName="--color-surface-mid" />
    <Swatch name="surface-white" varName="--color-surface-white" />
    <Swatch name="dark-base" varName="--color-dark-base" />
    <Swatch name="dark-header" varName="--color-dark-header" />
    <Swatch name="dark-hover" varName="--color-dark-hover" />
  </Stack>
);

export const Color_Status = () => (
  <Stack gap={3} style={{ maxWidth: 480 }}>
    <Text variant="titleSm" weight="medium" color="dark">Status (semantic)</Text>
    <Swatch name="run-dot" varName="--color-status-run-dot" />
    <Swatch name="ready-dot" varName="--color-status-ready-dot" />
    <Swatch name="warning-text" varName="--color-status-warning-text" />
    <Swatch name="alarm-text" varName="--color-status-alarm-text" />
  </Stack>
);

export const Color_Text = () => (
  <Stack gap={3} style={{ maxWidth: 480 }}>
    <Text variant="titleSm" weight="medium" color="dark">Text</Text>
    <Swatch name="primary" varName="--color-text-primary" />
    <Swatch name="secondary" varName="--color-text-secondary" />
    <Swatch name="dim" varName="--color-text-dim" />
    <Swatch name="dark" varName="--color-text-dark" />
  </Stack>
);

// Button component tokens — Figma Standardization 2.0 (ADR-023).
// Figma의 button은 아이콘+라벨 모드 버튼 (default/pressed/disabled 3-state).
const ButtonTile = ({ state }: { state: 'default' | 'pressed' | 'disabled' }) => {
  const t = buttonTokens[state];
  return (
    <Stack gap={2} align="center" style={{ width: 100 }}>
      <div
        style={{
          position: 'relative',
          width: 84,
          height: 84,
          background: t.bg,
          border: `1px solid ${t.outline}`,
          borderRadius: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        {state === 'pressed' ? (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '22%',
              right: '22%',
              height: 3,
              background: buttonTokens.pressed.top,
              borderRadius: 2,
            }}
          />
        ) : null}
        <div
          style={{
            width: 30,
            height: 30,
            background: t.imageBg,
            borderRadius: 7,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ width: 15, height: 15, background: t.image, borderRadius: 4 }} />
        </div>
        <span style={{ fontSize: 9, fontWeight: 600, color: t.text, letterSpacing: 0.5 }}>
          {state.toUpperCase()}
        </span>
      </div>
      <Text variant="micro" color="dim">{state}</Text>
    </Stack>
  );
};

export const Component_Button = () => (
  <Stack gap={5} style={{ maxWidth: 680 }}>
    <Stack gap={1}>
      <Text variant="titleSm" weight="medium" color="dark">Button component tokens (ADR-023)</Text>
      <Text variant="micro" color="dim">
        Figma "Standardization 2.0" button — 아이콘+라벨 모드 버튼. 토큰만 정의됨 (소비 컴포넌트 미배선).
        아래 타일은 토큰으로 합성한 미리보기. 상단 Theme 토글로 light/dark 확인.
      </Text>
    </Stack>
    <Row>
      <ButtonTile state="default" />
      <ButtonTile state="pressed" />
      <ButtonTile state="disabled" />
    </Row>
    {(['default', 'pressed', 'disabled'] as const).map((state) => (
      <Stack key={state} gap={2}>
        <Text variant="labelSm" weight="medium" color="secondary">{state}</Text>
        <Row>
          {Object.entries(buttonTokens[state]).map(([prop, ref]) => (
            <Chip key={prop} label={prop} value={ref} code={cssName(ref)} />
          ))}
        </Row>
      </Stack>
    ))}
  </Stack>
);

export const Component_Table = () => (
  <Stack gap={5} style={{ maxWidth: 820 }}>
    <Stack gap={1}>
      <Text variant="titleSm" weight="medium" color="dark">Table component tokens (ADR-025)</Text>
      <Text variant="micro" color="dim">
        Figma "Standardization 2.0" table — chrome(surface) + Fab 슬롯 점유 상태.
        토큰만 정의됨 (Table 컴포넌트 미작성). 상단 Theme 토글로 light/dark 확인.
      </Text>
    </Stack>
    {Object.entries(tableTokens).map(([group, props]) => (
      <Stack key={group} gap={2}>
        <Text variant="labelSm" weight="medium" color="secondary">{group}</Text>
        <Row>
          {Object.entries(props as Record<string, string>).map(([prop, ref]) => (
            <Chip key={prop} label={prop} value={ref} code={cssName(ref)} />
          ))}
        </Row>
      </Stack>
    ))}
  </Stack>
);

export const Spacing = () => (
  <Stack gap={3} style={{ maxWidth: 480 }}>
    <Text variant="titleSm" weight="medium" color="dark">Spacing (space token)</Text>
    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
      <Stack key={n} direction="row" align="center" gap={3}>
        <Box style={{ height: 16, background: 'var(--color-primary)', width: `var(--space-${n}, 8px)`, flexShrink: 0 }} />
        <Text variant="labelSm" color="secondary">space[{n}]</Text>
      </Stack>
    ))}
  </Stack>
);

export const Typography = () => (
  <Stack gap={4} style={{ maxWidth: 480 }}>
    <Text variant="titleSm" weight="medium" color="dark" style={{ fontSize: 14 }}>titleSm (14px)</Text>
    <Text variant="label" weight="medium" color="dark">label (12px) · medium</Text>
    <Text variant="label" color="dark">label (12px) · regular</Text>
    <Text variant="labelSm" color="dark">labelSm (10px)</Text>
    <Text variant="micro" color="dark">micro (8px)</Text>
  </Stack>
);

export const Radius = () => (
  <Stack direction="row" gap={5} align="center">
    {[
      { name: 'sm (5px)', r: '5px' },
      { name: 'md (10px)', r: '10px' },
      { name: 'full (50%)', r: '50%' },
    ].map((x) => (
      <Stack key={x.name} gap={2} align="center">
        <Box style={{ width: 56, height: 56, background: 'var(--color-primary)', borderRadius: x.r }} />
        <Text variant="labelSm" color="dim">{x.name}</Text>
      </Stack>
    ))}
  </Stack>
);
