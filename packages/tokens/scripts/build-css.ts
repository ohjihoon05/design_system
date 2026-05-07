import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  surfaces,
  borders,
  primary,
  secondary,
  text,
} from '../src/colors';
import {
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
} from '../src/typography';
import { space, radius, componentSize } from '../src/spacing';
import { statusTokens } from '../src/status';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(__dirname, '../dist/tokens.css');

const camelToKebab = (s: string): string =>
  s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

const lines: string[] = [];

const push = (name: string, value: string | number): void => {
  lines.push(`  ${name}: ${value};`);
};

const section = (title: string): void => {
  if (lines.length > 0) lines.push('');
  lines.push(`  /* ${title} */`);
};

// ─── Surfaces ─────────────────────────────────────────────
// surfaces.canvas → --color-canvas (matches WARP CSS)
// surfaces.surfaceSubtle → --color-surface-subtle
section('Surfaces');
for (const [key, value] of Object.entries(surfaces)) {
  const kebab = camelToKebab(key);
  // canvas / surface / dark* keep their natural names; "surfaceX" collapses to "surface-x"
  if (key === 'canvas' || key === 'surface') {
    push(`--color-${kebab}`, value);
  } else if (key.startsWith('surface')) {
    // surfaceSubtle → surface-subtle
    push(`--color-${kebab}`, value);
  } else if (key.startsWith('dark')) {
    // darkBase → dark-base
    push(`--color-${kebab}`, value);
  } else {
    push(`--color-${kebab}`, value);
  }
}

// ─── Borders ──────────────────────────────────────────────
section('Borders');
for (const [key, value] of Object.entries(borders)) {
  // light → --color-border ; mid → --color-border-mid ; dark → --color-border-dark ; panelDark → --color-border-panel-dark
  if (key === 'light') {
    push('--color-border', value);
  } else {
    push(`--color-border-${camelToKebab(key)}`, value);
  }
}

// ─── Primary (WONIK BLUE — ADR-007) ───────────────────────
section('Primary — WONIK BLUE #273E82 (ADR-007)');
for (const [key, value] of Object.entries(primary)) {
  if (key === 'base') {
    push('--color-primary', value);
  } else {
    push(`--color-primary-${camelToKebab(key)}`, value);
  }
}

// ─── Secondary (WONIK GRAY — ADR-007) ─────────────────────
section('Secondary — WONIK GRAY #ACACAC (ADR-007)');
push('--color-brand-secondary', secondary.base);

// ─── Text ─────────────────────────────────────────────────
section('Text');
for (const [key, value] of Object.entries(text)) {
  push(`--color-text-${camelToKebab(key)}`, value);
}

// ─── Status ───────────────────────────────────────────────
section('Status (semantic)');
for (const [stateKey, group] of Object.entries(statusTokens)) {
  const stateKebab = camelToKebab(stateKey);
  for (const [propKey, value] of Object.entries(group as Record<string, string>)) {
    push(`--color-status-${stateKebab}-${propKey}`, value);
  }
}

// ─── Typography ───────────────────────────────────────────
section('Typography');
push('--font-family', fontFamily.base);
for (const [key, value] of Object.entries(fontSize)) {
  push(`--font-size-${camelToKebab(key)}`, value);
}
for (const [key, value] of Object.entries(fontWeight)) {
  push(`--font-weight-${camelToKebab(key)}`, value);
}
push('--line-height', lineHeight.tight);

// ─── Spacing ──────────────────────────────────────────────
section('Spacing');
for (const [key, value] of Object.entries(space)) {
  push(`--space-${key}`, value);
}

// ─── Radius ───────────────────────────────────────────────
section('Radius');
for (const [key, value] of Object.entries(radius)) {
  if (key === 'panelHeader') {
    push('--radius-panel-header', value);
  } else {
    push(`--radius-${camelToKebab(key)}`, value);
  }
}

// ─── Component Sizes ──────────────────────────────────────
section('Component sizes');
for (const [key, value] of Object.entries(componentSize)) {
  push(`--${camelToKebab(key)}`, value);
}

const css = `:root {\n${lines.join('\n')}\n}\n`;

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, css, 'utf8');

console.log(`✓ wrote ${outPath} (${lines.filter((l) => l.startsWith('  --')).length} variables)`);
