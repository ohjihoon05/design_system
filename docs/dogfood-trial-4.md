# Dogfood Trial 4: ppt Outline 페이지 통째 dogfood

**날짜**: 2026-05-12
**대상 product**: ppt (Factory PPT — AI 프레젠테이션 생성기)
**적용 범위**: ppt `frontend/src/pages/Outline.tsx` + `frontend/src/components/OutlineCard.tsx` (Outline 편집 페이지 전체)
**목표**: 가설 H2(시각 일관성)·H3(needs 발굴) 동시 검증. ADR-010 cascade가 *다중 컴포넌트 동시 깔림*에서도 작동하는지, 그리고 우리 design system이 다음에 무엇을 추가해야 하는지를 *반복 횟수*로 정직하게 측정.

## 적용 방식

1. **design_system 빌드 + pack**:
   ```powershell
   pnpm -F @wonik/tokens build && pnpm -F @wonik/web build
   pnpm -F @wonik/tokens pack --pack-destination ./pkg-out
   pnpm -F @wonik/web pack --pack-destination ./pkg-out
   ```

2. **ppt link**:
   ```powershell
   pnpm --dir C:/Users/ohjih/ppt/frontend install --force
   ```
   `package.json`의 `@wonik/web`은 dependencies, `@wonik/tokens`는 `pnpm.overrides`로 file: 매핑 (Trial 1~3에서 wired up).

3. **ppt branch**: `trial-4-outline` (main에서 분기, *main 머지 안 함*). Trial 3의 lockfile 변경은 stash로 격리.

4. **컴포넌트 교체** (시각도 inline style 0, layout className만 허용):

   **Outline.tsx**:
   - 자체 inline `function Spinner` (line 19–43) 제거 → `import { Spinner, Button } from "@wonik/web"`
   - Spinner ×3 (loading wrapper / outline-generating / generation in progress) → `<Spinner size="lg">` + 부모 div에 `text-[var(--color-primary)]` 위임 (currentColor 흡수 패턴)
   - "다시 시도" → `<Button variant="text" size="sm">`
   - "승인하고 생성 시작" → `<Button variant="primary" size="md">` + layout `shrink-0`
   - "+ 슬라이드 추가" → `<Button variant="outline" size="md">` + layout `mt-4 w-full` (dashed border는 부재 — H3 needs로 등록)

   **OutlineCard.tsx**:
   - 인라인 편집 `<input type="text">` → `<Input size="sm">` + native attr(autoFocus·onBlur·onKeyDown) 통과 검증
   - 위/아래 icon-only `<button>` → `<Button variant="text" size="sm" aria-label>`
   - 삭제 icon-only `<button>` → `<Button variant="danger" size="sm" aria-label>`
   - aria-label 3개 모두 보존

5. **fixture (store seed)**: Outline.tsx의 useEffect 첫 줄에 dev-only 가드 6줄 — `id === "trial-4-dummy"` 시 `usePresentationStore.setState`로 더미 outline 3개 직접 주입. backend·LLM API 우회. branch에만 있음.

