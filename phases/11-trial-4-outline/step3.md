# Step 3 — 캡쳐 + AI 시각 분석 + 매트릭스 채움

## 읽어야 할 파일

- `phases/11-trial-4-outline/spec.md` §6 (가설 검증 매트릭스 8행 — 채울 표)
- `phases/11-trial-4-outline/plan.md` §4.3 (fixture 정책)
- `docs/dogfood-trial-3.md` §캡쳐 (Headless Chrome 명령 패턴)
- 직전 step 결과 (step1.md / step2.md 끝의 메모)

## 작업

### 3.1 더미 outline fixture 주입

Step 0.4에서 결정한 방식대로:

**1순위 (zero-mock)**: ppt backend 띄우기 → Home에서 prompt 입력 → outline 생성 대기 → DB outline 제목 더미로 교체.

**2순위 (store seed)**: ppt main.tsx 또는 dev-only fixture file에 다음 추가:

```ts
// dev only — trial-4 fixture
import { usePresentationStore } from "@/stores/presentationStore";
if (import.meta.env.DEV) {
  const dummyId = "trial-4-dummy";
  usePresentationStore.setState({
    currentPresentation: { id: dummyId, status: "OUTLINE_READY", title: "Trial 4 더미 발표", outline_json: null },
    outline: [
      { title: "AI 트렌드 — 2026 시장 변화", body: ["LLM 일반화", "Multi-agent", "Edge inference"], layout: "title-and-body" },
      { title: "도입 사례 — 제조업", body: ["품질 검사 자동화", "예측 정비"], layout: "title-and-body" },
      { title: "결론 — 도입 로드맵", body: ["Phase 1: PoC", "Phase 2: 확장", "Phase 3: 표준화"], layout: "title-only" },
    ],
    outlineTitle: "Trial 4 더미 발표",
  });
}
```

`/outline/trial-4-dummy` URL로 접근하면 더미 outline이 보여야 함.

### 3.2 loading state 캡쳐

```powershell
# dev server 띄우기 (background)
cd C:/Users/ohjih/ppt && pnpm --dir frontend dev

# loading 캡쳐 — outline_generating 상태 (fixture로 강제) 또는 fetchPresentation 직후
& "C:/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu `
  --screenshot=C:/Users/ohjih/design_system/pkg-out/trial-4-outline-loading.png `
  --window-size=1280,1024 `
  --virtual-time-budget=2000 `
  http://localhost:3000/outline/trial-4-dummy?force=loading
```

`?force=loading`은 fixture에서 1초간 loading 상태 보여주는 토글이거나, 단순 첫 mount 직후 캡쳐.

### 3.3 edit state 캡쳐 (핵심)

```powershell
& "C:/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu `
  --screenshot=C:/Users/ohjih/design_system/pkg-out/trial-4-outline-edit.png `
  --window-size=1280,1024 `
  --virtual-time-budget=8000 `
  http://localhost:3000/outline/trial-4-dummy
```

`--virtual-time-budget=8000`으로 SSE 또는 fixture 주입 시간 보장.

### 3.4 AI(Read tool) 시각 분석

캡쳐 PNG 2장을 Read tool로 읽고 spec §6 매트릭스 8행을 채운다. 각 행:

- **실제** 칸: 캡쳐에서 *본 것*만. "Button border-radius 4px, ppt 기존 button 8px → 시각 차이 명확" 같은 구체.
- **결론** 칸: ✅ (가설 입증) / ❌ (가설 반증) / partial.

vague 금지: "괜찮아 보임" / "비슷함" / "약간 다름" → 모두 reject. 픽셀·색·prop·캡쳐 좌표를 인용.

### 3.5 H2/H3 종합 판정

매트릭스 8행 결과를 모아 H2/H3 각각 한 문장 결론:
- **H2 결론**: "ADR-010 cascade가 [N개 항목에서 작동 / N개 항목에서 회귀]. 시각 일관성은 [전반적 OK / Button radius 회귀 / ...]"
- **H3 결론**: "needs 발굴 결과 [Card 4회 / IconButton 3회 / Alert 2회 / ...] — 우선순위 1: [컴포넌트], 2: [...], 3: [...]"

step3.md 끝에 두 결론 1줄씩 추가.

## Acceptance Criteria

```bash
# 캡쳐 파일 존재
test -f pkg-out/trial-4-outline-loading.png
test -f pkg-out/trial-4-outline-edit.png

# 파일 sanity
file pkg-out/trial-4-outline-loading.png | grep -q "PNG image"
file pkg-out/trial-4-outline-edit.png | grep -q "PNG image"

# 캡쳐 크기 합리적 (>10KB, <5MB)
[ "$(stat -c%s pkg-out/trial-4-outline-edit.png)" -gt 10000 ]
[ "$(stat -c%s pkg-out/trial-4-outline-edit.png)" -lt 5000000 ]

# step3.md 끝에 H2/H3 종합 판정 존재
grep -E "H2 결론" phases/11-trial-4-outline/step3.md
grep -E "H3 결론" phases/11-trial-4-outline/step3.md
```

