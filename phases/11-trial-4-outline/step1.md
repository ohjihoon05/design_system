# Step 1 — Outline.tsx 교체 (Spinner + 일반 Button ×3)

## 읽어야 할 파일

- `phases/11-trial-4-outline/spec.md` §3 (in-scope), §4 (out-of-scope)
- `phases/11-trial-4-outline/tasks.md` Step 1 표
- `C:/Users/ohjih/ppt/frontend/src/pages/Outline.tsx` (현재 코드)
- `packages/web/src/Spinner/index.tsx` (Spinner prop signature)
- `packages/web/src/Button/index.tsx` (Button prop signature, size·variant 옵션)

## 작업

### 1.1 자체 Spinner 함수 제거

`Outline.tsx` line 19–43의 inline `function Spinner({ className })`을 통째로 삭제.

### 1.2 import 추가

```tsx
// before
import OutlineCard from "@/components/OutlineCard";

// after
import { Spinner, Button } from "@wonik/web";
import OutlineCard from "@/components/OutlineCard";
```

### 1.3 Spinner 사용처 교체 (3곳)

| 위치 | before | after |
|------|--------|-------|
| line ~212 (loading wrapper) | `<Spinner className="h-8 w-8 mx-auto mb-4" />` | `<Spinner size="lg" className="mx-auto mb-4" />` (size lg ≈ 32px, 우리 Spinner의 표준) |
| line ~257 (outline generating wrapper) | `<Spinner className="h-10 w-10 mx-auto mb-6 text-[var(--color-primary)]" />` | `<Spinner size="lg" className="mx-auto mb-6" />` (color는 currentColor 흡수 — 부모 text color 따라감) |
| line ~272 (full slide generation wrapper) | 동일 | 동일 |

→ `text-[var(--color-primary)]`는 우리 Spinner가 `currentColor`를 사용하면 부모 className으로 색을 줄 수 있으므로, 부모 `<div>`에 `text-[var(--color-primary)]`로 옮길지, 아니면 색을 빼고 default(text)로 둘지 step에서 결정. **default 권장** (시각도 0 원칙, host text 흡수).

### 1.4 "다시 시도" `<button>` → `<Button>` (line ~232)

```tsx
// before
<button
  onClick={() => { clearError(); if (id) fetchPresentation(id); }}
  className="text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
>
  다시 시도
</button>

// after
<Button
  variant="ghost"   // 또는 "tertiary" — 우리 Button signature에 맞춰
  size="sm"
  onClick={() => { clearError(); if (id) fetchPresentation(id); }}
>
  다시 시도
</Button>
```

variant가 ghost/tertiary 중 무엇인지는 `packages/web/src/Button/index.tsx`의 prop type을 보고 결정.

### 1.5 "승인하고 생성 시작" `<button>` → `<Button>` (line ~311)

```tsx
// before
<button
  onClick={handleApprove}
  disabled={isLoading || !outline || outline.length < 2}
  className="shrink-0 rounded-lg bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
>
  {isLoading ? "승인 중..." : "승인하고 생성 시작"}
</button>

// after
<Button
  variant="primary"
  size="md"   // 또는 lg — phase 07 ADR-007: lg는 hero/CTA 의미
  onClick={handleApprove}
  disabled={isLoading || !outline || outline.length < 2}
  className="shrink-0"   // layout만 유지 (CLARIFY 결정)
>
  {isLoading ? "승인 중..." : "승인하고 생성 시작"}
</Button>
```

### 1.6 "+ 슬라이드 추가" `<button>` → `<Button>` (line ~358)

```tsx
// before — dashed border + hover:border-primary 시각이 강함, 우리 Button로 동일 모양 가능?
<button
  onClick={addOutlineSlide}
  className="mt-4 w-full rounded-lg border-2 border-dashed border-[var(--color-border)] py-3 text-sm text-[var(--color-text-muted)] hover:border-[var(--color-primary)]/50 hover:text-[var(--color-primary)] transition-colors"
>
  + 슬라이드 추가
</button>

// after — dashed style은 ghost/secondary로 근사 (정확 매칭 어려우면 그대로 두고 H3 needs로 등록)
<Button
  variant="ghost"   // 또는 "secondary"
  size="md"
  onClick={addOutlineSlide}
  className="mt-4 w-full"   // layout만
>
  + 슬라이드 추가
</Button>
```

**dashed border 모양은 우리 Button에 없을 가능성 큼.** 시각 차이가 명확하면:
- 옵션 A: 그대로 교체 (기존 dashed 디자인 손실 → H3 needs "AddButton/DashedButton" 등록)
- 옵션 B: 교체 안 하고 ppt button 유지 → H3 needs "Button variant=ghost-dashed" 등록

step1.md 끝에 어떤 옵션을 골랐는지 1줄 메모.

## Acceptance Criteria

```bash
# Spinner 자체 함수 제거됨
! grep -E "^function Spinner" C:/Users/ohjih/ppt/frontend/src/pages/Outline.tsx

# 우리 컴포넌트 import 추가됨
grep -E 'from "@wonik/web"' C:/Users/ohjih/ppt/frontend/src/pages/Outline.tsx | grep -E "Spinner|Button"

# tsc 통과
cd C:/Users/ohjih/ppt/frontend && pnpm exec tsc --noEmit       # 0 errors

# dev server 부팅 (background로 띄우고 5초 후 health check)
pnpm dev &
sleep 5
curl -s http://localhost:3000/  # 또는 3001 — Outline.tsx route 도달 확인 (실제 outline에는 데이터 필요, 일단 route 200 OK만)

# 시각도 className에 hex 0 (신규 추가 코드만)
git -C C:/Users/ohjih/ppt diff -- src/pages/Outline.tsx | grep "^+" | grep -E "#[0-9a-fA-F]{6}"   # 0 hits
```

## 보안 체크

- 신규 코드에 hex/raw 색 리터럴 0 (CLAUDE.md CRITICAL)

## 금지사항

- design_system 코드 변경 0
- 시각도 inline style 추가 0 (color/border/radius/padding) — layout(width/margin/flex)만 허용
- `tokens.css` import 0
- aria-label·role 회귀 0 (button에 원래 없으면 OK, 있으면 보존)

## 검증 절차

1. AC 명령 모두 통과
2. dev server에서 Outline 페이지 시각 확인 (육안 — 캡쳐는 Step 3에서)
3. step1.md 끝에 1.6의 옵션 A/B 선택 1줄 추가
4. `index.json` step 1 → `"status": "completed"`, summary 1–2줄

## 실행 결과 (Step 1 완료)

- 자체 Spinner 함수(line 19–43) 제거 + `import { Button, Spinner } from "@wonik/web"` 추가
- Spinner 3곳 교체 — `size="lg"` (40px) + `block`. color는 부모 div에 `text-[var(--color-primary)]` 위임 (currentColor 흡수)
- "다시 시도" → `<Button variant="text" size="sm">`
- "승인하고 생성 시작" → `<Button variant="primary" size="md">` + layout className `shrink-0`만 유지
- "+ 슬라이드 추가" → 옵션 **A 채택**: `<Button variant="outline" size="md">` + layout `mt-4 w-full`만 유지. **dashed border는 우리 system에 없음 — H3 needs로 등록 (variant=outline-dashed 또는 별도 AddButton 컴포넌트 후보)**
- tsc 0 errors, hex 리터럴 신규 0
