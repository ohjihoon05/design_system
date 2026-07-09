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
