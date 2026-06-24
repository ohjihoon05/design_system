# 컨시어지 플레이 C — ATLAS 스코프 합의 (마일스톤 b)

> 1단계 web `@wonik/web` 성공 기준 = **kept & used 0→1** (사내 실사용자 1명이 실화면 1개를
> @wonik/web으로 만든 걸 14달력일 실사용). 출처: 2026-06-16 office-hours #4 (전략 피벗 APPROVED).
> 이 문서는 그 플레이의 **b(스코프 합의)** 산출물 — 출근일에 동료와 30분에 확정용.

## 0. 화면 한 줄 정의

**ATLAS — 공정 레시피 분석 프로젝트 갤러리.** 사용자가 분석 프로젝트(Quanta / Helios 등)를
카드로 훑고, 각 카드에서 레시피 요약(`3L 200torr 500s` …)과 장비 태그(EQ1/EQ2/Analysis)를 본다.
"+ 새 분석 추가" 카드로 신규 생성. 라우트 **1개**.

- Figma 시안: ATLAS `node 118:482`
- 프로토타입(검증 완료): `apps/web-sandbox/src/AtlasPrototype.tsx` — `pnpm -F web-sandbox dev` → 첫 섹션

## 1. 스코프 게이트 판정 (라우트 1 · 컴포넌트)

**v1 = 9개**: `Card` · `Text` · `Badge` · `IconButton` · `Box` · `Stack` · `Avatar` · `Input` · `Button`
( + `ThemeProvider` 래퍼 ). 당초 lean 7개에서 **검색바·페이지네이션을 사용자 결정으로 추가**(2026-06-23,
"시안 그대로") → ≤8 게이트를 2개 **의식적** 초과(silent 초과 아님). 시안 충실 재현 우선.

| 포함 (v1) | 구성 |
|---|---|
| 상단바 (로고 + 아바타) | `Box` + `Avatar` + `Text` |
| 검색 바 ("Search Project") | `Input` + 검색 아이콘(inline SVG). 프로토타입은 실제 필터 동작 |
| 카드 갤러리 + "+ 새 분석 추가" 카드 | `Card` · `Text` · `Badge` · `IconButton` |
| 페이지네이션 (← Previous [1] 2 … 5 Next →) | `Button` + `Text` 조립(전용 컴포넌트 없음). 프로토타입은 시각·활성표시 mock |

→ 게이트 초과가 신경 쓰이면 검색·페이지네이션은 실데이터가 적을 때 빼도 됨(동료와 확정).
   지금은 시안 충실 우선으로 둘 다 포함.

## 2. 납품 형태 = IT 무의존 (c 게이트)

사내 registry·github pull 불가 확정 → 아래 중 하나. **b에서 동료와 확정:**

- [ ] 동료 PC에서 **로컬 실행** (Vite dev / 빌드된 정적 파일 더블클릭)
- [ ] 결과물 **반입** (빌드 산출물 전달)
- [ ] 기타: ___________

## 3. kept & used 계약 (d 게이트 = 완료 조건)

동료도 "done"의 정의를 알아야 한다. **합의 문구:**

> "이 화면을 네 업무에 **남겨두고 14일 동안 실제로 써본다.** 한 번 보고 마는 게 아니라."

- 실사용 확인 = 14달력일 후 구두 또는 스크린샷 1장.
- "쉽고 재밌다"(만족도)는 **본선 카운트 아님** — 실제 업무 사용만 0→1로 침.

## 4. 이 실화면이 표면화한 DS backlog (ADR-034 후보 — v1은 우회, 지금 고치지 말 것)

첫 진짜 소비처라 여기서 막히는 건 speculative가 아니라 customer-driven → ADR-034 관문 정당.
단 **v1에선 전부 우회 가능**하니 채택 증명(0→1) 전에 DS를 건드리지 않는다.

