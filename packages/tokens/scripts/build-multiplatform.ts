// ADR-047 척추 ① — DTCG JSON emit + Style Dictionary(BUY)로 Vue CSS·Flutter Dart 산출.
// 컴포넌트는 생성하지 않는다(척추 ①=토큰만, ADR-047 §2). Vue CSS는 Style Dictionary
// 내장 'css/variables' 포맷 그대로 사용 — 값은 기존 build-css.ts와 동일 source
// (theme-light/dark)에서 나오므로 값 drift 없음, 형식만 SD 표준 산출물.
// Flutter는 SD에 내장 Dart 포맷이 없어 커스텀 포맷 1개를 등록해 붙인다(dtcg-lib의
// 변환 헬퍼 재사용) — 이것이 "직접 만들어야 하는 부분"의 전부고 나머지는 SD가 한다.
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import StyleDictionary from 'style-dictionary';
import type { TransformedToken } from 'style-dictionary/types';

import {
  buildDtcgTokens,
  dartNumberLiteral,
  dimensionToDart,
  hexToFlutterColor,
  snakeToDartCamel,
} from './dtcg-lib';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, '../dist');
const dtcgPath = resolve(distDir, 'tokens.dtcg.json');

mkdirSync(distDir, { recursive: true });

// DTCG JSON emit (light/dark 병기, compat §1 그대로 — $themes 미사용은 ADR-020 정책과 일치)
const dtcg = { light: buildDtcgTokens('light'), dark: buildDtcgTokens('dark') };
writeFileSync(dtcgPath, JSON.stringify(dtcg, null, 2), 'utf8');
console.log(`✓ wrote ${dtcgPath}`);

const dartLiteral = (token: TransformedToken): string => {
  const type = token.$type ?? (token as { type?: string }).type;
  const value = token.$value ?? token.value;
  if (type === 'color') return hexToFlutterColor(value as string);
  if (type === 'dimension')
    return dartNumberLiteral(dimensionToDart(value as { value: number; unit: 'px' | '%' }));
  if (type === 'fontFamily') return JSON.stringify((value as string[])[0]);
  return JSON.stringify(value);
};

/** SD가 못 하는 유일한 부분: DTCG → Dart 클래스 포맷 (색·치수 변환은 dtcg-lib 재사용).
 *  name/snake transform이 붙인 t.name(full path snake_case,충돌 없는 이름 — 척추①
 *  최초 구현 시 collision 경고로 확인됨)을 Dart 상수 관례(lowerCamelCase)로 변환해 쓴다. */
const flutterDartFormat = ({
  dictionary,
  options,
}: {
  dictionary: { allTokens: TransformedToken[] };
  options: { className: string };
}): string => {
  const lines = dictionary.allTokens
    .map((t) => `  static const ${snakeToDartCamel(t.name)} = ${dartLiteral(t)};`)
    .join('\n');
  return `// ADR-047 척추 ① — @wonik/tokens DTCG 산출물 (Style Dictionary 빌드). 수정 금지.\nimport 'package:flutter/material.dart';\n\nclass ${options.className} {\n${lines}\n}\n`;
};

const buildForMode = async (mode: 'light' | 'dark'): Promise<void> => {
  const sd = new StyleDictionary({
    tokens: dtcg[mode] as Record<string, unknown>,
    log: { verbosity: 'verbose' },
    platforms: {
      vue: {
        transformGroup: 'css',
        buildPath: `dist/vue/`,
        files: [
          {
            destination: `tokens.${mode}.css`,
            format: 'css/variables',
            options: { selector: mode === 'light' ? ':root, [data-theme="light"]' : '[data-theme="dark"]' },
          },
        ],
      },
      flutter: {
        transforms: ['name/snake'],
        buildPath: `dist/flutter/`,
        files: [
          {
            destination: `wonik_tokens_${mode}.dart`,
            format: 'flutter/class.dart',
            options: { className: mode === 'light' ? 'WonikTokensLight' : 'WonikTokensDark' },
          },
        ],
      },
    },
  });

  sd.registerFormat({ name: 'flutter/class.dart', format: flutterDartFormat });
  await sd.buildAllPlatforms();
};

const main = async (): Promise<void> => {
  await buildForMode('light');
  await buildForMode('dark');

  console.log(`✓ wrote ${resolve(distDir, 'vue/tokens.light.css')} + tokens.dark.css (Style Dictionary)`);
  console.log(
    `✓ wrote ${resolve(distDir, 'flutter/wonik_tokens_light.dart')} + wonik_tokens_dark.dart (Style Dictionary)`,
  );
};

main();
