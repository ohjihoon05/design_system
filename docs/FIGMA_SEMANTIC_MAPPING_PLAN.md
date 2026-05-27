# Figma `Standardization 2.0` Semantic 토큰 매핑 계획

> 상태: **Phase 1·2 완료** (Phase 1 surfaces/text/borders → ADR-022·024, Phase 2 buttonTokens → ADR-023 + tableTokens → ADR-025). Phase 3(chrome bar)·4(장비 상태색)는 보류.
> 작성: 2026-05-20 · 갱신: 2026-05-21 · 선행: ADR-021 (Primitives 도입 완료)

## 1. 배경 & 목표

Figma "UI/UX Standardization 2.0" 파일에는 색 변수 컬렉션이 2개 있다:

| 컬렉션 | 모드 | 색 수 | 상태 |
|--------|------|-------|------|
| `Primitives` | Default (1) | 127 | ✅ 도입 완료 → `packages/tokens/src/primitives.ts` (ADR-021) |
| `Standardization 2.0` | Dark / Light (2) | 119 | ⏳ **본 계획서 대상** |

목표: `Standardization 2.0`의 semantic 색 119개를 `@wonik/web` 컴포넌트가 쓸 수 있는 형태로 디자인 시스템 토큰에 반영한다. semantic 토큰은 가능한 한 `primitives.*`를 참조해 2-tier(primitive → semantic) 구조를 완성한다.

## 2. Figma semantic 토큰 인벤토리 (119색)

`Standardization 2.0`은 **화면 영역/컴포넌트 기준**으로 묶여 있다:

| # | 카테고리 | 개수 | 내용 |
|---|----------|------|------|
| A | `button default/pressed/disabled` | 16 | 버튼 3-state × (bg, outline, image, image bg, text) + pressed/top |
| B | `table/*` | 25 | 테이블 bg·text·outline·title + 셀 상태(ready, manual, occupied, processed, oborted, empty, information) |
| C | `little table(outline)` (prefix 없음) | 1 | table/ 그룹 밖에 떨어진 중복-성격 토큰 |
| D | `tob bar/*` (top bar) | 27 | 상단바 — bg·icon·text × default/pressed/warning/user/monitor + record + signal R/Y/G |
| E | `buttom bar/*` (bottom bar) | 3 | 하단바 icon(default/pressed), bg |
| F | `menu bar/*` | 5 | 메뉴바 bg·text × default/pressed |
| G | `background` | 1 | 전역 배경 |
| H | 장비 상태색 (`Idle`·`Init`·`Ready`·`Run`·`Abort`·`Sleep`…`Sleep2`) | 41 | Fab 장비 process 상태별 **단일 fill 색**. Dark = Light 동일값. |

A~G(78개)는 UI 영역 토큰, H(41개)는 장비 상태 legend 색이다. H 안에 `Color1`~`Color10`·`Color3r`·`Color7r`·`None`(13개)은 의미 불명.

## 3. 기존 디자인 시스템 토큰 구조 (대조군)

`packages/tokens/src/theme-light.ts` / `theme-dark.ts`는 **역할(role) 기준**으로 묶여 있다:

| role 그룹 | 키 | 성격 |
|-----------|-----|------|
| `surfaces` | canvas, surface, surfaceSubtle, surfaceInset, surfaceMid, surfaceWhite, darkBase, darkHeader, darkHover | 배경 |
| `borders` | light, mid, dark, panelDark | 외곽선 |
| `primary` | base, pale, bg, stroke, selected | WONIK BLUE |
| `secondary` | base | WONIK GRAY |
| `text` | primary, secondary, dim, dark, onDark, onDarkVal, onDarkDim | 글자 |
| `statusTokens` | idle, init, ready, run, processEnd, accessReady, warning, alarm, abort, processed, ok | 상태 — 각 토큰이 **{bg, border, dot, text}** 구조 |
| `graphTokens` | limitUpper, limitLower, signal*, pass | 차트 색 |

