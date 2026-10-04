import type {
  CSSProperties,
  ElementType,
  HTMLAttributes,
  OctaneNode,
  Ref,
} from "octane";
import type { Breakpoint } from "../_util/responsive";
import type { CheckboxProps } from "../checkbox";
import type { PaginationProps } from "../pagination";
import type { PopoverProps } from "../popover";
import type { SpinProps } from "../spin";
import type { TooltipProps } from "../tooltip";

export type TableKey = string | number;
export type SortOrder = "ascend" | "descend" | null;
export type FilterValue = (TableKey | boolean)[];
export type TableAction = "paginate" | "sort" | "filter";
export type TableBreakpoint = Breakpoint;

export interface FilterDropdownActionOptions {
  closeDropdown?: boolean;
  confirm?: boolean;
}

export interface FilterDropdownProps<
  T extends object = Record<string, unknown>,
> {
  prefixCls: string;
  setSelectedKeys: (selectedKeys: FilterValue) => void;
  selectedKeys: FilterValue;
  confirm: (options?: FilterDropdownActionOptions) => void;
  clearFilters: (options?: FilterDropdownActionOptions) => void;
  filters?: ColumnFilterItem[];
  visible: boolean;
  close: () => void;
  /** Current column is available for Octane-native custom filter renderers. */
  column?: TableColumnType<T>;
}

export interface TreeColumnFilterItem extends ColumnFilterItem {
  key: string;
  title: OctaneNode;
  value: string;
  children?: TreeColumnFilterItem[];
}

export type FilterSearch =
  | boolean
  | ((input: string, item: ColumnFilterItem | TreeColumnFilterItem) => boolean);

export type TableFilterDropdownProps = Omit<
  PopoverProps,
  "children" | "content" | "title" | "prefixCls" | "onOpenChange"
> & { autoFocus?: boolean; onOpenChange?: (open: boolean) => void };

export type SorterTooltipProps = Omit<TooltipProps, "children"> & {
  target?: "full-header" | "sorter-icon";
};

export type ShowSorterTooltip = boolean | SorterTooltipProps;

export interface ColumnFilterItem {
  text: OctaneNode;
  value: TableKey | boolean;
  children?: ColumnFilterItem[];
}

export interface ColumnTitleProps<T extends object = Record<string, unknown>> {
  sortOrder?: SortOrder;
  sortColumn?: TableColumnType<T>;
  sortColumns?: { column: TableColumnType<T>; order: SortOrder }[];
  filters?: Record<string, FilterValue>;
}

export type ColumnTitle<T extends object = Record<string, unknown>> =
  | OctaneNode
  | ((props: ColumnTitleProps<T>) => OctaneNode);

export type CompareFn<T extends object = Record<string, unknown>> = (
  a: T,
  b: T,
  sortOrder?: SortOrder,
) => number;

export interface TableColumnType<T extends object = Record<string, unknown>> {
  key?: TableKey;
  dataIndex?: string | number | readonly (string | number)[];
  title?: ColumnTitle<T>;
  render?: (value: unknown, record: T, index: number) => OctaneNode;
  sorter?:
    | boolean
    | CompareFn<T>
    | { compare?: CompareFn<T>; multiple?: number };
  sortOrder?: SortOrder;
  defaultSortOrder?: SortOrder;
  sortDirections?: SortOrder[];
  sortIcon?: (props: { sortOrder: SortOrder }) => OctaneNode;
  showSorterTooltip?: ShowSorterTooltip;
  ellipsis?: boolean | { showTitle?: boolean };
  shouldCellUpdate?: (record: T, previousRecord: T) => boolean;
  filters?: ColumnFilterItem[];
  filtered?: boolean;
  filteredValue?: FilterValue | null;
  defaultFilteredValue?: FilterValue | null;
  filterMultiple?: boolean;
  filterDropdown?: OctaneNode | ((props: FilterDropdownProps<T>) => OctaneNode);
  filterIcon?: OctaneNode | ((filtered: boolean) => OctaneNode);
  filterMode?: "menu" | "tree";
  filterSearch?: FilterSearch;
  filterOnClose?: boolean;
  filterDropdownProps?: TableFilterDropdownProps;
  filterResetToDefaultFilteredValue?: boolean;
  /** @deprecated Use filterDropdownProps.open. */
  filterDropdownOpen?: boolean;
  /** @deprecated Use filterDropdownProps.open. */
  filterDropdownVisible?: boolean;
  /** @deprecated Use filterDropdownProps.onOpenChange. */
  onFilterDropdownOpenChange?: (open: boolean) => void;
  /** @deprecated Use filterDropdownProps.onOpenChange. */
  onFilterDropdownVisibleChange?: (visible: boolean) => void;
  onFilter?: (value: TableKey | boolean, record: T) => boolean;
  width?: number | string;
  minWidth?: number;
  hidden?: boolean;
  fixed?: boolean | "left" | "right";
  align?: "left" | "center" | "right";
  style?: CSSProperties;
  className?: string;
  colSpan?: number;
  rowSpan?: number;
  rowScope?: "row" | "rowgroup";
  onCell?: (record: T, index: number) => TableCellProps;
  onHeaderCell?: (
    column: TableColumnType<T> | TableColumnGroupType<T>,
  ) => TableCellProps;
  responsive?: TableBreakpoint[];
}

