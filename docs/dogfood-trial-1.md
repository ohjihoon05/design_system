# Dogfood Trial 1: ppt에 `@wonik/web` Spinner 첫 적용

**날짜**: 2026-05-08
**대상 product**: ppt (Factory PPT — AI 프레젠테이션 생성기)
**적용 범위**: ppt `frontend/src/pages/Home.tsx`의 inline `Spinner` SVG 1개 → `@wonik/web`의 `Spinner` 컴포넌트
**목표**: 1단계 결승선의 첫 단추 — design_system을 진짜 외부 product에 install · import · 사용하는 흐름이 작동하는지 end-to-end 확인.

## 적용 방식

1. design_system에서 두 패키지 tarball 생성:
   ```bash
   cd C:/Users/ohjih/design_system
   pnpm -F @wonik/tokens pack --pack-destination ./pkg-out
   pnpm -F @wonik/web pack --pack-destination ./pkg-out
   ```

2. ppt에 `file:` protocol로 install:
   ```bash
   pnpm --dir C:/Users/ohjih/ppt/frontend add \
     file:C:/Users/ohjih/design_system/pkg-out/wonik-web-0.0.0.tgz
   ```

3. ppt `package.json`에 `pnpm.overrides` 추가:
   ```json
   "pnpm": {
     "overrides": {
       "@wonik/tokens": "file:C:/Users/ohjih/design_system/pkg-out/wonik-tokens-0.0.0.tgz"
     }
   }
   ```

4. ppt `Home.tsx`:
   - inline `Spinner` SVG 함수(23줄) 삭제
   - `import { Spinner } from "@wonik/web"` 추가
   - 사용처에 `style` override로 흰색 시각 보존 (submit button 텍스트가 흰색이라 spinner도 흰색이 자연):
     ```tsx
     <Spinner
       size="sm"
       label="AI 슬라이드 생성 중"
       style={{
         borderColor: "rgba(255,255,255,0.3)",
         borderTopColor: "white",
       }}
     />
     ```

## 발견사항

### 발견 1: `workspace:*` 의존성이 tarball 외부에서 resolve 안 됨

**현상**: `@wonik/web` tarball 안의 `package.json`에는 `"@wonik/tokens": "0.0.0"`이 박혀있다 (`pnpm pack`이 자동으로 `workspace:*` → 실제 버전으로 변환). 그러나 ppt가 이걸 보고 npm registry에서 `@wonik/tokens@0.0.0`을 찾으려 함 → `ERR_PNPM_FETCH_404`.

**즉시 해결**: ppt `package.json`에 `pnpm.overrides`로 `@wonik/tokens`를 file: protocol로 강제 매핑.

**근본 해결 후보 (1단계 후반·layer B 진입 전 결정 필요)**:
- 옵션 A: 사내 npm registry 구축 → `@wonik/tokens@x.y.z`를 진짜 publish. 그러면 `@wonik/web`이 의존성 자동 해결.
- 옵션 B: `tsup`으로 `@wonik/tokens`를 `@wonik/web`에 inline bundle. 단 토큰 css(별도 산출물)은 별도 distribution 필요 — 깔끔하지 않음.
- 옵션 C: `pnpm pack` 시 `workspace:*` → `file:./wonik-tokens-x.y.z.tgz` 같은 상대 경로로 변환 (자동화 가능한지 확인 필요).

**현재 결정**: 1차 dogfood는 overrides로 진행. 사내 registry 결정은 layer B 진입 시.

### 발견 2: 토큰 namespace `--color-*` 충돌

**현상**: design_system도 `var(--color-primary)`, ppt도 `var(--color-primary)` 사용. ppt는 indigo (`#6366f1`), design_system은 WONIK BLUE (`#273E82`).

**1차 dogfood에서 미친 영향**: 본 trial은 `tokens.css`를 import하지 않았으므로 ppt 색이 그대로 살아있다. 우리 Spinner가 inline style로 `borderTopColor: var(--color-primary)`를 참조하는데 이 변수는 ppt가 정의한 indigo로 resolve. → **우리 spinner 컴포넌트는 ppt의 시각 시스템에 자연스럽게 녹아듦**. 단 본 trial은 색을 명시적으로 override했으므로 이 동작은 검증 못 함.

**미해결 질문**: `tokens.css`를 import하면 어떻게 되는가? 우리 css가 ppt 변수를 덮어써서 ppt 화면이 모두 WONIK BLUE 톤으로 변함. 이게 의도된 동작인가, 아니면 namespace 분리가 필요한가?

