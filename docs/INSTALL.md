# `@wonik/web` 설치 가이드

원익IPS 사내 web service에서 `@wonik/tokens` + `@wonik/web`를 설치해 사용하는 방법.

> ⚠️ **현재 상태**: publish-ready 0.1.0이지만 **사내 npm registry는 IT 협의 후 URL 확정 예정** (Phase 17 / ADR-018). 본 문서의 `<사내-registry-URL>`은 결정 후 실제 URL로 갱신됨.

## 1. 인증 (`.npmrc` 설정)

host product repo 루트에 `.npmrc` 파일을 만든다. token은 사내 IT가 발급한 값을 사용 (또는 GitHub Packages 사용 시 PAT).

```ini
# .npmrc — host product root
@wonik:registry=<사내-registry-URL>
//<사내-registry-host>/:_authToken=${WONIK_NPM_TOKEN}
```

- **scope 분리**: `@wonik` scope만 사내 registry로 향함. 다른 scope(@types, @testing-library 등)는 public npm 그대로 사용.
- **token 환경변수화**: `.npmrc`에 token 평문 commit 금지. `${WONIK_NPM_TOKEN}`로 참조, shell/CI에서 주입.
- **`.gitignore`**: `.npmrc`는 host product에서도 commit 금지(이 repo도 동일 정책). `.npmrc.example`만 commit해 형식 공유.

본 repo의 `.npmrc.example`을 host product에 복사해 시작:

```bash
cp design_system/.npmrc.example .npmrc
# 그 다음 토큰 발급 후 환경변수 export
```

## 2. 패키지 설치

```bash
pnpm add @wonik/web @wonik/tokens
# npm: npm install @wonik/web @wonik/tokens
# yarn: yarn add @wonik/web @wonik/tokens
```

> ⚠️ **두 패키지 모두 host에서 직접 install 필수** (ADR-019 peer-only contract). `@wonik/web`만 install해도 `@wonik/tokens`는 자동으로 따라오지 **않습니다** — peer 의존성이라 host가 명시해야 함. 이는 토스 TDS / Material UI / Radix UI 등이 채택한 표준 패턴.

`@wonik/web`는 `@wonik/tokens`를 peer 의존성으로 명시한다(`^0.1.0`). host가 토큰 CSS를 import해 cascade 기본값을 활성화하기 위해서도 host install이 필요.

React 18·19 dual peer 지원. host product의 React 버전 그대로 사용 (별도 dedupe 불필요).

## 3. 기본 import 예제

```tsx
// host product app entry (예: src/main.tsx)
import '@wonik/tokens/tokens.css';      // 1. 토큰 CSS 변수 활성화 (최상위 1회)

import { Button, Card, Alert } from '@wonik/web';

export function Example() {
  return (
    <Card padding="md" variant="elevated">
      <Alert>저장 중 오류가 발생했습니다.</Alert>
      <Button variant="primary" size="md">확인</Button>
    </Card>
  );
}
```

- 토큰 CSS import는 app entry에 *한 번만* — 컴포넌트 import 시점마다 불필요.
- 컴포넌트는 `interfaceColors.*`를 통한 cascade fallback으로 렌더링되므로, host가 별도 theme 설정 없이도 기본값(WONIK BLUE) 적용됨.

## 4. cascade override 예제 (host product 색 덮어쓰기)

host product가 자체 색을 갖고 있다면, `--color-*` CSS 변수를 정의하면 우리 컴포넌트가 자동으로 그 색을 따른다. 1단계 핵심 모델 (ADR-010).

```css
/* host product의 theme.css */
:root {
  --color-bg: #FAFAFA;
  --color-surface: #FFFFFF;
  --color-border: #E5E5E5;
  --color-text: #111111;
  --color-text-muted: #6B7280;
  --color-primary: #1E40AF;   /* 우리 #273E82 대신 host 자체 primary 사용 */
  --color-focus: #3B82F6;     /* WCAG 2.1 SC 2.4.7 outline 색 */
}
```

이 7개 변수가 곧 우리 컴포넌트가 reference하는 **interface variable**. host가 *전부 정의*해도 좋고, *일부만*(예: primary만) 정의해도 좋다. 미정의 변수는 우리 internal default로 자동 fallback (`var(--color-primary, var(--color-primary-internal))`).

다른 토큰(spacing/radius/typography 등)은 host가 override 대상이 아니다 — 우리 시각 형태의 정체성이라 일관성 유지.

자세한 cascade contract는 ADR-010 / ADR-011 참조.

## 5. 자주 묻는 질문

**Q. dark mode는?**
A. light/dark dual 지원 (ADR-009). host가 `<html data-theme="dark">` 또는 그 외 토글 메커니즘으로 전환. 우리는 `prefers-color-scheme`을 *override 하지 않음* — host가 결정.

**Q. 컴포넌트가 더 필요한데?**
A. 1단계는 14 atoms (Button / Box / Stack / Text / Input / Textarea / Checkbox / Switch / Radio / Spinner / Skeleton / Card / Badge / Alert)로 종료. 추가 컴포넌트는 host product의 *실제 needs* 누적 3회 이상 evidence 후 layer A 2차 채움으로 검토. 사내 슬랙 또는 GitHub issue로 요청.

**Q. SSR(Next.js)에서 작동하나?**
A. 모든 module-scope CSS 1회-inject는 `typeof document === 'undefined'` 가드 적용 (ADR-011). hydration mismatch 없음.

**Q. tree-shaking?**
A. `@wonik/web`은 `sideEffects: false` 선언. `@wonik/tokens`는 `sideEffects: ["**/*.css"]`로 CSS만 보존. bundler가 사용 안 한 컴포넌트는 자동 제거.
