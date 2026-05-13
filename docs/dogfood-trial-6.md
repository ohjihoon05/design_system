# Dogfood Trial 6: ppt Presentation 페이지 통째 dogfood

**날짜**: 2026-05-13
**대상 product**: ppt (Factory PPT — AI 프레젠테이션 생성기)
**적용 범위**: ppt `frontend/src/pages/Presentation.tsx` (3-panel 슬라이드 편집기)
**목표**: 가설 H2(3-panel cascade 재확인)·H3(Badge 첫 dogfood + Alert 3회 누적 + IconButton 부활 측정)·H4(3-panel 신규 needs) 검증.

## 적용 방식

1. **design_system 빌드 + pack** (phase 14 Badge 포함):
   ```powershell
   pnpm -F @wonik/tokens build && pnpm -F @wonik/web build
   pnpm -F @wonik/tokens pack --pack-destination ./pkg-out
   pnpm -F @wonik/web pack --pack-destination ./pkg-out
   ```

2. **ppt branch**: `trial-6-presentation` (main에서 분기, Trial 5 잔재 stash로 격리). main 머지 안 함.

3. **컴포넌트 교체** (시각도 inline 0, layout className만 허용):

   **Presentation.tsx**:
   - `import { Spinner, Button, Card, Badge } from "@wonik/web"` 추가
   - local `function Spinner({className})` (25 lines) 제거 + 사용 5곳 모두 `<Spinner size="md/lg/sm">`
   - generation/empty placeholder `<div rounded-xl border ... p-16>` → **`<Card padding="lg">`** (Trial 6 첫 Card dogfood — 단 fixture가 status=READY라 시각 불가시)
   - slide layout label `<span px-2 py-0.5 rounded bg-surface border-border>{current.layout}</span>` → **`<Badge variant="neutral">{current.layout}</Badge>`** (**Trial 6 첫 Badge dogfood ✨**)
   - slide nav prev/next icon-only `<button p-1>` → **`<Button variant="text" size="sm" aria-label>`** + svg children
   - slide thumbnail delete (5×5 overlay) → wrapper `<div absolute>` + **`<Button variant="danger" size="sm">`** "x"
   - PPTX download `<button bg-primary>` → **`<Button variant="primary" size="sm">`** + icon + text
   - 그대로 유지: "+ 슬라이드 추가" dashed button (Trial 4 격하 reaffirm), Error alert (Alert 3회째 evidence 누적)

4. **fixture** (dev-only 가드):
   ```ts
   if (import.meta.env.DEV && id === "trial-6-dummy") {
     usePresentationStore.setState({
       currentPresentation: { id, title: "Trial 6 더미 프레젠테이션", status: "READY", slides: [더미 3개], ... },
       isLoading: false, error: null,
     });
   }
   ```
   backend 호출 0, 외부 데이터 0.

5. **캡쳐**:
   ```powershell
   & "C:/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu `
     --screenshot=pkg-out/trial-6-presentation-default.png --window-size=1400,1100 `
     --virtual-time-budget=8000 "http://localhost:3000/presentation/trial-6-dummy"
   ```
   AI(Read tool) PNG 직접 시각 분석.

## 발견사항

### 매트릭스 (8행, 가설 검증)

