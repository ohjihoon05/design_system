---
"@wonik/web": patch
"@wonik/tokens": patch
---

fix(build): exports types 조건 분리 + 빈 .d.ts 빌드 가드 (회귀 방지)

소비처(ppt)에서 `@wonik/web` import가 TS2306("not a module")로 깨지고 프로덕션
빌드(tsc -b)가 통째로 실패한 회귀를 구조적으로 차단한다.

- 원인: 과거 tsup 버전이 dual(ESM+CJS) 빌드에서 CJS용 `dist/index.d.ts`를 0바이트로
  뽑았고, `exports`의 flat `types`가 그 빈 파일을 가리켜 ESM 소비자까지 전부 타입
  해석에 실패. 실제 타입 선언은 `index.d.mts`에 정상 존재했음.
- exports 견고화: `types` 조건을 `import` → `index.d.mts`, `require` → `index.d.ts`로
  분리. ESM 소비자(Vite/bundler)는 이제 알맹이 있는 `.d.mts`를 해석하므로, 설령
  `.d.ts`가 다시 비어도 깨지지 않는다. (web·tokens 동일 적용)
- 빌드 가드: `scripts/check-dts.mjs`가 빌드 후 `dist/index.d.{ts,mts}`가 비어있으면
  (<100B) 빌드를 실패시킨다. tsup이 빈 .d.ts를 뽑고도 "Build success"를 찍어 silent
  하게 새던 것을 빌드 단계에서 잡는다.
- JS 런타임 해석(import→.mjs, require→.js)은 불변. 공개 API 변경 없음 → patch.
