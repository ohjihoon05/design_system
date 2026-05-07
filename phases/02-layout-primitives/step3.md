# Step 3: sandbox-layout-demo

## 읽어야 할 파일

먼저 아래 파일을 읽고 sandbox 구조와 layout primitive의 가치를 파악하라:

- `/CLAUDE.md` (CRITICAL — sandbox는 시각 검증용. raw `<div>` 사용 금지의 의미)
- `/docs/UI_GUIDE.md` (AI 슬롭 anti-pattern)
- 이전 step 산출물:
  - `/packages/web/src/Box/Box.tsx`
  - `/packages/web/src/Stack/Stack.tsx`
  - `/packages/web/src/Text/Text.tsx`
  - `/packages/web/src/index.ts` (공개 표면 — Box/Stack/Text export 확인)
  - `/packages/web/dist/index.{js,mjs,d.ts}` (빌드 산출물)
  - `/apps/web-sandbox/src/App.tsx` (기존 Button 데모)
  - `/apps/web-sandbox/package.json` (workspace dependency 확인)
  - `/apps/web-sandbox/src/index.css` (토큰 CSS 변수 import)

## 작업

`apps/web-sandbox/src/App.tsx`를 확장해 **layout primitive의 가치를 시각화하는 데모**를 추가한다. 핵심: "Stack·Box 없을 때 raw `<div style>` 코드"와 "Stack·Box 있을 때 코드"를 **나란히** 보여주고, **결과물은 시각적으로 동일**하다는 점을 증명한다 — 즉 디자이너 입장에서 같은 결과를 token-driven 방식으로 얻는다는 것.

이 step의 목적은 **"layout primitive가 raw inline style보다 어떻게 더 나은가"를 디자이너가 눈으로 보고 손으로 코드를 비교**할 수 있는 1쪽짜리 sandbox 페이지.

### 핵심 설계 결정

1. **기존 Button 섹션은 그대로 보존** (회귀 0). 그 아래에 새 섹션 4개를 추가한다.
2. **새 섹션 1 — Box 데모**: padding·bg·border·rounded prop 4종을 시각화 (4 카드 grid 또는 row).
3. **새 섹션 2 — Stack 데모**: direction·gap·align·justify 차이를 카드 6개로 보여줌.
4. **새 섹션 3 — Text 데모**: variant 4종 × weight 2종 × color 핵심(primary/dim/brand) — 표 또는 list 형태.
5. **새 섹션 4 — Before/After 비교**: 가장 중요. 같은 Form 레이아웃을 (a) raw `<div style>`와 (b) Stack·Box·Text로 구현해 좌우(또는 상하)로 보여줌. 코드는 `<pre>`로 노출.
6. **새 컴포넌트 만들지 않는다** — 모든 데모 섹션은 App.tsx 안에 inline 정의한다. 이번 step은 시각화·문서화만.
7. **App.tsx 자체도 가능한 한 Stack·Box·Text를 사용해 dogfood**: section 사이 `<Stack gap={...}>`로 감싸기.

### 1. 디렉토리 변경 (최소)

```
apps/web-sandbox/src/
├── App.tsx               # 확장 (Button 섹션 + Box/Stack/Text 데모 섹션 + Before/After)
├── main.tsx              # 변경 없음
└── index.css             # 변경 없음
```

새 파일 생성 금지 — 모든 변화는 `App.tsx` 한 파일 안에.

### 2. `App.tsx` 시그니처 (확장 형태)

기존 Button 데모를 보존하고 그 아래에 layout primitive 데모를 추가한다. 전체 구조:

```tsx
import { Button, Box, Stack, Text } from '@wonik/web';
import type { ButtonVariant, ButtonSize, TextVariant, TextWeight } from '@wonik/web';

const variants: ButtonVariant[] = ['primary', 'secondary', 'text', 'outline', 'danger'];
const sizes: ButtonSize[] = ['sm', 'md', 'lg'];

export function App() {
  return (
    <Stack as="main" direction="column" gap={8}>
      {/* ─── 기존 Button section (그대로 보존, Stack으로 감싸도 OK) ─── */}
      <Stack as="header" direction="column" gap={3}>
        <Text variant="titleSm" weight="medium" as="h1">WONIK Web Sandbox</Text>
        <Text color="secondary">Button + layout primitives (Box / Stack / Text) 시각 검증.</Text>
      </Stack>

      <ButtonSection />

      {/* ─── 새로운 섹션들 ─── */}
      <BoxSection />
      <StackSection />
      <TextSection />
      <BeforeAfterSection />
    </Stack>
  );
}

function ButtonSection() {
  // 기존 5 variants × 3 sizes + disabled + click handler 데모 — 기존 코드 그대로 유지하되,
  // 가능하면 inline div를 Stack으로 교체.
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
  // direction (column/row), gap (3/6), align (center/start), justify (between/center) 시각화
  return (
    <Stack direction="column" gap={5}>
      <Text variant="titleSm" weight="medium" as="h2">Stack</Text>
      <Text color="secondary">direction · gap · align · justify · wrap.</Text>

      {/* gap 비교 */}
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

      {/* justify 비교 */}
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

      {/* align 비교 */}
      <Stack direction="column" gap={3}>
        <Text variant="label" color="secondary" as="h3">direction="row" align="center" / "stretch" (다른 높이)</Text>
        <Stack direction="row" align="center" gap={3} p={3} bg="surfaceSubtle" rounded="sm">
          <Box p={3} bg="surface" border="mid" rounded="sm"><Text>tall<br/>two lines</Text></Box>
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
        {/* BEFORE — raw div */}
        <Stack direction="column" gap={3} style={{ flex: 1, minWidth: 320 }}>
          <Text variant="label" weight="medium">BEFORE — raw &lt;div style&gt; (현재 ppt 코드 스타일)</Text>
          {/* 실제 렌더 */}
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
          {/* 코드 미리보기 */}
          <Box as="pre" p={3} bg="surfaceSubtle" rounded="sm" style={{ overflow: 'auto', fontSize: 11, lineHeight: 1.4, margin: 0 }}>
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

        {/* AFTER — Stack/Box/Text */}
        <Stack direction="column" gap={3} style={{ flex: 1, minWidth: 320 }}>
          <Text variant="label" weight="medium">AFTER — Stack · Box · Text (디자인 시스템)</Text>
          {/* 실제 렌더 — 위와 시각적으로 동일해야 함 */}
          <Stack direction="column" gap={6} p={7} bg="surface" border="mid" rounded="md">
            <Text variant="titleSm" weight="medium" color="dark">로그인</Text>
            <Text color="primary">이름과 비밀번호를 입력하세요.</Text>
            <Button>제출</Button>
          </Stack>
          {/* 코드 미리보기 */}
          <Box as="pre" p={3} bg="surfaceSubtle" rounded="sm" style={{ overflow: 'auto', fontSize: 11, lineHeight: 1.4, margin: 0 }}>
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
```

