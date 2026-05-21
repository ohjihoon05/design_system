# Step 4 — Sandbox 매트릭스 + 캡쳐 + AI 시각 분석

## 작업 (실행 결과)

`apps/web-sandbox/src/App.tsx`:
- `Badge` + `BadgeVariant` import 추가.
- `badgeVariants = ['neutral', 'primary']`, `badgeSamples = [{label:"short label", content:"layout"}, {label:"count number", content:"8장"}, {label:"single digit", content:"1"}, {label:"mixed", content:"Draft v1.0"}]`.
- 헤더 부제 "13 atoms" 갱신.
- `<BadgeMatrixSection />` 컴포넌트 추가 — 2 variant × 4 컨텐츠 = 8셀 매트릭스. Card 다음, BeforeAfter 이전.

캡쳐: `pkg-out/phase-14-badge-matrix.png` (~330KB, 1400×6800 full sandbox).

## AI 시각 분석

- **neutral row** (4셀: "layout" / "8장" / "1" / "Draft v1.0"): 미세한 border + 옅은 surface bg + 어두운 text. subtle, label·tag·정보성. ✅ Trial 4 OutlineCard layout 패턴과 호환.
- **primary row** (동일 4셀): WONIK BLUE primary bg + 흰 텍스트 + 무 border. attention, count·강조. ✅ Trial 5 Home slideCount 패턴과 호환.
- 두 row 모두 작은 padding (4px 8px), radius 5px (rounded but not full pill), fontSize 12px, tabular-nums (숫자 "8장"/"1"/"v1.0" 가독성 OK).
- AI 슬롭 0: blur·gradient·glow 없음.

## 통과 조건

- 4.1·4.2·4.3 ✅
- 4.T1 (PNG sanity, ~330KB, sandbox 전체 가시) ✅
- spec S11 (primary가 ppt slideCount와 자연 호환 추측) ✅
- spec S12 (neutral이 OutlineCard layout label과 자연 호환 추측) ✅
- spec S13 (AI 슬롭 anti-pattern 0) ✅
