# Phase 13 — Trial 5: ppt Home 페이지 dogfood (spec.md)

> autopilot PHASE 1 (SPECIFY) 산출물.

## 1. 목표

ppt `Home.tsx` 한 페이지(생성 폼)를 통째로 dogfood해 세 가지 가설을 동시 검증한다.

- **H2 (시각 일관성, 재확인)**: Trial 4(Outline 페이지, card-list 패턴)에서 입증된 ADR-010 cascade가 *form-heavy* 페이지(textarea + 다양한 input + submit)에서도 동일하게 작동하는지. 페이지 성격이 바뀌어도 일관 유지되는가.
- **H3 (needs 발굴, 누적)**: Trial 4가 ranking한 needs(Card 강함, IconButton·Badge mid, Alert inconclusive)가 *다른 페이지*에서도 반복되는지 정직히 측정. 반복되면 needs 확정, 안 되면 page-local needs로 격하.
- **H4 (예측 외 needs, 신규)**: form 중심 페이지가 드러내는 *Trial 4가 보지 못한* needs (Textarea 회귀, ToggleGroup/SegmentedControl, native Select wrapper 등) 발굴.

## 2. 사용자 (누가 쓰나)

- **1차**: 원익IPS 사내 개발자. dogfood로 ranking된 needs는 다음 phase 14+의 컴포넌트 추가 결정 input.
- **2차 (간접)**: ppt 사용자 — Home 페이지 회귀 0이어야 trial이 valid. trial branch로 격리하므로 main 영향 0.

## 3. 범위 (in-scope)

design_system repo:
- `phases/13-trial-5-home/` 폴더 (spec.md/plan.md/tasks.md/step{0,1,...}.md/index.json)
- `docs/dogfood-trial-5.md` 신규 — 발견사항 정리
- `pkg-out/trial-5-home-*.png` — 캡쳐 evidence
- `phases/index.json` 업데이트 — phase 12 누락 entry 추가 + phase 13 entry 추가

ppt repo (별도 branch `trial-5-home`):
- `frontend/src/pages/Home.tsx`: 아래 교체 매핑대로 8개 부위 처리.

| # | line | 현재 | 처리 |
|---|---|---|---|
| 1 | 184–199 | inline `<textarea>` | **`@wonik/web` Textarea로 교체** (H2 form-heavy 페이지 cascade) |
| 2 | 208–233 | "AI와 주제 다듬기" inline `<button>` | **Button `variant="outline" size="sm"` + svg child** (H2 + icon-with-text 자연성 확인) |
| 3 | 259–303 | PDF drop zone (dashed border + hover) | **`@wonik/web` Card 적용 시도** (`variant="surface" padding="md"` + 부모 className으로 dashed border 보정) — Card 확장성·dashed 케이스 H3 evidence |
| 4 | 288–298 | "삭제" inline text button | **Button `variant="danger" size="sm"`** (또는 text — step에서 결정) |
| 5 | 316–324 | "{slideCount}장" rounded pill | **그대로 유지 (Badge 없음)** — H3 needs evidence 누적: Trial 4의 3회 + Home 1회 |
| 6 | 356–368 | `<select>` Audience | **그대로 유지 (Select 없음)** — H4 신규 needs (1회) |
| 7 | 376–391 | Verbosity 5-button toggle group | **`@wonik/web` Button + 부모 className으로 selected 상태 구현** (시각도 inline 0, ToggleGroup needs H4 evidence) |
| 8 | 395–409 | Error alert (red bg + dismiss) | **그대로 유지 (Alert 없음)** — H3 needs 누적: Trial 4 inconclusive + Home 1회 = evidence 시작 |

inline style 정책: Trial 4와 동일. 시각도(color/border/radius/padding) inline style 0. layout(width/margin/flex/display)만 허용.

데이터: 캡쳐 evidence는 공개 가능 더미 입력 ("AI 트렌드 발표자료 만들어줘" 등). 실데이터·실고객명 0.

