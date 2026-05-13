# Step 2 — Presentation.tsx part 2 (Buttons + 미교체 메모)

## 작업

- slide nav prev/next (line 714, 724) `<button p-1 rounded hover:bg-surface aria-label>` → `<Button variant="text" size="sm" aria-label>` + svg child
- slide thumbnail delete (line 117) `<button absolute bg-red-500/80 w-5 h-5 rounded-full>` → `<div absolute>` wrapper + `<Button variant="danger" size="sm" aria-label>` "x"
- PPTX download (line 547) `<button bg-primary px-3.5 py-1.5>` → `<Button variant="primary" size="sm" className="inline-flex items-center gap-1.5">` + Spinner/svg + text

## 미교체 (evidence 메모)

- "+ 슬라이드 추가" dashed button (line 687 in original): **그대로 유지**. Trial 4 격하 결정 reaffirm. 누적 Trial 4 1 + Trial 6 1 = 2회 (약함).
- Error alert (line 484): **그대로 유지**. Alert needs 3회째 누적 evidence (Trial 4 inconclusive + Trial 5 1 + Trial 6 1).
- AI 채팅 / Regenerate flow / Right panel edit textareas: scope 폭증 회피, 본 trial 외.

## IconButton 부활 측정 첫 인상

Button text/sm nav 아이콘 — *약간 sparse 하지만 어색 0*. Trial 5 IconButton 격하 결정 reaffirm.
Button danger/sm thumbnail delete — hover 시 노출, static 캡쳐 미가시. Trial 7+에서 interactive 측정 필요.
