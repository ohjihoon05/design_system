# Step 4 — docs/dogfood-trial-4.md 작성 + needs 우선순위 + phase 닫기

## 읽어야 할 파일

- `phases/11-trial-4-outline/spec.md` (전체)
- `phases/11-trial-4-outline/step3.md` (매트릭스 + H2/H3 결론)
- `docs/dogfood-trial-3.md` (문서 형식 답습)
- `pkg-out/trial-4-outline-loading.png`, `trial-4-outline-edit.png` (인용용)

## 작업

### 4.1 docs/dogfood-trial-4.md 신규 작성

Trial 1·2·3와 동일한 5섹션 구조:

```markdown
# Dogfood Trial 4: ppt Outline 페이지 통째 dogfood

**날짜**: 2026-05-12
**대상 product**: ppt (Factory PPT)
**적용 범위**: ppt `frontend/src/pages/Outline.tsx` + `frontend/src/components/OutlineCard.tsx`
**목표**: 가설 H2(시각 일관성)·H3(needs 발굴) 동시 검증.

## 적용 방식
- design_system 빌드+pack → ppt link
- branch `trial-4-outline` (main 머지 안 함)
- 교체 대상: Spinner 1개 + 일반 Button 3개 + Input 1개 + icon-only Button 3개
- 시각도 inline style 0 / layout만 허용
- 더미 outline 3개 fixture (zero-mock 또는 store seed — Step 0.4 결정)

## 발견사항

### 매트릭스 (spec §6 + step3 결과)

[Step 3 매트릭스 8행 그대로 삽입]

### H2 결론
[step3.md H2 결론 1문장]

### H3 결론
[step3.md H3 결론 1문장 + needs 우선순위 1·2·3]

## 결과
- 시각 회귀 정도: [구체 — 캡쳐 인용]
- 1단계 결승선과의 관계: [Phase 09 closure 위에서 ADR-010 cascade 회귀 [0/N개]]
- ADR-010·011 적용 후 첫 다중-컴포넌트 dogfood로서 [평가]

## 다음 phase 후보 (Phase 12+)

### 우선순위 1 — 강한 needs (4회+ 반복)
- [컴포넌트 명] — 사용 evidence: [Outline.tsx line X, Y, ...; OutlineCard line Z]
- 다음 스텝: ADR + spec + 구현 phase 분리

### 우선순위 2 — 중간 needs (2~3회)
- [컴포넌트 명] — evidence
- 다음 스텝: needs 누적 보고 결정

### 우선순위 3 — 약한 needs (1회)
- [컴포넌트 명]
- 다음 스텝: 다음 dogfood까지 보류 (YAGNI)

### Trial 4가 *반증한* 후보
- [예: dashed border button needs는 Outline에만 1회 — Phase 12 진입 안 함]
```

### 4.2 spec §5 결승선 9개 자동 검증

```bash
cd C:/Users/ohjih/design_system

# S1 design_system 코드 변경 0
git diff packages/ apps/ CLAUDE.md docs/PRD.md docs/ARCHITECTURE.md docs/ADR.md docs/UI_GUIDE.md | wc -l   # == 0

# S2 산출물
test -f docs/dogfood-trial-4.md
test -f pkg-out/trial-4-outline-loading.png
test -f pkg-out/trial-4-outline-edit.png

# S3 가설 단어 존재
grep -q "H2" docs/dogfood-trial-4.md
grep -q "H3" docs/dogfood-trial-4.md
grep -q "발견" docs/dogfood-trial-4.md

# S4 needs 우선순위
grep -E "Phase 12|needs|우선순위" docs/dogfood-trial-4.md

# S5 슬롭 0
! grep -i -E "glassmorphism|gradient orb|lottie|backdrop-filter: blur" docs/dogfood-trial-4.md

# S6 회귀 테스트
pnpm -F @wonik/web test    # 163 passing 유지
```

S7·S8·S9 (정성)는 사용자가 시각 검토하고 confirm.

### 4.3 phase index 닫기

`phases/11-trial-4-outline/index.json` 모든 step status를 `completed`로 + summary 1줄씩.

```json
{
  "step": 4,
  "name": "trial-doc-and-close",
  "status": "completed",
  "completed_at": "2026-05-12T...+0900",
  "summary": "Trial 4 — ppt Outline 페이지 통째 dogfood. H2 [결론], H3 [needs 우선순위]. design_system 코드 변경 0. Phase 12 후보 N건 정의."
}
```

`phases/index.json`에도 phase 11 항목 추가:

```json
{
  "dir": "11-trial-4-outline",
  "status": "completed",
  "completed_at": "2026-05-12T...+0900"
}
```

### 4.4 commit (사용자 confirm 후)

design_system 측:
```powershell
git add phases/11-trial-4-outline/ docs/dogfood-trial-4.md pkg-out/trial-4-outline-*.png
git commit -m "feat: phase 11 — Trial 4 Outline dogfood (가설 H2/H3 검증)"
```

ppt 측 (`trial-4-outline` branch):
```powershell
cd C:/Users/ohjih/ppt
git add src/pages/Outline.tsx src/components/OutlineCard.tsx
git commit -m "trial-4: replace native components with @wonik/web (Outline page)"
# main 머지는 사용자 결정 후
```

## Acceptance Criteria

```bash
# 4.2의 모든 grep ✅
# index.json 모든 step "status": "completed"
grep -c '"status": "completed"' phases/11-trial-4-outline/index.json   # >= 5
# phases/index.json에 phase 11 등록
grep -q '"11-trial-4-outline"' phases/index.json
```

## 보안 체크

- commit 직전 `git diff --cached` 시각 검토 — 비밀 토큰·사용자 데이터·실고객명 0
- 캡쳐 PNG에 더미만 들어 있는지 사용자가 시각 confirm

## 금지사항

- 결승선 미달 상태로 phase 닫기 0
- vague needs ("더 봐야 함" / "고려") — 우선순위 1·2·3 명확히 분류
- ppt main 강제 머지 0 (사용자 결정 영역)

## 검증 절차

1. AC 모두 통과
2. 사용자 final confirm — needs 우선순위에 동의 / 수정
3. design_system commit (사용자 OK 시)
4. PR 생성 여부도 사용자 결정
