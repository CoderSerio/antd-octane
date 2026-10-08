/** @jsxImportSource octane */

import type { OctaneNode } from "octane";
import { useState } from "octane";
import {
  HierarchyPicker,
  type HierarchyPickerProps,
  type HierarchyPickerRef,
} from "../_util/hierarchy-picker";
export type CascaderRef = HierarchyPickerRef;
export type CascaderValue = string | number;
export interface CascaderOption {
  value?: CascaderValue;
  label?: OctaneNode;
  disabled?: boolean;
  children?: CascaderOption[];
  [field: string]: unknown;
}
export interface CascaderProps extends HierarchyPickerProps {
  options?: CascaderOption[];
  value?: CascaderValue[];
  defaultValue?: CascaderValue[];
  onChange?: (
    value: CascaderValue[],
    selectedOptions: CascaderOption[],
  ) => void;
  changeOnSelect?: boolean;
  fieldNames?: { value?: string; label?: string; children?: string };
}
interface Node {
  value: CascaderValue;
  label: OctaneNode;
  raw: CascaderOption;
  disabled: boolean;
  children: Node[];
}
export function Cascader(props: CascaderProps) {
  const [inner, setInner] = useState(props.defaultValue ?? []);
  const value = props.value ?? inner;
  const [active, setActive] = useState<CascaderValue[] | null>(null);
  const fields = {
    value: "value",
    label: "label",
    children: "children",
    ...props.fieldNames,
  };
  const convert = (items: CascaderOption[], parentDisabled = false): Node[] => {
    const keys = new Set<CascaderValue>();
    return items.map((item) => {
      const key = item[fields.value];
      if (typeof key !== "string" && typeof key !== "number")
        throw new Error("Cascader options require string or number values");
      if (keys.has(key))
        throw new Error(`Cascader duplicate sibling value: ${key}`);
      keys.add(key);
      const children = item[fields.children];
      const disabled = parentDisabled || item.disabled === true;
      return {
        value: key,
        label: (item[fields.label] ?? String(key)) as OctaneNode,
        raw: item,
        disabled,
        children: Array.isArray(children)
          ? convert(children as CascaderOption[], disabled)
          : [],
      };
    });
  };
  const nodes = convert(props.options ?? []);
  const resolvePath = (values: CascaderValue[]) => {
    const result: Node[] = [];
    let level = nodes;
    for (const key of values) {
      const node = level.find((item) => item.value === key);
      if (!node) break;
      result.push(node);
      level = node.children;
    }
    return result;
  };
  const text = (node: Node) =>
    typeof node.label === "string" || typeof node.label === "number"
      ? String(node.label)
      : String(node.value);
  const change = (path: Node[]) => {
    const next = path.map((node) => node.value);
    if (props.value === undefined) setInner(next);
    props.onChange?.(
      next,
      path.map((node) => node.raw),
    );
  };
  return (
    <HierarchyPicker
      {...props}
      name="cascader"
      label={resolvePath(value).map(text).join(" / ")}
      hasValue={value.length > 0}
      clear={() => {
        change([]);
        setActive(null);
      }}
      onOpenChange={(open) => {
        if (open) setActive(null);
        props.onOpenChange?.(open);
      }}
      content={(search, close) => {
        const choose = (path: Node[]) => {
          const node = path[path.length - 1];
          if (!node || node.disabled) return;
          setActive(path.map((item) => item.value));
          if (!node.children.length || props.changeOnSelect) change(path);
          if (!node.children.length) close();
        };
        const paths: Node[][] = [];
        const visit = (items: Node[], path: Node[]) => {
          for (const node of items) {
            const next = [...path, node];
            if (!node.children.length) paths.push(next);
            else visit(node.children, next);
          }
        };
        if (search) visit(nodes, []);
        const branch = resolvePath(active ?? value);
        const columns: Node[][] = [nodes];
        for (const node of branch)
          if (node.children.length) columns.push(node.children);
          else break;
        const keyboard = (
          event: KeyboardEvent,
          path: Node[],
          column: number,
        ) => {
          const button = event.currentTarget as HTMLButtonElement;
          const list = button.closest("ul");
          const buttons = [
            ...(list?.querySelectorAll<HTMLButtonElement>(
              "button:not(:disabled)",
            ) ?? []),
          ];
          const index = buttons.indexOf(button);
          if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
            event.preventDefault();
            const next =
              event.key === "Home"
                ? 0
                : event.key === "End"
                  ? buttons.length - 1
                  : (index +
                      (event.key === "ArrowDown" ? 1 : -1) +
                      buttons.length) %
                    buttons.length;
            buttons[next]?.focus();
          }
          if (
            !search &&
            event.key === "ArrowRight" &&
            path[path.length - 1].children.length
          ) {
            event.preventDefault();
            choose(path);
            queueMicrotask(() =>
              button
                .closest(".ao-cascader-columns")
                ?.children[column + 1]?.querySelector<HTMLButtonElement>(
                  "button:not(:disabled)",
                )
                ?.focus(),
            );
          }
          if (!search && event.key === "ArrowLeft" && column > 0) {
            event.preventDefault();
            const previous = button.closest(".ao-cascader-columns")?.children[
              column - 1
            ];
            previous
              ?.querySelector<HTMLButtonElement>('button[aria-pressed="true"]')
              ?.focus();
            setActive(path.slice(0, -2).map((node) => node.value));
          }
        };
        if (search) {
          const matches = paths.filter((path) =>
            path
              .map(text)
              .join(" / ")
              .toLocaleLowerCase()
              .includes(search.toLocaleLowerCase()),
          );
          return (
            <ul className="ao-cascader-column" aria-label="Matching paths">
              {matches.length ? (
                matches.map((path) => (
                  <li key={JSON.stringify(path.map((node) => node.value))}>
                    <button
                      type="button"
                      className="ao-cascader-option"
                      disabled={path.some((node) => node.disabled)}
                      onClick={() => choose(path)}
                      onKeyDown={(event) => keyboard(event, path, 0)}
                    >
                      {path.map(text).join(" / ")}
                    </button>
                  </li>
                ))
              ) : (
                <li role="status">No options</li>
              )}
            </ul>
          );
        }
        return (
          <div className="ao-cascader-columns">
            {columns.map((items, column) => (
              <ul
                key={column}
                className="ao-cascader-column"
                aria-label={`Level ${column + 1}`}
              >
                {items.map((node) => {
                  const path = [...branch.slice(0, column), node];
                  return (
                    <li key={node.value}>
                      <button
                        type="button"
                        className="ao-cascader-option"
                        disabled={node.disabled}
                        aria-pressed={branch[column]?.value === node.value}
                        aria-expanded={
                          node.children.length
                            ? branch[column]?.value === node.value
                            : undefined
                        }
                        onClick={() => choose(path)}
                        onKeyDown={(event) => keyboard(event, path, column)}
                      >
                        {node.label}
                        {node.children.length ? " ›" : ""}
                      </button>
                    </li>
                  );
                })}
              </ul>
            ))}
          </div>
        );
      }}
    />
  );
}
