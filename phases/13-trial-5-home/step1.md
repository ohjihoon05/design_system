# Step 1 — Home.tsx 교체 part 1 (Textarea + AI 다듬기 Button + PDF Card)

## 작업 (실행 결과)

### 1.1 Import 변경

```diff
- import { Spinner, Button } from "@wonik/web";
+ import { Spinner, Button, Textarea, Card } from "@wonik/web";
```

### 1.2 Textarea 교체 (line 184–199)

`<textarea>` → `<Textarea resize="none" className="w-full">`. 시각도 className 12개(rounded·border·bg·text·placeholder·focus·resize·transition) 모두 제거 — Textarea가 cascade로 처리. native attr 8개(id/value/onChange/placeholder/rows/maxLength/required/aria-describedby) 모두 통과.

### 1.3 "AI와 주제 다듬기" Button 교체 (line 208–233)

inline `<button>` + `style={{background, color, border}}` → `<Button variant="outline" size="sm" className="inline-flex items-center gap-1.5">` + svg + text children. 시각도 inline style 3종 + className(text-xs font-medium px-3 py-1.5 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed) 제거 — Button이 처리.

### 1.4 PDF dropzone Card 교체 (line 259–303)

outer `<div onDrop·onDragOver·onClick className="rounded-lg border-2 border-dashed px-4 py-4 ...">` → `<Card padding="md" onDrop·onDragOver·onClick className="text-center cursor-pointer transition-colors">`. 시각도 conditional className(border-primary/bg-primary/5, border-border/hover-primary/50/surface-hover) 제거 — Card 기본 surface bg + 1px solid border + rounded.

**의도된 손실**: dashed border, pdfFile 선택 시 primary border highlight, hover state. 모두 H3 evidence "Card variant=outline w/ dashed needs".

### 1.5 "삭제" Button 교체 (line 288–298)

inline `<button className="text-red-400 hover:text-red-300 underline">` → `<Button variant="danger" size="sm" className="ml-2">`. e.stopPropagation 보존.

## 첫 인상 메모

- **Card dashed 손실**: 시각상 명확. dropzone affordance 약해짐 — evidence ✅
- **AI 다듬기 outline Button**: 자연. ppt 원본 inline과 거의 동일 시각.
- **Verbosity는 Step 2에서**.

## 통과 조건

- 1.1·1.2·1.3·1.4·1.5·1.6 ✅
- 1.T1 (tsc --noEmit, dev server boot) — Step 3 전 통합 검증 ✅
- 1.S1 (신규 코드 hex 0): `git diff` 신규 라인에 `#[0-9a-fA-F]{6}` 0 ✅
