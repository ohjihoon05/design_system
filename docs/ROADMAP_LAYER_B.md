# ROADMAP — Layer B (publish & adopt)

> **목적**: Layer B(사내 npm registry 배포 + host 채택)를 *어떤 순서로 진행하느냐*의 실행 runbook.
> 상위 한-페이지 상태표는 [`ROADMAP.md`](./ROADMAP.md) §▷ Layer B. 본 문서는 그 섹션의 **상세 실행본**.
> **최초 작성**: 2026-06-08.

---

## 0. 한 눈에 — 지금 어디인가

- **Layer A 마감 ✅** (atom 23 + 1 provisional, 14 trial 누적).
- **Layer B dry run ✅** — 집 Verdaccio(`localhost:14873`)로 8-step 전체 사이클 한 바퀴 (trial 12). 변경 표면 = **정확히 2곳**(`.npmrc` `@wonik:registry` + `publishConfig.registry`).
- **남은 본질 의존 = 사내 registry URL 한 가지.** 나머지는 집에서 검증 끝.
- ✅ **F28 mechanism 종결** (2026-06-08, 집) — config 옵션 + tokens·web 1.0.0 cutover 실행·검증(tokens patch → web 무변경). **publish(네트워크)만 사내에 남음.** ADR-035 채택.
- **진입 신호 수신 ✅ (2026-06-08)** "사내 진입 시작하자" → B1 진입. **단 현재 집 PC = 사내 registry 미접근** → 지금은 IT 협의 agenda + 집-prep 단계. URL/token/publish는 사내 PC.

---

## 1. 3개 버킷 — 무엇이 막혀 있고 무엇이 안 막혔나

### 🟢 끝났다 / 재료 (재사용만)
- 8-step publish & adopt 사이클 전체 (trial 12) — registry 셋업 · 첫 publish · host install · dual-direction patch 모두 입증.
- ADR-018 (registry 옵션 A/B/C, A=사내 npm 1순위) · ADR-019 (peer-only contract).
- `INSTALL.md` (host 설치 가이드) · `.npmrc.example` (형식 공유본).
- peer 자동 caret 갱신 (F27) · 변동 패키지만 publish skip (F25) · caret dual-direction (F26) — 전부 검증됨.

### ✅ 집에서 닫음 (2026-06-08, 진입 prep 완료)
- ✅ **F28 1순위 fix** — config 옵션 적용·실험 검증·commit. ADR-035 채택. (보완 = tokens 1.0 cutover, publish 시 §3.4)
- ✅ **version baseline** — A안(1.0.0 reset) 비준.
- ✅ **freshness/supply-chain audit** — 배포물 깨끗(@dnd-kit MIT만), dev-only vuln 3(미출시), drift patch/minor.
- ✅ **tokens 1.0 cutover** — tokens·web 1.0.0 + peer `^1.0.0` + changeset fold. build green·test 347·**F28 닫힘 검증(tokens patch→web 무변경)**. publish만 사내.

### 🔴 사내 진입 후만 가능 (gated)
- Step 0 사전 audit 5축 (token rotation / supply-chain / consumer 식별 / SSO scope / registry vendor confirm).
- 실제 registry URL + 사내 SSO token.
- 첫 진짜 publish · host product install 마이그레이션.
- T8c (`primaryDark.base` brand 결정 — design 협의 의존, Layer B와 별개지만 진입 시 동반 가능).
- Table atom 24 **organic** dogfood closure (사내 실제 화면 1자리).

---

## 2. Phase 구조 (순서대로)

```
B0 (집, 지금)  →  [진입 신호]  →  B1 (IT 협의)  →  B2 (첫 publish)  →  B3 (host 채택)  →  B4 (정착)
   F28 닫기                        audit 5축        URL 2곳 교체        install+dual         CI+온보딩
```

### Phase B0 — 진입 전 집에서 (home, 지금 실행 가능)