## 4. 범위 외 (out-of-scope) — "이건 안 한다"

- **design_system 코드 변경 금지** — `packages/`, `apps/web-sandbox/`, `CLAUDE.md`, `docs/PRD.md`/`ARCHITECTURE.md`/`ADR.md`/`UI_GUIDE.md` 모두 0. trial 원칙(Trial 1~4 답습).
- **새 컴포넌트 추가 금지** — Badge·Alert·Select·ToggleGroup needs가 강해도 본 trial은 *발굴*만. 추가 결정은 phase 14+.
- **새 토큰 추가 금지** — slop·신규 색·spacing 추가 0.
- **ppt 측 시각도 보정 `style` 금지** — color/border/radius/padding inline 0. layout(width/margin/flex/display)만 예외.
- **`tokens.css` import 금지** — ADR-010 cascade가 검증 대상.
- **ppt 측 `--color-*` 변수 이름 변경 금지** — host 변경은 trial 영역 아님.
- **여러 페이지 동시 교체 금지** — Home 한 페이지만. Outline은 Trial 4가 완료. Presentation/History는 후속 trial.
- **PromptRefineChat 컴포넌트 내부 교체 금지** — 본 trial은 Home.tsx 본체만. nested 컴포넌트는 별도 trial.
- **PDF upload 백엔드 호출 금지** — 캡쳐는 폼 상태만, 실제 생성 트리거 X.
- **AI 슬롭 anti-pattern 도입 0** — UI_GUIDE.md 기준 (backdrop-filter blur, gradient text, glow, 보라/인디고 brand, 모든 카드 rounded-2xl 등).
- **React 19-only API 금지** — ppt 신규 코드도 18 호환 API만 (ADR-008).
- **테스트 변경 금지** — 163 tests passing 유지.

## 5. 성공 기준 (측정 가능, GATE 1 대상)

```bash
cd C:/Users/ohjih/design_system

# (S1) design_system 코드 변경 0 — packages·apps·CLAUDE.md·docs(ADR/PRD/ARCHITECTURE/UI_GUIDE)
git diff packages/ apps/ CLAUDE.md docs/PRD.md docs/ARCHITECTURE.md docs/ADR.md docs/UI_GUIDE.md | wc -l
# == 0

# (S2) trial 산출물 존재
test -f docs/dogfood-trial-5.md
test -f pkg-out/trial-5-home-default.png   # 폼 초기 상태 캡쳐 (Textarea + Card-as-dropzone + verbosity + select 등 8행 매핑 가시)
# (S2b) PDF 첨부 상태 캡쳐는 fixture 가용 시 best-effort — 부재해도 trial valid

# (S3) trial 문서가 세 가설 모두에 대한 발견을 담고 있음
grep -q "H2" docs/dogfood-trial-5.md
grep -q "H3" docs/dogfood-trial-5.md
grep -q "H4" docs/dogfood-trial-5.md
grep -q "발견" docs/dogfood-trial-5.md

# (S4) 발굴된 needs가 *반복 횟수*와 함께 우선순위 매겨져 있음
grep -E "Phase 14|needs|후보" docs/dogfood-trial-5.md
grep -E "반복|Trial 4 \+ Home|누적" docs/dogfood-trial-5.md

# (S5) 슬롭 anti-pattern 도입 0
! grep -i -E "glassmorphism|gradient orb|lottie|backdrop-filter: blur" docs/dogfood-trial-5.md

# (S6) 회귀 테스트 통과
pnpm -F @wonik/web test    # ≥ 163 passing (phase 12 Card 테스트 추가로 더 많을 수 있음)

# (S7) phases/index.json — phase 12 누락 fix + phase 13 추가 (둘 다 completed entry로)
grep -q "\"12-card\"" phases/index.json
grep -q "\"13-trial-5-home\"" phases/index.json
```

