// Graph semantic tokens — status-driven roles for chart/plot color usage (ADR-013, ADR-014).
// Mirrors statusTokens shape (2-level group → property) so build-css.ts can emit
// --color-graph-* variables with the same loop. Hex source-of-truth lives in
// theme-light.ts / theme-dark.ts. Runtime export below returns var(...) refs
// so consumers automatically follow <html data-theme="light|dark"> (ADR-009).
//
// Role taxonomy (3 axes, 13 tokens — ADR-013 축소 + ADR-014 signalReference.surface):
//   limitUpper / limitLower  — spec/threshold zones (e.g. Range2/Overshoot,
//                              Range1/Undershoot, Trim High/Low, Main/Sub Limit)
//                              line은 라벨 텍스트로도 사용 (동일 hex)
//   signalPrimary            — live measured/observed value
//                              (Profile TC, Tuned PV, Tuned Temp, Power, Ref FLAT)
//   signalTuned              — tuned/adjusted result (Tuned SV, P Ratio Tune)
//   signalReference          — reference baseline (Ref SV, Ref PV, PID SUM)
//                              ADR-014: surface 추가 — signal 3개 모두 (line, surface) 대칭
//   pass                     — pass condition / OK zone (Spike, Pass box)
//
// chrome 색(축 라벨/그리드/annotation 콜아웃)과 action 화살표는 별도 graph
// 토큰을 두지 않고 기존 토큰을 재사용한다 (ADR-013 §migration 참조):
//   action  arrow      → graphTokens.limitUpper.line  (동일 hue, 동일 의미축)
//   axis    label      → text.primary
//   axis    grid       → borders.light  (CSS: var(--color-border))
//   annotation fg      → text.dark
//   annotation surface → surfaces.surfaceWhite

export const graphTokens = {
  limitUpper: {
    line: 'var(--color-graph-limit-upper-line)',
    surface: 'var(--color-graph-limit-upper-surface)',
  },
  limitLower: {
    line: 'var(--color-graph-limit-lower-line)',
    surface: 'var(--color-graph-limit-lower-surface)',
  },
  signalPrimary: {
    line: 'var(--color-graph-signal-primary-line)',
    surface: 'var(--color-graph-signal-primary-surface)',
  },
  signalTuned: {
    line: 'var(--color-graph-signal-tuned-line)',
    surface: 'var(--color-graph-signal-tuned-surface)',
  },
  signalReference: {
    line: 'var(--color-graph-signal-reference-line)',
    surface: 'var(--color-graph-signal-reference-surface)',
  },
  pass: {
    line: 'var(--color-graph-pass-line)',
    surface: 'var(--color-graph-pass-surface)',
    label: 'var(--color-graph-pass-label)',
  },
} as const;
