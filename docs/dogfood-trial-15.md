# dogfood-trial-15 — 멀티플랫폼 토큰 파이프 실소비 테스트 (Vue·Flutter)

> 실행: 2026-07-09 / 대상: ADR-047 척추 ① 산출물(`packages/tokens/dist/{vue,flutter}`) / 트리거: "vue flutter 두개 모두 테스트 해봐"

## 방법

실제 앱 요청 없이(ADR-047 §7 개정으로 kept 게이트 불필요), 스크래치패드에 최소 Vue3+Vite 앱과 최소 Flutter 앱을 각각 새로 만들어 산출물을 드롭인 소비 — 유닛 테스트(dtcg.test.ts)로는 못 잡는 "실제 프레임워크가 이 파일을 받아들이는가"를 검증.

## Vue — 결과: PASS

- `pnpm create vite . -- --template vue-ts` + `dist/vue/tokens.{light,dark}.css` drop-in + `App.vue`에서 8개 CSS 변수 실사용(색·radius·spacing·font-family)
- `vue-tsc -b && vite build` — 클린 성공
- 빌드된 CSS에 커스텀 프로퍼티 280개 정확 emit, 컴포넌트 클래스가 `var(--color-primary-base)` 등으로 정확히 참조
- `gstack browse`로 실제 브라우저 렌더 확인: computed `background-color` = `rgb(39, 62, 130)` = `#273E82` WONIK BLUE 정확 일치. 스크린샷으로 버튼·status 칩·muted 텍스트 시각 확인.

## Flutter — 결과: FAIL → 수정 → PASS

최소 Flutter 앱(`flutter create`)에 `dist/flutter/wonik_tokens_*.dart` drop-in 후 실제 위젯(`BorderRadius.circular`·`EdgeInsets`·`ElevatedButton.styleFrom` 등)에서 소비 시도.

**1차 `flutter analyze` — 303 issues:**
1. **`constant_identifier_names` 위반 (약 60개 상수 × 위반)** — 생성기가 style-dictionary `name/snake` transform 그대로 써서 `color_status_run_bg` 같은 snake_case 상수 생성. `flutter_lints`(모든 Flutter 프로젝트 기본 lint 패키지)가 lowerCamelCase를 요구 → 실제 회사 Flutter 프로젝트에 드롭인하면 상수마다 lint 경고가 뜸.
2. **dimension 값이 정수 리터럴** — `static const dimensionSpace3 = 8;` (소수점 없음). Dart는 이걸 `int` 타입으로 추론하는데, `BorderRadius.circular(double)` 등은 `double`을 요구. 이번 테스트 프로젝트의 기본 analyzer 설정(`implicit-casts` 관대)에서는 통과했지만, 더 엄격한 analyzer 설정(`strong-mode: implicit-casts: false`, 일부 회사가 채택)에서는 컴파일 에러가 날 수 있는 잠재 지뢰.

**원인**: `packages/tokens/scripts/build-multiplatform.ts`의 Dart 포맷터가 SD의 `name/snake` 이름을 그대로 쓰고, dimension 숫자를 그대로 문자열화.

**수정**: `dtcg-lib.ts`에 `snakeToDartCamel()`(lowerCamelCase 변환)·`dartNumberLiteral()`(정수도 `.0` 강제) 2개 헬퍼 추가 + TDD 테스트(16/16 green) + `build-multiplatform.ts` 연결. 커밋 `3533368`.

**2차 `flutter analyze` — 7 issues**: 전부 내 테스트 코드(main.dart)의 `prefer_const_constructors` 스타일 제안. **생성된 `wonik_tokens_*.dart` 파일 자체는 0 issues.**

**`flutter test`**: 위젯 트리를 실제로 빌드하고 `ElevatedButton`의 backgroundColor를 assertion — `Color(0xFF273E82)` 정확 일치. `+1: All tests passed!`

## 결론

- Vue: 산출물 그대로 실사용 가능, 결함 없음.
- Flutter: 최초 산출물에 실사용 결함 2건 있었음(둘 다 "실제 소비를 안 해봤으면 못 잡는" 종류) — 수정 완료, 재검증 통과.
- **이번 테스트가 실질적 가치를 낸 사례**: 기존 dtcg.test.ts 14~16개 유닛 테스트는 값·구조만 검증했고, 실제 프레임워크 소비 단계의 문제(lint 컨벤션, 타입 추론)는 못 잡았음. "테스트 해봐" 지시가 실제 드롭인 재현 없이는 안 드러났을 버그를 찾았다.

## 남은 정직 단서

- 이번 테스트는 스크래치패드의 새 최소 앱 — **실제 원익IPS Vue/Flutter 앱**(팀·버전·기존 analyzer 설정이 다를 수 있음)에서의 소비는 여전히 미검증. ADR-047 게이트 해제로 이게 "성공"의 조건은 아니지만, 실사용 시 이번에 못 잡은 다른 문제가 나올 수 있음.
- Flutter 쪽 `flutter test`는 위젯 트리 빌드 검증이지 실제 디바이스/에뮬레이터 렌더 스크린샷은 아님(Vue는 브라우저 스크린샷까지 확보, Flutter는 헤드리스 CI 환경 한계로 위젯 테스트까지만).
