/** @jsxImportSource octane */
import { FastColor } from "@ant-design/fast-color";
import type { CSSProperties, OctaneNode } from "octane";
import {
  Children,
  isValidElement,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "octane";
import cssSize from "../_util/css-size";
import { useBreakpoint } from "../_util/responsive";
import { useComponentTokens } from "../_util/tokens";
import { Checkbox } from "../checkbox";
import { useConfig } from "../config-provider";
import { Empty } from "../empty";
import useLocale from "../locale/useLocale";
import { Pagination } from "../pagination";
import { Radio } from "../radio";
import { Spin, type SpinProps } from "../spin";
import { Tooltip } from "../tooltip";
import { FilterDropdownView } from "./FilterDropdown";
import { SelectionDropdown } from "./SelectionDropdown";
import { StickyScrollBar } from "./StickyScrollBar";
import {
  TableSummary,
  TableSummaryCell,
  TableSummaryContext,
  TableSummaryRow,
} from "./Summary";
import type {
  ColumnFilterItem,
  ColumnsType,
  ExpandableConfig,
  FilterDropdownProps,
  FilterValue,
  RowSelectMethod,
  SorterResult,
  SortOrder,
  TableAction,
  TableColumnGroupProps,
  TableColumnGroupType,
  TableColumnProps,
  TableColumnType,
  TableKey,
  TablePaginationConfig,
  TableProps,
  TableScrollConfig,
  TableSelectionItem,
  TableSelectionOption,
  TableStickyConfig,
  TableSummaryProps,
} from "./types";
import { useVirtualRows } from "./useVirtualRows";

interface ColumnRef<T extends object> {
  column: TableColumnType<T>;
  key: string;
  path: number[];
  fixed?: FixedSide;
}

type FixedSide = "left" | "right";
type FixedValue = boolean | FixedSide | undefined;
type HeaderCellColumn<T extends object> = {
  column: TableColumnType<T> | TableColumnGroupType<T>;
  path: number[];
};

interface FixedColumnInfo {
  side?: FixedSide;
  offset: number;
  first?: boolean;
  last?: boolean;
}

function normalizeFixed(value: FixedValue): FixedSide | undefined {
  if (value === true) return "left";
  if (value === "left" || value === "right") return value;
  return undefined;
}

function declaredWidth(width: number | string | undefined): number {
  if (typeof width === "number" && Number.isFinite(width))
    return Math.max(0, width);
  if (typeof width !== "string") return 0;
  const match = width.trim().match(/^([\d.]+)(?:px)?$/);
  const parsed = match ? Number(match[1]) : 0;
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

interface ActiveSorter<T extends object> {
  column: TableColumnType<T>;
  key: string;
  order: SortOrder;
  multiple: number;
}

function isGroup<T extends object>(
  column: TableColumnType<T> | TableColumnGroupType<T>,
): column is TableColumnGroupType<T> {
  return Array.isArray((column as TableColumnGroupType<T>).children);
}

function Column<T extends object = Record<string, unknown>>(
  _props: TableColumnProps<T>,
) {
  return null;
}

function ColumnGroup<T extends object = Record<string, unknown>>(
  _props: TableColumnGroupProps<T>,
) {
  return null;
}

function columnsFromChildren<T extends object>(
  children: OctaneNode,
): ColumnsType<T> {
  const collect = (nodes: OctaneNode): ColumnsType<T> => {
    const columns: ColumnsType<T> = [];
    Children.forEach(nodes, (child) => {
      if (!isValidElement(child)) return;
      if (child.type !== Column && child.type !== ColumnGroup) return;
      const { children: nested, ...column } =
        child.props as TableColumnProps<T>;
      if (child.type === ColumnGroup) {
        columns.push({
          ...column,
          children: collect(nested ?? child.children),
        } as TableColumnGroupType<T>);
      } else {
        columns.push(column as TableColumnType<T>);
      }
    });
    return columns;
  };
  return collect(children);
}

function columnKey<T extends object>(
  column: TableColumnType<T>,
  path: number[],
) {
  if (column.key !== undefined) return String(column.key);
  if (column.dataIndex !== undefined) {
    return Array.isArray(column.dataIndex)
      ? column.dataIndex.map(String).join(".")
      : String(column.dataIndex);
  }
  return path.join(".");
}

function columnRefs<T extends object>(columns: ColumnsType<T>): ColumnRef<T>[] {
  const refs: ColumnRef<T>[] = [];
  const visit = (
    items: ColumnsType<T>,
    parentPath: number[],
    inheritedFixed?: FixedSide,
  ) => {
    items.forEach((column, index) => {
      const path = [...parentPath, index];
      const fixed =
        column.fixed === undefined
          ? inheritedFixed
          : normalizeFixed(column.fixed);
      if (isGroup(column)) visit(column.children, path, fixed);
      else refs.push({ column, key: columnKey(column, path), path, fixed });
    });
  };
  visit(columns, []);
  return refs;
}

function getValue(
  record: object,
  dataIndex?: string | number | readonly (string | number)[],
) {
  if (dataIndex === undefined) return undefined;
  const path = Array.isArray(dataIndex) ? dataIndex : [dataIndex];
  let value: unknown = record;
  for (const part of path) {
    if (value === null || typeof value !== "object") return undefined;
    value = (value as Record<string | number, unknown>)[part];
  }
  return value;
}

function normalizePage(value: number | undefined, fallback: number) {
  return Number.isFinite(value) && (value as number) >= 1
    ? Math.floor(value as number)
    : fallback;
}

function defaultSortState<T extends object>(columns: ColumnsType<T>) {
  return Object.fromEntries(
    columnRefs(columns)
      .filter(
        ({ column }) =>
          column.sorter &&
          column.sortOrder === undefined &&
          column.defaultSortOrder,
      )
      .map(({ key, column }) => [key, column.defaultSortOrder as SortOrder]),
  ) as Record<string, SortOrder>;
}

function defaultFilterState<T extends object>(columns: ColumnsType<T>) {
  return Object.fromEntries(
    columnRefs(columns)
      .filter(
        ({ column }) =>
          column.filteredValue === undefined &&
          column.defaultFilteredValue?.length,
      )
      .map(({ key, column }) => [
        key,
        normalizeFilterKeys(column, column.defaultFilteredValue as FilterValue),
      ]),
  ) as Record<string, FilterValue>;
}

function flattenFilterValues(filters: ColumnFilterItem[] = []): FilterValue {
  return filters.flatMap((item) => [
    item.value,
    ...flattenFilterValues(item.children),
  ]);
}

function normalizeFilterKeys<T extends object>(
  column: TableColumnType<T>,
  values: FilterValue | null | undefined,
): FilterValue | null {
  if (values == null) return null;
  if (column.filterDropdown || !column.filters) return values;
  return values.map((value) => String(value));
}

function originalFilterValues<T extends object>(
  column: TableColumnType<T>,
  values: FilterValue | null,
): FilterValue | null {
  if (values === null || column.filterDropdown || !column.filters)
    return values;
  const selectedKeys = new Set(values.map((value) => String(value)));
  return flattenFilterValues(column.filters).filter((value) =>
    selectedKeys.has(String(value)),
  );
}

function InternalTable<T extends object = Record<string, unknown>>({
  dataSource = [],
  columns: columnsProp = [],
  children,
  rowKey = "key",
  pagination: paginationProp,
  rowSelection,
  expandable,
  expandedRowRender: legacyExpandedRowRender,
  expandedRowKeys: legacyExpandedRowKeys,
  defaultExpandedRowKeys: legacyDefaultExpandedRowKeys,
  defaultExpandAllRows: legacyDefaultExpandAllRows,
  childrenColumnName: legacyChildrenColumnName,
  expandRowByClick: legacyExpandRowByClick,
  onExpand: legacyOnExpand,
  onExpandedRowsChange: legacyOnExpandedRowsChange,
  loading = false,
  size,
  bordered = false,
  showHeader = true,
  rowHoverable = true,
  sortDirections,
  showSorterTooltip = { target: "full-header" },
  tableLayout,
  components,
  getPopupContainer: getPopupContainerProp,
  sticky = false,
  virtual,
  onScroll,
  scroll,
  title,
  footer,
  summary,
  locale,
  rowClassName,
  onRow,
  onHeaderRow,
  onChange,
  ref,
  className,
  rootClassName,
  style,
  ...rest
}: TableProps<T>) {
  const columns = useMemo(
    () =>
      children === undefined ? columnsProp : columnsFromChildren<T>(children),
    [children, columnsProp],
  );
  const { token: t, component: c } = useComponentTokens("Table");
  const config = useConfig();
  const [defaultLocale] = useLocale("Table");
  const mergedSize =
    (size ?? config.componentSize ?? "large") === "default"
      ? "large"
      : (size ?? config.componentSize ?? "large");
  // Table's component token gives all three density modes the global font
  // size by default. Keep this explicit on the wrapper so its cells inherit
  // the configured theme size even when no Table-specific token overrides
  // are present.
  const cellFontSize =
    mergedSize === "small"
      ? (c?.cellFontSizeSM ?? t.fontSize)
      : mergedSize === "middle"
        ? (c?.cellFontSizeMD ?? t.fontSize)
        : (c?.cellFontSize ?? t.fontSize);
  const tableConfig = config.table;
  const tablePrefixCls = config.getPrefixCls("table");
  const mergedLocale = { ...defaultLocale, ...locale };
  const getPopupContainer = getPopupContainerProp ?? config.getPopupContainer;
  const stickyHeader = Boolean(sticky);
  const mergedVirtual = virtual ?? false;
  const virtualPaddingBlock =
    mergedSize === "small"
      ? (c?.cellPaddingBlockSM ?? t.paddingXS)
      : mergedSize === "middle"
        ? (c?.cellPaddingBlockMD ?? t.paddingSM)
        : (c?.cellPaddingBlock ?? t.padding);
  const estimatedVirtualRowHeight = Math.max(
    1,
    declaredWidth(virtualPaddingBlock) * 2 +
      cellFontSize * t.lineHeight +
      t.lineWidth,
  );
  const selectionColumnWidth =
    rowSelection?.columnWidth ?? c?.selectionColumnWidth ?? t.controlHeight;
  const tableId = useId();
  const headerNodes = useRef(new Map<string, HTMLTableCellElement>());
  const headerObservers = useRef(new Map<string, ResizeObserver>());
  const headerRefCallbacks = useRef(
    new Map<string, (node: HTMLTableCellElement | null) => void>(),
  );
  const contentRef = useRef<HTMLDivElement | null>(null);
  const headerScrollRef = useRef<HTMLDivElement | null>(null);
  const summaryScrollRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const tableRef = useRef<HTMLDivElement | null>(null);
  const cellRenderCache = useRef(
    new Map<string, { record: T; content: OctaneNode }>(),
  );
  const [scrollEdges, setScrollEdges] = useState({ left: false, right: false });
  const [virtualScrollTop, setVirtualScrollTop] = useState(0);
  const [measuredWidths, setMeasuredWidths] = useState<Record<string, number>>(
    {},
  );
  const getHeaderCellRef = (key: string) => {
    const existing = headerRefCallbacks.current.get(key);
    if (existing) return existing;
    const callback = (node: HTMLTableCellElement | null) => {
      if (headerNodes.current.get(key) === node) return;
      headerObservers.current.get(key)?.disconnect();
      headerObservers.current.delete(key);
      if (!node) {
        headerNodes.current.delete(key);
        setMeasuredWidths((current) => {
          if (current[key] === undefined) return current;
          const next = { ...current };
          delete next[key];
          return next;
        });
        return;
      }
      headerNodes.current.set(key, node);
      const measure = () => {
        const width = node.getBoundingClientRect().width;
        setMeasuredWidths((current) =>
          current[key] !== undefined && Math.abs(current[key] - width) < 0.5
            ? current
            : { ...current, [key]: width },
        );
      };
      measure();
      if (typeof ResizeObserver !== "undefined") {
        const observer = new ResizeObserver(measure);
        observer.observe(node);
        headerObservers.current.set(key, observer);
      }
    };
    headerRefCallbacks.current.set(key, callback);
    return callback;
  };
  const scrollTo = (configValue: TableScrollConfig) => {
    const { index, key, top, align, behavior = "auto" } = configValue;
    const content = contentRef.current;
    if (!content) return;
    if (top !== undefined) {
      content.scrollTo({ top, behavior });
      return;
    }
    if (virtualRowsEnabled && scroll?.y) {
      const virtualIndex =
        index ??
        (key === undefined
          ? undefined
          : pageData.findIndex(
              (record, rowIndex) =>
                getRowKey(record, (current - 1) * pageSize + rowIndex) === key,
            ));
      if (virtualIndex === undefined || virtualIndex < 0) return;
      const rowTop = virtualMetrics.offsetAt(virtualIndex);
      const rowBottom = rowTop + virtualMetrics.rowHeightAt(virtualIndex);
      const viewportHeight = Math.max(
        0,
        content.clientHeight || virtualViewportHeight,
      );
      const visibleTop = content.scrollTop;
      const visibleBottom = visibleTop + viewportHeight;
      let bodyScrollTop = visibleTop;
      const targetAlign = align ?? "auto";
      if (targetAlign === "top") {
        bodyScrollTop = rowTop;
      } else if (targetAlign === "bottom") {
        bodyScrollTop = rowBottom - viewportHeight;
      } else if (rowTop < visibleTop) {
        bodyScrollTop = rowTop;
      } else if (rowBottom > visibleBottom) {
        bodyScrollTop = rowBottom - viewportHeight;
      } else {
        return;
      }
      content.scrollTo({
        top: Math.max(0, bodyScrollTop),
        behavior,
      });
      return;
    }
    const headerHeight =
      content.querySelector("thead")?.getBoundingClientRect().height ?? 0;
    const rows = Array.from(
      content.querySelectorAll<HTMLTableRowElement>("tbody tr[data-row-key]"),
    );
    const row =
      key !== undefined
        ? rows.find((item) => item.dataset.rowKey === String(key))
        : index !== undefined
          ? rows[index]
          : undefined;
    if (!row) return;
    if (!scroll?.y) {
      const stickyHeaderBottom = stickyHeader
        ? (content.querySelector("thead")?.getBoundingClientRect().bottom ??
          Number.NEGATIVE_INFINITY)
        : Number.NEGATIVE_INFINITY;
      const rowRect = row.getBoundingClientRect();
      const rowUnderStickyHeader = rowRect.top < stickyHeaderBottom;
      const block =
        align === "bottom"
          ? "end"
          : align === "auto" && !rowUnderStickyHeader
            ? "nearest"
            : "start";
      if (block === "start" && stickyHeader) {
        const previousScrollMargin = row.style.scrollMarginTop;
        row.style.scrollMarginTop = `${headerHeight + (stickyConfig.offsetHeader ?? 0)}px`;
        row.scrollIntoView({ behavior, block });
        row.style.scrollMarginTop = previousScrollMargin;
      } else {
        row.scrollIntoView({ behavior, block });
      }
      return;
    }
    const contentRect = content.getBoundingClientRect();
    const rowRect = row.getBoundingClientRect();
    const visibleTop = contentRect.top + (stickyHeader ? headerHeight : 0);
    let nextTop = content.scrollTop;
    if (align === "bottom") {
      nextTop += rowRect.bottom - contentRect.bottom;
    } else if (align === "auto") {
      if (rowRect.top < visibleTop) nextTop += rowRect.top - visibleTop;
      else if (rowRect.bottom > contentRect.bottom)
        nextTop += rowRect.bottom - contentRect.bottom;
      else return;
    } else {
      nextTop += rowRect.top - visibleTop;
    }
    content.scrollTo({
      top: Math.max(0, nextTop),
      behavior,
    });
  };
  useImperativeHandle(
    ref,
    () => ({ nativeElement: rootRef.current as HTMLDivElement, scrollTo }),
    [scrollTo],
  );
  useEffect(
    () => () => {
      headerObservers.current.forEach((observer) => {
        observer.disconnect();
      });
      headerObservers.current.clear();
      headerNodes.current.clear();
      headerRefCallbacks.current.clear();
    },
    [],
  );
  const hasResponsiveColumns = (items: ColumnsType<T>): boolean =>
    items.some(
      (column) =>
        Boolean(column.responsive?.length) ||
        (isGroup(column) && hasResponsiveColumns(column.children)),
    );
  const screens = useBreakpoint(hasResponsiveColumns(columns));
  const filterVisibleColumns = (items: ColumnsType<T>): ColumnsType<T> =>
    items.flatMap((column) => {
      if (
        column.hidden ||
        (column.responsive?.length &&
          !column.responsive.some((breakpoint) => screens[breakpoint]))
      ) {
        return [];
      }
      if (isGroup(column)) {
        const children = filterVisibleColumns(column.children);
        return children.length ? [{ ...column, children }] : [];
      }
      return [column];
    });
  const visibleColumns = filterVisibleColumns(columns);
  const hasEllipsis = columnRefs(visibleColumns).some(({ column }) =>
    Boolean(column.ellipsis),
  );
  const refs = columnRefs(visibleColumns);
  const leafColumns = refs.map(({ column }) => column);
  const initialPagination =
    paginationProp !== false ? paginationProp : undefined;
  const [innerPage, setInnerPage] = useState(
    normalizePage(initialPagination?.defaultCurrent, 1),
  );
  const [innerPageSize, setInnerPageSize] = useState(
    normalizePage(initialPagination?.defaultPageSize, 10),
  );
  const [innerSortState, setInnerSortState] = useState<
    Record<string, SortOrder>
  >(() => defaultSortState(columns));
  const [innerFilterState, setInnerFilterState] = useState<
    Record<string, FilterValue>
  >(() => defaultFilterState(columns));
  const [filterDraft, setFilterDraft] = useState<Record<string, FilterValue>>(
    {},
  );
  const [filterOpen, setFilterOpen] = useState<Record<string, boolean>>({});
  const filterConfirmedOnClose = useRef(new Set<string>());
  const [innerSelectedKeys, setInnerSelectedKeys] = useState<TableKey[]>(
    rowSelection?.defaultSelectedRowKeys ?? [],
  );
  const preservedRecords = useRef(new Map<TableKey, T>());
  const lastSelectedKey = useRef<TableKey | null>(null);
  const expandedConfig: ExpandableConfig<T> = {
    expandedRowRender: legacyExpandedRowRender,
    expandedRowKeys: legacyExpandedRowKeys,
    defaultExpandedRowKeys: legacyDefaultExpandedRowKeys,
    defaultExpandAllRows: legacyDefaultExpandAllRows,
    childrenColumnName: legacyChildrenColumnName,
    expandRowByClick: legacyExpandRowByClick,
    onExpand: legacyOnExpand,
    onExpandedRowsChange: legacyOnExpandedRowsChange,
    ...expandable,
    expandIcon:
      expandable?.expandIcon ??
      (tableConfig?.expandable
        ?.expandIcon as ExpandableConfig<T>["expandIcon"]),
  };
  const childrenName = expandedConfig.childrenColumnName ?? "children";
  const extraRowRender = expandedConfig.expandedRowRender;
  const controlledExpandedKeys = expandedConfig.expandedRowKeys;
  const [innerExpandedKeys, setInnerExpandedKeys] = useState<TableKey[]>(() => {
    if (expandedConfig.defaultExpandAllRows) {
      const keys: TableKey[] = [];
      const visit = (items: T[], depth = 0) => {
        if (depth > 50) return;
        items.forEach((record, index) => {
          if (
            Array.isArray((record as Record<string, unknown>)[childrenName])
          ) {
            keys.push(
              typeof rowKey === "function"
                ? rowKey(record)
                : (((record as Record<string, unknown>)[rowKey] as TableKey) ??
                    index),
            );
            visit(
              (record as Record<string, unknown>)[childrenName] as T[],
              depth + 1,
            );
          }
        });
      };
      visit(dataSource);
      return keys;
    }
    return expandedConfig.defaultExpandedRowKeys ?? [];
  });

  const sortOrderFor = (ref: ColumnRef<T>): SortOrder =>
    ref.column.sortOrder !== undefined
      ? ref.column.sortOrder
      : (innerSortState[ref.key] ?? null);
  const activeSorters: ActiveSorter<T>[] = refs
    .filter(({ column }) => Boolean(column.sorter))
    .map((ref) => ({
      ...ref,
      order: sortOrderFor(ref),
      multiple:
        typeof ref.column.sorter === "object" && ref.column.sorter !== null
          ? (ref.column.sorter.multiple ?? 0)
          : 0,
    }))
    .filter((sorter) => sorter.order !== null)
    .sort((a, b) => b.multiple - a.multiple);
  const activeFilterValues = (ref: ColumnRef<T>): FilterValue | null => {
    if (ref.column.filteredValue !== undefined)
      return normalizeFilterKeys(ref.column, ref.column.filteredValue);
    return innerFilterState[ref.key] ?? null;
  };
  const activeFilters = refs.reduce<Record<string, FilterValue | null>>(
    (result, ref) => {
      if (ref.column.filters || ref.column.filterDropdown)
        result[ref.key] = activeFilterValues(ref);
      return result;
    },
    {},
  );
  const filterRefs = refs.filter(
    ({ column }) => column.filters?.length || column.filterDropdown,
  );

  const dataRecordIndices = new Map<T, number>();
  const indexDataRecords = (items: T[], depth = 0) => {
    if (depth > 50) return;
    items.forEach((record) => {
      dataRecordIndices.set(record, dataRecordIndices.size);
      const children = (record as Record<string, unknown>)[childrenName];
      if (Array.isArray(children)) indexDataRecords(children as T[], depth + 1);
    });
  };
  indexDataRecords(dataSource);
  const getRowKey = (record: T, index: number): TableKey => {
    if (typeof rowKey === "function") return rowKey(record);
    return (
      ((record as Record<string, unknown>)[rowKey] as TableKey) ??
      dataRecordIndices.get(record) ??
      index
    );
  };

  const getSortersForState = (
    state: Record<string, SortOrder>,
    overrideControlled = false,
  ): ActiveSorter<T>[] =>
    refs
      .filter(({ column }) => Boolean(column.sorter))
      .map((ref) => ({
        ...ref,
        order:
          !overrideControlled && ref.column.sortOrder !== undefined
            ? ref.column.sortOrder
            : (state[ref.key] ?? null),
        multiple:
          typeof ref.column.sorter === "object" && ref.column.sorter !== null
            ? (ref.column.sorter.multiple ?? 0)
            : 0,
      }))
      .filter((sorter) => sorter.order !== null)
      .sort((a, b) => b.multiple - a.multiple);

  const getFiltersForState = (
    state: Record<string, FilterValue | null>,
  ): Record<string, FilterValue | null> =>
    refs.reduce<Record<string, FilterValue | null>>((result, ref) => {
      if (ref.column.filters || ref.column.filterDropdown) {
        result[ref.key] = Object.hasOwn(state, ref.key)
          ? (state[ref.key] ?? null)
          : ref.column.filteredValue !== undefined
            ? normalizeFilterKeys(ref.column, ref.column.filteredValue)
            : (innerFilterState[ref.key] ?? null);
      }
      return result;
    }, {});

  const processData = (
    rows: T[],
    sorters: ActiveSorter<T>[],
    filters: Record<string, FilterValue | null>,
  ): T[] => {
    const ordered = rows.map((record) => {
      const nested = (record as Record<string, unknown>)[childrenName];
      if (!Array.isArray(nested)) return record;
      return {
        ...record,
        [childrenName]: processData(nested as T[], sorters, filters),
      };
    });
    const localSorters = sorters.filter(({ column }) => {
      if (typeof column.sorter === "function") return true;
      return (
        typeof column.sorter === "object" &&
        column.sorter !== null &&
        Boolean(column.sorter.compare)
      );
    });
    const sorted = localSorters.length
      ? ordered
          .map((record, index) => ({ record, index }))
          .sort((left, right) => {
            for (const sorter of localSorters) {
              if (!sorter.order) continue;
              const sorterConfig = sorter.column.sorter;
              const compare =
                typeof sorterConfig === "function"
                  ? sorterConfig
                  : typeof sorterConfig === "object" && sorterConfig !== null
                    ? sorterConfig.compare
                    : undefined;
              if (!compare) continue;
              const result = compare(left.record, right.record, sorter.order);
              if (result !== 0)
                return sorter.order === "descend" ? -result : result;
            }
            return left.index - right.index;
          })
          .map(({ record }) => record)
      : ordered;
    if (!Object.values(filters).some((values) => values?.length)) return sorted;
    const applyFilters = (records: T[]): T[] => {
      return records.flatMap((record) => {
        const nested = (record as Record<string, unknown>)[childrenName];
        const filteredChildren = Array.isArray(nested)
          ? applyFilters(nested as T[])
          : undefined;
        const passes = filterRefs.every(({ column, key }) => {
          const selected = filters[key];
          if (!selected?.length || !column.onFilter) return true;
          const originalSelected =
            originalFilterValues(column, selected) ?? selected;
          const matches = originalSelected.some((value) =>
            column.onFilter?.(value, record),
          );
          return matches;
        });
        if (!passes && !filteredChildren?.length) return [];
        return filteredChildren
          ? [{ ...record, [childrenName]: filteredChildren }]
          : [record];
      });
    };
    return applyFilters(sorted);
  };

  const sortedAndFilteredData = processData(
    dataSource,
    activeSorters,
    activeFilters,
  );
  const paginationEnabled = paginationProp !== false;
  const paginationOptions = paginationEnabled
    ? (paginationProp ?? {})
    : undefined;
  const pageSize = normalizePage(
    paginationOptions?.pageSize ?? innerPageSize,
    10,
  );
  const total = Math.max(
    0,
    paginationOptions?.total ?? sortedAndFilteredData.length,
  );
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(
    pageCount,
    normalizePage(paginationOptions?.current ?? innerPage, 1),
  );
  const isServerPage = sortedAndFilteredData.length < total;
  const pageData = paginationEnabled
    ? isServerPage
      ? sortedAndFilteredData
      : sortedAndFilteredData.slice(
          (current - 1) * pageSize,
          current * pageSize,
        )
    : sortedAndFilteredData;

  const sorterInfo = (
    sorters: ActiveSorter<T>[],
  ): SorterResult<T> | SorterResult<T>[] => {
    const result = sorters.map(({ column, key, order }) => ({
      column,
      order,
      field: column.dataIndex,
      columnKey: column.key ?? key,
    }));
    return result.length > 1 ? result : (result[0] ?? {});
  };
  const filtersInfo = (filters: Record<string, FilterValue | null>) =>
    refs.reduce<Record<string, FilterValue | null>>((result, ref) => {
      if (ref.column.filters || ref.column.filterDropdown)
        result[ref.key] = originalFilterValues(
          ref.column,
          filters[ref.key] ?? null,
        );
      return result;
    }, {});
  const paginationInfo = (
    page: number,
    sizeValue: number,
    dataTotal = total,
  ): TablePaginationConfig => ({
    ...(paginationOptions ?? {}),
    current: page,
    pageSize: sizeValue,
    total: dataTotal,
  });
  const dispatchChange = (
    action: TableAction,
    options: {
      sortState?: Record<string, SortOrder>;
      filterState?: Record<string, FilterValue | null>;
      page?: number;
      pageSize?: number;
    } = {},
  ) => {
    const nextPageSize = options.pageSize ?? pageSize;
    const nextPage = options.page ?? current;
    const nextSorters = options.sortState
      ? getSortersForState(options.sortState, true)
      : activeSorters;
    const nextFilters = getFiltersForState(
      options.filterState ?? activeFilters,
    );
    const nextData = processData(dataSource, nextSorters, nextFilters);
    const nextTotal = paginationOptions?.total ?? nextData.length;
    const nextPaging = paginationInfo(nextPage, nextPageSize, nextTotal);
    const filterPayload = filtersInfo(nextFilters);
    const sorterPayload = sorterInfo(nextSorters);
    if (action === "filter" && paginationOptions?.current === undefined) {
      setInnerPage(1);
      paginationOptions?.onChange?.(1, nextPageSize);
    } else if (
      action === "paginate" &&
      paginationOptions?.current === undefined
    ) {
      setInnerPage(nextPage);
    }
    if (action === "paginate" && paginationOptions?.pageSize === undefined) {
      setInnerPageSize(nextPageSize);
    }
    if (scroll?.scrollToFirstRowOnChange !== false) scrollTo({ top: 0 });
    onChange?.(nextPaging, filterPayload, sorterPayload, {
      currentDataSource: nextData,
      action,
    });
  };

  const controlledSelectionKeys = rowSelection?.selectedRowKeys;
  const selectedKeys = controlledSelectionKeys ?? innerSelectedKeys;
  const flattenRecords = (records: T[], depth = 0): T[] => {
    if (depth > 50) return [];
    return records.flatMap((record) => {
      const children = (record as Record<string, unknown>)[childrenName];
      return [
        record,
        ...(Array.isArray(children)
          ? flattenRecords(children as T[], depth + 1)
          : []),
      ];
    });
  };
  const allRecords = flattenRecords(dataSource);
  const recordsByKey = new Map<TableKey, T>();
  const parentByKey = new Map<TableKey, TableKey>();
  const childKeysByKey = new Map<TableKey, TableKey[]>();
  const collectSelectionTree = (
    records: T[],
    parentKey?: TableKey,
    depth = 0,
  ) => {
    if (depth > 50) return;
    records.forEach((record, index) => {
      const key = getRowKey(record, index);
      recordsByKey.set(key, record);
      if (parentKey !== undefined) {
        parentByKey.set(key, parentKey);
        childKeysByKey.set(parentKey, [
          ...(childKeysByKey.get(parentKey) ?? []),
          key,
        ]);
      }
      const children = (record as Record<string, unknown>)[childrenName];
      if (Array.isArray(children))
        collectSelectionTree(children as T[], key, depth + 1);
    });
  };
  collectSelectionTree(dataSource);
  const normalizeSelectionKeys = (keys: TableKey[]) => {
    if (rowSelection?.checkStrictly !== false) return keys;
    const next = new Set(keys);
    const visitDown = (key: TableKey, depth = 0) => {
      if (depth > 50) return;
      const children = childKeysByKey.get(key) ?? [];
      for (const childKey of children) {
        const child = recordsByKey.get(childKey);
        if (child && !rowSelection.getCheckboxProps?.(child)?.disabled)
          next.add(childKey);
        visitDown(childKey, depth + 1);
      }
    };
    for (const key of keys) visitDown(key);
    const visitUp = (key: TableKey, depth = 0) => {
      if (depth > 50) return;
      const parentKey = parentByKey.get(key);
      if (parentKey === undefined) return;
      const parent = recordsByKey.get(parentKey);
      const children = childKeysByKey.get(parentKey) ?? [];
      const selectableChildren = children.filter((childKey) => {
        const child = recordsByKey.get(childKey);
        return child && !rowSelection.getCheckboxProps?.(child)?.disabled;
      });
      if (
        parent &&
        !rowSelection.getCheckboxProps?.(parent)?.disabled &&
        selectableChildren.length > 0 &&
        selectableChildren.every((childKey) => next.has(childKey))
      ) {
        next.add(parentKey);
      } else {
        next.delete(parentKey);
      }
      visitUp(parentKey, depth + 1);
    };
    for (const key of [...next]) visitUp(key);
    return [...next];
  };
  const selectedKeySet = new Set(normalizeSelectionKeys(selectedKeys));
  const halfSelectedKeySet = new Set<TableKey>();
  if (rowSelection?.checkStrictly === false) {
    const visitHalf = (key: TableKey, depth = 0): boolean => {
      if (depth > 50) return false;
      const children = childKeysByKey.get(key) ?? [];
      let checkedCount = 0;
      let partial = false;
      children.forEach((childKey) => {
        const childPartial = visitHalf(childKey, depth + 1);
        if (selectedKeySet.has(childKey)) checkedCount += 1;
        if (childPartial) partial = true;
      });
      if (
        (checkedCount > 0 || partial) &&
        (checkedCount < children.length || partial) &&
        !selectedKeySet.has(key)
      ) {
        halfSelectedKeySet.add(key);
        return true;
      }
      return partial;
    };
    dataSource.forEach((record, index) => {
      visitHalf(getRowKey(record, index));
    });
  }
  const currentRecords = new Map<TableKey, T>();
  allRecords.forEach((record, index) => {
    currentRecords.set(getRowKey(record, index), record);
  });
  if (rowSelection?.preserveSelectedRowKeys) {
    currentRecords.forEach((record, key) => {
      preservedRecords.current.set(key, record);
    });
    for (const key of preservedRecords.current.keys()) {
      if (!selectedKeys.includes(key)) preservedRecords.current.delete(key);
    }
  } else {
    preservedRecords.current.clear();
  }
  useEffect(() => {
    if (
      controlledSelectionKeys !== undefined ||
      rowSelection?.preserveSelectedRowKeys
    )
      return;
    const availableKeys = new Set(
      allRecords.map((record, index) => getRowKey(record, index)),
    );
    const nextKeys = innerSelectedKeys.filter((key) => availableKeys.has(key));
    if (nextKeys.length !== innerSelectedKeys.length)
      setInnerSelectedKeys(nextKeys);
  }, [
    dataSource,
    rowKey,
    rowSelection?.preserveSelectedRowKeys,
    controlledSelectionKeys,
    innerSelectedKeys,
  ]);
  const selectedRows = (keys: TableKey[]) => {
    return keys
      .map(
        (key) => currentRecords.get(key) ?? preservedRecords.current.get(key),
      )
      .filter((record): record is T => record !== undefined);
  };
  const notifySelection = (
    nextKeys: TableKey[],
    method: RowSelectMethod,
    record?: T,
    selected?: boolean,
    nativeEvent?: Event,
    changeRows?: T[],
    notifySelectAll = true,
  ) => {
    const normalizedKeys = normalizeSelectionKeys(nextKeys);
    if (controlledSelectionKeys === undefined)
      setInnerSelectedKeys(normalizedKeys);
    const nextRows = selectedRows(normalizedKeys);
    if ((method === "all" || method === "none") && notifySelectAll) {
      rowSelection?.onSelectAll?.(method === "all", nextRows, changeRows ?? []);
    }
    if (record !== undefined && selected !== undefined && nativeEvent) {
      rowSelection?.onSelect?.(record, selected, nextRows, nativeEvent);
    }
    rowSelection?.onChange?.(normalizedKeys, nextRows, { type: method });
  };
  const togglePageSelection = (selected: boolean) => {
    if (!rowSelection) return;
    const eligible = flattenRecords(pageData).filter(
      (record) => !rowSelection.getCheckboxProps?.(record)?.disabled,
    );
    const pageKeys = eligible.map((record, index) => getRowKey(record, index));
    const changedRows = eligible.filter((record, index) =>
      selected
        ? !selectedKeySet.has(getRowKey(record, index))
        : selectedKeySet.has(getRowKey(record, index)),
    );
    const nextKeys = selected
      ? [...new Set([...selectedKeys, ...pageKeys])]
      : selectedKeys.filter((keyValue) => !pageKeys.includes(keyValue));
    notifySelection(
      nextKeys,
      selected ? "all" : "none",
      undefined,
      undefined,
      undefined,
      changedRows,
    );
  };
  const toggleAllSelection = () => {
    if (!rowSelection) return;
    const allKeys = allRecords
      .map((record, index) => getRowKey(record, index))
      .filter((key) => {
        const record = recordsByKey.get(key);
        return (
          record &&
          (!rowSelection.getCheckboxProps?.(record)?.disabled ||
            selectedKeySet.has(key))
        );
      });
    const changedRows = allKeys
      .filter((key) => !selectedKeySet.has(key))
      .map((key) => recordsByKey.get(key))
      .filter((record): record is T => record !== undefined);
    notifySelection(
      allKeys,
      "all",
      undefined,
      undefined,
      undefined,
      changedRows,
      false,
    );
  };
  const clearSelection = () => {
    if (!rowSelection) return;
    const retainedKeys = selectedKeys.filter((key) => {
      const record = recordsByKey.get(key);
      return record && rowSelection.getCheckboxProps?.(record)?.disabled;
    });
    const changeRows = selectedRows(selectedKeys).filter((record, index) => {
      const key = getRowKey(record, index);
      return !retainedKeys.includes(key);
    });
    rowSelection.onSelectNone?.();
    notifySelection(
      retainedKeys,
      "none",
      undefined,
      undefined,
      undefined,
      changeRows,
      false,
    );
  };

  const expandedKeys = controlledExpandedKeys ?? innerExpandedKeys;
  const expandedSet = new Set(expandedKeys);
  const pageSelectionRows = () =>
    flattenRecords(pageData)
      .map((record, index) => ({ record, key: getRowKey(record, index) }))
      .filter(
        ({ record }) => !rowSelection?.getCheckboxProps?.(record)?.disabled,
      );
  const toggleRecordSelection = (
    record: T,
    index: number,
    checked: boolean,
    nativeEvent: Event,
  ) => {
    if (!rowSelection) return;
    const key = getRowKey(record, index);
    const selected = selectedKeySet.has(key);
    const selectableRows = pageSelectionRows();
    const targetIndex = selectableRows.findIndex((row) => row.key === key);
    const anchorIndex = selectableRows.findIndex(
      (row) => row.key === lastSelectedKey.current,
    );
    const shiftKey = Boolean(
      (nativeEvent as Event & { shiftKey?: boolean }).shiftKey,
    );

    const hasSelectedPageRow = selectableRows.some(({ key: rowKey }) =>
      selectedKeySet.has(rowKey),
    );
    if (
      shiftKey &&
      rowSelection.checkStrictly !== false &&
      hasSelectedPageRow &&
      targetIndex >= 0
    ) {
      const anchor = anchorIndex >= 0 ? anchorIndex : targetIndex;
      const start = Math.min(targetIndex, anchor);
      const end = Math.max(targetIndex, anchor);
      const rangeRows = selectableRows.slice(start, end + 1);
      const nextKeys = new Set(selectedKeys);
      const changeRows: T[] = [];
      const shouldSelect = rangeRows.some(
        (row) => !selectedKeySet.has(row.key),
      );
      rangeRows.forEach((row) => {
        const wasSelected = nextKeys.has(row.key);
        if (shouldSelect) {
          if (!wasSelected) changeRows.push(row.record);
          nextKeys.add(row.key);
        } else {
          changeRows.push(row.record);
          nextKeys.delete(row.key);
        }
      });
      const normalizedKeys = normalizeSelectionKeys([...nextKeys]);
      rowSelection.onSelectMultiple?.(
        shouldSelect,
        selectedRows(normalizedKeys),
        changeRows,
      );
      notifySelection(normalizedKeys, "multiple");
      lastSelectedKey.current = shouldSelect
        ? (rangeRows[rangeRows.length - 1]?.key ?? key)
        : null;
      return;
    }

    lastSelectedKey.current = selected ? null : key;
    const nextKeys = new Set(selectedKeys);
    if (checked) nextKeys.add(key);
    else {
      nextKeys.delete(key);
      if (rowSelection.checkStrictly === false) {
        let parentKey = parentByKey.get(key);
        while (parentKey !== undefined) {
          nextKeys.delete(parentKey);
          parentKey = parentByKey.get(parentKey);
        }
      }
    }
    if (rowSelection.checkStrictly === false) {
      const visitDescendants = (parentKey: TableKey) => {
        for (const childKey of childKeysByKey.get(parentKey) ?? []) {
          const child = recordsByKey.get(childKey);
          if (child && !rowSelection.getCheckboxProps?.(child)?.disabled) {
            if (checked) nextKeys.add(childKey);
            else nextKeys.delete(childKey);
          }
          visitDescendants(childKey);
        }
      };
      visitDescendants(key);
    }
    notifySelection([...nextKeys], "single", record, checked, nativeEvent);
  };
  const expandedRender = (
    record: T,
    index: number,
    indent: number,
    expanded: boolean,
  ) => extraRowRender?.(record, index, indent, expanded);
  const hasNestedData = flattenRecords(dataSource).some((record) => {
    const children = (record as Record<string, unknown>)[childrenName];
    return Array.isArray(children) && children.length > 0;
  });
  const hasExpandFeature = hasNestedData || Boolean(extraRowRender);
  const virtualRowsEnabled =
    mergedVirtual && Boolean(scroll?.y) && !hasNestedData && !extraRowRender;
  const splitVirtualHeader = virtualRowsEnabled && showHeader;
  const configuredVirtualViewportHeight =
    typeof scroll?.y === "number"
      ? scroll.y
      : Number.parseFloat(String(scroll?.y ?? "0")) || 0;
  const virtualViewportHeight =
    contentRef.current?.clientHeight || configuredVirtualViewportHeight;
  const virtualRows = useMemo(
    () =>
      pageData.map((record, index) => ({
        key: getRowKey(record, (current - 1) * pageSize + index),
      })),
    [current, getRowKey, pageData, pageSize],
  );
  const virtualMetrics = useVirtualRows(virtualRows, estimatedVirtualRowHeight);
  const virtualRange = virtualRowsEnabled
    ? virtualMetrics.getRange(virtualScrollTop, virtualViewportHeight)
    : { start: 0, end: pageData.length };
  const virtualStart = virtualRange.start;
  const virtualEnd = virtualRange.end;
  const showExpandColumn =
    expandedConfig.showExpandColumn !== false && hasExpandFeature;
  const firstColumnFixed = visibleColumns[0]?.fixed;
  const expandFixedValue = showExpandColumn
    ? (expandedConfig.fixed ?? firstColumnFixed)
    : undefined;
  const selectionFixedValue = rowSelection
    ? rowSelection.fixed !== undefined
      ? rowSelection.fixed
      : (firstColumnFixed ?? expandFixedValue)
    : undefined;
  const resolvedExpandFixedValue =
    showExpandColumn && expandFixedValue === undefined && selectionFixedValue
      ? selectionFixedValue
      : expandFixedValue;
  const specialColumnCount =
    Number(showExpandColumn) + Number(Boolean(rowSelection));
  const fixedColumns = [
    ...(showExpandColumn
      ? [
          {
            key: "special:expand",
            fixed: normalizeFixed(resolvedExpandFixedValue),
            width:
              expandedConfig.columnWidth === undefined
                ? 40
                : declaredWidth(expandedConfig.columnWidth),
          },
        ]
      : []),
    ...(rowSelection
      ? [
          {
            key: "special:selection",
            fixed: normalizeFixed(selectionFixedValue),
            width: declaredWidth(selectionColumnWidth),
          },
        ]
      : []),
    ...refs.map((ref) => ({
      key: `data:${ref.key}`,
      fixed: ref.fixed,
      width:
        measuredWidths[`data:${ref.key}`] ?? declaredWidth(ref.column.width),
    })),
  ];
  const fixedColumnWidths = fixedColumns.map((column) =>
    Math.max(0, column.width),
  );
  const fixedLeftOffsets = new Array(fixedColumns.length).fill(0) as number[];
  const fixedRightOffsets = new Array(fixedColumns.length).fill(0) as number[];
  let fixedLeftWidth = 0;
  fixedColumns.forEach((column, index) => {
    fixedLeftOffsets[index] = fixedLeftWidth;
    if (column.fixed === "left") fixedLeftWidth += fixedColumnWidths[index];
  });
  let fixedRightWidth = 0;
  for (let index = fixedColumns.length - 1; index >= 0; index -= 1) {
    fixedRightOffsets[index] = fixedRightWidth;
    if (fixedColumns[index].fixed === "right")
      fixedRightWidth += fixedColumnWidths[index];
  }
  const hasFixedLeft = fixedColumns.some((column) => column.fixed === "left");
  const hasFixedRight = fixedColumns.some((column) => column.fixed === "right");
  // rc-table 7.54.0 Table.tsx: an explicit layout precedes inferred defaults.
  const fixHeader = scroll?.y !== undefined && scroll.y !== null;
  const horizontalScroll =
    (scroll?.x !== undefined && scroll.x !== null) ||
    Boolean(expandedConfig.fixed);
  const fixColumn = horizontalScroll && (hasFixedLeft || hasFixedRight);
  const mergedTableLayout =
    tableLayout ??
    (fixColumn
      ? scroll?.x === "max-content"
        ? "auto"
        : "fixed"
      : fixHeader || stickyHeader || hasEllipsis
        ? "fixed"
        : "auto");
  const fixedCellInfo = (
    startIndex: number,
    endIndex = startIndex,
  ): FixedColumnInfo => {
    const firstColumn = fixedColumns[startIndex];
    const lastColumn = fixedColumns[endIndex];
    const side: FixedSide | undefined =
      firstColumn?.fixed === "left"
        ? "left"
        : lastColumn?.fixed === "right"
          ? "right"
          : undefined;
    if (!side) return { offset: 0 };
    const previous = fixedColumns[startIndex - 1];
    const next = fixedColumns[endIndex + 1];
    const canShowEdge =
      (next && !next.fixed) ||
      (previous && !previous.fixed) ||
      fixedColumns.every((column) => column.fixed === "left");
    return {
      side,
      offset:
        side === "left"
          ? fixedLeftOffsets[startIndex]
          : fixedRightOffsets[endIndex],
      last:
        side === "left" &&
        Boolean(canShowEdge) &&
        fixedColumns[endIndex + 1]?.fixed !== "left",
      first:
        side === "right" &&
        Boolean(canShowEdge) &&
        fixedColumns[startIndex - 1]?.fixed !== "right",
    };
  };
  const fixedCellClassName = (info: FixedColumnInfo) => [
    info.side && `ant-table-cell-fix-${info.side}`,
    info.side === "left" && info.last && "ant-table-cell-fix-left-last",
    info.side === "right" && info.first && "ant-table-cell-fix-right-first",
  ];
  const fixedCellStyle = (
    info: FixedColumnInfo,
    header = false,
  ): CSSProperties => {
    if (!info.side) return {};
    return {
      position: "sticky",
      [info.side]: `${info.offset}px`,
      zIndex: header ? 3 : 1,
    };
  };
  const headerFixedInfo = (path: number[]): FixedColumnInfo => {
    const startsWithPath = (candidate: number[]) =>
      path.every((part, index) => candidate[index] === part);
    const firstLeaf = refs.findIndex((ref) => startsWithPath(ref.path));
    if (firstLeaf < 0) return { offset: 0 };
    let lastLeaf = firstLeaf;
    for (let index = firstLeaf + 1; index < refs.length; index += 1) {
      if (startsWithPath(refs[index].path)) lastLeaf = index;
    }
    return fixedCellInfo(
      specialColumnCount + firstLeaf,
      specialColumnCount + lastLeaf,
    );
  };
  const specialFixedInfo = (name: "expand" | "selection") => {
    const index = name === "expand" ? 0 : Number(showExpandColumn);
    return fixedCellInfo(index);
  };
  const canExpand = (record: T) => {
    const children = (record as Record<string, unknown>)[childrenName];
    const hasChildren = Array.isArray(children) && children.length > 0;
    const hasDetail = Boolean(extraRowRender);
    return (
      (hasChildren || hasDetail) &&
      (expandedConfig.rowExpandable?.(record) ?? true)
    );
  };
  const toggleExpanded = (record: T, index: number, event: MouseEvent) => {
    const key = getRowKey(record, index);
    const expanded = !expandedSet.has(key);
    const nextKeys = expanded
      ? [...expandedKeys, key]
      : expandedKeys.filter((item) => item !== key);
    if (controlledExpandedKeys === undefined) setInnerExpandedKeys(nextKeys);
    expandedConfig.onExpand?.(expanded, record);
    expandedConfig.onExpandedRowsChange?.(nextKeys);
    event.stopPropagation();
  };

  const rawHeaderRows: HeaderCellColumn<T>[][] = [];
  const columnDepth = (items: ColumnsType<T>): number =>
    items.reduce(
      (depth, column) =>
        Math.max(depth, isGroup(column) ? 1 + columnDepth(column.children) : 1),
      1,
    );
  const maxHeaderDepth = visibleColumns.length
    ? columnDepth(visibleColumns)
    : 1;
  const visitHeader = (
    items: ColumnsType<T>,
    depth: number,
    parentPath: number[] = [],
  ) => {
    rawHeaderRows[depth] ??= [];
    items.forEach((column, index) => {
      const path = [...parentPath, index];
      rawHeaderRows[depth].push({ column, path });
      if (isGroup(column)) {
        visitHeader(column.children, depth + 1, path);
      }
    });
  };
  visitHeader(visibleColumns, 0);

  const headerTitle = (column: TableColumnType<T>, key: string) => {
    const ref = refs.find((item) => item.key === key);
    const order = ref ? sortOrderFor(ref) : null;
    const filterRecord = Object.fromEntries(
      refs
        .filter(
          (item) => item.column.filters && activeFilterValues(item) !== null,
        )
        .map((item) => [
          item.key,
          originalFilterValues(
            item.column,
            activeFilterValues(item) as FilterValue,
          ) as FilterValue,
        ]),
    ) as Record<string, FilterValue>;
    if (typeof column.title !== "function") return column.title;
    const current = activeSorters.find((sorter) => sorter.key === key);
    return column.title({
      sortOrder: order,
      sortColumn: current?.column,
      sortColumns: activeSorters.map(
        ({ column: sorterColumn, order: sorterOrder }) => ({
          column: sorterColumn,
          order: sorterOrder,
        }),
      ),
      filters: filterRecord,
    });
  };
  const renderFilter = (ref: ColumnRef<T>) => {
    const { column, key } = ref;
    if (!column.filters?.length && !column.filterDropdown) return null;
    const selected = activeFilterValues(ref) ?? [];
    const draft = filterDraft[key] ?? selected;
    const resetTarget = column.filterResetToDefaultFilteredValue
      ? (normalizeFilterKeys(column, column.defaultFilteredValue) ?? [])
      : [];
    const resetDisabled =
      resetTarget.length === draft.length &&
      resetTarget.every((value) =>
        draft.some(
          (keyValue) => typeof keyValue === typeof value && keyValue === value,
        ),
      );
    const popupProps = column.filterDropdownProps;
    const controlledOpen =
      popupProps?.open ??
      column.filterDropdownOpen ??
      column.filterDropdownVisible;
    const visible =
      controlledOpen ?? filterOpen[key] ?? popupProps?.defaultOpen ?? false;
    const setVisible = (nextVisible: boolean, event?: Event) => {
      if (controlledOpen === undefined) {
        setFilterOpen((current) => ({ ...current, [key]: nextVisible }));
      }
      popupProps?.onOpenChange?.(nextVisible);
      column.onFilterDropdownOpenChange?.(nextVisible);
      column.onFilterDropdownVisibleChange?.(nextVisible);
      if (
        !nextVisible &&
        !column.filterDropdown &&
        column.filterOnClose !== false &&
        !filterConfirmedOnClose.current.has(key)
      ) {
        confirmFilter(draft, true);
      }
      if (!nextVisible) filterConfirmedOnClose.current.delete(key);
      void event;
    };
    const confirmFilter = (keys: FilterValue, closeDropdown: boolean) => {
      const normalizedKeys = normalizeFilterKeys(column, keys) ?? [];
      const nextFilters = {
        ...activeFilters,
        [key]: normalizedKeys.length ? normalizedKeys : null,
      };
      setFilterDraft((current) => ({ ...current, [key]: normalizedKeys }));
      if (column.filteredValue === undefined) {
        setInnerFilterState((current) => ({
          ...current,
          [key]: normalizedKeys,
        }));
      }
      dispatchChange("filter", { filterState: nextFilters, page: 1 });
      if (closeDropdown) {
        filterConfirmedOnClose.current.add(key);
        setVisible(false);
      }
    };
    const resetFilter = (
      options: { confirm?: boolean; closeDropdown?: boolean } = {},
    ) => {
      const keys = column.filterResetToDefaultFilteredValue
        ? (normalizeFilterKeys(column, column.defaultFilteredValue) ?? [])
        : [];
      setFilterDraft((current) => ({ ...current, [key]: keys }));
      if (options.confirm) confirmFilter(keys, options.closeDropdown ?? false);
      else if (options.closeDropdown) setVisible(false);
    };
    const customProps: FilterDropdownProps<T> = {
      prefixCls: `${tablePrefixCls}-filter-dropdown-custom`,
      setSelectedKeys: (keys) =>
        setFilterDraft((current) => ({ ...current, [key]: keys })),
      selectedKeys: draft,
      confirm: (options) =>
        confirmFilter(draft, options?.closeDropdown !== false),
      clearFilters: resetFilter,
      filters: column.filters,
      visible,
      close: () => setVisible(false),
      column,
    };
    const customContent =
      typeof column.filterDropdown === "function"
        ? column.filterDropdown(customProps)
        : column.filterDropdown;
    const hasCustomContent =
      typeof column.filterDropdown === "function" ||
      Boolean(column.filterDropdown);
    const filterIcon =
      typeof column.filterIcon === "function"
        ? column.filterIcon(selected.length > 0)
        : column.filterIcon;
    return (
      <FilterDropdownView
        columnKey={key}
        filters={column.filters ?? []}
        draftKeys={draft}
        filterMultiple={column.filterMultiple}
        filterMode={column.filterMode}
        filterSearch={column.filterSearch}
        filtered={selected.length > 0}
        resetDisabled={resetDisabled}
        filterIcon={filterIcon}
        customContent={customContent}
        hasCustomContent={hasCustomContent}
        locale={mergedLocale}
        popupProps={{
          ...popupProps,
          open: controlledOpen ?? visible,
          defaultOpen: undefined,
        }}
        getPopupContainer={getPopupContainer}
        onDraftChange={(keys) =>
          setFilterDraft((current) => ({ ...current, [key]: keys }))
        }
        onConfirm={(options) =>
          confirmFilter(draft, options?.closeDropdown !== false)
        }
        onReset={resetFilter}
        onVisibleChange={setVisible}
      />
    );
  };

  const renderHeaderCell = (
    headerCell: HeaderCellColumn<T>,
    depth: number,
    index: number,
  ) => {
    const { column, path } = headerCell;
    const group = isGroup(column);
    const ref = group
      ? undefined
      : refs.find(
          (item) =>
            item.path.length === path.length &&
            item.path.every((part, pathIndex) => part === path[pathIndex]),
        );
    const key = ref?.key ?? String(index);
    const fixedInfo = ref
      ? fixedCellInfo(specialColumnCount + refs.indexOf(ref))
      : headerFixedInfo(path);
    const order = ref ? sortOrderFor(ref) : null;
    const canSort = !group && Boolean(column.sorter);
    const titleNode = group ? column.title : headerTitle(column, key);
    const directions = column.sortDirections ??
      sortDirections ?? ["ascend", "descend", null];
    const headerProps = column.onHeaderCell?.(column) ?? {};
    const nextOrder = () => {
      const currentIndex = directions.indexOf(order);
      return directions[(currentIndex + 1) % directions.length] ?? null;
    };
    const sorterTooltip = column.showSorterTooltip ?? showSorterTooltip;
    const tooltipText =
      typeof sorterTooltip === "object" && sorterTooltip.title !== undefined
        ? sorterTooltip.title
        : nextOrder() === "ascend"
          ? mergedLocale.triggerAsc
          : nextOrder() === "descend"
            ? mergedLocale.triggerDesc
            : mergedLocale.cancelSort;
    const tooltipProps =
      typeof sorterTooltip === "object" ? sorterTooltip : undefined;
    const sorterTooltipTarget = tooltipProps?.target ?? "full-header";
    const { target: _target, ...tooltipFloatingProps } = tooltipProps ?? {};
    return (
      <HeaderCell
        {...headerProps}
        ref={
          fixedInfo.side && ref
            ? getHeaderCellRef(`data:${ref.key}`)
            : undefined
        }
        key={`${key}-${depth}-${index}`}
        scope={headerProps.scope ?? "col"}
        colSpan={
          group
            ? (column.colSpan ?? countLeafColumns(column.children))
            : (column.colSpan ?? headerProps.colSpan)
        }
        rowSpan={
          group
            ? (column.rowSpan ?? headerProps.rowSpan)
            : (column.rowSpan ?? Math.max(1, maxHeaderDepth - depth))
        }
        className={[
          "ant-table-cell",
          column.ellipsis && "ant-table-cell-ellipsis",
          canSort && "ant-table-column-has-sorters",
          canSort && order && "ant-table-column-sort",
          order && `ant-table-column-sort-${order}`,
          ...fixedCellClassName(fixedInfo),
          column.className,
          headerProps.className,
        ]}
        aria-sort={
          canSort
            ? order === "ascend"
              ? "ascending"
              : order === "descend"
                ? "descending"
                : "none"
            : undefined
        }
        title={
          column.ellipsis &&
          (typeof column.ellipsis === "boolean" ||
            column.ellipsis.showTitle !== false) &&
          (typeof titleNode === "string" || typeof titleNode === "number")
            ? String(titleNode)
            : undefined
        }
        style={{
          width: column.width,
          minWidth: mergedTableLayout === "auto" ? column.minWidth : undefined,
          textAlign: column.align,
          ...column.style,
          ...(typeof headerProps.style === "object" ? headerProps.style : {}),
          ...fixedCellStyle(fixedInfo, true),
        }}
      >
        <div
          className={[
            "ant-table-column-content",
            !!(column.filters?.length || column.filterDropdown) &&
              "ant-table-filter-column",
          ]}
        >
          {canSort ? (
            (() => {
              const sorterIcon = (
                <span
                  className="ant-table-sorter ant-table-column-sorter"
                  aria-hidden="true"
                >
                  {column.sortIcon ? (
                    column.sortIcon({ sortOrder: order })
                  ) : (
                    <span className="ant-table-column-sorter-inner">
                      {directions.includes("ascend") && (
                        <span
                          className={[
                            "ant-table-column-sorter-up",
                            order === "ascend" && "active",
                          ]}
                        >
                          <svg
                            viewBox="0 0 1024 1024"
                            aria-hidden="true"
                            width="1em"
                            height="1em"
                            fill="currentColor"
                            focusable="false"
                          >
                            <path d="M858.9 689L530.5 308.2c-9.4-10.9-27.5-10.9-37 0L165.1 689c-12.2 14.2-1.2 35 18.5 35h656.8c19.7 0 30.7-20.8 18.5-35z" />
                          </svg>
                        </span>
                      )}
                      {directions.includes("descend") && (
                        <span
                          className={[
                            "ant-table-column-sorter-down",
                            order === "descend" && "active",
                          ]}
                        >
                          <svg
                            viewBox="0 0 1024 1024"
                            aria-hidden="true"
                            width="1em"
                            height="1em"
                            fill="currentColor"
                            focusable="false"
                          >
                            <path d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z" />
                          </svg>
                        </span>
                      )}
                    </span>
                  )}
                </span>
              );
              const iconWithTooltip =
                sorterTooltip !== false &&
                sorterTooltipTarget === "sorter-icon" ? (
                  <Tooltip
                    {...tooltipFloatingProps}
                    title={tooltipText}
                    trigger={tooltipProps?.trigger ?? "hover"}
                  >
                    {sorterIcon}
                  </Tooltip>
                ) : (
                  sorterIcon
                );
              const sortButton = (
                <button
                  type="button"
                  className="ant-table-column-title"
                  aria-label={
                    typeof titleNode === "string"
                      ? `按${titleNode}排序`
                      : (mergedLocale.sortTitle ?? "Sort")
                  }
                  onClick={() => {
                    const nextState = { ...innerSortState };
                    const callbackState: Record<string, SortOrder> = {};
                    for (const item of refs) {
                      const itemOrder = sortOrderFor(item);
                      if (itemOrder) callbackState[item.key] = itemOrder;
                    }
                    const configuredMultiple =
                      typeof column.sorter === "object" &&
                      column.sorter !== null &&
                      column.sorter.multiple !== undefined;
                    if (!configuredMultiple) {
                      for (const item of refs) {
                        if (item.column.sortOrder === undefined)
                          delete nextState[item.key];
                        if (item.key !== key) delete callbackState[item.key];
                      }
                    }
                    const next = nextOrder();
                    if (column.sortOrder === undefined) {
                      if (next) nextState[key] = next;
                      else delete nextState[key];
                      setInnerSortState(nextState);
                    }
                    if (next) callbackState[key] = next;
                    else delete callbackState[key];
                    dispatchChange("sort", { sortState: callbackState });
                  }}
                >
                  {titleNode}
                  {iconWithTooltip}
                </button>
              );
              return sorterTooltip !== false &&
                sorterTooltipTarget !== "sorter-icon" ? (
                <Tooltip
                  {...tooltipFloatingProps}
                  title={tooltipText}
                  trigger={tooltipProps?.trigger ?? "hover"}
                >
                  {sortButton}
                </Tooltip>
              ) : (
                sortButton
              );
            })()
          ) : (
            <span className="ant-table-column-title">{titleNode}</span>
          )}
          {ref && renderFilter(ref)}
        </div>
      </HeaderCell>
    );
  };

  const changeablePageRows = rowSelection
    ? flattenRecords(pageData).filter(
        (record) => !rowSelection.getCheckboxProps?.(record)?.disabled,
      )
    : [];
  const changeablePageKeys = changeablePageRows.map((record, index) =>
    getRowKey(record, index),
  );
  const selectedChangeableCount = changeablePageKeys.filter((key) =>
    selectedKeySet.has(key),
  ).length;
  const pageAllSelected =
    changeablePageKeys.length > 0 &&
    selectedChangeableCount === changeablePageKeys.length;
  const pageIndeterminate =
    (selectedChangeableCount > 0 && !pageAllSelected) ||
    changeablePageRows.some((record, index) =>
      halfSelectedKeySet.has(getRowKey(record, index)),
    );
  const titleCheckboxProps = rowSelection?.getTitleCheckboxProps?.() ?? {};
  const titleCheckbox = rowSelection ? (
    <Checkbox
      {...titleCheckboxProps}
      skipGroup
      checked={pageAllSelected}
      indeterminate={pageIndeterminate}
      disabled={titleCheckboxProps.disabled ?? changeablePageRows.length === 0}
      aria-label={mergedLocale.selectAll ?? "Select current page"}
      onChange={(event) => {
        togglePageSelection(event.target.checked);
        titleCheckboxProps.onChange?.(event);
      }}
    />
  ) : null;
  const defaultSelectionItems = [
    {
      key: "SELECT_ALL",
      text: mergedLocale.selectionAll ?? "Select all data",
      onSelect: () => toggleAllSelection(),
    },
    {
      key: "SELECT_INVERT",
      text: mergedLocale.selectInvert ?? "Invert current page",
      onSelect: () => {
        const nextKeys = [
          ...selectedKeys.filter((key) => !changeablePageKeys.includes(key)),
          ...changeablePageKeys.filter((key) => !selectedKeySet.has(key)),
        ];
        const changeRows = changeablePageRows.filter((record, index) =>
          selectedKeySet.has(getRowKey(record, index)),
        );
        const normalizedKeys = normalizeSelectionKeys(nextKeys);
        rowSelection?.onSelectInvert?.(normalizedKeys);
        notifySelection(
          nextKeys,
          "invert",
          undefined,
          undefined,
          undefined,
          changeRows,
        );
      },
    },
    {
      key: "SELECT_NONE",
      text: mergedLocale.selectNone ?? "Clear selection",
      onSelect: () => {
        clearSelection();
      },
    },
  ];
  const selectionHeaderNode = rowSelection
    ? rowSelection.columnTitle !== undefined
      ? typeof rowSelection.columnTitle === "function"
        ? rowSelection.columnTitle(
            rowSelection.type === "radio" ? null : titleCheckbox,
          )
        : rowSelection.columnTitle
      : rowSelection.type === "radio" || rowSelection.hideSelectAll
        ? null
        : titleCheckbox
    : null;
  const selectionItems: TableSelectionOption[] =
    rowSelection?.type === "radio" || rowSelection?.hideSelectAll
      ? []
      : rowSelection?.selections === true
        ? defaultSelectionItems
        : Array.isArray(rowSelection?.selections)
          ? rowSelection.selections
          : [];
  const resolvedSelectionItems = selectionItems
    .map((item) =>
      typeof item === "string"
        ? defaultSelectionItems.find((preset) => preset.key === item)
        : item,
    )
    .filter((item): item is TableSelectionItem => item !== undefined);
  const selectionHeaderContent = (
    <>
      {selectionHeaderNode}
      {resolvedSelectionItems.length > 0 && (
        <SelectionDropdown
          items={resolvedSelectionItems}
          changeableRowKeys={changeablePageKeys}
          getPopupContainer={getPopupContainer}
          label={mergedLocale.selectionAll ?? "Selection options"}
        />
      )}
    </>
  );
  const TableElement = components?.table ?? "table";
  const HeaderWrapper = components?.header?.wrapper ?? "thead";
  const HeaderRow = components?.header?.row ?? "tr";
  const HeaderCell = components?.header?.cell ?? "th";
  const BodyWrapper = components?.body?.wrapper ?? "tbody";
  const BodyRow = components?.body?.row ?? "tr";
  const BodyCell = components?.body?.cell ?? "td";

  const headerNode = showHeader ? (
    <HeaderWrapper className="ant-table-thead">
      {rawHeaderRows.map((row, rowIndex) => {
        const headerProps = onHeaderRow?.(visibleColumns, rowIndex) ?? {};
        return (
          <HeaderRow {...headerProps} key={`header-${rowIndex}`}>
            {rowIndex === 0 && showExpandColumn && (
              <HeaderCell
                ref={
                  specialFixedInfo("expand").side
                    ? getHeaderCellRef("special:expand")
                    : undefined
                }
                className={[
                  "ant-table-cell",
                  "ant-table-expand-column",
                  ...fixedCellClassName(specialFixedInfo("expand")),
                ]}
                rowSpan={maxHeaderDepth}
                aria-label="展开"
                style={{
                  width: expandedConfig.columnWidth ?? 40,
                  ...fixedCellStyle(specialFixedInfo("expand"), true),
                }}
              >
                {expandedConfig.columnTitle}
              </HeaderCell>
            )}
            {rowIndex === 0 && rowSelection && (
              <HeaderCell
                ref={
                  specialFixedInfo("selection").side
                    ? getHeaderCellRef("special:selection")
                    : undefined
                }
                className={[
                  "ant-table-cell",
                  "ant-table-selection-column",
                  ...fixedCellClassName(specialFixedInfo("selection")),
                ]}
                rowSpan={maxHeaderDepth}
                style={{
                  width: selectionColumnWidth,
                  textAlign: rowSelection.align,
                  ...fixedCellStyle(specialFixedInfo("selection"), true),
                }}
              >
                <span className="ant-table-selection-header">
                  {selectionHeaderContent}
                </span>
              </HeaderCell>
            )}
            {row.map((headerCell, index) =>
              renderHeaderCell(headerCell, rowIndex, index),
            )}
          </HeaderRow>
        );
      })}
    </HeaderWrapper>
  ) : null;

  const expandedIcon = (
    record: T,
    index: number,
    isExpandable: boolean,
    expanded: boolean,
  ): OctaneNode => {
    if (!isExpandable) return null;
    const custom = expandedConfig.expandIcon?.({
      expanded,
      record,
      expandable: isExpandable,
      onExpand: (currentRecord, event) =>
        toggleExpanded(currentRecord, index, event),
    });
    return (
      custom ?? (
        <button
          type="button"
          className={[
            "ant-table-row-expand-icon",
            expanded
              ? "ant-table-row-expand-icon-expanded"
              : "ant-table-row-expand-icon-collapsed",
          ]}
          aria-expanded={expanded}
          aria-label={
            expanded
              ? (mergedLocale.collapse ?? "Collapse row")
              : (mergedLocale.expand ?? "Expand row")
          }
          onClick={(event) => toggleExpanded(record, index, event)}
        ></button>
      )
    );
  };

  let displayIndex = (current - 1) * pageSize;
  let virtualIndex = 0;
  const activeCellRenderKeys = new Set<string>();
  const renderRows = (records: T[], depth = 0): OctaneNode[] => {
    if (depth > 50) return [];
    return records.flatMap((record) => {
      const index = displayIndex++;
      const pageIndex = virtualIndex++;
      if (
        virtualRowsEnabled &&
        (pageIndex < virtualStart || pageIndex >= virtualEnd)
      ) {
        return [];
      }
      const key = getRowKey(record, index);
      const children = (record as Record<string, unknown>)[childrenName];
      const nested = Array.isArray(children) ? (children as T[]) : [];
      const canExpandRow = canExpand(record);
      const expanded = expandedSet.has(key);
      const selected = selectedKeySet.has(key);
      const checkboxProps = rowSelection?.getCheckboxProps?.(record) ?? {};
      const onCheckboxPropsChange = (event: {
        target: { checked: boolean };
        nativeEvent: Event;
        preventDefault: () => void;
        stopPropagation: () => void;
      }) => {
        checkboxProps.onChange?.(
          event as Parameters<NonNullable<typeof checkboxProps.onChange>>[0],
        );
      };
      const rowProps = onRow?.(record, index) ?? {};
      const customRowClassName =
        typeof rowClassName === "function"
          ? rowClassName(record, index, depth)
          : rowClassName;
      const expandedRowClassName =
        typeof expandedConfig.expandedRowClassName === "function"
          ? expandedConfig.expandedRowClassName(record, index, depth)
          : expandedConfig.expandedRowClassName;
      const cells: OctaneNode[] = [];
      if (showExpandColumn) {
        const fixedInfo = specialFixedInfo("expand");
        cells.push(
          <BodyCell
            ref={
              fixedInfo.side &&
              !showHeader &&
              index === (current - 1) * pageSize
                ? getHeaderCellRef("special:expand")
                : undefined
            }
            className={[
              "ant-table-cell",
              "ant-table-expand-column",
              ...fixedCellClassName(fixedInfo),
            ]}
            key="expand"
            style={{
              width: expandedConfig.columnWidth ?? 40,
              ...fixedCellStyle(fixedInfo),
            }}
          >
            <span
              style={{
                marginInlineStart: depth * (expandedConfig.indentSize ?? 15),
              }}
            >
              {expandedIcon(record, index, canExpandRow, expanded)}
            </span>
          </BodyCell>,
        );
      }
      if (rowSelection) {
        const fixedInfo = specialFixedInfo("selection");
        const selectionCellProps = rowSelection.onCell?.(record, index) ?? {};
        const selectionOriginNode =
          rowSelection.type === "radio" ? (
            <Radio
              {...checkboxProps}
              checked={selected}
              value={String(key)}
              name={`table-selection-${tableId}`}
              aria-label={`Select row ${index + 1}`}
              onClick={(event) => {
                event.stopPropagation();
                checkboxProps.onClick?.(event);
              }}
              onChange={(event) => {
                if (event.target.checked && !selected) {
                  notifySelection(
                    [key],
                    "single",
                    record,
                    true,
                    event.nativeEvent,
                  );
                }
                onCheckboxPropsChange(event);
              }}
            />
          ) : (
            <Checkbox
              {...checkboxProps}
              skipGroup
              checked={selected}
              indeterminate={halfSelectedKeySet.has(key)}
              aria-label={`Select row ${index + 1}`}
              onClick={(event) => {
                event.stopPropagation();
                checkboxProps.onClick?.(event);
              }}
              onChange={(event) => {
                toggleRecordSelection(
                  record,
                  index,
                  event.target.checked,
                  event.nativeEvent,
                );
                onCheckboxPropsChange(event);
              }}
            />
          );
        const selectionContent = rowSelection.renderCell
          ? rowSelection.renderCell(
              selected,
              record,
              index,
              selectionOriginNode,
            )
          : selectionOriginNode;
        if (
          selectionCellProps.rowSpan !== 0 &&
          selectionCellProps.colSpan !== 0
        )
          cells.push(
            <BodyCell
              {...selectionCellProps}
              ref={
                fixedInfo.side &&
                !showHeader &&
                index === (current - 1) * pageSize
                  ? getHeaderCellRef("special:selection")
                  : undefined
              }
              className={[
                "ant-table-cell",
                "ant-table-selection-column",
                ...fixedCellClassName(fixedInfo),
                selectionCellProps.className,
              ]}
              key="selection"
              style={{
                width: selectionColumnWidth,
                textAlign: rowSelection.align,
                ...(typeof selectionCellProps.style === "object"
                  ? selectionCellProps.style
                  : {}),
                ...fixedCellStyle(fixedInfo),
              }}
            >
              {selectionContent}
            </BodyCell>,
          );
      }
      leafColumns.forEach((column, columnIndex) => {
        const columnRef = refs[columnIndex];
        const value = getValue(record, column.dataIndex);
        const cacheKey = `${String(key)}:${columnRef?.key ?? columnIndex}`;
        activeCellRenderKeys.add(cacheKey);
        const cached = cellRenderCache.current.get(cacheKey);
        const shouldUpdate =
          !column.shouldCellUpdate ||
          !cached ||
          column.shouldCellUpdate(record, cached.record);
        const content =
          !shouldUpdate && cached
            ? cached.content
            : column.render
              ? column.render(value, record, index)
              : ((value as OctaneNode) ?? "");
        cellRenderCache.current.set(cacheKey, { record, content });
        const cellProps = column.onCell?.(record, index) ?? {};
        const sortedColumn = activeSorters.some(
          (sorter) => sorter.key === columnRef?.key,
        );
        const fixedInfo = fixedCellInfo(specialColumnCount + columnIndex);
        const cellStyle: CSSProperties = {
          width: column.width,
          minWidth: mergedTableLayout === "auto" ? column.minWidth : undefined,
          textAlign: column.align,
          ...column.style,
          ...(typeof cellProps.style === "object" ? cellProps.style : {}),
          ...fixedCellStyle(fixedInfo),
        };
        const cellFixedKey = columnRef ? `data:${columnRef.key}` : undefined;
        const Cell = components?.body?.cell ?? (column.rowScope ? "th" : "td");
        cells.push(
          <Cell
            {...cellProps}
            ref={
              fixedInfo.side &&
              cellFixedKey &&
              !showHeader &&
              index === (current - 1) * pageSize
                ? getHeaderCellRef(cellFixedKey)
                : undefined
            }
            key={`${column.key ?? column.dataIndex ?? columnIndex}`}
            className={[
              "ant-table-cell",
              column.ellipsis && "ant-table-cell-ellipsis",
              ...fixedCellClassName(fixedInfo),
              sortedColumn && "ant-table-column-sort",
              column.className,
              cellProps.className,
            ]}
            colSpan={column.colSpan ?? cellProps.colSpan}
            rowSpan={column.rowSpan ?? cellProps.rowSpan}
            scope={column.rowScope ?? cellProps.scope}
            title={
              cellProps.title ??
              (column.ellipsis &&
              (typeof content === "string" || typeof content === "number") &&
              (typeof column.ellipsis === "boolean" ||
                column.ellipsis.showTitle !== false)
                ? String(content)
                : undefined)
            }
            style={cellStyle}
          >
            {columnIndex === 0 && !showExpandColumn && depth > 0 ? (
              <span
                className="ant-table-tree-indent"
                style={{ width: depth * (expandedConfig.indentSize ?? 15) }}
              />
            ) : null}
            {columnIndex === 0 && !showExpandColumn && hasExpandFeature
              ? expandedIcon(record, index, canExpandRow, expanded)
              : null}
            {content}
          </Cell>,
        );
      });
      const clickHandler = (event: MouseEvent) => {
        rowProps.onClick?.(
          event as Parameters<NonNullable<typeof rowProps.onClick>>[0],
        );
        if (
          !event.defaultPrevented &&
          expandedConfig.expandRowByClick &&
          canExpandRow
        ) {
          toggleExpanded(record, index, event);
        }
      };
      const rowNode = (
        <BodyRow
          {...rowProps}
          ref={virtualRowsEnabled ? virtualMetrics.getRowRef(key) : undefined}
          key={String(key)}
          className={[
            "ant-table-row",
            selected && "ant-table-row-selected",
            customRowClassName,
            rowProps.className,
          ]}
          style={rowProps.style}
          onClick={
            expandedConfig.expandRowByClick && canExpandRow
              ? clickHandler
              : rowProps.onClick
          }
          data-row-key={key}
        >
          {cells}
        </BodyRow>
      );
      const extraNode =
        expanded && extraRowRender ? (
          <BodyRow
            className={["ant-table-expanded-row", expandedRowClassName]}
            key={`${String(key)}-expanded`}
          >
            <BodyCell
              className="ant-table-cell"
              colSpan={Math.max(
                1,
                leafColumns.length +
                  Number(Boolean(rowSelection)) +
                  Number(showExpandColumn),
              )}
            >
              {expandedRender(record, index, depth, expanded)}
            </BodyCell>
          </BodyRow>
        ) : null;
      const nestedNodes =
        expanded && nested.length ? renderRows(nested, depth + 1) : [];
      return [rowNode, ...(extraNode ? [extraNode] : []), ...nestedNodes];
    });
  };
  const visibleBodyRows = renderRows(pageData);
  const bodyRows = virtualRowsEnabled
    ? [
        ...(virtualStart > 0
          ? [
              <BodyRow
                className="ant-table-virtual-spacer"
                key="virtual-spacer-top"
              >
                <BodyCell
                  colSpan={Math.max(
                    1,
                    leafColumns.length +
                      Number(Boolean(rowSelection)) +
                      Number(showExpandColumn),
                  )}
                  style={{ height: virtualMetrics.offsetAt(virtualStart) }}
                />
              </BodyRow>,
            ]
          : []),
        ...visibleBodyRows,
        ...(virtualEnd < pageData.length
          ? [
              <BodyRow
                className="ant-table-virtual-spacer"
                key="virtual-spacer-bottom"
              >
                <BodyCell
                  colSpan={Math.max(
                    1,
                    leafColumns.length +
                      Number(Boolean(rowSelection)) +
                      Number(showExpandColumn),
                  )}
                  style={{
                    height:
                      virtualMetrics.totalHeight -
                      virtualMetrics.offsetAt(virtualEnd),
                  }}
                />
              </BodyRow>,
            ]
          : []),
      ]
    : visibleBodyRows;
  for (const cachedKey of cellRenderCache.current.keys()) {
    if (!activeCellRenderKeys.has(cachedKey))
      cellRenderCache.current.delete(cachedKey);
  }
  const hasData = pageData.length > 0;
  const emptyText =
    typeof mergedLocale.emptyText === "function"
      ? mergedLocale.emptyText()
      : (mergedLocale.emptyText ??
        config.renderEmpty?.("Table") ?? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ));
  const spinProps: SpinProps =
    typeof loading === "object"
      ? { spinning: true, ...loading }
      : { spinning: loading };
  const tableTitle = typeof title === "function" ? title(pageData) : title;
  const tableFooter = typeof footer === "function" ? footer(pageData) : footer;
  const summaryContent = summary?.(pageData);
  const summaryIsText =
    typeof summaryContent === "string" ||
    typeof summaryContent === "number" ||
    typeof summaryContent === "bigint";
  const summaryFixedPosition =
    isValidElement<TableSummaryProps>(summaryContent) &&
    summaryContent.type === TableSummary
      ? summaryContent.props.fixed
      : undefined;
  const fixedVirtualSummary =
    virtualRowsEnabled && Boolean(summaryFixedPosition);
  const hasSummary = summary !== undefined && summaryContent !== undefined;
  const summaryNode = hasSummary ? (
    summaryIsText ? (
      <tfoot className="ant-table-summary">
        <BodyRow className="ant-table-summary-row">
          <BodyCell
            className="ant-table-cell ant-table-summary"
            colSpan={Math.max(
              1,
              leafColumns.length +
                Number(Boolean(rowSelection)) +
                Number(showExpandColumn),
            )}
          >
            {summaryContent}
          </BodyCell>
        </BodyRow>
      </tfoot>
    ) : (
      summaryContent
    )
  ) : null;
  const paginationPositions = paginationOptions?.position ?? ["bottomRight"];
  const topPosition = paginationPositions.find((position) =>
    position.startsWith("top"),
  );
  const bottomPosition = paginationPositions.find((position) =>
    position.startsWith("bottom"),
  );
  const showPaginationTop =
    paginationEnabled && total > 0 && Boolean(topPosition);
  const showPaginationBottom =
    paginationEnabled && total > 0 && Boolean(bottomPosition);
  const paginationNode = (position: string | undefined) => {
    if (!position || !paginationOptions) return null;
    const {
      position: _position,
      onChange: _onChange,
      onShowSizeChange: _onShowSizeChange,
      ...options
    } = paginationOptions;
    return (
      <div
        className={`ant-table-pagination ant-table-pagination-${position.endsWith("Left") ? "left" : position.endsWith("Center") ? "center" : "right"}`}
      >
        <Pagination
          {...options}
          total={total}
          current={current}
          pageSize={pageSize}
          size={
            mergedSize === "small" || mergedSize === "middle"
              ? "small"
              : options.size
          }
          onChange={(nextPage, nextSize) => {
            paginationOptions.onChange?.(nextPage, nextSize);
            dispatchChange("paginate", { page: nextPage, pageSize: nextSize });
          }}
          onShowSizeChange={(nextPage, nextSize) =>
            paginationOptions.onShowSizeChange?.(nextPage, nextSize)
          }
        />
      </div>
    );
  };

  const stickyConfig: TableStickyConfig =
    typeof sticky === "object" ? sticky : {};
  const scrollStyle: CSSProperties & Record<`--${string}`, string | number> = {
    overflowX: scroll?.x || hasFixedLeft || hasFixedRight ? "auto" : undefined,
    overflowY: scroll?.y ? "auto" : undefined,
    height: virtualRowsEnabled ? cssSize(scroll?.y) : undefined,
    maxHeight: virtualRowsEnabled
      ? undefined
      : typeof scroll?.y === "number"
        ? `${scroll.y}px`
        : scroll?.y,
    "--ao-table-sticky-offset": `${stickyConfig.offsetHeader ?? 0}px`,
    "--ao-table-summary-offset": `${stickyConfig.offsetSummary ?? 0}px`,
  };
  const minWidth =
    typeof scroll?.x === "number"
      ? `${scroll.x}px`
      : scroll?.x === true
        ? "max-content"
        : scroll?.x || undefined;
  const tableSizingStyle: CSSProperties = {
    tableLayout: mergedTableLayout,
    minWidth,
  };
  const virtualHeaderHolder = splitVirtualHeader ? (
    <div ref={headerScrollRef} className="ant-table-header">
      <TableElement style={tableSizingStyle}>{headerNode}</TableElement>
    </div>
  ) : null;
  const virtualSummaryHolder = fixedVirtualSummary ? (
    <div ref={summaryScrollRef} className="ant-table-summary-holder">
      <TableElement style={tableSizingStyle}>{summaryNode}</TableElement>
    </div>
  ) : null;
  const updateScrollEdges = (element: HTMLDivElement | null) => {
    if (!element) return;
    const next = {
      left: element.scrollLeft > 0.5,
      right: element.scrollLeft + element.clientWidth < element.scrollWidth - 1,
    };
    setScrollEdges((current) =>
      current.left === next.left && current.right === next.right
        ? current
        : next,
    );
  };
  useEffect(() => {
    updateScrollEdges(contentRef.current);
  }, [scroll?.x, measuredWidths]);

  return (
    <div
      {...rest}
      ref={rootRef}
      className={[
        "ant-table-wrapper",
        tablePrefixCls !== "ant-table" && `${tablePrefixCls}-wrapper`,
        `ant-table-wrapper-${mergedSize}`,
        bordered && "ant-table-wrapper-bordered",
        tableConfig?.className,
        className,
        rootClassName,
      ]}
      style={
        {
          fontSize: cssSize(cellFontSize),
          lineHeight: t.lineHeight,
          "--ao-table-font": t.fontFamily,
          "--ao-table-text": t.colorText,
          "--ao-table-muted": t.colorTextDescription,
          "--ao-table-font-size": cssSize(cellFontSize),
          "--ao-table-icon-size": cssSize(t.fontSizeIcon),
          "--ao-table-line": t.lineHeight,
          "--ao-table-bg": t.colorBgContainer,
          "--ao-table-border": c?.borderColor ?? t.colorBorderSecondary,
          "--ao-table-header-bg":
            c?.headerBg ??
            new FastColor(t.colorFillAlter)
              .onBackground(t.colorBgContainer)
              .toHexString(),
          "--ao-table-hover-bg":
            c?.rowHoverBg ??
            new FastColor(t.colorFillAlter)
              .onBackground(t.colorBgContainer)
              .toHexString(),
          "--ao-table-row-selected-bg":
            c?.rowSelectedBg ?? t.controlItemBgActive,
          "--ao-table-row-selected-hover-bg":
            c?.rowSelectedHoverBg ?? t.controlItemBgActiveHover,
          "--ao-table-row-expanded-bg": c?.rowExpandedBg ?? t.colorFillAlter,
          "--ao-table-body-sort-bg":
            c?.bodySortBg ??
            new FastColor(t.colorFillAlter)
              .onBackground(t.colorBgContainer)
              .toHexString(),
          "--ao-table-sort-active-bg":
            c?.headerSortActiveBg ??
            new FastColor(t.colorFillSecondary)
              .onBackground(t.colorBgContainer)
              .toHexString(),
          "--ao-table-sort-hover-bg":
            c?.headerSortHoverBg ??
            new FastColor(t.colorFillContent)
              .onBackground(t.colorBgContainer)
              .toHexString(),
          "--ao-table-fixed-sort-active-bg":
            c?.fixedHeaderSortActiveBg ??
            new FastColor(t.colorFillSecondary)
              .onBackground(t.colorBgContainer)
              .toHexString(),
          "--ao-table-footer-bg":
            c?.footerBg ??
            new FastColor(t.colorFillAlter)
              .onBackground(t.colorBgContainer)
              .toHexString(),
          "--ao-table-footer-color": c?.footerColor ?? t.colorTextHeading,
          "--ao-table-header-color": c?.headerColor ?? t.colorTextHeading,
          "--ao-table-header-split":
            c?.headerSplitColor ?? t.colorBorderSecondary,
          "--ao-table-scroll-thumb":
            c?.stickyScrollBarBg ?? t.colorTextPlaceholder,
          "--ao-table-scroll-bg": t.colorSplit,
          "--ao-table-fixed-shadow": t.colorSplit,
          "--ao-table-filter-shadow": t.boxShadowSecondary,
          "--ao-table-filter-radius": `${t.borderRadius}px`,
          "--ao-table-filter-trigger-padding": `${t.paddingXXS}px`,
          "--ao-table-filter-icon-size": `${t.fontSizeSM}px`,
          "--ao-table-filter-hover-bg":
            c?.headerFilterHoverBg ?? t.colorFillContent,
          "--ao-table-filter-menu-bg":
            c?.filterDropdownMenuBg ?? t.colorBgContainer,
          "--ao-table-filter-dropdown-bg":
            c?.filterDropdownBg ?? t.colorBgContainer,
          "--ao-table-icon": t.colorIcon,
          "--ao-table-icon-hover": t.colorIconHover,
          "--ao-table-radius": cssSize(
            c?.headerBorderRadius ?? t.borderRadiusLG,
          ),
          "--ao-table-header-radius": cssSize(
            c?.headerBorderRadius ?? t.borderRadiusLG,
          ),
          "--ao-table-line-width": `${t.lineWidth}px`,
          "--ao-table-line-type": t.lineType,
          "--ao-table-selection-column-width": cssSize(
            c?.selectionColumnWidth ?? t.controlHeight,
          ),
          "--ao-table-expand-icon-bg": c?.expandIconBg ?? t.colorBgContainer,
          "--ao-table-sticky-scroll-radius": cssSize(
            c?.stickyScrollBarBorderRadius ?? 100,
          ),
          "--ao-table-pagination-margin": `${t.margin}px`,
          "--ao-table-primary": t.colorPrimary,
          "--ao-table-focus": t.colorPrimaryBorder,
          "--ao-table-padding-block": cssSize(
            mergedSize === "small"
              ? (c?.cellPaddingBlockSM ?? t.paddingXS)
              : mergedSize === "middle"
                ? (c?.cellPaddingBlockMD ?? t.paddingSM)
                : (c?.cellPaddingBlock ?? t.padding),
          ),
          "--ao-table-padding-inline": cssSize(
            mergedSize === "small"
              ? (c?.cellPaddingInlineSM ?? t.paddingXS)
              : mergedSize === "middle"
                ? (c?.cellPaddingInlineMD ?? t.paddingXS)
                : (c?.cellPaddingInline ?? t.padding),
          ),
          "--ao-table-control-height": `${t.controlHeight}px`,
          "--ao-table-empty-height": `${t.controlHeightLG * 2.5}px`,
          direction: config.direction,
          ...tableConfig?.style,
          ...style,
        } as CSSProperties
      }
    >
      {tableTitle !== undefined && (
        <div className="ant-table-title">{tableTitle}</div>
      )}
      <Spin {...spinProps}>
        {paginationNode(showPaginationTop ? topPosition : undefined)}
        <div
          ref={tableRef}
          className={[
            "ant-table",
            stickyHeader && "ant-table-sticky-header",
            virtualRowsEnabled && "ant-table-virtual",
            bordered && "ant-table-bordered",
            mergedSize !== "large" && `ant-table-${mergedSize}`,
            !hasData && "ant-table-empty",
            !rowHoverable && "ant-table-row-hover-disabled",
            hasFixedLeft && "ant-table-has-fix-left",
            hasFixedRight && "ant-table-has-fix-right",
            scrollEdges.left && "ant-table-ping-left",
            scrollEdges.right && "ant-table-ping-right",
          ]}
        >
          <div className="ant-table-container">
            <TableSummaryContext
              value={{
                row: components?.body?.row,
                cell: components?.body?.cell,
                cellPropsForIndex: (index) => {
                  if (index === undefined || index < 0) return {};
                  const fixedInfo = fixedCellInfo(specialColumnCount + index);
                  return {
                    className: fixedCellClassName(fixedInfo),
                    style: fixedCellStyle(fixedInfo),
                  };
                },
              }}
            >
              {virtualHeaderHolder}
              {summaryFixedPosition === "top" && virtualSummaryHolder}
              <div
                ref={contentRef}
                id={`${tableId}-content`}
                className="ant-table-content"
                style={scrollStyle}
                onScroll={(event) => {
                  updateScrollEdges(event.currentTarget);
                  if (splitVirtualHeader && headerScrollRef.current) {
                    headerScrollRef.current.scrollLeft =
                      event.currentTarget.scrollLeft;
                  }
                  if (fixedVirtualSummary && summaryScrollRef.current) {
                    summaryScrollRef.current.scrollLeft =
                      event.currentTarget.scrollLeft;
                  }
                  if (virtualRowsEnabled)
                    setVirtualScrollTop(event.currentTarget.scrollTop);
                  onScroll?.(event);
                }}
              >
                <TableElement
                  style={{ tableLayout: mergedTableLayout, minWidth }}
                >
                  {!splitVirtualHeader && headerNode}
                  <BodyWrapper className="ant-table-tbody">
                    {hasData ? (
                      bodyRows
                    ) : (
                      <BodyRow>
                        <BodyCell
                          className="ant-table-cell ant-table-placeholder"
                          colSpan={Math.max(
                            1,
                            leafColumns.length +
                              Number(Boolean(rowSelection)) +
                              Number(showExpandColumn),
                          )}
                        >
                          {emptyText}
                        </BodyCell>
                      </BodyRow>
                    )}
                  </BodyWrapper>
                  {hasSummary && !fixedVirtualSummary && summaryNode}
                </TableElement>
              </div>
              {summaryFixedPosition === "bottom" && virtualSummaryHolder}
            </TableSummaryContext>
            {sticky && (
              <StickyScrollBar
                rootRef={tableRef}
                contentRef={contentRef}
                contentId={`${tableId}-content`}
                getContainer={stickyConfig.getContainer}
                offsetScroll={stickyConfig.offsetScroll}
                direction={config.direction}
              />
            )}
          </div>
        </div>
        {paginationNode(showPaginationBottom ? bottomPosition : undefined)}
      </Spin>
      {tableFooter !== undefined && (
        <div className="ant-table-footer">{tableFooter}</div>
      )}
    </div>
  );
}

function countLeafColumns<T extends object>(columns: ColumnsType<T>): number {
  return columns.reduce(
    (count, column) =>
      count + (isGroup(column) ? countLeafColumns(column.children) : 1),
    0,
  );
}

export const SELECTION_ALL = "SELECT_ALL" as const;
export const SELECTION_INVERT = "SELECT_INVERT" as const;
export const SELECTION_NONE = "SELECT_NONE" as const;

const Summary = Object.assign(TableSummary, {
  Row: TableSummaryRow,
  Cell: TableSummaryCell,
});

export const Table = Object.assign(InternalTable, {
  Column,
  ColumnGroup,
  Summary,
  SELECTION_ALL,
  SELECTION_INVERT,
  SELECTION_NONE,
});
