# Step 2: web-button

## 읽어야 할 파일

먼저 아래 파일들을 읽고 1단계 우선순위와 컴포넌트 작성 규칙을 파악하라:

- `/CLAUDE.md` (특히 CRITICAL 규칙 — web 우선 + 토큰 하드코딩 금지 + stateless 우선)
- `/docs/UI_GUIDE.md` (Button 스타일 후보, AI 슬롭 anti-pattern)
- `/docs/ADR.md` (ADR-002 stack, ADR-007 brand color)
- 이전 step 산출물:
  - `/packages/tokens/dist/index.{js,mjs,d.ts}` (TS 토큰 import)
  - `/packages/tokens/dist/tokens.css` (CSS 변수)
  - `/packages/web/package.json` (placeholder)
  - `/tsconfig.base.json`

이전 step에서 만들어진 `@wonik/tokens`의 export 구조를 꼼꼼히 읽고 작업하라.

## 작업

`@wonik/web`에 **첫 번째 컴포넌트인 Button**을 추가한다. **TDD** — Button.test.tsx를 먼저 작성하고, 그 테스트를 통과시키는 Button.tsx를 그 다음 구현한다.

이 step의 목적은 "Button 하나가 토큰 위에서 정상 작동한다"를 가장 작은 단위로 증명하는 것. 추가 컴포넌트는 후속 task의 일.

### 1. 디렉토리 구조

```
packages/web/
├── src/
│   ├── Button/
│   │   ├── Button.tsx              # 컴포넌트 구현
│   │   ├── Button.test.tsx         # 테스트 (먼저 작성)
│   │   ├── types.ts                # ButtonProps, ButtonVariant, ButtonSize
│   │   └── index.ts                # export
│   └── index.ts                    # 패키지 public API (Button + 타입 re-export)
├── package.json                    # placeholder → 실제
├── tsconfig.json                   # extends "../../tsconfig.base.json"
├── tsup.config.ts                  # 빌드 설정
├── vitest.config.ts                # 테스트 설정
└── vitest.setup.ts                 # @testing-library/jest-dom 등록
```

### 2. `types.ts` 시그니처

```typescript
import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'text' | 'outline' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  // disabled, onClick, type 등은 ButtonHTMLAttributes로 자동 포함
}
```

`ButtonHTMLAttributes`를 extend해서 `disabled`/`onClick`/`type`/`aria-*` 같은 native button prop 모두 자동 통과. 추가 prop은 variant + size만.

