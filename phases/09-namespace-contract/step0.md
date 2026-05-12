# Step 0: ADR-010 — namespace contract 정책 결정

## 읽어야 할 파일

먼저 아래를 읽고 Trial 3 발견의 evidence + ADR 형식 + 기존 토큰 namespace 구조를 파악하라:

- `/CLAUDE.md` (CRITICAL — 토큰 변경은 ADR + Changesets minor 이상 필수)
- `/docs/dogfood-trial-3.md` (본 결정의 evidence — invisibility 발견)
- `/phases/08-textarea-dogfood/step0.md` (가설·검증 결과 명문)
- `/docs/ADR.md` (ADR-001~009 형식 — 특히 ADR-007/008/009 토큰 관련)
- `/packages/tokens/src/colors.ts` (현재 우리 namespace: `--color-surface-white` 등)
- `/packages/tokens/src/theme-light.ts`, `/packages/tokens/src/theme-dark.ts` (실제 hex)
- `/packages/tokens/scripts/build-css.ts` (CSS 변수 emit 로직)
- ppt 측: `C:/Users/ohjih/ppt/frontend/src/index.css` (host가 정의하는 interface variable evidence — 8개)

## 작업

`docs/ADR.md`에 **ADR-010: 호스트-디자인 시스템 CSS variable contract** 를 추가한다. design_system 코드 변경 0 — 본 step은 ADR 결정 단독.

이 step의 목적은 **"Trial 3가 발견한 invisibility 결함의 근본 원인을 contract 정책으로 명시화"**. 후속 step 1·2·3에서 ADR 결정에 따라 토큰·컴포넌트를 조정한다.

### 결정해야 할 4가지

#### 1. Interface variable 목록 (host가 정의해 우리 컴포넌트가 흡수하는 표준 이름)

ppt 기준 후보 8개:

| ppt 변수 | 의미 | 우리 internal 변수 매핑 | interface 채택? |
|------|------|------|------|
| `--color-bg` | 가장 어두운 canvas | `--color-canvas` | 추천 ✅ |
| `--color-surface` | panel 배경 | (현재) `--color-surface-white` | 추천 ✅ |
| `--color-surface-hover` | hover state surface | (정의 없음) | 보류 — host가 own, interface 추가 안 함 |
| `--color-border` | 기본 border | `--color-border-mid` | 추천 ✅ |
| `--color-text` | 기본 text | `--color-text-dark` | 추천 ✅ |
| `--color-text-muted` | 보조 text | `--color-text-dim` | 추천 ✅ |
| `--color-primary` | brand primary | `--color-primary` (이미 일치) | 이미 채택 ✅ |
| `--color-primary-hover` | primary hover | (정의 없음) | 보류 — host가 own |

추천: **6개를 interface variable로 채택** (`--color-bg`, `--color-surface`, `--color-border`, `--color-text`, `--color-text-muted`, `--color-primary`). hover state는 host가 own — interface에 포함 안 함.

#### 2. Cascade 우선순위

옵션:
- **옵션 A**: 우리 tokens.css가 interface variable의 **default**만 emit. host가 정의하면 host 우선 (CSS 자연 cascade).
- 옵션 B: 우리 tokens.css가 emit 안 함. host가 정의해야만 동작. (host 부담)
- 옵션 C: 우리 tokens.css emit. host 우선이지만 우리 컴포넌트가 명시적으로 우리 internal token으로 fallback하는 방어 코드.

추천: **옵션 A** — 가장 자연스러움. host 정의 안 하면 우리 default 동작 (web-sandbox에서 standalone 작동). host 정의하면 host 우선 (Trial 2 모델 재현).

#### 3. 컴포넌트 reference 패턴

옵션:
- **옵션 X**: 컴포넌트가 interface variable 직접 reference (`var(--color-surface)`). interface 미정의 시 CSS `initial`로 떨어짐 (Trial 3 invisibility 위험 재발).
- **옵션 Y**: 컴포넌트가 interface variable + fallback 형태 (`var(--color-surface, var(--color-surface-white))`). interface 미정의 시 우리 internal로 안전 fallback.
- 옵션 Z: 컴포넌트가 우리 internal만 reference. interface variable은 우리 tokens.css에서 internal을 host name으로 alias.

