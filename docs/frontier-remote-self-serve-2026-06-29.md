# 프론티어: 원격 비개발자 self-serve 검증 — 설계 + 결정

> 2026-06-29 / via office-hours (인트라프러너십 모드) / 의사결정 기록

## 0. 한 줄 결정

**집에서 키트를 만들고, 검증은 maintainer가 원격으로 구동한다 (A+C 합성).** office-access가
유일 블로커였고(몇 주째), 원격이 그 블로커를 없앤다. 단 — §2 통찰 때문에 첫 빌드는
"무거운 페어세션"이 아니라 "싼 환경 probe"다.

## 1. 어디까지 왔나 (백지 아님)

- **수요** ✅: ppt 0→1 채택 + 실명 동료가 직접 뽑길 요청.
- **kept&used(d)** ✅: 이미 ppt로 달성(6/24). ATLAS는 빌드·검증 done이나 미납품 →
  남은 프론티어 = **consume(C)가 아니라 self-produce(A)**, "비개발자가 스스로 화면을 뽑는가".
- 두 vehicle이 atoms-vs-룩어라이크 긴장을 그대로 체화:
  - **ATLAS** (`apps/atlas/`): 진짜 atoms 9개 → 단일-HTML 224KB, IT-무의존 더블클릭. 단 **consume**(완성품 받기).
  - **wonik-starter** (`~/wonik-starter`): 비개발자가 Claude Code로 **produce**(자기 화면 생성). 단 Node+빌드환경 필요 = 환경벽.

## 2. 핵심 통찰 (office-hours 산출)

**원격으로 가면 wonik-starter의 IT-무의존 트릭(USB로 node_modules 통째 복사)이 깨진다.**
원격 전송은 node_modules(수백 MB)를 못 싣는다 → 동료 PC에 **Node+pnpm+레지스트리 접근이
반드시** 있어야 함 = 정확히 그 환경벽. (vendor/*.tgz로 @wonik만 오프라인, react/vite는 레지스트리行)

→ 따라서 **원격 + self-produce + IT-무의존은 거의 모순**. 이걸 confirm하는 데 1시간 페어세션은
과하다. **PC가 starter를 돌릴 수 있는지 사전 probe 하나**면 환경벽 질문의 대부분이 풀린다.

## 3. 전제 (합의)

1. 집 검증 준비는 천장 — 네 번째 dry-run은 perfectionism이지 진척 아니었다.
2. self-produce 칸은 실제 비개발자 1명이 직접 해봐야만 채워진다 (코드·빌드 EXIT 0 무한히 쌓아도 안 채워짐).
3. 유일 블로커 = office-access → 원격으로 우회.
4. 관찰(벽 위치)이 핵심가치 → maintainer가 원격 화면공유로 봐서 보존. 순수 async의 "관찰자 없음" 약점을 maintainer가 메움.

## 4. 가장 얇은 척추 (precheck-first)

1. **`precheck.bat`** (빌드 완료, ASCII, 더블클릭) → 동료에게 원격 전송. Node/pnpm/레지스트리
   reachability를 찍어 스크린샷 회수. (전체 세션·node_modules 전송 불요)
2. 분기:
   - **PASS** (Node 환경 OK) → 슬림 zip(node_modules 제외) 전송 + maintainer 원격 화면공유로
     self-produce 1세션 → `REMOTE-SESSION.md` 관찰시트로 벽 위치 기록.
   - **BLOCKED** (Node 없음 / IT 차단 / 레지스트리 막힘) → **환경벽 confirmed = 길은 BUY(클라우드
     컨테이너)**. `/wonik.gonogo` 재호출. 세션 불요 — 싸게 발견.

## 5. 성공/킬 기준 (이 방향을 "완료"로 닫는 조건)

- **GO (self-produce 길)**: 동료가 원격 안내로 화면 1개를 atoms로 produce + kept 의향 → `/wonik.app-brief`로 더 얇게.
- **BUY (클라우드)**: 막힘이 환경/설치/레지스트리. precheck FAIL이면 세션 전에 이미 판정 → gonogo BUY.
- **NO-GO (wrong wedge)**: 환경은 되는데 동료가 결과를 안 쓰려 함 → self-serve는 wrong wedge, 컨시어지(C)로 충분.

## 6. 다음 행동 (The Assignment — office-gated 아님)

**`precheck.bat` 한 파일을 동료에게 원격 전송 → 더블클릭 → 결과 화면 회수.** 이 단일 결과가
전체 방향(세션이냐 BUY냐)을 라우팅한다. 집/원격에서 가능, 사무실 진입 불요.

## 7. 이 설계가 안 본 것 (정직)

- precheck PASS여도 "produce를 비개발자가 *말로* 끌어내는가"(프롬프트벽)는 세션에서만 보임 — precheck는 환경벽만 잰다.
- 원격 화면공유가 사내 보안정책에 막힐 수 있음(이전 헤드리스 chrome 프록시 차단 선례). 그럼 그 자체가 또 다른 환경벽 발견.
- cloud BUY 후보는 사내 보안게이트 미검토 — gonogo에서 별도.
