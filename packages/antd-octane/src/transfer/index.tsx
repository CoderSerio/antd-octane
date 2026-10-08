/** @jsxImportSource octane */
import type { CSSProperties, OctaneNode } from "octane";
import { useState } from "octane";
import { useConfig } from "../config-provider";
export interface TransferItem {
  key: string;
  title?: string;
  description?: string;
  disabled?: boolean;
}
export type TransferDirection = "left" | "right";
export interface TransferProps<T extends TransferItem = TransferItem> {
  dataSource?: T[];
  targetKeys?: string[];
  selectedKeys?: string[];
  disabled?: boolean;
  showSearch?: boolean;
  showSelectAll?: boolean;
  titles?: [OctaneNode, OctaneNode];
  operations?: [OctaneNode, OctaneNode];
  render?: (item: T) => OctaneNode;
  filterOption?: (input: string, item: T) => boolean;
  onSearch?: (direction: TransferDirection, value: string) => void;
  onChange?: (
    targetKeys: string[],
    direction: TransferDirection,
    moveKeys: string[],
  ) => void;
  onSelectChange?: (
    sourceSelectedKeys: string[],
    targetSelectedKeys: string[],
  ) => void;
  className?: string;
  style?: CSSProperties;
  listStyle?: CSSProperties;
}
export function Transfer<T extends TransferItem>({
  dataSource = [],
  targetKeys = [],
  selectedKeys,
  disabled: localDisabled,
  showSearch = false,
  showSelectAll = true,
  titles = ["Source", "Target"],
  operations = ["Move right", "Move left"],
  render,
  filterOption,
  onSearch,
  onChange,
  onSelectChange,
  className,
  style,
  listStyle,
}: TransferProps<T>) {
  const config = useConfig();
  const disabled = localDisabled ?? config.componentDisabled ?? false;
  const [innerSelected, setInnerSelected] = useState<string[]>([]);
  const [queries, setQueries] = useState({ left: "", right: "" });
  const selected = selectedKeys ?? innerSelected;
  const target = new Set(targetKeys);
  const byKey = new Map(dataSource.map((item) => [item.key, item]));
  const sides = {
    left: dataSource.filter((item) => !target.has(item.key)),
    right: targetKeys.flatMap((key) => {
      const item = byKey.get(key);
      return item ? [item] : [];
    }),
  };
  const select = (keys: string[], nextTarget = target) => {
    if (selectedKeys === undefined) setInnerSelected(keys);
    onSelectChange?.(
      keys.filter((key) => !nextTarget.has(key)),
      keys.filter((key) => nextTarget.has(key)),
    );
  };
  const movable = (direction: TransferDirection) =>
    sides[direction]
      .filter((item) => !item.disabled && selected.includes(item.key))
      .map((item) => item.key);
  const move = (direction: TransferDirection) => {
    if (disabled) return;
    const keys = movable(direction === "right" ? "left" : "right");
    if (!keys.length) return;
    const moved = new Set(keys);
    const next =
      direction === "right"
        ? [...keys, ...targetKeys]
        : targetKeys.filter((key) => !moved.has(key));
    onChange?.(next, direction, keys);
    select(
      selected.filter((key) => !moved.has(key)),
      new Set(next),
    );
  };
  const panel = (direction: TransferDirection, title: OctaneNode) => {
    const query = queries[direction];
    const items = sides[direction].filter(
      (item) =>
        !query ||
        (filterOption
          ? filterOption(query, item)
          : `${item.title ?? item.key} ${item.description ?? ""}`
              .toLocaleLowerCase()
              .includes(query.toLocaleLowerCase())),
    );
    const eligible = items.filter((item) => !item.disabled);
    const all =
      eligible.length > 0 &&
      eligible.every((item) => selected.includes(item.key));
    const toggle = (keys: string[], checked: boolean) => {
      if (disabled) return;
      const changed = new Set(keys);
      select(
        checked
          ? [...new Set([...selected, ...keys])]
          : selected.filter((key) => !changed.has(key)),
      );
    };
    return (
      <section
        className="ant-transfer-list"
        aria-label={`${direction} transfer list`}
        style={listStyle}
      >
        <header>
          {showSelectAll && (
            <input
              type="checkbox"
              aria-label={`Select all ${direction}`}
              checked={all}
              disabled={disabled || !eligible.length}
              onChange={(event) =>
                toggle(
                  eligible.map((item) => item.key),
                  event.currentTarget.checked,
                )
              }
            />
          )}
          <span>{title}</span>
          <span>
            {
              sides[direction].filter((item) => selected.includes(item.key))
                .length
            }
            /{sides[direction].length}
          </span>
        </header>
        {showSearch && (
          <input
            type="search"
            className="ant-transfer-search"
            aria-label={`Search ${direction}`}
            value={query}
            disabled={disabled}
            onInput={(event) => {
              const value = event.currentTarget.value;
              setQueries((previous) => ({ ...previous, [direction]: value }));
              onSearch?.(direction, value);
            }}
          />
        )}
        <ul>
          {items.map((item) => (
            <li key={item.key}>
              <label aria-disabled={disabled || item.disabled || undefined}>
                <input
                  type="checkbox"
                  checked={selected.includes(item.key)}
                  disabled={disabled || item.disabled}
                  onChange={(event) =>
                    toggle([item.key], event.currentTarget.checked)
                  }
                />
                <span>{render?.(item) ?? item.title ?? item.key}</span>
              </label>
            </li>
          ))}
        </ul>
        {!items.length && <div className="ant-transfer-empty">No items</div>}
      </section>
    );
  };
  const t = config.token;
  return (
    <div
      className={["ant-transfer", className]}
      dir={config.direction}
      style={{
        "--ao-transfer-bg": t.colorBgContainer,
        "--ao-transfer-color": t.colorText,
        "--ao-transfer-border": t.colorBorder,
        "--ao-transfer-disabled": t.colorTextDisabled,
        "--ao-transfer-primary": t.colorPrimary,
        fontFamily: t.fontFamily,
        fontSize: t.fontSize,
        ...style,
      }}
    >
      {panel("left", titles[0])}
      <div className="ant-transfer-operations">
        <button
          type="button"
          disabled={disabled || !movable("left").length}
          onClick={() => move("right")}
        >
          {operations[0]}
        </button>
        <button
          type="button"
          disabled={disabled || !movable("right").length}
          onClick={() => move("left")}
        >
          {operations[1]}
        </button>
      </div>
      {panel("right", titles[1])}
    </div>
  );
}
