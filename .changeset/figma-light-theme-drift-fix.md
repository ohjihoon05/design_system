---
"@wonik/tokens": patch
---

theme-light: `theme-light.ts`의 drift 값 6개를 Figma `Standardization 2.0` Light 기준으로 교정 (ADR-024).

### 동기

`theme-light.ts`를 Figma `Standardization 2.0` Light + `Primitives`와 토큰별 전수 대조한 결과, Figma 어느 컬렉션에도 없는 drift 값 5개와 ADR-022 dark 매핑과 어긋난 `surfaceMid` 1개를 발견. ADR-022의 "theme-light는 이미 정합" 판단은 spot-check 기반이라 정정이 필요했다.

### 변경 (값만, key 불변)

| 토큰 | before | after |
|------|--------|-------|
| `surfaces.canvas` | `#E8E8EA` | `#E7E7E7` |
| `surfaces.surfaceMid` | `#E7E7E7` | `#EEEEF0` |
| `surfaces.darkHover` | `#2D2D31` | `#29292F` |
| `borders.dark` | `#5C5C5C` | `#5C5C66` |
| `text.dark` | `#303030` | `#323640` |
| `text.onDarkDim` | `#D1D1D4` | `#D4D4D8` |

### scope

- 값만 변경, key set 불변 → `theme-dark`과 1:1 유지. API 변동 0.
- light 모드를 쓰는 consumer는 위 6개 색이 미세 조정된다. 모두 drift 교정(디자인 파일에 없던 값 → Figma 값).
- patch — 신규 토큰 추가나 이름 변경이 아닌 기존 값 교정.
- 범위 밖: `primary`/`status`/`graph` 색의 `Standardization 2.0` 정합은 후속 결정.

ADR-024.
