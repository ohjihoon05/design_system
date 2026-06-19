# UI 디자인 가이드

본 가이드는 3개 section으로 구성된다:

1. **Brand Foundation** — 모든 영역(현재·미래)이 따라야 할 brand-level 표준 (색·타이포·spacing·voice·anti-pattern). 단일 source of truth.
2. **Web** — 1단계 작업 영역. `@wonik/web` 컴포넌트의 시각·구조 가이드.
3. **HMI Reference** — WARP 시안 보존 reference. 진짜 HMI product 등장 시 참조 (ADR-001/004).

작업자가 1단계에서 봐야 할 부분은 **Brand Foundation + Web** 두 section. HMI Reference는 미래 결정용 자료.

---

# 1. Brand Foundation

원익IPS 모든 web service·미래의 어떤 form factor라도 따라야 할 표준. 토큰의 정확한 source of truth는 `packages/tokens/src/*` 코드이며, 본 section은 그 토큰의 의미·사용 규칙을 정리한다.

## 디자인 원칙 (모든 영역 공통)

1. **도구처럼 보여야 한다.** 매일 쓰는 인터페이스는 마케팅 페이지가 아니다. 장식보다 정보가 먼저.
2. **Border 대비로 elevation을 표현한다.** Box-shadow와 glow 효과는 사용하지 않는다.
3. **여백 낭비를 경계한다.** 정보 밀도를 우선. 단 form factor에 맞는 ergonomic 여백은 Web/HMI section에서 별도 정의.
4. **한 컴포넌트는 한 가지 일을 한다.** 다목적 컴포넌트보다 simple primitive를 선호. 복합 UI는 primitive를 조합.
5. **상태는 명확한 시각 시그널로 표현한다.** 색만으로는 부족하다 — 색 + 텍스트 + (필요시) 도트·아이콘. 색맹·저시력·환경 조명 변화에도 인식 가능해야 한다.

## AI 슬롭 안티패턴 — 모든 영역에서 금지

| 금지 사항 | 이유 |
|-----------|------|
| backdrop-filter: blur() (글래스모피즘) | 가독성 저해. AI 템플릿의 가장 흔한 징후. |
| gradient-text (배경 그라데이션 텍스트) | AI가 만든 SaaS 랜딩의 1번 특징. 정보보다 장식. |
| "Powered by AI" 배지·라벨 | 기능이 아니라 장식. 사용자에게 가치 없음. |
| box-shadow 글로우 애니메이션 | 네온 글로우 = AI 슬롭. border-only elevation 원칙과 충돌. |
| 보라/인디고 brand color | "AI = 보라색" 클리셰. 원익IPS 브랜드 정체성과 무관. |
| 모든 카드에 동일한 rounded-2xl | 균일한 둥근 모서리는 템플릿 느낌. 본 시스템은 panel 10px / chip 0px / dot 50% 로 구분. |
| 배경 gradient orb (blur-3xl 원형) | AI 랜딩 페이지 장식. 정보 인터페이스에 무의미. |
| Decorative emoji | 라벨·버튼·UI 어디든 emoji 사용 금지. SVG만. |
| Lottie / 자동 재생 일러스트 애니메이션 | 시선을 정보가 아닌 장식으로 빼앗음. |

## Brand Color (공식 CI)

