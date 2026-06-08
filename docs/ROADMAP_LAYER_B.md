# ROADMAP — Layer B (publish & adopt)

> **목적**: Layer B(사내 npm registry 배포 + host 채택)를 *어떤 순서로 진행하느냐*의 실행 runbook.
> 상위 한-페이지 상태표는 [`ROADMAP.md`](./ROADMAP.md) §▷ Layer B. 본 문서는 그 섹션의 **상세 실행본**.
> **최초 작성**: 2026-06-08.

---

## 0. 한 눈에 — 지금 어디인가

- **Layer A 마감 ✅** (atom 23 + 1 provisional, 14 trial 누적).
- **Layer B dry run ✅** — 집 Verdaccio(`localhost:14873`)로 8-step 전체 사이클 한 바퀴 (trial 12). 변경 표면 = **정확히 2곳**(`.npmrc` `@wonik:registry` + `publishConfig.registry`).
- **남은 본질 의존 = 사내 registry URL 한 가지.** 나머지는 집에서 검증 끝.
- **단 진입 전 집에서 닫아야 할 것 1개 = F28** (아래 §3). 이게 이 로드맵의 가장 중요한 home 관문.
- **진입 신호 대기** — 사용자가 "사내 환경 진입 시작"이라고 명시 alert할 때까지 Layer B 실행/push는 default WAIT (work_environment_split). 본 문서 *작성*은 집에서 가능.

---

## 1. 3개 버킷 — 무엇이 막혀 있고 무엇이 안 막혔나

### 🟢 끝났다 / 재료 (재사용만)
- 8-step publish & adopt 사이클 전체 (trial 12) — registry 셋업 · 첫 publish · host install · dual-direction patch 모두 입증.
- ADR-018 (registry 옵션 A/B/C, A=사내 npm 1순위) · ADR-019 (peer-only contract).
- `INSTALL.md` (host 설치 가이드) · `.npmrc.example` (형식 공유본).
- peer 자동 caret 갱신 (F27) · 변동 패키지만 publish skip (F25) · caret dual-direction (F26) — 전부 검증됨.

### ⚠️ 집에서 지금 가능 (진입 전 닫을 것 — NOW)
- **F28 근본 진단 + 결정** (§3) — tokens 1.0 승격 vs 땜질. **ADR 신설 대상.** ← 최우선
- **version baseline 결정** — 현 committed `tokens@0.3.0`/`web@2.0.0`은 dry-run 잔재(실제 registry publish 0회). 첫 진짜 publish 숫자를 reset할지 이어갈지 (§3.3).
- **changeset 정리** — 누적 10건 frontmatter 점검 + `pnpm changeset status` green 확인.
- **freshness ritual 한 바퀴** — `pnpm audit` + `pnpm outdated` (ROADMAP §🔄).

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
| B0.1 | ✅ **검증 완료 (2026-06-08)** — `changeset status --verbose`: web 자체 changeset 4개 전부 minor/patch인데 web `3.0.0`(major) 계산 → 소거법으로 tokens peer 승격 확정 | 콘솔 로그 | ✅ 충족 |
| B0.2 | **F28 결정 + ADR 신설** — §3 4옵션 중 택 (추천 A: tokens 1.0 승격) | ADR-035(가칭) | 결정 + 근거 기록 |
| B0.3 | **version baseline 결정** — dry-run 잔재 reset vs 이어가기 (§3.3) | ROADMAP 1줄 | 첫 publish 숫자 확정 |
| B0.4 | **changeset 정리** — 10건 frontmatter를 결정에 맞게 정정, `changeset status` green | green status | 의도 버전과 계산 버전 일치 |
| B0.5 | **freshness 점검** — dep audit + React/Tailwind drift | 체크리스트 | high severity 0 또는 기록 |

> B0는 사내 의존 0. 지금 바로 가능. **B0.1→B0.2가 이 로드맵의 심장.**

### Phase B1 — 사내 진입 (gated: IT 협의)

| # | 작업 | 비고 |
|---|---|---|
| B1.1 | **진입 신호 수신** — 사용자 명시 alert | 이전엔 push/실행 금지 |
| B1.2 | **Step 0 audit 5축** — (a) token rotation 정책 (b) supply-chain(dep+license) (c) consumer 식별·권한 분리 (d) SSO scope (e) **registry vendor confirm** | Verdaccio≠사내일 수 있음 (Nexus/Artifactory면 auth/TLS/proxy 차이) |
| B1.3 | **registry 옵션 reaffirm** — A(사내 npm) 1순위 유지 or B(GitHub Packages) fallback | ADR-018 |

### Phase B2 — 첫 진짜 publish (gated)

| # | 작업 | 명령 |
|---|---|---|
| B2.1 | URL 2곳 교체 | `.npmrc` `@wonik:registry` + `publishConfig.registry` (양 패키지) |
| B2.2 | 버전 계산 + 빌드 | `pnpm changeset version` → `pnpm -r build` |
| B2.3 | publish | `pnpm changeset publish` → git tag |
| B2.4 | 검증 | registry에 tokens + web metadata 확인 (peer range 정합) |

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

## 3. F28 — 진입 전 닫을 가장 중요한 관문 (집)

### 3.1 재진단 (2026-06-08, config 대조로 확정)

