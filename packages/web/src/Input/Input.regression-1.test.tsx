import { describe, it, expect, vi, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { Input } from './Input';

// Regression: ISSUE-001 — invalid→valid 전환 리렌더 시 React 에러
// "Removing a style property during rerender (borderColor) when a conflicting
// property is set (border)". border shorthand + 조건부 borderColor longhand
// 혼용이 원인. base border를 longhand로 유지해야 한다.
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

  it('invalid ↔ valid 왕복 시 borderColor가 alarm ↔ base 토큰으로 정확히 전환된다', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const { rerender, getByTestId } = render(<Input data-testid="i" />);
    const el = getByTestId('i');
    expect(el.style.borderColor).toBe('var(--color-border, var(--color-border-mid))');

    rerender(<Input invalid data-testid="i" />);
    expect(el.style.borderColor).toBe('var(--color-status-alarm-text)');

    rerender(<Input invalid={false} data-testid="i" />);
    expect(el.style.borderColor).toBe('var(--color-border, var(--color-border-mid))');
  });
});
