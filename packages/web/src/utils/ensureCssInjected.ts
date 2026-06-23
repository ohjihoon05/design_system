/**
 * Module-scope CSS 1회-주입 helper (ADR-011).
 *
 * pseudo-class(`:focus-visible`/`:hover`)·pseudo-element(`::placeholder`)는
 * inline style로 표현할 수 없으므로, 컴포넌트별 `<style>` 블록을 module scope에서
 * 1회 주입한다. 같은 `id`는 (다중 인스턴스·재렌더 포함) 한 번만 주입된다.
 *
 * 이전엔 각 web 아톰이 `let cssInjected = false` boolean + 자체
 * `ensureCssInjected()`를 복제했다(eng-review 2026-06-17). 동일한 8줄 패턴이
 * 14개 컴포넌트에 triplication → 공통 helper 1개로 통합.
 *
 * @param id  컴포넌트 식별자(kebab-case). `<style data-wonik-{id}="true">`로 박혀
 *            DOM에서 식별 가능 (CLAUDE.md CRITICAL `data-wonik-X` 규약 유지).
 * @param css 주입할 CSS 문자열.
 */
const injected = new Set<string>();

export function ensureCssInjected(id: string, css: string): void {
  // SSR 가드 — document 없으면 no-op (CLAUDE.md CRITICAL).
  if (typeof document === 'undefined') return;
  if (injected.has(id)) return;
  const style = document.createElement('style');
  style.setAttribute(`data-wonik-${id}`, 'true');
  style.textContent = css;
  document.head.appendChild(style);
  injected.add(id);
}
