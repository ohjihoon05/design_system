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

const htmlArg = process.argv[2];
const expectedBg = process.argv[3] || 'rgb(39, 62, 130)';
if (!htmlArg) {
  console.error('usage: node gate.mjs <index.html> [expectedRgb]');
  process.exit(2);
}
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

const browser = await chromium.launch();
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

// 4) status-family var 해결 — 버튼 중 하나(danger)가 실색(투명 아님, primary와도 다름)
const btnBgs = await page.$$eval('button', (els) => els.map((e) => getComputedStyle(e).backgroundColor));
const statusOk = btnBgs.some((c) => c && c !== 'rgba(0, 0, 0, 0)' && c !== expectedBg);
check('status-family var 해결 (danger 실색)', statusOk, btnBgs.join(' / '));

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
process.exit(hardFails.length ? 1 : 0);
