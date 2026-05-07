# Step 3: sandbox-theme-toggle

## 읽어야 할 파일

- `/CLAUDE.md` (CRITICAL — 1단계 web만, AI 슬롭 anti-pattern, sandbox 시각 검증)
- `/docs/ADR.md` 특히 ADR-009 (다크 모드 1단계 핵심)
- 이전 step 산출물:
  - `/packages/tokens/dist/tokens.css` (light + dark 두 블록)
  - `/packages/web/src/ThemeProvider/ThemeProvider.tsx`, `useTheme.ts`
  - `/packages/web/src/index.ts` (ThemeProvider/useTheme export 확인)
  - `/apps/web-sandbox/src/App.tsx` (8개 섹션 — Button / Box / Stack / Text / InputMatrix / TextareaMatrix / FormExample / BeforeAfter)
  - `/apps/web-sandbox/src/main.tsx` (React 진입점 — ThemeProvider wrap 위치)
  - `/apps/web-sandbox/src/index.css` (토큰 CSS import 위치)

## 작업

`apps/web-sandbox`를 확장해 **테마 토글 UI**를 추가한다. 사용자가 sandbox 페이지 우상단(또는 header)에 있는 토글 버튼을 누르면 모든 atom이 light → dark로 전환되는 것을 시각 확인할 수 있게 한다. 이번 step의 진짜 목적은 **"step 0/1/2가 합쳐져 실제로 작동한다"** + **"6개 기존 atom이 다크 모드에서 어떻게 보이는지 디자이너가 직접 본다"**.

### 핵심 설계 결정

1. **`main.tsx`에서 `<App>`을 `<ThemeProvider>`로 감싼다**: scope="html" 기본값 사용, `persist={true}`로 새로고침해도 마지막 선택 유지.
2. **App.tsx 헤더에 토글 버튼 추가**: `useTheme()` hook으로 현재 테마와 toggleTheme 가져옴. Button(secondary variant)으로 구현 (자기 dogfood).
3. **기존 8개 섹션은 그대로 보존** — 회귀 0. 토글 버튼만 헤더에 추가.
4. **새 컴포넌트·새 파일 생성 금지** — main.tsx와 App.tsx만 수정.
5. **새 dependency 추가 금지.**
6. **localStorage key는 default('wonik-theme')** — sandbox 환경 자동 기억.
7. **테마 명시 라벨은 단순 텍스트**: "🌙 dark" / "☀️ light" 같은 emoji 사용 — 단 emoji 1개만, AI 슬롭으로 가지 않도록 절제. 또는 "light" / "dark" 텍스트만.
8. **dark 테마에서 시각 검증할 항목**: 6 atom 모두 dark에서 가독성·시각 충돌 없는지. 디자이너 시각 검증은 사용자 자율.

### 1. 디렉토리 변경

`apps/web-sandbox/src/main.tsx` + `App.tsx` 두 파일만 수정. 새 파일 생성 금지.

### 2. `main.tsx` 수정 — ThemeProvider wrap

기존 진입점이 `<App />`을 React.StrictMode 안에서 렌더하는 형태라면, ThemeProvider를 추가:

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@wonik/web';
import { App } from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" persist>
      <App />
    </ThemeProvider>
  </StrictMode>
);
```

`scope`는 default ('html') 사용.

### 3. `App.tsx` — 헤더에 토글 추가

기존 헤더 부분을 다음과 같이 수정:

```tsx
import { Button, Box, Stack, Text, Input, Textarea, useTheme } from '@wonik/web';

// ... (기존 ButtonSection / BoxSection / StackSection / TextSection / InputMatrixSection /
//      TextareaMatrixSection / FormExampleSection / BeforeAfterSection 그대로) ...

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
      {/* 헤더 — 우측에 토글 */}
      <Stack as="header" direction="row" justify="between" align="start" gap={5}>
        <Stack direction="column" gap={3} style={{ flex: 1 }}>
          <Text variant="titleSm" weight="medium" as="h1">WONIK Web Sandbox</Text>
          <Text color="secondary">
            6 atoms (Button / Box / Stack / Text / Input / Textarea) + form 합성 + light/dark 테마.
          </Text>
        </Stack>
        <ThemeToggle />
      </Stack>

      {/* 기존 8개 섹션 그대로 */}
      <ButtonSection />
      <BoxSection />
      <StackSection />
      <TextSection />
      <InputMatrixSection />
      <TextareaMatrixSection />
      <FormExampleSection />
      <BeforeAfterSection />
    </Stack>
  );
}
```

**작성 원칙:**
- 새 섹션 추가 안 함 — 헤더만 변경.
- ThemeToggle은 App.tsx 안의 작은 함수로 inline (별도 파일 X).
- 자기 dogfood — 토글 버튼은 Stack + Button + Text(via Button children)로.
- 새 hex/px·이미지 import 0.
- AI 슬롭 anti-pattern 0.

### 4. (검증용 sanity check) — html 속성 확인

dev server 기동 후 토글 버튼 클릭 시 `document.documentElement.dataset.theme`가 'light'/'dark'로 토글되어야 한다. devtools에서 직접 확인 가능. 자동 검증은 sandbox build 통과 + 컴포넌트 import 정상 + dev server 응답으로 충분.

## Acceptance Criteria

```bash
cd C:/Users/ohjih/design_system

