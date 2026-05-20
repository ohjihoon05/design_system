import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { useState } from 'react';
import { Modal } from './Modal';

function Wrapper({ initial = true, ...props }: { initial?: boolean; title?: string }) {
  const [open, setOpen] = useState(initial);
  return (
    <>
      <button onClick={() => setOpen(true)}>open</button>
      <Modal isOpen={open} onClose={() => setOpen(false)} title={props.title}>
        <Modal.Body>
          <p>body content</p>
          <button>first btn</button>
          <button>last btn</button>
        </Modal.Body>
        <Modal.Footer>
          <button>cancel</button>
          <button>confirm</button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

describe('Modal', () => {
  it('does not render when isOpen=false', () => {
    render(<Wrapper initial={false} title="t" />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders dialog with aria-modal="true" when open', () => {
    render(<Wrapper title="t" />);
    const dlg = screen.getByRole('dialog');
    expect(dlg).toBeInTheDocument();
    expect(dlg).toHaveAttribute('aria-modal', 'true');
  });

  it('renders title in header and connects aria-labelledby', () => {
    render(<Wrapper title="Close alarm?" />);
    const dlg = screen.getByRole('dialog');
    const labelledby = dlg.getAttribute('aria-labelledby');
    expect(labelledby).toBeTruthy();
    const titleEl = document.getElementById(labelledby!);
    expect(titleEl?.textContent).toBe('Close alarm?');
  });

  it('omits aria-labelledby when no title', () => {
    render(<Wrapper />);
    expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-labelledby');
  });

  it('× button calls onClose', () => {
    render(<Wrapper title="t" />);
    fireEvent.click(screen.getByLabelText('닫기'));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('closes on backdrop click when closeOnBackdrop=true (default)', () => {
    render(<Wrapper title="t" />);
    const backdrop = document.querySelector('.wonik-modal-backdrop')!;
    fireEvent.click(backdrop);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('does NOT close on backdrop when closeOnBackdrop=false', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen onClose={onClose} closeOnBackdrop={false} title="t">
        <Modal.Body>x</Modal.Body>
      </Modal>,
    );
    const backdrop = document.querySelector('.wonik-modal-backdrop')!;
    fireEvent.click(backdrop);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('does NOT close when clicking inside the panel', () => {
    render(<Wrapper title="t" />);
    fireEvent.click(screen.getByText('body content'));
    expect(screen.queryByRole('dialog')).not.toBeNull();
  });

  it('closes on Escape key when closeOnEsc=true (default)', () => {
    render(<Wrapper title="t" />);
    fireEvent.keyDown(document.querySelector('.wonik-modal-backdrop')!, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('does NOT close on Escape when closeOnEsc=false', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen onClose={onClose} closeOnEsc={false} title="t">
        <Modal.Body>x</Modal.Body>
      </Modal>,
    );
    fireEvent.keyDown(document.querySelector('.wonik-modal-backdrop')!, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('size sm/md/lg map to 480/640/800 max-width', () => {
    const { rerender } = render(
      <Modal isOpen onClose={() => {}} size="sm"><Modal.Body>x</Modal.Body></Modal>,
    );
    expect(screen.getByRole('dialog')).toHaveStyle({ maxWidth: '480px' });
    rerender(<Modal isOpen onClose={() => {}} size="md"><Modal.Body>x</Modal.Body></Modal>);
    expect(screen.getByRole('dialog')).toHaveStyle({ maxWidth: '640px' });
    rerender(<Modal isOpen onClose={() => {}} size="lg"><Modal.Body>x</Modal.Body></Modal>);
    expect(screen.getByRole('dialog')).toHaveStyle({ maxWidth: '800px' });
  });

  it('renders portal into document.body', () => {
    const { container } = render(<Wrapper title="t" />);
    expect(container.querySelector('[role="dialog"]')).toBeNull();
    expect(document.body.querySelector('[role="dialog"]')).not.toBeNull();
  });

  it('locks body scroll while open and restores on close', () => {
    document.body.style.overflow = 'auto';
    const { unmount } = render(<Wrapper title="t" />);
    expect(document.body.style.overflow).toBe('hidden');
    fireEvent.click(screen.getByLabelText('닫기'));
    expect(document.body.style.overflow).toBe('auto');
    unmount();
  });

  it('focuses first focusable on mount', () => {
    render(<Wrapper title="t" />);
    // First focusable inside Modal panel: × button (header) — but our wrapper has body buttons too.
    // After we close on ×, the title prop creates header button first; expect it has focus.
    expect(document.activeElement).toBe(screen.getByLabelText('닫기'));
  });

  it('Tab from last focusable wraps to first (focus trap)', () => {
    render(<Wrapper title="t" />);
    const buttons = screen.getAllByRole('button');
    // Find inside-modal buttons (× / first / last / cancel / confirm). "open" is outside.
    const inside = buttons.filter((b) => b.textContent !== 'open');
    const last = inside[inside.length - 1];
    act(() => last.focus());
    expect(document.activeElement).toBe(last);
    fireEvent.keyDown(document.querySelector('.wonik-modal-backdrop')!, { key: 'Tab' });
    expect(document.activeElement).toBe(inside[0]);
  });

  it('Shift+Tab from first focusable wraps to last', () => {
    render(<Wrapper title="t" />);
    const buttons = screen.getAllByRole('button');
    const inside = buttons.filter((b) => b.textContent !== 'open');
    const first = inside[0];
    act(() => first.focus());
    fireEvent.keyDown(document.querySelector('.wonik-modal-backdrop')!, {
      key: 'Tab',
      shiftKey: true,
    });
    expect(document.activeElement).toBe(inside[inside.length - 1]);
  });

  it('Modal.Body renders with wonik-modal-body class', () => {
    render(
      <Modal isOpen onClose={() => {}}>
        <Modal.Body>x</Modal.Body>
      </Modal>,
    );
    expect(document.querySelector('.wonik-modal-body')).not.toBeNull();
  });

  it('Modal.Footer renders with wonik-modal-footer class', () => {
    render(
      <Modal isOpen onClose={() => {}}>
        <Modal.Footer>x</Modal.Footer>
      </Modal>,
    );
    expect(document.querySelector('.wonik-modal-footer')).not.toBeNull();
  });
});