추천: **옵션 Y** — defense-in-depth. host 정의 없어도 invisibility 0. host 정의 있으면 자연 흡수. cascade 자동 작동.

#### 4. 우리 internal token namespace 정리 (부수 결정)

Trial 3에서 발견된 부수 issue: 우리 `--color-surface-white`는 dark theme에서 dark 색 반환 — 색조를 이름에 박은 게 semantic 위반. 

옵션:
- 옵션 P: 그대로 둠. interface variable만 추가, internal 이름 유지.
- 옵션 Q: internal도 정리 (`--color-surface-white` → `--color-surface-default`/`--color-surface-base` 등). breaking change. ADR-010이 minor bump 명시.
- 옵션 R: 그대로 두되 deprecation 경고 ADR에 명시. 후속 phase에서 정리.

추천: **옵션 R** — 본 ADR은 contract 명시화에 집중. internal namespace 정리는 별도 phase. 단 deprecation 의도를 ADR-010에 명시해 코드에서도 일관되게 추적.

### ADR-010 작성 형식

기존 ADR 패턴 (결정/이유/트레이드오프 3-section)을 따른다. 다음 항목 포함:

```markdown
### ADR-010: 호스트-디자인 시스템 CSS variable contract

**결정**: `@wonik/web` 컴포넌트가 의존하는 색 변수 중 6개를 **interface variable**로 표준화한다 — host product가 정의할 가능성 높은 표준 이름. 우리 tokens.css는 이 6개를 default로 emit하고, 우리 컴포넌트는 `var(--color-surface, var(--color-surface-white))` 형태의 cascade fallback으로 reference한다. host가 같은 이름의 변수를 정의하면 자연 cascade로 host 우선 (Trial 2 모델 일반화). 정의 안 하면 우리 default 동작 (web-sandbox standalone 작동).

**interface variable 6개** (1단계):
- `--color-bg` — 가장 어두운 canvas
- `--color-surface` — panel 배경
- `--color-border` — 기본 border
- `--color-text` — 기본 text
- `--color-text-muted` — 보조 text
- `--color-primary` — brand primary

**fallback target** (내부): 각 interface variable이 미정의일 때 우리 internal token이 cascade fallback으로 사용된다 (예: `--color-surface-white`). host가 interface variable 6개만 정의해도 모든 우리 컴포넌트가 자연 융합.

**hover state·hover surface·primary-hover 등은 interface variable에서 제외** — host가 own (Trial 3에서 host의 hover 정책은 host의 자유로 확인됨).

**이유**: (a) Trial 3가 입증한 invisibility 결함의 근본 원인은 우리·host의 CSS variable 이름 contract 부재. (b) interface variable은 host의 색 시스템을 우리 컴포넌트가 자연 흡수하는 "1단계 layer A 모델"의 명시화. Trial 2가 우연히 작동한 패턴을 의도적 contract로 격상. (c) cascade fallback은 host가 일부만 정의해도 작동하는 progressive enhancement. host 미정의·일부 정의·전체 정의 모두 동작. (d) interface variable은 host가 정의할 가능성 높은 *통상 이름* — ppt가 정의한 8개에서 6개를 채택해 진짜 dogfood 환경 기준. (e) 1인 운영 부담 최소 — 우리 internal token 이름·구조는 그대로 유지, alias·fallback 추가만으로 contract 만족.

**트레이드오프**: (1) 우리 tokens.css 크기가 약간 증가 (interface variable 6개 default emit). (2) 컴포넌트 reference 코드가 약간 복잡해짐 (`var(host, fallback)` 패턴). (3) interface variable 6개는 1단계 dogfood 기준 — 다른 host product 등장 시 추가 후보 발생 가능 (예: surface-hover, primary-hover). 그 시점에 ADR 갱신. (4) 우리 internal token (`--color-surface-white` 등)이 색조 이름이라 semantic 위반인 부수 issue는 본 ADR 범위 외 — 후속 phase에서 정리.

**Supersede**: ADR-007의 "Primary = WONIK BLUE #273E82"는 그대로 유효 — 우리 default 색. 단 host가 `--color-primary`로 자기 색을 정의하면 host 우선. design_system 정체성은 (a) web-sandbox standalone (b) host 미정의 시 fallback 두 군데서 WONIK BLUE 유지.
```