| # | 작업 | 산출물 | 완료 기준 |
|---|---|---|---|
| B0.1 | ✅ **검증+실험 (2026-06-08)** — `changeset status`: web 자체 changeset 전부 sub-major인데 major → peer 승격. + post-cutover 실험으로 옵션 false/true 격리 | 콘솔 로그 | ✅ 충족 |
| B0.2 | ✅ **F28 결정 + ADR + 1순위 fix** — ADR-035 채택 + config 옵션 적용·commit (2026-06-08) | ADR-035 · config.json | ✅ 완료 |
| B0.3 | ✅ **version baseline** — A안(1.0.0 reset) 비준 (2026-06-08) | §3.3 | ✅ 완료 |
| B0.4 | ✅ **tokens 1.0 cutover (2026-06-08, 집)** — tokens·web 1.0.0 + peer `^1.0.0` + changeset 10개 fold | build/test/proof green | ✅ 완료 |
| B0.5 | ✅ **freshness 점검 (2026-06-08)** — 배포물 깨끗(@dnd-kit MIT만), dev-only vuln 3(vitest/vite/esbuild, 미출시), drift 전부 patch/minor | audit 로그 | ✅ 완료 |

> B0는 사내 의존 0. **B0.1~B0.3·B0.5 완료**, B0.4는 cutover와 묶임.

### Phase B1 — 사내 진입 (gated: IT 협의)

| # | 작업 | 비고 |
|---|---|---|
| B1.1 | ✅ **진입 신호 수신 (2026-06-08)** — "사내 진입 시작하자" | 현재 집 PC = 사내 registry 미접근 → IT agenda + 집-prep 단계 |
| B1.2 | **Step 0 audit 5축** — (a) token rotation (b) **supply-chain ✅(집, 2026-06-08)** (c) consumer (d) SSO scope (e) registry vendor confirm | (b) 완료: 배포물=@dnd-kit MIT만. **a·c·d·e = IT 협의 필요** |
| B1.3 | **registry 옵션 reaffirm** — A(사내 npm) 1순위 유지 or B(GitHub Packages) fallback | ADR-018 |

### Phase B2 — 첫 진짜 publish (gated)

| # | 작업 | 명령 |
|---|---|---|
| B2.1 | URL 2곳 교체 | `.npmrc` `@wonik:registry` + `publishConfig.registry` (양 패키지) |
| B2.2 | **1.0.0 cutover** (changeset version 대신 §3.4 recipe) | §3.4 1~5: 수동 버전 set + changeset fold + build |
| B2.3 | publish | `pnpm changeset publish` → git tag (둘 다 1.0.0) |
| B2.4 | 검증 + **F28 종결 확인** | registry metadata + tokens patch로 web 무변경 재현(§3.4-7) |

### Phase B3 — host product 채택 (gated)

| # | 작업 | 비고 |
|---|---|---|
| B3.1 | host `.npmrc` 작성 (token은 환경변수) | `.npmrc.example` 복사 |
| B3.2 | `pnpm add @wonik/web @wonik/tokens` (둘 다 — peer-only) | ADR-019 |
| B3.3 | dual-direction 입증 | DS patch publish → host `pnpm update` 자동 흡수 |

### Phase B4 — 정착 (gated, 일부 선택)

| # | 작업 | 우선도 |
|---|---|---|
| B4.1 | consumer 온보딩 doc (사내 슬랙/위키) | 중 |
| B4.2 | (선택) CI 자동 publish (GitHub Actions + changeset/action) | 낮음 |
| B4.3 | Table atom 24 **organic** dogfood closure | 진입 첫 거리 |
| B4.4 | T8c `primaryDark.base` design 협의 closure | design 의존 |

---

## 3. F28 — mechanism 종결 (집 cutover 완료·검증, publish만 사내)

### 3.1 재진단 (2026-06-08, 코드+실측+실험 3중 확정)

