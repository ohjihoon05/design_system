# 손으로 따라 만드는 WONIK 디자인시스템 화면

> **이 문서는 코드를 모르는 분을 위한 것입니다.** 순서대로 따라 하면, 약 1시간 안에 회사 디자인시스템(DS)으로 **본인 업무 화면**을 직접 만들게 됩니다.
>
> **딱 3가지 규칙**
> 1. **AI 도구(ChatGPT·Claude·Copilot 등)를 쓰지 마세요.** 이 문서만으로 되는지가 실험의 핵심입니다.
> 2. **만든 사람(메인테이너)에게 중간에 묻지 마세요.** 막히면 §5를 보고, 그래도 안 되면 §5 끝의 메모지에 적고 멈추면 됩니다 — 그 메모가 이 실험의 가장 귀한 결과물입니다.
> 3. 코드는 **이해하지 않아도 됩니다.** 통째로 복사해 붙이고, 나중에 정해진 자리의 한글만 바꿉니다.

---

## 메인테이너 사전 준비 (테스터는 이 박스를 건너뛰세요)

테스터에게 PC를 넘기기 전 확인:

- [ ] 테스트 PC에 이 repo가 받아져 있고 `pnpm install`이 끝난 상태
- [ ] `pnpm -F web-sandbox dev`가 정상 기동되는지 1회 확인
- [ ] `apps\web-sandbox\start-sandbox.bat`의 **바탕화면 바로가기**를 "DS 화면 시작" 이름으로 생성
- [ ] **바로가기를 1회 미리 실행**해 SmartScreen·방화벽 허용 팝업을 먼저 통과시켜 둠 (테스터가 첫 화면부터 보안 경고를 만나지 않게)
- [ ] VS Code 설치 + 바탕화면에 repo 폴더 바로가기 + **repo 폴더를 VS Code로 1회 열어 신뢰(Trust) 팝업에 Yes 해둠**
- [ ] **이 문서를 코드 복사 버튼이 보이는 형태로 열어둔 채 인계** — VS Code에서 이 파일을 열고 미리보기(`Ctrl+Shift+V`), 또는 브라우저 렌더 뷰
- [ ] `apps/web-sandbox/src/MyScreen.tsx`가 **없는** 상태인지 확인 (있으면 삭제 — 테스터가 직접 만들어야 함)
- [ ] 끝난 뒤 원복: `git checkout apps/web-sandbox/src/main.tsx` + `MyScreen.tsx` 삭제

---

## §0. 화면 띄우기 (더블클릭 1번)

1. 바탕화면의 **"DS 화면 시작"** 아이콘을 더블클릭합니다.
   - 파란 보안 경고("PC를 보호했습니다")나 방화벽 허용 창이 뜨면 **정상입니다** — [추가 정보 → 실행] / [액세스 허용]을 누르세요.
2. 검은 창이 하나 뜹니다. **이 창은 닫지 말고 그대로 두세요.** (이게 *dev server* — 코드를 화면으로 바꿔주는 프로그램입니다. 작업 내내 켜져 있어야 합니다.)
3. 잠시 뒤 브라우저가 자동으로 열리고 버튼·입력칸들이 진열된 화면이 보입니다.

> 브라우저가 안 열리면: 직접 브라우저 주소창에 `localhost:5173` 을 입력하세요.

여기까지 됐으면 준비 끝입니다.

---

## §1. 내 화면 파일 만들기

이제 코드 편집 프로그램(VS Code)에서 파일 하나를 새로 만듭니다.

1. 바탕화면의 **repo 폴더 바로가기**를 우클릭 → **"Code(으)로 열기"**.
   - 우클릭 메뉴에 없으면 맨 아래 **"추가 옵션 표시"** 안에 숨어 있을 수 있습니다. 그래도 없으면: VS Code를 먼저 열고 → 위 메뉴 **File → Open Folder(폴더 열기)** → 그 폴더 선택.
   - 영어 팝업("Do you trust the authors...?")이 뜨면 **Yes**를 누르세요. 정상입니다.
2. 왼쪽 파일 목록에서 `apps` → `web-sandbox` → `src` 폴더를 차례로 펼칩니다.
3. **`src` 폴더를 한 번 클릭해 선택한 상태에서**, 파일 목록 위쪽에 나오는 **새 파일** 아이콘(📄+)을 누르고, 이름을 이렇게 입력합니다:

   ```
   MyScreen.tsx
   ```

   - 파일 이름도 위 글자를 **복사해서 붙여넣는 게** 안전합니다 (한글 자판 상태로 치면 `ㅡㅛㄴㅊㄱ...` 같은 글자가 됩니다).
   - 파일이 엉뚱한 폴더에 생겼다면: 그 파일을 우클릭 → **삭제** → `src` 폴더를 클릭해 선택한 뒤 다시 만드세요.
