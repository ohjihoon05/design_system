# Phase 12 — Card (tasks.md)

> autopilot PHASE 4 (TASKS) 산출물. plan §7의 6단계를 의존성 순서로 task 분해. 각 task = 완료 기준 + 테스트 task + 보안 체크.

각 task는 step{N}.md에 풀어 쓴다 (tasks.md는 *목록*, step{N}.md는 *실행 가이드*).

---

## Step 0 — ADR-015 draft + phase 디렉토리 init

| # | Task | 완료 기준 | 테스트 task | 보안 체크 |
|---|------|-----------|-------------|-----------|
| 0.1 | `phases/12-card/index.json` 생성 — step 0~5 모두 `status: "pending"` | 파일 존재 + JSON valid | 0.T1 | — |
| 0.2 | `phases/12-card/step{0..5}.md` skeleton 생성 — autopilot 흐름에 맞춰 1줄씩 | 6개 파일 존재 | — | — |
| 0.3 | `docs/ADR.md`에 ADR-015 draft 추가 — "Card 컴포넌트: surface/elevated × none/sm/md/lg + interfaceColors 의존" + ADR 본문(맥락/결정/대안/결과) | ADR-015 header grep hit + ADR.md 빌드(markdown lint 통과) | 0.T2 | — |
| 0.4 | `.changeset/12-card.md` 생성 — `@wonik/web: minor` + "Add Card component (surface/elevated × none/sm/md/lg)" | 파일 존재 + minor + 컴포넌트 이름 grep hit | 0.T3 | — |
| 0.T1 | index.json JSON 파싱 검증 | `node -e "JSON.parse(require('fs').readFileSync('phases/12-card/index.json','utf8'))"` exit 0 | — | — |
| 0.T2 | ADR.md 안에 ADR-014 다음에 ADR-015가 *순서대로* 위치 | grep line number 비교 | — | — |
| 0.T3 | Changeset 형식 valid (frontmatter `"@wonik/web": minor`) | `pnpm changeset status` exit 0 | — | — |
| 0.S1 | (보안) ADR draft에 비밀·실고객명·내부 URL 0 | git diff 시각 검토 | — | — |

**Step 0 통과 조건**: 0.1–0.4 완료 + 0.T1·0.T2·0.T3·0.S1 통과.

---

## Step 1 — types.ts + Card.test.tsx (TDD: 실패하는 테스트 먼저)

| # | Task | 완료 기준 | 테스트 task | 보안 체크 |
|---|------|-----------|-------------|-----------|
| 1.1 | `packages/web/src/Card/types.ts` 생성 — `CardVariant`, `CardPadding`, `CardProps` named export. `CardProps extends HTMLAttributes<HTMLDivElement>` + `as?: ElementType` | tsc --noEmit 성공, 3 type export | 1.T1 | — |
| 1.2 | `packages/web/src/Card/Card.test.tsx` 생성 — Vitest + @testing-library/react. 최소 10케이스 (plan §6.1) | 테스트 파일 존재 + 10 `it()` 블록 | 1.T2 | — |
| 1.3 | 테스트가 *실패*함을 확인 (Card 미구현이라 import error) | `pnpm -F @wonik/web test Card` non-zero exit | — | — |
| 1.T1 | types.ts가 strict mode 통과 | tsc --noEmit on types.ts | — | — |
| 1.T2 | 테스트 케이스가 plan §6.1 10개를 모두 포함 | 각 케이스 `it('...')` description grep hit | — | — |
| 1.S1 | (보안) test fixture에 비밀 0 — children에 사용한 text는 "Card content" 같은 무해 문자열 | 시각 검토 | — | — |

**Step 1 통과 조건**: 1.1·1.2·1.3 완료 + 1.T1·1.T2·1.S1 통과 (테스트 *fail*하는 게 정상).

---

## Step 2 — Card.tsx 구현 → 테스트 그린

