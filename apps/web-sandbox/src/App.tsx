import { Button, Box, Stack, Text, Input, Textarea } from '@wonik/web';
import type { ButtonVariant, ButtonSize, TextVariant, TextWeight, InputSize } from '@wonik/web';

const variants: ButtonVariant[] = ['primary', 'secondary', 'text', 'outline', 'danger'];
const sizes: ButtonSize[] = ['sm', 'md', 'lg'];
const inputSizes: InputSize[] = ['sm', 'md', 'lg'];

export function App() {
  return (
    <Stack as="main" direction="column" gap={8}>
      <Stack as="header" direction="column" gap={3}>
        <Text variant="titleSm" weight="medium" as="h1">WONIK Web Sandbox</Text>
        <Text color="secondary">
          Button + layout primitives (Box / Stack / Text) + form atoms (Input / Textarea) 시각 검증.
        </Text>
      </Stack>

      <ButtonSection />
      <BoxSection />
      <StackSection />
      <TextSection />
      <InputMatrixSection />
      <TextareaMatrixSection />
      <BeforeAfterSection />
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