**옵션**:
- 옵션 A: design_system 토큰 namespace를 `--wonik-color-*`로 변경 (모든 컴포넌트도 함께 바꿔야 — 큰 refactor)
- 옵션 B: 컴포넌트가 ppt의 `--color-*`를 그대로 사용 (즉 design_system은 컴포넌트의 *시각 형태*만 제공, *색*은 호스트 product가 정의) — 1단계의 최소 침투 모델로 가장 단순
- 옵션 C: 호스트 product가 디자인 시스템을 받아들이려면 `--color-*` 변수를 우리 정의로 통일하는 마이그레이션 필요 (사내판 앱인토스의 layer A → B 진입 조건)

**현재 결정**: 1단계는 옵션 B(host product의 변수 그대로 사용)가 자연스러움. 단 design_system이 stand-alone (web-sandbox)에서도 동작해야 하므로 `tokens.css`는 fallback default로 export. 호스트가 자기 변수를 정의하면 cascade 우선순위로 호스트 색이 이긴다.

### 발견 3: `Spinner`의 default 색이 정중앙에서 너무 강함 (style override 패턴 검증)

**현상**: 우리 `Spinner`의 default `borderTopColor: primary.base`는 ppt context에서 indigo가 됨. 흰 텍스트 옆 indigo spinner는 시각적으로 어색. 호스트가 색을 명시적으로 override하는 것이 자연스러운 사용 패턴.

**확인된 동작**: `<Spinner style={{borderColor: "...", borderTopColor: "..."}} />`로 외부 override 가능 — 컴포넌트가 `...style` spread를 마지막에 두고 있어서 consumer override가 default를 이긴다 (Spinner.tsx에 이미 구현됨).

**향후 결정**: `Spinner`에 `color` prop을 추가할지 검토. 현재는 style override로 충분하지만 사내 팀이 자주 쓰는 패턴(흰 spinner, muted spinner 등)은 prop으로 명명하면 의도가 명확해짐. 두 번째 dogfood가 등장하면 패턴 도출.

### 발견 4: a11y `aria-busy` 부착 위치

**ppt의 inline Spinner**: `aria-hidden="true"` (장식으로 취급, 텍스트가 진짜 메시지를 전달).
**우리 Spinner**: `role="status"` + `aria-busy="true"` + `aria-live="polite"` 항상 부착.

**판단**: 우리 컴포넌트가 더 적극적인 a11y 입장. 문제는 ppt context처럼 spinner *옆에* 텍스트가 이미 메시지를 전달하는 경우 스크린리더가 "Loading. AI가 슬라이드를…" 처럼 두 번 읽을 수 있음. 본 trial에서는 `label="AI 슬라이드 생성 중"`을 줘서 의미가 일관되게 만듦 (텍스트도 "AI가 슬라이드를 생성하고 있습니다…"로 비슷).

**향후 결정**: `Spinner`에 `decorative` prop을 추가해 `aria-hidden="true"`로 토글하는 모드를 줄지 검토. 현재는 `label` prop이 default `'Loading'`이므로 의미 명시는 가능 — 단순성 vs 명시성.

## 결과

**적용 가능 여부**: ✅ 동작. ppt가 우리 패키지를 install · import · 사용하는 흐름이 end-to-end 작동.

**시각 회귀**: ✅ 없음. 사용자 시각 검증 결과 — submit 버튼의 흰색 spinner가 회전 + "AI가 슬라이드를 생성하고 있습니다…" 텍스트와 inline 정렬 모두 기존 동일.

**1단계 결승선과의 관계**: layer A의 1차 채움이 ppt에서 *최소 표면으로* 검증됨. 다음 step은 표면을 확장 (Submit `<button>` → `Button`, `<textarea>` → `Textarea`) 또는 다른 페이지(Outline / Presentation)로 dogfood 확장. 단 발견 2(`--color-*` namespace)의 결정이 layer B 진입 전에 명확해져야 함.

## 다음 trial 후보

1. **trial 2 — Submit button**: `<button className="bg-[var(--color-primary)]...">` → `<Button variant="primary">`. WONIK BLUE 색이 ppt의 indigo 위에 어떻게 나타나는지 직접 비교.
2. **trial 3 — Textarea**: `<textarea className="border border-[var(--color-border)]...">` → `<Textarea>`. 토큰 css import 시 ppt 색 변경 폭 측정.
3. **trial 4 — 토큰 css 적용 실험**: 한 페이지에만 `import '@wonik/tokens/tokens.css'` 적용해서 ppt 전체가 WONIK BLUE로 바뀌는 정도를 시각·기능 양쪽 측정.
