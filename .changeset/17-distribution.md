---
"@wonik/tokens": minor
"@wonik/web": minor
---

layer A 1차 채움 종료 (14 atoms × ppt 3페이지 dogfood × interface variable cascade 입증).
publish-ready transition: 0.0.0 → 0.1.0. 두 패키지 모두 description / repository / homepage / license / publishConfig 추가. `private: true` 제거 + placeholder registry URL로 실수 publish 방어. prepublishOnly build/test guard. `@wonik/web`의 `@wonik/tokens` peer 명시. sideEffects 선언. ADR-018 — registry 옵션 비교 (사내 npm / GitHub Packages / tarball) 및 결정 보류 (사내 IT 협의 후 확정).
실제 첫 publish는 사내 registry 결정 후 별도 minor phase.
