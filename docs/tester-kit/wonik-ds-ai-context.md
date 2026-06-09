# WONIK IPS Design System — AI 코딩 컨텍스트

> **이 파일을 너의 프로젝트 AI 컨텍스트에 붙여라.** Claude Code면 프로젝트 `CLAUDE.md`에, Cursor면 `.cursorrules`(또는 `.cursor/rules/`)에 통째로 넣거나 import 한다.
> 목적: 이 사내 화면을 만들 때 **버튼·입력·카드 같은 UI를 새로 짜지 말고 `@wonik/web` 컴포넌트로 조립**하게 만든다. WONIK IPS 사내 web service의 시각 언어를 자동으로 따르기 위함.

---

## 0. 너(AI)에게 주는 최우선 규칙

1. UI를 만들 때 **먼저 아래 카탈로그에 맞는 `@wonik/web` 컴포넌트가 있는지 본다.** 있으면 그걸 import해 쓴다. 직접 `<button>`/`<input>`에 className으로 스타일을 새로 입히지 마라.
2. 색·간격(gap/padding)·글자크기·radius 같은 **디자인 토큰 값을 raw(hex·px)로 하드코딩하지 마라.** 컴포넌트 prop(`variant`/`size`/`gap`/`p` 등)이나 토큰 CSS 변수(`var(--color-primary)`)로 표현한다. **예외**: 레이아웃 치수(`width`/`height`/`flex-basis` 등)는 토큰화 대상이 아니다 — `<Box style={{ width: 160 }}>`처럼 직접 줘도 된다. 토큰 강제는 **색·간격·글자·radius**에 한한다.
3. **AI 슬롭 금지** (§4). 글래스모피즘·gradient 텍스트·glow 애니메이션·보라/인디고 brand·이모지 장식 등을 절대 만들지 마라.
4. 카탈로그에 **없는** 컴포넌트가 필요하면 — 조용히 새로 만들지 말고, `Box`/`Stack`/`Text`로 최소 조립하되 **"이 컴포넌트가 DS에 없어서 임시 조립했다"고 사용자에게 한 줄 보고**한다. (그 빠진 목록이 DS 개선 backlog가 된다.)

---

## 1. 설치 (one-time)

`@wonik/web`(컴포넌트)과 `@wonik/tokens`(토큰)은 **둘 다** 설치해야 한다 — peer-only 계약이라 web만 깔면 tokens가 자동으로 안 따라온다 (토스 TDS·MUI·Radix와 동일한 표준 패턴).

```bash
pnpm add @wonik/web @wonik/tokens
# npm install @wonik/web @wonik/tokens / yarn add @wonik/web @wonik/tokens
```

> ⚠️ **현재 사내 npm registry는 아직 공개 전이다.** 위 명령이 바로 안 되면 DS 메인테이너에게 **설치본(local tarball 또는 workspace 경로)** 을 요청하라. 받은 `.tgz`는 `pnpm add ./wonik-web-1.0.0.tgz ./wonik-tokens-1.0.0.tgz`로 설치한다. (`@dnd-kit`만 public npm에서 자동 resolve.)

앱 진입점(예: `src/main.tsx`)에서 **토큰 CSS를 최상위에서 1회만** import:

```tsx
import '@wonik/tokens/tokens.css';   // 토큰 CSS 변수 활성화 — 컴포넌트보다 먼저, 1회만
```

React 18·19 둘 다 지원. host의 React 버전 그대로 쓰면 된다.

토스트를 쓰려면 앱을 `ToastProvider`로 감싼다. 다크모드를 직접 토글하려면 `ThemeProvider`로 감싼다 (둘 다 선택).

---

## 2. 색 — WONIK BLUE가 기본, host가 덮어쓸 수 있다

- **Primary = WONIK BLUE `#273E82`** (공식 CI). 다른 파랑(`#2B7FFF` 등)으로 바꾸지 마라.
- 컴포넌트는 7개 **interface 변수**(`--color-bg`/`--color-surface`/`--color-border`/`--color-text`/`--color-text-muted`/`--color-primary`/`--color-focus`)를 cascade로 읽는다. 이 화면이 자체 색 팔레트를 가져야 하면, host의 CSS에서 이 변수만 정의하면 컴포넌트가 자동으로 따라온다:

```css
:root {
  --color-primary: #1E40AF;   /* 의도적으로 host primary를 쓸 때만. 안 정의하면 WONIK BLUE */
  --color-focus: #3B82F6;
}
```

- spacing·radius·typography 토큰은 **override 대상이 아니다** — DS 시각 정체성이라 일관 유지.

---

## 3. 입력·폼 컴포넌트 공통 규칙

- 모든 폼 컴포넌트(`Input`/`Textarea`/`Checkbox`/`Switch`/`Radio`)는 **controlled / uncontrolled 둘 다** React 표준대로 지원한다. `value`+`onChange`(controlled) 또는 `defaultValue`/`defaultChecked`(uncontrolled) 중 골라라.
- 검증 실패는 `invalid` prop으로 — border가 alarm 색이 되고 `aria-invalid`가 자동 설정된다. 직접 빨간 테두리를 그리지 마라.
- **에러 *문구*는 `<Alert>`로 보여줘라** (`role="alert"`라 스크린리더가 읽는다). `Text`에는 에러용 빨강 색이 **없다** — `<Text color="brand">`(brand=WONIK BLUE 파랑)로 에러색을 흉내내지 마라. 필드 단위 빨강 텍스트는 아직 DS 표준 패턴이 아니다(누락 보고 대상, §0-4).
- `Radio`/`Checkbox`/`Switch`는 `label` prop이 없다. 라벨은 컨트롤과 Text를 `<Stack as="label">`로 함께 감싸 연결한다 (클릭 영역이 라벨까지 확장됨). 라디오 그룹은 같은 `name`을 공유하면 브라우저가 단일 선택을 처리한다.
- 접근성(focus ring, role, aria-*)은 컴포넌트에 내장돼 있다. `outline: none`으로 지우지 마라 (WCAG 위반).

---

## 4. AI 슬롭 — 절대 금지

다음은 이 디자인 시스템이 명시적으로 배격하는 패턴이다. 생성하지 마라:

- 글래스모피즘 (`backdrop-filter: blur`)
- gradient 텍스트 / 배경 gradient orb
- box-shadow glow 애니메이션
- 모든 카드에 `rounded-2xl` 일괄 적용 (radius는 `sm`/`md` 토큰만)
- 장식용 이모지 (📊✨🚀 등)
- 보라/인디고 brand 색 (brand는 WONIK BLUE 단일)
- 자동 재생 Lottie 일러스트

대신: 조밀하고 기능적인 산업용 UI. 작은 글자(8~14px), 차분한 색, 명확한 위계.

---

## 5. 컴포넌트 카탈로그 (24)

import는 항상 root에서만: `import { Button, Card } from '@wonik/web'` (deep import 금지).

> **아이콘**: `@wonik/web`은 아이콘을 제공하지 않는다. `IconButton`·`Input`의 addon에 들어가는 아이콘은 **host가 직접** 넣는다 — 인라인 `<svg>` 또는 `lucide-react` 같은 라이브러리. (이모지는 슬롭 금지 §4.)

### 레이아웃
| 컴포넌트 | 용도 | 주요 prop |
|---|---|---|
| `Box` | polymorphic 컨테이너 + spacing | `as`, `p`/`px`/`py`/`pt`…(space token), `m`/`mx`…, `surface`, `border`, `radius` |
| `Stack` | flex 정렬 | `direction`(`'row'`\|`'column'`=기본), `gap`(space token), `align`(`start`\|`center`\|`end`\|`stretch`), `justify`(`start`\|`center`\|`end`\|`between`\|`around`), `wrap`, `as`(label 래핑 등 — Box 상속) |
| `Card` | 카드 표면 | `variant`(`'surface'`\|`'elevated'`), `padding`(`'none'`\|`'sm'`\|`'md'`=기본\|`'lg'`), `as` |

### 타이포그래피
| 컴포넌트 | 용도 | 주요 prop |
|---|---|---|
| `Text` | 모든 텍스트 | `variant`(`micro`\|`labelSm`\|`label`\|`titleSm`), `weight`(`regular`\|`medium`), `color`(`primary`\|`secondary`\|`dim`\|`dark`\|`brand`\|`onDark`\|`onDarkVal`\|`onDarkDim` — **에러용 빨강 없음**, 에러는 §3대로 Alert), `align`, `as`(p/span/div/h1~h6/label/strong/em), `truncate` |

