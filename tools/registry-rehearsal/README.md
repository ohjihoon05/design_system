# registry 리허설 키트 (테스트 PC용)

깨끗한 Windows 테스트 PC에서 **"창고에 올리고 → 동료처럼 받아서 → 진짜 돌아가나"**
한 바퀴를 localhost로 리허설하는 키트. 집 PC의 workspace 링크에 가려 안 보이던
문제를 깨끗한 머신에서 드러내는 것이 목적.

- **구조**: 테스트 PC 안에서 전부 (창고·올리기·받기 모두 그 PC 혼자, localhost)
- **전제**: 인터넷 됨 (Verdaccio·react·@dnd-kit 등을 공용 npm에서 받음)
- **현재 패키지**: `@wonik/tokens@1.0.0` + `@wonik/web@1.0.0` (F28 닫힌 상태)

> 이건 **로컬 리허설**입니다. 회사 실제 구조(떨어진 창고 서버)는 이게 통과한 뒤
> "테스트 PC = 창고, 집에서 올림" 단계(Stage 2)로 갑니다.

---

## 순서 (이대로 더블클릭)

### 0. 테스트 PC에 repo 받기 (한 번)
명령창(터미널)에서:
```
git clone https://github.com/ohjihoon05/design_system.git
cd design_system\tools\registry-rehearsal
```
그 다음부터는 이 폴더의 `.bat`을 **번호 순서대로 더블클릭**.

### 1. `1-환경점검.bat`
Node(18+)·git·pnpm(10.x)이 깔려 있는지 확인.
- pnpm 없으면 → 명령창에 `corepack enable` 한 번 (이 repo가 pnpm 10.33.2 자동 지정).
- 셋 다 버전 숫자가 보이면 통과.

### 2. `2-창고띄우기.bat`
창고(Verdaccio)를 `http://127.0.0.1:14873/` 에 띄움.
- **이 창은 닫지 마세요.** 창고가 여기서 돌아갑니다.
- 브라우저로 `http://127.0.0.1:14873/` 열어보면 창고 화면이 보임.
- ⚠️ 반드시 `0.0.0.0:14873`로 띄웁니다 (그냥 `14873`이면 IPv6로만 잡혀 publish 실패 — 과거 F29 함정).

### 3. `3-빌드_올리기.bat` (새 명령창/탐색기에서)
2번 창고 창을 **켜둔 채로** 실행.
install → build → `tokens@1.0.0`·`web@1.0.0`을 창고에 publish.
- 끝나면 브라우저 `http://127.0.0.1:14873/` 에서 두 패키지가 보임.

### 4. `4-소비자테스트.bat`
repo **바깥** 폴더(`%USERPROFILE%\wonik-smoke-test`)로 작은 소비자 프로젝트를 복사한 뒤,
창고에서 `@wonik/web`·`@wonik/tokens`를 받아 실제로 import·렌더되는지 확인.
- `✅✅ 렌더까지 통과` 가 나오면 **사내 진짜 publish 준비 끝**.

---

## 잘 안 될 때

| 증상 | 해결 |
|---|---|
| `ECONNREFUSED` (3·4번) | 2번 창고 창이 켜져 있는지 확인 |
| `ENEEDAUTH` / 인증 에러 (3번, Stage 1 익명 키트) | Stage 1은 가짜 토큰으로 익명 publish 전제 — 3번 .bat이 `.npmrc`를 자동 생성하므로 보통 안 뜸. 뜨면 2번 창고 창이 켜져 있는지 확인 |
| `ENEEDAUTH` (Stage 3 인증 키트) | `npm adduser` 쓰지 말 것 (토큰을 `~/.npmrc`에 안 넣어줌). `stage3-2b-로그인.bat` 더블클릭 → `OK` 확인 후 `stage3-3` 재실행 |
| `404` / `NO_MATCHING_VERSION` (4번) | 3번(올리기)이 성공했는지 먼저 확인 |
| `@dnd-kit` 관련 에러 (4번) | 인터넷 연결 확인 (공용 npm에서 받아야 함) |
| 한글이 깨져 보임 | .bat은 UTF-8 + `chcp 65001` 기준. Windows 11이면 정상 |

---

## 이 키트가 만드는 런타임 산출물 (git에 안 올라감)
- `tools/registry-rehearsal/verdaccio-storage/` — 창고가 패키지를 저장하는 곳
- `%USERPROFILE%\wonik-smoke-test\` — 소비자 테스트 폴더 (repo 바깥)
- 루트 `.npmrc` — 3번 .bat이 생성 (gitignore됨, 토큰 git에 안 남음)
- `tools/registry-rehearsal/htpasswd` — Stage 3 인증 사용자 파일 (gitignore됨)

---

## Stage 3 — self-host production-readiness 검증 (인증부터)

Stage 1·2는 **익명**(아무나 publish) 상태로 검증함. production 가기 전 "진짜처럼" 검증하는 단계. 전부 테스트 PC(repo 있는 그 PC)에서.

### 3.1 인증(auth) — 로그인해야만 publish
1. 이전 창고(`2-창고띄우기` 창)가 켜져 있으면 그 창에서 **Ctrl+C**로 끄기.
2. **`stage3-1-인증창고-시작.bat`** 더블클릭 → storage 비우고 인증 창고 시작 (이 창 켜두기).
3. **`stage3-2-로그인없이-올리기.bat`** 더블클릭 → 익명 publish 시도.
   - **실패(`ENEEDAUTH`/401/403)면 정상** = 익명 차단 작동 ✅
4. **`stage3-2b-로그인.bat`** 더블클릭 → 창고에 계정(`deployer`) 생성 + 토큰을 `~/.npmrc`에 자동 저장 (대화형 입력 없음). **`OK`** 뜨면 성공.
5. **`stage3-3-로그인후-올리기.bat`** 더블클릭 → 이번엔 publish **성공**해야 정상 ✅

→ **3-2 막힘 + 3-3 성공 = 3.1 인증 통과.**

(다음: 3.2 publish-over-network = 회사 PC에서 authed로 올리기 · 3.3 dual-direction · 3.4 always-on 영속. 상세: `docs/ROADMAP_LAYER_B.md` § Stage 3.)
