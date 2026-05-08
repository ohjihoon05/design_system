# Step 2: sandbox-display-atoms

## 읽어야 할 파일

- `/CLAUDE.md` (CRITICAL — 1단계 web만, AI 슬롭 anti-pattern, sandbox 시각 검증)
- `/docs/UI_GUIDE.md`
- 이전 step 산출물:
  - `/packages/web/src/Spinner/Spinner.tsx`
  - `/packages/web/src/Skeleton/Skeleton.tsx`
  - `/packages/web/src/index.ts` (Spinner/Skeleton export 확인)
- 기존 sandbox:
  - `/apps/web-sandbox/src/App.tsx` (현재 11개 섹션 + ThemeToggle)

## 작업

`apps/web-sandbox/src/App.tsx`를 확장해 **Spinner / Skeleton**의 시각 매트릭스 + ppt 시나리오 데모(AI 생성 중 + 슬라이드 placeholder)를 추가한다. 기존 모든 섹션은 그대로 보존, 그 사이에 새 섹션 3개를 끼워 넣는다.

이 step의 목적은 **"Spinner·Skeleton이 light/dark 둘 다에서 정확히 동작 + ppt 시나리오에서 atom 11개로 한 화면 흐름이 짜진다"**.

### 핵심 설계 결정

1. **새 섹션 3개**:
   - `SpinnerMatrixSection` — size(sm/md/lg) × color override 데모(default primary / inherit / 커스텀 토큰 색)
   - `SkeletonMatrixSection` — variant(text/rect/circle) 매트릭스 + width/height override 케이스
   - `LoadingScenarioSection` — ppt 시나리오 시뮬레이션. "AI가 슬라이드를 생성 중..." 패널: Stack으로 좌측 Spinner + 우측 Text (label + helperText), 그 아래 Skeleton 3종(text 라인 2개 + rect 슬라이드 썸네일 영역) 조합.
2. **헤더 카운트 갱신** — `9 atoms` → `11 atoms`, 새 atom 이름 추가.
3. **기존 섹션 보존** — 회귀 0.
4. **새 컴포넌트·새 파일 생성 금지** — App.tsx 안에 함수로.
5. **자기 dogfood** — 모든 새 섹션은 Stack + Box + Text로 구성.
6. **시각 검증은 사용자 자율** (phase 02·04·05 step3 동일 패턴) — 자동 검증 통과 시 status를 `completed`로.

### 1. App.tsx 확장 — import + 헤더 + 섹션 3개

기존 import에 Spinner/Skeleton 추가:

```tsx
import {
  Button, Box, Stack, Text, Input, Textarea,
  Checkbox, Switch, Radio,
  Spinner, Skeleton,
  useTheme,
} from '@wonik/web';
import type {
  ButtonVariant, ButtonSize,
  TextVariant, TextWeight,
  InputSize,
  CheckboxSize, SwitchSize, RadioSize,
  SpinnerSize, SkeletonVariant,
} from '@wonik/web';
import { useState } from 'react';
```

헤더 텍스트 갱신 — 기존 `9 atoms (Button / Box / ... / Radio)` 부분을 `11 atoms (Button / Box / Stack / Text / Input / Textarea / Checkbox / Switch / Radio / Spinner / Skeleton)`로 교체.

App() return 안에 새 섹션 추가 — 기존 `<BooleanFormSection />` 다음, `<BeforeAfterSection />` 직전:

```tsx
{/* phase 06 — display atoms */}
<SpinnerMatrixSection />
<SkeletonMatrixSection />
<LoadingScenarioSection />
```

### 2. 각 새 섹션 구현

기존 `CheckboxMatrixSection` 등의 패턴(Stack + Box + Text + 시각 매트릭스)을 그대로 따른다. App.tsx 하단의 다른 섹션 함수들 옆에 추가.

#### 2-1. `SpinnerMatrixSection`