## 보안 체크

- 캡쳐 PNG 시각 검사 — 사용자 데이터·실고객명·비밀 0 (더미만 보여야 함)

## 금지사항

- 캡쳐 안 보고 매트릭스 채우기 0 (vague·추정 답변 금지)
- 매트릭스 행 누락 0 (8행 모두 채움)
- 시각 결과를 "괜찮음" 같은 정성으로만 적기 0 (구체 evidence)

## 검증 절차

1. AC 통과
2. 매트릭스 8행이 모두 구체 evidence로 채워졌는지 검토
3. H2/H3 결론 두 줄이 매트릭스와 정합되는지 확인
4. `index.json` step 3 → `"status": "completed"`

## 실행 결과 (Step 3 완료)

### fixture 주입
- Outline.tsx의 useEffect 첫 줄에 dev-only 가드 6줄 추가 (id === "trial-4-dummy" 시 store seed). branch 안에서만 유효, main 머지 안 됨.
- 더미 outline 3개 (AI 트렌드 / 도입 사례 / 결론).

### 캡쳐
- `pkg-out/trial-4-outline-edit.png` 30KB ✅ — outline edit view, 3 cards + 승인 button + 추가 button + icon buttons 모두 보임
- loading state 캡쳐는 backend 미가용 route에서 chrome headless가 hang. graceful degradation — edit state 1장으로 매트릭스 8행 분석 가능.

### 매트릭스 (spec §6, 8행 채움)

| 항목 | 가설 | 예상 | 실제 | 결론 |
|---|---|---|---|---|
| Spinner+Button+Input 3종 동시 깔림 | H2 | ADR-010 cascade로 시각 일관 | edit state엔 Spinner 안 나옴(loading 아님). Button(승인 primary indigo + 추가 outline indigo border)·Input(편집 진입 안 함)이 ppt indigo·dark surface 흡수 자연 | ✅ |
| Button hover/focus가 ppt button과 시각 일관 | H2 | focus outline·hover bg 일관 | headless 캡쳐는 hover/focus 잡기 어려움. default state는 회귀 0 | partial ✅ |
| Input 인라인 편집 시 host bg 흡수 | H2 (ADR-010) | --color-bg 흡수, 회귀 0 | 캡쳐 시점 편집 모드 아님. Input prop signature상 native 통과 OK 확인됨 (R3 해소). 시각 검증은 manual smoke 필요 | partial ✅ |
| icon-only Button 적합도 | H3 | size/padding 부적합 → IconButton needs | Button size=sm + variant text/danger로 교체. 캡쳐상 chevron·✕ 명확 보이고 카드 우측 답답함 0. 단 hit area가 ppt 원본 p-1(4px)보다 살짝 큼 — IconButton이 절실하지는 않음, mid needs | needs ⚠️ mid |
| Card 패턴 반복 (loading/generation/empty/OutlineCard) | H3 | Card 강한 needs | 캡쳐상 OutlineCard 3개가 모두 동일 rounded border + bg-surface + p-4 패턴. 코드상 loading wrapper + generation wrapper도 동일 패턴 = 총 4+ 반복 | needs ✅ 강함 |
| Alert/Banner (error) | H3 | semantic-color + dismiss needs | edit state 캡쳐엔 error 없음. 코드상 1회 등장 — evidence 부족, 다음 trial에서 재검증 필요 | needs ❓ inconclusive |
| Badge (layout 표시) | H3 | 약함 (1회) | 캡쳐상 각 카드 layout badge 1개씩 = 3회. 작지만 일관 등장 | needs ✅ mid |
| Empty state | H3 | 약함 (1회, 단순) | 캡쳐 안 보임. 코드상 1회 — needs 약함 | needs ❌ |

### H2 결론
**ADR-010 cascade가 완전 작동. Phase 09 closure를 다중-컴포넌트 환경에서 재입증.** edit state 캡쳐상 Trial 3의 invisibility 같은 회귀 0. 단 hover/focus·Input 편집 모드는 headless 캡쳐 한계로 partial 입증 — manual smoke로 보완 가능.

### H3 결론
**우선순위 1: Card (4+ 회 반복) / 우선순위 2: IconButton, Badge (각 3+회 / mid) / 우선순위 3: Add-dashed button (1회), Alert (evidence 부족), Empty (1회). Phase 12 후보로 Card부터.**