export interface TableColumnGroupType<
  T extends object = Record<string, unknown>,
> extends Omit<TableColumnType<T>, "dataIndex"> {
  children: ColumnsType<T>;
}

export type ColumnsType<T extends object = Record<string, unknown>> = (
  | TableColumnType<T>
  | TableColumnGroupType<T>
)[];

export type TableColumnProps<T extends object = Record<string, unknown>> =
  TableColumnType<T> & { children?: OctaneNode };

export type TableColumnGroupProps<T extends object = Record<string, unknown>> =
  Omit<TableColumnGroupType<T>, "children"> & { children?: OctaneNode };

export interface TableCellProps extends HTMLAttributes<HTMLTableCellElement> {
  colSpan?: number;
  rowSpan?: number;
  scope?: "row" | "rowgroup" | "col" | "colgroup";
}

export interface SorterResult<T extends object = Record<string, unknown>> {
  column?: TableColumnType<T>;
  order?: SortOrder;
  field?: string | number | readonly (string | number)[];
  columnKey?: TableKey;
}

export interface TableCurrentDataSource<
  T extends object = Record<string, unknown>,
> {
  currentDataSource: T[];
  action: TableAction;
}

export interface TablePaginationConfig
  extends Omit<PaginationProps, "onChange" | "onShowSizeChange"> {
  position?: (
    | "topLeft"
    | "topCenter"
    | "topRight"
    | "bottomLeft"
    | "bottomCenter"
    | "bottomRight"
    | "none"
  )[];
  onChange?: (page: number, pageSize: number) => void;
  onShowSizeChange?: (current: number, size: number) => void;
}

export type RowSelectMethod = "all" | "none" | "invert" | "single" | "multiple";

export interface TableSelectionItem {
  key: string;
  text: OctaneNode;
  onSelect: (changeableRowKeys: TableKey[]) => void;
}

export type TableSelectionPreset =
  | "SELECT_ALL"
  | "SELECT_INVERT"
  | "SELECT_NONE";
export type TableSelectionOption = TableSelectionItem | TableSelectionPreset;

export interface TableRowSelection<T extends object = Record<string, unknown>> {
  type?: "checkbox" | "radio";
  selectedRowKeys?: TableKey[];
  defaultSelectedRowKeys?: TableKey[];
  preserveSelectedRowKeys?: boolean;
  hideSelectAll?: boolean;
  selections?: boolean | TableSelectionOption[];
  checkStrictly?: boolean;
  align?: "left" | "center" | "right";
  columnWidth?: number | string;
  fixed?: boolean | "left" | "right";
  columnTitle?: OctaneNode | ((checkboxNode: OctaneNode) => OctaneNode);
  getCheckboxProps?: (
    record: T,
  ) => Partial<Omit<ReactCheckboxProps, "checked" | "defaultChecked">>;
  getTitleCheckboxProps?: () => Partial<
    Omit<ReactCheckboxProps, "checked" | "defaultChecked" | "indeterminate">
  >;
  renderCell?: (
    checked: boolean,
    record: T,
    index: number,
    originNode: OctaneNode,
  ) => OctaneNode;
  onCell?: (record: T, index: number) => TableCellProps;
  onChange?: (
    selectedRowKeys: TableKey[],
    selectedRows: T[],
    info: { type: RowSelectMethod },
  ) => void;
  onSelect?: (
    record: T,
    selected: boolean,
    selectedRows: T[],
    nativeEvent: Event,
  ) => void;
  onSelectAll?: (selected: boolean, selectedRows: T[], changeRows: T[]) => void;
  onSelectInvert?: (selectedRowKeys: TableKey[]) => void;
  onSelectNone?: () => void;
  onSelectMultiple?: (
    selected: boolean,
    selectedRows: T[],
    changeRows: T[],
  ) => void;
}

type ReactCheckboxProps = CheckboxProps;

export interface ExpandIconProps<T extends object = Record<string, unknown>> {
  expanded: boolean;
  record: T;
  expandable: boolean;
  onExpand: (record: T, event: MouseEvent) => void;
}

