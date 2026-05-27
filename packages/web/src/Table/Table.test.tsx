import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Table } from './Table';
import type { Column } from './types';

interface Row {
  id: string;
  name: string;
  qty: number;
}

const rows: Row[] = [
  { id: '1', name: 'PMC1', qty: 8 },
  { id: '2', name: 'PMC2', qty: 12 },
];

const columns: Column<Row>[] = [
  { id: 'name', header: 'Name', accessor: 'name' },
  { id: 'qty', header: 'Qty', accessor: 'qty' },
];

describe('Table', () => {
  it('renders column headers', () => {
    render(<Table columns={columns} data={rows} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Qty')).toBeInTheDocument();
  });

  it('renders data rows', () => {
    render(<Table columns={columns} data={rows} />);
    expect(screen.getByText('PMC1')).toBeInTheDocument();
    expect(screen.getByText('PMC2')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('caption renders when given (a11y)', () => {
    render(<Table columns={columns} data={rows} caption="Chamber list" />);
    const caption = screen.getByText('Chamber list');
    expect(caption.tagName).toBe('CAPTION');
  });

  it('emptyMessage when data is empty — default "데이터 없음"', () => {
    render(<Table columns={columns} data={[]} />);
    expect(screen.getByText('데이터 없음')).toBeInTheDocument();
  });

  it('emptyMessage custom override', () => {
    render(<Table columns={columns} data={[]} emptyMessage="No chambers configured" />);
    expect(screen.getByText('No chambers configured')).toBeInTheDocument();
    expect(screen.queryByText('데이터 없음')).not.toBeInTheDocument();
  });

  it('stickyHeader — thead has position: sticky', () => {
    render(<Table columns={columns} data={rows} stickyHeader data-testid="table" />);
    const thead = screen.getByTestId('table').querySelector('thead');
    expect(thead).toBeTruthy();
    expect(thead?.getAttribute('style') || '').toMatch(/position:\s*sticky/);
  });

  it('zebra — wonik-table-zebra class applied', () => {
    render(<Table columns={columns} data={rows} zebra data-testid="table" />);
    expect(screen.getByTestId('table')).toHaveClass('wonik-table-zebra');
  });

  it('column.cell takes precedence over renderCell', () => {
    const cols: Column<Row>[] = [
      { id: 'name', header: 'Name', accessor: 'name', cell: (v) => `[col] ${v}` },
    ];
    render(
      <Table
        columns={cols}
        data={rows}
        renderCell={(v) => `[global] ${v}`}
      />,
    );
    expect(screen.getByText('[col] PMC1')).toBeInTheDocument();
    expect(screen.queryByText('[global] PMC1')).not.toBeInTheDocument();
  });

  it('renderCell fallback when column.cell is absent', () => {
    render(
      <Table
        columns={columns}
        data={rows}
        renderCell={(v) => `*${v}*`}
      />,
    );
    expect(screen.getByText('*PMC1*')).toBeInTheDocument();
    expect(screen.getByText('*8*')).toBeInTheDocument();
  });

  it('accessor as function — derives value', () => {
    const cols: Column<Row>[] = [
      { id: 'combo', header: 'Combo', accessor: (row) => `${row.name}-${row.qty}` },
    ];
    render(<Table columns={cols} data={rows} />);
    expect(screen.getByText('PMC1-8')).toBeInTheDocument();
    expect(screen.getByText('PMC2-12')).toBeInTheDocument();
  });

  it('a11y — <th scope="col"> on every header', () => {
    render(<Table columns={columns} data={rows} data-testid="table" />);
    const ths = screen.getByTestId('table').querySelectorAll('th');
    expect(ths.length).toBe(2);
    ths.forEach((th) => expect(th.getAttribute('scope')).toBe('col'));
  });

  it('a11y — renders native <table> element', () => {
    render(<Table columns={columns} data={rows} data-testid="table" />);
    expect(screen.getByTestId('table').tagName).toBe('TABLE');
  });

  it('className composition — wonik-table + external className coexist', () => {
    render(<Table columns={columns} data={rows} className="my-table" data-testid="table" />);
    const el = screen.getByTestId('table');
    expect(el).toHaveClass('wonik-table');
    expect(el).toHaveClass('my-table');
  });

  it('external style overrides defaults (spread last)', () => {
    render(
      <Table
        columns={columns}
        data={rows}
        style={{ width: '500px' }}
        data-testid="table"
      />,
    );
    expect(screen.getByTestId('table')).toHaveStyle({ width: '500px' });
  });

  it('uses tableTokens.surface — bg + outline via CSS vars + interfaceColors.text for body text', () => {
    render(<Table columns={columns} data={rows} data-testid="table" />);
    const styleAttr = screen.getByTestId('table').getAttribute('style') || '';
    expect(styleAttr).toMatch(/background:\s*var\(--color-table-surface-bg/);
    // body text는 interfaceColors.text (host-cascade) — zebra bg 위에서도 WCAG AA 통과
    expect(styleAttr).toMatch(/color:\s*var\(--color-text/);
    expect(styleAttr).toMatch(/border:\s*1px solid var\(--color-table-surface-outline/);
  });

  it('no AI slop visual decoration (no backdrop blur / gradient / glow)', () => {
    render(<Table columns={columns} data={rows} data-testid="table" />);
    const styles = window.getComputedStyle(screen.getByTestId('table'));
    expect(styles.backdropFilter || '').not.toMatch(/blur/);
    expect(styles.backgroundImage || '').not.toMatch(/gradient/);
    expect(styles.boxShadow || '').not.toMatch(/glow/i);
  });
});