| # | 항목 | 가설 | 예상 | 실제 (캡쳐 인용) | 결론 |
|---|---|---|---|---|---|
| 1 | 3-panel cascade (left thumb / center preview / right edit) | H2 | Trial 4+5 cascade 일관 재현 | 3패널 모두 dark surface bg + border 일관, Spinner currentColor 흡수, font/radius 일관. 시각 회귀 0. | ✅ |
| 2 | Card variant=surface padding=lg (generation/empty placeholder) | H2 + H3 Card 확장 | 자연 호환 | fixture status=READY로 해당 코드 path 미실행 → **시각 미가시**. 컴파일·구조는 정상. (status="generating" 또는 빈 slides fixture 필요 — Trial 7 후속) | partial ⚠️ |
| 3 | **Badge variant=neutral 첫 dogfood** (slide layout label "title-and-body") | H2 + H3 Badge phase 14 검증 | ppt 원본 inline pill과 시각 호환 | **center info bar에 "title-and-body" Badge 명확히 렌더**. subtle border + surface bg + 정렬 자연. ppt 원본 `px-2 py-0.5 rounded bg-surface border-border` 패턴과 시각상 거의 동일 (우리 padding 4px 8px이 ppt 8px 2px보다 살짝 큰 정도). **첫 dogfood 시각 회귀 0** ✅ | ✅ **phase 14 입증** |
| 4 | Button text/sm 작은 nav icon (prev/next slide) | H3 IconButton 부활 측정 | 어색하면 부활, 자연하면 격하 유지 | center bottom-right에 `< >` chevron 페어 렌더. 컨테이너 padding이 ppt 원본 `p-1`보다 약간 넓음(Button text/sm 자체 padding). 시각상 **약간 sparse 하지만 어색 0** — hit area 오히려 더 명확. | needs ❌ (격하 유지) |
| 5 | Button danger/sm 작은 thumbnail delete (5×5 overlay) | H3 IconButton danger | hover 시 노출 | hover만 노출 — static 캡쳐 미가시. Button danger/sm를 absolute wrapper로 감쌌으나 우리 Button의 내부 padding이 5×5 컨테이너보다 클 가능성. **interactive 측정 필요** — 캡쳐 만으로 단정 못함 | partial ⚠️ (Trial 7 후속) |
| 6 | Button primary/sm PPTX download | H2 | Trial 4·5 동일 일관 | top-right "PPTX 다운로드" — WONIK BLUE primary bg + white text + icon + text gap. ppt 원본 `bg-primary px-3.5 py-1.5 text-xs`와 시각 일관. 회귀 0 | ✅ |
| 7 | "+ 슬라이드 추가" dashed 그대로 유지 (Trial 4 격하 reaffirm) | H3 reaffirm | 1회 더 등장 — 격하 유지 | bottom-left 좌패널 끝 "+ 슬라이드 추가" dashed border + text-muted. 1회 등장 — Trial 4 결정과 일치. 누적: Trial 4 1 + Trial 6 1 = 2회 (약함). | needs ❌ (격하 유지) |
| 8 | Error alert 그대로 유지 (Alert 3회째 evidence) | H3 누적 | Trial 4 inconclusive + Trial 5 1 + Trial 6 1 = **3회 누적** → needs 확정 | error state 캡쳐 못함(fixture status=READY) — 코드상 1회 명확 등장 + role="alert" + 시맨틱 + dismiss 버튼. **누적 3회**. | needs ✅ **확정** |

추가 관찰:
- **Spinner currentColor 패턴**: line 537 `<span text-primary><Spinner size="sm"></span>` wrapper로 색 위임 — Trial 4 답습. ✅
- **ToggleGroup needs**: Presentation에 toggle 패턴 0회. Trial 5 1회로 멈춤 → **약함 유지, YAGNI**.
- **신규 H4 needs**: drag handle(`<DndContext>` `useSortable`), thumbnail vertical list, panel divider(`flex-1` shrink-0), AI chat embedded panel — 3-panel 특유 패턴. 컴포넌트화는 *비싸*고 사용처가 Presentation-only → **컴포넌트 추가 evidence 부족**.

### H2 결론

**ADR-010 cascade가 3-panel 복잡 layout에서도 회귀 0.** Trial 4(list page)·Trial 5(form page)·Trial 6(3-panel editor) — 페이지 성격 3종에서 cascade 입증 완료. Phase 09·10·11·14 closure를 4번째 검증.

### H3 결론 (Trial 4+5+6 누적 ranking)

**우선순위 1 (강한 needs, 누적 3회+)**:
- **Alert/Banner** (Trial 4 inconclusive + Trial 5 1 + Trial 6 1 = **3회 누적**) — **Phase 16 후보 거의 확정**
- **Badge** — phase 14로 *이미 도입, dogfood 입증 완료* (Trial 6 첫 적용 회귀 0)

**우선순위 2 (mid needs, 2회)**:
- "+ 슬라이드 추가" dashed button (Trial 4 1 + Trial 6 1 = 2회) — needs는 약함 그대로 (격하 유지 — outline 우회 충분)