## 4. 핵심 충돌 & 결정 필요 사항

> **이 섹션이 본 계획서의 핵심.** 구현 전에 아래 6가지를 정해야 한다.

### 충돌 1 — 구조 패러다임 (component-scoped ↔ role-scoped)

Figma는 `button/`·`table/`·`tob bar/`처럼 **컴포넌트 단위**, 디자인 시스템은 `surfaces`·`text`·`borders`처럼 **역할 단위**다. 1:1 매핑이 안 된다.

선택지:
- **(A) role 흡수** — 모든 Figma 토큰을 `surfaces`/`text`/`borders`/`statusTokens`로 분해. 깔끔하지만 컴포넌트별 미세 차이(같은 "배경"인데 hex가 조금씩 다름)가 사라짐.
- **(B) component-token layer 신설** — Figma 그룹을 그대로 component 토큰으로. 충실하지만 기존 role 토큰과 2중 체계.
- **(C) hybrid** ← **권장**. 명확히 role인 것(배경/글자/외곽선)은 role로 흡수, 진짜 컴포넌트 고유 상태(버튼 3-state, 테이블 셀 상태)는 component 토큰으로.

### 충돌 2 — 네이밍 오타

Figma 변수에 오타가 있다: `tob bar`(→ top bar), `buttom bar`(→ bottom bar), `table/oborted`(→ aborted).
→ **권장**: 코드에서는 교정한 이름(`topBar`/`bottomBar`/`aborted`)을 쓴다. Figma 변수명도 갱신 권장(디자인↔코드 일치).

### 충돌 3 — primary blue `#2b7fff` (ADR-007 위반)

semantic 토큰 다수가 `#2b7fff`를 active/primary 색으로 쓴다: `button pressed/*`, `tob bar/*(pressed)`·`(user)`·`circle`·`top`, `menu bar` 등. ADR-007은 `#2B7FFF`를 금지(Primary = WONIK BLUE `#273E82`).
→ **결정 완료** (2026-05-20): `#2b7fff` → `#273E82` 매핑. semantic 토큰은 `primitives.blue['500']`(= `#273E82`)을 참조한다.

### 충돌 4 — 장비 상태색(41) vs `statusTokens`(11)

Figma의 `Idle`/`Ready`/`Run`/`Abort`/`Sleep`… 41색은 **단일 fill**(Dark = Light 동일)이고, 디자인 시스템 `statusTokens`는 **{bg, border, dot, text} 구조**다. 성격이 다르다 — 전자는 Fab 장비 process 상태 legend, 후자는 UI 뱃지/알림 스타일.
→ **범위 질문**: CLAUDE.md ADR-001은 HMI form factor를 1단계 범위 밖으로 둔다. 이 41색은 HMI 장비 모니터링 색에 가까워 **1단계 범위 밖일 가능성**이 높다. 별도 도메인(`equipmentStateColors`)으로 두거나, 진짜 HMI product 등장 시로 보류하는 것을 권장.

### 충돌 5 — `Color1`~`Color10` / `None` (13개)

이름만으로 용도 식별 불가. `Color3`는 다른 변수의 alias.
→ **디자이너 확인 필요.** 확인 전까지 매핑 보류.

### 충돌 6 — Dark 모드 값 출처

현재 `theme-dark.ts`는 임시값(ppt의 slate 계열 + WONIK BLUE 조정)이라 주석에 "Refinable by designer later"라고 적혀 있다. Figma `Standardization 2.0`은 **실제 디자인된 Dark 값**을 갖고 있다.
→ Figma Dark 값이 `theme-dark.ts`를 **개선**하는 입력이 된다 (단순 추가가 아니라 기존 임시값 대체).

## 5. 권장 접근 — hybrid (충돌 1-C)

