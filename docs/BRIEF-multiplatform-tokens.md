# 멀티플랫폼 토큰 파이프 brief (ADR-047 척추 ①)

> mode: **신규** / 생성: 2026-07-09 / 개정: 2026-07-09(사용 증명 게이트 해제) / 다음 trial: trial-15
> ⚠️ 자율 모드 생성 — 답변 출처는 `/wonik.gonogo` 2026-07-09 (사용자 응답 4건) + ADR-047. **미확인 슬롯 A(대상 앱 실명)는 여전히 미기입 — 단 게이트 해제로 §7의 kept 요구는 삭제됐으므로 더 이상 blocking 아님.**

## 1. 한 줄 정의
`@wonik/tokens` 단일 소스에서 DTCG JSON을 뽑아 Style Dictionary로 **Vue용 CSS 변수 + Flutter용 Dart 토큰 파일을 자동 생성** — 사내 Vue·Flutter 앱의 제각각 기준(자체 테마·Material 기본값)을 하나의 아이덴티티로 교체한다.

## 2. 타겟 사용자
- 누구: 사내 Vue 앱 개발자 + Flutter 앱 개발자 (통합 DS를 직접 요청한 팀들)
- 환경: 각 팀 기존 코드베이스 — 빌드 체인 변경 없이 파일 드롭인(vendoring, ppt 선례)
- 1차 dogfooder: 본인 (산출물 유효성) → 각 팀 1명 (실코드 반입)
- **[미확인 슬롯 A]** 대상 앱 실명: Vue 앱 = ______ / Flutter 앱 = ______ (사무실에서 확정)

## 3. 핵심 산출물 (3개 — 화면 없음, 토큰 파이프)
1. **`dist/tokens.dtcg.json`** — theme-light/dark → DTCG 1:1 emit (fontFamily split·dimension `{value,unit}` 특수처리 2건)
2. **`dist/vue/tokens.css`** — light/dark CSS 변수 (Vue 앱은 import 1줄이면 끝)
3. **`dist/flutter/wonik_tokens.dart`** — Dart 상수 클래스 (Flutter 앱은 파일 복사 1개면 끝)

## 4. atom 매핑
해당 없음 — **컴포넌트 0개가 척추 ①의 정의** (ADR-047 §2). 컴포넌트는 척추 ② 게이트(Button 1개 kept&used)로 별도.

## 5. DS 진화 backlog (빠진 atom)
없음. 25 atoms 불변 — 본 brief는 토큰 소비 층만 확장.

## 6. 제외 범위 (scope creep 차단)
- 다크모드 플랫폼 보정·터치 타겟·모바일 폰트 대체 — 값 그대로 전달, 보정은 컴포넌트 착수 시 별도 결정 (ADR-047 정직단서 ⒞)
- Angular/Svelte — 요청 없음, 전면 범위 외
- 배포 채널 구축(사내 npm·pub) — 초기엔 vendoring 파일 전달로 충분
- Figma Variables 자동 동기화 — 1단계 외 유지
- ~~`packages/vue/`·`packages/flutter/` 컴포넌트 패키지 금지~~ — **해제됨**(ADR-047 §7, 2026-07-09). 착수는 별도 요청 시.

## 7. 성공 기준 (개정 — 사용 증명 게이트 삭제, ADR-047 §7)
- ~~**지표**: 실제 앱 2개에 14일 kept~~ **삭제**. 현재 완료 기준 = **기술 검증만**: 빌드가 3개 산출물 생성 + DTCG 구조 룰 테스트 통과 + `tsc` clean + `@wonik/web` 회귀 무손상. **2026-07-09 구현·커밋 시점에 이미 충족 — 척추 ①은 이 기준상 종결.**
- **[정직 기록]** 실제 앱에 반입돼 쓰이는지는 **검증하지 않기로 결정됨**(사용자 지시). 미확인 슬롯 A(대상 앱 실명)는 앞으로도 확정할 수도, 안 할 수도 있음 — 더 이상 이 산출물의 "성공"을 가르는 조건이 아니다.

## 8. 첫 dogfood-trial 시나리오 (trial-15) — 개정
- **핵심 검증 (완료)**: ① `pnpm -F @wonik/tokens build` 후 3개 산출물 생성 ✓ ② dtcg.json이 DTCG 스키마 룰 4건 통과 ✓(테스트 14/14) ③ CSS·Dart 산출물에 WONIK BLUE `#273E82` 정확 전파 확인 ✓ ④ `tsc --noEmit` clean ✓ ⑤ `@wonik/web` 회귀 367/367 통과 ✓
- ~~핵심 검증 (office-gated): 두 앱에 드롭인 → 2주 kept 관찰~~ — **게이트 해제로 불필요, 미실행**
- **trial 파일 위치**: `docs/dogfood-trial-15.md` (생성 시 위 완료 항목만 기록하면 됨)

## 9. 다음 단계 (워크플로우 매핑)
- [x] gonogo 판정 → ADR-047 → 본 brief
- [x] **구현**: DTCG emit 테스트(TDD, 14/14) → emit 스크립트 → Style Dictionary 파이프 → 커밋 완료 (5a81829)
- [x] **사용 증명 게이트 해제**: ADR-047 §7 개정 (2026-07-09, 사용자 지시)
- [ ] **CRITICAL 점검**: `/wonik.critical-check` (코드 변경 직후, 아직 미실행)
- [ ] **컴포넌트 착수**: 원하면 Vue 또는 Flutter Button 1개부터 — `packages/vue/`·`packages/flutter/` 신설 가능(게이트 없음), 별도 요청 시 진행
- [ ] **코드 검토**: `/wonik.webapp-engineer` (산출물 소비 예시 핸드오프 — 각 팀 전달용)
- [ ] **그룹장 1-on-1 보고**: `/wonik.group-lead` (통합 DS 착수 사전 통보)
