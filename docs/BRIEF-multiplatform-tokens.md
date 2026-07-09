# 멀티플랫폼 토큰 파이프 brief (ADR-047 척추 ①)

> mode: **신규** / 생성: 2026-07-09 / 다음 trial: trial-15
> ⚠️ 자율 모드 생성 — 답변 출처는 `/wonik.gonogo` 2026-07-09 (사용자 응답 4건) + ADR-047. **미확인 슬롯 2개**는 사용자 기입 필요.

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
- `packages/vue/`·`packages/flutter/` 컴포넌트 패키지 — 척추 ② 게이트 전 금지 (CLAUDE.md CRITICAL)
- 다크모드 플랫폼 보정·터치 타겟·모바일 폰트 대체 — 값 그대로 전달, 보정은 척추 ② 이후 (ADR-047 정직단서 ⒞)
- Angular/Svelte — 요청 없음, 전면 범위 외
- 배포 채널 구축(사내 npm·pub) — 초기엔 vendoring 파일 전달로 충분
- Figma Variables 자동 동기화 — 1단계 외 유지

## 7. 성공 기준 (정량 1개)
- **지표**: 실제 Vue 앱 1개 + Flutter 앱 1개의 코드에 산출물이 들어가 **14달력일 kept** (앱 2 × 14일, 게이트 = ADR-047 §2)
- **검증 방법**: dogfood-trial-15에서 측정 — kept 확인은 각 앱 repo의 import/참조 코드 실측 (자기보고 X)
- **[미확인 슬롯 B]** kept 검증 방법의 사무실 절차(repo 접근 권한 여부) 확정 필요

## 8. 첫 dogfood-trial 시나리오 (trial-15)
- **핵심 검증 (home, 즉시)**: ① `pnpm -F @wonik/tokens build` 후 3개 산출물 생성 ② dtcg.json이 DTCG 스키마 룰 4건(leaf=$value 1개·group당 단일 $type·light/dark keyset 1:1·특수처리 2건) 통과 ③ Dart 파일이 `dart analyze`(또는 최소 구문 검증) 통과 ④ CSS가 기존 build-css.ts 산출물과 값 동일
- **핵심 검증 (office-gated)**: 두 앱에 드롭인 → 화면 1개에 WONIK BLUE `#273E82` 적용 확인 → 2주 kept 관찰
- **trial 파일 위치**: `docs/dogfood-trial-15.md`

## 9. 다음 단계 (워크플로우 매핑)
- [x] gonogo 판정 → ADR-047 → 본 brief
- [ ] **구현**: DTCG emit 테스트 먼저(TDD) → emit 스크립트 → Style Dictionary 파이프
- [ ] **CRITICAL 점검**: `/wonik.critical-check` (코드 변경 직후)
- [ ] **코드 검토**: `/wonik.webapp-engineer` (산출물 소비 예시 핸드오프 — 각 팀 전달용)
- [ ] **dogfood-trial-15 정리**: home 검증분 기록, office분은 [슬롯 A·B] 확정 후
- [ ] **그룹장 1-on-1 보고**: `/wonik.group-lead` (통합 DS 착수 사전 통보)
