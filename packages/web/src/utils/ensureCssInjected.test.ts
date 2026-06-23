import { describe, it, expect } from 'vitest';
import { ensureCssInjected } from './ensureCssInjected';

const styleFor = (id: string) =>
  document.head.querySelector(`style[data-wonik-${id}]`);

describe('ensureCssInjected', () => {
  it('injects a <style> tag carrying data-wonik-{id} and the given css', () => {
    ensureCssInjected('test-basic', '.x { color: red; }');
    const el = styleFor('test-basic');
    expect(el).not.toBeNull();
    expect(el?.tagName).toBe('STYLE');
    expect(el?.getAttribute('data-wonik-test-basic')).toBe('true');
    expect(el?.textContent).toBe('.x { color: red; }');
  });

  it('injects the same id only once (dedup across repeated calls)', () => {
    ensureCssInjected('test-dedup', '.a {}');
    ensureCssInjected('test-dedup', '.a {}');
    ensureCssInjected('test-dedup', '.a {}');
    expect(
      document.head.querySelectorAll('style[data-wonik-test-dedup]'),
    ).toHaveLength(1);
  });

  it('injects distinct <style> tags for distinct ids', () => {
    ensureCssInjected('test-one', '.one {}');
    ensureCssInjected('test-two', '.two {}');
    expect(styleFor('test-one')).not.toBeNull();
    expect(styleFor('test-two')).not.toBeNull();
    expect(styleFor('test-one')).not.toBe(styleFor('test-two'));
  });
});
