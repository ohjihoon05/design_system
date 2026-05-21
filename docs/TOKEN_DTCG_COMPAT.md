# Token ↔ DTCG 호환 매핑

ADR-020 결정의 운영 가이드. 본 문서는 `packages/tokens/src/*.ts` 구조가 [DTCG (Design Tokens Community Group) draft format](https://tr.designtokens.org/format/)과 1:1 매핑 가능함을 보장하기 위한 룰을 정리한다.

**현재 상태**: DTCG JSON emit·변환 스크립트는 **미작성**. 구조만 매핑 가능하게 유지한다. 변환이 필요해질 때(예: Figma Variables import, Style Dictionary 도입, 사외 디자이너 협업) 30분 내 작성 가능.

---

## 1. Source of truth (DTCG-mappable)

DTCG 변환의 source는 **`theme-light.ts`와 `theme-dark.ts`의 raw hex 객체**다. `colors.ts`/`status.ts`/`graph.ts`는 CSS variable reference를 export하는 **runtime layer**이며 변환 source가 아니다 (ADR-009).

| TS source | DTCG group | Comment |
|---|---|---|
| `surfacesLight` / `surfacesDark` | `color.surfaces` | 모든 leaf hex → `$type: color` |
| `bordersLight` / `bordersDark` | `color.borders` | hex → `$type: color` |
| `primaryLight` / `primaryDark` | `color.primary` | hex → `$type: color` (ADR-007 WONIK BLUE) |
| `secondaryLight` / `secondaryDark` | `color.secondary` | hex → `$type: color` (WONIK GRAY) |
| `textLight` / `textDark` | `color.text` | hex → `$type: color` |
| `statusTokensLight` / `statusTokensDark` | `color.status.{role}.{prop}` | 2-level nested, 각 leaf hex → `$type: color` |
| `graphTokensLight` / `graphTokensDark` | `color.graph.{role}.{prop}` | 2-level nested, 각 leaf hex → `$type: color` |
| `space` | `dimension.space` | px string → `$type: dimension` |
| `radius` | `dimension.radius` | px / `%` string → `$type: dimension` |
| `componentSize` | `dimension.componentSize` | px string → `$type: dimension` |
| `fontSize` | `dimension.fontSize` | px string → `$type: dimension` |
| `fontWeight` | `fontWeight.*` | number → `$type: fontWeight` |
| `lineHeight` | `number.lineHeight` | number → `$type: number` |

대칭 보장: theme-light와 theme-dark는 키셋이 **1:1**이어야 함 (`theme-dark.ts` 주석 참조). DTCG `$themes`로 light/dark 두 set을 publish할 때 같은 path가 양쪽에 존재한다는 전제.

## 2. 변환 룰 (psuedo-code)

```ts
// 미작성. 필요해질 때 작성. 대략:
function toDTCG(raw: Record<string, string>, type: DTCGType): DTCGGroup {
  return Object.fromEntries(
    Object.entries(raw).map(([key, value]) => [key, { $value: value, $type: type }])
  );
}
```

`colors.ts`의 `var(--color-X)` 같은 runtime export는 DTCG 변환에 사용하지 않는다.

## 3. 예외 (변환 시 special-case 1줄 처리)

### `fontFamily.base`

현재 값: `"'Segoe UI', 'Inter', system-ui, sans-serif"` — 하나의 string에 stack을 comma-separated로 담음.

DTCG `fontFamily` 타입은 **단일 font family name string 또는 array of strings**를 받는다. comma-separated는 DTCG 관점에서 "single family name `'Segoe UI', 'Inter', ...`"로 오해된다.

변환기는 split + trim quote로 array를 만든다:
```ts
const families = fontFamily.base.split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
// → ['Segoe UI', 'Inter', 'system-ui', 'sans-serif']
return { $value: families, $type: 'fontFamily' };
```

이 예외는 **소스 형식을 array로 바꾸지 않는다**. CSS `font-family` property가 자연스럽게 comma-separated string을 받기 때문 (`fontFamily: fontFamily.base` 7개 consumer에서 즉시 사용). 변환 시 1줄로 처리 가능하므로 소스 안정성 우선.

### 향후 추가 시 주의

새 토큰 추가 시 **leaf 1개 = $value 1개**가 깨지지 않도록:
- ❌ shorthand 값 금지 (`'10px 10px 0 0'`처럼 4-value composite). 4개 leaf로 분해하거나 CSS-level utility로 두기.
- ❌ template literal로 합성한 값 금지 (`\`${spacing.md}px\``). raw value를 직접 둘 것.
- ✅ 한 group 안에 같은 `$type`만 (color group은 모두 color, dimension group은 모두 dimension).
- ✅ reference는 별도 group의 leaf path로 가능 (`{color.primary.base}`). 현재는 모두 raw hex라 reference는 미사용.

## 4. ppt와의 정렬

ppt가 host product인 만큼 ADR-010·011의 interface variable (`--color-bg`, `--color-text` 등) cascade는 **DTCG와 별도 layer**다. interface variable은 host가 같은 이름으로 정의하면 우선 적용되는 CSS 트릭이지, 토큰 source가 아니다. DTCG에 publish할 때는 우리 internal token만 export하고, interface contract는 별도 spec(또는 `.npmrc` README)으로 안내한다.
