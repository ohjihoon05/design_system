# Step 0: textarea-trial-3

## 읽어야 할 파일

먼저 아래 파일을 읽고 dogfood 사이클의 전제·기존 발견·우리 Textarea 현재 상태를 파악하라:

- `/CLAUDE.md` (CRITICAL — 1단계 범위, design_system 코드 변경 0이 이번 phase의 원칙)
- `/docs/dogfood-trial-1.md` (Spinner trial — `workspace:*` resolve 이슈 + `--color-*` namespace 발견 2의 출처)
- `/docs/dogfood-trial-2.md` (Button trial — "host의 `--color-*` 흡수" 모델이 입증된 사례. 단 Button은 `--color-primary` 하나만 썼기 때문에 잘 맞은 우연 가능성)
- `/packages/web/src/Textarea/Textarea.tsx` (우리 Textarea 현재 코드 — surfaces/text/borders 토큰을 inline style로 박음)
- `/packages/tokens/src/colors.ts` (각 토큰이 어떤 CSS variable로 resolve되는지)
- ppt 측: `C:/Users/ohjih/ppt/frontend/src/pages/Home.tsx` (line 184 부근 — 본 trial이 교체할 native `<textarea>`)

## 작업

ppt `Home.tsx`의 prompt 입력 native `<textarea>`(line 184–199)를 `@wonik/web` `Textarea` 컴포넌트로 교체하고, 시각 회귀를 캡쳐로 정직하게 측정한 뒤 `docs/dogfood-trial-3.md`로 발견 사항을 정리한다.

이 step의 목적은 **"Trial 2가 입증한 host-namespace 흡수 모델이 form 컨트롤(surface·text·border·placeholder까지 쓰는 컴포넌트)에서도 작동하는지 정직하게 노출"** 이다. design_system 코드 변경은 0 — Trial은 발견이 1차 가치, 반영은 별도 phase(예: Phase 09 textarea-polish)에서 별도 결정.

### 핵심 가설 (검증 대상)

Trial 2(Button)가 작동한 이유: Button이 `--color-primary` 하나만 의존했고 ppt가 같은 이름 변수를 정의했음 (namespace 우연 일치). Textarea는 다르다:

| 우리 Textarea 토큰 reference | ppt가 정의한 변수 | 일치? |
|------|------|------|
| `surfaces.surfaceWhite` → `var(--color-surface-white)` | `--color-surface` | ✗ |
| `text.dark` → `var(--color-text-dark)` | `--color-text` | ✗ |
| `borders.mid` → `var(--color-border-mid)` | `--color-border` | ✗ |
| (focus ring 우리는 정의 없음) | `--color-primary` (focus:ring-2) | — |
| (placeholder color 우리는 정의 없음) | `--color-text-muted` | — |

**예상 결과**: ppt 환경에서 우리 Textarea의 background/color/border CSS variable이 ppt에 정의되지 않아 fallback 없이 initial로 떨어진다 → 흰 배경 + 검은 글씨 + 기본 회색 border가 ppt dark surface 위에 박힌다 → **시각 충돌이 명확히 캡쳐된다**.

이 결과를 받아서 후속 phase에서 namespace 정책 결정 (옵션 A: 우리가 fallback 정의 노출 / 옵션 B: host alias map 제공 / 옵션 C: variable 이름을 host와 align).

### 1. 사전 준비 — design_system 빌드 + ppt link

design_system 측 변경 0. 다만 최신 `@wonik/web` dist를 ppt가 보게 해야 함:

```bash
cd C:/Users/ohjih/design_system
pnpm -F @wonik/tokens build
pnpm -F @wonik/web build
pnpm -F @wonik/tokens pack --pack-destination ./pkg-out
pnpm -F @wonik/web pack --pack-destination ./pkg-out

pnpm --dir C:/Users/ohjih/ppt/frontend add \
  file:C:/Users/ohjih/design_system/pkg-out/wonik-web-0.0.0.tgz
```

ppt `package.json`의 `pnpm.overrides`에 `@wonik/tokens` file: 매핑이 이미 있어야 함 (Trial 1에서 추가됨). 없으면 추가.

### 2. ppt `Home.tsx` 교체 (line 184–199)

**Before** (기존):
```tsx
<textarea
  id="prompt"
  value={prompt}
  onChange={(e) => {
    if (e.target.value.length <= PROMPT_MAX_LENGTH) {
      setPrompt(e.target.value);
    }
    if (error) clearError();
  }}
  placeholder="예: 2024년 AI 기술 트렌드와 비즈니스 활용 방안에 대한 발표자료를 만들어줘"
  rows={4}
  maxLength={PROMPT_MAX_LENGTH}
  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent resize-none transition-shadow"
  required
  aria-describedby="prompt-hint"
/>
```

**After** (우리 컴포넌트):
```tsx
<Textarea
  id="prompt"
  value={prompt}
  onChange={(e) => {
    if (e.target.value.length <= PROMPT_MAX_LENGTH) {
      setPrompt(e.target.value);
    }
    if (error) clearError();
  }}
  placeholder="예: 2024년 AI 기술 트렌드와 비즈니스 활용 방안에 대한 발표자료를 만들어줘"
  rows={4}
  maxLength={PROMPT_MAX_LENGTH}
  required
  aria-describedby="prompt-hint"
/>
```

`import { Button, Spinner, Textarea } from "@wonik/web"`에 `Textarea` 추가.

**의도적으로 안 하는 것**:
- 시각 보정 `style={{...}}` override 추가 안 함 — host-흡수 모델이 깨지는 지점을 그대로 캡쳐해야 함 (Trial 2와 동일한 정직성).
- `tokens.css` import 안 함 — Trial 1·2와 동일.
- ppt 측 CSS variable 이름 변경 안 함 — 그건 후속 phase의 영역.