1. **Badge 팔레트 2종(neutral/primary)뿐** — EQ1/EQ2/EQ3를 색으로 구분하려면 부족
   (dry-run #1 backlog가 실화면으로 확정). v1은 EQ=neutral, Analysis=primary로 충분.
2. **페이지네이션 컴포넌트 없음** — 필요 시 `Button`+`Text` 조립. 여러 화면에서 반복되면 컴포넌트 승격.
3. **아이콘 미제공** — 검색·+·메뉴 아이콘은 consumer가 공급 (`IconButton`은 children만 받음).
   프로토타입은 inline SVG로 해결. v1 전 아이콘 출처 1개 확정(inline SVG vs lucide-react).

## 5. 빌드 중 확인된 기술 사실 (실 빌드 de-risk)

- **다크는 상시-다크 island**로 처리 — toggle이 아니라 `<ThemeProvider theme="dark" scope="self">`.
  `[data-theme="dark"]`가 plain 속성 셀렉터라 nested island 가능.
- **다크 inversion 함정**: 흰 패널 위 어두운 글자는 `color="onDark"`(다크에서 #303030)를 써야 함.
  `color="dark"`는 다크 테마에서 밝아져(#F1F5F9) 흰 패널에서 안 보임. ← 실 빌드에서 막힐 뻔한 지점.
- `surfaceWhite`는 다크 테마에서도 #FFFFFF 유지 → 흰 레시피 패널 살아남음.
- 검증: `tsc --noEmit` 통과 · `vite build` 통과(36 모듈) · 실제 렌더 콘솔 에러 0.

## 6. 마일스톤 체크리스트 (순서 게이트 C → A → B)

- [x] **a** 실명 후보 1명 + 실작업 1개 확정 *(2026-06-23 사용자 확인)*
- [x] **b** 스코프 합의 *(2026-06-23 합의)* — 화면=ATLAS, 라우트1, 컴포넌트 9개(검색·페이지네이션 포함), 프로토타입 = `AtlasPrototype.tsx`
- [~] **c** IT 무의존 ship — **standalone 단일-HTML 빌드 완료** (아래 §7). file:// 렌더·색 검증 완료. **남은 것 = 사내**: 동료 PC에 전달(반입 더블클릭 권장).
- [ ] **d** 납품 + 14달력일 실사용 확인 → **여기 닿으면 1단계 web 완료**

## 7. 납품물 (c 산출물)

- **앱**: `apps/atlas/` — `@wonik/web`으로 만든 ATLAS 화면 단독 앱 (singlefile-spike 패턴, ADR-043).
- **빌드**: `pnpm -F atlas build` → `apps/atlas/dist/index.html` (**224KB 자가포함**, JS·CSS·토큰 :root 시트 전부 인라인).
- **런처**: `run-atlas.bat` 더블클릭 → 빌드 + 열기. 동료에겐 `dist/index.html` **파일 하나만 전달**(서버·설치·IT 불요, 오프라인 동작, file:// 더블클릭).
- **검증**: `pnpm -F atlas verify` (다크 기대색 `rgb(74,101,184)` 박제) → singlefile-gate **HARD FAIL 0**. 외부 네트워크 자원 0 · `[data-theme="dark"]`+`--color-*` 인라인 확인 · file:// 실제 렌더 OK(콘솔 에러 0) · 검사3(primary var() 해결=다크 WONIK BLUE) PASS · 검사4(status-family)는 `--color-status-warning-dot` **직접 probe로 실 PASS** — 종전 "danger 버튼 없어 N/A" 핸드웨이브를 게이트 수정(2026-06-24)으로 정직한 증인으로 승격(버튼 스캔→var 직접 주입, 딜리버러블 모양 무관).
- **납품 형태 결정(§2)**: 반입(파일 전달) 가능 확정 → 로컬 실행 셋업 불요. 동료 PC에 두고 14일(d) 카운트 시작.

실패 분기(office-hours #4): i 하드제로=demand 부재 / ii 미사용=fit 문제 / iii 작업 커밋 거부=약한 demand·wrong wedge.
어느 쪽이든 싼 발견 — 그대로 기록.
