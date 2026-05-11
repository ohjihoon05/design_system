// Graph semantic tokens — status-driven roles for chart/plot color usage.
// Mirrors statusTokens shape (2-level group → property) so build-css.ts can emit
// --color-graph-* variables with the same loop. Hex source-of-truth lives in
// theme-light.ts / theme-dark.ts. Runtime export below returns var(...) refs
// so consumers automatically follow <html data-theme="light|dark"> (ADR-009).
//
// Role taxonomy (extracted from Parameter Description graph captures):
//   limitUpper / limitLower  — spec/threshold zones (e.g. Range2/Overshoot,
//                              Range1/Undershoot, Trim High/Low, Main/Sub Limit)
//   signalPrimary            — live measured/observed value
//                              (Profile TC, Tuned PV, Tuned Temp, Power, Ref FLAT)
//   signalTuned              — tuned/adjusted result (Tuned SV, P Ratio Tune)
//   signalReference          — reference baseline (Ref SV, Ref PV, PID SUM)
//   pass                     — pass condition / OK zone (Spike, Pass box)
//   action                   — tuning guide arrows / direction indicators
//   annotation               — neutral callout labels (e.g. "Profile 적용 시점")
//   axis                     — tick labels & grid lines

export const graphTokens = {
  limitUpper: {
    line: 'var(--color-graph-limit-upper-line)',
    surface: 'var(--color-graph-limit-upper-surface)',
    label: 'var(--color-graph-limit-upper-label)',
  },
  limitLower: {
    line: 'var(--color-graph-limit-lower-line)',
    surface: 'var(--color-graph-limit-lower-surface)',
    label: 'var(--color-graph-limit-lower-label)',
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
  },
  pass: {
    line: 'var(--color-graph-pass-line)',
    surface: 'var(--color-graph-pass-surface)',
    label: 'var(--color-graph-pass-label)',
  },
  action: {
    line: 'var(--color-graph-action-line)',
  },
  annotation: {
    fg: 'var(--color-graph-annotation-fg)',
    surface: 'var(--color-graph-annotation-surface)',
  },
  axis: {
    label: 'var(--color-graph-axis-label)',
    grid: 'var(--color-graph-axis-grid)',
  },
} as const;
