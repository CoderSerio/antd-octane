/** @jsxImportSource octane */
import type { CSSProperties, ElementType, OctaneNode } from "octane";
import { createContext, useContext } from "octane";
import type {
  TableSummaryCellProps,
  TableSummaryProps,
  TableSummaryRowProps,
} from "./types";

export interface TableSummaryContextValue {
  row?: ElementType;
  cell?: ElementType;
  cellPropsForIndex?: (index: number | undefined) => {
    className?: OctaneNode;
    style?: CSSProperties;
  };
}

export const TableSummaryContext = createContext<TableSummaryContextValue>({});

/** Summary composition primitives inspired by rc-table's Summary API. */
export function TableSummary({ children, fixed }: TableSummaryProps) {
  const fixedPosition = fixed === "top" ? "top" : fixed ? "bottom" : undefined;
  return (
    <tfoot
      className={["ant-table-summary", fixed && "ant-table-summary-fixed"]}
      data-fixed={fixedPosition}
    >
      {children}
    </tfoot>
  );
}

export function TableSummaryRow({ children, ...props }: TableSummaryRowProps) {
  const { row: Row = "tr" } = useContext(TableSummaryContext);
  return (
    <Row {...props} className={["ant-table-summary-row", props.className]}>
      {children}
    </Row>
  );
}

export function TableSummaryCell({
  children,
  index,
  align,
  ...props
}: TableSummaryCellProps) {
  const { cell: Cell = "td", cellPropsForIndex } =
    useContext(TableSummaryContext);
  if (props.colSpan === 0 || props.rowSpan === 0) return null;
  const cellStyle = props.style as CSSProperties | undefined;
  const summaryCellProps = cellPropsForIndex?.(index);
  return (
    <Cell
      {...props}
      className={[
        "ant-table-cell",
        "ant-table-summary-cell",
        summaryCellProps?.className,
        props.className,
      ]}
      data-summary-index={index}
      style={{ ...cellStyle, textAlign: align, ...summaryCellProps?.style }}
    >
      {children}
    </Cell>
  );
}