### 액션
| 컴포넌트 | 용도 | 주요 prop |
|---|---|---|
| `Button` | 버튼 | `variant`(`primary`\|`secondary`\|`text`\|`outline`\|`danger`), `size`(`sm`\|`md`=기본\|`lg`), `children` 필수, + 모든 native `<button>` attr |
| `IconButton` | 아이콘 전용 버튼 | `variant`(`outline`\|`ghost`), `size`, **`aria-label` 필수**, `children`=아이콘 |
| `FilterChip` | 토글형 필터 칩 | `active`, `children` |

### 폼 (§3 공통규칙 적용)
| 컴포넌트 | 용도 | 주요 prop |
|---|---|---|
| `Input` | 텍스트 입력 | `size`, `invalid`, `leftAddon`, `rightAddon`, + native input attr (`value`/`onChange`/`placeholder`…) |
| `Textarea` | 멀티라인 입력 | `size`, `invalid`, + native textarea attr |
| `Checkbox` | 체크박스 | `size`, `invalid`, + native (`checked`/`defaultChecked`/`onChange`) |
| `Switch` | 토글 스위치 (`role="switch"`) | `size`, `invalid`, + native checkbox attr |
| `Radio` | 라디오 (같은 `name` 공유로 그룹화) | `size`, `invalid`, + native |

### 피드백 · 상태
| 컴포넌트 | 용도 | 주요 prop |
|---|---|---|
| `Alert` | 인라인 경고 (`role="alert"`) | `onDismiss`(주면 × 버튼 자동), `children` |
| `Badge` | 상태 라벨 | `variant`(`neutral`\|`primary` — 2개뿐, 노랑/주황 같은 경고 톤 없음. 풍부한 상태색이 필요하면 누락 보고 §0-4), `children` |
| `Spinner` | 로딩 스피너 | `size`, `label`(스크린리더용, 기본 'Loading') |
| `Skeleton` | 로딩 placeholder | `variant`(`text`\|`rect`\|`circle`), `width`, `height` |
| `ProgressBar` | 진행률 막대 | **`value` 필수**(0~100), `tone`(`primary`=일반 진행 \| `alarm`=위험/경보 \| `ready`=완료/정상), `height`. 가로 폭 prop은 없음 → 좁게 쓰려면 `<Box style={{ width: … }}>`로 감싼다(§0-2 예외) |
| `Toast` + `useToast` | 일시 알림 | 화면을 `<ToastProvider position max>`(`max`=number, 기본 5)로 감싼 뒤, 그 **하위** 컴포넌트에서 `const t = useToast(); t.show({ tone, title, description, duration, action })`. `show`는 ThemeProvider처럼 provider 하위라면 화면 단위로 감싸도 동작 |

### 오버레이
| 컴포넌트 | 용도 | 주요 prop |
|---|---|---|
| `Modal` | 모달 다이얼로그 | **`isOpen`·`onClose` 필수**, `title`, `size`(`sm`\|`md`\|`lg`), `closeOnBackdrop`, `closeOnEsc`. 복합: `<Modal.Body>` / `<Modal.Footer>` |
| `Tooltip` | 툴팁 | **`content` 필수**(툴팁 본문 text/node) · **`children` 필수 = 트리거 단일 element**(IconButton/button 등, ref 전달 가능해야), `placement`(`top`=기본\|`right`\|`bottom`\|`left`), `openDelay`/`closeDelay`. 예: `<Tooltip content="설명"><IconButton aria-label="도움말">…</IconButton></Tooltip>` |

### 데이터
| 컴포넌트 | 용도 | 주요 prop |
|---|---|---|
| `Table` | 데이터 테이블 | `columns`(아래), `data`, `stickyHeader`, `zebra`, `emptyMessage`, `caption`(a11y). Column = `{ id, header, accessor: keyof T \| (row)=>값, cell? }` |
| `SortableList` | 드래그 정렬 리스트 | `items`, `getKey:(item)=>string`, `renderItem:(item,idx,args)=>node`, `onReorder:(from,to)=>void`, `direction` |

