# Step 3: web-sandbox-verify

## 읽어야 할 파일

먼저 아래 파일들을 읽고 시각 검증의 목적과 ppt 환경 model을 파악하라:

- `/CLAUDE.md` (특히 "1단계는 ppt 환경을 model로 한 apps/web-sandbox/에서 시각 검증" 규칙)
- `/docs/ARCHITECTURE.md` (apps/web-sandbox/ 디렉토리 구조)
- `/docs/UI_GUIDE.md` (Button 시각 명세 — variant·size별 기대 형태)
- 이전 step 산출물:
  - `/packages/tokens/dist/{index.{js,mjs,d.ts}, tokens.css}` (토큰)
  - `/packages/web/src/Button/Button.tsx` (1단계 첫 컴포넌트)
  - `/packages/web/dist/index.{js,mjs,d.ts}` (빌드 산출물)
- ppt 환경 reference (수정하지 말 것):
  - `C:\Users\ohjih\ppt\frontend\package.json` (stack 확인용)
  - `C:\Users\ohjih\ppt\frontend\vite.config.ts` (설정 확인용)

이전 step에서 만들어진 Button을 sandbox에서 import해 시각 작동을 확인한다.

## 작업

`apps/web-sandbox/`에 minimal Vite app을 만들어 `@wonik/web`의 Button을 시각적으로 렌더링·확인한다. ppt와 stack 동일(React 19 + Vite + TypeScript + Tailwind v4)하게 셋업해 "ppt에 import해도 작동할 것"을 sandbox에서 미리 증명한다. 이 step의 목적은 **시각 검증** + **build·import 작동 검증**이지 production 앱이 아니다.

### 1. 디렉토리 구조

```
apps/web-sandbox/
├── src/
│   ├── App.tsx                 # Button 모든 variant × size 조합 렌더링
│   ├── main.tsx                # React 진입점
│   └── index.css               # Tailwind v4 + @wonik/tokens CSS 변수 import
├── index.html
├── package.json
├── tsconfig.json               # extends "../../tsconfig.base.json"
└── vite.config.ts
```

### 2. `package.json` 시그니처

```json
{
  "name": "web-sandbox",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev":     "vite",
    "build":   "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@wonik/tokens":  "workspace:*",
    "@wonik/web":     "workspace:*",
    "react":          "^19.0.0",
    "react-dom":      "^19.0.0"
  },
  "devDependencies": {
    "@tailwindcss/vite":     "^4.0.0",
    "@types/react":          "^19.0.0",
    "@types/react-dom":      "^19.0.0",
    "@vitejs/plugin-react":  "^4.3.0",
    "tailwindcss":           "^4.0.0",
    "typescript":            "^5.7.0",
    "vite":                  "^6.0.0"
  }
}
```

ppt(`C:\Users\ohjih\ppt\frontend\package.json`)와 동일 stack. 단, `react-router-dom`/`zustand` 같은 ppt 전용 라이브러리는 sandbox에 불필요하므로 제외.

### 3. `vite.config.ts` 시그니처

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 5174 }, // ppt 3000과 충돌 방지
});
```

### 4. `index.html`

```html
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>WONIK Web Sandbox — Button</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### 5. `src/index.css`

```css
@import "tailwindcss";
@import "@wonik/tokens/tokens.css";

body {
  margin: 0;
  padding: 24px;
  font-family: var(--font-family);
  background: var(--color-canvas);
  color: var(--color-text-primary);
}
```

`@wonik/tokens`의 CSS 변수가 root scope에서 사용 가능해진다.

### 6. `src/main.tsx`

```typescript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

### 7. `src/App.tsx` — 모든 Button variant × size 조합 렌더링

```tsx
import { Button } from '@wonik/web';
import type { ButtonVariant, ButtonSize } from '@wonik/web';

const variants: ButtonVariant[] = ['primary', 'secondary', 'text', 'outline', 'danger'];
const sizes: ButtonSize[] = ['sm', 'md', 'lg'];

export function App() {
  return (
    <main style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <header>
        <h1 style={{ fontSize: 24, marginBottom: 8 }}>WONIK Web Sandbox</h1>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', margin: 0 }}>
          Button — 5 variants × 3 sizes. Disabled state 포함.
        </p>
      </header>

      {variants.map((variant) => (
        <section key={variant}>
          <h2 style={{ fontSize: 14, marginBottom: 12, color: 'var(--color-text-secondary)' }}>
            {variant}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {sizes.map((size) => (
              <Button key={size} variant={variant} size={size}>
                {variant}/{size}
              </Button>
            ))}
            <Button variant={variant} disabled>
              disabled
            </Button>
          </div>
        </section>
      ))}

      <section>
        <h2 style={{ fontSize: 14, marginBottom: 12, color: 'var(--color-text-secondary)' }}>
          Click handler check
        </h2>
        <Button onClick={() => alert('clicked!')}>Click me</Button>
      </section>
    </main>
  );
}
```

이 화면이 정상 렌더링되면 — 토큰 import + 컴포넌트 import + Vite 빌드 + Tailwind v4 동거 + React 19 환경 호환을 모두 검증한 셈이다.

### 8. 시각 검증 체크리스트

`pnpm -F web-sandbox dev` 실행해 브라우저(http://localhost:5174)에서 다음 확인하고 결과를 `phases/01-foundation/step3-verification-notes.md`에 기록한다.

체크리스트:
- [ ] **Primary variant**: 짙은 navy(`#273E82`, WONIK BLUE) 배경 + 흰 글자
- [ ] **Secondary variant**: 흰 배경 + 회색 border + 회색 글자
- [ ] **Text variant**: 배경 없음, 회색 글자만
- [ ] **Outline variant**: 흰 배경 + WONIK BLUE border + WONIK BLUE 글자
- [ ] **Danger variant**: 빨강 배경(`#CC0000`) + 흰 글자
- [ ] **Sizes**: sm < md < lg 높이 차이가 시각적으로 분명한가?
- [ ] **Disabled**: opacity 0.5 + cursor `not-allowed` 적용?
- [ ] **Click handler**: 클릭 시 alert 뜨는가?
- [ ] **AI 슬롭 anti-pattern**: gradient text·glass effect·glow shadow 같은 것이 없나?
- [ ] **컴파일 에러**: 콘솔에 에러 없는가?

