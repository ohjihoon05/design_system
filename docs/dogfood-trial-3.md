# Dogfood Trial 3: ppt에 `@wonik/web` Textarea 적용

**날짜**: 2026-05-11
**대상 product**: ppt (Factory PPT — AI 프레젠테이션 생성기)
**적용 범위**: ppt `frontend/src/pages/Home.tsx`의 prompt 입력 native `<textarea>` (line 184–199) → `@wonik/web` `Textarea` 컴포넌트
**목표**: Trial 2(Button)가 입증한 "host의 `--color-*` 흡수" 모델이 **여러 색 변수**(surface·text·border)에 의존하는 form 컨트롤에서도 작동하는지 정직하게 검증. 검증 대상은 `phases/08-textarea-dogfood/step0.md`의 핵심 가설.

## 적용 방식

1. design_system 빌드 + pack:
   ```bash
   cd C:/Users/ohjih/design_system
   pnpm -F @wonik/tokens build && pnpm -F @wonik/web build
   pnpm -F @wonik/tokens pack --pack-destination ./pkg-out
   pnpm -F @wonik/web pack --pack-destination ./pkg-out
   ```

2. ppt 측 reinstall:
   ```bash
   pnpm --dir C:/Users/ohjih/ppt/frontend install
   ```
   (`@wonik/web`, `@wonik/tokens` 의존성은 Trial 1·2에서 이미 file: protocol로 wired up 됨)

3. ppt `Home.tsx`:
   - `import { Spinner, Button } from "@wonik/web"` → `import { Spinner, Button, Textarea } from "@wonik/web"`
   - native `<textarea>` (11줄의 Tailwind className 포함) → `<Textarea>` (4줄)
   - 시각 보정 `style` override **추가하지 않음** — host 흡수가 깨지는 지점을 정직하게 캡쳐하기 위함

4. ppt branch: `trial-3-textarea` (main에 머지 안 함, trial 완료 후 사용자 결정)

5. 캡쳐 (사용자 시각 확인 의존성 제거 — Trial 2가 도입한 방법):
   ```bash
   "C:/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu \
     --screenshot=C:/Users/ohjih/design_system/pkg-out/trial-3-home.png \
     --window-size=1280,1024 http://localhost:3000/
   ```
   AI가 PNG를 직접 읽어 시각 분석 (`pkg-out/trial-3-home.png` 참조).

## 발견사항

### ⚠️ 발견 1 (핵심): host 흡수가 깨지면 충돌이 아니라 **invisibility** 가 된다

**가설**: 우리 Textarea가 `--color-surface-white`/`--color-text-dark`/`--color-border-mid`를 사용하는데 ppt가 정의한 변수 이름은 `--color-surface`/`--color-text`/`--color-border`로 namespace 불일치. → 흰 배경 + 검은 글씨가 ppt dark 환경에 박혀 **시각 충돌**이 보일 것.

**실제 캡쳐 관찰**: 충돌이 아니라 **textarea가 거의 안 보임**. 이유:

| 우리 inline style | ppt에 변수 정의됨? | CSS 처리 | 시각 결과 |
|------|------|------|------|
| `background: var(--color-surface-white)` | ✗ | invalid → `background: initial` | **transparent** (ppt canvas의 dark가 그대로 비침) |
| `color: var(--color-text-dark)` | ✗ | invalid → `color: initial` | 텍스트 없는 placeholder만 보임, native default 회색 |
| `border: 1px solid var(--color-border-mid)` | ✗ | shorthand 일부 invalid → border declaration 무시 | **border가 거의 안 보임** |
| `borderRadius: '5px'` (raw) | — | OK | 적용됨 (눈에 띄지 않음 — border가 없으니까) |
| `outline: none` | — | OK | OK |
| `resize: vertical` | — | OK | 우측 하단 작은 resize handle 보임 |

**결과**: Textarea가 ppt dark surface와 거의 구분 안 됨. **visual affordance(입력 가능 영역이라는 시각적 단서)가 소실**됨. 사용자가 "여기에 뭐 쓸 수 있구나" 인지하기 어려움.

**의미**:
- Trial 2(Button)가 작동한 건 우리·ppt 둘 다 우연히 `--color-primary` 같은 이름으로 *완전 일치*해서. "host 흡수"가 아니라 "이름 우연 일치".
- namespace가 불일치하면 흡수가 아니라 **CSS variable이 invalid → declaration 통째로 무시**가 되어 visual affordance가 깨진다.
- 이는 단지 Textarea 한 컴포넌트의 문제가 아님. Input, Checkbox, Switch, Radio, Spinner의 default 색 등 동일한 surface/text/border 토큰을 쓰는 모든 form/display atom에서 같은 문제가 발생할 가능성이 매우 큼 (확인 필요).

### ⚠️ 발견 2: resize 정책 차이

**현상**:
- 우리 Textarea BASE_STYLE: `resize: 'vertical'`
- ppt 기존 textarea: `resize-none` (Tailwind)

**관찰**: 캡쳐 우측 하단에 작은 resize handle 보임 — 사용자가 textarea 크기를 늘릴 수 있음. ppt 기존은 layout 안 깨지게 막아둠.

**의미**: form 컨트롤의 resize default를 무엇으로 둘지는 design system의 의견이다. 토스 SLASH·material 등 다수가 `none` default (layout 보존). 우리는 현재 `vertical` default라 host가 매번 `style={{resize: 'none'}}` override 해야 함 — friction 큼. ADR 또는 polish phase 검토 필요.

