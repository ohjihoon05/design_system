# QUICKSTART — host product에 디자인 시스템 적용하기

본인의 host product(ppt 등)에서 `@wonik/web` + `@wonik/tokens`를 *매일 어떻게 쓰는지* step-by-step 플레이북.

> **외부 install 가이드는 `docs/INSTALL.md`.** 본 문서는 *내가 직접 host에서 작업할 때* 따라하는 액션 가이드.
>
> 한 줄 정신: **재료 창고는 만들었으니, host에서 `import` 한 줄이 사용의 거의 전부.**

---

## 1. 시작 전 점검 (10초)

ppt 측에 디자인 시스템이 이미 연결돼있는지:

```powershell
ls C:\Users\ohjih\ppt\frontend\node_modules\@wonik
```

→ `tokens`, `web` 두 폴더가 보이면 OK.
→ 안 보이면 ppt에서 `pnpm install` 한 번. 환경 시나리오별:
  - **vendor tarball** (Trial 7 이후 — 사내 registry 결정 전 기본): `package.json`이 `file:vendor/wonik-{tokens,web}-X.Y.Z.tgz`를 가리킴. 두 패키지 다 dependency로 명시 필요(ADR-019 peer-only contract).
  - **published 버전** (사내 registry 결정 후 — Phase 18~): `package.json`에 `@wonik/web: ^0.1.0` 형태. `.npmrc`에 사내 registry URL 설정 필수 (`docs/INSTALL.md`).
  - **monorepo workspace** (sandbox만): `workspace:*` — design_system repo 안의 `apps/web-sandbox`처럼.

토큰 CSS가 app entry에 1회 import돼있는지:

```tsx
// ppt/frontend/src/main.tsx (또는 entry 파일)
import '@wonik/tokens/tokens.css';
```

→ 없으면 한 줄 추가. **앱 전체에서 한 번이면 됨.**

---

## 2. 매번 따라할 5단계 (★ 본 가이드의 핵심)

### Step 1 — 새 페이지 파일 만들기

```
ppt/frontend/src/pages/MyNewPage.tsx
```

### Step 2 — 파일 최상단 import

```tsx
import { Button, Card, Alert, Badge, Stack, Text, Input } from '@wonik/web';
```

→ 필요한 것만 골라서 import. 안 쓰는 건 빼도 됨 (tree-shaking으로 번들에 안 들어감).

### Step 3 — JSX에서 사용

```tsx
export function MyNewPage() {
  return (
    <Stack gap={6} padding={6}>
      <Text variant="titleLg" weight="bold">새 페이지</Text>

      <Card variant="elevated" padding="md">
        <Stack gap={4}>
          <Text>설명 텍스트.</Text>
          <Input placeholder="이름을 입력하세요" />
          <Stack direction="row" gap={3} justify="end">
            <Button variant="outline">취소</Button>
            <Button variant="primary">확인</Button>
          </Stack>
        </Stack>
      </Card>
    </Stack>
  );
}
```

### Step 4 — 라우터에 등록 (해당 시)

ppt의 router 파일에서:

```tsx
<Route path="/my-new-page" element={<MyNewPage />} />
```

### Step 5 — 결과 확인

```powershell
cd C:\Users\ohjih\ppt\frontend
pnpm dev
```

브라우저에서 `localhost:3000/my-new-page` 열어 확인. 디자인 시스템 적용된 상태로 그려져야 함.

---

## 3. 자주 쓰는 컴포넌트 cheat sheet

