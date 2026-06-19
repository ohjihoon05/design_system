# singlefile-gate

컨시어지 납품(@wonik/web → 단일 자가포함 HTML)의 **file:// 검증 게이트**.
`/plan-eng-review` 2026-06-17 Issue-2A 산출물 — milestone-c(진짜 화면 납품)가 그대로 재사용.

## 왜 있나

`@wonik/tokens`의 모든 color 토큰은 `var(--color-X)` 참조다(`packages/tokens/src/colors.ts`).
→ 빌드 때 `@wonik/tokens/tokens.css`의 `:root` 시트가 인라인되지 않으면 **모든 색이 조용히 붕괴**
(배경 투명·글자 검정), 레이아웃·폰트는 생존, **에러 없음**.
사람 눈검사로는 놓치는 silent 실패라 정확한 rgb를 코드로 assert한다.

## 사용법

```bash
node tools/singlefile-gate/gate.mjs <path-to/index.html> [expectedRgb]
# 기본 expectedRgb = WONIK BLUE rgb(39, 62, 130)  (#273E82, ADR-007)
```

대상 HTML은 `id="primary-btn"`인 @wonik/web primary Button을 포함해야 한다.
종료코드: `0`=전체 통과, `1`=HARD FAIL, `2`=사용법 오류. CI/수동 모두 사용 가능.

## 검사 항목 (7)

1. HTML < 1MB (dnd-kit/전체 barrel 우발 포함 검출)
2. 렌더 (#root 마운트)
3. **토큰 var() 해결** — primary 배경 = 기대 rgb  ← THE 검사 (silent 색-붕괴 검출)
4. status-family var 해결 (danger 버튼 실색)
5. ensureCssInjected (file://) — focus 링 `<style>` 주입
6. focus-visible outline (soft)
7. 외부 네트워크 자원 0 (offline 안전)

## 자기검증 (게이트가 실제로 잡는가)

대상의 `@import "@wonik/tokens/tokens.css"`를 제거하고 빌드 → 게이트 실행 시
검사 3·4가 `rgba(0,0,0,0)`로 **HARD FAIL(exit 1)** 나야 정상. (2026-06-17 검증 완료)

## 의존성

`playwright`(루트 devDep) + 캐시된 Chromium 사용. 별도 설치 불필요.
