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

- [ ] 테스트 PC에 이 repo가 받아져 있고 `pnpm install` + `pnpm build`가 끝난 상태 — **아무것도 없는 새 PC라면 부록 B 하나로 전부 해결** (repo 받기 → Node.js → pnpm → 부품 설치·조립 → VS Code → 바로가기 생성)
- [ ] `pnpm -F web-sandbox dev`가 정상 기동되는지 1회 확인 (repo **최상위 폴더**에서, `web-sandbox`는 **띄어쓰기 없이** 한 덩어리 — `web -sandbox`로 끊어 치면 `No "dev" script` 에러)
- [ ] repo 최상위의 **`setup-desktop.bat` 더블클릭 1회** → 바탕화면에 "DS 화면 시작"(sandbox)·"DS 카탈로그 보기"(Storybook) 바로가기 자동 생성 (바로가기는 git에 안 담기므로 PC마다 1회 필요)
- [ ] **바로가기를 1회 미리 실행**해 SmartScreen·방화벽 허용 팝업을 먼저 통과시켜 둠 (테스터가 첫 화면부터 보안 경고를 만나지 않게)
- [ ] VS Code 설치 + **바탕화면에서 repo 폴더로 들어가는 입구** 마련 — repo 폴더 우클릭 → [보내기 → 바탕 화면에 바로 가기 만들기] (부록 B의 ZIP 경로처럼 폴더 자체가 이미 바탕화면에 있으면 불필요) + **repo 폴더를 VS Code로 1회 열어 신뢰(Trust) 팝업에 Yes 해둠**
- [ ] **인계 직전: 이 문서를 브라우저(GitHub)로 띄워둔 채 넘긴다** — `github.com/ohjihoon05/design_system` → `docs/tester-kit/MANUAL_WALKTHROUGH.md`. **왜?** 테스터의 첫 작업이 §1의 "복사 버튼으로 코드 복사"인데, 그 버튼은 GitHub처럼 문서가 *그려진* 화면에만 있다. 메모장·VS Code 편집창(원문)으로 열어주면 버튼이 없어서 드래그로 긁다가 ` ``` ` 기호까지 복사돼 첫 단계부터 깨진다. (인터넷이 안 되면 차선: VS Code에서 열고 `Ctrl+Shift+V` 미리보기 — 단, 코드 상자에 마우스를 올려 복사 아이콘이 뜨는지 먼저 확인)
- [ ] `apps/web-sandbox/src/MyScreen.tsx`가 **없는** 상태인지 확인 (있으면 삭제 — 테스터가 직접 만들어야 함)
- [ ] 끝난 뒤 원복: `git checkout apps/web-sandbox/src/main.tsx` + `MyScreen.tsx` 삭제 (ZIP으로 받은 PC라 git이 없으면 **부록 B-8**의 원본 블록으로 재교체)

---

## §0. 화면 띄우기 (더블클릭 1번)

1. 바탕화면의 **"DS 화면 시작"** 아이콘을 더블클릭합니다.
   - 파란 보안 경고("PC를 보호했습니다")나 방화벽 허용 창이 뜨면 **정상입니다** — [추가 정보 → 실행] / [액세스 허용]을 누르세요.
2. 검은 창이 하나 뜹니다. **이 창은 닫지 말고 그대로 두세요.** (이게 *dev server* — 코드를 화면으로 바꿔주는 프로그램입니다. 작업 내내 켜져 있어야 합니다.)
   - 이 PC에서 **처음 실행**이라면 부품 조립(빌드) 때문에 글자가 한참 올라가며 **1~2분 걸릴 수 있습니다** — 정상입니다.
3. 잠시 뒤 브라우저가 자동으로 열리고 버튼·입력칸들이 진열된 화면이 보입니다.

> 브라우저가 안 열리면: 직접 브라우저 주소창에 `localhost:5174` 를 입력하세요.

여기까지 됐으면 준비 끝입니다.

---

## §1. 내 화면 파일 만들기

이제 코드 편집 프로그램(VS Code)에서 파일 하나를 새로 만듭니다.

1. 바탕화면의 **repo 폴더**(또는 그 바로가기)를 우클릭 → **"Code(으)로 열기"**.
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
| 검은 창에 **`Failed to resolve entry for package "@wonik/web"`** | 부품이 설치만 되고 조립(빌드)이 안 된 것. repo 최상위 폴더에서 명령 창을 열어 `pnpm build` 한 번 실행(부록 B-5의 5번) 후 "DS 화면 시작"을 다시 더블클릭 |
| 직접 명령을 치다가 **`None of the selected packages has a "dev" script`** (`ERR_PNPM_RECURSIVE_RUN_NO_SCRIPT`) | 패키지 이름이 중간에 끊긴 것 — `web-sandbox`는 **띄어쓰기 없이** 한 덩어리입니다. repo 최상위에서 `pnpm -F web-sandbox dev` 를 그대로 복붙하세요 (테스터는 이 명령 대신 "DS 화면 시작" 더블클릭이면 충분) |
| 검은 창에 **`'pnpm'은(는) 내부 또는 외부 명령... 인식되지 않습니다`** (PowerShell이면 `'pnpm' 용어가 ... 인식되지 않습니다`, 영어면 `'pnpm' is not recognized`) | 이 PC에 도구가 설치돼 있지 않은 것 — 코드 문제가 아닙니다. **부록 B의 B-2~B-5**를 따라 하면 해결됩니다 |
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

## 부록 A — 용어 1줄 사전

| 용어 | 뜻 |
|---|---|
| repo(저장소) | 이 프로젝트의 코드·문서가 전부 든 폴더 하나. 원본은 GitHub 사이트에 보관 (부록 B-1) |
| 디자인시스템(DS) | 회사 화면들이 같은 모습이 되도록 만든 공용 부품 세트 |
| 컴포넌트 | 버튼·입력칸·표 같은 미리 만들어진 화면 부품 |
| dev server | 코드를 저장하면 즉시 브라우저 화면으로 바꿔주는 프로그램 (검은 창) |
| 렌더 | 코드가 실제 화면 그림으로 그려지는 것 |
| prop | 부품에 거는 옵션 (`variant="primary"` = "파란 버튼으로") |
| placeholder | 입력칸이 비었을 때 보이는 회색 안내 문구 |
| Node.js | 브라우저 밖에서 코드를 돌려주는 기반 프로그램 — dev server가 이 위에서 돕니다 (부록 B) |
| pnpm | 화면 부품(라이브러리)들을 인터넷에서 내려받아 설치해주는 관리자 프로그램 (부록 B) |
| `Ctrl+S` | 저장 — 이 작업에서 가장 자주 쓰는 키 |

---

## 부록 B — 아무것도 없는 PC를 처음부터 준비하기

> 이 부록은 **repo 폴더도, 프로그램도 아무것도 없는 새 PC**를 §0 직전 상태까지 만드는 절차입니다. 원래 메인테이너가 미리 해두는 일이지만, 아무것도 모른다는 가정으로 적었으니 누구든 따라 할 수 있습니다. **인터넷 연결**이 필요하고, 전부 합쳐 30~40분쯤 걸립니다. **B-1부터 순서대로** 하세요.
>
> 큰 그림: **① 프로젝트 폴더(repo) 받기 → ② Node.js(기반 프로그램) → ③ 검은 창 확인 → ④ pnpm(부품 설치 관리자) → ⑤ 부품 내려받기 → ⑥ VS Code(코드 편집기) → ⑦ 바탕화면 바로가기**.

### B-1. 프로젝트 폴더(repo) 받기

> 💬 **repo** = 이 프로젝트의 코드·문서가 전부 든 폴더 하나. 원본이 GitHub라는 사이트에 보관돼 있어서, 거기서 통째로 내려받습니다.

1. 브라우저 주소창에 다음을 입력해 접속합니다:

   ```
   github.com/ohjihoon05/design_system
   ```

   - 로그인 화면이 나오면 메인테이너에게 안내받은 계정으로 로그인하세요.
2. 화면의 초록색 **[<> Code]** 버튼을 누르고, 펼쳐진 메뉴 **맨 아래 [Download ZIP]** 을 누릅니다.
3. 다운로드 폴더에 생긴 `design_system-main.zip` 을 우클릭 → **[압축 풀기]** → [압축 풀기] 버튼.
4. 풀려서 나온 **`design_system-main` 폴더를 통째로 바탕화면으로 드래그해 옮깁니다.** 이 폴더가 이 문서에서 말하는 **"repo 폴더"**입니다. (폴더 이름은 그대로 둬도 됩니다.)

> git을 다룰 줄 아는 메인테이너라면 ZIP 대신 `git clone https://github.com/ohjihoon05/design_system.git` 이 낫습니다 — 끝난 뒤 원복(`git checkout`)과 업데이트(`git pull`)가 명령 한 줄이 됩니다. ZIP으로 받았다면 원복은 **B-8**.