**우선순위 3 (격하·YAGNI)**:
- **IconButton** (Trial 4 mid + Trial 5 0 + Trial 6 partial 격하) — **격하 유지**. Trial 4 위/아래/삭제 + Trial 6 nav/delete가 모두 Button text/sm + danger/sm 우회로 *어색 0~partial* 입증. dedicated IconButton 컴포넌트 추가 evidence 부족.
- **ToggleGroup** (Trial 5 1 + Trial 6 0) — 약함 유지.
- **Card variant=outline w/ dashed** (Trial 5 1 + Trial 6 dashed 또 1회) — 누적 2회지만 outline+dashed는 *시각 약한* needs. YAGNI.

### H4 결론 (3-panel 신규)

- drag handle / sortable thumbnail / panel divider / dense info bar 등 신규 패턴 발견. 단 사용처가 Presentation-only(현재) → 컴포넌트화 evidence 부족. Trial 7+에서 누적 측정 후 결정.

## 결과

- **시각 회귀**: 0 (캡쳐 evidence 1장 + 부분 미가시 케이스 명시)
- **design_system 코드 변경**: 0 lines (trial 원칙 준수)
- **회귀 테스트**: ≥186 passing 유지
- **1단계 결승선과의 관계**: Phase 14 Badge dogfood 입증 (slide layout label에 자연 호환). ADR-010 cascade 4번째 페이지 재입증.

## 다음 phase 후보 (Phase 16)

### 우선순위 1 — Alert/Banner 컴포넌트 추가 (누적 3회, **거의 확정**)
- **Evidence**: Trial 4 Outline error(inconclusive) + Trial 5 Home error 1회 + Trial 6 Presentation error 1회 = 누적 3회 코드상 등장. 모두 `role="alert"` + 색 + 메시지 + dismiss 패턴.
- **다음 스텝**: Phase 16 Alert ADR + spec + 구현. minimum signature 후보:
  ```tsx
  <Alert variant="error" onDismiss={...}>
    error 메시지
  </Alert>
  ```
  variant=error/warning/info/success, dismissable optional, icon optional.

### 우선순위 2 — 보류 (Trial 7까지)
- IconButton, ToggleGroup, Card outline+dashed: 모두 needs 약하거나 격하 — 보류
- H4 신규(drag handle 등): Trial 7+ 누적 후

### 1단계 결승선 진척
- layer A 1차 채움: tokens + Button/Input/Textarea/Checkbox/Switch/Radio/Spinner/Skeleton/Card/**Badge** 도달.
- 다음 Alert 추가 시 11 atoms → **layer A 1차 채움 종료 후보 진입**.
- Alert 다음 단계: **layer A 1차 채움 종료 선언 → layer B(사내 npm registry 배포 인프라) 진입.**

## 산출물

- `pkg-out/trial-6-presentation-default.png` (~42KB) — 3-panel evidence
- `phases/15-trial-6-presentation/{spec,plan,tasks,step0~4}.md + index.json`
- `phases/index.json` phase 15 entry
- ppt repo `trial-6-presentation` branch — Presentation.tsx 컴포넌트 교체 + dev-only fixture 가드. **main 머지 안 함**.

## 절차상 학습

- Presentation 같은 큰 페이지(1055 lines)는 dogfood 매핑을 6~8개로 *strict scope*해야 진행 가능. 모든 inline `<button>` 교체는 scope 폭증.
- fixture가 status=READY일 때 Card replacement(generation placeholder)는 *코드 path 미실행* → 시각 가시 안 됨. **Trial 7에서 status="generating" fixture로 Card 시각 측정 필요**.
- Badge 첫 dogfood가 ppt 원본 inline pill과 *시각 거의 동일* — phase 14 ADR-016 결정(radius.sm/space[1]/space[3]/fontSize.label)이 정확히 ppt에 맞음. preemption 없는 evidence-driven decision의 검증.
- IconButton 격하 결정(Trial 5)이 Trial 6 Button text/sm 부드러운 결과로 *재확정*. 1단계 컴포넌트 목록에 IconButton 추가 안 함.
