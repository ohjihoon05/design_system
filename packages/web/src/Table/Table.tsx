import type { CSSProperties, ReactNode } from 'react';
import { tableTokens, space, interfaceColors } from '@wonik/tokens';
import type { Column, TableProps } from './types';
import { ensureCssInjected } from '../utils/ensureCssInjected';

// nth-child selector는 inline style로 못 풀어서 module-scope CSS 1회 inject
// (ADR-011 패턴, Card/Switch와 동일). zebra 옵션 켤 때만 적용되는 .wonik-table-zebra scope.
const TABLE_CSS = `
.wonik-table-zebra tbody tr:nth-child(even) {
  background: ${tableTokens.surface.titleBg};
}
`;

function getValue<T>(row: T, accessor: Column<T>['accessor']): unknown {
  if (typeof accessor === 'function') return accessor(row);
  return row[accessor as keyof T];
}

export function Table<T>({
  columns,
  data,
  stickyHeader,
  zebra,
  emptyMessage,
  renderCell,
  caption,
  className,
  style,
  ...rest
}: TableProps<T>) {
  ensureCssInjected('table', TABLE_CSS);

  const classes = ['wonik-table'];
  if (zebra) classes.push('wonik-table-zebra');
  if (className) classes.push(className);

  // table-level color는 interfaceColors.text — body td text의 default. zebra row
  // bg(#f4f5f5) 위에서도 WCAG AA 통과 (surface.text #71717b는 zebra 위에서 4.41:1 미달).
  // host theme override 가능. column 별 cell renderer로 lighter color 원하면 col.cell에서 명시.
  const tableStyle: CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    background: tableTokens.surface.bg,
    color: interfaceColors.text,
    border: `1px solid ${tableTokens.surface.outline}`,
    fontSize: '13px',
    ...style,
  };

  const theadStyle: CSSProperties | undefined = stickyHeader
    ? { position: 'sticky', top: 0, zIndex: 1 }
    : undefined;

  // column header text는 interfaceColors.text (host-cascade, dark text) — WCAG AA
  // color-contrast 통과 + host theme override 가능. tableTokens.surface.title (#b8b8c0)는
  // subtle sub-label 용도라 미달(1.8:1), surface.text (#71717b)도 titleBg 위에서 4.41:1로
  // 0.09 미달이라 채택 불가. ADR-027 a11y gate 통과 필수.
  const thStyle: CSSProperties = {
    background: tableTokens.surface.titleBg,
    color: interfaceColors.text,
    padding: `${space[2]} ${space[3]}`,
    textAlign: 'left',
    fontWeight: 600,
    borderBottom: `1px solid ${tableTokens.surface.outline}`,
  };

  const tdStyle: CSSProperties = {
    padding: `${space[2]} ${space[3]}`,
    borderBottom: `1px solid ${tableTokens.surface.outline}`,
  };

  const emptyTdStyle: CSSProperties = { ...tdStyle, textAlign: 'center' };

  return (
    <table className={classes.join(' ')} style={tableStyle} {...rest}>
      {caption ? <caption>{caption}</caption> : null}
      <thead style={theadStyle}>
        <tr>
          {columns.map((col) => (
            <th key={col.id} scope="col" style={thStyle}>
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={columns.length} style={emptyTdStyle}>
              {emptyMessage ?? '데이터 없음'}
            </td>
          </tr>
        ) : (
          data.map((row, rowIdx) => (
            <tr key={rowIdx}>
              {columns.map((col) => {
                const value = getValue(row, col.accessor);
                const content: ReactNode = col.cell
                  ? col.cell(value, row)
                  : renderCell
                    ? renderCell(value, row, col)
                    : (value as ReactNode);
                return (
                  <td key={col.id} style={tdStyle}>
                    {content}
                  </td>
                );
              })}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