| # | Task | 완료 기준 | 테스트 task | 보안 체크 |
|---|------|-----------|-------------|-----------|
| 2.1 | `packages/web/src/Card/Card.tsx` 생성 — function component, `as` prop (Box 패턴) | export `Card` 존재 | 2.T1 | — |
| 2.2 | module-scope CSS 1회-inject (`ensureCssInjected()` + `data-wonik-card` style tag + `[data-theme="dark"] .wonik-card-elevated { box-shadow: none }`) | Button/Skeleton 패턴 일치 | 2.T1 | — |
| 2.3 | variant=surface: bg=`interfaceColors.surface`, border=`1px solid ${interfaceColors.border}`. variant=elevated: border 없음 + boxShadow + `className: 'wonik-card-elevated'` | grep `interfaceColors.surface` / `interfaceColors.border` hit | 2.T1 | 2.S1 |
| 2.4 | padding 매핑: PADDING_MAP 모듈 상수 (none/sm/md/lg → '0'/space[4]/space[6]/space[8]) | 4 key 명시 | 2.T1 | — |
| 2.5 | border-radius `radius.md`. boxShadow 상수 (light용) — `// elevation, plan §2.6: 토큰화는 사용처 2+ 부상 시` 주석 부착 | grep `radius.md` + 주석 hit | 2.T1 | — |
| 2.6 | className 합성: `'wonik-card' + variant suffix + ' ' + (props.className ?? '')` | 외부 className 합성 보존 | 2.T1 | — |
| 2.7 | `Card.test.tsx` 10 케이스 모두 그린 | `pnpm -F @wonik/web test Card` exit 0, 10 passed | — | — |
| 2.T1 | raw 값 0 검증 (spec S3) | `! grep -E "#[0-9a-fA-F]{3,6}" Card.tsx` + `! grep -E "\b[0-9]+px\b" Card.tsx` (단 boxShadow 상수 한 줄은 예외 — 주석으로 의도 명시) | — | — |
| 2.S1 | (보안) inline style 객체에 user input 직접 삽입 0 — `style`은 spread만, 우리 default 위에 덮어쓰기 | 코드 시각 검토 | — | — |

**Step 2 통과 조건**: 2.1–2.7 완료 + 2.T1·2.S1 통과.

---

## Step 3 — index.ts + re-export + 빌드