```tsx
const spinnerSizes: SpinnerSize[] = ['sm', 'md', 'lg'];

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
              <Text variant="caption" color="secondary">{size}</Text>
            </Stack>
          ))}
        </Stack>
      </Stack>

      <Stack direction="column" gap={3}>
        <Text variant="label" color="secondary" as="h3">color override (style.color로 외부 제어)</Text>
        <Stack direction="row" align="center" gap={6}>
          <Stack direction="column" align="center" gap={2}>
            <Spinner size="md" />
            <Text variant="caption" color="secondary">default (primary)</Text>
          </Stack>
          <Stack direction="column" align="center" gap={2}>
            <Spinner size="md" style={{ borderTopColor: 'var(--color-status-alarm-text)' }} />
            <Text variant="caption" color="secondary">alarm</Text>
          </Stack>
          <Stack direction="column" align="center" gap={2}>
            <Spinner size="md" style={{ borderTopColor: 'var(--color-text-secondary)' }} />
            <Text variant="caption" color="secondary">muted</Text>
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
```

#### 2-2. `SkeletonMatrixSection`

```tsx
const skeletonVariants: SkeletonVariant[] = ['text', 'rect', 'circle'];

function SkeletonMatrixSection() {
  return (
    <Stack direction="column" gap={5}>
      <Text variant="titleSm" weight="medium" as="h2">Skeleton</Text>

      <Stack direction="column" gap={3}>
        <Text variant="label" color="secondary" as="h3">variant</Text>

        <Stack direction="column" gap={2} style={{ width: 320 }}>
          <Text variant="caption" color="secondary">text (default — 1em high, 100% wide)</Text>
          <Skeleton variant="text" />
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="60%" />
        </Stack>

        <Stack direction="row" gap={5} align="start">
          <Stack direction="column" gap={2}>
            <Text variant="caption" color="secondary">rect (200×120)</Text>
            <Skeleton variant="rect" width={200} height={120} />
          </Stack>

          <Stack direction="column" gap={2}>
            <Text variant="caption" color="secondary">circle (40×40 — 아바타)</Text>
            <Skeleton variant="circle" width={40} height={40} />
          </Stack>

          <Stack direction="column" gap={2}>
            <Text variant="caption" color="secondary">circle (64×64 — 큰 아바타)</Text>
            <Skeleton variant="circle" width={64} height={64} />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
```

#### 2-3. `LoadingScenarioSection` — ppt 시나리오 시뮬레이션

ppt가 슬라이드를 AI로 생성 중인 상태 화면을 atom 11개로 그려본다. 1단계 dogfood가 어디까지 가능한지 직관 확인.

```tsx
function LoadingScenarioSection() {
  return (
    <Stack direction="column" gap={5}>
      <Text variant="titleSm" weight="medium" as="h2">시나리오 — AI 슬라이드 생성 중</Text>
      <Text variant="caption" color="secondary">
        ppt(첫 dogfood) 시나리오 시뮬레이션. atom 11개만으로 한 화면 흐름이 짜진다.
      </Text>

      <Box
        as="section"
        surface="white"
        border="thin"
        radius="md"
        p={6}
        style={{ width: 480 }}
      >
        <Stack direction="column" gap={5}>
          {/* 헤더: spinner + 진행 텍스트 */}
          <Stack direction="row" align="center" gap={3}>
            <Spinner size="md" label="AI 생성 중" />
            <Stack direction="column" gap={1} style={{ flex: 1 }}>
              <Text weight="medium">AI가 슬라이드 4 / 12 생성 중…</Text>
              <Text variant="caption" color="secondary">예상 소요 시간 약 30초</Text>
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
```

### 3. 헤더 카운트 갱신

기존 `<Text color="secondary">9 atoms (...)... </Text>` 부분을 다음으로 교체:

```tsx
<Text color="secondary">
  11 atoms (Button / Box / Stack / Text / Input / Textarea / Checkbox / Switch / Radio / Spinner / Skeleton) + form 합성 + light/dark 테마.
</Text>
```

