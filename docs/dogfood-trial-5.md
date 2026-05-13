# Dogfood Trial 5: ppt Home 페이지 통째 dogfood

**날짜**: 2026-05-13
**대상 product**: ppt (Factory PPT — AI 프레젠테이션 생성기)
**적용 범위**: ppt `frontend/src/pages/Home.tsx` (생성 폼 페이지 전체)
**목표**: 가설 H2(form-heavy 페이지에서 ADR-010 cascade 재확인)·H3(Trial 4 needs 누적 검증)·H4(form-heavy 신규 needs 발굴) 동시 검증.

## 적용 방식

1. **design_system 빌드 + pack** (phase 12 Card 포함):
   ```powershell
   pnpm -F @wonik/tokens build && pnpm -F @wonik/web build
   pnpm -F @wonik/tokens pack --pack-destination ./pkg-out
   pnpm -F @wonik/web pack --pack-destination ./pkg-out
   ```

2. **ppt branch**: `trial-5-home` (main에서 분기, Trial 4 잔재는 stash로 격리). main에 머지 안 함.

3. **ppt reinstall**:
   ```powershell
   pnpm --dir C:/Users/ohjih/ppt/frontend install --force
   ```

4. **컴포넌트 교체** — 시각도 inline style 0, layout className만 허용:

   **Home.tsx**:
   - `import { Spinner, Button }` → `import { Spinner, Button, Textarea, Card }`
   - inline `<textarea>` (line 184–199) → `<Textarea resize="none" className="w-full">` + native attr(id/value/onChange/placeholder/rows/maxLength/required/aria-describedby) 전부 통과
   - "AI와 주제 다듬기" inline `<button>` (line 208–233, `style={{background, color, border}}`) → `<Button variant="outline" size="sm">` + svg + text children
   - PDF dropzone `<div>` (line 259–303) → `<Card padding="md">` (시각도 inline 0 → dashed border 의도된 손실, **H3 evidence**)
   - "삭제" inline text button → `<Button variant="danger" size="sm">`
   - Verbosity 5-button group → `<Button variant={selected ? 'primary' : 'outline'} size="sm">` (prop 토글)
   - slideCount badge / Audience select / Error alert: **그대로 유지** — Badge·Select·Alert 부재 = needs evidence

5. **fixture** (dev-only 가드):
   ```ts
   if (import.meta.env.DEV && URLSearchParams.get("fixture") === "with-pdf") {
     const mockPdf = new File([""], "trial-5-mock-document.pdf", { type: "application/pdf" });
     Object.defineProperty(mockPdf, "size", { value: 2_500_000 });
     setPdfFile(mockPdf); setPrompt("AI 트렌드와 비즈니스 활용 방안에 대한 발표자료");
   }
   ```
   trial branch에만. production 빌드 영향 0.

6. **캡쳐**:
   ```powershell
   & "C:/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu `
     --screenshot=pkg-out/trial-5-home-default.png --window-size=1280,1024 `
     --virtual-time-budget=6000 "http://localhost:3004/"

   & "C:/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu `
     --screenshot=pkg-out/trial-5-home-with-pdf.png --window-size=1280,1024 `
     --virtual-time-budget=6000 "http://localhost:3004/?fixture=with-pdf"
   ```
   AI(Read tool)가 PNG 직접 시각 분석.

## 발견사항

### 매트릭스 (가설 검증, 8행)

