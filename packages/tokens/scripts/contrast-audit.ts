// Ad-hoc WCAG 2.1 contrast audit over token color pairs (ADR-040 design review,
// 2026-06-18). Verifies Brand/Surface/Status/Theming dimensions objectively.
// Run: pnpm -F @wonik/tokens exec tsx scripts/contrast-audit.ts
import { themeLight } from '../src/theme-light';
import { themeDark } from '../src/theme-dark';

const hexToRgb = (hex: string): [number, number, number] => {
  const h = hex.replace('#', '');
  const n = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return [
    parseInt(n.slice(0, 2), 16),
    parseInt(n.slice(2, 4), 16),
    parseInt(n.slice(4, 6), 16),
  ];
};
const lin = (c: number): number => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const lum = (hex: string): number => {
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};
const ratio = (fg: string, bg: string): number => {
  const a = lum(fg);
  const b = lum(bg);
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
};

type Pair = { label: string; fg: string; bg: string; min: number };
const pairs: Pair[] = [];
const add = (label: string, fg: string, bg: string, min: number): void => {
  if (fg && bg) pairs.push({ label, fg, bg, min });
};

// --- Status (theme-independent; chip carries its own bg+text) ---
for (const [name, g] of Object.entries(themeLight.statusTokens)) {
  const grp = g as Record<string, string>;
  if (grp.text && grp.bg) add(`status.${name} text/bg`, grp.text, grp.bg, 4.5);
  if (grp.dot && grp.bg) add(`status.${name} dot/bg (UI 3:1)`, grp.dot, grp.bg, 3.0);
}

// --- Text on surfaces (light) ---
const lightTextKeys = ['primary', 'secondary', 'dim', 'dark'] as const;
const lightSurfKeys = ['canvas', 'surface', 'surfaceSubtle', 'surfaceInset', 'surfaceMid', 'surfaceWhite'] as const;
for (const tk of lightTextKeys)
  for (const sk of lightSurfKeys)
    add(`text.${tk} on surf.${sk} (light)`, themeLight.text[tk], themeLight.surfaces[sk], 4.5);

// --- Text on surfaces (dark) ---
const darkSurfKeys = ['canvas', 'surface', 'surfaceSubtle', 'surfaceInset', 'surfaceMid'] as const;
for (const tk of lightTextKeys)
  for (const sk of darkSurfKeys)
    add(`text.${tk} on surf.${sk} (dark)`, themeDark.text[tk], themeDark.surfaces[sk], 4.5);

// --- Primary / Button primary ---
add('primary.base on surfaceWhite (light)', themeLight.primary.base, themeLight.surfaces.surfaceWhite, 4.5);
add('WHITE on primary.base (Button primary, light)', '#FFFFFF', themeLight.primary.base, 4.5);
add('primary.base on canvas (light, UI 3:1)', themeLight.primary.base, themeLight.surfaces.canvas, 3.0);

// --- Button tokens (default+pressed text/bg; disabled exempt) ---
for (const theme of [['light', themeLight], ['dark', themeDark]] as const) {
  for (const st of ['default', 'pressed'] as const) {
    const g = (theme[1].buttonTokens as Record<string, Record<string, string>>)[st];
    add(`button.${st} text/bg (${theme[0]})`, g.text, g.bg, 4.5);
  }
}

// --- Table slot tokens (text/bg) ---
for (const theme of [['light', themeLight], ['dark', themeDark]] as const) {
  const tt = theme[1].tableTokens as Record<string, Record<string, string>>;
  for (const [slot, g] of Object.entries(tt)) {
    if (g.text && g.bg) add(`table.${slot} text/bg (${theme[0]})`, g.text, g.bg, 4.5);
  }
}

// --- Border mid on surfaces (UI 3:1) ---
for (const sk of lightSurfKeys)
  add(`border.mid on surf.${sk} (light, UI 3:1)`, themeLight.borders.mid, themeLight.surfaces[sk], 3.0);

// --- Focus ring (primary) on surfaces (UI 3:1) ---
add('focus(primary) on surfaceWhite (light, UI 3:1)', themeLight.primary.base, themeLight.surfaces.surfaceWhite, 3.0);
add('focus(primaryDark) on surface (dark, UI 3:1)', themeDark.primary.base, themeDark.surfaces.surface, 3.0);

// --- Graph pass.label on its surface (light) ---
const gp = themeLight.graphTokens.pass as Record<string, string>;
if (gp.label && gp.surface) add('graph.pass label/surface (light)', gp.label, gp.surface, 4.5);

// --- Run ---
let fails = 0;
const failLines: string[] = [];
for (const p of pairs) {
  const r = ratio(p.fg, p.bg);
  const ok = r >= p.min;
  if (!ok) {
    fails++;
    failLines.push(`  FAIL ${r.toFixed(2)} (<${p.min}) ${p.label}  [${p.fg} on ${p.bg}]`);
  }
}
console.log(`\n=== WCAG contrast audit: ${pairs.length} pairs, ${pairs.length - fails} pass, ${fails} FAIL ===`);
if (failLines.length) console.log(failLines.join('\n'));
else console.log('  ✓ all pairs pass their threshold');
