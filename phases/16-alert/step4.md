# Step 4 — Sandbox + 캡쳐

`apps/web-sandbox/src/App.tsx`:
- `Alert` import 추가
- 헤더 부제 "14 atoms" 갱신
- `<AlertMatrixSection />` 컴포넌트 추가 — 3 케이스:
  1. 짧은 메시지 dismiss 없음 ("네트워크 오류")
  2. 짧은 메시지 dismiss 있음 ("네트워크 연결 실패" + ×)
  3. 긴 메시지 dismiss 있음 (긴 안내문 + ×)

캡쳐: `pkg-out/phase-16-alert-matrix.png` (~349KB, 1400×7200 full sandbox).

## AI 시각 분석

3 케이스 모두 light red bg + 진한 red border + 어두운 red text — statusTokens.alarm 정확 적용. × dismiss 버튼은 우측 정렬, 짧음 케이스도 dismiss 없을 때는 자연스럽게 좌측만 채움. 긴 메시지가 wrap되어도 vertical alignment 유지. ppt 원본 error alert 패턴과 시각 호환 ✅.

- spec S11 (ppt error alert 호환 추측) ✅
- spec S12 (× hit area 적절, 시각 흐름 0 깨짐) ✅
- spec S13 (`role="alert"` + a11y) ✅