export interface ExpandableConfig<T extends object = Record<string, unknown>> {
  expandedRowRender?: (
    record: T,
    index: number,
    indent: number,
    expanded: boolean,
  ) => OctaneNode;
  expandedRowClassName?:
    | string
    | ((record: T, index: number, indent: number) => string);
  defaultExpandedRowKeys?: TableKey[];
  expandedRowKeys?: TableKey[];
  defaultExpandAllRows?: boolean;
  childrenColumnName?: string;
  indentSize?: number;
  columnWidth?: number | string;
  columnTitle?: OctaneNode;
  fixed?: boolean | "left" | "right";
  expandRowByClick?: boolean;
  showExpandColumn?: boolean;
  rowExpandable?: (record: T) => boolean;
  expandIcon?: (props: ExpandIconProps<T>) => OctaneNode;
  onExpand?: (expanded: boolean, record: T) => void;
  onExpandedRowsChange?: (expandedKeys: TableKey[]) => void;
}

type TableRowProps<T extends object> = (
  record: T,
  index: number,
) => HTMLAttributes<HTMLTableRowElement>;

export interface TableLocale {
  filterTitle?: string;
  filterCheckAll?: OctaneNode;
  filterSearchPlaceholder?: string;
  filterConfirm?: OctaneNode;
  filterReset?: OctaneNode;
  filterEmptyText?: OctaneNode;
  emptyText?: OctaneNode | (() => OctaneNode);
  sortTitle?: string;
  triggerAsc?: string;
  triggerDesc?: string;
  cancelSort?: string;
  selectAll?: string;
  selectInvert?: string;
  selectNone?: string;
  selectionAll?: string;
  expand?: string;
  collapse?: string;
}

export type TableComponent = ElementType;

export interface TableComponents {
  table?: TableComponent;
  header?: {
    wrapper?: TableComponent;
    row?: TableComponent;
    cell?: TableComponent;
  };
  body?: {
    wrapper?: TableComponent;
    row?: TableComponent;
    cell?: TableComponent;
  };
}

export interface TableStickyConfig {
  offsetHeader?: number;
  offsetSummary?: number;
  offsetScroll?: number;
  getContainer?: () => Window | HTMLElement;
}

export interface TableSummaryProps {
  children?: OctaneNode;
  fixed?: boolean | "top" | "bottom";
}

export interface TableSummaryRowProps
  extends HTMLAttributes<HTMLTableRowElement> {
  children?: OctaneNode;
}

export interface TableSummaryCellProps
  extends HTMLAttributes<HTMLTableCellElement> {
  index?: number;
  align?: "left" | "center" | "right";
  colSpan?: number;
  rowSpan?: number;
  children?: OctaneNode;
}

export interface TableProps<T extends object = Record<string, unknown>>
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "children" | "onChange" | "title"
  > {
  dataSource?: T[];
  columns?: ColumnsType<T>;
  children?: OctaneNode;
  rowKey?: string | ((record: T) => TableKey);
  pagination?: false | TablePaginationConfig;
  rowSelection?: TableRowSelection<T>;
  expandable?: ExpandableConfig<T>;
  expandedRowRender?: ExpandableConfig<T>["expandedRowRender"];
  expandedRowKeys?: TableKey[];
  defaultExpandedRowKeys?: TableKey[];
  defaultExpandAllRows?: boolean;
  childrenColumnName?: string;
  expandRowByClick?: boolean;
  onExpand?: ExpandableConfig<T>["onExpand"];
  onExpandedRowsChange?: ExpandableConfig<T>["onExpandedRowsChange"];
  loading?: boolean | SpinProps;
  size?: "small" | "middle" | "large" | "default";
  bordered?: boolean;
  showHeader?: boolean;
  rowHoverable?: boolean;
  sortDirections?: SortOrder[];
  showSorterTooltip?: ShowSorterTooltip;
  tableLayout?: "auto" | "fixed";
  components?: TableComponents;
  getPopupContainer?: (trigger: HTMLElement) => HTMLElement;
  sticky?: boolean | TableStickyConfig;
  virtual?: boolean;
  onScroll?: (event: Event) => void;
  scroll?: {
    x?: boolean | number | string;
    y?: number | string;
    scrollToFirstRowOnChange?: boolean;
  };
  title?: OctaneNode | ((currentPageData: T[]) => OctaneNode);
  footer?: OctaneNode | ((currentPageData: T[]) => OctaneNode);
  summary?: (currentPageData: T[]) => OctaneNode;
  locale?: TableLocale;
  rowClassName?:
    | string
    | ((record: T, index: number, indent: number) => string);
  onRow?: TableRowProps<T>;
  onHeaderRow?: (
    columns: ColumnsType<T>,
    index: number,
  ) => HTMLAttributes<HTMLTableRowElement>;
  onChange?: (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<T> | SorterResult<T>[],
    extra: TableCurrentDataSource<T>,
  ) => void;
  rootClassName?: string;
  style?: CSSProperties;
  ref?: Ref<TableRef>;
}

export interface TableScrollConfig {
  index?: number;
  key?: TableKey;
  top?: number;
  align?: "top" | "bottom" | "auto";
  behavior?: ScrollBehavior;
}

export interface TableRef {
  nativeElement: HTMLDivElement;
  scrollTo: (config: TableScrollConfig) => void;
}