### B-2. Node.js 설치 (기반 프로그램)

1. 브라우저 주소창에 다음을 입력해 접속합니다:

   ```
   nodejs.org/ko
   ```

2. **"LTS"** 라고 적힌 큰 다운로드 버튼을 누릅니다. (LTS = 안정 버전이라는 뜻. 버전 숫자는 22든 24든 상관없습니다. 페이지에 명령어 목록이 보이면 무시하고, **"Windows 설치 프로그램(.msi)"** 링크를 찾아 누르세요.)
3. 받아진 파일(`node-v22... .msi` 같은 이름)을 더블클릭합니다.
4. 설치 창이 뜨면 **아무것도 바꾸지 말고 [Next]만 계속** 누르다가 [Install] → 파란 관리자 권한 창이 뜨면 [예] → [Finish].
   - 중간에 "Tools for Native Modules" 체크박스가 나와도 **체크하지 말고** 그냥 [Next].

### B-3. 명령 창 열고 확인 (cmd / PowerShell 아무거나)

명령을 입력하는 창은 두 종류가 있습니다 — **명령 프롬프트(cmd, 검은 창)** 와 **PowerShell(파워셸, 파란 창)**. **둘 중 아무거나** 쓰면 되고, 이 문서의 명령은 두 창에서 똑같이 동작합니다. (어느 쪽인지 모르겠으면 cmd를 쓰세요 — 함정이 하나 적습니다.)

