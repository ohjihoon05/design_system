#!/usr/bin/env node
// Canonical hex(WONIK BLUE/GRAY)가 packages/tokens/src/ 안에서 canonical 정의 외
// 추가로 박혀 있는지 검출. 손-실험으로 발견한 cascade 끊김을 grep으로 자동화.
// 한 줄 토큰 바꾸기 전에 영향 범위 미리 알 수 있음.

import { readFile, readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const TOKENS_DIR = join(ROOT, 'packages/tokens/src');

// ADR-007: brand-tied canonical hex.
// allowedCanonicalCount = light + dark의 *.base 둘 다 같은 hex인 경우 OK 개수.
const CANONICAL = [
  { hex: '#273E82', label: 'WONIK BLUE', source: 'primaryLight.base', allowedCanonicalCount: 1 },
  { hex: '#ACACAC', label: 'WONIK GRAY', source: 'secondary{Light,Dark}.base (둘 다 같은 hex로 의도)', allowedCanonicalCount: 2 },
];

const HEX_RE = /#[0-9A-Fa-f]{6}\b/g;

const files = (await readdir(TOKENS_DIR))
  .filter((f) => f.endsWith('.ts'))
  .map((f) => join(TOKENS_DIR, f));

const hits = [];
for (const file of files) {
  const text = await readFile(file, 'utf8');
  text.split(/\r?\n/).forEach((line, i) => {
    if (line.trim().startsWith('//')) return; // 주석 line skip
    for (const m of line.matchAll(HEX_RE)) {
      hits.push({ file, line: i + 1, hex: m[0].toUpperCase(), context: line.trim() });
    }
  });
}

let critical = 0;
for (const c of CANONICAL) {
  const matches = hits.filter((h) => h.hex === c.hex.toUpperCase());
  if (matches.length <= c.allowedCanonicalCount) {
    console.log(`✅ ${c.hex} (${c.label}): ${matches.length}곳 — OK (canonical ${c.allowedCanonicalCount}곳 허용)`);
    continue;
  }
  critical++;
  const dupCount = matches.length - c.allowedCanonicalCount;
  console.log(`\n🚨 ${c.hex} (${c.label}): ${matches.length}곳 — canonical 외 ${dupCount}곳 복제 (cascade 끊김):`);
  for (const m of matches) {
    const rel = relative(ROOT, m.file).replace(/\\/g, '/');
    console.log(`   ${rel}:${m.line}  ${m.context}`);
  }
  console.log(`   ↳ Canonical: ${c.source}. 복제된 정의는 ${c.label} reference로 교체 검토.`);
}

console.log(`\n총 canonical critical: ${critical}건.`);
process.exit(critical > 0 ? 1 : 0);
