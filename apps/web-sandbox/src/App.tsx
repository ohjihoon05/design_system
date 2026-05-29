import { useState } from 'react';
import {
  Button, Box, Stack, Text, Input, Textarea,
  Checkbox, Switch, Radio,
  Spinner, Skeleton,
  Card, Badge, Alert,
  useTheme,
} from '@wonik/web';
import type {
  ButtonVariant, ButtonSize,
  TextVariant, TextWeight,
  InputSize,
  CheckboxSize, SwitchSize, RadioSize,
  SpinnerSize,
  CardVariant, CardPadding,
  BadgeVariant,
} from '@wonik/web';

// Text는 base 'p' props로 정의돼 native `htmlFor`를 type에 가지지 않지만,
// 컴포넌트 내부에서 ...rest로 그대로 spread되어 native label로 전달된다.
// sandbox에서 `<Text as="label" htmlFor="...">` 패턴을 type-safe하게 쓰기 위한 augmentation.
// 진짜 type-safe label 합성은 다음 phase의 FormField에서 다룬다.
declare module '@wonik/web' {
  interface TextProps {
    htmlFor?: string;
  }
}

const variants: ButtonVariant[] = ['primary', 'secondary', 'text', 'outline', 'danger'];
const sizes: ButtonSize[] = ['sm', 'md', 'lg'];
const inputSizes: InputSize[] = ['sm', 'md', 'lg'];
const checkboxSizes: CheckboxSize[] = ['sm', 'md', 'lg'];
const switchSizes: SwitchSize[] = ['sm', 'md', 'lg'];
const radioSizes: RadioSize[] = ['sm', 'md', 'lg'];
const spinnerSizes: SpinnerSize[] = ['sm', 'md', 'lg'];
const cardVariants: CardVariant[] = ['surface', 'elevated'];
const cardPaddings: CardPadding[] = ['none', 'sm', 'md', 'lg'];
const badgeVariants: BadgeVariant[] = ['neutral', 'primary'];
const badgeSamples: { label: string; content: string }[] = [
  { label: 'short label', content: 'layout' },
  { label: 'count number', content: '8장' },
  { label: 'single digit', content: '1' },
  { label: 'mixed', content: 'Draft v1.0' },
];

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <Button variant="secondary" size="sm" onClick={toggleTheme}>
      {theme === 'light' ? '🌙 dark' : '☀️ light'}
    </Button>
  );
}

export function App() {
  return (
    <Stack as="main" direction="column" gap={8}>
      <Stack as="header" direction="row" justify="between" align="start" gap={5}>
        <Stack direction="column" gap={3} style={{ flex: 1 }}>
          <Text variant="titleSm" weight="medium" as="h1">WONIK Web Sandbox</Text>
          <Text color="secondary">
            14 atoms (Button / Box / Stack / Text / Input / Textarea / Checkbox / Switch / Radio / Spinner / Skeleton / Card / Badge / Alert) + form 합성 + light/dark 테마.
          </Text>
        </Stack>
        <ThemeToggle />
      </Stack>

      <ButtonSection />
      <BoxSection />
      <StackSection />
      <TextSection />
      <InputMatrixSection />
      <TextareaMatrixSection />
      <FormExampleSection />

      {/* phase 05 — form atoms 2 */}
      <CheckboxMatrixSection />
      <SwitchMatrixSection />
      <RadioMatrixSection />
      <BooleanFormSection />

      {/* phase 06 — display atoms */}
      <SpinnerMatrixSection />
      <SkeletonMatrixSection />
      <LoadingScenarioSection />

      {/* phase 12 — Card */}
      <CardMatrixSection />

      {/* phase 14 — Badge */}
      <BadgeMatrixSection />

      {/* phase 16 — Alert */}
      <AlertMatrixSection />

      {/* Phase 5 회귀 가드 — cascade override dark 모드 회귀 검증 (ADR-010/011) */}
      <CascadeOverrideSection />

      <BeforeAfterSection />
    </Stack>
  );
}

/**
 * Phase 5: cascade override가 dark mode에서 깨지지 않는지 검증하는 1자리 테스트.
 * data-cascade-host attribute로 scope된 CSS variable override를 정의한 컨테이너 안에
 * Button + FilterChip + Alert을 두고, 상단 ThemeToggle로 light/dark 토글 시
 * host override(#FF6B35 — 눈에 띄는 주황) 색이 두 theme 모두에서 유지되는지 시각 검증.
 *
 * 통과 기준:
 *   - light: Button primary 색 = #FF6B35 (host override 적용)
 *   - dark : Button primary 색 = #FF6B35 (host override 유지 — internal dark token으로 깨지지 않음)
 * 실패 시 cascade 흐름 어딘가에서 [data-theme="dark"] block이 host override를 덮어쓰는 것.
 */
