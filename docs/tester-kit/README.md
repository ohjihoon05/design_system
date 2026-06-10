# Tester Enable Kit

> **목적**: 테스터(실빌더)가 자기 진짜 사내 화면을 `@wonik/web`로 만들 수 있게 하는 최소 키트.
> office-hours(2026-06-09) 결정의 **C 다리(bottom-up 채택)** 산출물 — registry 배급은 동결, 대신 "AI 컨텍스트에 DS를 주입해 바이브코딩 결과가 자동으로 표준이 되게" 하는 길.

## 이 키트가 푸는 문제

사내 웹앱이 **AI팀 바이브코딩으로 제각각** 만들어지는 것이 *사실상 표준*으로 굳는 중. registry(배급 파이프)를 production화해도 **채택**은 안 생긴다 — 병목은 배급이 아니라 채택이다. 이 키트는 배급을 npm이 아니라 **테스터의 AI 컨텍스트**에 꽂는다: DS를 쓰는 게 맨땅 바이브코딩보다 쉬운 길이 되면 채택이 자가발생한다.

## 구성

| 파일 | 무엇 | 누가 읽나 |
|---|---|---|
| `wonik-ds-ai-context.md` | drop-in AI 컨텍스트 — 설치·색 규칙·24 컴포넌트 카탈로그·슬롭 금지·정상 예시 | **테스터의 코딩 AI** (Claude Code `CLAUDE.md` / Cursor `.cursorrules`) |
| `MANUAL_WALKTHROUGH.md` | 수동(손코딩) 검증 트랙 — AI 없이 복붙+치환으로 템플릿 화면을 완성하는 따라하기 가이드. 빈 PC 풀 셋업은 부록 B | **테스터(사람)** |
| `README.md` (이 파일) | 메인테이너 운영 가이드 — 어떻게 건네고 뭘 관찰하나 | **너(메인테이너)** |
| `DRYRUN-*.md` | 출시 전 검증 paper trail (blind dry-run 갭 + fresh-clone 실PC 발견) | 메인테이너 |

### 더블클릭 런처 2개 (repo 안, 용도 분리)

| 런처 | 포트 | 용도 |
|---|---|---|
| `apps\web-sandbox\start-sandbox.bat` | 5174 | **테스터 캔버스** — MANUAL_WALKTHROUGH의 무대. 테스터가 `MyScreen.tsx`로 자기 화면을 그림 |
| `apps\storybook\start-storybook.bat` | 6006 | **DS 카탈로그** — 부품 25개 variant별 구경. 수용성 타진 대화·그룹장 데모 때 띄우는 쪽 (테스터 동선엔 안 씀) |

둘 다 dist가 없으면(첫 실행) 자동으로 `pnpm build` 후 기동. 바탕화면 바로가기: 파일 우클릭 → [보내기 → 바탕 화면에 바로 가기 만들기] → 이름 변경("DS 화면 시작" / "DS 카탈로그 보기").

## 테스터에게 건네는 법

1. **수용성 먼저 (CRITICAL — 건너뛰지 말 것).** 아티팩트부터 들이밀지 마라. "DS를 네 AI 컨텍스트에 넣어줄 테니 다음 화면 한 번 이걸로 만들어볼래?"를 먼저 묻고 **yes를 받은 다음** 건넨다. (받을 의지 없는 사람에게 배급물부터 만드는 게 registry가 한 실수다.)
2. 테스터가 쓰는 코딩 AI 확인 → `wonik-ds-ai-context.md`를 그 프로젝트의 컨텍스트 위치에 넣게 안내 (Claude Code면 프로젝트 `CLAUDE.md`, Cursor면 `.cursorrules`).
3. 설치본 전달: 사내 registry 공개 전이므로 `pnpm pack`으로 뽑은 `@wonik/tokens`·`@wonik/web` tarball 2개를 건넨다. *(이 install 경로는 첫 실테스터가 생길 때 실제로 검증 — 지금 미리 만들지 않는다.)*

## 무엇을 관찰하나 (the assignment)

가이드 데모 말고 **진짜 task를 주고, 안 도와주고, 관찰**한다. 막히는·놀라는 지점이 신호다.

- ✅ **카운트하는 성공 신호**: ① `@wonik/web`로 **ship된 실제 사내 화면 ≥1** ② 테스트 끝나고도 **계속 쓰는 사람 ≥1** (retention).
- ❌ **신호 아님**: "좋다/만족스럽다"(만족도). N명이 좋대도 retention·real-ship 없으면 0.
- 📝 **고통 리스트 = polish backlog**: 테스터가 막힌 곳(없는 컴포넌트, 헷갈린 prop, 깨진 설치)이 곧 올해 다듬을 항목. 컨텍스트 파일 §0-4가 "없는 컴포넌트는 보고하라"고 AI에 지시해 둔 이유.

## 지금 상태 / 다음

- **현재**: 컨텍스트 파일 v1 작성 (집에서 가능한 prototyping). **아직 테스터에 배포 안 함** — 수용성 타진(사내 대화)은 사내 진입 시.
- **회사-종속 대기**: 실테스터 섭외, tarball install 실검증, AI팀 툴체인 파악.
- **타임라인**: 올해 = 실사용 기반 polish(테스터 retention·real-ship), 내년 = 완성형으로 센터장 피치. 상세 `docs/registry-decision-2026-06-09.md`.
