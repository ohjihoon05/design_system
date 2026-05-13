# Step 2 — INSTALL.md + .npmrc.example + .gitignore + ADR-018

## docs/INSTALL.md 신설
- H1 1개 + H2 5개 (인증 / install / import / cascade override / FAQ) — spec §5 S3 충족 ✅
- 코드 블록 (npm/pnpm/yarn install, .npmrc 형식, React import, theme.css cascade) 포함
- "사내 registry URL은 IT 협의 후 결정" 명시 ✅

## .npmrc.example 신설
- placeholder `<사내-registry-URL>` / `<사내-registry-host>` ✅
- token 환경변수 (`${WONIK_NPM_TOKEN}`) 참조 ✅
- GitHub Packages 대안 주석 ✅

## .gitignore 수정
- `.npmrc` 추가 (실제 token이 git history에 남는 사고 방지) ✅

## ADR-018 본문 (docs/ADR.md)
- 3-옵션 비교표 (사내 npm registry / GitHub Packages / tarball-via-release) ✅
- 거부된 대안 4개 (공개 npm / file: 의존성 / 본인 노트북 Verdaccio / scope 변경) ✅
- 1순위 권장 (사내 npm) + 2순위 fallback (GitHub Packages) + 결정 보류 명시 ✅
- 본 phase에서 완료한 publish-ready 준비 6항목 ✅
- 결정해야 할 항목 (후속 phase가 닫음) 표 ✅
- Trade-offs R1~R5 + 후속 phase 예상 흐름 ✅

## 2.S1 보안
- `.npmrc.example`에 실제 token 0 ✅