### 3. ppt 실행 + 캡쳐

```bash
pnpm --dir C:/Users/ohjih/ppt/frontend dev
# 다른 터미널에서
"C:/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu \
  --screenshot=C:/Users/ohjih/design_system/pkg-out/trial-3-home.png \
  --window-size=1280,1024 http://localhost:3001
```

캡쳐 PNG를 AI가 직접 읽어 시각 분석한다.

### 4. `docs/dogfood-trial-3.md` 작성

Trial 1·2 형식 그대로:

- **상단 메타**: 날짜, 대상 product, 적용 범위, 목표
- **적용 방식**: 위 2번의 교체 내용 + import 추가
- **발견사항**: 캡쳐를 보고 다음을 정직하게 기록
  - namespace 불일치가 실제로 어떻게 깨졌는지 (각 색 항목별)
  - focus ring이 작동하는지 — 우리 Textarea의 BASE_STYLE에 focus 정의 없음
  - resize 동작 차이 (우리는 `vertical`, ppt 기존은 `none`)
  - placeholder 색·텍스트 가시성
  - `rows`, `maxLength`, `required`, `aria-describedby` 같은 native attribute 통과 여부
- **결과**: 적용 가능 여부, 시각 회귀 정도, 1단계 결승선과의 관계
- **다음 phase 후보**: 발견에 따라 (a) namespace 정책 결정 phase / (b) Textarea에 focus 토큰 추가 phase / (c) host-align migration phase 등

### 5. ppt 측 변경 commit 처리

ppt repo에는 본 trial용 별도 branch (예: `trial-3-textarea`)로 commit하고, **merge는 trial 완료 후 사용자가 결정**. design_system repo에는 `docs/dogfood-trial-3.md`만 추가.

## Acceptance Criteria

```bash
cd C:/Users/ohjih/design_system

# design_system 측 변경 0 (Textarea·tokens 코드 그대로)
git diff packages/web/src/Textarea/ | wc -l    # 0
git diff packages/tokens/src/ | wc -l          # 0
git diff packages/web/src/Button/ | wc -l      # 0 (다른 컴포넌트도 0)

# trial-3 문서 생성됨
test -f docs/dogfood-trial-3.md
grep -q "발견사항" docs/dogfood-trial-3.md
grep -q "namespace" docs/dogfood-trial-3.md

# 캡쳐 파일 존재 (AI 시각 분석의 evidence)
test -f pkg-out/trial-3-home.png

# 기존 dogfood 문서 보존
test -f docs/dogfood-trial-1.md
test -f docs/dogfood-trial-2.md

# AI 슬롭 anti-pattern 도입 0 (trial 문서 안에도)
! grep -i -E "glassmorphism|gradient orb|lottie|backdrop-filter: blur" docs/dogfood-trial-3.md
```

## 검증 절차

1. 위 AC 커맨드 실행.
2. 체크리스트:
   - ppt 측 textarea가 진짜 우리 `<Textarea>`로 교체됐나? (캡쳐의 DOM/inspect로 확인 가능)
   - 캡쳐가 정직한가? 시각 충돌이 보이는데 "괜찮다"고 쓰지 않았나?
   - 발견사항이 가설 검증으로 connected됐나? (예상 결과 vs 실제 결과)
   - design_system 코드 변경 0인가?
   - 다음 phase 후보가 발견에 기반해 구체화됐나? (vague한 "더 봐야 함"은 안 됨)
3. 결과에 따라 `phases/08-textarea-dogfood/index.json`의 step 0를 업데이트:
   - 성공 → `"status": "completed"`, `"summary": "Trial 3 — ppt Home.tsx prompt textarea를 @wonik/web Textarea로 교체. namespace 불일치 시각 캡쳐 완료. design_system 코드 변경 0. 후속 phase 후보 N건 도출."`
   - 실패 → `"status": "error"`, `"error_message": "구체 사유"`

## 금지사항

- **design_system 코드 변경 금지** — `packages/`, `apps/web-sandbox/`, `scripts/`, `CLAUDE.md`, `docs/PRD.md`/`ARCHITECTURE.md`/`ADR.md`/`UI_GUIDE.md` 모두 그대로. 본 phase의 모든 design_system 측 변경은 `docs/dogfood-trial-3.md` 신규 파일 1개와 `phases/08-textarea-dogfood/` 만.
- **ppt 측 시각 보정 `style` override 금지** — Trial 2처럼 host-흡수가 깨지는 지점을 그대로 캡쳐해야 함. consumer가 색을 override해서 가짜로 정상화하면 trial 의미 상실.
- **`tokens.css` import 금지** — 우리 css가 ppt 변수를 덮어쓰면 발견 측정 불가.
- **ppt의 `--color-*` 변수 이름 변경 금지** — host alignment는 후속 phase의 영역.
- **ppt 측 다른 컴포넌트도 동시에 교체 금지** — 변수가 너무 많아지면 어떤 컴포넌트가 깬 건지 식별 불가. 본 trial은 textarea **하나만**.
- **발견을 가정으로 쓰지 말 것** — 캡쳐 안 보고 "그럴 것이다"라고 쓰지 말고, 실제 캡쳐를 evidence로 인용.
- **새 토큰 추가 금지** — focus ring, placeholder color 같은 needs가 나타나면 후속 phase로.
- **AI 슬롭 anti-pattern 도입 0** (backdrop-filter / gradient / glow / 보라색 brand color 등 — trial 문서 안에도, 시각 보정 시도에도).
- **React 19-only API 금지** (ppt 측 코드에도).
- **테스트 변경 금지** (Textarea 테스트는 현재 통과 상태로 유지).