4. 방금 만든 빈 파일에 아래 **코드 블록 A를 전부** 복사해 붙여넣습니다.
   - 이 문서를 미리보기/브라우저로 보고 있다면 코드 블록 **오른쪽 위의 복사 버튼**이 가장 안전합니다.
   - 복사 버튼이 없으면: 코드의 첫 글자(`import`)부터 마지막 `}` 까지 드래그해서 `Ctrl+C` → 빈 파일에서 `Ctrl+V`. 회색 블록의 테두리 표시(` ```tsx ` 같은 것)는 코드가 아니므로 **포함하면 안 됩니다.**
5. `Ctrl+S` 로 저장합니다.

> 💬 *컴포넌트* = 버튼·입력칸·표처럼 미리 만들어진 화면 부품. 아래 코드는 부품들을 가져와 조립하는 설계도입니다. `// ✏️ 치환` 이라고 적힌 줄은 §4에서 당신 업무 내용으로 바꿀 자리이니 지금은 그냥 두세요.

**코드 블록 A** — `MyScreen.tsx` 에 붙여넣기:

```tsx
import { useState } from 'react';
import { Box, Card, Stack, Text, Input, Button, Table, Badge, Alert } from '@wonik/web';
import type { Column } from '@wonik/web';

// ✏️ 치환 ④ — 표의 한 줄(행)이 가지는 정보 묶음
interface WorkItem {
  id: string;
  name: string;
  owner: string;
  status: string;
}

// ✏️ 치환 ⑤ — 처음에 보여줄 데이터 (따옴표 안만 바꾸세요)
const INITIAL_ITEMS: WorkItem[] = [
  { id: '1', name: '메인 화면 시안 v2', owner: '오지훈', status: '진행중' },
  { id: '2', name: '아이콘 교체 요청 정리', owner: '오지훈', status: '완료' },
  { id: '3', name: '컬러 가이드 검토', owner: '김원익', status: '진행중' },
];

// ✏️ 치환 ⑥ — "끝난 상태"를 부르는 말. 위 데이터의 status 값과 글자가 똑같아야
// 파란 배지가 붙습니다.
const DONE_LABEL = '완료';

// ✏️ 치환 ③ — 표의 컬럼 제목 (header 의 따옴표 안만)
const columns: Column<WorkItem>[] = [
  { id: 'name', header: '작업명', accessor: 'name' },
  { id: 'owner', header: '담당', accessor: 'owner' },
  {
    id: 'status',
    header: '상태',
    accessor: 'status',
    cell: (value) => (
      <Badge variant={value === DONE_LABEL ? 'primary' : 'neutral'}>{String(value)}</Badge>
    ),
  },
];

export function MyScreen() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [query, setQuery] = useState('');
  const [newName, setNewName] = useState('');
  const [tried, setTried] = useState(false);

  const filtered = items.filter((item) => item.name.includes(query));
  const nameInvalid = tried && newName.trim() === '';

  const addItem = () => {
    setTried(true);
    if (newName.trim() === '') return;
    setItems([
      ...items,
      { id: String(Date.now()), name: newName.trim(), owner: '나', status: '진행중' },
    ]);
    setNewName('');
    setTried(false);
  };

  return (
    <Box style={{ maxWidth: 760, margin: '0 auto' }}>
      <Stack gap={7}>
        {/* ✏️ 치환 ① — 화면 제목 */}
        <Text variant="titleSm" weight="medium" as="h1">
          디자인 작업 현황
        </Text>

        <Card padding="lg" variant="elevated">
          <Stack gap={5}>
            <Text variant="label" weight="medium" as="h2">
              새 작업 등록
            </Text>
            {nameInvalid && <Alert>작업명을 입력해야 등록할 수 있습니다.</Alert>}
            <Stack direction="row" gap={4} align="center">
              <Box style={{ flex: 1 }}>
                {/* ✏️ 치환 ② — 입력칸의 회색 안내 문구 */}
                <Input
                  size="md"
                  placeholder="예: 배너 시안 2차"
                  value={newName}
                  invalid={nameInvalid}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </Box>
              <Button variant="primary" onClick={addItem}>
                등록
              </Button>
            </Stack>
          </Stack>
        </Card>

        <Card padding="lg" variant="surface">
          <Stack gap={5}>
            <Stack direction="row" justify="between" align="center">
              <Text variant="label" weight="medium" as="h2">
                작업 목록
              </Text>
              <Badge variant="primary">{filtered.length}건</Badge>
            </Stack>
            <Input
              size="sm"
              placeholder="작업명으로 검색"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Table
              columns={columns}
              data={filtered}
              zebra
              emptyMessage="해당하는 작업이 없습니다"
              caption="작업 목록 표"
            />
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}
```

---

## §2. 입구 바꿔치기

지금 브라우저에 보이는 건 진열장 화면입니다. 입구를 방금 만든 내 화면으로 바꿉니다.

> 안심하세요: 진열장 화면이 **지워지는 게 아닙니다.** 입구 표지판만 바꿔 다는 것이고, 실험이 끝나면 만든 사람이 명령어 한 줄로 원래대로 되돌립니다. 마음껏 바꾸세요.

1. 왼쪽 파일 목록에서 같은 `src` 폴더 안의 **`main.tsx`** 를 클릭해 엽니다.
2. 파일 안을 클릭하고 `Ctrl+A` (전체 선택) → `Delete` 로 **내용을 전부 지웁니다.**
3. 아래 **코드 블록 B를 전부** 복사해 붙여넣습니다.
4. `Ctrl+S` 로 저장합니다.

**코드 블록 B** — `main.tsx` 내용 전체를 이걸로 교체:

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MyScreen } from './MyScreen';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MyScreen />
  </StrictMode>,
);
```

---

## §3. 결과 확인 — 1분 투어

저장하는 순간 브라우저가 **저절로** 새로고침됩니다 (dev server가 하는 일). "디자인 작업 현황" 화면이 보이면 성공입니다.

직접 만져보세요:

- **검색**: "작업 목록"의 검색칸에 `시안` 을 쳐보세요 → 표가 즉시 걸러집니다. 지우면 다시 다 나옵니다.
- **검증**: 입력칸을 **빈 채로** [등록] 을 눌러보세요 → 경고 문구가 뜨고 입력칸 테두리가 경보색이 됩니다.
- **등록**: 아무 작업명이나 치고 [등록] → 표에 새 줄이 "진행중" 배지와 함께 추가됩니다.

> 방금 확인한 것: 버튼·입력·표·배지·경고가 전부 **회사 DS 부품**입니다. 색·간격·글씨가 알아서 회사 표준(WONIK BLUE 등)을 따르고 있습니다 — 당신이 색을 한 번도 고르지 않았는데도요.

---

## §4. 이제 당신 업무 화면으로 — 치환

`MyScreen.tsx` 의 `// ✏️ 치환` 표시 자리의 글자를 바꾸면 이 화면이 **당신 업무 화면**이 됩니다.

