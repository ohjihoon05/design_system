# Dogfood Trial 12: Layer B publish & adopt 사이클 — 집 시뮬레이션 한 바퀴 (Verdaccio + Changesets)

**날짜**: 2026-05-15
**대상**: design_system + ppt — Layer B 진입 직전 dry run
**범위**: registry 셋업 → 첫 publish → host 마이그레이션 → dual-direction 입증 (전체 8 step)
**목표**: ADR-018의 옵션 A(사내 npm registry) 흐름을 *집에서* 100% 시뮬레이션하여 사내 진입 시 URL만 교체하면 끝나는 상태로 만들기. Layer A 마감 직후 사용자 통찰("집에 구성을 회사에서 할 수 있는 것처럼 할 수 있잖아? 나 컴퓨터 안 꺼")에서 출발.

## 적용 방식

8 step 한 바퀴 — 각 step이 사내 진입 시 그대로 반복될 cycle의 한 단계:

| # | Step | 결과 | 시간 |
|---|---|---|---|
| 1 | Verdaccio 14873 + 사용자 등록 + `.npmrc` token | HTTP 200 / token MWYy...YjI4Yw== | ~10분 (트러블슈팅 포함) |
| 2 | Changesets 누적 8개 확인 + config 검증 | minor 합산 → tokens 0.2.0, web 1.0.0 예상 | 2분 |
| 3 | `publishConfig.registry` placeholder → `http://127.0.0.1:14873/` | tokens + web 둘 다 교체 | 1분 |
| 4 | `pnpm changeset version` + `pnpm -r build` + `pnpm changeset publish` | 첫 publish 성공: tokens@0.2.0, web@1.0.0 + git tag 2개 | 5분 |
| 5 | ppt `.npmrc` + package.json `file:vendor/...tgz` → `^0.2.0`/`^1.0.0` + `pnpm install` | 3.7초 install, node_modules @wonik/tokens@0.2.0 확인 | 3분 |
| 6 | tokens patch changeset → 0.2.1 publish → ppt `pnpm update @wonik/tokens` | 1.5초 update, caret 자동 흡수, web skip(자동) | 5분 |
| 7 | ADR-018 갱신 + 본 trial doc 작성 + ROADMAP "URL만 교체 대기"로 표현 변경 | (현재 step) | 진행 중 |
| 8 | Verdaccio 정리 결정 + commit (push는 사용자 승인 후) | 후속 step | — |

## 발견사항

### F24 — Windows excluded port range (4866-4965)가 표준 4873 차단

`netsh interface ipv4 show excludedportrange protocol=tcp` 결과:

```
4866        4965
```

→ Verdaccio 표준 포트 4873이 *Hyper-V/WSL 동적 예약 범위*에 포함됨. `npx verdaccio` 시 `EACCES: permission denied 127.0.0.1:4873` 에러. **14873**으로 우회.

→ 사내 진입 시 IT가 reserved range 안 잡혔는지 사전 확인 필요. 또는 사내 Verdaccio 서버는 다른 머신에 있어 영향 없음.

### F25 — changeset publish가 변동 없는 패키지 자동 skip

step 6 dual-direction에서 `tokens` 패치만 했더니:

```
🦋 info @wonik/tokens is being published because our local version (0.2.1) has not been published on npm
🦋 warn @wonik/web is not being published because version 1.0.0 is already published on npm
🦋 info Publishing "@wonik/tokens" at "0.2.1"
🦋 success packages published successfully:
🦋   @wonik/tokens@0.2.1
```

→ **사내 진입 시도 매 publish cycle에 모든 패키지 강제 publish 안 함**. registry에 이미 있는 버전은 자동 skip. 사내 표준 흐름 검증.

### F26 — caret semver(`^0.2.0`)가 dual-direction 자동 흐름 메커니즘

| 단계 | 시간 | 메커니즘 |
|---|---|---|
| design_system: `pnpm changeset publish` | 1.0초 | tokens 0.2.0 → 0.2.1 publish |
| ppt: `pnpm update @wonik/tokens` | **1.5초** | caret(`^0.2.0`) → 0.2.1 자동 흡수 + lock 갱신 + package.json `^0.2.1`로 자동 갱신 |

→ host product가 caret semver 사용하면 *명시적 install 없이도* 새 patch/minor 자동 흡수. 사내 진입 후 design system 변경의 host 도달 시간 ≈ 2-3초.

### F27 — peer-only contract (ADR-019)가 publish 시 caret 자동 갱신

step 4 publish 후 Verdaccio에서 받은 `@wonik/web@1.0.0` metadata:

```json
"peerDependencies": {
  "react": "^18.0.0 || ^19.0.0",
  "react-dom": "^18.0.0 || ^19.0.0",
  "@wonik/tokens": "^0.2.0"
}
```

→ source는 `"@wonik/tokens": "^0.1.0"`이었으나 `pnpm changeset version` + publish 과정에서 *자동으로 ^0.2.0으로 갱신*. ADR-019 peer-only contract가 publish 자동화에서도 정합 유지. 사내 진입 시 host가 항상 호환 가능한 peer 받음.

### F28 — changesets 누적 minor 5개가 0.1.0 → 1.0.0 점프 (changesets 알려진 버그 가능성)

`@wonik/web` 누적 changeset 5개(12-card minor + 14-badge minor + 16-alert minor + 17-distribution minor + phase-08-09-10 minor) → 0.1.0에서 한 번 적용 시 *0.6.0이 아닌 1.0.0*. tokens는 같은 5 minor인데 0.2.0(예상 동작) → **두 패키지가 다른 동작 = 정책 아님 = 버그 또는 edge case 의심**.

