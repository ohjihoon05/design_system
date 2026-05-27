import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Column definition — `{ id, header, accessor, cell }` 4-key shape.
 *
 * accessor: `keyof T` 또는 `(row) => unknown` — row에서 값 추출 방법.
 * cell: optional — 해당 column 전용 cell renderer. renderCell보다 우선.
 *
 * TanStack `ColumnDef`와 같은 shape으로 유지 (ADR-029 확장 trigger 도달 시 props 안 깨짐).
 */
export interface Column<T> {
  id: string;
  header: ReactNode;
  accessor: keyof T | ((row: T) => unknown);
  cell?: (value: unknown, row: T) => ReactNode;
}

export interface TableOwnProps<T> {
  /** Column 정의 배열. id는 unique. */
  columns: Column<T>[];

  /** 표시할 row 데이터. 빈 배열이면 emptyMessage. */
  data: T[];

  /** thead를 `position: sticky; top: 0`으로. default false. */
  stickyHeader?: boolean;

  /** tbody tr nth-child(even)에 titleBg 입힘 (module-scope CSS). default false. */
  zebra?: boolean;

  /** data.length === 0일 때 보여줄 fallback. default '데이터 없음'. */
  emptyMessage?: ReactNode;

  /** 전역 cell renderer. column.cell이 우선. default value를 그대로 표시. */
  renderCell?: (value: unknown, row: T, column: Column<T>) => ReactNode;

  /** `<caption>` 요소 — a11y. screen reader가 table 목적을 announce. */
  caption?: string;
}

/**
 * native <table>의 모든 attr 통과 (id, role, aria-* 등).
 * Card/Badge 패턴 답습 — forwardRef 미사용.
 */
export interface TableProps<T>
  extends TableOwnProps<T>,
    Omit<HTMLAttributes<HTMLTableElement>, keyof TableOwnProps<T>> {}