(위 ADR 본문은 spec 예시 — 작성자가 결정 4가지에 대한 사용자 의견 반영 후 최종 작성)

### 산출물

1. `docs/ADR.md` 에 ADR-010 추가
2. `docs/PRD.md` 또는 `docs/ARCHITECTURE.md` 의 토큰 섹션 — interface variable 개념 한 단락 추가 (선택)
3. design_system 코드 변경 0 (`packages/`, `apps/`, `scripts/`, `CLAUDE.md` 그대로)

## Acceptance Criteria

```bash
cd C:/Users/ohjih/design_system

# ADR-010 추가됨
grep -q "### ADR-010" docs/ADR.md
grep -q "interface variable" docs/ADR.md
grep -q "namespace contract" docs/ADR.md

# 기존 ADR들 보존
grep -q "### ADR-001" docs/ADR.md
grep -q "### ADR-009" docs/ADR.md

# 결정·이유·트레이드오프 3-section 형식
awk '/### ADR-010/,/### ADR-011|---$/' docs/ADR.md | grep -q "\*\*결정\*\*"
awk '/### ADR-010/,/### ADR-011|---$/' docs/ADR.md | grep -q "\*\*이유\*\*"
awk '/### ADR-010/,/### ADR-011|---$/' docs/ADR.md | grep -q "\*\*트레이드오프\*\*"

# interface variable 6개 명시
awk '/### ADR-010/,/### ADR-011|---$/' docs/ADR.md | grep -q "color-bg"
awk '/### ADR-010/,/### ADR-011|---$/' docs/ADR.md | grep -q "color-surface"
awk '/### ADR-010/,/### ADR-011|---$/' docs/ADR.md | grep -q "color-border"
awk '/### ADR-010/,/### ADR-011|---$/' docs/ADR.md | grep -q "color-text-muted"
awk '/### ADR-010/,/### ADR-011|---$/' docs/ADR.md | grep -q "color-primary"

# design_system 코드 변경 0
git diff packages/ apps/ scripts/ CLAUDE.md | wc -l    # 0

# AI 슬롭 anti-pattern 0
! grep -i -E "backdrop-filter: blur|gradient orb|lottie" docs/ADR.md
```

## 검증 절차

1. AC 커맨드 실행.
2. 체크리스트:
   - ADR-010이 결정 4가지(interface variable list / cascade / 컴포넌트 reference / internal namespace)를 모두 다루나?
   - Trial 3 evidence를 명시적으로 인용하나?
   - 트레이드오프 절이 진짜 cost를 인정하나 (alias 부담, var() 패턴 복잡도 등)?
   - 1단계 layer A 모델 정신과 부합하나?
3. 결과에 따라 `phases/09-namespace-contract/index.json` step 0 업데이트:
   - 성공 → `"status": "completed"`, `"summary": "ADR-010 추가 — interface variable 6개 표준화 + cascade fallback 패턴 결정. design_system 코드 변경 0. 후속 step에서 tokens·components 구현."`
   - 실패 → `"status": "error"`, `"error_message": "구체 사유"`

## 금지사항

- **design_system 코드 변경 금지** — 본 step은 ADR 작성 단독. `packages/`·`apps/`·`scripts/`·`CLAUDE.md`·기타 docs 변경 0 (단 ADR.md만 추가).
- **interface variable 임의 추가 금지** — 6개로 시작. 추가 needs는 dogfood evidence 등장 시 별도 ADR.
- **internal token rename 금지** — `--color-surface-white` 등 기존 이름 유지. namespace 정리는 별도 phase.
- **컴포넌트 reference 코드 직접 변경 금지** — Step 2의 영역.
- **breaking change 금지** — alias 추가만, 기존 API 유지.
- **다른 ADR 수정 금지** — ADR-010 추가만, 기존 ADR들 그대로.
- **AI 슬롭 anti-pattern 도입 0** (backdrop-filter / gradient / glow / lottie 등 — ADR 문서 안에도).
