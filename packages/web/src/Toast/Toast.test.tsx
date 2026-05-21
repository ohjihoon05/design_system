import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { ToastProvider } from './ToastProvider';
import { useToast } from './useToast';

function Probe({ onReady }: { onReady?: (api: ReturnType<typeof useToast>) => void }) {
  const toast = useToast();
  if (onReady) onReady(toast);
  return null;
}

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('useToast throws outside a ToastProvider', () => {
    expect(() => render(<Probe />)).toThrow(/ToastProvider/);
  });

  it('show() renders a toast with the title', () => {
    let api: ReturnType<typeof useToast> | null = null;
    render(
      <ToastProvider>
        <Probe onReady={(a) => (api = a)} />
      </ToastProvider>,
    );
    act(() => {
      api!.show({ title: 'Saved' });
    });
    expect(screen.getByText('Saved')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    let api: ReturnType<typeof useToast> | null = null;
    render(
      <ToastProvider>
        <Probe onReady={(a) => (api = a)} />
      </ToastProvider>,
    );
    act(() => {
      api!.show({ title: 'Title', description: 'Details here' });
    });
    expect(screen.getByText('Details here')).toBeInTheDocument();
  });

  it('default tone "info" uses role="status"', () => {
    let api: ReturnType<typeof useToast> | null = null;
    render(
      <ToastProvider>
        <Probe onReady={(a) => (api = a)} />
      </ToastProvider>,
    );
    act(() => {
      api!.show({ title: 'x' });
    });
    const toastEl = screen.getByText('x').closest('[role="status"]');
    expect(toastEl).not.toBeNull();
  });

  it('tone "error" uses role="alert" and aria-live="assertive"', () => {
    let api: ReturnType<typeof useToast> | null = null;
    render(
      <ToastProvider>
        <Probe onReady={(a) => (api = a)} />
      </ToastProvider>,
    );
    act(() => {
      api!.show({ tone: 'error', title: 'Boom' });
    });
    const el = screen.getByRole('alert');
    expect(el).toHaveAttribute('aria-live', 'assertive');
  });

  it('auto-dismisses after duration (default 4000ms)', () => {
    let api: ReturnType<typeof useToast> | null = null;
    render(
      <ToastProvider>
        <Probe onReady={(a) => (api = a)} />
      </ToastProvider>,
    );
    act(() => {
      api!.show({ title: 'Bye' });
    });
    expect(screen.queryByText('Bye')).not.toBeNull();
    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(screen.queryByText('Bye')).toBeNull();
  });

  it('duration=0 stays persistent', () => {
    let api: ReturnType<typeof useToast> | null = null;
    render(
      <ToastProvider>
        <Probe onReady={(a) => (api = a)} />
      </ToastProvider>,
    );
    act(() => {
      api!.show({ title: 'Sticky', duration: 0 });
    });
    act(() => {
      vi.advanceTimersByTime(10_000);
    });
    expect(screen.queryByText('Sticky')).not.toBeNull();
  });

  it('× dismiss button removes the toast', () => {
    let api: ReturnType<typeof useToast> | null = null;
    render(
      <ToastProvider>
        <Probe onReady={(a) => (api = a)} />
      </ToastProvider>,
    );
    act(() => {
      api!.show({ title: 'Gone' });
    });
    fireEvent.click(screen.getByLabelText('닫기'));
    expect(screen.queryByText('Gone')).toBeNull();
  });

  it('dismiss(id) removes the matching toast', () => {
    let api: ReturnType<typeof useToast> | null = null;
    let id = '';
    render(
      <ToastProvider>
        <Probe onReady={(a) => (api = a)} />
      </ToastProvider>,
    );
    act(() => {
      id = api!.show({ title: 'A', duration: 0 });
      api!.show({ title: 'B', duration: 0 });
    });
    expect(screen.queryByText('A')).not.toBeNull();
    expect(screen.queryByText('B')).not.toBeNull();
    act(() => {
      api!.dismiss(id);
    });
    expect(screen.queryByText('A')).toBeNull();
    expect(screen.queryByText('B')).not.toBeNull();
  });

  it('dismissAll() removes every toast', () => {
    let api: ReturnType<typeof useToast> | null = null;
    render(
      <ToastProvider>
        <Probe onReady={(a) => (api = a)} />
      </ToastProvider>,
    );
    act(() => {
      api!.show({ title: 'A', duration: 0 });
      api!.show({ title: 'B', duration: 0 });
    });
    act(() => {
      api!.dismissAll();
    });
    expect(screen.queryByText('A')).toBeNull();
    expect(screen.queryByText('B')).toBeNull();
  });

  it('queue caps at max (default 5) — drops oldest', () => {
    let api: ReturnType<typeof useToast> | null = null;
    render(
      <ToastProvider>
        <Probe onReady={(a) => (api = a)} />
      </ToastProvider>,
    );
    act(() => {
      for (let i = 1; i <= 6; i++) {
        api!.show({ title: `T${i}`, duration: 0 });
      }
    });
    expect(screen.queryByText('T1')).toBeNull();
    for (let i = 2; i <= 6; i++) {
      expect(screen.queryByText(`T${i}`)).not.toBeNull();
    }
  });

  it('custom max=2 caps queue to 2', () => {
    let api: ReturnType<typeof useToast> | null = null;
    render(
      <ToastProvider max={2}>
        <Probe onReady={(a) => (api = a)} />
      </ToastProvider>,
    );
    act(() => {
      api!.show({ title: 'A', duration: 0 });
      api!.show({ title: 'B', duration: 0 });
      api!.show({ title: 'C', duration: 0 });
    });
    expect(screen.queryByText('A')).toBeNull();
    expect(screen.queryByText('B')).not.toBeNull();
    expect(screen.queryByText('C')).not.toBeNull();
  });

  it('action button triggers callback and dismisses', () => {
    let api: ReturnType<typeof useToast> | null = null;
    const onUndo = vi.fn();
    render(
      <ToastProvider>
        <Probe onReady={(a) => (api = a)} />
      </ToastProvider>,
    );
    act(() => {
      api!.show({ title: 'Closed', action: { label: 'Undo', onClick: onUndo }, duration: 0 });
    });
    fireEvent.click(screen.getByText('Undo'));
    expect(onUndo).toHaveBeenCalledOnce();
    expect(screen.queryByText('Closed')).toBeNull();
  });

  it('stack region has role="region" and aria-label="알림"', () => {
    render(
      <ToastProvider>
        <Probe />
      </ToastProvider>,
    );
    expect(screen.getByRole('region', { name: '알림' })).toBeInTheDocument();
  });
});