증상: 누적 changeset 10건(web 선언 = minor 2 + patch 2, major 0)인데 `@wonik/web`이 **`2.0.0 → 3.0.0` (major)** 로 계산. 의도는 `2.1.0`.

**근본 원인 (코드 증거로 확정)**:
- `.changeset/config.json` → `onlyUpdatePeerDependentsWhenOutOfRange` 키 **없음 = 기본 false** (peer 의존이 바뀌면 dependent를 *무조건* major).
- `@wonik/web`의 `peerDependencies["@wonik/tokens"] = "^0.3.0"`. tokens는 `0.3.0 → 0.4.0` (minor) 예정.
- **0.x caret 함정**: `^0.3.0`은 `>=0.3.0 <0.4.0`이라 폭이 좁다. tokens minor 한 번이면 범위를 벗어남 → changesets가 "web의 peer 계약이 깨지는 변경"으로 판정 → web에 **major 강제**.
- **실측 확정 (2026-06-08, B0.1 게이트)**: `pnpm changeset status --verbose` → web 자체 changeset 4건(phase-25-table=minor · a11y-detection=patch · publishconfig=patch · sortable-announce=minor)이 전부 sub-major인데도 web이 `3.0.0`(major)로 계산. 실수로 박힌 major 0건 → 소거법으로 major 출처 = **tokens peer 승격 확정**. config엔 `onlyUpdatePeerDependentsWhenOutOfRange` 키 없음(기본 false)도 확인.

> **결론: F28은 순수 changesets 버그가 아니다.** (peer-only 계약 ADR-019) × (tokens가 아직 0.x) × (0.x caret 좁음)의 **구조적 상호작용**. 심지어 의미상 *틀린 동작도 아님* — tokens 0.4.0을 요구하는 web을 0.3.x에 묶인 소비처에 주면 실제로 깨지므로, major 강제는 소비처 보호 측면에선 정합. → 메타인지 노트 [[Changesets major 점프 버그 (F28)]]의 가설을 코드로 확정 + 한 단계 심화.

### 3.2 결정 옵션 4개

| 옵션 | 무엇을 | 효과 | 비용 | 평가 |
|---|---|---|---|---|
| **A. tokens 1.0.0 승격** | tokens `0.x→1.0.0`, web peer `^1.0.0` | tokens minor(1.0→1.1)가 `^1.0.0` 안에 머묾 → web peer 안 깨짐 → **major 강제 영구 소멸** | ADR 1개 + "tokens 안정 선언" 의미 부여 | ⭐ **추천 — 근본 해결** |
| B. peer 범위 완화 (`>=0.3.0`) | web peer를 caret→하한 범위 | major 강제 회피 | 계약 느슨 — tokens breaking도 통과시켜 소비처 보호 약화 | △ 차선 |
| C. frontmatter 정정 / version pin | 이번 publish만 `2.1.0` 강제 | 1회 회피 | **매 publish cycle 재발** (tokens minor마다) | ✗ 땜질 |
| D. 받아들임 (web major) | web `3.0.0` 그대로 publish | 즉시 진행 | tokens minor마다 web major → 버전 인플레, DS 신뢰 ↓ | ✗ DS 부적합 |

**추천: A (tokens 1.0.0 승격).** 근거 — tokens는 Figma 정합(ADR-021~025)까지 흡수해 *재료 창고로 안정화* 선언이 정당하고, A만이 F28을 **반복 없이 닫는다**. B/C/D는 모두 churn 또는 의미 손상을 남김.

**단 실행 전 게이트**: B0.1(`changeset status --verbose`)로 major 출처가 tokens peer임을 *눈으로 확인*한 뒤 A 확정. (가짜 안심 금지 — config 추론은 강하지만 실측 1회로 못박는다.)

### 3.3 곁가지 — version baseline

현 committed `tokens@0.3.0`/`web@2.0.0`은 dry-run `changeset version` 잔재로, **실제 registry publish는 0회**. 소비처가 이 숫자에 의존하는 일이 없으므로 첫 진짜 publish의 baseline은 자유롭게 정할 수 있다.

- **옵션 A에 묶어서**: tokens를 `1.0.0`으로 올리는 김에 web도 깨끗한 baseline(`1.0.0`)로 reset → "둘 다 stable 1.0으로 사내 첫 공개"라는 일관된 서사. *0 publish라 reset 비용 없음.*
- **반론**: trial 12 CHANGELOG 이력 보존(진짜 변경 일지). → CHANGELOG는 유지하되 version만 reset 가능 (changeset이 충돌 시 수동 정리).
- **결정은 B0.3에서** A 확정과 동시에.

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
4. F28이 **반복 없이 닫힘** (tokens minor가 더는 web major를 강제하지 않음).

→ 그 다음은 Layer C(채택 확산 / consumer 다양화 / 거버넌스)지만 1단계 범위 밖 — 진짜 consumer 수요 누적 후 결정 (ADR-001 원칙).

---

## 📚 reference
- 상위 상태표: [`ROADMAP.md`](./ROADMAP.md) §▷ Layer B
- registry 결정: [`ADR.md`](./ADR.md) ADR-018 · peer 계약: ADR-019
- dry run 일지: [`dogfood-trial-12.md`](./dogfood-trial-12.md) (F24~F29, H21~H26)
- host 설치: [`INSTALL.md`](./INSTALL.md)
- F28 메타인지: `Knowledge-Gaps/Tooling/Changesets major 점프 버그 (F28).md`
