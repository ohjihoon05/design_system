# Step 1 — Presentation.tsx part 1 (Spinner + Card + Badge)

## 작업

- `import { Spinner, Button, Card, Badge } from "@wonik/web"` 추가
- local `function Spinner({className})` (25 lines) 제거
- Spinner 사용 5곳 모두 교체:
  - line 446 `h-8 w-8` → `<Spinner size="md">` + parent flex wrapper
  - line 492 `h-10 w-10` → `<Spinner size="lg">` (status="generating" 분기 내)
  - line 537 `h-3.5 w-3.5 text-primary` → `<span text-primary><Spinner size="sm"></span>` (currentColor 위임)
  - line 550, 610 `h-3 w-3` → `<Spinner size="sm">` (replace_all)
- **Card 적용** (line 489 generation/empty placeholder): `<div rounded-xl border ... bg-surface p-16 text-center>` → `<Card padding="lg" className="text-center">`. (status="generating" 또는 빈 slides 코드 path)
- **Badge 첫 dogfood** (line 708): `<span px-2 py-0.5 rounded bg-surface border-border>{current.layout}</span>` → `<Badge variant="neutral">{current.layout}</Badge>`

## 첫 인상

- Badge가 ppt 원본 pill과 시각상 거의 동일 ✅
- Card는 fixture status=READY로 미가시 (Trial 7 후속에서 status=generating fixture로 측정)