| 컴포넌트 | 핵심 prop | 예시 |
|---|---|---|
| **Button** | `variant`: `primary` / `secondary` / `outline` / `text` / `danger`<br>`size`: `sm` / `md` / `lg` (lg는 hero/CTA용) | `<Button variant="primary" size="md">확인</Button>` |
| **Card** | `variant`: `surface` / `elevated`<br>`padding`: `none` / `sm` / `md` / `lg` | `<Card variant="elevated" padding="md">...</Card>` |
| **Input** | `value` / `onChange` / `placeholder` / `disabled` (HTML input 표준 prop) | `<Input placeholder="이름" value={name} onChange={(e) => setName(e.target.value)} />` |
| **Textarea** | `value` / `onChange` / `resize`: `auto` / `none` / `both` | `<Textarea resize="none" rows={4} ... />` |
| **Alert** | `onDismiss?` (있으면 × 버튼 표시), role="alert" 자동 | `<Alert onDismiss={() => setOpen(false)}>오류가 발생했습니다.</Alert>` |
| **Badge** | `variant`: `neutral` / `primary` | `<Badge variant="primary">NEW</Badge>` |
| **Stack** | `direction`: `row` / `column`<br>`gap`: 1~8 (4px / 6px / 8px / 10px / 12px / 16px / 22px / 32px)<br>`padding`: 1~8 (같음)<br>`align` / `justify` | `<Stack direction="row" gap={3} justify="between">...</Stack>` |
| **Text** | `variant`: `body` / `titleSm` / `titleLg` / `label` 등<br>`weight`: `regular` / `medium` / `bold`<br>`color` | `<Text variant="titleLg" weight="bold">제목</Text>` |
| **Spinner** | `size`: `sm` / `md` / `lg` | `<Spinner size="md" />` |
| **Skeleton** | `width` / `height` / `radius` | `<Skeleton width="100%" height={20} />` |
| **Checkbox / Radio / Switch** | `checked` / `onChange` / `disabled` | `<Switch checked={on} onChange={setOn} />` |

**Stack의 gap/padding은 숫자 index**라는 게 핵심 함정. `gap="md"`가 아니라 `gap={6}` (= 16px).

> 💡 **host 측 spacing 가이드**: row 정렬 시 자식에 `style={{ marginRight: N }}`/`marginLeft` 박지 말고 `<Stack direction="row" gap={N}>`로 wrap하는 게 더 이상적. dogfood F7+F23(trial 8+11) 4회 누적 evidence — host inline px가 반복되면 wrap 후보.

자세한 prop은 IDE의 자동완성 또는 `node_modules/@wonik/web/dist/index.d.ts`. design_system repo 안에서는 `packages/web/src/{컴포넌트}/types.ts`.

---

## 4. 토큰 직접 사용 (드물게 필요할 때)

대부분은 컴포넌트가 알아서 토큰 적용. 직접 색·spacing 박아야 할 때:

```tsx
import { interfaceColors, space, radius } from '@wonik/tokens';

<div style={{
  background: interfaceColors.surface,
  padding: space[5],          // 12px
  borderRadius: radius.md,    // 10px
  color: interfaceColors.text,
}}>
  raw HTML 사용 시
</div>
```

또는 CSS 변수 직접:

```tsx
<div style={{ color: 'var(--color-primary)' }}>WONIK BLUE</div>
```

**금지**: hex/px 리터럴 직접 박지 말 것. `color: '#273E82'` 같은 거 → 항상 토큰 경유.

---

## 5. cascade override (host 색 덮어쓰기)

host product가 자체 색을 원하면 7개 interface variable만 정의:

```css
/* ppt의 theme.css */
:root {
  --color-bg: #FAFAFA;
  --color-surface: #FFFFFF;
  --color-border: #E5E5E5;
  --color-text: #111111;
  --color-text-muted: #6B7280;
  --color-primary: #1E40AF;
  --color-focus: #3B82F6;
}
```

→ 우리 컴포넌트가 자동으로 그 색을 따름. 미정의 변수는 우리 기본값(WONIK BLUE) fallback. 자세한 모델은 ADR-010.

---

## 6. 부족한 컴포넌트가 발견되면 (★ 다음 phase의 씨앗)

작업 중 *"이런 거 또 필요한데"* 마음에 들 때:

### 6-a. 메모 파일에 한 줄

ppt 옆에 `dogfood-notes.md` 만들어두기:

