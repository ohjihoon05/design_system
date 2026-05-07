// Status semantic tokens — each state has unambiguous hue.
// Primary-derived states (run, accessReady) MUST use WONIK BLUE #273E82 (ADR-007).
export const statusTokens = {
  idle: { bg: '#F4F5F5', border: '#D4D4D8', text: '#71717B' },
  init: { bg: '#FFFFAC', border: '#D4C800', text: '#7A6E00' },
  ready: { bg: '#E6FAF4', dot: '#07895E', text: '#00A876' },
  run: { bg: '#EEF0F8', border: '#A8B4D8', dot: '#273E82', text: '#273E82' },
  processEnd: { bg: '#D6F0E6', text: '#07895E' },
  accessReady: { bg: '#EEF0F8', text: '#273E82' },
  warning: { bg: '#FFF4DC', dot: '#FE9A00', text: '#D09804' },
  alarm: { bg: '#FFE2E2', border: '#FFCACA', text: '#CC0000' },
  abort: { bg: '#FFCACA', border: '#FFCACA', text: '#CC0000' },
  processed: { bg: '#F3E8FF', border: '#E9D1FF', text: '#7C3AED' },
  ok: { dot: '#07895E', text: '#00D492' },
} as const;