증상: 누적 changeset 10건(web 선언 = minor 2 + patch 2, major 0)인데 `@wonik/web`이 **`2.0.0 → 3.0.0` (major)** 로 계산. 의도는 `2.1.0`.

**근본 원인 (실험으로 정정 — 초안과 다름)**:
- **1순위 = changesets 기본 옵션**: `onlyUpdatePeerDependentsWhenOutOfRange` 기본 `false` → peer 의존(tokens)이 bump되면 dependent(web)를 **range 무관 무조건 major**. 이게 진짜 driver.
- **부차 = 0.x caret 좁음**: tokens가 0.x인 한 minor(`0.4.0`)가 web `^0.3.0`을 벗어나, 옵션을 켜도 여전히 major. 그래서 옵션 + tokens 1.0이 **둘 다** 필요.
- **소거법 실측**(B0.1): web 자체 changeset 4건(전부 minor/patch)인데 web major → 출처 = tokens peer 승격.
- **post-cutover 실험**(임시 시뮬레이션, `git checkout`으로 복원):

| 시나리오 | tokens | web | 판정 |
|---|---|---|---|
| TEST 1: tokens 1.0.0 · web peer `^1.0.0` · in-range minor · **기본 config** | 1.1.0 | **2.0.0 (MAJOR)** | ❌ 옵션 false면 range 무관 승격 |
| TEST 2: 동일 + `onlyUpdate...: true` | 1.1.0 | **무변경** | ✅ F28 종결 |
| pre-cutover (tokens 0.x) + 옵션 true | 0.4.0 | **3.0.0 (MAJOR)** | 옵션만으론 0.x 무효 → tokens 1.0 필요 |

> **결론**: F28은 순수 버그가 아니라 (changesets 기본 옵션 false) × (peer 계약 ADR-019) × (tokens 0.x caret)의 상호작용. 의미상 틀린 동작도 아님(소비처 보호). ※ 초안의 "0.x caret이 방아쇠"는 부분 오판 — 실험이 **"옵션 false가 1순위"**로 정정. 메타인지 노트 [[Changesets major 점프 버그 (F28)]] · ADR-035 동기화됨.

### 3.2 결정 — config 옵션 + tokens 1.0 (둘 다, ADR-035 채택)

F28 종결 = **두 조치 AND** (실험 확정):

| 조치 | 무엇 | 역할 | 상태 |
|---|---|---|---|
| **(1) config 옵션** | `.changeset/config.json`에 `___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH: { onlyUpdatePeerDependentsWhenOutOfRange: true }` | **1순위** — peer가 range 벗어날 때만 web 승격 | ✅ **적용+commit (2026-06-08)** · 현재 0.x라 inert(검증됨) |
| **(2) tokens 1.0 cutover** | tokens `0.x→1.0.0` + web `→1.0.0` + web peer `^1.0.0` | **보완** — minor를 range 안에 가둬 (1)이 실효 | ✅ **집 cutover 완료·검증 (2026-06-08)** — publish만 사내 |

기각: peer `>=0.3.0` 완화(계약 느슨) · frontmatter/pin(매 cycle 재발) · web major 수용(버전 인플레). 상세 근거 = ADR-035.

> ⚠️ **왜 둘 다인가**: (1)만 → 0.x minor가 range 이탈해 여전히 major. (2)만 → 옵션 false라 range 무관 major. **AND라야 닫힘** (TEST 1/2/3 입증). 옵션은 experimental API라 changesets 업글 시 재검증 필요(freshness ritual).

### 3.3 version baseline — A안(1.0.0 reset) 비준됨 (2026-06-08)

현 committed `tokens@0.3.0`/`web@2.0.0`은 dry-run 잔재(실제 publish 0회). 사용자 비준 = **A안**: tokens·web 둘 다 `1.0.0`으로 깨끗하게 reset → "둘 다 stable 1.0 사내 첫 공개". 0 publish라 reset 비용 0. CHANGELOG는 1.0.0 항목으로 정리(dry-run 0.x/2.x 이력은 pre-release로 접음).

