# Step 2: sandbox-input-matrix

## 읽어야 할 파일

- `/CLAUDE.md` (CRITICAL — 1단계 web만 + sandbox는 시각 검증용)
- `/docs/UI_GUIDE.md` (AI 슬롭 anti-pattern)
- 이전 step 산출물:
  - `/packages/web/src/Input/Input.tsx`
  - `/packages/web/src/Input/types.ts`
  - `/packages/web/src/Textarea/Textarea.tsx`
  - `/packages/web/src/Textarea/types.ts`
  - `/packages/web/src/index.ts` (Input/Textarea export 확인)
  - `/apps/web-sandbox/src/App.tsx` (기존 Button/Box/Stack/Text 데모)

## 작업

`apps/web-sandbox/src/App.tsx`를 확장해 **Input·Textarea의 5 state × 3 size matrix를 시각 검증할 수 있는 데모 섹션**을 추가한다. 기존 Button·Box·Stack·Text·Before/After 섹션은 그대로 보존하고, 그 사이에 새 섹션 2개(`InputMatrixSection`, `TextareaMatrixSection`)를 끼워 넣는다.

이 step의 목적은 **"Input과 Textarea가 모든 state·size 조합에서 일관된 시각 결과를 낸다"**를 디자이너가 1쪽에서 확인할 수 있게 하는 것.

### 핵심 설계 결정

1. **state 5종**: default / hover (마우스 올린 상태로 둘 수는 없으니 시각적으로는 default와 동일하게 노출 — 별도 subsection으로 명시) / focus (autoFocus로 1개 미리 focus) / invalid / disabled.
   - 단, focus는 autoFocus 1개로 충분 (다른 state는 default state로 보여주고 사용자가 클릭해 focus 시도 가능).
   - hover는 별도 row 없이 commentary로 처리 (브라우저에서 마우스 올리면 보임).
   - **명시적으로 보여줄 row**: default / focus(autoFocus) / invalid / disabled / readOnly. 5 row.
2. **size 3종**: sm / md / lg. 각 row가 3 column으로 size 비교.
3. **Addon 데모**: Input의 leftAddon·rightAddon을 별도 subsection에서 — `<Text>$</Text>`, `<Text>kg</Text>`, "🔍" 같은 단순 콘텐츠로 시각 검증.
4. **Textarea matrix**: rows 비교(2/4/8) + invalid + disabled. 동일 시각 언어 확인용.
5. **새 컴포넌트·새 파일 생성 금지**: 모두 App.tsx 안에서 함수로 분리.
6. **자기 dogfood**: 새 섹션은 Stack·Box·Text로 짠다 (raw `<div>` 금지, Before/After의 BEFORE 사이드 제외).

### 1. 디렉토리 변경

`apps/web-sandbox/src/App.tsx`만 수정. 새 파일 생성 금지.

### 2. App.tsx 확장 형태

기존 main 구조(Button → Box → Stack → Text → BeforeAfter)에 Input·Textarea 섹션 추가:

```tsx
import { Button, Box, Stack, Text, Input, Textarea } from '@wonik/web';
import type { ButtonVariant, ButtonSize, TextVariant, TextWeight, InputSize } from '@wonik/web';

// ... 기존 ButtonSection / BoxSection / StackSection / TextSection / BeforeAfterSection 그대로 ...

export function App() {
  return (
    <Stack as="main" direction="column" gap={8}>
      {/* 기존 header */}
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

      {/* 새 섹션 */}
      <InputMatrixSection />
      <TextareaMatrixSection />

      {/* 기존 BeforeAfter 그대로 마지막 */}
      <BeforeAfterSection />
    </Stack>
  );
}

const inputSizes: InputSize[] = ['sm', 'md', 'lg'];

function InputMatrixSection() {
  return (
    <Stack direction="column" gap={5}>
      <Text variant="titleSm" weight="medium" as="h2">Input</Text>
      <Text color="secondary">
        5 state(default / focus / invalid / disabled / readOnly) × 3 size(sm / md / lg).
        브라우저에서 마우스를 올리거나 클릭해 hover·focus 상태를 직접 확인하세요.
      </Text>

      {/* default row */}
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

      {/* focus row — autoFocus로 1개 미리 focus */}
      <Stack direction="column" gap={3}>
        <Text variant="label" color="secondary" as="h3">focus (md, autoFocus)</Text>
        <Box style={{ width: 200 }}>
          <Input size="md" defaultValue="autofocus" autoFocus />
        </Box>
      </Stack>

      {/* invalid row */}
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

      {/* disabled row */}
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

      {/* readOnly row */}
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

      {/* addon 데모 */}
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

      {/* type 데모 — 입력 type 다양성 */}
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
```

