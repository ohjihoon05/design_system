---
"@wonik/web": patch
---

fix: inline base 스타일이 주입 CSS pseudo-class 규칙을 죽이는 충돌 해소 — Input·Textarea의 `outline: none`/`borderColor`, FilterChip·IconButton의 `background` base 값을 inline에서 주입 CSS 클래스 규칙으로 이동. 이 충돌로 Input·Textarea의 키보드 `:focus-visible` 포커스 링(WCAG 2.4.7 AA)과 Input·Textarea·FilterChip·IconButton의 `:hover` 상태가 전혀 발화하지 않던 문제 수정. 렌더 기본값·토큰·컴포넌트 API 불변.
