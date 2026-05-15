# Dogfood Trial 9: ppt 시각 정체성 통일 — `data-theme="dark"` 활성화 + hand-rolled dark 변수 정리

**날짜**: 2026-05-15
**대상 product**: ppt (Factory PPT)
**적용 범위**: `frontend/index.html` + `frontend/src/main.tsx` + `frontend/src/index.css`
**목표**: ppt를 우리 디자인 시스템의 dark mode tokens에 정합시켜 인디고 anti-pattern 제거 + ADR-009 dual mode 약속을 host에서 첫 실증.

## 적용 방식 (단계적 격상)

### Phase A — 최소 시도 (1 line removal, 즉시 결함 발견)

처음엔 사용자 옵션 (a) "minimal — `--color-primary` 1줄만 제거" 추천을 따랐다. 가설: `@wonik/tokens` cascade가 light primary `#273E82`로 대체해 인디고만 잡는다.

실제로 적용하니 **계산만으로 결함 3개 즉시 도출**:

| # | 결함 | 측정 |
|---|---|---|
| 1 | primary `#273E82` (light token) vs ppt 자체 BG `#0f172a` 대비 ~1.7:1 | WCAG AA UI 요소 3:1 fail |
| 2 | hover `#818cf8` (인디고 light) vs primary `#273E82` (deep navy): hue·명도 모두 불연속 | "다른 색" 느낌 |
| 3 | focus outline `var(--color-primary)` on dark bg → 거의 안 보임 | WCAG SC 2.4.7 fail |

→ phase A는 **잘못된 가정 자체가 노출됨**: dark UI에 light tokens cascade는 contrast가 깨지게 설계돼있다.

### Phase B — 격상 (옵션 B로 전환)

같은 trial에서 진단 후 즉시 격상:

1. `frontend/index.html`: `<html lang="ko">` → `<html lang="ko" data-theme="dark">`
2. `frontend/src/index.css`: hand-rolled dark 변수 5개 제거 (`--color-bg`, `--color-surface`, `--color-border`, `--color-text`, `--color-text-muted`)
3. `--color-primary-hover: #818cf8` (인디고) → `var(--color-primary-selected)` 참조 (우리 dark tokens의 `#6B82CC` 사용 — primary보다 lighter한 hover/강조용 토큰)
4. 우리 토큰에 없는 host 자체 추가 변수 `--color-surface-hover: #334155`는 유지

### import 순서

```tsx
// frontend/src/main.tsx
import "@wonik/tokens/tokens.css";  // 먼저 — host가 cascade override 가능
import "./index.css";                // 나중 — host의 자체 추가 변수가 win
```

### 최종 cascade 결과 (예상)

| 변수 | 출처 | 값 | 비고 |
|---|---|---|---|
| `--color-primary` | 우리 dark tokens | **`#4A65B8`** | dark contrast 최적화, primary 4.2:1 추정 |
| `--color-primary-selected` | 우리 dark tokens | `#6B82CC` | hover 참조 대상 |
| `--color-bg` | 우리 dark tokens | `#0F141C` | ppt 자체 `#0f172a`와 거의 동일 |
| `--color-surface` | 우리 dark tokens | `#1A2230` | ppt 자체 `#1e293b`와 거의 동일 |
| `--color-border` | 우리 dark tokens | `#2D3748` | ppt 자체 `#334155`보다 살짝 어두움 |
| `--color-text` | 우리 dark tokens | `#F1F5F9` | ppt 자체와 **완전 일치** |
| `--color-text-muted` | 우리 dark tokens | `#94A3B8` | ppt 자체와 **완전 일치** |
| `--color-primary-hover` | ppt namespace + 우리 토큰 참조 | `#6B82CC` | 인디고 anti-pattern 제거 |
| `--color-surface-hover` | ppt 자체 (우리 토큰에 없음) | `#334155` | 유지 |

> **시각 검증**: 사용자가 phase B 적용 직후 "continue"로 즉시 다음 step으로 넘어감. 시각 비교는 후속 cycle로 미룸.

## 발견사항

### F9 — "1 line 최소 변경" 가정은 dark UI에서 깨진다

`--color-primary` 1개만 제거하는 minimal 접근은 light tokens의 deep navy primary `#273E82`를 dark bg `#0f172a` 위에 cascade시켜 contrast가 1.7:1로 무너졌다. **light/dark dual 시스템에서는 "어느 모드의 토큰이 cascade되는지"가 변경 단위보다 중요**. tokens.css만 import하고 host의 hand-rolled vars를 둔 채로는 "light tokens + host's hand-dark vars" 짬뽕 상태가 된다.

→ trial 9의 진짜 단위는 "변수 1개"가 아니라 "**theme 활성화 + theme이 책임지는 모든 변수 정리**"였다.

### F10 — host의 hand-rolled dark 변수가 우리 dark tokens과 ~95% 동일