1. 창을 엽니다 — 반드시 B-2 설치가 **끝난 뒤에 새로 연** 창이어야 합니다. (설치 전부터 열려 있던 창은 새 프로그램을 모릅니다 — 닫고 다시 여세요.)
   - **cmd로**: 키보드의 **윈도우 키(⊞)** → `cmd` 입력 → `Enter`.
   - **PowerShell로**: 윈도우 키(⊞) → `powershell` 입력 → `Enter`. (화면 아래 시작 버튼을 **우클릭 → [터미널]** 로 열리는 것도 같은 PowerShell입니다.)
2. 창에 아래를 복사해 붙여넣고(`Ctrl+V`) `Enter`:

   ```
   node -v
   ```

3. `v22.16.0` 처럼 **v + 숫자**가 나오면 성공입니다. "인식되지 않습니다"가 나오면 B-2가 안 끝난 것 — 설치 창을 다시 확인하세요.

> ⚠️ **PowerShell을 골랐을 때만** 다음 단계(B-4)부터 이런 빨간 에러가 날 수 있습니다: `이 시스템에서 스크립트를 실행할 수 없으므로 ... 로드할 수 없습니다`. PC의 보안 설정이 원인이고, 가장 쉬운 해결은 **창을 cmd로 바꿔 진행**하는 것입니다. 굳이 PowerShell을 계속 쓰려면 아래 한 줄을 붙여넣어 실행하고(`Y` 입력 → `Enter`) 하던 명령을 다시 하세요:
>
> ```
> Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
> ```

### B-4. pnpm 설치

1. 같은 명령 창에 아래 **한 줄을 통째로** 복사해 붙여넣고 `Enter`:

   ```
   npm install -g pnpm@10.33.2
   ```

   (npm은 Node.js를 깔면 같이 들어오는 기본 설치 도구입니다. 이 명령이 pnpm을 받아옵니다. 글자들이 좀 올라가다 멈추면 끝난 것.)
2. 확인 — 아래를 붙여넣고 `Enter`:

   ```
   pnpm -v
   ```

   `10.33.2` 가 나오면 성공입니다.

### B-5. 화면 부품 내려받기 (repo 안에서 1회)