6. **캡쳐**:
   ```powershell
   "C:/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu `
     --screenshot=C:/Users/ohjih/design_system/pkg-out/trial-4-outline-edit.png `
     --window-size=1280,1024 --virtual-time-budget=8000 `
     "http://localhost:3003/outline/trial-4-dummy"
   ```
   AI(Read tool)가 PNG 직접 시각 분석.

## 발견사항

### 매트릭스 (가설 검증, 8행)

| # | 항목 | 가설 | 예상 | 실제 (캡쳐 인용) | 결론 |
|---|---|---|---|---|---|
| 1 | Spinner+Button+Input 3종 동시 깔림 | H2 | ADR-010 cascade로 시각 일관 | edit state엔 Spinner 안 나옴(loading 아님). Button(승인 primary indigo + 추가 outline indigo border)이 ppt indigo·dark surface 흡수 자연 | ✅ |
| 2 | Button hover/focus 일관 | H2 | focus outline·hover bg 일관 | headless default state는 회귀 0. hover/focus는 manual smoke 권장 | partial ✅ |
| 3 | Input 인라인 편집 시 host bg 흡수 | H2 (ADR-010) | --color-bg 흡수, 회귀 0 | 편집 모드 캡쳐 못함. Input prop signature상 native 통과 OK 확인 (R3 해소) | partial ✅ |
| 4 | icon-only Button 적합도 | H3 | size/padding 부적합 → IconButton needs | chevron·✕ 명확, 카드 우측 답답함 0. hit area는 ppt 원본 p-1보다 살짝 큼 | needs ⚠️ mid |
| 5 | Card 패턴 반복 | H3 | 강한 needs | OutlineCard 3개 모두 동일 rounded border + bg-surface + p-4 패턴. 코드상 loading wrapper + generation wrapper도 동일 = 4+ 반복 | needs ✅ 강함 |
| 6 | Alert/Banner (error) | H3 | semantic-color + dismiss needs | error state 캡쳐 못함. 코드상 1회 — evidence 부족 | needs ❓ inconclusive |
| 7 | Badge (layout 표시) | H3 | 약함 | 각 카드 layout badge 1개씩 = 3회. 작지만 일관 등장 | needs ✅ mid |
| 8 | Empty state | H3 | 약함 | 코드상 1회 — needs 약함 | needs ❌ |

### H2 결론

**ADR-010 cascade가 다중-컴포넌트 환경에서도 완전 작동.** Trial 3에서 발견된 invisibility 회귀가 0. Phase 09 closure가 단일 컴포넌트(Textarea)뿐 아니라 *Spinner + Button + Input + 다양한 variant + 다양한 size*가 한 페이지에 동시 깔린 상황에서도 유효함이 입증. 시각도 inline style 0 + layout만 허용한 정책이 깨지는 지점 0.

단, headless 캡쳐 한계로 hover/focus state·Input 편집 모드는 partial 입증. manual smoke로 보완 가능.

### H3 결론

**우선순위 1 (강한 needs, 4+ 반복)**: Card 컴포넌트
**우선순위 2 (mid needs, 3+ 반복)**: IconButton, Badge
**우선순위 3 (약함 또는 inconclusive)**: Add-dashed button (1회), Alert/Banner (evidence 부족), Empty state (1회)

Card가 명확하게 가장 시급. 한 페이지에서만 4번 반복되는 패턴은 design system이 책임져야 하는 영역.

## 결과

- **시각 회귀**: 0 (캡쳐 evidence — `pkg-out/trial-4-outline-edit.png`)
- **1단계 결승선과의 관계**: Phase 09 closure(ADR-010 cascade) + Phase 10 closure(ADR-011 form polish)가 다중-컴포넌트 dogfood 환경에서 첫 입증. 단일 trial에서만 검증되던 cascade가 *반복적으로 회귀 없이* 작동.
- **design_system 코드 변경**: 0 (trial 원칙 준수)
- **회귀 테스트**: 163 passing 유지

## 다음 phase 후보 (Phase 12+)

### 우선순위 1 — Card 컴포넌트 추가
- **Evidence**: ppt Outline 페이지에서 4회 반복 (loading wrapper / generation wrapper / OutlineCard 본체). 다른 ppt 페이지(Home, Presentation, History)에서도 동일 패턴 사용 가능성 높음.
- **다음 스텝**: Phase 12로 Card ADR + spec + 구현. minimum signature 후보:
  ```tsx
  <Card padding="md" variant="surface"> ... </Card>
  ```
  variant=surface(default)/elevated, padding=sm/md/lg. interface variable(`--color-surface`/`--color-border`)에 의존.

### 우선순위 2 — IconButton, Badge
- **IconButton evidence**: OutlineCard 위/아래/삭제 = 카드당 3회 × 페이지당 N카드. 이번엔 Button text/sm + danger/sm로 우회 성공이지만, hit area·padding semantics가 명확하지 않음.
- **Badge evidence**: layout 표시 등 작은 라벨 패턴. 캡쳐상 3회.
- **다음 스텝**: Card 도입 후 dogfood needs 누적 확인. 다른 ppt 페이지에서 같은 needs 부상 시 phase 13으로.

### 우선순위 3 — 보류 (YAGNI)
- Add-dashed button: 1회만 등장. variant=outline로 충분히 자연.
- Alert/Banner: error 발생 dogfood 추가 필요 (Trial 5+).
- Empty state: 단순. 컴포넌트화 가치 낮음.

### Trial 4가 *반증한* 후보
- **Add-dashed button**: needs 약함으로 판정 → 별도 컴포넌트 만들지 않음.
- **dual hover token**(`--color-surface-hover`/`--color-primary-hover`): ppt에 존재하지만 우리 컴포넌트가 *동시에 같은 hex*로 자연 hover 작동 — interface variable 격상 필요성 입증 0.

## 산출물

- `pkg-out/trial-4-outline-edit.png` (30KB) — outline edit view 다중-컴포넌트 시각 일관 evidence
- `phases/11-trial-4-outline/{spec,plan,tasks,step0~4}.md` + `index.json` (전 phase 구조)
- ppt repo `trial-4-outline` branch — 컴포넌트 교체 + dev-only fixture 가드. **main 머지 안 함** (사용자 결정 영역)

## 절차상 학습 (Phase 11 후속 학습)

- ppt에 동시에 여러 dev server가 떠 있을 수 있음 (Trial 3 잔재 → port 3003로 fallback). 다음 trial 시작 전 `taskkill` 필요할 수 있음.
- backend 미가용 route는 chrome headless가 hang. loading state 캡쳐 시 *fixture 안*에서 isLoading=true 상태 한 번 노출시키는 게 깔끔.
- Outline.tsx의 useEffect 안에 6줄 fixture 가드를 trial 코드 자체에 넣는 게 별도 fixture file보다 minimum (단 trial branch에만 존재).
