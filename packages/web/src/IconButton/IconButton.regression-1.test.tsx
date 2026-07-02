import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IconButton } from './IconButton';

// Regression: ISSUE-005 — inline background이 주입 CSS의 :hover 규칙을 항상
// 이겨서 hover 상태가 죽는 문제. base background는 주입 CSS 클래스 규칙에
// 있어야 :hover(더 높은 specificity)가 이길 수 있다.
// Found by /qa on 2026-07-02
// Report: .gstack/qa-reports/qa-report-web-sandbox-2026-07-02.md

describe('IconButton — ISSUE-005 regression (inline background이 :hover를 죽이는 충돌)', () => {
  it('outline/ghost 모두 inline style에 background가 없다 (base는 주입 CSS)', () => {
    const { rerender } = render(<IconButton aria-label="닫기">×</IconButton>);
    const btn = screen.getByRole('button');
    expect(btn.style.background).toBe('');

    rerender(
      <IconButton variant="ghost" aria-label="닫기">
        ×
      </IconButton>,
    );
    expect(btn.style.background).toBe('');
  });

  it('주입 CSS에 base background(transparent)와 :hover 규칙이 함께 있다', () => {
    render(<IconButton aria-label="닫기">×</IconButton>);
    const styleTag = document.querySelector('style[data-wonik-iconbutton]');
    expect(styleTag).not.toBeNull();
    const css = styleTag!.textContent ?? '';
    expect(css).toContain('.wonik-iconbtn {');
    expect(css).toContain('background: transparent');
    expect(css).toContain('.wonik-iconbtn:hover:not(:disabled)');
  });
});
