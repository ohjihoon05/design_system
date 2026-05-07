# Step 3: sandbox-form-example

## 읽어야 할 파일

- `/CLAUDE.md` (CRITICAL — 1단계 web만 + sandbox 시각 검증)
- `/docs/UI_GUIDE.md` (AI 슬롭 anti-pattern)
- 이전 step 산출물:
  - `/packages/web/src/Input/Input.tsx`, `/packages/web/src/Textarea/Textarea.tsx`
  - `/packages/web/src/Button/Button.tsx`, `/packages/web/src/Box/Box.tsx`, `/packages/web/src/Stack/Stack.tsx`, `/packages/web/src/Text/Text.tsx`
  - `/apps/web-sandbox/src/App.tsx` (Input/Textarea 매트릭스까지 추가된 상태)

## 작업

`apps/web-sandbox/src/App.tsx`에 **실제 form composition 예시 섹션**을 추가한다. 지금까지 만든 atom 6개(Button/Box/Stack/Text/Input/Textarea)가 어떻게 합쳐져 진짜 폼이 되는지를 한 화면에서 보여준다 — **FormField composition 컴포넌트 없이 Stack·Text(label)·Input·Button만으로** 충분히 노동조합 폼이 만들어진다는 것을 증명. 이 step은 phase 04(혹은 그 후)에서 FormField 추출이 어떤 가치를 가질지 디자이너가 자기 눈으로 판단할 수 있는 baseline을 제공한다.

이 step의 목적은 **"atom layer만으로 실제 사용 가능한 폼 1개를 짠다 + invalid validation 동작 확인"**.

### 핵심 설계 결정

1. **새 섹션 1개 추가**: `FormExampleSection` — App.tsx 마지막에 (BeforeAfter 다음 또는 그 직전).
2. **실제 폼 시나리오**: 원익IPS 도메인 가까운 샘플로 — "장비 등록 폼" (이름 / 모델 / 시리얼 번호 / 메모). 4개 input + 1 textarea + submit/cancel button.
3. **간단한 controlled state**: useState로 form value 보유. submit 시 alert로 데이터 출력. invalid는 simple validation (이름 비어있으면 invalid).
4. **label은 Text(as="label")로 외부에서**: FormField composition을 일부러 안 쓰고, 디자이너가 "labels로 Text·Input을 매번 묶는 게 얼마나 보일러플레이트인지" 직접 본다 → 다음 phase의 FormField 동기 부여.
5. **submit/cancel 버튼**: Stack direction="row" justify="end" gap={3}으로 우측 정렬.
6. **새 파일 생성 금지**: 모두 App.tsx 안.

### 1. App.tsx 확장 — `FormExampleSection`

App 함수의 children 배열에 `<FormExampleSection />`을 추가하고, 다음 함수를 같은 파일 하단에 정의:

```tsx
import { useState } from 'react';
// 다른 import는 step 2에서 이미 추가된 것 — Button, Box, Stack, Text, Input, Textarea

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
        // @ts-expect-error — Box default는 div지만 form으로 polymorphic 사용
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
              <Text variant="labelSm" color="brand" weight="medium" style={{ color: '#CC0000' }}>
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
```

**작성 원칙:**
- 폼 wrapper는 `<Box as="form">`. raw `<form>` element 사용 금지 — Box를 통해 padding·bg·border·rounded 일관 처리.
- label은 `<Text as="label" htmlFor="...">`로 — accessibility(`htmlFor` ↔ `id`).
- error 메시지는 invalid일 때만 노출 + brand red 색.
- new useState 4개 + submitted state 1개. controlled input 패턴 데모.
- @ts-expect-error 한 줄: Box의 polymorphic `as`가 form일 때 `onSubmit` 시그니처 충돌하지만 실제 동작은 OK. 이건 1단계의 단순 polymorphic typing 한계 — full generic polymorphic은 후속 phase 검토 사항.
- AI 슬롭 anti-pattern 0.