### 9. `step3-verification-notes.md` 형식

```markdown
# Step 3 verification notes

**검증일**: YYYY-MM-DD
**환경**: React 19 + Vite 6 + TypeScript 5.7 + Tailwind v4

## 시각 체크리스트
- [x] primary: navy 배경 + 흰 글자 OK
- [x] secondary: ...
... (위 체크리스트 그대로)

## 발견 사항
- (있으면 기록 — 예: "outline variant border가 너무 얇아 보임", "lg size가 ppt 대시보드 hero에는 더 커야 할 수도")
- (없으면 "이슈 없음")

## 다음 액션
- (후속 task에서 처리할 개선점)
```

## Acceptance Criteria

```bash
cd C:/Users/ohjih/design_system
pnpm install
pnpm -F web-sandbox build         # 빌드 성공
test -d apps/web-sandbox/dist     # 빌드 산출물 존재

# Sandbox dev server가 시작 가능한가? (백그라운드로 5초 실행 후 확인)
pnpm -F web-sandbox dev &
SANDBOX_PID=$!
sleep 5
curl -s http://localhost:5174 | grep -q "WONIK Web Sandbox"
kill $SANDBOX_PID

# 시각 검증 노트 존재 확인
test -f phases/01-foundation/step3-verification-notes.md
```

위 명령이 모두 통과해야 한다.

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 체크리스트:
   - `/docs/ARCHITECTURE.md` apps/web-sandbox/ 구조와 일치하는가?
   - ppt(`C:\Users\ohjih\ppt\frontend\package.json`)와 stack(React 19/Vite/TS/Tailwind v4) 일치하는가?
   - `@wonik/web`, `@wonik/tokens`이 workspace dependency로 import되는가? (file: protocol이나 npm 발행 없이)
   - `step3-verification-notes.md`에 시각 체크리스트 결과가 기록됐는가?
3. 결과에 따라 `phases/01-foundation/index.json`의 step 3을 업데이트:
   - 성공 → `"status": "completed"`, `"summary": "apps/web-sandbox에서 Button 시각 검증 통과. ppt와 동일 stack(React 19 + Vite + Tailwind v4)에서 작동 확인. 01-foundation phase 완료. 다음 phase: 02-web-components 또는 03-ppt-integration."`
   - 실패 → `"status": "error"`, `"error_message": "구체 사유"`
   - 사용자 개입 → `"status": "blocked"`, `"blocked_reason": "구체 사유"`

## 금지사항

- **ppt 프로젝트 코드를 수정하지 마라.** 이유: ppt 본격 적용은 task 03-ppt-integration에서. 이번 step은 design_system 모노레포 안의 sandbox에서만 작업한다.
- **Sandbox에 로직(API 호출·라우팅·상태 관리 등)을 넣지 마라.** 이유: sandbox는 컴포넌트 시각 확인용이지 실 앱이 아니다. router/zustand/fetch 등 일체 도입 금지.
- **시각 검증을 자동화하려고 puppeteer/playwright/percy 도입 금지.** 이유: 1단계 인프라 부담. 시각 검증은 사용자 수동 확인이 정답.
- **`packages/{tokens, web}` 외 다른 패키지 폴더 만들지 마라.** 이유: 1단계는 tokens + web만 (ADR-001).
- **WONIK IPS — WARP Design System/ 폴더의 .jsx 파일을 import하지 마라.** 이유: 시안이고 production 자산 아님 (ADR-004).
- **Button 컴포넌트를 수정하지 마라.** 이유: 이번 step은 검증만. 컴포넌트 변경은 별도 step의 디자인 결정. 만약 sandbox에서 시각 이슈가 발견되면 verification-notes에 기록하고 후속 task에서 처리.
- **시각 검증 결과를 "성공"으로 자동 기록하지 마라.** 이유: 사용자(디자이너)가 직접 브라우저에서 확인한 결과여야 한다. agent가 dev server만 띄우고 자동 통과 처리하면 검증 의미 없음. 사용자 개입 필요한 step.
- **기존 docs/CLAUDE.md/scripts/execute.py 수정 금지.**
- **기존 테스트를 깨뜨리지 마라.**
