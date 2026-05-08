# Dogfood Trial 2: ppt에 `@wonik/web` Button 적용

**날짜**: 2026-05-08
**대상 product**: ppt (Factory PPT — AI 프레젠테이션 생성기)
**적용 범위**: ppt `frontend/src/pages/Home.tsx`의 메인 submit `<button>` (full-width hero) → `@wonik/web` `Button` 컴포넌트
**목표**: trial 1에서 미해결로 남긴 **발견 2(토큰 namespace `--color-*` 충돌)** 를 정직하게 검증. ppt가 자체 `--color-primary`(indigo)를 정의한 상태에서 우리 Button(`background: var(--color-primary)`)을 그대로 import하면 어떻게 보이는가.

## 적용 방식

ppt `Home.tsx`:
- 기존 `<button className="w-full rounded-lg bg-[var(--color-primary)] ...">...</button>` (Tailwind utility 11줄)
- → `<Button variant="primary" size="lg" style={{width: "100%"}}>...</Button>`

`tokens.css`는 import하지 않음 (= ppt의 `--color-primary` 정의 그대로 살아있음).

검증 방법: Edge/Chrome headless로 `localhost:3001` 캡쳐 → 시각 분석.
```bash
"C:/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu \
  --screenshot=trial-2-home.png --window-size=1280,1024 http://localhost:3001
```

## 발견사항

### ✅ 발견 2(토큰 namespace) 1단계 모델 정직하게 입증

**검증 결과**: 우리 Button의 `background: var(--color-primary)`가 ppt 환경에서 ppt의 indigo로 자동 resolve. 캡쳐상 다음 ppt 기존 indigo 요소들과 **정확히 같은 색**:
- "슬라이드 수 8장" 강조 박스
- "AI와 주제 다듬기" outline button
- "기본" 콘텐츠 상세도 선택 버튼

→ trial 1에서 미해결로 남긴 옵션 B("host product의 `--color-*`를 그대로 사용 — design system은 *시각 형태*만 제공, *색*은 host가 정의")가 **1단계 dogfood 모델로 작동함이 입증됨**.

이 모델의 의미:
- design system의 컴포넌트는 토큰 reference만 담는다 (`var(--color-primary)`).
- standalone(web-sandbox)에서는 우리 `tokens.css`가 default 색을 정의 (WONIK BLUE).
- host product에서는 host가 자기 `--color-*`를 정의하면 우리 컴포넌트가 host 색에 자연 융합.
- host가 디자인 시스템과 정렬을 원하면 자기 `--color-*` 변수를 우리 정의로 바꾸면 됨 — 컴포넌트 코드 변경 0.

이게 layer A의 진짜 가치 모델 — **컴포넌트는 가치 형태(레이아웃·접근성·상호작용)를 가지고, 색 시스템은 host가 own한다**. layer B(사내 npm 배포) 진입 시에도 이 모델 유지.

### ⚠️ 새 발견 1: Hero button의 font weight 약함

**현상**: 우리 `Button`의 baseStyle은 `fontWeight: fontWeight.regular`(400). ppt 기존 hero submit은 `font-semibold`(600). 캡쳐상 "프레젠테이션 생성" 글씨가 같은 화면의 다른 indigo 강조 요소들에 비해 살짝 가늘어 **hero 강조감이 약함**.

**의미**: 우리 Button의 weight가 모든 size·variant에 일률적으로 regular인 게 hero CTA에는 부족.

**옵션 (후속 phase 검토)**:
- 옵션 A: `Button`에 `weight` prop 추가 — consumer가 case-by-case 결정.
- 옵션 B: variant별 default weight 차등 — `primary`/`danger`은 `medium` 또는 `semibold`, `text`/`outline`은 `regular`.
- 옵션 C: `lg` size default를 `semibold`로 (hero size 가정).

옵션 B가 토스 SLASH 등 산업 표준 — variant가 의미를 결정하므로 weight도 의미를 따름. 1단계 후반에 결정.

### ⚠️ 새 발견 2: `radius.sm`(5px)가 hero button에 약간 각짐

**현상**: 우리 Button radius `radius.sm`(5px). ppt 기존 button `rounded-lg`(8px). 캡쳐상 거의 인지 불가능한 미세 차이지만, 토큰 system에 `radius.md`(8px) 또는 `radius.lg`(12px)가 없어 hero/card 같은 큰 요소를 부드럽게 표현하기 어려움.

**옵션**: tokens에 `radius.md`(8px) 추가 — 작은 변경, breaking change 없음. 후속 phase 또는 다음 토큰 보충 작업에서.

### ✅ 새 자산: 시각 검증 자동화 가능

**발견**: Edge/Chrome headless + `--screenshot` 옵션으로 localhost를 PNG로 캡쳐 가능. AI 환경에서 이 PNG를 직접 읽어 시각 분석 가능.

**의미**: 다음 dogfood trial부터 사용자 수동 확인 없이 자동 시각 검증 가능. trial 사이클이 사람의 시간에 묶이지 않음.

**한계**: hover/focus/active 같은 interaction state는 캡쳐 자동화 어려움 (사용자 입력 시뮬레이션 필요 — Playwright/Puppeteer 도입 필요). 평상시 시각·색·layout은 충분히 검증 가능.

## 결과

**적용 가능 여부**: ✅ 동작. type check 0건, 런타임 정상, 시각 회귀 없음 (캡쳐 검증 완료).

**1단계 결승선과의 관계**:
- layer A의 핵심 모델(컴포넌트는 형태만, 색은 host가 own) 정직하게 입증.
- 2개 atom(Spinner + Button)이 ppt에서 정상 작동 → 표면 점진 확장 가능 신호.
- trial 1·2를 통해 발견 2(토큰 namespace) 결정 완료 — layer B 진입 전 미해결로 두지 않아도 됨.

## 다음 trial 후보

1. **trial 3 — Textarea**: ppt prompt 입력 영역(`<textarea className="border ...">`) → `@wonik/web` `Textarea`. 우리 Textarea가 ppt의 dark surface 위에 자연 융합되는지 검증. 가장 visible한 input UI라 검증 가치 큼.
2. **trial 4 — Outline 페이지의 OutlineCard**: Home 외 다른 페이지로 dogfood 표면 확장. Box·Stack·Text 같은 layout primitive까지 적용 시도.
3. **트랙 옮기기 — Button weight·radius 발견사항 design_system에 반영**: trial 2의 새 발견 1·2를 별도 phase로 처리. weight prop 또는 variant default 추가, `radius.md` 추가. dogfood가 알려준 진짜 needs를 컴포넌트에 반영하는 사이클.