### 2. App() 함수에 새 섹션 추가

```tsx
export function App() {
  return (
    <Stack as="main" direction="column" gap={8}>
      <Stack as="header" direction="column" gap={3}>
        <Text variant="titleSm" weight="medium" as="h1">WONIK Web Sandbox</Text>
        <Text color="secondary">
          Button + layout primitives + form atoms + form 합성 예시.
        </Text>
      </Stack>

      <ButtonSection />
      <BoxSection />
      <StackSection />
      <TextSection />
      <InputMatrixSection />
      <TextareaMatrixSection />
      <FormExampleSection />     {/* ← 새 섹션 */}
      <BeforeAfterSection />
    </Stack>
  );
}
```

## Acceptance Criteria

```bash
cd C:/Users/ohjih/design_system

# build
pnpm -F web-sandbox build         # production 빌드 성공
test -d apps/web-sandbox/dist

# dev server 기동
pnpm -F web-sandbox dev &
DEV_PID=$!
sleep 8
(curl -sf http://localhost:5174 > /tmp/sandbox.html 2>/dev/null) || (curl -sf http://localhost:5175 > /tmp/sandbox.html)
grep -q "WONIK Web Sandbox" /tmp/sandbox.html
kill $DEV_PID 2>/dev/null || true

# 새 섹션 함수
grep -q "FormExampleSection" apps/web-sandbox/src/App.tsx

# useState import 됐는지
grep -q "useState" apps/web-sandbox/src/App.tsx

# Box as="form" 패턴 사용 (raw <form> 사용 금지)
grep -E "as=\"form\"|as=\\{?'form'\\}?" apps/web-sandbox/src/App.tsx

# 기존 섹션 회귀 — 모두 살아있어야 한다
grep -q "ButtonSection" apps/web-sandbox/src/App.tsx
grep -q "BoxSection" apps/web-sandbox/src/App.tsx
grep -q "StackSection" apps/web-sandbox/src/App.tsx
grep -q "TextSection" apps/web-sandbox/src/App.tsx
grep -q "InputMatrixSection" apps/web-sandbox/src/App.tsx
grep -q "TextareaMatrixSection" apps/web-sandbox/src/App.tsx
grep -q "BeforeAfterSection" apps/web-sandbox/src/App.tsx
```

위 명령이 모두 통과해야 한다.

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 자동 검증 통과 → status를 `completed`로 마크.
3. 결과에 따라 `phases/03-form-primitives/index.json`의 step 3을 업데이트:
   - 성공 → `"status": "completed"`, `"summary": "apps/web-sandbox에 Form 합성 예시(장비 등록 폼) 추가. atom 6종(Button/Box/Stack/Text/Input/Textarea)만으로 controlled 폼 + invalid validation 동작. label·error 매번 묶는 보일러플레이트가 곧 다음 phase FormField 동기. Phase 03 종료."`
   - 실패 → `"status": "error"`, `"error_message": "구체 사유"`

## 금지사항

- **새 컴포넌트 패키지 만들지 마라** (1단계는 tokens + web만).
- **새 파일 생성 금지** — App.tsx 안에서.
- **FormField·FieldGroup·FormError 같은 composition 컴포넌트 만들지 마라** — 다음 phase의 일.
- **react-hook-form / formik / zod 등 form 라이브러리 도입 금지** — 1단계 form 합성은 React 표준 useState로.
- **`packages/web` 코드 수정 금지** — sandbox만 확장.
- **CSS-in-JS·additional library 도입 금지.**
- **AI 슬롭 anti-pattern 금지** (gradient/glass/glow shadow).
- **ppt 코드 수정 금지.**
- **기존 섹션을 망가뜨리지 마라** — 모두 보존.
- **BEFORE 사이드의 raw `<div style>` (BeforeAfterSection 안)를 Stack·Box로 바꾸지 마라.**