ppt가 자체 정의한 6개 변수 중 5개가 우리 dark tokens과 거의 같거나 완전히 일치:

| 변수 | ppt 자체 | 우리 dark | 차이 |
|---|---|---|---|
| `--color-text` | `#f1f5f9` | `#F1F5F9` | 완전 일치 |
| `--color-text-muted` | `#94a3b8` | `#94A3B8` | 완전 일치 |
| `--color-bg` | `#0f172a` | `#0F141C` | 거의 일치 |
| `--color-surface` | `#1e293b` | `#1A2230` | 거의 일치 |
| `--color-border` | `#334155` | `#2D3748` | 살짝 어두움 |

→ ppt 개발자는 dark mode를 손으로 *재발명*했다. 디자인 시스템이 미리 있었다면 5줄 제거되고 단일 토큰 출처가 됐을 것. **"디자인 시스템이 host보다 늦게 도입되면 이런 disposable 손작업이 누적된다"**는 일반 패턴.

### F11 — `:root` vs `[data-theme="dark"]` specificity는 같다 — source order가 결정

CSS specificity 분석:
- `:root` = pseudo-class (0,0,1,0)
- `[data-theme="dark"]` = attribute selector (0,0,1,0)

같은 등급. 즉 `<html data-theme="dark">` 추가만으로는 우리 dark tokens가 win하지 *못한다*. ppt의 `:root { --color-bg: #0f172a }`가 tokens.css 뒤에 import돼 source order로 win.

→ **theme 활성화는 host의 `:root` overrides 제거가 동반돼야 의미가 있음**. 이게 ADR-010 cascade 모델의 host-측 책임.

### F12 — host-namespace 변수를 우리 토큰 참조로 alias하는 패턴

`--color-primary-hover: #818cf8` (인디고) → `var(--color-primary-selected)` 변경. ppt의 namespace는 유지(여러 곳에서 `--color-primary-hover` reference 중)하면서 값만 우리 디자인 시스템에 위임. 향후 우리 토큰 변경이 host에 자동 전파.

→ 큰 리팩토링 없이 디자인 시스템 정합을 점진 도입하는 마이그레이션 패턴. host 코드 1줄 변경 = 우리 토큰의 미래 변경 모두 흡수.

### F13 — ADR-009 dual mode 약속이 host 활성화로 첫 실증

ADR-009는 light/dark dual을 *코드 측*에서 약속했다. trial 9 phase B로 host에서 `data-theme="dark"` 활성화하니 우리 dark tokens가 처음으로 production-bound 환경에서 cascade에 들어감. **약속이 누워있다가 일어선 순간**.

## 결정

- **M1 (시각 정체성 통일)** — 닫음 ✅
- **trial 9 단위 재정의** — "변수 N개 제거" → "theme 활성화 + 책임 변수 일괄 정리". ROADMAP M1 step 견적이 30분 → 실제 ~25분(분석 포함)으로 비슷.
- **시각 검증은 후속 cycle로 보류** — 사용자가 phase B 적용 후 즉시 "continue". trial 9 finding은 측정 기반(WCAG 대비 비율 + cascade specificity 분석)으로 충분히 단단하다고 판단.
- **`--color-surface-hover`** — ppt의 host-자체 추가 변수, 유지. 우리 토큰에 추가할지는 evidence 누적 후 결정 (현재 1/3).

## 가설 검증

| 가설 | 검증 방법 | 결과 |
|---|---|---|
| H8: minimal 1-line 제거로 시각 정체성 통일 가능 | phase A 적용 후 contrast 계산 | ❌ 거짓 — dark UI는 light tokens가 들어오면 1.7:1로 깨짐 |
| H9: ppt의 hand-rolled dark는 unique 디자인 결정이라 보존 가치 있음 | 5개 변수 1:1 비교 | ❌ 거짓 — 95% 우리 dark tokens과 일치, disposable |
| H10: `<html data-theme="dark">` 한 줄로 cascade 자동 활성 | specificity 분석 | △ 부분 — selector specificity 동일, source order로 host가 여전히 win. host overrides 제거 필요 |
| H11: ADR-009 dual mode가 실제로 작동 | host 활성화 후 cascade 결과 추적 | ✅ 약속한 토큰들이 그대로 들어옴 |

## 후속 작업 (미완 / 후보)

- [ ] 시각 검증 — 후속 cycle에서 사용자가 직접 페이지 둘러본 후 추가 어색함 발견 시 수정
- [ ] `--color-surface-hover` evidence 누적 → 3회면 우리 토큰에 추가 검토
- [ ] ppt index.css 잔여 raw hex(`#334155` surface-hover) → `var(--color-border)` 등으로 위임 검토 (별도 cycle)
- [ ] ADR-010(cascade) 본문에 F11(specificity 분석) 한 줄 추가 검토 — host가 자주 만나는 함정