### 3. `Button.test.tsx` (TDD — 먼저 작성)

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders the label text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('does not call onClick when disabled', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick} disabled>Click</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('applies WONIK BLUE (#273E82) as primary variant background', () => {
    render(<Button variant="primary">Primary</Button>);
    const btn = screen.getByRole('button');
    // 토큰을 통해서 적용되므로 결과적으로 #273E82가 보여야 함
    expect(btn).toHaveStyle({ background: '#273E82' });
  });

  it('text variant has no background', () => {
    render(<Button variant="text">Text</Button>);
    const btn = screen.getByRole('button');
    // text variant는 배경 없음 (transparent)
    const bg = window.getComputedStyle(btn).background;
    expect(bg === '' || bg.includes('transparent') || bg.includes('rgba(0, 0, 0, 0)')).toBe(true);
  });

  it('outline variant has border', () => {
    render(<Button variant="outline">Outline</Button>);
    const btn = screen.getByRole('button');
    const styles = window.getComputedStyle(btn);
    expect(styles.borderStyle).toBe('solid');
  });

  it('danger variant uses red color', () => {
    render(<Button variant="danger">Delete</Button>);
    const btn = screen.getByRole('button');
    // statusTokens.alarm.text === '#CC0000'
    const styles = window.getComputedStyle(btn);
    // background or color에 빨강 계열이 들어가야 함 — danger는 배경 빨강 + 흰 글씨
    expect(btn).toHaveStyle({ background: '#CC0000' });
  });

  it('size sm renders smaller height than md', () => {
    const { rerender } = render(<Button size="sm">A</Button>);
    const sm = window.getComputedStyle(screen.getByRole('button')).padding;
    rerender(<Button size="md">A</Button>);
    const md = window.getComputedStyle(screen.getByRole('button')).padding;
    expect(sm).not.toBe(md);
  });

  it('forwards native button attributes (type, aria-*)', () => {
    render(<Button type="submit" aria-label="submit form">Submit</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('type', 'submit');
    expect(btn).toHaveAttribute('aria-label', 'submit form');
  });

  it('has no hardcoded hex in the rendered output (uses tokens)', () => {
    // 단순 smoke test: 컴포넌트가 토큰을 정상 import해서 렌더링 됨
    render(<Button variant="primary">x</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
```

테스트 원칙:
- behavior + brand-critical 색상 검증.
- snapshot 금지.
- 100% coverage 목표 아님 — 핵심 prop signature와 brand color만.

### 4. `Button.tsx` 구현 (테스트 통과시키는 minimal 구현)

다음 시그니처 기반:

```tsx
import type { CSSProperties } from 'react';
import { primary, surfaces, text, statusTokens, space, radius, fontSize, fontWeight, fontFamily, borders } from '@wonik/tokens';
import type { ButtonProps, ButtonVariant, ButtonSize } from './types';

const variantStyles: Record<ButtonVariant, CSSProperties> = {
  primary: {
    background: primary.base,            // '#273E82'
    color:      surfaces.surfaceWhite,   // '#FFFFFF'
    border:     'none',
  },
  secondary: {
    background: surfaces.surface,
    color:      text.primary,
    border:     `1px solid ${borders.mid}`,
  },
  text: {
    background: 'transparent',
    color:      text.primary,
    border:     'none',
  },
  outline: {
    background: 'transparent',
    color:      primary.base,
    border:     `1px solid ${primary.base}`,
  },
  danger: {
    background: statusTokens.alarm.text, // '#CC0000'
    color:      surfaces.surfaceWhite,
    border:     'none',
  },
};

const sizeStyles: Record<ButtonSize, CSSProperties> = {
  sm: { padding: `${space[1]} ${space[3]}`, fontSize: fontSize.labelSm, height: '24px' }, // 4 8 / 10px / 24
  md: { padding: `${space[3]} ${space[5]}`, fontSize: fontSize.label,   height: '32px' }, // 8 12 / 12px / 32
  lg: { padding: `${space[3]} ${space[6]}`, fontSize: fontSize.titleSm, height: '40px' }, // 8 16 / 14px / 40
};

const baseStyle: CSSProperties = {
  fontFamily:     fontFamily.base,
  fontWeight:     fontWeight.regular,
  borderRadius:   radius.sm,
  cursor:         'pointer',
  display:        'inline-flex',
  alignItems:     'center',
  justifyContent: 'center',
  lineHeight:     1,
  transition:     'opacity 0.15s ease',
};

const disabledStyle: CSSProperties = {
  opacity: 0.5,
  cursor:  'not-allowed',
};

export function Button({
  variant = 'primary',
  size = 'md',
  disabled,
  style,
  children,
  ...rest
}: ButtonProps) {
  const composed: CSSProperties = {
    ...baseStyle,
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...(disabled ? disabledStyle : {}),
    ...style, // consumer 외부 override
  };

  return (
    <button {...rest} disabled={disabled} style={composed}>
      {children}
    </button>
  );
}
```

**중요한 작성 원칙:**
- 모든 색·spacing·font 값은 `@wonik/tokens`에서 import. **hex/px 리터럴은 단 하나도 작성하지 않는다** (예외: `'24px'`/`'32px'`/`'40px'` 같은 컴포넌트 size constraint는 inline 허용 — 단 토큰화할 가치가 있는지 검토).
- inline style로 작성 (`styled-components`/`emotion`/`vanilla-extract` 등 CSS-in-JS 라이브러리 도입 금지).
- consumer가 `className` 또는 `style` prop으로 override 가능하도록 `...rest`/`...style` spread.
- React 외 다른 의존성 0. (`@wonik/tokens`만 dependency, react/react-dom은 peer.)

### 5. `package.json` 업데이트 (placeholder → 실제)

```json
{
  "name": "@wonik/web",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "main":   "./dist/index.js",
  "module": "./dist/index.mjs",
  "types":  "./dist/index.d.ts",
  "exports": {
    ".": {
      "types":  "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsup",
    "test":  "vitest run",
    "test:watch": "vitest",
    "lint": "echo 'no lint yet'"
  },
  "peerDependencies": {
    "react":     "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  },
  "dependencies": {
    "@wonik/tokens": "workspace:*"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.4.0",
    "@testing-library/react":    "^16.0.0",
    "@types/react":              "^19.0.0",
    "@types/react-dom":          "^19.0.0",
    "@vitejs/plugin-react":      "^4.3.0",
    "jsdom":                     "^25.0.0",
    "react":                     "^19.0.0",
    "react-dom":                 "^19.0.0",
    "tsup":                      "^8.0.0",
    "typescript":                "^5.7.0",
    "vitest":                    "^2.0.0"
  }
}
```

**peerDependencies vs devDependencies 의도** — peer는 `^18 || ^19`로 두 버전 호환 명시 (ADR-008). devDeps는 React 19로 통일해 개발·테스트 환경을 ppt와 일치시킨다 (빌드 시 react/react-dom external이라 산출물에 묶이지 않음).

### 6. `tsup.config.ts`

```typescript
import { defineConfig } from 'tsup';
export default defineConfig({
  entry:   ['src/index.ts'],
  format:  ['esm', 'cjs'],
  dts:     true,
  clean:   true,
  external: ['react', 'react-dom'],
});
```

### 7. `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
});
```

### 8. `vitest.setup.ts`

```typescript
import '@testing-library/jest-dom';
```

### 9. `src/index.ts`

```typescript
export { Button } from './Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button/types';
```

## Acceptance Criteria

```bash
cd C:/Users/ohjih/design_system
pnpm install
pnpm -F @wonik/web test          # 모든 테스트 통과
pnpm -F @wonik/web build         # 빌드 성공

# 빌드 산출물 검증
test -f packages/web/dist/index.js
test -f packages/web/dist/index.mjs
test -f packages/web/dist/index.d.ts

# Brand color 검증 — 테스트가 #273E82를 검증하고 있는가?
grep -q "273E82" packages/web/src/Button/Button.test.tsx

# 하드코딩 hex 검증 — Button.tsx 안에 단순 hex 리터럴이 없는가?
# (토큰을 통해서만 사용. 하드코딩된 'transparent', '#FFFFFF' 같은 단순 값은 예외)
! grep -E "['\"]#[0-9A-Fa-f]{6}['\"]" packages/web/src/Button/Button.tsx
```

위 명령이 모두 통과해야 한다.

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 체크리스트:
   - `/CLAUDE.md` CRITICAL: TDD 정신 — Button.test.tsx가 Button.tsx 전에 작성됐나? (커밋 history로 확인 불가하면 implementation 시 적어도 test가 모두 작성된 후 구현)
   - `/CLAUDE.md` CRITICAL: 토큰 하드코딩 금지 — Button.tsx 안에 hex/px 리터럴이 없나?
   - `/CLAUDE.md` CRITICAL: stateless — Button 자체가 글로벌 state 의존 없나?
   - `/docs/ADR.md` ADR-007: WONIK BLUE `#273E82` 적용?
   - `/docs/UI_GUIDE.md` AI 슬롭 anti-pattern: gradient text·box-shadow glow·rounded-2xl 일률 적용 등이 없나?
3. 결과에 따라 `phases/01-foundation/index.json`의 step 2를 업데이트:
   - 성공 → `"status": "completed"`, `"summary": "@wonik/web Button 컴포넌트 추가. 5 variants × 3 sizes. TDD로 작성, WONIK BLUE 적용, 토큰 import. dist 산출 + 테스트 통과. 다음 step에서 apps/web-sandbox로 시각 검증."`
   - 실패 → `"status": "error"`, `"error_message": "구체 사유"`
   - 사용자 개입 → `"status": "blocked"`, `"blocked_reason": "구체 사유"`

## 금지사항

- **hex/px 리터럴 사용 금지 (토큰 import만).** 이유: CLAUDE.md CRITICAL 규칙. 단순 hex(`'#FFFFFF'`) 등이 보이면 토큰화 대상.
- **Snapshot test 작성 금지.** 이유: 시각 변화에 부서지기 쉬움. behavior + 브랜드 색 검증으로 한정.
- **CSS-in-JS 라이브러리(styled-components/emotion/stitches/vanilla-extract) 도입 금지.** 이유: 추가 의존성 + 빌드 복잡도. 1단계는 inline style + 토큰 import로 충분.
- **Radix UI/React Aria/Headless UI 같은 unstyled primitive 라이브러리 도입 금지.** 이유: 1단계는 native `<button>` element만으로 충분. accessibility는 native button + ARIA pass-through로 보장. 추후 Modal/Dropdown 같은 복잡한 컴포넌트 도달하면 그때 도입 검토.
- **React 19-only API 사용 금지** (`useFormStatus`/`useOptimistic`/`use()`/React Compiler 자동 메모 등). 이유: peer는 `^18 || ^19` dual (ADR-008). 18에서도 작동해야 한다. `useState`/`useEffect`/`useRef`/`useMemo`/`useCallback` 등 공통 API만 사용.
- **Tailwind CSS class를 Button.tsx 안에서 사용 금지.** 이유: consumer의 Tailwind 설정에 의존하면 안 됨. 1단계는 inline style + 토큰만 — consumer가 Tailwind 안 써도 작동해야 한다.
- **`packages/{tokens, web}` 외 다른 패키지 폴더 만들지 마라.** 이유: 1단계는 tokens + web만 (ADR-001).
- **WONIK IPS — WARP Design System/ 폴더 안의 .jsx 파일을 import하지 마라.** 이유: 시안이고 production 자산 아님 (ADR-004).
- **ppt 프로젝트 코드를 수정하지 마라.** 이유: ppt 본격 적용은 task 03-ppt-integration. 이번 step은 design_system 안에서만 작업.
- **기존 docs/CLAUDE.md/scripts/execute.py 수정 금지.**
- **기존 테스트를 깨뜨리지 마라.**