### ⚠️ 발견 3: focus state가 visual로 비어 있음

**현상**:
- ppt 기존 textarea: `focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent` — focus 시 명확한 indigo ring
- 우리 Textarea BASE_STYLE: `outline: 'none'` + `transition: 'border-color 0.12s ease, box-shadow 0.12s ease'`만. focus 시 어떤 border-color·box-shadow로 가는지 정의 0.

**관찰**: 캡쳐는 focus 없이 찍혀서 직접 확인 불가. 그러나 코드상 focus 상태로 가도 시각 변화 없음 (transition 대상은 있지만 :focus selector가 inline style에 없음 — inline style은 pseudo-class 정의 불가).

**의미**: 우리 form 컨트롤들이 a11y focus indicator를 제공 안 함. WCAG 2.1 Success Criterion 2.4.7 위반 가능. **production 진입 전 필수 수정 영역**.

### ⚠️ 발견 4: placeholder color 명시 0

**현상**:
- ppt 기존: `placeholder:text-[var(--color-text-muted)]`
- 우리 Textarea: placeholder pseudo 정의 없음 — browser default

**관찰**: 캡쳐상 placeholder가 약하게 보임. browser dark color-scheme detection 덕에 자동으로 회색 표시되었지만 우리가 의도한 동작 아님 — 운임.

**의미**: light theme browser·custom color-scheme 환경에서는 placeholder 시인성 저하 가능. design system이 form 컨트롤의 모든 visual state(default·hover·focus·disabled·invalid·placeholder)를 명시할 책임 있음.

### ✅ 발견 5: native attribute 통과 OK

`rows={4}` / `maxLength={2000}` / `required` / `aria-describedby="prompt-hint"` / `id="prompt"` / controlled `value`+`onChange` 모두 정상 통과. `...rest` spread 잘 작동. label↔input 연결, screen reader 안내 모두 유지.

### ✅ 발견 6: 캡쳐 자동화 사이클이 Trial 2→3로 재현됨

Chrome `--headless=new --screenshot`로 PNG 캡쳐 → AI가 PNG 직접 읽기 → 분석 사이클이 두 번째 trial에서도 매끄럽게 작동. 사용자가 dev server 띄우고 시각 확인할 필요 없음. trial 사이클이 사람의 시간에 묶이지 않는 패턴 굳어짐.

## 결과

**적용 가능 여부**: ⚠️ 기능적으로는 동작 (controlled value, native attribute, maxLength 등). 그러나 **시각적으로 사용 불가** — 사용자가 입력 영역을 인지 못 함.

**Trial 2 모델과의 비교**:
- Trial 2: Button이 `--color-primary` 하나만 의존, 우리·ppt 둘 다 같은 이름 → 우연한 시각 융합 성공.
- Trial 3: Textarea가 surface·text·border 세 변수 의존, 우리·ppt 이름 불일치 → invisibility로 깨짐.
- **결론**: layer A의 "host가 색을 own한다" 모델은 **변수 이름 일치를 전제로만 성립**. namespace 정책 명시 없이는 다음 form/display atom들도 같은 invisibility 결함 노출.

**1단계 결승선과의 관계**:
- 우리 Textarea는 현재 형태로 ppt에 production 적용 불가.
- layer B(사내 npm 배포) 진입 전에 namespace 정책을 결정·반영해야 함. 사내 다른 product도 ppt와 다른 변수 이름을 쓸 가능성 큼.
- focus indicator 부재는 a11y 차원에서 production 차단 사유.

## 다음 phase 후보 (우선순위 순)

1. **Phase 09 — namespace alignment 정책 결정 (가장 urgent)**
   - 옵션 A: 우리 토큰을 host-friendly alias 추가 export (예: `--color-surface-white`와 `--color-surface` 둘 다 정의, host 이름 우선 cascade)
   - 옵션 B: design system이 자기 `--color-*` namespace를 prefix 화 (`--wonik-color-*`) — 큰 refactor
   - 옵션 C: host가 우리 변수 이름으로 align 마이그레이션 (host 부담 큼)
   - 결정에 ADR 필수. Input·Checkbox·Switch·Radio·Spinner의 default 색도 동시 영향.

2. **Phase 10 — form 컨트롤 focus state 토큰 추가 + Textarea/Input polish**
   - `--color-focus-ring` 토큰 도입 (또는 `primary.base`의 `:focus-visible` 사용)
   - Textarea·Input의 BASE_STYLE에 focus 시 box-shadow ring 추가
   - WCAG 2.1 2.4.7 충족

3. **Phase 11 — resize / placeholder 정책 ADR**
   - `resize` default를 `vertical`→`none`으로? (breaking change 가능성)
   - placeholder color 토큰 명시
   - 다른 form 컨트롤(Input)의 placeholder 동시 영향

4. **Trial 4 후보**: 위 phase 들이 마무리되면 Outline 페이지로 dogfood 표면 확장. layout primitive(Box/Stack/Text) + form polish 결과까지 동시 검증.

## 보존된 산출물

- 캡쳐: `pkg-out/trial-3-home.png` (41KB) — invisibility 증거
- ppt 변경: `C:/Users/ohjih/ppt` branch `trial-3-textarea` (commit 후) — 향후 polish 검증 시 같은 적용 지점 재현 가능
- spec: `phases/08-textarea-dogfood/step0.md` — 가설 명문화