### 3.4 cutover recipe — ✅ 1~5 집에서 완료 (2026-06-08), 6만 사내

> ✅ **1~5단계 집에서 실행·검증 완료**: tokens·web 1.0.0 + peer `^1.0.0` + changeset 10개 fold + build green + web test 347 + **proof(tokens patch→web 무변경)**. 남은 건 **6(publish, 사내 PC)** + 7(publish 후 재확인)뿐. 아래는 실행 기록 + 사내 replay용.

URL 2곳 교체 후 — `changeset version`을 쓰지 **않고** 1.0.0 baseline을 수동 cutover (changeset version은 상대 bump라 1.0.0을 못 만듦):

1. `packages/tokens/package.json` version → `1.0.0`.
2. `packages/web/package.json` version → `1.0.0`, `peerDependencies["@wonik/tokens"]` → `^1.0.0`.
3. 각 `CHANGELOG.md` 맨 위에 `1.0.0` 항목 — "사내 첫 stable: Layer A 23 atoms + Figma 색 토큰 정합(ADR-021~025) + dark contrast fix. 0.x/2.x = dry-run, 미발행." (10 changeset 요지 fold).
4. `.changeset/*.md` 10개 삭제 (README.md·config.json 유지) — 1.0.0에 fold됨.
5. 검증: `pnpm changeset status` = "no changesets" / `pnpm -r build` / `pnpm -F @wonik/web test` (347 green) / 버전·peer 눈 확인.
6. publish: `pnpm changeset publish` → 둘 다 1.0.0 발행 + git tag.
7. **F28 종결 확인**: tokens patch changeset 1개 → `changeset version` → tokens만 1.0.1, web 무변경이면 닫힘 (TEST 2 재현).

---

## 4. 진입 신호 + 무기한 대기 (reference)

상세는 ROADMAP §🔄 사내 진입 freshness ritual. 요지만:
- **진입 신호** = 사용자 명시 alert("사내 환경 진입 시작"). 외부 이벤트 자동 감지 X. 신호 부재 시 Layer B는 default WAIT.
- **분기 ritual** = dep audit + React/Tailwind 호환 + dogfood 자리 재평가 + changeset staleness.
- **≥6개월 지연 fallback** = 새 host product 발굴 트랙 활성화 (Table organic 자리 집에서 만들기), changeset 보존, React major drift 시 ADR.

---

## 5. 완료 정의 — Layer B는 언제 "끝"인가

Layer B 완료 = 다음 4개가 참:
1. tokens + web가 **사내 registry에 진짜 publish**됨 (dry run 아님).
2. **최소 1개 host product**가 `@wonik` scope로 install해 렌더링됨.
3. **dual-direction** 입증 — DS 변경 → host `pnpm update`로 도달 (수 초).
4. F28이 **반복 없이 닫힘** — ✅ mechanism은 집 cutover로 닫힘·검증(2026-06-08, tokens patch→web 무변경); publish 후 최종 확정.

→ 그 다음은 Layer C(채택 확산 / consumer 다양화 / 거버넌스)지만 1단계 범위 밖 — 진짜 consumer 수요 누적 후 결정 (ADR-001 원칙).

---

## 📚 reference
- 상위 상태표: [`ROADMAP.md`](./ROADMAP.md) §▷ Layer B
- registry 결정: [`ADR.md`](./ADR.md) ADR-018 · peer 계약: ADR-019
- dry run 일지: [`dogfood-trial-12.md`](./dogfood-trial-12.md) (F24~F29, H21~H26)
- host 설치: [`INSTALL.md`](./INSTALL.md)
- F28 메타인지: `Knowledge-Gaps/Tooling/Changesets major 점프 버그 (F28).md`
