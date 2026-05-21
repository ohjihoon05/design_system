# Phase 15 — Trial 6 (plan.md)

> autopilot PHASE 3 산출물.

## 1. 접근 방식

Trial 4/5 사이클 답습, 대상만 Presentation:

```
[1] design_system 빌드+pack (phase 14 Badge 포함, Trial 5 직후면 build skip 가능)
       ↓
[2] ppt reinstall (Trial 5 lockfile/changes stash) + trial-6-presentation branch 분기
       ↓
[3] Presentation.tsx 8개 부위 교체 (spec §3 매핑) — 시각도 inline 0, layout 허용
       ↓
[4] dev fixture 주입 (더미 slides 3개) + dev server + headless 캡쳐
       ↓
[5] 캡쳐 분석 → H2/H3/H4 검증 → docs/dogfood-trial-6.md
       ↓
[6] phase index 업데이트 + Phase 16 후보 ranking
```

design_system 코드 변경 0, ppt 측만 변경 (trial branch only).

## 2. 기술 선택 근거

- **Presentation 선택**: 사용자 선택 + 3-panel 복잡도 = component 다양성 ↑ = needs 측정 풍부.
- **Badge 첫 dogfood**: phase 14가 진짜 ppt에서 작동하는지 검증. spec/sandbox만으로는 cascade·alignment·inline interaction 진짜 입증 불가.
- **IconButton 부활 시도**: Trial 5에서 Outline-local로 격하한 needs를 Presentation의 *많은 icon-only*에서 재측정. 정직히 부활 OR 격하 유지.
- **8개 교체 (Trial 5 동급)**: 11+ 가능하지만 scope 폭증 회피. 6~8이 needs 측정 정직성·시각 회귀 위험 균형.

## 3. 의존성

- 기존 — React 18·19 dual, @wonik/{tokens,web}, Vite, Tailwind v4, Vitest.
- Headless Chrome.
- 새 의존성 0.

## 4. 아키텍처 결정

### 4.1 inline style 정책 (Trial 4·5 답습)

color/border/radius/padding 시각도 inline 0. layout(width/margin/flex/display)만.

### 4.2 Badge 적용 — 첫 dogfood

`<Badge variant="neutral">{current.layout}</Badge>`. ppt 원본 `px-2 py-0.5 rounded bg-surface border-border`와 비교:
- 우리 Badge: padding 4px 8px (vs ppt 8px/2px — 살짝 큰), radius 5px (vs Tailwind rounded 4px — 거의 동일), inline-flex + tabular-nums.
- 시각 차이가 *자연* OR *어색*인지 정직 측정. ppt slideCount(Home, primary)와 OutlineCard layout(neutral)이 *둘 다* 작동하면 phase 14 ADR-016 입증.

### 4.3 IconButton 부활 측정 방법

Presentation의 icon-only는:
- slide nav prev/next (line 735, 745) — 같은 row, hit area p-1 작음
- slide thumbnail delete (line 142) — hover 시 5×5 rounded-full red icon, 매우 작음
- (그 외 6+개 — 본 trial 측정 outside scope)

Button text/sm + danger/sm 적용 후:
- *자연* → IconButton 격하 유지
- *어색* (hit area 너무 큼, padding 안 맞음, ring 위치 어색 등) → IconButton 부활

### 4.4 dev fixture (더미 slides)

Presentation route(`/presentation/:id`)에 `?fixture=trial-6-dummy` 토글 시:
```ts
if (import.meta.env.DEV && URLSearchParams.get("fixture") === "trial-6-dummy") {
  usePresentationStore.setState({
    currentPresentation: { id: "trial-6-dummy", title: "Trial 6 더미", status: "READY", ... },
    slides: [
      { title: "AI 트렌드", body: [...], layout: "title-and-body" },
      { title: "도입 사례", body: [...], layout: "title-and-body" },
      { title: "결론", body: [...], layout: "title-only" },
    ],
  });
}
```

backend 호출 0, thumbnail 없음(SlideRenderer가 placeholder 처리), 시각 회귀 측정 충분.

## 5. 위험 요소

| # | 리스크 | 영향 | 완화 |
|---|---|---|---|
| R1 | Presentation 1055 lines + 3패널 = 교체 누락/오타 | 컴파일 실패 | 8개 부위만 정확히 — line 번호 spec §3에 명시 |
| R2 | Badge 시각이 ppt 원본 pill과 크게 달라 회귀 인지 | 시각 회귀 | 정책상 *시각 차이도 evidence* — 정직히 캡쳐 후 trial 문서에 기록 |
| R3 | IconButton 부활 측정이 모호 | H3 판정 흐려짐 | 캡쳐 + 정성 매트릭스 4·5번 strict 판정 |
| R4 | dev fixture가 thumbnail URL 부재로 렌더 깨짐 | 캡쳐 무효 | SlideRenderer는 thumbnail 없으면 placeholder. 시각 회귀 측정에는 영향 0 |
| R5 | Presentation route가 store 의존 — fixture가 다른 store property 초기화 안 하면 빈 화면 | 무효 캡쳐 | spec §3 fixture에 필수 properties 명시 |
| R6 | drag-and-drop @dnd-kit 동작이 sortable 영역 교체 안 했음에도 영향받음 | DnD 깨짐 | 본 trial은 시각 캡쳐만, DnD interaction 측정 0. 컴파일·렌더만 통과하면 OK |
| R7 | trial-5-home branch 잔재 / lockfile 충돌 | install 실패 | step0에서 stash + branch 정리 |
| R8 | dev server port 충돌 (Trial 5 learning: 3000~3003 점유) | 캡쳐 못함 | Vite fallback에 의존 (3004+) |

## 6. 테스트 전략

### 6.1 자동
- pnpm test ≥186 passing (회귀 0).
- git diff design_system source/docs = 0 lines.
- spec S1~S7 grep.

### 6.2 시각
- `pkg-out/trial-6-presentation-default.png` — fixture 적용 상태 캡쳐.
- AI(Read tool) 시각 분석 → 매트릭스 8행.

### 6.3 회귀
- design_system 코드 변경 0이라 sandbox/test/다른 phase 영향 0.

## 7. 단계 분할

- **Step 0**: 빌드+pack 확인, ppt branch trial-6-presentation 분기, Presentation 매핑 line 재확인
- **Step 1**: Presentation.tsx 교체 part 1 — local Spinner 제거 + import + 사용 4곳 + Card 적용 + Badge 첫 적용
- **Step 2**: Presentation.tsx 교체 part 2 — Button 적용 (icon-only nav/delete + primary PPTX) + 변경 안 하는 부위(슬라이드 추가, error alert) 메모
- **Step 3**: fixture + 캡쳐 + 매트릭스 채움
- **Step 4**: docs/dogfood-trial-6.md + phases/index.json 보정 + closure

## 8. 산출물

- `phases/15-trial-6-presentation/{spec,plan,tasks,step0~4}.md + index.json`
- `docs/dogfood-trial-6.md`
- `pkg-out/trial-6-presentation-default.png`
- `phases/index.json` phase 15 entry
- ppt `trial-6-presentation` branch (main 머지 안 함)

## 9. 후속 결정

- Phase 16 후보 ranking (Trial 4+5+6 누적):
  - Alert (Trial 4 inconclusive + Trial 5 1 + Trial 6 1 = 3회 → **거의 확정**)
  - IconButton (Trial 4 mid + Trial 5 0 + Trial 6 ?? — 본 trial 결과로 결정)
  - ToggleGroup (Trial 5 1 + Trial 6 0 가능성 — 약함 유지)
  - H4 신규 (drag handle, panel divider 등)
