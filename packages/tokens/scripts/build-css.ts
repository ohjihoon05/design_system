import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { themeLight } from '../src/theme-light';
import { themeDark } from '../src/theme-dark';
import {
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
} from '../src/typography';
import { space, radius, componentSize } from '../src/spacing';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(__dirname, '../dist/tokens.css');

const camelToKebab = (s: string): string =>
  s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

type Theme = typeof themeLight | typeof themeDark;

const colorVarLines = (theme: Theme): string[] => {
  const lines: string[] = [];
  const push = (name: string, value: string): void => {
    lines.push(`  ${name}: ${value};`);
  };
  const section = (title: string): void => {
    if (lines.length > 0) lines.push('');
    lines.push(`  /* ${title} */`);
  };

  // Surfaces
  section('Surfaces');
  for (const [key, value] of Object.entries(theme.surfaces)) {
    push(`--color-${camelToKebab(key)}`, value as string);
  }

  // Borders
  section('Borders');
  for (const [key, value] of Object.entries(theme.borders)) {
    if (key === 'light') {
      push('--color-border', value as string);
    } else {
      push(`--color-border-${camelToKebab(key)}`, value as string);
    }
  }

  // Primary
  section('Primary — WONIK BLUE base (ADR-007)');
  for (const [key, value] of Object.entries(theme.primary)) {
    if (key === 'base') {
      push('--color-primary', value as string);
    } else {
      push(`--color-primary-${camelToKebab(key)}`, value as string);
    }
  }

  // Secondary
  section('Secondary — WONIK GRAY (ADR-007)');
  push('--color-brand-secondary', theme.secondary.base);

  // Text
  section('Text');
  for (const [key, value] of Object.entries(theme.text)) {
    push(`--color-text-${camelToKebab(key)}`, value as string);
  }

  // Status
  section('Status (semantic)');
  for (const [stateKey, group] of Object.entries(theme.statusTokens)) {
    const stateKebab = camelToKebab(stateKey);
    for (const [propKey, value] of Object.entries(group as Record<string, string>)) {
      push(`--color-status-${stateKebab}-${propKey}`, value);
    }
  }

  // Interface Variables (ADR-010) — host product와의 contract.
  // host(ppt 등)가 같은 이름을 정의하면 cascade로 host 우선.
  // 미정의 시 우리 internal token으로 fallback.
  // --color-surface, --color-border, --color-primary는 위 sections에서 이미 자연 emit됨.
  section('Interface Variables (ADR-010)');
  push('--color-bg', 'var(--color-canvas)');
  push('--color-text', 'var(--color-text-dark)');
  push('--color-text-muted', 'var(--color-text-dim)');

  return lines;
};

const staticVarLines = (): string[] => {
  const lines: string[] = [];
  const push = (name: string, value: string | number): void => {
    lines.push(`  ${name}: ${value};`);
  };
  const section = (title: string): void => {
    if (lines.length > 0) lines.push('');
    lines.push(`  /* ${title} */`);
  };

  // Typography
  section('Typography');
  push('--font-family', fontFamily.base);
  for (const [key, value] of Object.entries(fontSize)) {
    push(`--font-size-${camelToKebab(key)}`, value);
  }
  for (const [key, value] of Object.entries(fontWeight)) {
    push(`--font-weight-${camelToKebab(key)}`, value);
  }
  push('--line-height', lineHeight.tight);

  // Spacing
  section('Spacing');
  for (const [key, value] of Object.entries(space)) {
    push(`--space-${key}`, value);
  }

  // Radius
  section('Radius');
  for (const [key, value] of Object.entries(radius)) {
    if (key === 'panelHeader') {
      push('--radius-panel-header', value);
    } else {
      push(`--radius-${camelToKebab(key)}`, value);
    }
  }

  // Component sizes
  section('Component sizes');
  for (const [key, value] of Object.entries(componentSize)) {
    push(`--${camelToKebab(key)}`, value);
  }

  return lines;
};

const lightLines = colorVarLines(themeLight);
const darkLines = colorVarLines(themeDark);
const sharedLines = staticVarLines();

const css = `:root, [data-theme="light"] {
${lightLines.join('\n')}

  /* Theme-independent tokens (typography, spacing, radius, component sizes) */
${sharedLines.join('\n')}
}

[data-theme="dark"] {
${darkLines.join('\n')}
}
`;

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, css, 'utf8');

const countVars = (block: string[]): number =>
  block.filter((l) => l.startsWith('  --')).length;

const lightCount = countVars(lightLines);
const darkCount = countVars(darkLines);
const sharedCount = countVars(sharedLines);

console.log(
  `✓ wrote ${outPath} (light: ${lightCount}, dark: ${darkCount}, shared: ${sharedCount})`,
);