## Acceptance Criteria

```bash
cd C:/Users/ohjih/design_system

# 빌드: web-sandbox가 새 atom들을 import해 dev/build 둘 다 성공
pnpm -F @wonik/web build
pnpm -F web-sandbox build

# App.tsx에 새 섹션 3개가 들어갔다
grep -q "SpinnerMatrixSection" apps/web-sandbox/src/App.tsx
grep -q "SkeletonMatrixSection" apps/web-sandbox/src/App.tsx
grep -q "LoadingScenarioSection" apps/web-sandbox/src/App.tsx

# import에 Spinner / Skeleton 추가됐다
grep -q "Spinner" apps/web-sandbox/src/App.tsx
grep -q "Skeleton" apps/web-sandbox/src/App.tsx

# 헤더에 11 atoms 카운트 반영
grep -q "11 atoms" apps/web-sandbox/src/App.tsx

# AI 슬롭 anti-pattern 0건
! grep -i -E "backdrop-filter|linear-gradient|box-shadow.*glow|rounded-2xl" apps/web-sandbox/src/App.tsx

# 새 atom·섹션 외에 기존 섹션이 그대로 살아있다 (회귀 검증)
grep -q "ButtonSection" apps/web-sandbox/src/App.tsx
grep -q "BoxSection" apps/web-sandbox/src/App.tsx
grep -q "StackSection" apps/web-sandbox/src/App.tsx
grep -q "TextSection" apps/web-sandbox/src/App.tsx
grep -q "InputMatrixSection" apps/web-sandbox/src/App.tsx
grep -q "TextareaMatrixSection" apps/web-sandbox/src/App.tsx
grep -q "FormExampleSection" apps/web-sandbox/src/App.tsx
grep -q "CheckboxMatrixSection" apps/web-sandbox/src/App.tsx
grep -q "SwitchMatrixSection" apps/web-sandbox/src/App.tsx
grep -q "RadioMatrixSection" apps/web-sandbox/src/App.tsx
grep -q "BooleanFormSection" apps/web-sandbox/src/App.tsx
grep -q "BeforeAfterSection" apps/web-sandbox/src/App.tsx

# 기존 web 테스트가 여전히 모두 통과
pnpm -F @wonik/web test --run
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 체크리스트:
   - 새 섹션 3개가 App.tsx에 추가됐고 기존 섹션은 그대로?
   - import 라인에 Spinner / Skeleton + 타입 추가?
   - 헤더 카운트 갱신?
   - AI 슬롭 anti-pattern 0건?
   - web-sandbox build 통과 + web 테스트 회귀 0?
3. 결과에 따라 `phases/06-display-atoms/index.json`의 step 2를 업데이트:
   - 성공 → `"status": "completed"`, `"summary": "apps/web-sandbox에 Spinner·Skeleton 매트릭스 + AI 슬라이드 생성 시나리오 데모 추가. atom 11종이 light·dark 양 테마에서 작동. ppt dogfood 시나리오를 atom만으로 그려보는 첫 실험. Phase 06 종료 — 다음 phase는 display atom 확장(Badge·Card 검토) 또는 ppt 첫 적용."`
   - 실패 → `"status": "error"`, `"error_message": "구체 사유"`

## 금지사항

- **새 컴포넌트·새 파일 생성 금지** — `App.tsx` 한 파일에만 변경.
- **`packages/`에 새 컴포넌트 추가 금지** — sandbox만 수정.
- **AI 슬롭 anti-pattern 금지** (backdrop-filter / gradient / glow / rounded-2xl).
- **기존 섹션 삭제·이름 변경 금지** — 회귀 0.
- **시각 fidelity 자동 assert 금지** (CSS animation 동작 여부 등은 시각 검증 영역).
- **Snapshot test 금지.**
- **새 npm dependency 추가 금지.**
- **기존 docs/CLAUDE.md/scripts/execute.py 수정 금지.**