> **안전 규칙 한 가지: `✏️ 치환` 표시가 가리키는 자리의 한글만 바꾸세요.** 한글을 감싼 따옴표 자체, 쉼표, 중괄호, 영어 단어(`name`·`header` 같은 것)는 건드리지 않습니다. 바꿀 때마다 `Ctrl+S` → 브라우저에서 바로 확인.

| 표시 | 자리 (한글이 어떻게 감싸여 있나) | 바꾸는 것 | 예 (장비 점검 업무라면) |
|---|---|---|---|
| ✏️ ① | 화면 제목 — 따옴표 **없이** 그냥 적힌 글자 | 화면 이름 | `장비 점검 현황` |
| ✏️ ② | placeholder — **큰따옴표 `" "`** 안 | 입력칸 안내 문구 | `예: ETCH-03 정기점검` |
| ✏️ ③ | header 3곳 — 작은따옴표 `' '` 안 | 표의 컬럼 제목 | `점검 항목` / `담당자` / `진행 상태` |
| ✏️ ⑤ | INITIAL_ITEMS — 작은따옴표 `' '` 안 | 실제 데이터 줄들 | 당신이 관리하는 실제 항목 3~5개 |
| ✏️ ⑥ | DONE_LABEL — 작은따옴표 `' '` 안 | "끝남"을 부르는 말 | `점검완료` |

