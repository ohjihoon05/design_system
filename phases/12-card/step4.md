# Step 4 — sandbox 매트릭스 + 캡쳐 + AI 시각 분석

tasks.md §Step 4 의 1:1 풀어쓰기.

## 4.1 apps/web-sandbox/src/App.tsx에 CardMatrixSection 추가
- 2 variant × 4 padding = 8 셀.
- 각 셀에 짧은 children ("Card content" + variant·padding 라벨).
- light/dark 토글은 기존 ThemeToggle 공용.

## 4.2 light theme 캡쳐
- `pnpm -F web-sandbox dev` 부팅 후 Headless Chrome으로 `pkg-out/phase-12-card-matrix.png`.

## 4.3 dark theme 캡쳐
- ThemeToggle 또는 `<html data-theme="dark">` 강제 후 `pkg-out/phase-12-card-matrix-dark.png`.
- elevated 그림자 0 검증.

## 4.4 AI 정성 판정 (Read tool로 PNG 직접)
- spec S11 (surface 톤이 ppt OutlineCard 호환 추측 가능)
- spec S12 (elevated shadow 과하지 않음)
- spec S13 (border-radius 10px 일관)
- 결과 단락 1개 → step4.md 끝에 부착.

## 통과 조건
- 4.T1 8 셀 모두 visible
- 4.T2 PNG header valid
- 4.S1 sandbox 데모 텍스트 비밀 0
