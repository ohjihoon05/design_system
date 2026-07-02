import { describe, it, expect, vi, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { Input } from './Input';

// Regression: ISSUE-001 — invalid→valid 전환 리렌더 시 React 에러
// "Removing a style property during rerender (borderColor) when a conflicting
// property is set (border)". border shorthand + 조건부 borderColor longhand
// 혼용이 원인. base border는 longhand + 주입 CSS로 유지해야 한다.
// Regression: ISSUE-004/005 — inline outline/borderColor가 주입 CSS의
// :focus-visible/:hover 규칙을 이겨서 focus ring·hover가 죽는 문제.
// base 값은 반드시 주입 CSS 클래스 규칙에 있어야 한다.
// Found by /qa on 2026-07-02
// Report: .gstack/qa-reports/qa-report-web-sandbox-2026-07-02.md

describe('Input — ISSUE-001 regression (border shorthand/longhand 혼용)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('invalid → valid 전환 시 React 스타일 충돌 에러를 내지 않는다', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { rerender } = render(<Input invalid data-testid="i" />);
    rerender(<Input invalid={false} data-testid="i" />);
    const styleConflicts = errorSpy.mock.calls.filter((args) =>
      String(args[0]).includes('style property'),
    );
    expect(styleConflicts).toHaveLength(0);
  });

  it('invalid ↔ valid 왕복 시 inline borderColor가 alarm ↔ 없음(base는 CSS)으로 전환된다', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const { rerender, getByTestId } = render(<Input data-testid="i" />);
    const el = getByTestId('i');
    // base border-color는 inline이 아니라 주입 CSS 클래스 규칙에서 온다 (ISSUE-005)
    expect(el.style.borderColor).toBe('');

    rerender(<Input invalid data-testid="i" />);
    expect(el.style.borderColor).toBe('var(--color-status-alarm-text)');

    rerender(<Input invalid={false} data-testid="i" />);
    expect(el.style.borderColor).toBe('');
  });
});

describe('Input — ISSUE-004/005 regression (inline이 주입 CSS pseudo 규칙을 이기는 충돌)', () => {
  it('inline style에 outline이 없어야 :focus-visible focus ring이 살아있다', () => {
    const { getByTestId } = render(<Input data-testid="i" />);
    expect(getByTestId('i').style.outline).toBe('');
  });

  it('주입 CSS에 base(outline·border-color)와 :focus-visible·:hover 규칙이 함께 있다', () => {
    render(<Input data-testid="i" />);
    const styleTag = document.querySelector('style[data-wonik-input]');
    expect(styleTag).not.toBeNull();
    const css = styleTag!.textContent ?? '';
    expect(css).toContain('.wonik-input {');
    expect(css).toContain('outline: none');
    expect(css).toContain('border-color: var(--color-border, var(--color-border-mid))');
    expect(css).toContain('.wonik-input:focus-visible');
    expect(css).toContain('outline: 2px solid var(--color-focus, var(--color-primary))');
    expect(css).toContain('.wonik-input:hover:not(:disabled)');
  });
});
