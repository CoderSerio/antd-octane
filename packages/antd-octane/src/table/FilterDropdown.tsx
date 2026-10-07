/** @jsxImportSource octane */
import type { OctaneNode } from "octane";
import { useRef, useState } from "octane";
import { useComponentTokens } from "../_util/tokens";
import { Button } from "../button";
import { Checkbox } from "../checkbox";
import { useConfig } from "../config-provider";
import type { PopupContainer } from "../config-provider/context";
import { Empty } from "../empty";
import { Input } from "../input";
import { Popover } from "../popover";
import type { Key, TreeDataNode, TreeNodeAttribute } from "../tree";
import { Tree } from "../tree";
import { FilterMenu } from "./FilterMenu";
import type {
  ColumnFilterItem,
  FilterSearch,
  FilterValue,
  TableFilterDropdownProps,
  TableLocale,
  TreeColumnFilterItem,
} from "./types";
import useFilterDropdownAccessibility from "./useFilterDropdownAccessibility";

/**
 * FilterFilled and SearchOutlined geometry: @ant-design/icons-svg 4.6.0,
 * MIT © 2015-present Ant UED.
 *
 * Native Octane rendering for the table filter trigger and panel. The public
 * callback shape follows Ant Design 5's FilterDropdown contract; its overlay
 * is rendered by Octane Popover so the table does not depend on React/rc-menu.
 */
export interface FilterDropdownViewProps {
  columnKey: string;
  filters: ColumnFilterItem[];
  draftKeys: FilterValue;
  filterMultiple?: boolean;
  filterMode?: "menu" | "tree";
  filterSearch?: FilterSearch;
  filtered: boolean;
  resetDisabled: boolean;
  filterIcon?: OctaneNode;
  customContent?: OctaneNode;
  hasCustomContent?: boolean;
  locale: TableLocale;
  popupProps?: TableFilterDropdownProps;
  getPopupContainer?: (trigger: HTMLElement) => PopupContainer;
  onDraftChange: (keys: FilterValue) => void;
  onConfirm: (options?: { closeDropdown?: boolean }) => void;
  onReset: (options?: { confirm?: boolean; closeDropdown?: boolean }) => void;
  onVisibleChange: (open: boolean, event?: Event) => void;
}

const hasKey = (keys: FilterValue, value: ColumnFilterItem["value"]) =>
  keys.some((key) => String(key) === String(value));

function flattenFilterItems(items: ColumnFilterItem[]): ColumnFilterItem[] {
  return items.flatMap((item) => [
    item,
    ...(item.children ?? []).flatMap((child) => flattenFilterItems([child])),
  ]);
}

interface FilterTreeItem extends TreeDataNode {
  key: string;
  title: OctaneNode;
  text: OctaneNode;
  value: ColumnFilterItem["value"];
  filterKey: string;
  children?: FilterTreeItem[];
}

function createFilterTree(
  items: ColumnFilterItem[],
  keyToValue: Map<Key, ColumnFilterItem["value"]>,
): FilterTreeItem[] {
  return items.map((item, index) => {
    const key = item.value === undefined ? String(index) : String(item.value);
    keyToValue.set(key, item.value);
    return {
      key,
      filterKey: String(item.value),
      title: item.text,
      text: item.text,
      value: item.value,
      children: item.children?.length
        ? createFilterTree(item.children, keyToValue)
        : undefined,
    };
  });
}

function flattenTreeItems(items: FilterTreeItem[]): FilterTreeItem[] {
  return items.flatMap((item) => [
    item,
    ...(item.children ? flattenTreeItems(item.children) : []),
  ]);
}

function toTreeSearchItem(item: FilterTreeItem): TreeColumnFilterItem {
  return {
    key: item.filterKey,
    title: item.title,
    text: item.text,
    value: item.filterKey,
    children: (item.children ?? []).map(toTreeSearchItem),
  };
}

function matchesTreeSearch(
  query: string,
  item: FilterTreeItem,
  filterSearch: FilterDropdownViewProps["filterSearch"],
) {
  if (typeof filterSearch === "function")
    return filterSearch(query, toTreeSearchItem(item));
  const title = item.title;
  return (
    (typeof title === "string" || typeof title === "number") &&
    String(title).toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())
  );
}

function mapTreeKeysToValues(
  keys: Key[],
  keyToValue: Map<Key, ColumnFilterItem["value"]>,
): FilterValue {
  const values: FilterValue = [];
  for (const key of keys) {
    const value = keyToValue.get(key);
    const filterKey = value === undefined ? undefined : String(value);
    if (filterKey !== undefined && !hasKey(values, filterKey))
      values.push(filterKey);
  }
  return values;
}