### 기타
| 컴포넌트 | 용도 | 주요 prop |
|---|---|---|
| `Avatar` | 이니셜 아바타 | **`name` 필수**, `size`(number), `color` |
| `InlineEditableText` | 인라인 편집 텍스트 | **`value`·`onChange` 필수**, `trigger`(`single`\|`double`), `placeholder`, `saveOnBlur`, `size` |
| `ThemeProvider` + `useTheme` | 라이트/다크 토글 | `defaultTheme`(`light`\|`dark`), `theme`/`onThemeChange`(controlled), `scope`(`html`\|`self`) |

---

## 6. 토큰 scale (prop 값으로 쓸 정확한 키)

- **space** (Box `p`/`m`·Stack `gap`): `1`=4px · `2`=6px · `3`=8px · `4`=10px · `5`=12px · `6`=16px · `7`=22px · `8`=32px
- **radius**: `sm`=5px · `md`=10px · `full`=50%
- **fontSize** (Text `variant`): `micro`=8px · `labelSm`=10px · `label`=12px · `titleSm`=14px  ← HMI 추출이라 조밀. 큰 제목이 필요해도 16px+ 폰트를 새로 만들지 말고 `titleSm`+`weight="medium"`을 쓴다.
- **fontWeight** (Text `weight`): `regular`=400 · `medium`=500

---

## 7. 정상 코드 예시 (이 패턴을 따라라)

```tsx
import '@wonik/tokens/tokens.css';
import { useState } from 'react';
import {
  Card, Stack, Text, Table, Badge, Button, Input,
  ToastProvider, useToast,
} from '@wonik/web';
import type { Column } from '@wonik/web';

interface Equipment {
  id: string;
  name: string;
  status: 'ready' | 'alarm';
}

const columns: Column<Equipment>[] = [
  { id: 'name', header: '설비', accessor: 'name' },
  {
    id: 'status',
    header: '상태',
    accessor: 'status',
    cell: (value) => (
      <Badge variant={value === 'ready' ? 'primary' : 'neutral'}>
        {value === 'ready' ? '정상' : '경보'}
      </Badge>
    ),
  },
];

function EquipmentPanel({ rows }: { rows: Equipment[] }) {
  const toast = useToast();
  const [query, setQuery] = useState('');
  const filtered = rows.filter((r) => r.name.includes(query));

  return (
    <Card padding="lg" variant="elevated">
      <Stack gap={6}>
        <Stack direction="row" justify="between" align="center">
          <Text variant="titleSm" weight="medium">설비 점검</Text>
          <Button
            variant="primary"
            size="sm"
            onClick={() => toast.show({ tone: 'success', title: '새로고침 완료' })}
          >
            새로고침
          </Button>
        </Stack>

        <Input
          size="sm"
          placeholder="설비 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <Table columns={columns} data={filtered} zebra emptyMessage="설비 없음" />
      </Stack>
    </Card>
  );
}

export function App({ rows }: { rows: Equipment[] }) {
  return (
    <ToastProvider position="top-right">
      <EquipmentPanel rows={rows} />
    </ToastProvider>
  );
}
```

이 예시가 보여주는 것: 토큰 CSS 1회 import · root import · `Stack gap`로 간격(하드코딩 px 없음) · `Badge`로 상태색(직접 색 안 칠함) · `Table` Column의 `cell` renderer · `useToast` 패턴.

### 7-2. 폼 + 오버레이 패턴 (검증·Tooltip·Modal·Radio그룹 — 조립이 까다로운 것들)

> 아래 패턴은 실제로 컴파일 검증됨. Tooltip `content`, Modal 복합, Radio 그룹 `<Stack as="label">`, 에러 문구 `Alert`를 그대로 따르라.