**작성 원칙:**
- 새 섹션은 Stack·Box·Text로 짠다 (자기 dogfood). raw `<div>`는 BeforeAfter의 BEFORE 사이드에서만 의도적 사용.
- 새 파일 생성 금지 — App.tsx 안에 함수로.
- 추가 라이브러리 의존 0.
- AI 슬롭 0.

### 3. `apps/web-sandbox/package.json`

변경 불필요. workspace dependency `@wonik/web`이 이미 잡혀 Input·Textarea 자동 import.

## Acceptance Criteria

```bash
cd C:/Users/ohjih/design_system

# build
pnpm -F @wonik/web build
pnpm -F web-sandbox build         # production 빌드 성공
test -d apps/web-sandbox/dist

# dev server 기동 — 5174 또는 다음 포트 응답
pnpm -F web-sandbox dev &
DEV_PID=$!
sleep 8
(curl -sf http://localhost:5174 > /tmp/sandbox.html 2>/dev/null) || (curl -sf http://localhost:5175 > /tmp/sandbox.html)
grep -q "WONIK Web Sandbox" /tmp/sandbox.html
kill $DEV_PID 2>/dev/null || true

# 새 섹션 함수가 추가됐는지
grep -q "InputMatrixSection" apps/web-sandbox/src/App.tsx
grep -q "TextareaMatrixSection" apps/web-sandbox/src/App.tsx

# Input/Textarea가 import 됐는지
grep -E "import \{[^}]*Input[^}]*\}.*from '@wonik/web'" apps/web-sandbox/src/App.tsx
grep -E "import \{[^}]*Textarea[^}]*\}.*from '@wonik/web'" apps/web-sandbox/src/App.tsx

# 기존 섹션 회귀 — Button/Box/Stack/Text/BeforeAfter 모두 살아있어야 한다
grep -q "ButtonSection" apps/web-sandbox/src/App.tsx
grep -q "BoxSection" apps/web-sandbox/src/App.tsx
grep -q "StackSection" apps/web-sandbox/src/App.tsx
grep -q "TextSection" apps/web-sandbox/src/App.tsx
grep -q "BeforeAfterSection" apps/web-sandbox/src/App.tsx
```

위 명령이 모두 통과해야 한다.

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 자동 검증 통과 → status를 `completed`로 마크.
3. 결과에 따라 `phases/03-form-primitives/index.json`의 step 2를 업데이트:
   - 성공 → `"status": "completed"`, `"summary": "apps/web-sandbox에 Input·Textarea 시각 매트릭스 추가. 5 state × 3 size + addon · type · rows 데모. 자동 검증 통과. 다음 step에서 실제 form 예시(Stack + Text + Input + Button)로 atom들이 어떻게 합쳐지는지 시각화."`
   - 실패 → `"status": "error"`, `"error_message": "구체 사유"`

## 금지사항

- **새 컴포넌트 패키지 만들지 마라** (1단계는 tokens + web만, ADR-001).
- **새 파일 생성 금지** — App.tsx 한 파일 안에서.
- **추가 라이브러리 도입 금지.**
- **`packages/web` 코드 수정 금지** — Input/Textarea는 이미 완성. sandbox만 확장.
- **CSS-in-JS 라이브러리 도입 금지.**
- **AI 슬롭 anti-pattern 금지.**
- **ppt 프로젝트 코드 수정 금지.**
- **기존 섹션을 망가뜨리지 마라** (Button/Box/Stack/Text/BeforeAfter 모두 보존).
- **BEFORE 사이드의 raw `<div style>`를 Stack·Box로 바꾸지 마라.**