function CascadeOverrideSection() {
  return (
    <Stack direction="column" gap={5}>
      <Text variant="titleSm" weight="medium" as="h2">Phase 5 — cascade override 회귀 (light + dark)</Text>
      <Text color="secondary" variant="labelSm">
        host product 시뮬레이션: data-cascade-host scope 안에서 --color-primary와 --color-focus를 host orange(#FF6B35)로 override.
        상단 dark 토글 시에도 같은 orange 유지되어야 cascade가 dark mode에서 안 깨진 것.
      </Text>

      <style>{`
        [data-cascade-host="orange"] {
          --color-primary: #FF6B35;
          --color-focus: #FF6B35;
          --color-primary-selected: #FF6B35;
          --color-primary-bg: #FFE5D9;
        }
      `}</style>

      <Box
        {...{ 'data-cascade-host': 'orange' }}
        p={6}
        bg="surface"
        border="mid"
        rounded="md"
      >
        <Stack direction="column" gap={4}>
          <Text variant="label" weight="medium" color="dark">host override scope (orange = #FF6B35)</Text>
          <Stack direction="row" gap={3} align="center" wrap>
            <Button variant="primary">primary button</Button>
            <Button variant="secondary">secondary</Button>
            <Button variant="outline">outline</Button>
          </Stack>
          <Text variant="labelSm" color="secondary">
            ↑ light + dark 두 mode 모두에서 primary가 orange로 유지되어야 cascade가 dark mode에서 안 깨진 것.
          </Text>
        </Stack>
      </Box>

      <Box p={6} bg="surface" border="mid" rounded="md">
        <Stack direction="column" gap={4}>
          <Text variant="label" weight="medium" color="dark">scope 밖 (internal token 그대로)</Text>
          <Stack direction="row" gap={3} align="center" wrap>
            <Button variant="primary">primary button</Button>
            <Button variant="secondary">secondary</Button>
            <Button variant="outline">outline</Button>
          </Stack>
          <Text variant="labelSm" color="secondary">
            ↑ scope 밖이라 light에선 WONIK BLUE(#273E82), dark에선 primaryDark(#4A65B8) 정상 적용.
          </Text>
        </Stack>
      </Box>
    </Stack>
  );
}

function AlertMatrixSection() {
  return (
    <Stack direction="column" gap={5}>
      <Text variant="titleSm" weight="medium" as="h2">Alert</Text>
      <Text color="secondary" variant="labelSm">
        error-only 단일 variant (Trial 4+5+6 누적 3회 evidence). onDismiss 제공 시 × 닫기 버튼 자동 렌더. role="alert" 강제 (screen reader 알림).
      </Text>
      <Stack direction="column" gap={3}>
        <Text variant="label" color="secondary" as="h3">짧은 메시지 — dismiss 없음</Text>
        <Alert>네트워크 오류</Alert>
      </Stack>
      <Stack direction="column" gap={3}>
        <Text variant="label" color="secondary" as="h3">짧은 메시지 — dismiss 있음</Text>
        <Alert onDismiss={() => console.log('dismissed')}>네트워크 연결 실패</Alert>
      </Stack>
      <Stack direction="column" gap={3}>
        <Text variant="label" color="secondary" as="h3">긴 메시지 — dismiss 있음</Text>
        <Alert onDismiss={() => console.log('dismissed')}>
          서버에서 응답을 받지 못했습니다. 잠시 후 다시 시도해주세요. 문제가 계속 발생하면 관리자에게 문의하세요.
        </Alert>
      </Stack>
    </Stack>
  );
}

function BadgeMatrixSection() {
  return (
    <Stack direction="column" gap={5}>
      <Text variant="titleSm" weight="medium" as="h2">Badge</Text>
      <Text color="secondary" variant="labelSm">
        variant 2 × 컨텐츠 4 = 8셀. neutral은 subtle label (Trial 4 OutlineCard layout 패턴), primary는 attention count/tag (Trial 5 Home slideCount 패턴). 단일 sm 크기.
      </Text>
      {badgeVariants.map((variant) => (
        <Stack key={variant} direction="column" gap={3}>
          <Text variant="label" color="secondary" as="h3">{variant}</Text>
          <Stack direction="row" align="center" gap={5} style={{ flexWrap: 'wrap' }}>
            {badgeSamples.map((sample) => (
              <Stack key={sample.label} direction="column" gap={2} align="start">
                <Badge variant={variant}>{sample.content}</Badge>
                <Text variant="labelSm" color="secondary">{sample.label}</Text>
              </Stack>
            ))}
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
}

function CardMatrixSection() {
  return (
    <Stack direction="column" gap={5}>
      <Text variant="titleSm" weight="medium" as="h2">Card</Text>
      <Text color="secondary" variant="labelSm">
        variant 2 × padding 4 = 8개 조합. surface는 1px border, elevated는 light에서 약한 그림자(dark에선 그림자 0 — ADR-009 정신).
      </Text>
      {cardVariants.map((variant) => (
        <Stack key={variant} direction="column" gap={3}>
          <Text variant="label" color="secondary" as="h3">{variant}</Text>
          <Stack direction="row" align="start" gap={5} style={{ flexWrap: 'wrap' }}>
            {cardPaddings.map((padding) => (
              <Card
                key={padding}
                variant={variant}
                padding={padding}
                style={{ minWidth: 160 }}
              >
                <Stack direction="column" gap={2}>
                  <Text variant="label" weight="medium">{variant}/{padding}</Text>
                  <Text color="secondary" variant="labelSm">Card content</Text>
                </Stack>
              </Card>
            ))}
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
}

function ButtonSection() {
  return (
    <Stack direction="column" gap={5}>
      <Text variant="titleSm" weight="medium" as="h2">Button</Text>
      {variants.map((variant) => (
        <Stack key={variant} direction="column" gap={3}>
          <Text variant="label" color="secondary" as="h3">{variant}</Text>
          <Stack direction="row" align="center" gap={5}>
            {sizes.map((size) => (
              <Button key={size} variant={variant} size={size}>
                {variant}/{size}
              </Button>
            ))}
            <Button variant={variant} disabled>disabled</Button>
          </Stack>
        </Stack>
      ))}
      <Stack direction="column" gap={3}>
        <Text variant="label" color="secondary" as="h3">Click handler check</Text>
        <Button onClick={() => alert('clicked!')}>Click me</Button>
      </Stack>
    </Stack>
  );
}

function BoxSection() {
  return (
    <Stack direction="column" gap={5}>
      <Text variant="titleSm" weight="medium" as="h2">Box</Text>
      <Text color="secondary">padding · background · border · rounded — 모두 token으로.</Text>
      <Stack direction="row" gap={5} wrap>
        <Box p={6} bg="surface" border="mid" rounded="md">
          <Text>p=6, bg=surface, border=mid, rounded=md</Text>
        </Box>
        <Box p={6} bg="surfaceSubtle" rounded="sm">
          <Text>p=6, bg=surfaceSubtle, rounded=sm</Text>
        </Box>
        <Box px={6} py={3} bg="canvas" border="light" rounded="md">
          <Text>px=6, py=3, border=light</Text>
        </Box>
        <Box as="section" p={5} bg="surfaceMid" rounded="md">
          <Text>as=section, p=5</Text>
        </Box>
      </Stack>
    </Stack>
  );
}

function StackSection() {
  return (
    <Stack direction="column" gap={5}>
      <Text variant="titleSm" weight="medium" as="h2">Stack</Text>
      <Text color="secondary">direction · gap · align · justify · wrap.</Text>

      <Stack direction="column" gap={3}>
        <Text variant="label" color="secondary" as="h3">direction="row" gap=3 vs gap=6</Text>
        <Stack direction="row" gap={3}>
          <Box p={3} bg="surface" border="mid" rounded="sm"><Text>gap=3</Text></Box>
          <Box p={3} bg="surface" border="mid" rounded="sm"><Text>gap=3</Text></Box>
          <Box p={3} bg="surface" border="mid" rounded="sm"><Text>gap=3</Text></Box>
        </Stack>
        <Stack direction="row" gap={6}>
          <Box p={3} bg="surface" border="mid" rounded="sm"><Text>gap=6</Text></Box>
          <Box p={3} bg="surface" border="mid" rounded="sm"><Text>gap=6</Text></Box>
          <Box p={3} bg="surface" border="mid" rounded="sm"><Text>gap=6</Text></Box>
        </Stack>
      </Stack>

      <Stack direction="column" gap={3}>
        <Text variant="label" color="secondary" as="h3">direction="row" justify="between" / "center"</Text>
        <Stack direction="row" justify="between" p={3} bg="surfaceSubtle" rounded="sm">
          <Box p={3} bg="surface" border="mid" rounded="sm"><Text>start</Text></Box>
          <Box p={3} bg="surface" border="mid" rounded="sm"><Text>middle</Text></Box>
          <Box p={3} bg="surface" border="mid" rounded="sm"><Text>end</Text></Box>
        </Stack>
        <Stack direction="row" justify="center" gap={3} p={3} bg="surfaceSubtle" rounded="sm">
          <Box p={3} bg="surface" border="mid" rounded="sm"><Text>A</Text></Box>
          <Box p={3} bg="surface" border="mid" rounded="sm"><Text>B</Text></Box>
        </Stack>
      </Stack>

      <Stack direction="column" gap={3}>
        <Text variant="label" color="secondary" as="h3">direction="row" align="center" (다른 높이)</Text>
        <Stack direction="row" align="center" gap={3} p={3} bg="surfaceSubtle" rounded="sm">
          <Box p={3} bg="surface" border="mid" rounded="sm">
            <Text>tall<br />two lines</Text>
          </Box>
          <Box p={3} bg="surface" border="mid" rounded="sm"><Text>short</Text></Box>
        </Stack>
      </Stack>
    </Stack>
  );
}

function TextSection() {
  const variantList: TextVariant[] = ['micro', 'labelSm', 'label', 'titleSm'];
  const weightList: TextWeight[] = ['regular', 'medium'];
  return (
    <Stack direction="column" gap={5}>
      <Text variant="titleSm" weight="medium" as="h2">Text</Text>
      <Text color="secondary">variant (8/10/12/14px) × weight × color.</Text>

      <Stack direction="column" gap={3}>
        {variantList.map((v) => (
          <Stack key={v} direction="row" align="center" gap={6}>
            <Text variant="label" color="secondary">{v}</Text>
            {weightList.map((w) => (
              <Text key={w} variant={v} weight={w}>
                {v} / {w}
              </Text>
            ))}
          </Stack>
        ))}
      </Stack>

      <Stack direction="column" gap={3}>
        <Text variant="label" color="secondary" as="h3">color</Text>
        <Stack direction="row" gap={6} wrap>
          <Text color="primary">primary</Text>
          <Text color="secondary">secondary</Text>
          <Text color="dim">dim</Text>
          <Text color="dark">dark</Text>
          <Text color="brand" weight="medium">brand (WONIK BLUE)</Text>
        </Stack>
      </Stack>

      <Stack direction="column" gap={3}>
        <Text variant="label" color="secondary" as="h3">truncate</Text>
        <Box p={3} bg="surface" border="mid" rounded="sm" style={{ maxWidth: 240 }}>
          <Text truncate>한 줄로 자르는 매우 매우 매우 매우 매우 긴 문장입니다 — ellipsis가 보여야 합니다.</Text>
        </Box>
      </Stack>
    </Stack>
  );
}

function InputMatrixSection() {
  return (
    <Stack direction="column" gap={5}>
      <Text variant="titleSm" weight="medium" as="h2">Input</Text>
      <Text color="secondary">
        5 state(default / focus / invalid / disabled / readOnly) × 3 size(sm / md / lg).
        브라우저에서 마우스를 올리거나 클릭해 hover · focus 상태를 직접 확인하세요.
      </Text>

      <Stack direction="column" gap={3}>
        <Text variant="label" color="secondary" as="h3">default</Text>
        <Stack direction="row" gap={5} align="center" wrap>
          {inputSizes.map((s) => (
            <Box key={s} style={{ width: 200 }}>
              <Input size={s} placeholder={`${s} placeholder`} />
            </Box>
          ))}
        </Stack>
      </Stack>

      <Stack direction="column" gap={3}>
        <Text variant="label" color="secondary" as="h3">focus (md, autoFocus)</Text>
        <Box style={{ width: 200 }}>
          {/* eslint-disable-next-line jsx-a11y/no-autofocus -- sandbox demo of autoFocus visual state; not shipping consumer code. See ADR-027. */}
          <Input size="md" defaultValue="autofocus" autoFocus />
        </Box>
      </Stack>

      <Stack direction="column" gap={3}>
        <Text variant="label" color="secondary" as="h3">invalid</Text>
        <Stack direction="row" gap={5} align="center" wrap>
          {inputSizes.map((s) => (
            <Box key={s} style={{ width: 200 }}>
              <Input size={s} invalid defaultValue="잘못된 값" />
            </Box>
          ))}
        </Stack>
      </Stack>

      <Stack direction="column" gap={3}>
        <Text variant="label" color="secondary" as="h3">disabled</Text>
        <Stack direction="row" gap={5} align="center" wrap>
          {inputSizes.map((s) => (
            <Box key={s} style={{ width: 200 }}>
              <Input size={s} disabled defaultValue="disabled" />
            </Box>
          ))}
        </Stack>
      </Stack>

      <Stack direction="column" gap={3}>
        <Text variant="label" color="secondary" as="h3">readOnly</Text>
        <Stack direction="row" gap={5} align="center" wrap>
          {inputSizes.map((s) => (
            <Box key={s} style={{ width: 200 }}>
              <Input size={s} readOnly defaultValue="readonly" />
            </Box>
          ))}
        </Stack>
      </Stack>

      <Stack direction="column" gap={3}>
        <Text variant="label" color="secondary" as="h3">leftAddon / rightAddon</Text>
        <Stack direction="row" gap={5} wrap>
          <Box style={{ width: 220 }}>
            <Input
              leftAddon={<Text color="dim">$</Text>}
              placeholder="amount"
            />
          </Box>
          <Box style={{ width: 220 }}>
            <Input
              rightAddon={<Text color="dim">kg</Text>}
              placeholder="weight"
            />
          </Box>
          <Box style={{ width: 240 }}>
            <Input
              leftAddon={<Text>🔍</Text>}
              rightAddon={<Text color="dim">⌘K</Text>}
              placeholder="검색..."
            />
          </Box>
        </Stack>
      </Stack>

      <Stack direction="column" gap={3}>
        <Text variant="label" color="secondary" as="h3">type 다양성 (text / email / number / password)</Text>
        <Stack direction="row" gap={5} wrap>
          <Box style={{ width: 220 }}><Input placeholder="text" /></Box>
          <Box style={{ width: 220 }}><Input type="email" placeholder="email" /></Box>
          <Box style={{ width: 220 }}><Input type="number" placeholder="number" /></Box>
          <Box style={{ width: 220 }}><Input type="password" placeholder="password" /></Box>
        </Stack>
      </Stack>
    </Stack>
  );
}

function TextareaMatrixSection() {
  return (
    <Stack direction="column" gap={5}>
      <Text variant="titleSm" weight="medium" as="h2">Textarea</Text>
      <Text color="secondary">
        rows 비교(2 / 4 / 8) + invalid + disabled. 사용자는 textarea 모서리에서 vertical 방향으로 크기 조절 가능.
      </Text>

      <Stack direction="column" gap={3}>
        <Text variant="label" color="secondary" as="h3">rows</Text>
        <Stack direction="row" gap={5} align="start" wrap>
          <Box style={{ width: 240 }}>
            <Text variant="labelSm" color="dim" style={{ marginBottom: 4 }}>rows=2</Text>
            <Textarea rows={2} placeholder="짧은 메모..." />
          </Box>
          <Box style={{ width: 240 }}>
            <Text variant="labelSm" color="dim" style={{ marginBottom: 4 }}>rows=4 (default)</Text>
            <Textarea placeholder="기본 4줄..." />
          </Box>
          <Box style={{ width: 240 }}>
            <Text variant="labelSm" color="dim" style={{ marginBottom: 4 }}>rows=8</Text>
            <Textarea rows={8} placeholder="긴 메모..." />
          </Box>
        </Stack>
      </Stack>

      <Stack direction="column" gap={3}>
        <Text variant="label" color="secondary" as="h3">invalid / disabled</Text>
        <Stack direction="row" gap={5} align="start" wrap>
          <Box style={{ width: 240 }}>
            <Text variant="labelSm" color="dim" style={{ marginBottom: 4 }}>invalid</Text>
            <Textarea invalid defaultValue={'잘못된\n입력입니다.'} rows={3} />
          </Box>
          <Box style={{ width: 240 }}>
            <Text variant="labelSm" color="dim" style={{ marginBottom: 4 }}>disabled</Text>
            <Textarea disabled defaultValue={'disabled\nstate'} rows={3} />
          </Box>
        </Stack>
      </Stack>

      <Stack direction="column" gap={3}>
        <Text variant="label" color="secondary" as="h3">size 비교 (sm / md / lg)</Text>
        <Stack direction="row" gap={5} align="start" wrap>
          <Box style={{ width: 240 }}>
            <Textarea size="sm" rows={3} placeholder="sm" />
          </Box>
          <Box style={{ width: 240 }}>
            <Textarea size="md" rows={3} placeholder="md" />
          </Box>
          <Box style={{ width: 240 }}>
            <Textarea size="lg" rows={3} placeholder="lg" />
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
}

function FormExampleSection() {
  const [name, setName]     = useState('');
  const [model, setModel]   = useState('');
  const [serial, setSerial] = useState('');
  const [memo, setMemo]     = useState('');
  const [submitted, setSubmitted] = useState<null | { name: string; model: string; serial: string; memo: string }>(null);

  const nameInvalid = submitted !== null && name.trim() === '';

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim() === '') {
      setSubmitted({ name, model, serial, memo });
      return;
    }
    alert(JSON.stringify({ name, model, serial, memo }, null, 2));
    setSubmitted({ name, model, serial, memo });
  }

  function handleReset() {
    setName('');
    setModel('');
    setSerial('');
    setMemo('');
    setSubmitted(null);
  }

  return (
    <Stack direction="column" gap={5}>
      <Text variant="titleSm" weight="medium" as="h2">Form 합성 예시 — atom만으로</Text>
      <Text color="secondary">
        Button + Stack + Text(as="label") + Input + Textarea만으로 짠 "장비 등록" 폼.
        FormField 같은 composition 컴포넌트 없이, atom 5개로 실제 사용 가능한 폼이 만들어집니다.
        여기서 label·error 메시지를 매번 손으로 묶어야 한다는 것을 느꼈다면 — 그게 다음 phase의 FormField 동기입니다.
      </Text>

      <Box
        as="form"
        onSubmit={handleSubmit}
        p={7}
        bg="surface"
        border="mid"
        rounded="md"
        style={{ maxWidth: 480 }}
      >
        <Stack direction="column" gap={5}>
          {/* name 필드 — invalid 데모 */}
          <Stack direction="column" gap={2}>
            <Text variant="label" weight="medium" as="label" htmlFor="eq-name">
              장비 이름 <Text as="span" color="brand">*</Text>
            </Text>
            <Input
              id="eq-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              invalid={nameInvalid}
              placeholder="예: ATM-3000"
            />
            {nameInvalid && (
              <Text variant="labelSm" weight="medium" style={{ color: 'var(--color-status-alarm-text)' }}>
                장비 이름은 필수입니다.
              </Text>
            )}
          </Stack>

          {/* model 필드 */}
          <Stack direction="column" gap={2}>
            <Text variant="label" weight="medium" as="label" htmlFor="eq-model">모델</Text>
            <Input
              id="eq-model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="예: PE-CVD"
            />
          </Stack>

          {/* serial 필드 — leftAddon으로 prefix */}
          <Stack direction="column" gap={2}>
            <Text variant="label" weight="medium" as="label" htmlFor="eq-serial">시리얼 번호</Text>
            <Input
              id="eq-serial"
              value={serial}
              onChange={(e) => setSerial(e.target.value)}
              leftAddon={<Text color="dim">SN-</Text>}
              placeholder="000000"
            />
          </Stack>

          {/* memo — Textarea */}
          <Stack direction="column" gap={2}>
            <Text variant="label" weight="medium" as="label" htmlFor="eq-memo">메모</Text>
            <Textarea
              id="eq-memo"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              rows={3}
              placeholder="설치 위치, 특이 사항 등"
            />
          </Stack>

          {/* 액션 버튼 */}
          <Stack direction="row" justify="end" gap={3}>
            <Button variant="text" onClick={handleReset} type="button">취소</Button>
            <Button variant="primary" type="submit">등록</Button>
          </Stack>
        </Stack>
      </Box>

      {submitted && !nameInvalid && (
        <Text color="secondary" variant="labelSm">
          ✓ 마지막 제출: {submitted.name} / {submitted.model || '-'} / {submitted.serial || '-'}
        </Text>
      )}
    </Stack>
  );
}

function CheckboxMatrixSection() {
  return (
    <Stack direction="column" gap={5}>
      <Text variant="titleSm" weight="medium" as="h2">Checkbox</Text>
      <Text color="secondary">
        4 state(default / checked / invalid / disabled) × 3 size(sm / md / lg). native input + accent-color로 토큰화.
      </Text>

      <Stack direction="column" gap={3}>
        <Text variant="label" color="secondary" as="h3">default (unchecked)</Text>
        <Stack direction="row" gap={6} align="center">
          {checkboxSizes.map((s) => <Checkbox key={s} size={s} />)}
        </Stack>
      </Stack>

      <Stack direction="column" gap={3}>
        <Text variant="label" color="secondary" as="h3">checked</Text>
        <Stack direction="row" gap={6} align="center">
          {checkboxSizes.map((s) => <Checkbox key={s} size={s} defaultChecked />)}
        </Stack>
      </Stack>

      <Stack direction="column" gap={3}>
        <Text variant="label" color="secondary" as="h3">invalid</Text>
        <Stack direction="row" gap={6} align="center">
          {checkboxSizes.map((s) => <Checkbox key={s} size={s} invalid />)}
        </Stack>
      </Stack>

      <Stack direction="column" gap={3}>
        <Text variant="label" color="secondary" as="h3">disabled</Text>
        <Stack direction="row" gap={6} align="center">
          {checkboxSizes.map((s) => <Checkbox key={s} size={s} disabled />)}
          {checkboxSizes.map((s) => <Checkbox key={`${s}-c`} size={s} disabled defaultChecked />)}
        </Stack>
      </Stack>
    </Stack>
  );
}

function SwitchMatrixSection() {
  return (
    <Stack direction="column" gap={5}>
      <Text variant="titleSm" weight="medium" as="h2">Switch</Text>
      <Text color="secondary">
        같은 boolean 의미, 다른 시각. label wrapper + visual track/thumb. role="switch" 부착으로 a11y.
      </Text>

      <Stack direction="column" gap={3}>
        <Text variant="label" color="secondary" as="h3">off / on</Text>
        <Stack direction="row" gap={6} align="center">
          {switchSizes.map((s) => <Switch key={s} size={s} />)}
          {switchSizes.map((s) => <Switch key={`${s}-on`} size={s} defaultChecked />)}
        </Stack>
      </Stack>

      <Stack direction="column" gap={3}>
        <Text variant="label" color="secondary" as="h3">invalid / disabled</Text>
        <Stack direction="row" gap={6} align="center">
          <Switch invalid />
          <Switch invalid defaultChecked />
          <Switch disabled />
          <Switch disabled defaultChecked />
        </Stack>
      </Stack>
    </Stack>
  );
}

function RadioMatrixSection() {
  return (
    <Stack direction="column" gap={5}>
      <Text variant="titleSm" weight="medium" as="h2">Radio</Text>
      <Text color="secondary">
        native name 속성으로 그룹화. 같은 name 안의 라디오 중 1개만 선택. RadioGroup composition은 후속 phase.
      </Text>

      <Stack direction="column" gap={3}>
        <Text variant="label" color="secondary" as="h3">default / checked</Text>
        <Stack direction="row" gap={6} align="center">
          {radioSizes.map((s) => <Radio key={s} name={`size-${s}`} size={s} />)}
          {radioSizes.map((s) => <Radio key={`${s}-c`} name={`size-${s}-c`} size={s} defaultChecked />)}
        </Stack>
      </Stack>

      <Stack direction="column" gap={3}>
        <Text variant="label" color="secondary" as="h3">native name 그룹 (3개 중 1개 선택 — 클릭해보세요)</Text>
        <Stack direction="row" gap={6} align="center">
          <Stack direction="row" gap={3} align="center">
            <Radio name="recipe" value="cvd" defaultChecked id="r-cvd" />
            <Text as="label" htmlFor="r-cvd">CVD</Text>
          </Stack>
          <Stack direction="row" gap={3} align="center">
            <Radio name="recipe" value="etch" id="r-etch" />
            <Text as="label" htmlFor="r-etch">Etch</Text>
          </Stack>
          <Stack direction="row" gap={3} align="center">
            <Radio name="recipe" value="depo" id="r-depo" />
            <Text as="label" htmlFor="r-depo">Deposition</Text>
          </Stack>
        </Stack>
      </Stack>

      <Stack direction="column" gap={3}>
        <Text variant="label" color="secondary" as="h3">invalid / disabled</Text>
        <Stack direction="row" gap={6} align="center">
          <Radio invalid />
          <Radio disabled />
          <Radio disabled defaultChecked />
        </Stack>
      </Stack>
    </Stack>
  );
}

function BooleanFormSection() {
  const [emailNotify, setEmailNotify] = useState(true);
  const [pushNotify, setPushNotify] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [theme, setTheme] = useState<'system' | 'light' | 'dark'>('system');
  const [submitted, setSubmitted] = useState<unknown>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted({ emailNotify, pushNotify, autoSync, theme });
  }

  return (
    <Stack direction="column" gap={5}>
      <Text variant="titleSm" weight="medium" as="h2">Form 합성 — 알림 설정</Text>
      <Text color="secondary">
        Checkbox 2개(email/push) + Switch 1개(auto sync) + Radio group(theme) + Button. atom 4종으로 짠 controlled form.
      </Text>

      <Box
        as="form"
        onSubmit={handleSubmit}
        p={7}
        bg="surface"
        border="mid"
        rounded="md"
        style={{ maxWidth: 480 }}
      >
        <Stack direction="column" gap={6}>
          <Stack direction="column" gap={3}>
            <Text variant="label" weight="medium" as="h3">알림 채널</Text>
            <Stack direction="column" gap={3}>
              <Stack direction="row" gap={3} align="center">
                <Checkbox
                  id="notif-email"
                  checked={emailNotify}
                  onChange={(e) => setEmailNotify(e.target.checked)}
                />
                <Text as="label" htmlFor="notif-email">이메일</Text>
              </Stack>
              <Stack direction="row" gap={3} align="center">
                <Checkbox
                  id="notif-push"
                  checked={pushNotify}
                  onChange={(e) => setPushNotify(e.target.checked)}
                />
                <Text as="label" htmlFor="notif-push">푸시</Text>
              </Stack>
            </Stack>
          </Stack>

          <Stack direction="row" gap={3} align="center" justify="between">
            <Stack direction="column" gap={2}>
              <Text variant="label" weight="medium" as="label" htmlFor="auto-sync">자동 동기화</Text>
              <Text variant="labelSm" color="dim">백그라운드에서 5분마다 동기화</Text>
            </Stack>
            <Switch
              id="auto-sync"
              checked={autoSync}
              onChange={(e) => setAutoSync(e.target.checked)}
            />
          </Stack>

          <Stack direction="column" gap={3}>
            <Text variant="label" weight="medium" as="h3">테마</Text>
            <Stack direction="row" gap={6}>
              {(['system', 'light', 'dark'] as const).map((t) => (
                <Stack key={t} direction="row" gap={3} align="center">
                  <Radio
                    id={`theme-${t}`}
                    name="theme-pref"
                    value={t}
                    checked={theme === t}
                    onChange={() => setTheme(t)}
                  />
                  <Text as="label" htmlFor={`theme-${t}`}>{t}</Text>
                </Stack>
              ))}
            </Stack>
          </Stack>

          <Stack direction="row" justify="end" gap={3}>
            <Button variant="text" type="button" onClick={() => setSubmitted(null)}>리셋</Button>
            <Button variant="primary" type="submit">저장</Button>
          </Stack>
        </Stack>
      </Box>

      {submitted ? (
        <Box as="pre" p={3} bg="surfaceSubtle" rounded="sm" style={{ overflow: 'auto', fontSize: 11, lineHeight: 1.4, margin: 0 }}>
          {JSON.stringify(submitted, null, 2)}
        </Box>
      ) : null}
    </Stack>
  );
}

function SpinnerMatrixSection() {
  return (
    <Stack direction="column" gap={5}>
      <Text variant="titleSm" weight="medium" as="h2">Spinner</Text>

      <Stack direction="column" gap={3}>
        <Text variant="label" color="secondary" as="h3">size</Text>
        <Stack direction="row" align="center" gap={6}>
          {spinnerSizes.map((size) => (
            <Stack key={size} direction="column" align="center" gap={2}>
              <Spinner size={size} label={`Loading ${size}`} />
              <Text variant="labelSm" color="secondary">{size}</Text>
            </Stack>
          ))}
        </Stack>
      </Stack>

      <Stack direction="column" gap={3}>
        <Text variant="label" color="secondary" as="h3">color override (style.borderTopColor 외부 제어)</Text>
        <Stack direction="row" align="center" gap={6}>
          <Stack direction="column" align="center" gap={2}>
            <Spinner size="md" />
            <Text variant="labelSm" color="secondary">default (primary)</Text>
          </Stack>
          <Stack direction="column" align="center" gap={2}>
            <Spinner size="md" style={{ borderTopColor: 'var(--color-status-alarm-text)' }} />
            <Text variant="labelSm" color="secondary">alarm</Text>
          </Stack>
          <Stack direction="column" align="center" gap={2}>
            <Spinner size="md" style={{ borderTopColor: 'var(--color-text-secondary)' }} />
            <Text variant="labelSm" color="secondary">muted</Text>
          </Stack>
        </Stack>
      </Stack>

      <Stack direction="column" gap={3}>
        <Text variant="label" color="secondary" as="h3">inline with text</Text>
        <Stack direction="row" align="center" gap={3}>
          <Spinner size="sm" label="AI 생성 중" />
          <Text>AI가 슬라이드를 생성 중입니다…</Text>
        </Stack>
      </Stack>
    </Stack>
  );
}

function SkeletonMatrixSection() {
  return (
    <Stack direction="column" gap={5}>
      <Text variant="titleSm" weight="medium" as="h2">Skeleton</Text>

      <Stack direction="column" gap={3}>
        <Text variant="label" color="secondary" as="h3">variant</Text>

        <Stack direction="column" gap={2} style={{ width: 320 }}>
          <Text variant="labelSm" color="secondary">text (default — 1em high, 100% wide)</Text>
          <Skeleton variant="text" />
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="60%" />
        </Stack>

        <Stack direction="row" gap={5} align="start">
          <Stack direction="column" gap={2}>
            <Text variant="labelSm" color="secondary">rect (200×120)</Text>
            <Skeleton variant="rect" width={200} height={120} />
          </Stack>

          <Stack direction="column" gap={2}>
            <Text variant="labelSm" color="secondary">circle (40×40 — 아바타)</Text>
            <Skeleton variant="circle" width={40} height={40} />
          </Stack>

          <Stack direction="column" gap={2}>
            <Text variant="labelSm" color="secondary">circle (64×64 — 큰 아바타)</Text>
            <Skeleton variant="circle" width={64} height={64} />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}

function LoadingScenarioSection() {
  return (
    <Stack direction="column" gap={5}>
      <Text variant="titleSm" weight="medium" as="h2">시나리오 — AI 슬라이드 생성 중</Text>
      <Text variant="labelSm" color="secondary">
        ppt(첫 dogfood) 시나리오 시뮬레이션. atom 11개만으로 한 화면 흐름이 짜진다.
      </Text>

      <Box
        as="section"
        bg="surface"
        border="mid"
        rounded="md"
        p={6}
        style={{ width: 480 }}
      >
        <Stack direction="column" gap={5}>
          {/* 헤더: spinner + 진행 텍스트 */}
          <Stack direction="row" align="center" gap={3}>
            <Spinner size="md" label="AI 생성 중" />
            <Stack direction="column" gap={1} style={{ flex: 1 }}>
              <Text weight="medium">AI가 슬라이드 4 / 12 생성 중…</Text>
              <Text variant="labelSm" color="secondary">예상 소요 시간 약 30초</Text>
            </Stack>
          </Stack>

          {/* placeholder: 본문 텍스트 라인 + 슬라이드 썸네일 영역 */}
          <Stack direction="column" gap={3}>
            <Skeleton variant="text" width="70%" />
            <Skeleton variant="text" width="92%" />
            <Skeleton variant="text" width="85%" />
          </Stack>

          <Stack direction="row" gap={3}>
            <Skeleton variant="rect" width={140} height={80} />
            <Skeleton variant="rect" width={140} height={80} />
            <Skeleton variant="rect" width={140} height={80} />
          </Stack>

          {/* 본문 아바타 placeholder + 작성자 정보 */}
          <Stack direction="row" align="center" gap={3}>
            <Skeleton variant="circle" width={40} height={40} />
            <Stack direction="column" gap={1} style={{ flex: 1 }}>
              <Skeleton variant="text" width="40%" />
              <Skeleton variant="text" width="60%" />
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
}

function BeforeAfterSection() {
  return (
    <Stack direction="column" gap={5}>
      <Text variant="titleSm" weight="medium" as="h2">Before / After — 같은 폼, 다른 코드</Text>
      <Text color="secondary">
        같은 시각 결과를 raw inline style로 짠 것(왼쪽)과 Stack·Box·Text로 짠 것(오른쪽)의 코드 차이.
        시각적으로는 동일 — 하지만 오른쪽은 모든 spacing·color가 토큰으로 lock되어 있어 디자인 일관성이 자동 보장된다.
      </Text>

      <Stack direction="row" gap={6} wrap align="start">
        <Stack direction="column" gap={3} style={{ flex: 1, minWidth: 320 }}>
          <Text variant="label" weight="medium">BEFORE — raw &lt;div style&gt; (현재 ppt 코드 스타일)</Text>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              padding: 24,
              background: '#FEFEFE',
              border: '1px solid #D4D4D8',
              borderRadius: 10,
            }}
          >
            <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: '#303030' }}>로그인</p>
            <p style={{ margin: 0, fontSize: 12, color: '#71717B' }}>이름과 비밀번호를 입력하세요.</p>
            <Button>제출</Button>
          </div>
          <Box
            as="pre"
            p={3}
            bg="surfaceSubtle"
            rounded="sm"
            style={{ overflow: 'auto', fontSize: 11, lineHeight: 1.4, margin: 0 }}
          >
{`<div style={{
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  padding: 24,
  background: '#FEFEFE',
  border: '1px solid #D4D4D8',
  borderRadius: 10,
}}>
  <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: '#303030' }}>로그인</p>
  <p style={{ margin: 0, fontSize: 12, color: '#71717B' }}>이름과 비밀번호를 입력하세요.</p>
  <Button>제출</Button>
</div>`}
          </Box>
          <Text color="secondary" variant="labelSm">
            ⚠ 16/24/14/12px·#FEFEFE·#D4D4D8 모두 raw 값. 디자이너가 토큰을 갱신해도 자동 반영 안 됨.
          </Text>
        </Stack>

        <Stack direction="column" gap={3} style={{ flex: 1, minWidth: 320 }}>
          <Text variant="label" weight="medium">AFTER — Stack · Box · Text (디자인 시스템)</Text>
          <Stack direction="column" gap={6} p={7} bg="surface" border="mid" rounded="md">
            <Text variant="titleSm" weight="medium" color="dark">로그인</Text>
            <Text color="primary">이름과 비밀번호를 입력하세요.</Text>
            <Button>제출</Button>
          </Stack>
          <Box
            as="pre"
            p={3}
            bg="surfaceSubtle"
            rounded="sm"
            style={{ overflow: 'auto', fontSize: 11, lineHeight: 1.4, margin: 0 }}
          >
{`<Stack gap={6} p={7} bg="surface" border="mid" rounded="md">
  <Text variant="titleSm" weight="medium" color="dark">로그인</Text>
  <Text color="primary">이름과 비밀번호를 입력하세요.</Text>
  <Button>제출</Button>
</Stack>`}
          </Box>
          <Text color="brand" variant="labelSm" weight="medium">
            ✓ raw 값 0개. 모든 spacing·color가 토큰. 토큰 갱신 시 모든 사용처가 자동 반영.
          </Text>
        </Stack>
      </Stack>
    </Stack>
  );
}