추가 정성 기준 (시각 — 캡쳐 보고 판정):
- (S8) Home 폼에서 Textarea + Card(드롭존) + Button(AI 다듬기·verbosity 5개·submit) 동시 깔림 시 시각 회귀 0, 또는 회귀 있으면 정확히 어디서인지 캡쳐로 입증.
- (S9) Card를 dropzone에 적용한 결과 — "Card가 자연스럽게 끼워짐 / dashed border 보정 어색 / Card 확장성 부족" 중 정직히 판정.
- (S10) Verbosity 5-pill을 Button + selected className으로 우회한 결과 — "Button 1개로 충분 / ToggleGroup 필요" 판정.

## 6. 가설 검증 매트릭스 (캡쳐 분석 시 채울 표 — trial-5.md에 들어감)

| # | 항목 | 가설 | 예상 | 실제 (trial 후 캡쳐 보고 채움) | 결론 |
|---|---|---|---|---|---|
| 1 | Textarea cascade (form-heavy 페이지) | H2 | ADR-010·011 cascade로 Outline과 동일 일관 | — | ✅/❌ |
| 2 | Button outline+icon ("AI 다듬기") 시각 자연성 | H2 + 부분 H4 | Trial 4 Button outline 결과 재현 | — | ✅/❌ |
| 3 | Card를 dropzone에 적용 — dashed border 확장성 | H3 + 부분 H4 | Card 확장성 검증 — 자연 OR `variant="outline"` 후보 부상 | — | ✅/❌/?? |
| 4 | Button danger/sm를 작은 "삭제" 텍스트로 — 적합성 | H2 | 텍스트만 있는 작은 destructive action 자연 | — | ✅/❌ |
| 5 | Badge needs 반복 ("{slideCount}장" pill) | H3 누적 | Trial 4 3회 + Home 1회 = 4회 → needs 확정 | — | needs ✅/❌ |
| 6 | Select needs (Audience) | H4 신규 | 1회 — 약함 (다음 trial로 확인) | — | needs ❓ |
| 7 | ToggleGroup/SegmentedControl needs (Verbosity 5-pill) | H4 신규 | Button + selected className 우회 가능하나 코드 verbose → mid needs | — | needs ✅/❌ |
| 8 | Alert/Banner needs 누적 (error) | H3 누적 | Trial 4 inconclusive + Home 1회 = evidence 시작 | — | needs ✅/❌ |

추가 관찰:
- IconButton needs는 Trial 4에서 ranking 2였음. Home은 icon-only가 거의 없으므로 본 trial에서 evidence 누적 안 됨 — 그 사실 자체를 정직히 기록 (IconButton needs는 *Outline-local*일 가능성 강화).

## 7. 결승선 (Phase 13 closure 조건)

- 위 S1–S10 모두 충족
- `phases/13-trial-5-home/index.json`의 모든 step `status: "completed"`
- `docs/dogfood-trial-5.md` 마지막 섹션에 **Phase 14 후보 needs 우선순위 1·2·3** 명시 (vague 금지 — 반복 횟수 + Trial 4 누적 결과 합산)
- `phases/index.json`에 phase 12 entry + phase 13 entry 둘 다 completed로 정렬 추가
- ppt repo `trial-5-home` 브랜치는 main에 머지하지 않음 (사용자 결정 영역)

## 8. 결승선 외 — 향후 결정 후보

trial 결과로 부상한 needs 중 phase 14+ 진입 후보:
- 강한 needs (Trial 4 + Trial 5 누적 4회+): 우선순위 1
- 중간 needs (누적 2–3회): 우선순위 2
- 약한 needs (1회 이하): 우선순위 3 (다음 trial까지 보류 — YAGNI)
- 신규 발견 (H4): 별도 ranking — 다음 trial(6+)에서 evidence 누적 후 결정

각 needs는 별도 phase에서 ADR + spec + 구현 사이클로 들어간다.

## 9. CLARIFY 결정사항 (autopilot PHASE 2 산출물)

