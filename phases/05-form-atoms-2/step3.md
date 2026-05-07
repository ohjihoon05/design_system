# Step 3: sandbox-form-atoms-2

## 읽어야 할 파일

- `/CLAUDE.md` (CRITICAL — 1단계 web만, AI 슬롭 anti-pattern, sandbox 시각 검증)
- `/docs/UI_GUIDE.md`
- 이전 step 산출물:
  - `/packages/web/src/Checkbox/Checkbox.tsx`
  - `/packages/web/src/Switch/Switch.tsx`
  - `/packages/web/src/Radio/Radio.tsx`
  - `/packages/web/src/index.ts` (Checkbox/Switch/Radio export 확인)
- 기존 sandbox:
  - `/apps/web-sandbox/src/App.tsx` (8개 섹션 + ThemeToggle)

## 작업

`apps/web-sandbox/src/App.tsx`를 확장해 **Checkbox / Switch / Radio**의 시각 매트릭스 + 짧은 form 데모를 추가한다. 기존 9개 섹션(Button / Box / Stack / Text / InputMatrix / TextareaMatrix / FormExample / BeforeAfter + ThemeToggle 헤더)은 그대로 보존, 그 사이에 새 섹션 4개를 끼워 넣는다.

이 step의 목적은 **"Checkbox·Switch·Radio가 light/dark 둘 다에서 정확히 동작 + Radio name 그룹이 시각적으로 한눈에"**.

### 핵심 설계 결정

1. **새 섹션 4개**:
   - `CheckboxMatrixSection` — state(default/checked/invalid/disabled) × size(sm/md/lg)
   - `SwitchMatrixSection` — state × size + ON 상태 프리뷰
   - `RadioMatrixSection` — state × size + native name 그룹 데모(3개 옵션 중 1개만 선택 가능)
   - `BooleanFormSection` — 짧은 폼: "알림 설정" 페이지 시나리오. Checkbox 2개 + Switch 1개 + Radio group 1개. controlled state + submit으로 atom들이 실제 합쳐지는 모습.
2. **기존 섹션 보존** — 회귀 0.
3. **새 컴포넌트·새 파일 생성 금지** — App.tsx 안에 함수로.
4. **자기 dogfood** — 모든 새 섹션은 Stack + Box + Text로.
5. **시각 검증은 사용자 자율** (phase 02·04 step3과 동일 패턴) — 자동 검증 통과 시 status를 `completed`로.

### 1. App.tsx 확장 — 새 섹션 4개

기존 import에 Checkbox/Switch/Radio 추가:

```tsx
import {
  Button, Box, Stack, Text, Input, Textarea,
  Checkbox, Switch, Radio,
  useTheme,
} from '@wonik/web';
import type {
  ButtonVariant, ButtonSize,
  TextVariant, TextWeight,
  InputSize,
  CheckboxSize, SwitchSize, RadioSize,
} from '@wonik/web';
import { useState } from 'react';
```

App() return 안에 새 섹션 추가 — 기존 InputMatrix/TextareaMatrix/FormExample 다음, BeforeAfter 직전:

```tsx
export function App() {
  return (
    <Stack as="main" direction="column" gap={8}>
      {/* 기존 헤더 + ThemeToggle 그대로 */}

      <ButtonSection />
      <BoxSection />
      <StackSection />
      <TextSection />
      <InputMatrixSection />
      <TextareaMatrixSection />
      <FormExampleSection />

      {/* 새 섹션 — phase 05 */}
      <CheckboxMatrixSection />
      <SwitchMatrixSection />
      <RadioMatrixSection />
      <BooleanFormSection />

      <BeforeAfterSection />
    </Stack>
  );
}
```

### 2. 각 새 섹션 구현

#### CheckboxMatrixSection

```tsx
const checkboxSizes: CheckboxSize[] = ['sm', 'md', 'lg'];

function CheckboxMatrixSection() {
  return (
    <Stack direction="column" gap={5}>
      <Text variant="titleSm" weight="medium" as="h2">Checkbox</Text>
      <Text color="secondary">
        4 state(default / checked / invalid / disabled) × 3 size(sm / md / lg). native input + accent-color로 토큰화.
      </Text>

      {/* default — unchecked */}
      <Stack direction="column" gap={3}>
        <Text variant="label" color="secondary" as="h3">default (unchecked)</Text>
        <Stack direction="row" gap={6} align="center">
          {checkboxSizes.map((s) => <Checkbox key={s} size={s} />)}
        </Stack>
      </Stack>

      {/* checked */}
      <Stack direction="column" gap={3}>
        <Text variant="label" color="secondary" as="h3">checked</Text>
        <Stack direction="row" gap={6} align="center">
          {checkboxSizes.map((s) => <Checkbox key={s} size={s} defaultChecked />)}
        </Stack>
      </Stack>

      {/* invalid */}
      <Stack direction="column" gap={3}>
        <Text variant="label" color="secondary" as="h3">invalid</Text>
        <Stack direction="row" gap={6} align="center">
          {checkboxSizes.map((s) => <Checkbox key={s} size={s} invalid />)}
        </Stack>
      </Stack>

      {/* disabled */}
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
```