**작성 원칙:**
- 새 섹션 모두 `Stack`·`Box`·`Text`로 짠다 (자기 dogfood). raw `<div style>`는 BeforeAfter 섹션의 BEFORE 사이드에서만 의도적으로 사용 (대조용).
- `<pre>`로 코드를 보여줄 때는 `Box as="pre"`로 (Box를 통한 padding·bg·rounded 적용).
- 추가 의존성 도입 금지 (syntax highlighter 라이브러리 등). plain text 코드 미리보기로 충분.
- 새 파일 생성 금지 — `App.tsx` 한 파일 안에서 모든 섹션 처리.

### 3. `apps/web-sandbox/package.json`

변경 불필요. 기존 `@wonik/web`이 workspace dependency로 잡혀있고, Box/Stack/Text가 이미 그 패키지에 추가됐으므로 자동으로 import 가능.

## Acceptance Criteria

```bash
cd C:/Users/ohjih/design_system

# build sanity
pnpm -F @wonik/web build
pnpm -F web-sandbox build         # production 빌드 성공
test -d apps/web-sandbox/dist

# dev server 기동 확인
pnpm -F web-sandbox dev &
DEV_PID=$!
sleep 8
# 5174 또는 다음 포트(5175 등)가 응답해야 한다
curl -sf http://localhost:5174 > /tmp/sandbox.html 2>/dev/null || curl -sf http://localhost:5175 > /tmp/sandbox.html
grep -q "WONIK Web Sandbox" /tmp/sandbox.html
kill $DEV_PID 2>/dev/null || true

# App.tsx 안에 새 섹션이 포함됐는지 확인 — 함수 이름 grep
grep -q "BoxSection" apps/web-sandbox/src/App.tsx
grep -q "StackSection" apps/web-sandbox/src/App.tsx
grep -q "TextSection" apps/web-sandbox/src/App.tsx
grep -q "BeforeAfterSection" apps/web-sandbox/src/App.tsx

# Box/Stack/Text가 import 됐는지
grep -E "import \{[^}]*Box[^}]*\}.*from '@wonik/web'" apps/web-sandbox/src/App.tsx
grep -E "import \{[^}]*Stack[^}]*\}.*from '@wonik/web'" apps/web-sandbox/src/App.tsx
grep -E "import \{[^}]*Text[^}]*\}.*from '@wonik/web'" apps/web-sandbox/src/App.tsx

# Button 회귀 — 기존 5 variants × 3 sizes 데모가 살아있어야 한다
grep -q "Click me" apps/web-sandbox/src/App.tsx
grep -q "variants" apps/web-sandbox/src/App.tsx
```

위 명령이 모두 통과해야 한다.

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 자동 검증 OK → status를 **`completed`**로 직접 마크해도 무방 (이번 step은 시각 컴포넌트 회귀 위험이 낮고, 디자이너 시각 검증은 사용자가 자율적으로 수행).
   - 단, 사용자 시각 확인이 필요하다고 판단되면 step3-verification-notes-02.md(파일 이름 충돌 방지) 만들고 status를 **`blocked`**로 두는 것도 허용.
3. 결과에 따라 `phases/02-layout-primitives/index.json`의 step 3을 업데이트:
   - 성공 → `"status": "completed"`, `"summary": "apps/web-sandbox에 Box·Stack·Text 데모 + Before/After 비교 추가. layout primitive의 가치(token-driven spacing·color)가 시각적으로 입증됨. Phase 02 종료."`
   - 실패 → `"status": "error"`, `"error_message": "구체 사유"`

## 금지사항

- **새 컴포넌트 패키지 만들지 마라** — 이번 step은 sandbox 확장만 (ADR-001).
- **새 파일 생성 금지** — `App.tsx` 한 파일 안에서.
- **추가 라이브러리 도입 금지** (syntax highlighter, prism, highlight.js 등). plain `<pre>`로 충분.
- **`packages/web` 코드 수정 금지** — Box/Stack/Text는 이미 완성됨. sandbox만 확장.
- **CSS-in-JS 라이브러리 도입 금지.**
- **AI 슬롭 anti-pattern 금지** (gradient text, glass effect, glow shadow, rounded-2xl 일률 적용).
- **ppt 프로젝트 코드 수정 금지.**
- **기존 Button 데모 섹션을 망가뜨리지 마라** — 보존하면서 위·아래에 새 섹션 추가만.
- **BEFORE 사이드의 raw `<div style>`를 Stack·Box로 바꾸지 마라** — 대조용으로 의도적으로 raw로 남긴다.