- **줄을 늘리려면**: ⑤에서 `{ id: '3', ... },` 한 줄을 통째로 복사해 **그 줄 바로 아래, `];` 보다는 위에** 붙입니다. `id` 는 겹치지 않는 숫자(`'4'`)로, 나머지 따옴표 안을 바꿉니다.
- ⑥을 바꿨다면 ⑤의 `status` 값도 **공백까지 똑같은 글자**로 맞춰야 파란 배지가 붙습니다. (예: 둘 다 `점검완료`)
- ✏️ ④(정보 묶음의 구조 자체를 바꾸는 것 — 컬럼 추가/삭제)는 난이도가 높아 **이번 실험 범위 밖**입니다. "이런 컬럼이 더 필요했다"고 §5 메모지에 적어주시면 충분합니다.

---

## §5. 막혔을 때

| 증상 | 처방 |
|---|---|
| 처음 실행·처음 폴더 열기에서 **파란 경고창·방화벽 창·영어 신뢰 팝업**("Do you trust...") | 전부 정상입니다 — [실행] / [액세스 허용] / [Yes] 를 누르세요 |
| 브라우저가 하얗거나 화면 대신 **빨간 글자 에러**가 보임 | 십중팔구 복사가 일부 잘렸거나 따옴표·쉼표가 지워진 것. `MyScreen.tsx` 내용을 `Ctrl+A` → `Delete` 로 비우고 **코드 블록 A를 처음부터 다시 통째로** 붙여넣고 저장 (§2를 했다면 main.tsx도 블록 B로 동일하게). ⚠️ 재복붙하면 §4에서 바꾼 한글이 초기화됩니다 — **바꿨던 내용을 먼저 메모**해두고 리셋 후 다시 바꾸세요 |
| 저장해도 브라우저가 안 바뀜 | 검은 창(dev server)이 닫혔는지 확인 → 닫혔으면 바탕화면 "DS 화면 시작" 다시 더블클릭 |
| 검은 창에 빨간 글자가 와르르 | 위와 같음 — 블록 A·B 재복붙이 최후의 수단이자 만능 리셋 (치환 내용 메모 먼저!) |
| 에러는 없는데 **"완료" 배지가 파란색이 안 됨** | ⑤의 `status` 글자와 ⑥ `DONE_LABEL` 글자가 **공백까지** 똑같은지 확인 (`'점검완료'` vs `'점검 완료'`는 다른 글자) |
| VS Code가 코드에 빨간 밑줄 표시 | 밑줄 위에 마우스를 올려 첫 줄만 읽어보고, 모르겠으면 재복붙 |

**그래도 안 되면 — 여기서 멈추는 게 정상입니다.** 아래 메모를 남겨주세요 (이 파일 옆에 종이로든, 메신저로든):

> - 어느 단계(§번호)에서 막혔나:
> - 화면/검은 창에 보인 메시지 (사진이면 더 좋음):
> - 그 순간 기대했던 것:

---

## §6. 다 만들면

**완성 기준**: 브라우저 화면에 **당신 업무의 제목·컬럼·데이터**가 보이고, 검색·등록이 동작하면 완성입니다.

마지막으로 세 가지만 답해주세요 (만든 사람에게 그대로 전달):

1. 이 화면, **실제 업무에서 쓰시겠습니까?** 쓴다면 어떤 업무에? 안 쓴다면 무엇 때문에?
2. 이 문서만으로 진행하는 동안 **가장 막막했던 순간**은 어디였습니까?
3. 표·입력칸 말고 **더 필요했던 부품**(달력, 파일 첨부, 색깔 배지 등)이 있었습니까?

수고하셨습니다. 당신은 방금 코드를 한 줄도 "작성"하지 않고 회사 디자인시스템으로 동작하는 업무 화면을 만들었습니다.

---

## 부록 — 용어 1줄 사전

| 용어 | 뜻 |
|---|---|
| 디자인시스템(DS) | 회사 화면들이 같은 모습이 되도록 만든 공용 부품 세트 |
| 컴포넌트 | 버튼·입력칸·표 같은 미리 만들어진 화면 부품 |
| dev server | 코드를 저장하면 즉시 브라우저 화면으로 바꿔주는 프로그램 (검은 창) |
| 렌더 | 코드가 실제 화면 그림으로 그려지는 것 |
| prop | 부품에 거는 옵션 (`variant="primary"` = "파란 버튼으로") |
| placeholder | 입력칸이 비었을 때 보이는 회색 안내 문구 |
| `Ctrl+S` | 저장 — 이 작업에서 가장 자주 쓰는 키 |
