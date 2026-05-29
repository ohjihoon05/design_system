import { Stack, Text, Card, Badge } from '@wonik/web';
import type { CSSProperties, ReactNode } from 'react';
import { interfaceColors, surfaces, space, radius } from '@wonik/tokens';

export default {
  title: 'Introduction',
};

// ─── helpers ───────────────────────────────────────────────────────────────

const codeStyle: CSSProperties = {
  background: surfaces.surfaceSubtle,
  border: `1px solid ${interfaceColors.border}`,
  borderRadius: radius.sm,
  padding: `${space[4]} ${space[5]}`,
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: 12,
  lineHeight: 1.55,
  whiteSpace: 'pre',
  overflowX: 'auto',
  color: interfaceColors.text,
};

const swatchStyle = (background: string): CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: space[3],
  padding: `${space[2]} ${space[4]}`,
  background,
  color: surfaces.surfaceWhite,
  borderRadius: radius.sm,
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: 11,
  letterSpacing: 0.4,
});

const SectionCard = ({ title, children }: { title: string; children: ReactNode }) => (
  <Card padding="md">
    <Stack gap={3}>
      <Text variant="label" weight="medium" color="dark">
        {title}
      </Text>
      {children}
    </Stack>
  </Card>
);

const AtomGroup = ({ label, atoms }: { label: string; atoms: string[] }) => (
  <Stack direction="row" gap={3} style={{ flexWrap: 'wrap', alignItems: 'baseline' }}>
    <Text variant="labelSm" color="dim" style={{ minWidth: 72 }}>
      {label}
    </Text>
    <Text variant="labelSm" color="secondary" style={{ flex: 1 }}>
      {atoms.join(' · ')}
    </Text>
  </Stack>
);

// ─── stories ───────────────────────────────────────────────────────────────

// Phase 1 dark mode 회귀 가드. docs/PHASE2_DARK_CONTRAST_FINDINGS.md 참조.
// Welcome 전체는 무거우므로 짧은 hero + atom TOC 1개만 dark로. 'dim' text 위반 risk → todo.
export const WelcomeDark = () => (
  <Stack gap={6} style={{ maxWidth: 820 }}>
    <Stack gap={3}>
      <Text variant="titleSm" weight="medium" color="dark" style={{ fontSize: 24 }}>
        WONIK IPS — Design System (dark)
      </Text>
      <Text variant="label" color="dim">
        dark mode 회귀 가드 — Welcome story의 짧은 hero 부분만.
      </Text>
      <Stack direction="row" gap={3} style={{ alignItems: 'center', flexWrap: 'wrap' }}>
        <Badge variant="neutral">React 18 / 19 dual</Badge>
        <Badge variant="neutral">light + dark</Badge>
        <Badge variant="neutral">a11y gate ✓</Badge>
      </Stack>
    </Stack>
  </Stack>
);
WelcomeDark.globals = { theme: 'dark' };
WelcomeDark.parameters = { a11y: { test: 'todo' } };

