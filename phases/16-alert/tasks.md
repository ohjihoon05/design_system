# Phase 16 — Alert (tasks.md)

## Step 0 — 준비

- `phases/16-alert/` dir + index ✅
- `.changeset/16-alert.md` draft
- ADR-017 outline in docs/ADR.md
- Trial 4+5+6 evidence reference (S0.S1)

## Step 1 — TDD

- `packages/web/src/Alert/types.ts` — `AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'role'>` + `onDismiss?` + `as?`
- `packages/web/src/Alert/Alert.test.tsx` — 11 케이스 (plan §6.1)
- 1.T1: `pnpm test Alert` → red (Alert.tsx 부재)

## Step 2 — 구현

- `packages/web/src/Alert/Alert.tsx`:
  - BASE_STYLE (display flex, padding, radius, fontSize, etc.)
  - statusTokens.alarm — bg/border/text
  - onDismiss 분기 — × button + aria-label="닫기"
  - role="alert" 강제 (Omit + 컴포넌트 props 내부 설정)
- `packages/web/src/Alert/index.ts` — re-export
- 2.T1: `pnpm test Alert` → green (≥11)
- 2.S1: hex 0, raw px는 표준 `1px solid` 1회

## Step 3 — Export + 빌드

- `packages/web/src/index.ts`에 `Alert` + types 추가
- `pnpm -F @wonik/tokens build && pnpm -F @wonik/web build`
- 3.T1: 전체 ≥197 passing (186 + 11 신규)

## Step 4 — Sandbox + 캡쳐

- `apps/web-sandbox/...` Alert 섹션 — 2 케이스(dismiss 유/무) × 2 길이(짧음/긺) 매트릭스
- headless 캡쳐 `pkg-out/phase-16-alert-matrix.png`
- AI 시각 분석 (spec S11·S12·S13)

## Step 5 — Finalize

- ADR-017 본문 완성 (Trial 4+5+6 evidence + 8개 거부된 대안)
- PRD.md Phase 15·16 행 + **layer A 1차 채움 종료 후보** 명시
- Changeset finalize
- spec S1~S13 모두 ✅
- 5.S1: commit 직전 diff 시각 검토

## 의존성

```
Step 0 → 1 → 2 → 3 → 4 → 5
```

## 보안

- 0.S1 evidence reference
- 2.S1 hex 0
- 5.S1 commit 직전 diff
