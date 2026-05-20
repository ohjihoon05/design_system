// Module-scope CSS injection — mirrors the @wonik/web `ensureCssInjected` pattern
// used by Card/Switch. Used wherever we need :hover or :focus-visible pseudos
// that inline style cannot express.

const injected = new Set<string>();

export function injectCss(id: string, css: string): void {
  if (typeof document === 'undefined') return;
  if (injected.has(id)) return;
  const style = document.createElement('style');
  style.setAttribute('data-wonik-demo', id);
  style.textContent = css;
  document.head.appendChild(style);
  injected.add(id);
}

// Standard focus indicator per CLAUDE.md CRITICAL (WCAG 2.4.7 AA, ADR-011).
// Imported as a string so primitives can compose it.
export const FOCUS_RING = `
  outline: 2px solid var(--color-focus, var(--color-primary));
  outline-offset: 2px;
`;