| # | Task | 완료 기준 | 테스트 task | 보안 체크 |
|---|------|-----------|-------------|-----------|
| 3.1 | `packages/web/src/Card/index.ts` — `export { Card } from './Card'; export type { CardProps, CardVariant, CardPadding } from './types';` | 파일 존재 + 4 export | 3.T1 | — |
| 3.2 | `packages/web/src/index.ts`에 `export * from './Card'` 추가 | grep hit | 3.T1 | — |
| 3.3 | `pnpm -F @wonik/tokens build && pnpm -F @wonik/web build` 성공 | exit 0, dist에 Card.* 산출물 | 3.T2 | — |
| 3.4 | `pnpm -F @wonik/web test` 전체 (163 + Card 10 ≥ 173) passing | exit 0 + count 확인 | 3.T2 | — |
| 3.T1 | deep import 가능 검증 — `import { Card } from '@wonik/web'` resolve | sandbox 또는 vitest로 import 한 줄 확인 | — | — |
| 3.T2 | dist 산출물 sanity — Card.d.ts에 CardProps export 포함 | grep `CardProps` in dist/*.d.ts | — | — |
| 3.S1 | (보안) deep import 경로(`@wonik/web/dist/Card`) 노출 0 — package.json `exports` 필드에 root만 노출 | 시각 검토 | — | — |

**Step 3 통과 조건**: 3.1–3.4 완료 + 3.T1·3.T2·3.S1 통과.

---

## Step 4 — sandbox 매트릭스 + 캡쳐 + AI 시각 분석

| # | Task | 완료 기준 | 테스트 task | 보안 체크 |
|---|------|-----------|-------------|-----------|
| 4.1 | `apps/web-sandbox/`에 Card 섹션 추가 — 8 조합 매트릭스 (variant 2 × padding 4) + light/dark 토글 | sandbox 페이지에 섹션 노출 | 4.T1 | — |
| 4.2 | `pnpm -F web-sandbox dev` 부팅 → Headless Chrome으로 `pkg-out/phase-12-card-matrix.png` 캡쳐 | 파일 존재 + 크기 > 10KB | 4.T2 | — |
| 4.3 | dark theme 캡쳐 → `pkg-out/phase-12-card-matrix-dark.png` | 파일 존재 + elevated 그림자 0 (육안 검증) | 4.T2 | — |
| 4.4 | AI(Read tool)가 PNG 읽고 spec S11·S12·S13 정성 판정 — surface 톤·elevated shadow 강도·border-radius 일관 | step4.md에 판정 1단락 | — | — |
| 4.T1 | sandbox 매트릭스 셀이 8개 모두 visible (none·sm·md·lg × surface·elevated) | 시각 검사 | — | — |
| 4.T2 | PNG 파일 sanity — `file pkg-out/*.png` PNG 헤더 확인 | — | — | — |
| 4.S1 | (보안) sandbox 데모 텍스트에 회사 비밀 0 — children에 "Card content" 등 무해 문자열만 | 시각 검토 | — | — |

**Step 4 통과 조건**: 4.1–4.4 완료 + 4.T1·4.T2·4.S1 통과 + 사용자 정성 confirm OK.

---

## Step 5 — ADR-015 finalize + PRD 업데이트 + phase closure

| # | Task | 완료 기준 | 테스트 task | 보안 체크 |
|---|------|-----------|-------------|-----------|
| 5.1 | ADR-015 본문 완성 — 맥락(Trial 4 4 reps evidence) / 결정(API signature) / 대안 (Header/Body/Footer subcomp 거부 / shadow 토큰화 보류) / 결과 (cascade 답습, hex/px 0) | ADR-015 안에 "결정"·"대안"·"결과" 헤더 모두 존재 | 5.T1 | — |
| 5.2 | `docs/PRD.md` "1단계 진행 현황" 표에 Phase 12 행 추가 — "Phase 12 / Card 컴포넌트 / `<Card variant padding>` + ADR-015" | grep "Phase 12" hit | — | — |
| 5.3 | spec §5 S1–S10 자동 검증 스크립트 실행 → 모두 ✅ | step5.md에 결과 표 부착 | 5.T2 | — |
| 5.4 | `phases/12-card/index.json` 모든 step `status: "completed"` + summary 1줄 | 6 step 완료 처리 | — | — |
| 5.5 | commit 직전 `git diff` 시각 검토 — 비밀 0 / hex 리터럴 0 (boxShadow 1줄 예외 명시) | 검토 통과 | — | 5.S1 |
| 5.T1 | ADR.md 빌드(markdown 형식) 통과 | markdown 파싱 에러 0 | — | — |
| 5.T2 | spec S1–S10 grep 자동 스크립트가 step5.md 안에 inline 결과로 명시 | 표 10행 모두 ✅ | — | — |
| 5.S1 | (보안 최종) commit 직전 종합 검토 — diff에 비밀·hex·deep import 노출 0 | 검토 통과 | — | — |

**Step 5 통과 조건 (= phase closure)**: 5.1–5.5 완료 + 5.T1·5.T2·5.S1 통과 + 사용자 confirm.

---

## 의존성 그래프

```
Step 0 (ADR draft + phase init)
   └─→ Step 1 (types + 실패하는 테스트)
          └─→ Step 2 (Card.tsx 구현 → 테스트 그린)
                 └─→ Step 3 (re-export + 빌드 + 전체 테스트)
                        └─→ Step 4 (sandbox 매트릭스 + 캡쳐 + 정성)
                               └─→ Step 5 (ADR/PRD finalize + closure)
```

순차 실행. 병렬 0 — TDD라 테스트가 구현보다 먼저, 매트릭스는 빌드가 먼저, ADR finalize는 시각 정성이 끝나야.

---

## 테스트 task — 구현 task별 1:1 대응 명시 (GATE 4 항목)

| 구현 task | 대응 테스트 task |
|---|---|
| 0.1 index.json | 0.T1 JSON 파싱 |
| 0.3 ADR draft | 0.T2 ADR 순서 |
| 0.4 Changeset | 0.T3 형식 valid |
| 1.1 types | 1.T1 tsc strict |
| 1.2 test 작성 | 1.T2 10케이스 grep |
| 2.1–2.6 Card.tsx | 2.7 테스트 그린 + 2.T1 raw값 0 |
| 3.1–3.2 re-export | 3.T1 import resolve |
| 3.3 빌드 | 3.T2 dist sanity |
| 3.4 전체 테스트 | (테스트 task 자체) |
| 4.1 sandbox | 4.T1 시각 검사 |
| 4.2–4.3 캡쳐 | 4.T2 PNG sanity |
| 5.1 ADR | 5.T1 markdown |
| 5.3 spec 검증 | 5.T2 표 inline |

---

## 보안 task — 별도 명시 (GATE 4 보안 태스크 항목)

본 phase는 인증/권한/SQL/네트워크 보안 영역 0 — *컴포넌트 도입 phase*. 그러나 *코드 위생 + 데이터 노출 면 0* 차원의 보안 체크는 다음 5개로 명시:

- **0.S1** ADR/Changeset draft에 비밀·실고객명·내부 URL 0
- **1.S1** 테스트 fixture children 텍스트가 비밀 0
- **2.S1** inline style 객체에 user input 직접 삽입 0 (우리 default 위에 spread만)
- **3.S1** package.json exports 필드에 root만 노출 (deep import 차단 — CLAUDE.md CRITICAL)
- **4.S1** sandbox 데모 텍스트 비밀 0
- **5.S1** commit 직전 git diff 비밀·hex·deep import 종합 검토

---

## 완료 기준 (phase 전체)

- 모든 Task 0.x ~ 5.x ✅
- 모든 Test task 0.T1 ~ 5.T2 ✅
- 모든 Security task 0.S1 ~ 5.S1 ✅
- spec §5 S1–S10 모두 ✅
- 사용자가 시각 정성(S11–S13) confirm
