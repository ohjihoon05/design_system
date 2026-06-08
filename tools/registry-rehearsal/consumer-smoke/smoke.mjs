// 깨끗한 소비자 환경에서 @wonik 패키지가 창고에서 받아져 실제 로드/렌더되는지 확인.
// 1순위 검증: 창고에서 install + import 성공 (의존성 @dnd-kit 포함).
// 2순위(보너스): SSR 렌더까지 — 안 되면 경고만 (브라우저에선 정상일 수 있음).

let tokens, web;

try {
  tokens = await import('@wonik/tokens');
} catch (e) {
  console.error('❌ FAIL: @wonik/tokens 를 창고에서 받아 import하지 못함');
  console.error('   ', e.message);
  process.exit(1);
}

try {
  web = await import('@wonik/web');
} catch (e) {
  console.error('❌ FAIL: @wonik/web import 실패 (@dnd-kit 등 의존성 포함 가능)');
  console.error('   ', e.message);
  process.exit(1);
}

const tokenKeys = Object.keys(tokens).filter((k) => k !== 'default');
const Button = web.Button ?? web.default?.Button;

if (tokenKeys.length === 0) {
  console.error('❌ FAIL: @wonik/tokens 가 아무것도 export 안 함');
  process.exit(1);
}
if (typeof Button !== 'function') {
  console.error('❌ FAIL: @wonik/web 에서 Button 을 찾을 수 없음');
  process.exit(1);
}

console.log('✅ 설치 + 로드 성공');
console.log('   @wonik/tokens export 수:', tokenKeys.length, '→', tokenKeys.slice(0, 6).join(', '));
console.log('   @wonik/web Button:', typeof Button);

// 보너스: 실제 SSR 렌더
try {
  const React = (await import('react')).default;
  const { renderToString } = await import('react-dom/server');
  const html = renderToString(React.createElement(Button, null, '확인'));
  if (/<button/i.test(html)) {
    console.log('   SSR 렌더:', html.slice(0, 100));
    console.log('✅✅ 렌더까지 통과 — 진짜 동료가 받아쓸 수 있는 상태.');
  } else {
    console.log('⚠️  렌더는 됐지만 <button> 태그가 안 보임:', html.slice(0, 100));
  }
} catch (e) {
  console.log('⚠️  설치는 OK인데 SSR 렌더에서 막힘 (브라우저에선 정상일 수 있음):', e.message);
}

process.exit(0);
