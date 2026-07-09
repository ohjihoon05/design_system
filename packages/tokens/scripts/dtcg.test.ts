// ADR-047 척추 ① — DTCG emit 가드 테스트 (TDD: 구현 전 작성).
// 룰 출처: docs/TOKEN_DTCG_COMPAT.md + ADR-020 + [[DTCG]] 위키 노트(2025.10 dimension 객체화).
import { describe, expect, it } from 'vitest';

import {
  buildDtcgTokens,
  dartNumberLiteral,
  dimensionToDart,
  hexToFlutterColor,
  parseDimension,
  parseFontFamily,
  snakeToDartCamel,
} from './dtcg-lib';

type Leaf = { $value: unknown };
type Node = Leaf | { [key: string]: Node } | { $type: string; [key: string]: Node | string };

const isLeaf = (node: unknown): node is Leaf =>
  typeof node === 'object' && node !== null && '$value' in node;

/** 모든 leaf를 "path → { $value, 상속된 $type }"로 평탄화 */
const flatten = (
  node: Node,
  path: string[] = [],
  inheritedType?: string,
): Array<{ path: string; value: unknown; type: string | undefined }> => {
  const type = ('$type' in node ? (node.$type as string) : undefined) ?? inheritedType;
  if (isLeaf(node)) return [{ path: path.join('.'), value: node.$value, type }];
  return Object.entries(node)
    .filter(([k]) => !k.startsWith('$'))
    .flatMap(([k, child]) => flatten(child as Node, [...path, k], type));
};

describe('DTCG emit — 구조 룰 (ADR-020)', () => {
  const light = buildDtcgTokens('light');
  const dark = buildDtcgTokens('dark');
  const lightLeaves = flatten(light as Node);
  const darkLeaves = flatten(dark as Node);

  it('light/dark leaf path set이 1:1', () => {
    expect(darkLeaves.map((l) => l.path).sort()).toEqual(lightLeaves.map((l) => l.path).sort());
  });

  it('모든 leaf가 $type을 상속받는다 (group $type 통일)', () => {
    for (const leaf of lightLeaves) expect(leaf.type, leaf.path).toBeTruthy();
  });

  it('color leaf는 전부 6자리 hex — shorthand/합성값 금지', () => {
    const colors = lightLeaves.filter((l) => l.type === 'color');
    expect(colors.length).toBeGreaterThan(50);
    for (const leaf of colors) expect(leaf.value, leaf.path).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it('dimension leaf는 {value, unit} 객체 (2025.10 스펙)', () => {
    const dims = lightLeaves.filter((l) => l.type === 'dimension');
    expect(dims.length).toBeGreaterThan(20);
    for (const leaf of dims) {
      const v = leaf.value as { value: unknown; unit: unknown };
      expect(typeof v.value, leaf.path).toBe('number');
      expect(['px', '%'], leaf.path).toContain(v.unit);
    }
  });

  it('이름에 DTCG 금지 문자($ 시작·중괄호·마침표) 없음', () => {
    for (const leaf of lightLeaves) {
      for (const seg of leaf.path.split('.')) expect(seg).toMatch(/^[^${}.][^{}.]*$/);
    }
  });
});

describe('DTCG emit — 값 가드', () => {
  const light = buildDtcgTokens('light') as Record<string, never>;
  const dark = buildDtcgTokens('dark') as Record<string, never>;
  const at = (root: Record<string, never>, path: string): { $value: unknown } =>
    path.split('.').reduce((n: never, k) => n[k], root as never);

  it('WONIK BLUE #273E82 (ADR-007)', () => {
    expect(at(light, 'color.primary.base').$value).toBe('#273E82');
    expect(at(dark, 'color.primary.base').$value).toBe('#4A65B8'); // dark 보정값 (ADR-022)
  });

  it('fontFamily.base — comma-string을 array로 split (compat §3)', () => {
    expect(at(light, 'fontFamily.base').$value).toEqual([
      'Segoe UI',
      'Inter',
      'system-ui',
      'sans-serif',
    ]);
  });

  it('space.1 = 4px, radius.full = 50% (문서화된 % 편차)', () => {
    expect(at(light, 'dimension.space.1').$value).toEqual({ value: 4, unit: 'px' });
    expect(at(light, 'dimension.radius.full').$value).toEqual({ value: 50, unit: '%' });
  });

  it('lineHeight는 number 타입 (tight=1, normal=1.5)', () => {
    expect(at(light, 'number.lineHeight.tight').$value).toBe(1);
    expect(at(light, 'number.lineHeight.normal').$value).toBe(1.5);
  });

  it('status/graph는 light·dark 공유 (theme-dark가 light 객체 import)', () => {
    expect(at(dark, 'color.status.run.dot').$value).toBe('#273E82');
    expect(at(dark, 'color.graph.signalReference.line').$value).toBe('#ACACAC');
  });
});

describe('변환 헬퍼 (Flutter 산출용)', () => {
  it('parseDimension — px·% 파싱, 그 외 단위는 throw', () => {
    expect(parseDimension('8px')).toEqual({ value: 8, unit: 'px' });
    expect(parseDimension('50%')).toEqual({ value: 50, unit: '%' });
    expect(() => parseDimension('1.5rem')).toThrow();
  });

  it('parseFontFamily — quote 제거 + trim', () => {
    expect(parseFontFamily("'Segoe UI', 'Inter', system-ui, sans-serif")).toEqual([
      'Segoe UI',
      'Inter',
      'system-ui',
      'sans-serif',
    ]);
  });

  it('hexToFlutterColor — #273E82 → Color(0xFF273E82)', () => {
    expect(hexToFlutterColor('#273E82')).toBe('Color(0xFF273E82)');
    expect(hexToFlutterColor('#acacac')).toBe('Color(0xFFACACAC)');
  });

  it('dimensionToDart — px는 double 그대로, %는 비율 double', () => {
    expect(dimensionToDart({ value: 8, unit: 'px' })).toBe(8);
    expect(dimensionToDart({ value: 50, unit: '%' })).toBe(0.5);
  });

  it('dartNumberLiteral — 정수도 항상 .0 표기 (Dart int 추론 방지, trial-15 발견)', () => {
    expect(dartNumberLiteral(8)).toBe('8.0');
    expect(dartNumberLiteral(0.5)).toBe('0.5');
    expect(dartNumberLiteral(0)).toBe('0.0');
  });

  it('snakeToDartCamel — Dart 상수 명명 규칙(lowerCamelCase, trial-15 발견)', () => {
    expect(snakeToDartCamel('color_status_run_bg')).toBe('colorStatusRunBg');
    expect(snakeToDartCamel('dimension_radius_sm')).toBe('dimensionRadiusSm');
    expect(snakeToDartCamel('color_primary_base')).toBe('colorPrimaryBase');
  });
});
