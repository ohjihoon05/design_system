# dogfood trial 14 — demo-tracker (사내 CRUD shape)

**날짜**: 2026-06-04
**host**: `apps/demo-tracker` — 사내 이슈/요청 트래커 (built-for-purpose dogfood 앱, synthetic host)
**목적**: @wonik/web 23 atom을 "프레젠테이션(ppt)·fab 모니터링(demo-fab-monitor)"이 아닌 **사내 CRUD shape**에서 처음 dogfood. Table atom 첫 사용 + 동결된 폼 후보(FormField/Select/RadioGroup/Tabs) gap을 host 코드로 실증.
**범위**: 엔티티 1개(Issue), 뷰 2개(목록 Table + 생성/수정 Modal 폼). 백엔드 0, in-memory state.

---

## 검증 결과

| 항목 | 결과 |
|------|------|
| `tsc -b` 타입체크 | ✅ 통과 (23 atom prop 사용 전부 정확) |
| `vite build` | ✅ 37 modules, 0 error, 228KB(gzip 71KB) |
| dev 렌더 (Playwright headless, localhost:5175) | ✅ 목록 + Modal 정상 렌더 |
| 콘솔 에러 | ✅ **0건** (`errors=[]`) |
| 실행 launcher | ✅ `run-demo-tracker.bat` + 바탕화면 바로가기 |

> browse(gstack) 데몬은 Windows에서 기동 실패 → storybook 워크스페이스의 Playwright(chromium)로 우회 스크린샷. 시각 검증 자체는 완료.

---

## 사용한 atom (12종 + 2 provider)

`Stack` · `Text` · `Button` · `Table` · `Badge` · `FilterChip` · `Modal`(+Body/Footer) · `Input` · `Textarea` · `Radio` · `Switch` · `Card` · `ThemeProvider` · `ToastProvider`/`useToast`.

### ✅ Table — atom 첫 dogfood (atom 24 closure 후보)

Phase 25 이후 **0회**였던 Table atom이 처음 host에서 사용됨. `Column<Issue>` API(`accessor: keyof | (row)=>`, `cell` renderer)로 ID/제목/카테고리/우선순위/상태/담당자/액션 7컬럼 구성. `zebra`·`caption`·`emptyMessage` 모두 동작. **마찰 0** — Column shape이 CRUD 목록에 충분했다.

> **정직성**: demo-tracker는 synthetic host(이 dogfood를 위해 내가 지은 앱)라, ppt 같은 organic product 사용보다 **약한 증거**다. ADR-030 기준 "first dogfood evidence 1곳"은 충족하나, 로드맵 Table note가 명시한 **"사내(in-company) dogfood 1자리"는 아님**. → **atom 24 = provisional closure**로 표기. 사내 organic 사용 도달 시 정식 승격.

---

## 발견 — frozen 후보 gap 실증 (host 코드가 증거)

`App.tsx`의 `[GAP-n]` 주석 = 동결 후보가 없어서 host가 우회/재구현한 지점.

| GAP | 후보 | host가 한 일 | 빈도 | 판정 |
|-----|------|-------------|------|------|
| **GAP-1** | **FormField** | label+control+error 묶음을 host가 로컬 `Field` 컴포넌트로 **재구현** | 5회 | shape-validated. CRUD 폼에 강한 needs |
| **GAP-2** | **Select** | native `<select>`를 토큰으로 손수 칠해 우회. wonik Input과 시각 불일치(브라우저 기본 chrome) | 3회 (카테고리/담당자/상태) | shape-validated. 시각 일관성 깨짐이 화면에 보임 |
| **GAP-3** | **RadioGroup** | `Radio` 3개를 `name` 공유 + label 수동 연결로 그룹화 | 1 그룹 | shape-validated (단 1자리) |
| **GAP-4** | **Badge tone** (신규) | Badge variant가 `neutral`/`primary` 2개뿐 → "높음"(우선순위)·"열림"(상태)을 둘 다 primary로 **과적재**. success/warning/danger tone 부재 | 2축 | **신규 finding** — 상태 표현에 의미색 필요 |

### Tabs — 갈증 없음 (동결 reaffirm 증거)

목록 필터(전체/열림/진행중/닫힘)를 `FilterChip` single-select로 구현. count 표시까지 자연스러워 **Tabs를 원하지 않았다**. ADR-031 retro의 "Tabs 재평가 trigger"에 대해, **이 CRUD shape에서는 FilterChip로 충분 → 동결 유지** 쪽 데이터 포인트.

---

## 정직성 — 자동 un-freeze 하지 않는 이유

demo-tracker는 **내가 gap을 알고 지은 synthetic 앱**이라 confirmation bias가 있다. 따라서:

- GAP-1/2/3은 "CRUD shape에서 gap이 **실재**한다"는 **shape-validation**이지, "organic 수요가 3회 모였다"는 evidence-driven trigger 충족이 **아니다**.
- 후보들은 **여전히 동결**. un-freeze 판단은 ppt/사내 같은 **organic host**에서 같은 gap이 반복될 때.
- GAP-4(Badge tone)만 신규 finding으로 등록 — 이건 synthetic 여부와 무관하게 atom API의 객관적 한계.

---

## 다음 후보

1. **사용자 라이브 dogfood** — `run-demo-tracker.bat` 더블클릭 → 직접 클릭하며 UX 마찰/버그 발견 (이번 검증은 렌더+콘솔 레벨).
2. **GAP-4 (Badge tone)** — 진짜 needs면 ADR + Badge `tone` prop(minor) 후보. 단 organic 1자리라 아직 보류.
3. demo-tracker를 **상시 dogfood host**로 유지 — 새 atom/토큰 변경 시 여기서 회귀 확인 (web-sandbox·storybook과 같은 역할).