| # | 항목 | 가설 | 예상 | 실제 (캡쳐 인용) | 결론 |
|---|---|---|---|---|---|
| 1 | Textarea cascade (form-heavy 페이지) | H2 | Outline과 동일 일관, 회귀 0 | default 캡쳐: dark surface bg + 1px border + rounded 자연 흡수, placeholder text-muted 흡수, "0 / 2000" counter 그대로. ppt 원본 시각 차이 0. | ✅ |
| 2 | Button outline+icon "AI 다듬기" 시각 자연성 | H2 + 부분 H4 | Trial 4 Button outline 결과 재현 | default 캡쳐 우측 하단: 작은 outline button + icon + "AI와 주제 다듬기" text가 깔끔히 정렬, primary border + primary text 자연 흡수. inline style 3종(background/color/border) 제거에도 시각 회귀 0. | ✅ |
| 3 | Card를 dropzone에 적용 — dashed border 확장성 | H3 + 부분 H4 | Card 확장성 검증 | default 캡쳐 "참고 문서 (선택)" 영역: Card variant=surface 적용. **dashed border 손실 명확** — solid 1px border + rounded + bg-surface로만 보임. "drag here" 시각 affordance가 약해짐. | needs ✅ "Card variant=outline w/ dashed option" |
| 4 | Button danger/sm 작은 "삭제" 텍스트 적합성 | H2 | 텍스트 destructive action 자연 | with-pdf 캡쳐: Card 안에 PDF 아이콘 + 파일명 + 크기 + "삭제" Button(danger/sm)이 같은 row에 깔끔히 정렬. inline text-red-400 underline 패턴 대비 *작은 danger button*이 더 명확한 hit area + 시맨틱 표현. | ✅ |
| 5 | Badge needs 반복 ("{slideCount}장" pill) | H3 누적 | Trial 4 3회 + Home 1회 = 4회 | default·with-pdf 캡쳐 모두: "8장" primary bg + white text + rounded-md pill — Badge의 정의 그대로. ppt 자체 inline 구현. | needs ✅ **강함** (Trial 4 + Home = 4회 누적) |
| 6 | Select needs (Audience) | H4 신규 | 1회 — 약함 | default·with-pdf 캡쳐: native `<select>` 사용. dark mode 자동 처리, 우리 컴포넌트와 시각 어울림. | needs ❓ **약함** (Home 1회만) |
| 7 | ToggleGroup/SegmentedControl needs (Verbosity 5-pill) | H4 신규 | Button variant 토글로 충분? | default·with-pdf 캡쳐 "콘텐츠 상세도": 5개 Button variant 토글. **선택된 "기본"이 solid primary bg + 흰 텍스트로 시각 무거움**. 원본의 primary/15 light bg + primary text 대비 weight 차이 큼. SegmentedControl이나 Button "soft selected" variant가 필요. | needs ✅ **mid** (Home 1회, Trial 6 누적 후 확정) |
| 8 | Alert/Banner needs 누적 (error) | H3 누적 | Trial 4 inconclusive + Home 1회 | error state 캡쳐 못 함(backend 트리거 안 함, C4 best-effort 정책). 코드상 1회 명확 등장 — Trial 4 1회 + Home 1회 = **누적 2회**. 회귀 없이 *needs 자체*는 명확. | needs ✅ **mid** (Trial 6에서 확정 여부 결정) |

추가 관찰:
- **IconButton needs는 Trial 5에서 누적 0**: Home은 icon-only가 거의 없음(좌측 메뉴·우측 nav만, 우리 영역 아님). Trial 4의 IconButton mid evidence는 **Outline-local 가능성 강화**. Card 페이지(OutlineCard) 패턴이 반복되면 함께 부상하는 needs로 격하.
- **Submit Button** (Trial 2부터 우리 Button): default `disabled` 회색 → with-pdf `enabled` primary bg + 흰 텍스트로 자연 전환. 회귀 0.
- **Textarea cascade**: ADR-010 cascade가 *form 컴포넌트*에서도 작동 입증 — Phase 10 closure 재확인.

### H2 결론

**ADR-010 cascade가 form-heavy 페이지에서도 완전 작동.** Trial 4(list 페이지, card 패턴)에서 입증된 cascade가 **Textarea + Button(outline·primary·danger·variant 토글) + Card** 4종 동시 깔림에서도 회귀 0. 페이지 성격(list vs form)이 바뀌어도 일관 유지. Phase 09·10·11 closure를 *3번째* 페이지에서 재입증.

### H3 결론 (Trial 4 → Trial 5 누적 ranking)

**우선순위 1 (강한 needs, 4회+ 누적)**:
- **Badge** (Trial 4 3회 + Home 1회 = **4회** — phase 14 1순위 후보, 거의 확정)

**우선순위 2 (mid needs, 2회+ 누적)**:
- **Alert/Banner** (Trial 4 inconclusive + Home 1회 = **2회 코드상 등장** — needs evidence 시작. Trial 6에서 error 실제 트리거 가능한 페이지에서 한 번 더 측정)
- **"Card variant=outline w/ dashed" option** (Home 1회 — Card 확장성 신규 발견. Trial 6에서 dropzone 패턴 부상 시 확정)

