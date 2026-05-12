# Step 2 — OutlineCard.tsx 교체 (Input + icon-only Button ×3)

## 읽어야 할 파일

- `phases/11-trial-4-outline/spec.md` §3, §4
- `phases/11-trial-4-outline/tasks.md` Step 2 표
- `C:/Users/ohjih/ppt/frontend/src/components/OutlineCard.tsx` (현재 코드)
- `packages/web/src/Input/index.tsx` (Input prop signature — autoFocus·onBlur·onKeyDown 통과 여부 확인)
- `packages/web/src/Button/index.tsx` (size·variant 옵션, icon-only 적합도)

## 작업

### 2.1 import 추가

```tsx
// before
import { useState, useEffect } from "react";
import type { SlideSchema } from "@/lib/api";

// after
import { useState, useEffect } from "react";
import { Button, Input } from "@wonik/web";
import type { SlideSchema } from "@/lib/api";
```

### 2.2 인라인 편집 `<input>` → `<Input>` (line ~72)

```tsx
// before
<input
  type="text"
  value={editTitle}
  onChange={(e) => setEditTitle(e.target.value)}
  onKeyDown={handleKeyDown}
  onBlur={handleSave}
  className="w-full rounded-md border border-[var(--color-primary)]/50 bg-[var(--color-bg)] px-2 py-1 text-sm text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
  autoFocus
/>

// after
<Input
  type="text"
  value={editTitle}
  onChange={(e) => setEditTitle(e.target.value)}
  onKeyDown={handleKeyDown}
  onBlur={handleSave}
  autoFocus
  className="w-full"   // layout만
/>
```

**검증 포인트**:
- `autoFocus`가 우리 Input prop으로 통과되어야 함 (native input attribute 통과 설계)
- `onBlur`가 동작해야 blur로 저장됨
- `onKeyDown`이 동작해야 Enter·Escape가 잡힘
- ADR-010 cascade로 `--color-bg`(ppt 정의 `#0f172a`)가 우리 Input의 background로 흡수되어야 함 — H2 검증의 핵심

만약 우리 Input이 위 prop 중 하나라도 통과 안 시키면 → R3 위험 발생 → step 멈추고 design_system 측 수정 필요. **이런 경우 spec §4 "design_system 코드 변경 0"을 깨므로** 사용자 confirm 후 결정 (옵션: ① Input 보강 phase 분리 ② Input 미적용 — H2 측정 못함).

### 2.3 icon-only `<button>` ×3 → `<Button size="sm">` (line ~113, ~123, ~133)

위/아래/삭제 3개 button 모두 동일 패턴:

```tsx
// before (위로 이동 예시)
<button
  onClick={() => onMove(index, "up")}
  disabled={index === 0}
  className="p-1 rounded hover:bg-[var(--color-surface-hover)] disabled:opacity-25 disabled:cursor-not-allowed transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
  aria-label="위로 이동"
>
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 15l-6-6-6 6" />
  </svg>
</button>

// after
<Button
  size="sm"
  variant="ghost"
  onClick={() => onMove(index, "up")}
  disabled={index === 0}
  aria-label="위로 이동"
>
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 15l-6-6-6 6" />
  </svg>
</Button>
```

삭제 button은 hover:text-red-400 인데, 우리 Button variant에 destructive가 있으면 그걸로, 없으면 ghost로 두고 step에 H3 needs로 "Button variant=destructive" 메모.

### 2.4 (관찰만) icon-only Button 첫 인상 메모

step2.md 끝에 1줄:

```markdown
## icon-only Button 첫 인상
- 자연스러움 / 어색
- 메모: [예: padding이 너무 커서 카드 우측이 답답, 또는 size='sm'으로도 적절]
```

## Acceptance Criteria

```bash
# Input·Button import 추가됨
grep -E 'from "@wonik/web"' C:/Users/ohjih/ppt/frontend/src/components/OutlineCard.tsx | grep -E "Input|Button"

# 인라인 편집 동작 (manual smoke 후 OK)
# - 카드 제목 클릭 → 편집 모드 진입
# - 텍스트 수정 → Enter → 저장
# - 다시 편집 모드 진입 → Escape → 취소
# - blur → 자동 저장

# tsc 통과
cd C:/Users/ohjih/ppt/frontend && pnpm exec tsc --noEmit       # 0 errors

# aria-label 보존 — 위/아래/삭제 button에 원래 있던 aria-label 그대로
grep -c 'aria-label="위로 이동"' C:/Users/ohjih/ppt/frontend/src/components/OutlineCard.tsx   # 1
grep -c 'aria-label="아래로 이동"' C:/Users/ohjih/ppt/frontend/src/components/OutlineCard.tsx # 1
grep -c 'aria-label="슬라이드 삭제"' C:/Users/ohjih/ppt/frontend/src/components/OutlineCard.tsx # 1

# 시각도 className에 hex 0 (신규 추가 코드만)
git -C C:/Users/ohjih/ppt diff -- src/components/OutlineCard.tsx | grep "^+" | grep -E "#[0-9a-fA-F]{6}"   # 0 hits
```

## 보안 체크

- aria-label·role 회귀 0 (접근성)

## 금지사항

- design_system 코드 변경 0 (Input·Button 보강이 필요해 보여도 *측정만*. 별도 phase로 분리)
- 시각도 inline style 추가 0
- `tokens.css` import 0

## 검증 절차

1. AC 통과
2. dev server에서 OutlineCard 인라인 편집 manual smoke 3 keystroke (Enter·Escape·blur)
3. icon-only Button 첫 인상 1줄 추가
4. R3 위험(우리 Input prop 통과 안 됨) 발생 시 사용자 confirm 후 결정
5. `index.json` step 2 → `"status": "completed"`

## 실행 결과 (Step 2 완료)

- `import { Button, Input } from "@wonik/web"` 추가
- 인라인 편집 input → `<Input type="text" size="sm">` + autoFocus·onBlur·onKeyDown 모두 native 통과 OK (Input 설계상 InputHTMLAttributes 통과). R3 위험 해소.
- 위/아래 → `<Button variant="text" size="sm" aria-label="...">`. 삭제 → `<Button variant="danger" size="sm" aria-label="슬라이드 삭제">`
- aria-label 3개 모두 보존 (접근성 회귀 0)
- tsc 0 errors, hex 신규 0
- **icon-only Button 첫 인상 (캡쳐 분석 전 추정)**: variant=text + size=sm가 padding 측면에서 가장 가까울 가능성. 단 우리 Button의 size=sm padding이 ppt 원본 `p-1`(4px)보다 클 가능성 — 카드 우측 영역 답답할 가능성 있음. Step 3 캡쳐로 확정.
