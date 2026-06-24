// 단일 자가포함 HTML file:// 검증 게이트 (eng-review 2026-06-17, Issue-2A).
//
// 컨시어지 납품(@wonik/web → 단일 HTML)의 고유 실패모드를 확정 검출한다:
//   tokens.css :root 시트가 빌드 때 인라인되지 않으면 → 모든 색이 조용히 붕괴
//   (배경 투명·글자 검정), 레이아웃·폰트는 생존, 에러 없음.
// 사람 눈검사로는 놓치기 쉬운 silent 실패라, 정확한 rgb를 코드로 assert한다.
//
// 사용법:
//   node tools/singlefile-gate/gate.mjs <path-to/index.html> [expectedRgb]
//   기본 expectedRgb = WONIK BLUE rgb(39, 62, 130) (#273E82, ADR-007)
//
// 전제: 검사 대상 HTML은 id="primary-btn"인 @wonik/web primary Button을 포함해야 함.
// 종료코드: 0 = 전체 통과, 1 = HARD FAIL 존재, 2 = 사용법 오류.

import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { statSync } from 'node:fs';
import { resolve } from 'node:path';

const USAGE = `singlefile-gate — 단일 자가포함 HTML file:// 검증 게이트

사용법:
  node tools/singlefile-gate/gate.mjs <path-to/index.html> [expectedRgb]
  node tools/singlefile-gate/gate.mjs --help

인자:
  <index.html>   검사 대상 HTML. id="primary-btn" @wonik/web primary Button 포함 필수.
  [expectedRgb]  기대 primary 배경색. 기본 rgb(39, 62, 130) (#273E82 WONIK BLUE, ADR-007).

종료코드: 0=전체 통과 · 1=HARD FAIL · 2=사용법/환경 오류.
전제: playwright Chromium 설치 필요 — 'pnpm exec playwright install chromium'.`;

const htmlArg = process.argv[2];
if (htmlArg === '--help' || htmlArg === '-h') {
  console.log(USAGE);
  process.exit(0);
}
if (!htmlArg) {
  console.error('usage: node gate.mjs <index.html> [expectedRgb]   (--help 로 상세)');
  process.exit(2);
}
const expectedBg = process.argv[3] || 'rgb(39, 62, 130)';
const htmlPath = resolve(htmlArg);
const fileUrl = pathToFileURL(htmlPath).href;

const results = [];
const check = (name, pass, detail) => {
  results.push({ name, pass });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`);
};

// 1) HTML 크기 < 1MB — dnd-kit/전체 barrel 우발 포함 검출
const sizeKB = statSync(htmlPath).size / 1024;
check('HTML < 1MB', sizeKB < 1024, `${sizeKB.toFixed(0)} KB`);

let browser;
try {
  browser = await chromium.launch();
} catch (err) {
  const msg = String(err && err.message);
  if (/Executable doesn't exist|playwright install|don't have/i.test(msg)) {
    console.error(
      '\n환경 오류: playwright Chromium 미설치.\n' +
        "  → 'pnpm exec playwright install chromium' 1회 실행 후 재시도.\n" +
        '  (pnpm이 postinstall 자동 다운로드를 막아 fresh install엔 Chromium 캐시가 없음.)',
    );
    process.exit(2);
  }
  console.error('환경 오류: Chromium 실행 실패 —', msg);
  process.exit(2);
}
const context = await browser.newContext();

// 외부 네트워크 자원 일절 차단 — file:// 자가포함 보장. http/https 요청 = 외부 의존 = abort.
const externalReqs = [];
await context.route('**/*', (route) => {
  const url = route.request().url();
  if (url.startsWith('file:') || url.startsWith('data:') || url.startsWith('blob:')) {
    return route.continue();
  }
  externalReqs.push(url);
  return route.abort();
});

const page = await context.newPage();
await page.goto(fileUrl, { waitUntil: 'load' });
await page.waitForSelector('#primary-btn', { timeout: 5000 }).catch(() => {});

// 2) 렌더 — #root에 컴포넌트 마운트
const mounted = await page.$eval('#root', (el) => el.children.length > 0).catch(() => false);
check('렌더 (#root 마운트)', mounted);

// 3) THE 검사 — primary 버튼 배경 = WONIK BLUE (토큰 var() 해결 증명)
const bg = await page.$eval('#primary-btn', (el) => getComputedStyle(el).backgroundColor).catch(() => null);
check(`토큰 var() 해결 — primary 배경 = ${expectedBg}`, bg === expectedBg, `실제 ${bg}`);

// 4) status-family var 해결 — status 토큰 var를 직접 주입해 probe.
//    primary(검사 3)와 다른 색-family가 인라인됐는지 독립 증인. 버튼 스캔 대신 var를
//    직접 박으므로 딜리버러블 모양(danger 버튼 유무)과 무관 — ATLAS처럼 status 버튼이
//    없는 화면도 정직하게 검증된다. var가 인라인 안 됐으면 rgba(0,0,0,0)(투명)으로 FAIL.
//    --color-status-warning-dot: :root·dark 양쪽 #A06800(rgb(160,104,0)) — 테마 무관.
const statusBg = await page.evaluate(() => {
  const probe = document.createElement('div');
  probe.style.backgroundColor = 'var(--color-status-warning-dot)';
  document.body.appendChild(probe);
  const c = getComputedStyle(probe).backgroundColor;
  probe.remove();
  return c;
});
const statusOk = statusBg !== 'rgba(0, 0, 0, 0)' && statusBg !== '' && statusBg !== expectedBg;
check('status-family var 해결 (--color-status-warning-dot 직접 probe)', statusOk, `실제 ${statusBg}`);

// 5) ensureCssInjected at file:// — focus 링 <style> 주입됨 (DOM 작동 확정)
const focusStyle = await page.$('style[data-wonik-button]');
check('ensureCssInjected (file://) focus 링 주입', !!focusStyle);

// 6) 키보드 focus → outline 출현 (:focus-visible). Tab 1회가 정확히 안 닿을 수 있어 soft.
await page.keyboard.press('Tab');
const outlineW = await page.$eval('#primary-btn', (el) => getComputedStyle(el).outlineWidth).catch(() => '0px');
check('focus-visible outline (soft)', outlineW !== '0px' && outlineW !== '', `outlineWidth=${outlineW}`);

// 7) 외부 네트워크 자원 0 (offline 안전)
check('외부 네트워크 자원 0', externalReqs.length === 0, externalReqs.length ? externalReqs.join(',') : 'none');

await browser.close();

const hardFails = results.filter((r) => !r.pass && !r.name.includes('(soft)'));
const passed = results.filter((r) => r.pass).length;
console.log(`\n${passed}/${results.length} checks passed${hardFails.length ? ` — ${hardFails.length} HARD FAIL` : ''}`);

if (hardFails.length) {
  const colorFail = hardFails.some(
    (r) => r.name.includes('var() 해결') || r.name.includes('status-family'),
  );
  if (colorFail) {
    console.error(
      '\n계약 위반: 색 토큰 var()가 해결되지 않음.\n' +
        `  primary 배경 기대=${expectedBg}. 실제가 rgba(0, 0, 0, 0)(투명)이면 tokens.css\n` +
        '  :root 시트가 단일 HTML에 인라인되지 않은 것 — 빌드의 CSS 인라인 단계\n' +
        '  (vite-plugin-singlefile)를 확인하라. 이게 본 게이트가 막는 silent 색-붕괴\n' +
        '  실패모드다 (README §왜 있나).',
    );
  }
}
process.exit(hardFails.length ? 1 : 0);