| 분류 | Figma 토큰 (예) | → 매핑 대상 | 비고 |
|------|----------------|-------------|------|
| 배경 | `table/bg`, `tob bar/bg(box)`, `menu bar/bg(default)`, `background` | `surfaces` 확장 | Light/Dark 양쪽. 중복 hex는 통합 |
| 글자/아이콘 | `*/text*`, `*/icon*` | `text` 확장 | default/pressed/warning 변형 검토 |
| 외곽선 | `*/outline`, `little table(outline)` | `borders` 확장 | |
| 버튼 상태 | `button default/pressed/disabled/*` | **component 토큰** 신설 (`buttonTokens`) | 3-state 고유 |
| 테이블 셀 상태 | `table/ready·manual·occupied·processed·oborted·empty` | **component 토큰** (`tableTokens`) 또는 `statusTokens` 확장 | {bg,text,outline} 구조 → statusTokens와 형태 유사 |
| signal R/Y/G | `tob bar/signal(r·y·g)` | `statusTokens` 또는 graph 재사용 검토 | |
| 장비 상태색 | `Idle`…`Sleep2` (41) | **보류** (충돌 4) | 범위 결정 후 |
| `Color1`~`None` | (13) | **보류** (충돌 5) | 디자이너 확인 후 |

semantic 값 대부분이 이미 `Primitives` hex와 일치(예: `button default/bg` Dark `#27272a` = `primitives.gray['900b']`)하므로, 구현 시 raw hex 대신 `primitives.*` 참조로 표현해 2-tier를 완성한다.

## 6. 단계별 실행 순서 (제안)

각 단계 = ADR 1개 + Changeset 1개 (CLAUDE.md 규칙).

| Phase | 내용 | 선행 | 상태 |
|-------|------|------|------|
| **0** | 본 계획서 리뷰 — 충돌 1·4·5 결정 | — | ✅ §8 |
| **1** | role 매핑: `surfaces`/`text`/`borders`를 Figma Light/Dark 값으로 확장·정합 + `theme-dark.ts` 임시값 대체 | Phase 0 | ✅ ADR-022·024 |
| **2** | component 토큰: `buttonTokens`(3-state), `tableTokens`(셀 상태) 신설 | Phase 1 | ✅ ADR-023·025 |
| **3** | chrome bar(`tob/buttom/menu bar`)·signal 잔여 토큰 | Phase 2 | ⏸ 보류 — 앱 셸 chrome, HMI 인접(ADR-001). consumer 컴포넌트 등장 시 |
| **4** | 장비 상태색 41개 — 범위 IN 결정 시에만 | 충돌 4 결정 | ⏸ 보류 (충돌 4·5) |

## 7. 미해결 질문 (디자이너/사용자 확인 필요)

1. ~~**충돌 1** — 구조 접근 A / B / C?~~ → **§8 결정: C (hybrid)**
2. ~~**충돌 4** — 장비 상태색 41개 범위?~~ → **§8 결정: 보류**
3. **충돌 5** — `Color1`~`Color10`·`None` 13개의 용도? → 장비 상태색 블록(H)에 포함 → 보류와 함께 묶임. 범위 IN 결정 시 디자이너 확인.
4. ~~**충돌 2** — 네이밍 오타 처리?~~ → **§8 결정: 코드에서 교정**

## 8. 결정 사항 (2026-05-20)

| 충돌 | 결정 | 영향 |
|------|------|------|
| 1 — 구조 패러다임 | **C (hybrid)** | 배경/글자/외곽선은 role 토큰 흡수, 버튼·테이블 상태는 component 토큰 |
| 2 — 네이밍 오타 | **코드에서 교정** | 코드 토큰은 `topBar`/`bottomBar`/`aborted`. Figma 파일은 추후 갱신 권장 |
| 3 — `#2b7fff` | (기결정) WONIK BLUE 매핑 | semantic은 `primitives.blue['500']`(`#273E82`) 참조 |
| 4 — 장비 상태색(41) | **보류** | HMI product 등장 시 결정 (ADR-001). 1단계는 UI 영역 토큰 78개에 집중 |
| 5 — `Color1`~`None` | 보류 | 충돌 4와 함께 묶임 |

