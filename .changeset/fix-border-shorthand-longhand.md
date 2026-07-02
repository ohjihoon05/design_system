---
"@wonik/web": patch
---

fix: Input·Textarea의 base border shorthand를 longhand(borderWidth/Style/Color)로 분리 — invalid→valid 전환 리렌더 시 React "Removing a style property during rerender (borderColor)" 스타일 충돌 에러 제거. 렌더 결과 값은 동일 (1px solid, 동일 토큰).
