# Step 3 — 캡쳐 + AI 시각 분석 + 매트릭스 채움

## 작업 (실행 결과)

### 3.1 dev server boot

- `pnpm --dir C:/Users/ohjih/ppt/frontend dev` — Vite v6.4.2
- port fallback: 3000→3001→3002→3003 모두 사용 중 → **3004로 fallback** (Trial 4 learning 재확인)
- ready in 15097ms (lockfile 재최적화)

### 3.2 default 캡쳐

```powershell
& "C:/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu `
  --screenshot=C:/Users/ohjih/design_system/pkg-out/trial-5-home-default.png `
  --window-size=1280,1024 --virtual-time-budget=6000 "http://localhost:3004/"
```

→ 39522 bytes PNG. 폼 8개 부위 모두 가시.

### 3.3 with-pdf 캡쳐 (best-effort)

dev-only fixture 가드 추가:
```ts
if (import.meta.env.DEV && new URLSearchParams(window.location.search).get("fixture") === "with-pdf") {
  const mockPdf = new File([""], "trial-5-mock-document.pdf", { type: "application/pdf" });
  Object.defineProperty(mockPdf, "size", { value: 2_500_000 });
  setPdfFile(mockPdf);
  setPrompt("AI 트렌드와 비즈니스 활용 방안에 대한 발표자료");
  return;
}
```

`?fixture=with-pdf` 캡쳐 → 39715 bytes PNG. "삭제" Button danger + Card 안 child 정렬 입증.

### 3.4 AI 시각 분석 매트릭스 (8행)

`docs/dogfood-trial-5.md` §발견 매트릭스 참조.

### 3.5 H2/H3/H4 종합 판정

- **H2**: ✅ ADR-010 cascade form-heavy 페이지에서도 회귀 0 — 3회째 페이지 재입증.
- **H3 누적**: Badge 4회(강함), Alert 2회(mid), IconButton 0회 누적(Trial 4 격하).
- **H4 신규**: ToggleGroup mid 첫 등장, "Card variant=outline w/ dashed" 약함 신규.

## 통과 조건

- 3.1·3.2·3.4·3.5 ✅
- 3.3 ✅ (best-effort 달성)
- 3.T1 (dev server 응답) ✅ — http://localhost:3004/ Vite ready
- 3.T2 (PNG sanity) ✅ — 두 파일 모두 PNG 헤더 정상, 시각 확인
- 3.S1 (보안 — 캡쳐에 사용자 데이터 0) ✅ — 더미 텍스트만, 더미 파일명 "trial-5-mock-document.pdf"
