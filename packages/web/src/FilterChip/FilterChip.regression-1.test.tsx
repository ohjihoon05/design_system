import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FilterChip } from './FilterChip';

// Regression: ISSUE-005 — inline background가 주입 CSS의 :hover 규칙을 항상
// 이겨서 hover 상태가 죽는 문제. base background는 주입 CSS 클래스 규칙에
// 있어야 :hover(더 높은 specificity)가 이길 수 있다.
// Found by /qa on 2026-07-02
// Report: .gstack/qa-reports/qa-report-web-sandbox-2026-07-02.md

describe('FilterChip — ISSUE-005 regression (inline background이 :hover를 죽이는 충돌)', () => {
  it('inactive/active 모두 inline style에 background가 없다 (base는 주입 CSS)', () => {
    const { rerender } = render(<FilterChip>필터</FilterChip>);
    const chip = screen.getByRole('button');
    expect(chip.style.background).toBe('');

    rerender(<FilterChip active>필터</FilterChip>);
    expect(chip.style.background).toBe('');
  });

  it('주입 CSS에 base background(inactive/active)와 :hover 규칙이 함께 있다', () => {
    render(<FilterChip>필터</FilterChip>);
    const styleTag = document.querySelector('style[data-wonik-filterchip]');
    expect(styleTag).not.toBeNull();
    const css = styleTag!.textContent ?? '';
    expect(css).toContain('.wonik-filterchip {');
    expect(css).toContain('.wonik-filterchip[data-active="true"] {');
    expect(css).toContain('.wonik-filterchip:hover:not(:disabled)');
    expect(css).toContain('.wonik-filterchip[data-active="true"]:hover:not(:disabled)');
  });
});