export function FilterDropdownView({
  columnKey,
  filters,
  draftKeys,
  filterMultiple = true,
  filterMode = "menu",
  filterSearch,
  filtered,
  resetDisabled,
  filterIcon,
  customContent,
  hasCustomContent = false,
  locale,
  popupProps,
  getPopupContainer,
  onDraftChange,
  onConfirm,
  onReset,
  onVisibleChange,
}: FilterDropdownViewProps) {
  const { token, component } = useComponentTokens("Table");
  const config = useConfig();
  const [search, setSearch] = useState("");
  const trigger = useRef<HTMLButtonElement | null>(null);
  const overlay = useRef<HTMLDivElement | null>(null);
  const { autoFocus = false, ...popoverProps } = popupProps ?? {};
  useFilterDropdownAccessibility(
    popupProps?.open ?? false,
    autoFocus,
    trigger,
    overlay,
    () => {
      setSearch("");
      onVisibleChange(false);
    },
  );
  const flatItems = flattenFilterItems(filters);
  const keyToValue = new Map<Key, ColumnFilterItem["value"]>();
  const treeItems = createFilterTree(filters, keyToValue);
  const flatTreeItems = flattenTreeItems(treeItems);
  const selectedTreeKeys = flatTreeItems
    .filter((item) => hasKey(draftKeys, item.value))
    .map((item) => item.key);
  const allSelected =
    flatItems.length > 0 &&
    flatItems.every((item) => hasKey(draftKeys, item.value));
  const someSelected = flatItems.some((item) => hasKey(draftKeys, item.value));
  const emptyFilterContent = config.renderEmpty?.("Table.filter") ?? (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={locale.filterEmptyText}
      styles={{ image: { height: 24 } }}
      style={{ margin: 0, padding: "16px 0" }}
    />
  );

  const renderSearchInput = () =>
    filterSearch ? (
      <div className="ant-table-filter-dropdown-search">
        <Input
          aria-label={locale.filterSearchPlaceholder ?? "Search filters"}
          className="ant-table-filter-dropdown-search-input"
          htmlSize={1}
          placeholder={locale.filterSearchPlaceholder ?? "Search filters"}
          prefix={
            <svg
              viewBox="64 64 896 896"
              width="1em"
              height="1em"
              fill="currentColor"
              aria-hidden="true"
              style={{ color: token.colorTextDisabled }}
            >
              <path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0011.6 0l43.6-43.5a8.2 8.2 0 000-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z" />
            </svg>
          }
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>
    ) : null;

  const treeContent = (
    <div className="ant-table-filter-dropdown-tree">
      {filterMultiple && (
        <Checkbox
          skipGroup
          className="ant-table-filter-dropdown-checkall"
          checked={allSelected}
          indeterminate={someSelected && !allSelected}
          onChange={(event) =>
            onDraftChange(
              event.target.checked
                ? flatItems.map((item) => String(item.value))
                : [],
            )
          }
        >
          {locale.filterCheckAll ?? "Select all"}
        </Checkbox>
      )}
      <Tree
        checkable
        selectable={false}
        blockNode
        multiple={filterMultiple}
        checkStrictly={!filterMultiple}
        className="ant-dropdown-menu ant-table-filter-menu"
        checkedKeys={selectedTreeKeys}
        selectedKeys={selectedTreeKeys}
        showIcon={false}
        treeData={treeItems}
        autoExpandParent
        defaultExpandAll
        filterTreeNode={
          search.trim()
            ? (node: TreeNodeAttribute<FilterTreeItem>) =>
                matchesTreeSearch(search, node.data, filterSearch)
            : undefined
        }
        onCheck={(checkedKeys, info) => {
          if (!filterMultiple) {
            const value = info.checked
              ? keyToValue.get(info.node.key)
              : undefined;
            onDraftChange(value === undefined ? [] : [String(value)]);
            return;
          }

          const keys = Array.isArray(checkedKeys)
            ? checkedKeys
            : checkedKeys.checked;
          onDraftChange(mapTreeKeysToValues(keys, keyToValue));
        }}
      />
    </div>
  );

  const filterPanelStyle = {
    fontFamily: token.fontFamily,
    fontSize: `${token.fontSize}px`,
    lineHeight: token.lineHeight,
    "--ao-table-text": token.colorText,
    "--ao-table-muted": token.colorTextDescription,
    "--ao-table-bg": token.colorBgContainer,
    "--ao-table-primary": token.colorPrimary,
    "--ao-table-focus": token.colorPrimaryBorder,
    "--ao-table-filter-focus-width": `${token.lineWidthFocus}px`,
    "--ao-table-border": component?.borderColor ?? token.colorBorderSecondary,
    "--ao-table-line-width": `${token.lineWidth}px`,
    "--ao-table-line-type": token.lineType,
    "--ao-table-filter-dropdown-bg":
      component?.filterDropdownBg ?? token.colorBgContainer,
    "--ao-table-filter-menu-bg":
      component?.filterDropdownMenuBg ?? token.colorBgContainer,
    "--ao-table-filter-shadow": token.boxShadowSecondary,
    "--ao-table-filter-radius": `${token.borderRadius}px`,
    "--ao-table-filter-hover-bg": token.controlItemBgHover,
    "--ao-table-filter-active-bg": token.controlItemBgActive,
    "--ao-table-filter-active-hover-bg": token.controlItemBgActiveHover,
    "--ao-table-filter-padding": `${token.paddingXS}px`,
    "--ao-table-filter-checkall-margin": `${token.paddingXXS}px`,
    "--ao-table-filter-menu-font-size": `${token.fontSize}px`,
    "--ao-table-filter-menu-line-height": token.lineHeight,
    "--ao-table-filter-menu-padding-block": `${(token.controlHeight - token.fontSize * token.lineHeight) / 2}px`,
    "--ao-table-filter-menu-padding-inline": `${token.controlPaddingHorizontal}px`,
    "--ao-table-filter-menu-submenu-padding-inline-end": `${token.controlPaddingHorizontal + token.fontSizeSM}px`,
    "--ao-table-filter-menu-root-padding": `${token.paddingXXS}px`,
    "--ao-table-filter-menu-item-radius": `${token.borderRadiusSM}px`,
    "--ao-table-filter-menu-arrow-size": `${token.fontSizeSM}px`,
    "--ao-table-filter-menu-arrow-color": token.colorIcon,
  };
  const submenuStyle = {
    ...filterPanelStyle,
    "--ao-table-filter-dropdown-bg": token.colorBgElevated,
    "--ao-table-filter-menu-bg": token.colorBgElevated,
    "--ao-table-filter-radius": `${token.borderRadiusLG}px`,
  };

  const builtInContent = (
    <>
      {filters.length === 0 ? (
        emptyFilterContent
      ) : (
        <>
          {renderSearchInput()}
          {filterMode === "tree" ? (
            treeContent
          ) : (
            <FilterMenu
              filters={filters}
              selectedKeys={draftKeys.map(String)}
              filterMultiple={filterMultiple}
              filterSearch={filterSearch}
              search={search}
              direction={config.direction}
              getPopupContainer={getPopupContainer}
              submenuZIndex={token.zIndexPopupBase + 31}
              submenuStyle={submenuStyle}
              panelOpen={popupProps?.open ?? true}
              emptyContent={emptyFilterContent}
              onChange={onDraftChange}
            />
          )}
        </>
      )}
      <div className="ant-table-filter-dropdown-btns ant-table-filter-actions">
        <Button
          type="link"
          size="small"
          disabled={resetDisabled}
          onClick={() => {
            setSearch("");
            onReset({ confirm: false, closeDropdown: false });
          }}
        >
          {locale.filterReset ?? "Reset"}
        </Button>
        <Button
          type="primary"
          size="small"
          onClick={() => {
            setSearch("");
            onConfirm({ closeDropdown: true });
          }}
        >
          {locale.filterConfirm ?? "OK"}
        </Button>
      </div>
    </>
  );

  const handleVisibleChange = (open: boolean, event?: Event) => {
    // Dropdown's window listener owns Escape, including portaled submenus.
    // Avoid also closing through Popover's document listener for the same key.
    if (event?.type === "keydown") return;
    if (!open) setSearch("");
    onVisibleChange(open, event);
  };

  return (
    <Popover
      {...popoverProps}
      prefixCls="ant-table-filter-popup"
      trigger={popupProps?.trigger ?? "click"}
      placement={
        popupProps?.placement ??
        (config.direction === "rtl" ? "bottomLeft" : "bottomRight")
      }
      arrow={popupProps?.arrow ?? false}
      // Dropdown uses the visible viewport, whereas Tooltip defaults to
      // visibleFirst (components/dropdown/dropdown.tsx).
      align={{ htmlRegion: "visible", ...popupProps?.align }}
      getPopupContainer={popupProps?.getPopupContainer ?? getPopupContainer}
      onOpenChange={handleVisibleChange}
      content={
        // biome-ignore lint/a11y/noStaticElementInteractions: match FilterWrapper's event boundary around interactive filter controls.
        <div
          ref={overlay}
          className="ant-table-filter-dropdown"
          style={filterPanelStyle}
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => {
            if (event.key === "Enter") event.stopPropagation();
          }}
        >
          {hasCustomContent ? customContent : builtInContent}
        </div>
      }
    >
      <button
        ref={trigger}
        type="button"
        className={[
          "ant-table-filter-trigger",
          filtered && "ant-table-filter-active",
        ]}
        aria-label={locale.filterTitle ?? "Filter"}
        title={locale.filterTitle ?? "Filter"}
        data-column-key={columnKey}
        onClick={(event) => event.stopPropagation()}
      >
        {filterIcon !== undefined ? (
          filterIcon
        ) : (
          <svg
            aria-hidden="true"
            viewBox="64 64 896 896"
            width="1em"
            height="1em"
            fill="currentColor"
          >
            <path d="M349 838c0 17.7 14.2 32 31.8 32h262.4c17.6 0 31.8-14.3 31.8-32V642H349v196zm531.1-684H143.9c-24.5 0-39.8 26.7-27.5 48l221.3 376h348.8l221.3-376c12.1-21.3-3.2-48-27.7-48z" />
          </svg>
        )}
      </button>
    </Popover>
  );
}
