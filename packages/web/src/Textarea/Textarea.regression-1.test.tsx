import { describe, it, expect, vi, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { Textarea } from './Textarea';

// Regression: ISSUE-001 — invalid→valid 전환 리렌더 시 React 에러
// "Removing a style property during rerender (borderColor) when a conflicting
// property is set (border)". Input과 동일 결함 클래스.
// Regression: ISSUE-004/005 — inline outline/borderColor가 주입 CSS의
// :focus-visible/:hover 규칙을 이겨서 focus ring·hover가 죽는 문제.
// Found by /qa on 2026-07-02
// Report: .gstack/qa-reports/qa-report-web-sandbox-2026-07-02.md

describe('Textarea — ISSUE-001 regression (border shorthand/longhand 혼용)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('invalid → valid 전환 시 React 스타일 충돌 에러를 내지 않는다', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { rerender } = render(<Textarea invalid data-testid="t" />);
    rerender(<Textarea invalid={false} data-testid="t" />);
    const styleConflicts = errorSpy.mock.calls.filter((args) =>
      String(args[0]).includes('style property'),
    );
    expect(styleConflicts).toHaveLength(0);
  });

  it('invalid ↔ valid 왕복 시 inline borderColor가 alarm ↔ 없음(base는 CSS)으로 전환된다', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const { rerender, getByTestId } = render(<Textarea data-testid="t" />);
    const el = getByTestId('t');
    expect(el.style.borderColor).toBe('');

    rerender(<Textarea invalid data-testid="t" />);
    expect(el.style.borderColor).toBe('var(--color-status-alarm-text)');

    rerender(<Textarea invalid={false} data-testid="t" />);
    expect(el.style.borderColor).toBe('');
  });
});

describe('Textarea — ISSUE-004/005 regression (inline이 주입 CSS pseudo 규칙을 이기는 충돌)', () => {
  it('inline style에 outline이 없어야 :focus-visible focus ring이 살아있다', () => {
    const { getByTestId } = render(<Textarea data-testid="t" />);
    expect(getByTestId('t').style.outline).toBe('');
  });

  it('주입 CSS에 base(outline·border-color)와 :focus-visible·:hover 규칙이 함께 있다', () => {
    render(<Textarea data-testid="t" />);
    const styleTag = document.querySelector('style[data-wonik-textarea]');
    expect(styleTag).not.toBeNull();
    const css = styleTag!.textContent ?? '';
    expect(css).toContain('.wonik-textarea {');
    expect(css).toContain('outline: none');
    expect(css).toContain('border-color: var(--color-border, var(--color-border-mid))');
    expect(css).toContain('.wonik-textarea:focus-visible');
    expect(css).toContain('.wonik-textarea:hover:not(:disabled)');
  });
});