### Phase 1 실행 메모

`theme-light.ts`는 검토 결과 **이미 Figma `Standardization 2.0` Light 값과 정합**돼 있다(`surface`=`table/bg` Light, `surfaceSubtle`=`table/title bg` Light 등). 따라서 Phase 1의 실질 작업은 임시값(ppt slate 계열)으로 채워진 **`theme-dark.ts`를 Figma Dark 디자인 값으로 교체**하는 것이다. 구현은 ADR-022 참조.

---

## 9. 2026-05-27 보류 점검 — Phase 3·4 trigger 도달 증거 발견

> "메뉴 점검" 의도로 시작한 가벼운 reaffirm 작업이 **결정 변경 후보로 격상**됨. 사용자가 Figma 노드 링크([241:6897](https://www.figma.com/design/NQn6za8JrkYNi8hJj3lvwM/UI-UX-Standardization-2.0?node-id=241-6897))를 제공해 직접 확인한 결과.

### 9.1 발견 — Fab 장비 모니터링 풀세트 화면

노드 241:6897(1920×1080)은 **WONIK IPS HMI Fab 장비 모니터링 화면 풀세트**. 스크린샷 reference: [`figma-references/fab-monitoring-241-6897.png`](./figma-references/fab-monitoring-241-6897.png).

화면 구성 — ADR-001에서 "1단계 외"로 보류한 HMI form factor 그 자체:

| 영역 | 내용 |
|---|---|
| 상단 top bar | WONIK IPS 로고 + 시계 + WARP/ADMIN + 8개 icon button (SCO WAFER/PLAYBACK/TERMINAL/MODE/SYSINIT/ALARM/BUZZER/ABORT) |
| 중앙 좌측 | 3D 챔버 도식 — PMC1/PMC2/PMC3/VTM1/UPC Fab 장비 layout |
| 중앙 우측 | Load Port Information + Wafer Mapping Information (25 wafer slot 색 코딩 — Empty/Occupied/Processed/Aborted) |
| 좌하단 Chamber State legend | Init / Ready / Run / Process End / Access Ready / Alarm / Abort — 장비 상태색 7개 |
| 우측 사이드바 | CTC / PM1 / PM2 / PM3 (menu bar pressed state) |
| 하단 bottom bar | CREATE/CONFIG/MANUAL/RECIPE/DATA LOG/UTILITY/MACRO/CALIBRATE |

### 9.2 보류 사유 재평가

| 충돌 | 5/20 결정 | 5/27 재평가 |
|---|---|---|
| 3 (chrome bar) trigger | "consumer 컴포넌트 등장 시" — 추상 미래 | **trigger 도달**. 디자이너가 chrome bar 풀세트 그렸음 = 구현 product 존재 |
| 4 (장비 상태색) | "HMI product 등장 시" | **trigger 도달**. Chamber State legend 7개 + Wafer Mapping 4상태 색이 한 화면에 |
| 5 (`Color1`~`None` 13개 의미 불명) | 디자이너 확인 필요 | **여전히 유효** — 본 화면에서는 사용 안 보임 |

### 9.3 사용 중인 미흡수 토큰 inventory (이 화면 기준)

`get_variable_defs` 결과에서 추출:

| 그룹 | 개수 | 상태 |
|---|---|---|
| `button default/*` + `button pressed/*` | 10 | ✅ ADR-023 흡수됨 |
| `table/*` + `little table(outline)` | 21 | ✅ ADR-025 흡수됨 |
| **`tob bar/*` (top bar)** | **16** | ⏳ 미흡수 (P3 대상) |
| **`menu bar/*`** | **4** | ⏳ 미흡수 (P3 대상) |
| **`buttom bar/bg`** | **1** | ⏳ 미흡수 (P3 대상) |
| **`background`** | **1** | ⏳ 미흡수 (P3 대상) |
| 장비 상태색 legend (Init/Ready/Run/Process End/Access Ready/Alarm/Abort) | 7+ | ⏳ 미흡수 (P4 부분) |
| Wafer Mapping 4상태 색 (Empty/Occupied/Processed/Aborted) | 일부 `table/*`와 중복 | ✅ 부분 흡수됨 |

`#2b7fff`(ADR-007 위반 hex)가 chrome bar pressed state에서 활발 사용 — `tob bar/icon(pressed)`, `text(pressed)`, `circle(pressed)`, `top(pressed)`, `user icon`, `button pressed/*` 등. 충돌 3 결정(→ WONIK BLUE 매핑)이 P3 도입 시 발효해야 함.

### 9.4 결정 — HMI는 나중 (보류 reaffirm), Table 컴포넌트는 별도 트랙(ADR-029)

사용자 결정(2026-05-27): **"HMI는 나중에 하기로 했다"** — ADR-001(1단계 = web only) reaffirm. 화면 241:6897이 HMI form factor라는 점은 명확해졌지만, 1단계 범위 확장은 안 함.

대신 사용자가 별도 제기한 요구: **"회사에서 grid/table 많이 사용한다 — 꼭 만들어야"**. 이건 HMI 영역이 아니라 **web/app 영역**에 해당 — "HMI는 이미지, web/app은 코드"라는 도메인 사실 위에. 그래서 Table 컴포넌트는 본 계획서(Figma 정합 트랙)와 *분리된 별도 트랙*으로 ADR-029에서 다룸. Phase 25 Table atom 추가 결정.

| 영역 | 결정 |
|---|---|
| Phase 3 chrome bar (top/menu/bottom bar) | ⏸ **보류 reaffirm** — HMI 영역, 우리 React 컴포넌트 안 들어감 (HMI는 이미지 베이스) |
| Phase 4 장비 상태색 (Idle~Sleep2 41색) | ⏸ **보류 reaffirm** — 동상 |
| Phase 5 `Color1`~`None` 13개 | ⏸ 보류 — 디자이너 확인 필요 (충돌 5 유효) |
| Table 컴포넌트 (`<Table>`) | 🟢 **Phase 25 신규 atom — ADR-029 (별도 트랙)** — web/app 영역, 사내 단순 조회 use case |

### 9.5 트리거 도달 점검 — *해소된 상태*

5/27 점검 시점에 "trigger 도달했나?"라는 질문이 일시 발생했으나, 사용자 결정으로 트리거의 의미가 갈라짐:

| Phase 3·4 trigger ("consumer 컴포넌트 등장") | Table trigger ("회사에서 많이 쓴다") |
|---|---|
| HMI 화면 자체는 디자인 존재 (241:6897) | web/app 영역의 단순 조회 table은 사내 다수 |
| 그러나 우리 React 컴포넌트는 HMI에 못 들어감 | React 컴포넌트가 직접 들어감 |
| 토큰만 가져갈 수는 있으나 채택 의향 unknown → **보류 reaffirm** | 채택 강도 강함 (사용자 명시 "꼭 만들어야") → **Phase 25 atom 추가** |

### 9.6 결과 — 5/27 점검 결론

1. **Phase 3·4 보류 reaffirm** — HMI 영역, 1단계 범위 외 (ADR-001 유지)
2. **Table 컴포넌트는 Phase 25 신규 atom** — Figma 정합 트랙이 아닌 Layer A 컴포넌트 트랙. ADR-029 참조. `tableTokens`(ADR-025) 이미 있음 → Table atom이 그걸 흡수
3. **사내 진입 시 fact-finding** (Table evidence 자리 식별):
   - 사내 product 중 단순 조회 table 자리 1~2개 sample 수집
   - dogfood 첫 자리 결정
   - 코드 작성(~50줄) + changeset minor + atom 24 도달