**출처**: [원익IPS 공식 CI](https://www.ips.co.kr/ko/company/ci.php) (ADR-007). 변경 금지 — 회사 공식 brand가 source of truth.

### Primary — WONIK BLUE
| 토큰 | 값 | 용도 |
|------|------|------|
| `--color-primary` | `#273E82` | **WONIK BLUE** — RGB(39,62,130), CMYK(70,52,0,49). 활성 상태·도트·강조·primary 버튼 |
| `--color-primary-pale` | `#EEF0F8` | 매우 옅은 tint — Run 상태 배경 등 |
| `--color-primary-bg` | `#D6DCF0` | 라이트 tint 배경 — 셀렉션, focus ring |
| `--color-primary-stroke` | `#A8B4D8` | 라이트 border |
| `--color-primary-selected` | `#1C2E60` | 더 어두운 톤 — selected border, hover 강조 |

### Secondary — WONIK GRAY
| 토큰 | 값 | 용도 |
|------|------|------|
| `--color-brand-secondary` | `#ACACAC` | **WONIK GRAY** — RGB(172,172,172), CMYK(0,0,0,33). 보조 강조·로고 sub element·brand-tied neutral |

WONIK GRAY는 brand 표현이 필요한 한정된 자리에서만 사용. 일반 텍스트·border용 grays(`--color-text-*`, `--color-border-*`)는 별도.

## Surface 색

| 토큰 | 값 | 용도 |
|------|------|------|
| `--color-canvas` | `#E8E8EA` | 메인 페이지 배경 |
| `--color-surface` | `#FEFEFE` | 카드·패널 배경 |
| `--color-surface-subtle` | `#F4F5F5` | 패널 header strip |
| `--color-surface-inset` | `#F5F5F5` | 중첩 패널 tint |
| `--color-dark-base` | `#1E1E21` | 다크 toolbar (HMI) |
| `--color-dark-header` | `#252528` | 다크 패널 header (HMI) |

## Border 색

| 토큰 | 값 |
|------|------|
| `--color-border` | `#E1E1E4` (라이트) |
| `--color-border-mid` | `#D4D4D8` |
| `--color-border-dark` | `#5C5C5C` |
| `--color-border-panel-dark` | `#52525C` (다크 패널) |

## Text 색

| 토큰 | 값 | 용도 |
|------|------|------|
| `--color-text-primary` | `#71717B` | 라벨 |
| `--color-text-secondary` | `#5C5C66` | 값 |
| `--color-text-dim` | `#52525C` | 보조 |
| `--color-text-dark` | `#303030` | 가장 진한 텍스트 |
| `--color-text-on-dark` | `#D9D9DC` | 다크 배경 위 라벨 |
| `--color-text-on-dark-val` | `#E0E0E3` | 다크 배경 위 값 |

## Status 시맨틱 색 (모든 영역 공통)

각 상태는 명확한 hue를 가진다 — 색만 보고도 의미를 알 수 있게. **이 의미는 어떤 form factor에서도 동일.**

| 상태 | 의미 | bg | text/dot |
|------|------|------|------|
| Idle | 중립/대기 | `#F4F5F5` | `#71717B` |
| Init | 초기화 중 (yellow) | `#FFFFAC` | `#7A6E00` |
| Ready | 준비 완료 (green) | `#E6FAF4` | `#00A876` |
| Run | 실행 중 (blue) | `#EEF0F8` | primary |
| Process End | 완료 (deep green) | `#D6F0E6` | `#07895E` |
| Warning / Manual | 주의 (amber) | `#FFF4DC` | `#D09804` |
| Alarm | 경고 (red) | `#FFE2E2` | `#CC0000` |
| Abort | 중단 (deep red) | `#FFCACA` | `#CC0000` |
| Processed | 처리 완료 (purple) | `#F3E8FF` | `#7C3AED` |

## Spacing scale (모든 영역 공통)

| 토큰 | 값 |
|------|-----|
| `--space-1` | 4px |
| `--space-2` | 6px |
| `--space-3` | 8px |
| `--space-4` | 10px |
| `--space-5` | 12px |
| `--space-6` | 16px |
| `--space-7` | 22px |
| `--space-8` | 32px |

추가 값(`--space-9`: 48, `--space-10`: 64)은 form-factor section에서 필요 시 추가 정의.

## Typography Family (모든 영역 공통)

- **Font**: Segoe UI (brand) → Inter (fallback) → system-ui. `--font-family` 토큰.
- **Bold (700) 사용 안 함** — 일관된 visual weight 유지. 강조는 색·크기·container로 표현.
- **Weights**: Regular (400) 기본, Medium (500) sparingly.

Scale은 form factor에 따라 다름 — Web/HMI section 참조.

## Iconography 원칙 (모든 영역 공통)

- **시스템**: 커스텀 모노라인 SVG.
- **스타일**: monoline, filled shapes, simple geometric, strokeWidth 1.5–2.
- **색상**: 부모로부터 inherit (`fill: currentColor`) — 활성 시 `var(--color-primary)`, 비활성 시 `var(--color-border-mid)`.
- **아이콘 컨테이너 박스 사용 안 함** — 둥근 배경 박스로 감싸지 않는다.
- **emoji·iconfont 사용 안 함.** SVG 또는 inline path만.

크기·아이콘 라이브러리 선택은 form-factor section 참조.

## Border Radius (모든 영역 공통)

| 토큰 | 값 | 용도 |
|------|-----|------|
| `--radius-sm` | 5px | 작은 버튼·아이콘 박스 |
| `--radius-md` | 10px | 패널·카드 |
| `--radius-full` | 50% | 도트·원형 |

---

# 2. Web

`@wonik/web` 패키지의 컴포넌트 가이드. 1단계 작업 영역.

## Web Typography Scale

Brand Foundation의 폰트 family와 weights는 그대로 사용. Scale은 일반 사용자(사내 팀원) 가독성을 위해 더 큰 값 추가:

| 토큰 | 크기 | 용도 |
|------|------|------|
| `--font-size-label-sm` | 10px | 보조 라벨, badge text (Brand 공통) |
| `--font-size-label` | 12px | 기본 라벨, 값 (Brand 공통) |
| `--font-size-body` | 14px | Web 본문 (line-height 1.5) |
| `--font-size-h3` | 20px | 카드·섹션 제목 |
| `--font-size-h2` | 28px | 페이지 제목 |
| `--font-size-h1` | 40px | hero/landing |

위 web 스케일은 **ADR-040으로 비준·토큰화 완료** (2026-06-18). `Text` variant `body`/`h3`/`h2`/`h1`로 노출되며, `body`/`h1`~`h3`는 line-height 1.5(`--line-height-normal`) 자동 적용.

**Line height**: 본문 1.5 (`--line-height-normal`), 라벨/값 1 (`--line-height`) — ADR-040.

## Web 컴포넌트

### 카드 (Card)
Panel과 동일한 base를 가지되 더 ergonomic한 padding(`var(--space-6)` = 16px). HMI의 `panel-padding-x` = 13px보다 큼.

### 버튼 (Button)
**TBD: 디자이너 결정.** 후보:
- Primary: `bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-selected)]`
- Primary 대안: `bg-white text-black border border-neutral-300 hover:bg-neutral-50` (Linear/Vercel 스타일)
- Text: `text-neutral-500 hover:text-neutral-300`

첫 ppt 적용 시 본인 디자인 감각으로 확정.

### 입력 필드 (Input / Textarea)

ADR-010·011로 base 정착됨. 시각:
- background: `var(--color-surface, ...)`. host가 정의하면 host 우선 (Trial 3 closure 입증).
- border: `1px solid var(--color-border, ...)`. `:hover` 시 `var(--color-border-strong, ...)`.
- text: `var(--color-text, ...)` / placeholder는 `var(--color-placeholder, var(--color-text-dim))` + `opacity: 1` 명시.
- `:focus-visible`: `outline: 2px solid var(--color-focus, var(--color-primary))`, `outline-offset: 0` (border-통합 dual-cue, Material 3 outlined 패턴).
- Textarea 추가: `resize?: 'none' | 'vertical' | 'both'` prop. default `vertical`. disabled 시 `'none'` 강제.

### Form 컨트롤 polish 표준 (ADR-011)

| 컴포넌트 | focus offset | hover | placeholder |
|---|---|---|---|
| Input | 0px (border 통합) | border-strong | text-dim, opacity 1 |
| Textarea | 0px | border-strong | text-dim, opacity 1 |
| Button | 2px (분리 ring) | — | — |
| Checkbox | 2px | — | — |
| Radio | 2px | — | — |
| Switch | 2px | — | — |

공통: `:focus-visible` only (마우스 click focus는 indicator 안 보임). outline 2px. focus color는 `var(--color-focus, var(--color-primary))` cascade. WCAG 2.1 SC 2.4.7 AA + SC 1.4.11 3:1 contrast 충족.

구현 방식: 컴포넌트별 module-scope `ensureCssInjected()` 패턴 (ARCHITECTURE.md 참조). inline style로 못 푸는 pseudo-class·pseudo-element를 처리.

### 상태 칩 (Status Chip — Web variant)
Brand의 status 색을 사용하되 Web에서는 더 ergonomic하게 — `height: 24px`, `border-radius: 4px`, `padding: 0 8px`. (HMI variant는 17px·radius 0.)

### 테이블 셀 (Table Cell — Web variant)
`height: 36px+`, `border: 1px solid var(--color-border)`, `padding: 0 12px`. 행 alternation 가능 — HMI의 dense 20px와 다름.

## Web 레이아웃

- **데스크톱 우선**: 1280px+ 기본 viewport. 모바일 반응형은 1단계 외 (ADR-005).
- **콘텐츠 max-width**: TBD (디자이너 결정). 후보 — `max-w-7xl` (1280px) / `max-w-6xl` (1152px) / `max-w-5xl` (1024px).
- **정렬**: 좌측 정렬 기본. 중앙 정렬은 hero/onboarding 같은 특수 케이스에만.

### Layout 함정 가드 (Flex / Grid)

flex item·grid item의 기본 `min-width: auto`는 콘텐츠 min-content 이상으로 트랙을 부풀린다. 두 방향 함정 모두 가드 필요:

- **자식이 부모 밖으로 over-grow**: `flex: 1`만 준 자식은 콘텐츠로 부풀음. 줄어들어도 되는 자식엔 `min-width: 0`, 절대 안 줄어드는 자식(아이콘·칩·숫자)엔 `flex-shrink: 0`. 두 짝으로 박는다. 사례: `apps/demo-fab-monitor/src/components/EquipmentRow.tsx`.
- **자식이 한 글자씩 세로로 over-shrink**: grid `'minmax(0, 1fr)'`은 fr 트랙을 0까지 squeeze 허용 → 부모가 좁으면 콘텐츠 보호 없이 column이 죽고 글자가 세로로 흘러내림. 좁은 화면용 1-column fallback: `gridTemplateColumns: 'repeat(auto-fit, minmax(min(360px, 100%), 1fr))'` (auto-fit이 자동 wrap). 사례: `apps/demo-fab-monitor/src/pages/AlarmsPage.tsx`.

새 페이지·복합 layout 작성 시 두 함정 모두 의식. `Stack` 컴포넌트가 `direction="row"`일 때 자식 `min-width: 0`을 default로 줄지는 미정 — 결정 시 ADR로.

## Web 애니메이션

**최소한만 허용.** 후보:
- `fade-in` (0.2s ease) — Modal·Toast 등장
- `slide-up` (0.25s ease-out) — Sheet·Drawer

그 외 모든 애니메이션 금지 (bounce, scale on hover, 무한 반복 글로우 등 — AI 슬롭 안티패턴 참조).

**TBD: 디자이너 결정.** 첫 ppt 적용 시 확정.

## Web 아이콘

Brand의 모노라인 원칙 따름. **TBD**: 일반 web service 아이콘(저장·삭제·공유·검색 등)을 Lucide(`lucide-react`)로 import할지, 자체 SVG 디자인할지 결정.

크기: 일반 inline 아이콘 12–20px, 버튼 내부 아이콘 16–18px.

---

# 3. HMI Reference (WARP 시안 보존)

**위치**: `WONIK IPS — WARP Design System/`

진짜 HMI product가 아직 등장 안 한 상태이므로, 본 section은 미래 결정용 reference이다. 1단계에서는 컴포넌트 production화하지 않는다 (ADR-004). 진짜 HMI product 등장 시 형태를 결정한다 — `@wonik/web` 안에 `industrial` variant prop으로 흡수할지, 별도 `@wonik/warp` 패키지로 분리할지 (ADR-001).

## 시안의 시각 언어 핵심

- **Canvas**: 1920×1080 고정. Scroll 없음. 모든 정보가 한 화면 안에.
- **Mode**: Light-mode industrial. **No glass / no gradient / no animation.**
- **Density**: micro 8px·label-sm 10px·label 12px의 dense font scale. Status chip 17px·dot 4px·table cell 20px의 작은 컴포넌트 크기.
- **Elevation**: Border 대비로만 표현 (shadow 0).
- **Top toolbar**: 67px 다크.
- **Hover/animation**: 없음 — 산업용 신뢰성·정확성 우선.

## 시안 컴포넌트 (Reference만)

| 컴포넌트 | 용도 | 산업 도메인 specific |
|---------|-----|------|
| Panel | 카드·데이터 패널 (10px radius, light·dark 모두) | — |
| StatusIndicator | StatusDot, StateChip, ModuleLabel | — |
| Toolbar | 다크 toolbar, 67px 높이, 다양한 산업용 아이콘 (SCD/PLAYBACK/TERMINAL/MODE/SYS'INIT/ALARM/BUZZER) | ✅ |
| WaferMappingPanel | Wafer 슬롯 그리드 (Empty/Occupied/Processed/Aborted) | ✅ |
| ChamberStateList | Init/Ready/Run/Process End/Access Ready/Alarm/Abort 상태 표시 | ✅ |
| LoadPortRow | LPT 정보 행 (Carrier ID, Status, Access Mode) | ✅ |

산업 도메인 specific 컴포넌트(`✅`)는 진짜 HMI product의 needs가 명확해진 후 production화 형태 결정.

## HMI Typography Scale (시안)

Brand의 폰트 family는 그대로. Scale은 dense 산업용:

| 토큰 | 크기 | 용도 |
|------|------|------|
| `--font-size-micro` | 8px | 센서 readout, 가장 작은 status |
| `--font-size-label-sm` | 10px | 아이콘 캡션, 서브 라벨 |
| `--font-size-label` | 12px | 기본 라벨, 값, 상태 텍스트 |
| `--font-size-title-sm` | 14px | 섹션·모듈명 (WARP, ADMIN 등) |

**Line height**: 100% (`--line-height: 1`) — 산업용 dense.

## HMI 컴포넌트 사이즈 (시안)

| 토큰 | 값 |
|------|-----|
| `--toolbar-h` | 67px |
| `--panel-header-h` | 40px |
| `--panel-padding-x` | 13px |
| `--table-cell-h` | 20px |
| `--status-chip-h` | 17px |
| `--status-dot-size` | 4px |
| `--toolbar-icon-size` | 36px |

## 진짜 HMI product 등장 시 결정 사항

1. **분리 vs 통합** — `@wonik/web`에 `variant="industrial"` prop으로 흡수 vs `@wonik/warp` 별도 패키지.
2. **시안의 inconsistency 정리** — 시안에 있던 `#2B7FFF`(구 brand) → `#273E82`로 통일, undefined CSS vars 정의 추가.
3. **자산(assets/) 이전** — 장비 다이어그램·로고·산업용 아이콘 SVG의 적절한 위치 결정.
4. **Code Connect / Figma 동기화** — HMI product의 디자이너·개발자 협업 모델에 맞춰 결정.