```tsx
import { useState } from 'react';
import {
  Card, Stack, Text, Input, Radio, Switch, Checkbox,
  Button, IconButton, Tooltip, Alert, Modal, ToastProvider, useToast,
} from '@wonik/web';

type Urgency = 'low' | 'normal' | 'high';
const URGENCY: { value: Urgency; label: string }[] = [
  { value: 'low', label: '낮음' }, { value: 'normal', label: '보통' }, { value: 'high', label: '높음' },
];

function RequestForm() {
  const toast = useToast();
  const [name, setName] = useState('');
  const [urgency, setUrgency] = useState<Urgency>('normal');
  const [night, setNight] = useState(false);
  const [safety, setSafety] = useState(false);
  const [tried, setTried] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const nameInvalid = tried && name.trim() === '';
  const safetyInvalid = tried && !safety;

  const submit = () => {
    setTried(true);
    if (name.trim() === '' || !safety) return;   // 검증 실패 → 모달 안 엶
    setConfirm(true);
  };

  return (
    <Card padding="lg" variant="elevated">
      <Stack gap={7}>
        {/* 검증 실패 요약은 Alert로 (Text 에러색 없음) */}
        {(nameInvalid || safetyInvalid) && <Alert>설비명과 안전조치 완료는 필수입니다.</Alert>}

        <Stack gap={2}>
          <Text variant="label" weight="medium" as="label">설비명</Text>
          <Input size="md" value={name} invalid={nameInvalid}
                 onChange={(e) => setName(e.target.value)} placeholder="예: ETCH-03" />
        </Stack>

        {/* 긴급도 + 도움말 Tooltip(content=본문, children=트리거) */}
        <Stack gap={3}>
          <Stack direction="row" align="center" gap={2}>
            <Text variant="label" weight="medium">긴급도</Text>
            <Tooltip content="높음=라인정지 위험 / 보통=당일 / 낮음=정기">
              <IconButton variant="ghost" size="sm" aria-label="긴급도 기준 도움말">?</IconButton>
            </Tooltip>
          </Stack>
          <Stack direction="row" gap={6}>
            {URGENCY.map((o) => (
              <Stack key={o.value} as="label" direction="row" align="center" gap={2}>
                <Radio name="urgency" value={o.value}
                       checked={urgency === o.value} onChange={() => setUrgency(o.value)} />
                <Text variant="label">{o.label}</Text>
              </Stack>
            ))}
          </Stack>
        </Stack>

        <Stack as="label" direction="row" justify="between" align="center" gap={6}>
          <Text variant="label" weight="medium">야간작업 허용</Text>
          <Switch checked={night} onChange={(e) => setNight(e.target.checked)} aria-label="야간작업 허용" />
        </Stack>

        <Stack as="label" direction="row" align="center" gap={3}>
          <Checkbox checked={safety} invalid={safetyInvalid}
                    onChange={(e) => setSafety(e.target.checked)} aria-label="안전조치 완료" />
          <Text variant="label" weight="medium">안전조치 완료 (필수)</Text>
        </Stack>

        <Stack direction="row" justify="end">
          <Button variant="primary" onClick={submit}>점검 요청 등록</Button>
        </Stack>
      </Stack>

      <Modal isOpen={confirm} onClose={() => setConfirm(false)} title="등록 확인" size="sm">
        <Modal.Body><Text variant="label">{name.trim()} 점검 요청을 등록할까요?</Text></Modal.Body>
        <Modal.Footer>
          <Stack direction="row" justify="end" gap={4}>
            <Button variant="secondary" onClick={() => setConfirm(false)}>취소</Button>
            <Button variant="primary" onClick={() => {
              setConfirm(false);
              toast.show({ tone: 'success', title: '점검 요청이 등록되었습니다' });
            }}>확정</Button>
          </Stack>
        </Modal.Footer>
      </Modal>
    </Card>
  );
}

export function RequestScreen() {
  // useToast는 ToastProvider 하위에서만 — 화면을 감싼다
  return <ToastProvider position="top-right"><RequestForm /></ToastProvider>;
}
```

---

## 8. 막히면

- 원하는 컴포넌트가 카탈로그에 없다 → §0의 4번 규칙(임시 조립 + 한 줄 보고).
- prop이 기억 안 난다 → 패키지가 TypeScript 타입을 제공하므로 에디터 자동완성을 믿어라. 위 표가 1차 참조.
- 설치/색 cascade 상세 → DS repo의 `docs/INSTALL.md`, `docs/UI_GUIDE.md`.
