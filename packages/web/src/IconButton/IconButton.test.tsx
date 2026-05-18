import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { IconButton } from './IconButton';

const IconStub = () => <svg data-testid="icon" width={14} height={14} />;

describe('IconButton', () => {
  it('renders an accessible button with the provided aria-label', () => {
    render(
      <IconButton aria-label="Close detail">
        <IconStub />
      </IconButton>,
    );
    expect(screen.getByRole('button', { name: 'Close detail' })).toBeInTheDocument();
  });

  it('renders the icon child', () => {
    render(
      <IconButton aria-label="Bell">
        <IconStub />
      </IconButton>,
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(
      <IconButton aria-label="Bell" onClick={onClick}>
        <IconStub />
      </IconButton>,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('does not call onClick when disabled', () => {
    const onClick = vi.fn();
    render(
      <IconButton aria-label="Bell" onClick={onClick} disabled>
        <IconStub />
      </IconButton>,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('default variant outline renders a 1px solid border', () => {
    render(
      <IconButton aria-label="Default">
        <IconStub />
      </IconButton>,
    );
    const btn = screen.getByRole('button');
    expect(btn.style.border).toMatch(/1px\s+solid/);
  });

  it('ghost variant has no border', () => {
    render(
      <IconButton aria-label="Ghost" variant="ghost">
        <IconStub />
      </IconButton>,
    );
    const btn = screen.getByRole('button');
    expect(btn.style.border === '' || btn.style.border === 'none').toBe(true);
  });

  it('size sm renders 24×24', () => {
    render(
      <IconButton aria-label="sm" size="sm">
        <IconStub />
      </IconButton>,
    );
    const btn = screen.getByRole('button');
    expect(btn).toHaveStyle({ width: '24px', height: '24px' });
  });

  it('size md (default) renders 32×32', () => {
    render(
      <IconButton aria-label="md">
        <IconStub />
      </IconButton>,
    );
    const btn = screen.getByRole('button');
    expect(btn).toHaveStyle({ width: '32px', height: '32px' });
  });

  it('size lg renders 40×40', () => {
    render(
      <IconButton aria-label="lg" size="lg">
        <IconStub />
      </IconButton>,
    );
    const btn = screen.getByRole('button');
    expect(btn).toHaveStyle({ width: '40px', height: '40px' });
  });

  it('uses radius.sm (5px)', () => {
    render(
      <IconButton aria-label="r">
        <IconStub />
      </IconButton>,
    );
    expect(screen.getByRole('button')).toHaveStyle({ borderRadius: '5px' });
  });

  it('background is transparent for both variants', () => {
    const { rerender } = render(
      <IconButton aria-label="o">
        <IconStub />
      </IconButton>,
    );
    let btn = screen.getByRole('button');
    expect(btn.style.background).toMatch(/transparent/);
    rerender(
      <IconButton aria-label="g" variant="ghost">
        <IconStub />
      </IconButton>,
    );
    btn = screen.getByRole('button');
    expect(btn.style.background).toMatch(/transparent/);
  });

  it('attaches the wonik-iconbtn class', () => {
    render(
      <IconButton aria-label="x">
        <IconStub />
      </IconButton>,
    );
    expect(screen.getByRole('button').className).toContain('wonik-iconbtn');
  });

  it('composes external className after wonik-iconbtn', () => {
    render(
      <IconButton aria-label="x" className="custom">
        <IconStub />
      </IconButton>,
    );
    const cn = screen.getByRole('button').className;
    expect(cn).toContain('wonik-iconbtn');
    expect(cn).toContain('custom');
  });

  it('forwards type and other native button attributes', () => {
    render(
      <IconButton aria-label="submit-icon" type="submit" data-testid="ibtn">
        <IconStub />
      </IconButton>,
    );
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('type', 'submit');
    expect(btn).toHaveAttribute('data-testid', 'ibtn');
  });

  it('disabled state applies opacity 0.5', () => {
    render(
      <IconButton aria-label="d" disabled>
        <IconStub />
      </IconButton>,
    );
    expect(screen.getByRole('button')).toHaveStyle({ opacity: '0.5' });
  });

  it('injects module-scope CSS on first mount (data-wonik-iconbutton)', () => {
    render(
      <IconButton aria-label="inject">
        <IconStub />
      </IconButton>,
    );
    expect(document.querySelector('style[data-wonik-iconbutton]')).not.toBeNull();
  });
});
