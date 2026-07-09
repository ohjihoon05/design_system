// ADR-047 척추 ① — DTCG 변환 라이브러리 (docs/TOKEN_DTCG_COMPAT.md 룰의 구현).
// source of truth = theme-light/theme-dark raw hex + typography/spacing (ADR-009).
// colors.ts 등 var(--X) runtime layer는 변환 source가 아니다 (compat §1).
import { themeDark } from '../src/theme-dark';
import { themeLight } from '../src/theme-light';
import { space, radius, componentSize } from '../src/spacing';
import { fontFamily, fontSize, fontWeight, lineHeight } from '../src/typography';

export type DtcgDimension = { value: number; unit: 'px' | '%' };

/** '8px'/'50%' → {value, unit}. 2025.10 스펙: dimension은 문자열이 아니라 객체.
 *  '%'는 스펙 밖(px|rem만 허용) — radius.full 전용 문서화 편차 (compat §3). */
export const parseDimension = (raw: string): DtcgDimension => {
  const m = /^(-?\d+(?:\.\d+)?)(px|%)$/.exec(raw);
  if (!m) throw new Error(`Unsupported dimension literal: ${raw}`);
  return { value: Number(m[1]), unit: m[2] as 'px' | '%' };
};

/** comma-separated font stack → array (compat §3 예외: 소스는 string 유지) */
export const parseFontFamily = (raw: string): string[] =>
  raw.split(',').map((s) => s.trim().replace(/^['"]|['"]$/g, ''));

/** '#273E82' → 'Color(0xFF273E82)' — Flutter Dart 색 리터럴 */
export const hexToFlutterColor = (hex: string): string =>
  `Color(0xFF${hex.slice(1).toUpperCase()})`;

/** px → 그대로 double, % → 비율 double (50% → 0.5, Dart 소비측이 크기에 곱해 사용) */
export const dimensionToDart = (dim: DtcgDimension): number =>
  dim.unit === '%' ? dim.value / 100 : dim.value;

/** 8 → '8.0' — Dart는 정수 리터럴에서 `int`를 추론하므로, 소수점 없는 값을 그대로
 *  문자열화하면 `BorderRadius.circular()`·`EdgeInsets.all()` 등 double 파라미터에
 *  analyzer strict-casts 설정에서 타입 에러가 난다(실제 소비 테스트로 발견, ADR-047
 *  trial-15). 정수값도 항상 `.0`을 붙여 Dart가 `double`로 추론하게 강제한다. */
export const dartNumberLiteral = (n: number): string =>
  Number.isInteger(n) ? `${n}.0` : `${n}`;

/** 'color_status_run_bg' → 'colorStatusRunBg' — Dart Effective Dart 표준(lowerCamelCase
 *  상수명). style-dictionary의 `name/snake` transform 산출물(snake_case)을 그대로 쓰면
 *  flutter_lints(모든 Flutter 프로젝트 기본 lint)의 constant_identifier_names 위반이
 *  상수마다 발생한다(실제 소비 테스트로 발견, ADR-047 trial-15). */
export const snakeToDartCamel = (s: string): string =>
  s.replace(/_([a-z0-9])/g, (_, c: string) => c.toUpperCase());

type FlatGroup = Record<string, string>;
type NestedGroup = Record<string, FlatGroup>;

const colorGroup = (raw: FlatGroup): Record<string, unknown> => ({
  $type: 'color',
  ...Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, { $value: v }])),
});

const nestedColorGroup = (raw: NestedGroup): Record<string, unknown> => ({
  $type: 'color',
  ...Object.fromEntries(
    Object.entries(raw).map(([role, group]) => [
      role,
      Object.fromEntries(Object.entries(group).map(([k, v]) => [k, { $value: v }])),
    ]),
  ),
});

const dimensionGroup = (raw: FlatGroup): Record<string, unknown> => ({
  $type: 'dimension',
  ...Object.fromEntries(
    Object.entries(raw).map(([k, v]) => [k, { $value: parseDimension(v) }]),
  ),
});

const numberGroup = (raw: Record<string, number>, $type: string): Record<string, unknown> => ({
  $type,
  ...Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, { $value: v }])),
});

/** compat §1 매핑 그대로 — light/dark 두 set은 같은 leaf path를 가진다. */
export const buildDtcgTokens = (mode: 'light' | 'dark'): Record<string, unknown> => {
  const theme = mode === 'light' ? themeLight : themeDark;
  return {
    color: {
      surfaces: colorGroup(theme.surfaces),
      borders: colorGroup(theme.borders),
      primary: colorGroup(theme.primary),
      secondary: colorGroup(theme.secondary),
      text: colorGroup(theme.text),
      status: nestedColorGroup(theme.statusTokens),
      graph: nestedColorGroup(theme.graphTokens),
      button: nestedColorGroup(theme.buttonTokens),
      table: nestedColorGroup(theme.tableTokens),
    },
    dimension: {
      space: dimensionGroup(space),
      radius: dimensionGroup(radius),
      componentSize: dimensionGroup(componentSize),
      fontSize: dimensionGroup(fontSize),
    },
    fontFamily: {
      $type: 'fontFamily',
      base: { $value: parseFontFamily(fontFamily.base) },
    },
    fontWeight: numberGroup(fontWeight, 'fontWeight'),
    number: {
      lineHeight: numberGroup(lineHeight, 'number'),
    },
  };
};