#### SwitchMatrixSection

```tsx
const switchSizes: SwitchSize[] = ['sm', 'md', 'lg'];

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
```

#### RadioMatrixSection

```tsx
const radioSizes: RadioSize[] = ['sm', 'md', 'lg'];

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
```

#### BooleanFormSection — 실제 폼 시나리오

```tsx
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
        // @ts-expect-error — Box polymorphic의 onSubmit 타입 한계
        onSubmit={handleSubmit}
        p={7}
        bg="surface"
        border="mid"
        rounded="md"
        style={{ maxWidth: 480 }}
      >
        <Stack direction="column" gap={6}>
          {/* Checkbox 그룹 */}
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

          {/* Switch */}
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

          {/* Radio group */}
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
```

**작성 원칙:**
- 모든 새 섹션은 Stack/Box/Text로. raw `<div>` 금지 (BeforeAfter의 BEFORE 사이드 제외).
- label은 `<Text as="label" htmlFor="...">`로 — accessibility(`htmlFor` ↔ `id`).
- controlled state — useState로 form 값 보유.
- AI 슬롭 0.

### 3. apps/web-sandbox/package.json

변경 불필요. workspace dependency `@wonik/web`이 이미 잡혀있어 Checkbox/Switch/Radio 자동 import.

## Acceptance Criteria

```bash
cd C:/Users/ohjih/design_system

pnpm -F @wonik/web build
pnpm -F web-sandbox build         # production 빌드 성공
test -d apps/web-sandbox/dist

# dev server 기동 — 5174/5175 응답
pnpm -F web-sandbox dev &
DEV_PID=$!
sleep 8
(curl -sf http://localhost:5174 > /tmp/sandbox.html 2>/dev/null) || (curl -sf http://localhost:5175 > /tmp/sandbox.html)
grep -q "WONIK Web Sandbox" /tmp/sandbox.html
kill $DEV_PID 2>/dev/null || true

# 새 섹션 함수 4개
grep -q "CheckboxMatrixSection" apps/web-sandbox/src/App.tsx
grep -q "SwitchMatrixSection" apps/web-sandbox/src/App.tsx
grep -q "RadioMatrixSection" apps/web-sandbox/src/App.tsx
grep -q "BooleanFormSection" apps/web-sandbox/src/App.tsx

# 새 atom import
grep -E "import \{[^}]*Checkbox[^}]*\}.*from '@wonik/web'" apps/web-sandbox/src/App.tsx
grep -E "import \{[^}]*Switch[^}]*\}.*from '@wonik/web'" apps/web-sandbox/src/App.tsx
grep -E "import \{[^}]*Radio[^}]*\}.*from '@wonik/web'" apps/web-sandbox/src/App.tsx

# 기존 섹션 회귀 0
grep -q "ButtonSection" apps/web-sandbox/src/App.tsx
grep -q "BoxSection" apps/web-sandbox/src/App.tsx
grep -q "StackSection" apps/web-sandbox/src/App.tsx
grep -q "TextSection" apps/web-sandbox/src/App.tsx
grep -q "InputMatrixSection" apps/web-sandbox/src/App.tsx
grep -q "TextareaMatrixSection" apps/web-sandbox/src/App.tsx
grep -q "FormExampleSection" apps/web-sandbox/src/App.tsx
grep -q "BeforeAfterSection" apps/web-sandbox/src/App.tsx
grep -q "ThemeToggle" apps/web-sandbox/src/App.tsx
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 자동 검증 통과 → status를 `completed`로 마크. 시각 검증은 디자이너 자율.
3. 결과에 따라 `phases/05-form-atoms-2/index.json`의 step 3을 업데이트:
   - 성공 → `"status": "completed"`, `"summary": "apps/web-sandbox에 Checkbox·Switch·Radio 매트릭스 + 알림 설정 폼 데모 추가. atom 9종(Button/Box/Stack/Text/Input/Textarea/Checkbox/Switch/Radio)이 light·dark 양 테마에서 작동. form layer atom 완성. Phase 05 종료 — 다음 phase는 display atoms 또는 composition."`
   - 실패 → `"status": "error"`, `"error_message": "구체 사유"`

## 금지사항

- **새 컴포넌트 패키지 만들지 마라**.
- **새 파일 생성 금지** — App.tsx 안에서.
- **`packages/web` 코드 수정 금지** — Checkbox/Switch/Radio는 이미 완성. sandbox만 확장.
- **추가 라이브러리 도입 금지.**
- **CSS-in-JS 라이브러리 도입 금지.**
- **AI 슬롭 anti-pattern 금지.**
- **ppt 코드 수정 금지.**
- **기존 섹션·ThemeToggle 망가뜨리지 마라.**
- **BEFORE 사이드의 raw `<div style>` (BeforeAfterSection 안)을 Stack·Box로 바꾸지 마라.**
- **RadioGroup composition 컴포넌트 만들지 마라** — 후속 phase의 일.