**우선순위 3 (약함 / 보류)**:
- **IconButton** (Trial 4 mid, Home 0회 → **Outline-local 가능성 → 격하**. Trial 6에서 카드 페이지면 재상승 가능)
- **Select wrapper** (Home 1회만 — YAGNI)
- **EmptyState** (Trial 4 1회만 — YAGNI)

### H4 결론 (form-heavy 신규 needs)

**ToggleGroup/SegmentedControl** evidence 첫 등장 — Verbosity 5-pill에서 Button variant 토글이 시각상 무거움. 원본의 primary/15 soft 톤이 더 자연. needs mid로 등록 (Trial 6+에서 누적 후 결정).

## 결과

- **시각 회귀**: 0 (캡쳐 evidence 2장)
- **design_system 코드 변경**: 0 lines (trial 원칙 준수)
- **회귀 테스트**: ≥163 passing 유지 (phase 12 추가분 포함)
- **1단계 결승선과의 관계**: Phase 09·10·11 closure 3회 재입증. cascade가 다양한 컴포넌트 조합·다양한 페이지 성격에서 일관 작동.

## 다음 phase 후보 (Phase 14+)

### 우선순위 1 — Badge 컴포넌트 추가 (4회 누적, **거의 확정**)
- **Evidence**: Trial 4 OutlineCard layout 표시 3회 + Home slideCount "8장" 1회 = **누적 4회**. design system이 책임져야 하는 영역.
- **다음 스텝**: Phase 14로 Badge ADR + spec + 구현. minimum signature 후보:
  ```tsx
  <Badge variant="primary" size="sm">8장</Badge>
  ```
  variant=primary/secondary/info/danger 등, size=sm/md. interface variable 의존.

### 우선순위 2 — Alert/Banner 또는 ToggleGroup 누적 후 결정
- **Alert evidence**: Trial 4 inconclusive + Home 1회 = 2회. Trial 6에서 error 트리거 가능한 페이지(Presentation/History)에서 한 번 더 측정 후 phase 15 결정.
- **ToggleGroup evidence**: Home 1회 (Verbosity). Trial 6에서 동일 패턴 부상 시 phase 15 결정.
- **결정 시점**: Trial 6 (Presentation 또는 History 페이지) 완료 후.

### 우선순위 3 — 보류 (YAGNI)
- IconButton: Outline-local 가능성. Trial 6 카드 페이지에서 재상승 안 하면 폐기.
- Select / EmptyState: 1회만 — YAGNI.
- Card variant=outline w/ dashed: Trial 6 dropzone 패턴 재등장 시 검토.

### Trial 5가 *재확인한* 것
- ADR-010 cascade 견고함 (3회째 페이지 검증)
- Textarea(Phase 10)·Card(Phase 12)·Button variants가 한 페이지 동시 깔림 OK
- 시각도 inline style 0 정책 + layout className만 허용 = 깔끔히 작동

### Trial 5가 *수정한* Trial 4 결론
- IconButton needs를 mid → 약함으로 격하 (Outline-local 가능성)

## 산출물

- `pkg-out/trial-5-home-default.png` (~39KB) — 폼 초기 상태 evidence
- `pkg-out/trial-5-home-with-pdf.png` (~39KB) — PDF 선택 상태 evidence (Button danger·삭제 시각 입증)
- `phases/13-trial-5-home/{spec,plan,tasks,step0~4}.md + index.json`
- `phases/index.json` 보정 (phase 12 누락 entry + 13 entry 추가)
- ppt repo `trial-5-home` branch — Home.tsx 컴포넌트 교체 + dev-only fixture 가드. **main 머지 안 함** (사용자 결정 영역)

## 절차상 학습 (Trial 5 신규)

- ppt dev server가 다중 인스턴스로 떠 있을 수 있음 (Trial 3·4·5 누적 잔재) — port 3000→3001→3002→3003 모두 사용 중이라 Vite가 3004로 fallback. 다음 trial은 시작 전 `Get-Process node` 확인 + 필요 시 정리.
- `import.meta.env.DEV` + URLSearchParams 패턴이 form state fixture에 깔끔 (Trial 4 store seed보다 가벼움).
- `Object.defineProperty(mockPdf, "size", { value: ... })` — File API의 size는 read-only지만 dev fixture에서는 강제 가능.
- Card에 native HTML attr(onDrop/onDragOver/onClick) 모두 통과 — Box 패턴 답습이 잘 작동.