# build sanity
pnpm -F @wonik/tokens build       # tokens.css 그대로 (변경 없음)
pnpm -F @wonik/web build          # 빌드 성공
pnpm -F web-sandbox build         # production 빌드 성공
test -d apps/web-sandbox/dist

# dev server 기동
pnpm -F web-sandbox dev &
DEV_PID=$!
sleep 8
(curl -sf http://localhost:5174 > /tmp/sandbox.html 2>/dev/null) || (curl -sf http://localhost:5175 > /tmp/sandbox.html)
grep -q "WONIK Web Sandbox" /tmp/sandbox.html
kill $DEV_PID 2>/dev/null || true

# main.tsx에 ThemeProvider import + wrap
grep -q "from '@wonik/web'" apps/web-sandbox/src/main.tsx
grep -q "ThemeProvider" apps/web-sandbox/src/main.tsx

# App.tsx에 useTheme + ThemeToggle 추가
grep -q "useTheme" apps/web-sandbox/src/App.tsx
grep -q "ThemeToggle" apps/web-sandbox/src/App.tsx

# 기존 8개 섹션 회귀 0 — 모두 살아있어야
grep -q "ButtonSection" apps/web-sandbox/src/App.tsx
grep -q "BoxSection" apps/web-sandbox/src/App.tsx
grep -q "StackSection" apps/web-sandbox/src/App.tsx
grep -q "TextSection" apps/web-sandbox/src/App.tsx
grep -q "InputMatrixSection" apps/web-sandbox/src/App.tsx
grep -q "TextareaMatrixSection" apps/web-sandbox/src/App.tsx
grep -q "FormExampleSection" apps/web-sandbox/src/App.tsx
grep -q "BeforeAfterSection" apps/web-sandbox/src/App.tsx
```

위 명령이 모두 통과해야 한다.

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 자동 검증 통과 → status를 `completed`로 마크. (시각 검증은 디자이너 자율 — phase 02 step 3과 동일 패턴)
3. 결과에 따라 `phases/04-theme-tokens/index.json`의 step 3을 업데이트:
   - 성공 → `"status": "completed"`, `"summary": "apps/web-sandbox 헤더에 light/dark 테마 토글 추가. main.tsx에서 ThemeProvider wrap, App.tsx에서 useTheme 활용. localStorage persist로 새로고침 후에도 마지막 선택 유지. 6 atom × 2 theme 시각 검증 가능. Phase 04 종료 — 이후 모든 phase의 atom·composition은 자동 dark 대응."`
   - 실패 → `"status": "error"`, `"error_message": "구체 사유"`

## 금지사항

- **새 컴포넌트 패키지 만들지 마라** (`packages/{tokens,web}` 외 금지, ADR-001).
- **새 파일 생성 금지** — main.tsx와 App.tsx만 수정.
- **`packages/web` 코드 수정 금지** — ThemeProvider는 step 2에서 완성. sandbox만 확장.
- **추가 라이브러리 도입 금지** (`next-themes` 류).
- **CSS-in-JS 라이브러리 도입 금지.**
- **AI 슬롭 anti-pattern 금지** (gradient·glass·glow·rounded-2xl).
- **emoji 남발 금지** — 토글 라벨 1개씩만 (🌙 / ☀️ 또는 텍스트만). 그 외 섹션에 emoji 추가 금지.
- **ppt 프로젝트 코드 수정 금지** — ppt dogfood는 Phase 04 외.
- **기존 8개 섹션을 망가뜨리지 마라** — 모두 보존.
- **BEFORE 사이드의 raw `<div style>` (BeforeAfterSection 안)를 Stack·Box로 바꾸지 마라.**
- **시스템 prefers-color-scheme 자동 감지 도입 금지** — 명시적 토글만.