| # | 결정점 | 선택 | 사유 |
|---|---|---|---|
| C1 | PDF dropzone에 Card 적용 시 dashed border 처리 | **inline style 보정 없이 그대로** — Card 기본 1px solid border + 라운드 + 패딩만 적용. dashed 손실은 H3 evidence로 기록 | inline 시각도 0 정책(§3·§4). 손실 자체가 "Card variant=outline w/ dashed needs"의 evidence. |
| C2 | PDF upload 실제 호출 여부 | **dev-only fixture로 폼 상태만 만듦, 실제 backend 호출 X** | (a) 실 PDF 업로드는 외부 비밀파일 노출 위험. (b) trial은 시각 검증이라 form state만 가시 가능하면 충분. (c) Trial 4 fixture 패턴 답습. |
| C3 | Verbosity 5-pill toggle 구현 방식 | **`<Button variant={selected ? 'primary' : 'outline'} size="sm">` 로 prop 토글** | (a) 시각도 inline 0 유지(variant는 prop, inline style 아님). (b) Button 기존 API로 깔끔히 표현 가능 여부 검증 = H4 ToggleGroup needs 정직한 측정. (c) primary 색이 너무 무겁다면 그 자체가 needs evidence. |
| C4 | Error alert 상태 캡쳐 시도 여부 | **best-effort** — backend 트리거 어려우면 default 폼 캡쳐만으로 trial valid (S2b) | Trial 4의 loading state graceful degradation 답습. error 캡쳐 없어도 Alert needs는 *코드상 1회 등장*으로 evidence 누적. |
| C5 | trial branch 이름 | `trial-5-home` | Trial 4 (`trial-4-outline`) 패턴 답습. |
| C6 | 캡쳐 viewport | `1280x1024` | Trial 4 일관. |
| C7 | 캡쳐 URL | `http://localhost:<ppt-dev-port>/` (Home 루트) | Home은 라우터 루트. ppt dev server 기본 포트는 step0에서 확인. |
| C8 | 캡쳐 파일명 | `pkg-out/trial-5-home-default.png` (필수) + `trial-5-home-with-pdf.png` (best-effort) | spec §5 S2/S2b. |
| C9 | "AI 다듬기" Button child 구성 | `<Button variant="outline" size="sm"><svg/>AI와 주제 다듬기</Button>` | Button children은 ReactNode — svg + text 동시 가능. inline gap·flex 부모 보정은 layout 허용. |
| C10 | PDF "삭제" inline text button 교체 | `<Button variant="danger" size="sm">` 시도. 시각 무거우면 evidence로 기록 (text-link 패턴 needs?) | Trial 4의 icon-only Button 교체 패턴 답습 — 어색하면 needs로 변환. |

## 10. 보안·엣지 케이스·성능 (GATE 2 대상)

- **보안**:
  - trial branch isolation — ppt main 영향 0 (C5).
  - dev-only fixture 가드 (`import.meta.env.DEV`) — production 빌드에 누설 0.
  - 캡쳐 PNG에 실데이터·실고객명 0 — 더미 입력만 (§3 데이터 정책).
  - 신규 코드 hex/raw 색 리터럴 0 (CLAUDE.md CRITICAL).
- **엣지 케이스**:
  - ppt dev server 다중 인스턴스 → trial 시작 전 `Get-Process node` 확인, 충돌 시 taskkill (Trial 4 learning).
  - backend 미가용 → C4 best-effort + C2 fixture로 우회.
  - Headless Chrome SSE 대기 → `--virtual-time-budget=6000` (Home은 SSE 의존 0, 짧게 충분).
  - `tsc --noEmit` ppt 측에서 실패 → 신규 import resolve 문제 → Step 0.T2.
- **성능 목표**: **해당없음** — 본 phase는 dogfood, 성능 측정 아님. ppt 측 변경은 8개 부위 + dev 가드 6줄 수준 — 빌드 시간 영향 0.
