# Phase 17 — POC Result (2026-05-14)

## 검증 가설

회사 PC에서 사내 npm registry 없이도 GitHub Release tarball 경로로 `@wonik/web` 패키지 install이 작동하는가.

## 환경

- 회사 PC: Windows 11
- pnpm 10.27.0
- Private repo `ohjihoon05/design_system`의 release `v0.1.0-poc` 사용
- 다운로드 방법: 브라우저에서 release asset 직접 클릭
  - `gh` CLI는 미설치 + `winget install GitHub.cli` 시도 시 회사 SSL inspection으로 차단됨 (`0x8a15005e the server certificate did not match any of the expected values`)
  - 우회: 브라우저로 release 페이지 접속 → asset 직접 다운로드 → 회사 SSL 검사 영향 없음

## 단계

1. 회사 PC 브라우저에서 GitHub 로그인 + https://github.com/ohjihoon05/design_system/releases/tag/v0.1.0-poc 접속 → 두 `.tgz` 파일 다운로드 성공
2. `pnpm init` 후 `pnpm add .\wonik-tokens-0.1.0.tgz .\wonik-web-0.1.0.tgz`
3. `ls .\node_modules\@wonik\{web,tokens}\dist` 로 빌드 산출물 확인

## 결과

```
$ pnpm add ./wonik-tokens-0.1.0.tgz ./wonik-web-0.1.0.tgz
Packages: +5
Progress: resolved 5, reused 1, downloaded 4, added 5, done

dependencies:
@wonik/tokens 0.1.0
@wonik/web 0.1.0
Done in 899ms using pnpm v10.27.0
```

✅ install 성공
✅ `@wonik/web/dist`: index.{js,mjs,d.ts,d.mts} 4개 파일 (총 ~91 KB)
✅ `@wonik/tokens/dist`: index.{js,mjs,d.ts,d.mts} + tokens.css 5개 파일 (총 ~31 KB)

## 입증된 것

- 집 PC build → GitHub Release → 회사 PC install 경로가 **기술적으로 작동**
- 사내 npm registry 없이도 POC 수준에서는 충분
- ADR-018 옵션 C(tarball-via-release)가 *실제 가능*함을 검증 — 다만 매번 release 발행해야 하는 부담으로 정식 워크플로우는 옵션 A(사내 npm) / B(GitHub Packages) 추천 그대로

## 발견 사항 (IT 협의 시 추가 항목)

| 발견 | 영향 | 협의 요청 |
|---|---|---|
| 회사 SSL inspection이 `winget` 차단 (`0x8a15005e`) | `gh` CLI 정상 설치 차단. asset download는 영향 없음 | "winget 허용 또는 회사 root CA 신뢰 추가" |
| 회사 PC도 Windows 11, pnpm 사전 설치됨 | 추가 install 가이드 부담 작음 | (없음) |

## 다음 step (사내 IT 협의 후)

- ADR-018 1순위(사내 npm registry) 또는 2순위(GitHub Packages)로 정식 전환
- `publishConfig.registry` placeholder(`https://npm.pkg.github.com/RESOLVE_BEFORE_PUBLISH`) → 실제 URL 교체
- 본 POC release `v0.1.0-poc`는 정식 publish 첫 release 발행 후 archive 또는 삭제
- ppt 등 host product가 workspace:* → 정식 published 버전으로 install 전환 (dual-direction 입증)