1. **B-1에서 바탕화면에 둔 repo 폴더**를 더블클릭해 폴더 창(탐색기)을 엽니다.
2. 그 폴더 위치에서 명령 창을 엽니다 — 둘 중 하나:
   - **cmd로**: 폴더 창 **위쪽 주소창**(폴더 경로가 적힌 칸)을 클릭해 글자를 지우고 `cmd` 라고 친 뒤 `Enter`.
   - **PowerShell로**: 같은 주소창에 `powershell` 이라고 친 뒤 `Enter`. (또는 폴더 안 빈 곳을 우클릭 → **[터미널에서 열기]** — 메뉴에 없으면 [추가 옵션 표시] 안에 있습니다.)
3. 아래를 붙여넣고 `Enter`:

   ```
   pnpm install
   ```

4. 부품 수백 개를 내려받느라 **몇 분간 진행 표시가 움직입니다 — 정상입니다.** 에러 없이 멈추고 다시 입력 줄(`C:\...>` 또는 `PS C:\...>`)이 나오면 끝.
5. 같은 창에 이어서 아래를 붙여넣고 `Enter` — 내려받은 부품을 한 번 **조립(빌드)** 합니다 (1~2분):

   ```
   pnpm build
   ```

   (이걸 건너뛰면 나중에 화면 대신 `Failed to resolve entry for package "@wonik/web"` 라는 에러를 만나게 됩니다.)
6. 끝나면 이 명령 창은 닫아도 됩니다. 이어서 **B-6**.

### B-6. VS Code 설치 (코드 편집기)

1. 브라우저 주소창에 입력해 접속합니다:

   ```
   code.visualstudio.com
   ```

2. 파란 **[Download for Windows]** 버튼을 누르고, 받아진 파일(`VSCodeUserSetup-... .exe`)을 더블클릭합니다.
3. "동의합니다"를 선택하고 [다음]을 계속 누르되, **"추가 작업 선택" 화면에서 "Code(으)로 열기" 라고 적힌 체크박스 2개를 꼭 체크**하세요 — §1에서 쓰는 우클릭 메뉴가 이때 생깁니다.
4. [설치] → [종료]. (메뉴가 영어로 떠도 이 문서를 따라 하는 데 지장 없습니다.)

### B-7. 바탕화면 바로가기 + 최종 점검

1. repo 폴더를 열고 맨 위(최상위)에 있는 **`setup-desktop.bat`** 을 더블클릭합니다. 검은 창에 `OK: DS 화면 시작` 두 줄이 찍히고, 바탕화면에 **"DS 화면 시작"**·**"DS 카탈로그 보기"** 아이콘 2개가 생깁니다. (아무 키나 누르면 창이 닫힙니다.)
   - 수동으로 만들고 싶다면: `apps` → `web-sandbox` 의 `start-sandbox.bat` 우클릭 → (없으면 [추가 옵션 표시]) → [보내기] → [바탕 화면에 바로 가기 만들기] → 이름 바꾸기.
2. 바탕화면의 **"DS 화면 시작"을 한 번 더블클릭해 봅니다** — 파란 보안 경고·방화벽 창이 뜨면 [추가 정보 → 실행] / [액세스 허용]. 잠시 뒤 브라우저에 버튼·입력칸 진열장 화면이 뜨면 **준비 완전히 끝**입니다. 검은 창을 닫고, 이 문서 맨 위 **§0부터** 시작하세요.

### B-8. (실험이 끝난 뒤) 원래대로 되돌리기 — ZIP으로 받은 경우

ZIP으로 받은 폴더에는 git이 없어 원복 명령(`git checkout`)을 쓸 수 없습니다. 대신:

1. `apps/web-sandbox/src/main.tsx` 를 열어 내용을 전부 지우고(§2와 같은 방법), 아래 **원본 블록**을 붙여넣고 저장합니다:

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
     </StrictMode>,
   );
   ```

2. `MyScreen.tsx` 를 우클릭 → 삭제. 브라우저에 진열장 화면이 다시 보이면 원복 끝.

> ⚠️ B-1~B-5 도중 빨간 글자로 `ERR_` 로 시작하는 **네트워크 에러**가 나오거나 다운로드 자체가 막히면, 사내망이 차단하고 있는 것입니다. 이건 문서로 못 푸는 **PC 환경 문제**라 규칙 2의 예외입니다 — 메인테이너에게 바로 알려주세요.