```markdown
# Dogfood Notes

- 2026-05-14 — MyNewPage: FormField (label + Input 묶음) 필요. 회원가입 폼.
- 2026-05-15 — Settings: Modal 필요. 확인 다이얼로그.
- 2026-05-20 — Home: FormField 또 필요. 로그인 폼.
```

### 6-b. 같은 컴포넌트 3회 누적 트리거

> "FormField"가 누적 3회 보임 → **design_system phase 18-form-field로 만들기 시작**.

이 *evidence-driven 3회 규칙*이 layer A의 정신. 1번 보고 만들면 ad-hoc, 3번 보고 만들면 진짜 needs.

### 6-c. 3회 안 모이면 host에서 ad-hoc

ppt 안에서 그냥 Stack + Text + Input 묶어서 조합. 디자인 시스템에 안 박음. 진짜 패턴이면 결국 3회 모임.

---

## 7. 함정 경고

1. ❌ **Deep import 금지** — `import { Button } from '@wonik/web/dist/Button'` 같이 dist 경로 직접 import 금지. 항상 `'@wonik/web'` package root에서.
2. ❌ **hex/px raw 직접 박지 말 것** — `color: '#273E82'`, `padding: '12px'` → 토큰 또는 CSS 변수 경유. host 측 코드도 가능하면.
3. ❌ **토큰 CSS import 빠뜨림** — 컴포넌트가 못생긴 기본 색으로 그려지면 99% 이 이유. app entry에 한 번만 추가.
4. ❌ **컴포넌트 prop 이름 추측 금지** — `Stack gap="md"` 같이 추측하지 말고 IDE 자동완성 활용 (`gap={6}`이 정답).

---

## 8. FAQ

**Q. import path가 빨간 줄 떠요 (`Cannot find module '@wonik/web'`)**
A. ppt 측 `pnpm install` 한 번. 그래도 안 되면 IDE 재시작.

**Q. 컴포넌트가 못생긴 기본 색으로 그려져요**
A. 토큰 CSS import 안 했을 가능성 99%. app entry에 `import '@wonik/tokens/tokens.css'` 추가.

**Q. dark mode는?**
A. `<html data-theme="dark">` 토글 (또는 클래스 / state로 host가 결정). 자세한 건 ADR-009.

**Q. design_system에 변경했는데 ppt에 안 보여요**
A. workspace link면 보통 자동 반영. 가끔 안 되면 design_system에서 `pnpm -F @wonik/web build` 한 번 + ppt dev 재시작.

**Q. 컴포넌트 어떤 종류가 있는지 한 번에 보고 싶음**
A. `apps/web-sandbox/` 실행 — `pnpm -F web-sandbox dev`. 14개 atoms가 한 페이지에 시각화돼있음.

**Q. SSR(Next.js)에서 작동?**
A. 모든 module-scope CSS injection에 SSR 가드 들어있음 (ADR-011). hydration mismatch 0.

---

## 9. 사용 → 발견 → 추가 사이클 (전체 그림)

```
[모드 A] ppt에서 매일 import해 페이지 빌드 (대부분 시간)
   │
   │  ↓ 작업 중 부족한 컴포넌트 메모
   │
[누적 3회 evidence 모이면]
   │
   ↓
[모드 B] design_system에 새 phase로 컴포넌트 추가 (가끔)
   │
   ↓
[모드 A로 복귀] 새 컴포넌트도 import해 사용
```

이게 layer A의 *살아있는 도구화*. Trial 1~6 + Phase 12·14·16이 정확히 이 패턴이었음.

---

## cross-reference

- 외부 install 가이드: `docs/INSTALL.md`
- 결정 기록: `docs/ADR.md` — 특히 ADR-010 (interface variable cascade), ADR-011 (module-scope CSS)
- 1단계 큰 그림: `docs/PRD.md`
- 메타인지 노트: 옵시디언 vault의 `Design-System/` 폴더 (디자인 시스템 개발 워크플로우 — 토스 모델 / 디자인 시스템 패키지 host에서 쓰기 / Publish & adopt 사이클 — 첫 손-실행)