export const Welcome = () => (
  <Stack gap={6} style={{ maxWidth: 820 }}>
    {/* Hero */}
    <Stack gap={3}>
      <Text variant="titleSm" weight="medium" color="dark" style={{ fontSize: 24 }}>
        WONIK IPS — Design System
      </Text>
      <Text variant="label" color="dim">
        원익IPS 사내 web service 전체에서 공통 사용할 디자인 시스템. 1단계는{' '}
        <code>@wonik/tokens</code> + <code>@wonik/web</code> 두 패키지, ppt(Factory PPT) +
        demo-fab-monitor가 첫 host.
      </Text>
      <Stack direction="row" gap={3} style={{ alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={swatchStyle('#273E82')}>WONIK BLUE · #273E82</span>
        <span style={{ ...swatchStyle('#ACACAC'), color: '#1E1E21' }}>
          WONIK GRAY · #ACACAC
        </span>
        <Badge variant="neutral">React 18 / 19 dual</Badge>
        <Badge variant="neutral">light + dark</Badge>
        <Badge variant="neutral">a11y gate ✓</Badge>
      </Stack>
    </Stack>

    {/* 60초 시작 */}
    <SectionCard title="60초 시작 (host product에서)">
      <Text variant="labelSm" color="secondary">
        사내 npm registry 결정 후엔 pnpm add 한 줄. 그 전까지는 vendor tarball.
      </Text>
      <pre style={codeStyle}>
{`# 1. install
pnpm add @wonik/web @wonik/tokens

# 2. app entry (src/main.tsx) — 1회만
import '@wonik/tokens/tokens.css';

# 3. 어디서나 import
import { Button, Card, Stack } from '@wonik/web';

<Card padding="md">
  <Stack gap={3}>
    <Button variant="primary">저장</Button>
  </Stack>
</Card>`}
      </pre>
    </SectionCard>

    {/* atom TOC */}
    <SectionCard title="24 atoms — 좌측 사이드바에서 카테고리별로 탐색">
      <Stack gap={3}>
        <AtomGroup label="Layout" atoms={['Box', 'Stack', 'Card']} />
        <AtomGroup label="Typography" atoms={['Text', 'InlineEditableText']} />
        <AtomGroup
          label="Form"
          atoms={['Button', 'IconButton', 'Input', 'Textarea', 'Checkbox', 'Switch', 'Radio', 'FilterChip']}
        />
        <AtomGroup label="Feedback" atoms={['Alert', 'Toast', 'Spinner', 'Skeleton', 'ProgressBar']} />
        <AtomGroup label="Overlay" atoms={['Modal', 'Tooltip']} />
        <AtomGroup label="Data" atoms={['Badge', 'Avatar']} />
        <AtomGroup label="Interaction" atoms={['SortableList']} />
        <AtomGroup label="Theme" atoms={['ThemeProvider', 'useTheme', 'ToastProvider', 'useToast']} />
      </Stack>
      <Text variant="labelSm" color="dim">
        상단 툴바의 Theme 토글로 light/dark 동시 검수. Accessibility 탭에서 axe 결과 확인.
      </Text>
    </SectionCard>

    {/* Host 색 덮어쓰기 */}
    <SectionCard title="Host 색 덮어쓰기 (cascade · ADR-010/011)">
      <Text variant="labelSm" color="secondary">
        7개 interface 변수만 정의하면 컴포넌트가 host 색을 자동 추종. 미정의 시 우리 internal default로
        fallback — host 학습 곡선 0, standalone 동작 보장.
      </Text>
      <pre style={codeStyle}>
{`:root {
  --color-bg: #FAFAFA;        /* page 배경 */
  --color-surface: #FFFFFF;   /* card / panel */
  --color-border: #E5E5E5;
  --color-text: #111111;
  --color-text-muted: #6B7280;
  --color-primary: #273E82;   /* WONIK BLUE default */
  --color-focus: #3B82F6;     /* focus ring 분리 hook */
}`}
      </pre>
    </SectionCard>

    {/* Quality gates */}
    <SectionCard title="Quality 게이트 (자동)">
      <AtomGroup
        label="a11y"
        atoms={[
          'jsx-a11y ESLint',
          'Storybook addon-a11y axe scan',
          'pre-commit hook (simple-git-hooks + lint-staged)',
        ]}
      />
      <AtomGroup label="test" atoms={['Vitest 331 unit tests', 'addon-vitest browser mode']} />
      <AtomGroup label="lint" atoms={['ESLint flat config + react-hooks']} />
      <AtomGroup label="release" atoms={['Changesets', 'peer-only contract (ADR-019)']} />
      <Text variant="labelSm" color="dim">
        새 컴포넌트는 evidence-driven — host에서 같은 패턴 3회 누적 후 atom 추가. trigger ≠ 결정.
      </Text>
    </SectionCard>

    {/* 다음 어디 */}
    <SectionCard title="다음 어디 (docs map)">
      <AtomGroup label="설치" atoms={['docs/INSTALL.md']} />
      <AtomGroup label="매일 사용" atoms={['docs/QUICKSTART.md']} />
      <AtomGroup label="시각 언어" atoms={['docs/UI_GUIDE.md (anti-pattern 9개 + brand)']} />
      <AtomGroup label="결정 이유" atoms={['docs/ADR.md (ADR-001~027)']} />
      <AtomGroup label="전체 그림" atoms={['docs/PRD.md', 'docs/ARCHITECTURE.md', 'docs/ROADMAP.md']} />
      <AtomGroup label="dogfood 사이클" atoms={['docs/dogfood-trial-1.md ~ trial-13.md']} />
    </SectionCard>
  </Stack>
);
