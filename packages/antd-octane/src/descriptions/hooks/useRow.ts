import { useMemo } from "octane";
import { devUseWarning } from "../../_util/warning";
import type { InternalDescriptionsItemType } from "./useItems";

/** Distribute spans into rows, then fill each row's trailing cell, as upstream does. */
function getCalcRows(
  column: number,
  items: InternalDescriptionsItemType[],
): [InternalDescriptionsItemType[][], boolean] {
  const rows: InternalDescriptionsItemType[][] = [];
  let row: InternalDescriptionsItemType[] = [];
  let count = 0;
  let exceed = false;
  for (const { filled, ...item } of items) {
    if (filled) {
      row.push(item);
      rows.push(row);
      row = [];
      count = 0;
      continue;
    }
    const restSpan = column - count;
    count += item.span || 1;
    if (count > column) exceed = true;
    row.push(count > column ? { ...item, span: restSpan } : item);
    if (count >= column) {
      rows.push(row);
      row = [];
      count = 0;
    }
  }
  if (row.length) rows.push(row);
  return [
    rows.map((cells) => {
      const count = cells.reduce((total, item) => total + (item.span || 1), 0);
      if (count < column) {
        const last = cells[cells.length - 1];
        last.span = column - (count - (last.span || 1));
      }
      return cells;
    }),
    exceed,
  ];
}
export function getRows(column: number, items: InternalDescriptionsItemType[]) {
  return getCalcRows(column, items)[0];
}
export default function useRow(
  column: number,
  items: InternalDescriptionsItemType[],
) {
  const [rows, exceed] = useMemo(
    () => getCalcRows(column, items),
    [column, items],
  );
  const warning = devUseWarning("Descriptions");
  warning(
    !exceed,
    "usage",
    "Sum of column `span` in a line not match `column` of Descriptions.",
  );
  return rows;
}