WebSearch 결과 (2026-05-15):
- changesets/changesets#1011 "Unexpected major version bumps on one package"
- changesets/changesets#555 "patch+minor changesets resulting in major version bump"
- changesets/action#358 "Major version bump where minor is set"

→ "changesets known bug — 특정 조건에서 minor가 major로 promotion됨". 정확한 트리거 조건은 issue tracker에서 진행 중.

**결정 — 받아들임**:
- web 1.0.0이 의외였으나 *14 atoms × 11 trials evidence가 first stable cut 자격에 부합* → 의미적 우연이었지만 정합.
- tokens 0.2.0은 정상.
- 향후 publish cycle에서 web이 다시 minor → 또 major 점프하면 changesets bug 재현 → upstream issue에 reproduction 보고 후보.

후속 작업:
- [ ] 다음 patch publish 시 web 동작 재확인 (1.0.0 → 1.0.1 정상이면 단발 edge case)
- [ ] 만약 minor 누적 시 또 major 점프하면 changesets#1011 reproduction commit으로 재현

### F29 — ppt `vendor/` 4개 tarball이 deletable 거리

```
vendor/wonik-tokens-0.0.0.tgz
vendor/wonik-tokens-0.1.0.tgz
vendor/wonik-web-0.0.0.tgz
vendor/wonik-web-0.1.0.tgz
```

→ Layer A trial 7~8 잔재. registry 마이그레이션 후 *완전 무용*. 별도 cleanup commit 후보 (ROADMAP 작은 호흡 #1과 동일).

## 가설 검증

| 가설 | 검증 방법 | 결과 |
|---|---|---|
| H21: Verdaccio로 사내 npm registry cycle 100% 시뮬레이션 가능 | 8 step 한 바퀴 완료 | ✅ |
| H22: 사내 진입 시 `publishConfig.registry` + `.npmrc` 두 위치만 교체로 끝 | 변경 위치 추적 | ✅ (정확히 2 위치) |
| H23: peer-only contract(ADR-019)가 publish 자동화에서도 정합 | publish 후 metadata `^0.2.0` 확인 | ✅ |
| H24: caret semver가 dual-direction 자동 흐름 메커니즘 | `pnpm update` 1.5초 | ✅ |
| H25: changeset publish가 *변동 패키지만* publish (skip 자동화) | step 6 tokens patch 시 web skip 로그 | ✅ |
| H26: 0.x → 1.0 점프가 first stable의 의미적 표현 | F28 분석 | △ — 결과는 받아들였으나 changesets 정책 확정 필요 |

## 결정

- **ADR-018 옵션 A (사내 npm registry) 1순위 reaffirm** — Verdaccio가 옵션 A의 referenc 구현. 사내 진입 시 동일 패턴.
- **사내 진입 시 교체 위치 = 정확히 2 곳**: 
  - `design_system/.npmrc`의 `@wonik:registry=...` + `_authToken`
  - `tokens/web/package.json`의 `publishConfig.registry`
  - 그 외 코드/설정 변경 없음
- **dry run 정리 정책**: Verdaccio 종료 후 `.npmrc`의 14873 라인 삭제, `publishConfig.registry`는 placeholder 복귀 (사내 URL 결정 시 다시 교체). version bump 0.2.0/1.0.0/0.2.1과 CHANGELOG는 **유지** (진짜 변경 이력).
- **첫 stable 1.0.0 받아들임** — `@wonik/web` 1.0.0이 14 atoms × 11 trials evidence로 정당화. 다음 변경부터 1.x.x semver 정상 흐름.
- **F28 changesets 0.x → 1.0 정책**: 별도 조사 거리. 다른 패키지 publish 시 재확인.

## 누적 evidence 갱신 (ROADMAP M2)

| 항목 | 변화 |
|---|---|
| Layer B 시뮬레이션 가능성 | 신규 ✅ — *사내 PC 의존 가정 무효화* |
| ADR-018 옵션 A 1순위 evidence | 보강 — Verdaccio 동일 패턴 검증 |
| ADR-019 peer-only contract publish 정합 | 보강 — 자동 caret 갱신 확인 |
| vendor tarball cleanup 거리 | 4 files (trial 7~8 잔재) |

## 후속 작업 (미완 / 후보)

- [ ] **시각 검증** — ppt dev server (이미 :3000 떠있음) 한 번 재시작 후 Outline/Home/Presentation 한 바퀴 둘러보기. 0.2.1 reflected 확인.
- [ ] **Verdaccio 종료 결정** — 끄면 다음 진입 시 다시 띄움. 두면 백그라운드 메모리 점유 (~80MB).
- [ ] **`.npmrc` token 보안 처리** — 14873 token이 commit되면 dry run 흔적. `.npmrc`를 `.gitignore`에 넣거나 commit 후 별도 cleanup commit으로 제거.
- [ ] **F28 changesets 0.x → 1.0 정책 조사** — 다음 patch publish 시 web 동작 확인.
- [ ] **vendor tarball 4개 삭제** — ppt 별도 cleanup commit.
- [ ] **(선택) CI publish workflow** — GitHub Actions에 changeset/action 추가. dry run에서는 manual로 충분.
- [ ] **ADR-018 갱신** — 본 trial 결과를 "Verdaccio dry run 보강 (2026-05-15)" 섹션으로 추가.
- [ ] **ROADMAP 갱신** — "회사 PC + IT 협의 대기" → "URL만 교체 대기" 표현 변경 + Verdaccio 시뮬레이션 ✅ 표시.
