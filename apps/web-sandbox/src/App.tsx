import { Button, Box, Stack, Text } from '@wonik/web';
import type { ButtonVariant, ButtonSize, TextVariant, TextWeight } from '@wonik/web';

const variants: ButtonVariant[] = ['primary', 'secondary', 'text', 'outline', 'danger'];
const sizes: ButtonSize[] = ['sm', 'md', 'lg'];

export function App() {
  return (
    <Stack as="main" direction="column" gap={8}>
      <Stack as="header" direction="column" gap={3}>
        <Text variant="titleSm" weight="medium" as="h1">WONIK Web Sandbox</Text>
        <Text color="secondary">Button + layout primitives (Box / Stack / Text) 시각 검증.</Text>
      </Stack>

      <ButtonSection />
      <BoxSection />
      <StackSection />
      <TextSection />
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
