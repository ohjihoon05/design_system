# Dogfood Trial 3 — Recapture: ADR-010 적용 후 invisibility 해결 입증

**날짜**: 2026-05-11
**대상**: ppt `Home.tsx` prompt 영역 (Trial 3 1차와 동일 적용 지점)
**기준 phase**: Phase 09 (namespace contract) step 0·1·2 완료 후
**비교 대상**: `pkg-out/trial-3-home.png` (1차 — invisibility 노출) vs `pkg-out/trial-3-recapture-home.png` (재캡쳐 — 해결 입증)

## 적용된 변경

ppt 측: 1차 Trial 3와 동일 (`<textarea>` → `<Textarea>` 교체, branch `trial-3-textarea`).
design_system 측: Phase 09에서 다음 변경.
- **Phase 09 step 0**: ADR-010 추가 — interface variable contract 정책 명시.
- **Phase 09 step 1**: `tokens.css`에 interface variable 3개(`--color-bg`, `--color-text`, `--color-text-muted`) default emit + `interfaceColors` TypeScript export.
- **Phase 09 step 2**: `@wonik/web` 컴포넌트 8개에서 interface variable에 매핑되는 internal token reference를 `interfaceColors.*`로 갱신 — cascade fallback 패턴(`var(host, fallback)`) 자동 적용.

## 캡쳐 비교 분석

### Background — `var(--color-surface, var(--color-surface-white))`

- **1차**: ppt에 `--color-surface-white` 미정의 → CSS variable invalid → declaration 무시 → `background: initial` → transparent. textarea가 ppt canvas의 검은색에 사라짐.
- **재캡쳐**: ppt가 `--color-surface: #1e293b` 정의 → cascade 우선 → 우리 inline style이 `#1e293b` (slate panel)로 resolve. **canvas보다 약간 밝은 panel로 명확히 인지됨**.

### Border — `1px solid var(--color-border, var(--color-border-mid))`

- **1차**: `--color-border-mid` 미정의 → shorthand 일부 invalid → 전체 border declaration 무시 → border 거의 안 보임.
- **재캡쳐**: ppt `--color-border: #334155` 정의 → cascade 우선 → border 명확히 보임 (slate-700 톤). panel 경계 인지.

### Text/placeholder — `var(--color-text, var(--color-text-dark))`

- **1차**: `--color-text-dark` 미정의 → invalid → `color: initial` → 텍스트가 native default 회색. placeholder만 약하게 보임.
- **재캡쳐**: ppt `--color-text: #f1f5f9` 정의 → cascade 우선 → placeholder가 light gray 톤으로 자연 표시. (글자 수 카운터 `0 / 2000`과 톤 일치).

### 회귀 검증

- **Button primary** (`프레젠테이션 생성`): Trial 2 그대로 indigo + 흰 텍스트. cascade fallback 추가로 의미 변화 0.
- **Spinner**: Submit 중이 아니라 보이지 않음 (form 빈 상태). 추후 인터랙션 캡쳐 시 별도 검증.
- **선택 칩**(`기본`): primary 흡수 동작 유지. indigo 강조 정상.
- **콘텐츠 상세도 선택** (`핵심만 / 간결 / 기본 / 상세 / 매우 상세`): host 자체 button, 우리 컴포넌트 미적용. 비교 무관.

## 결과

**invisibility 해결**: ✅ ADR-010이 결정한 cascade fallback 패턴이 의도대로 작동. Trial 3 1차 발견 1(host 흡수가 깨지면 invisibility)이 명확히 해소됨.

**핵심 가설 입증**:
- **이전 Trial 2 결과는 우연 일치(`--color-primary` 이름만)**가 아니라 **ADR-010이 명시한 contract**로 재현 가능.
- layer A 모델("host가 색을 own, 우리는 형태만") 코드 단위 입증 완료. form 컨트롤도 작동.

**남은 미해결 발견 (Phase 09 범위 외 — 후속 phase로)**

1. **focus ring 부재** — Trial 3 1차 발견 3 그대로. 우리 BASE_STYLE에 `:focus` pseudo-class 정의 0. inline style은 pseudo 못 정의 → CSS module scope inject 또는 별도 처리 필요. WCAG 2.1 2.4.7 위반 가능.
2. **resize handle 노출** — Trial 3 1차 발견 2 그대로. `resize: 'vertical'` default — host가 매번 override 부담.
3. **placeholder color 명시 0** — Trial 3 1차 발견 4 그대로. browser default 의존.

→ Phase 10 후보로 묶음 — form 컨트롤 focus/resize/placeholder 정책 ADR + 구현.

## 1단계 결승선과의 관계

**Phase 09 closure**: layer A 모델의 핵심 contract가 코드·문서 단위로 모두 정착. sandbox·host 양쪽에서 검증된 첫 사례.

**layer B(사내 npm 배포) 진입 조건 충족 여부**: 색 contract는 충족. focus·a11y는 미충족. Phase 10에서 처리 후 layer B 진입 검토.

## 산출물

- 재캡쳐: `pkg-out/trial-3-recapture-home.png` (41KB)
- 비교 대조: `pkg-out/trial-3-home.png` (41KB, 1차 — invisibility 증거)
- ADR: `docs/ADR.md` ADR-010 (contract 정책)
- 코드 변경: `packages/tokens/scripts/build-css.ts`, `packages/tokens/src/colors.ts`, `packages/web/src/{Button,Input,Textarea,Spinner,Switch,Radio,Checkbox,Text}/*.tsx`
- 테스트: 163개 모두 통과 (회귀 0)
