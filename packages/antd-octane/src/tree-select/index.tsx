/** @jsxImportSource octane */

import type { OctaneNode } from "octane";
import { useState } from "octane";
import {
  HierarchyPicker,
  type HierarchyPickerProps,
  type HierarchyPickerRef,
} from "../_util/hierarchy-picker";
import { Tree, type TreeDataNode } from "../tree";
export type TreeSelectRef = HierarchyPickerRef;
export type TreeSelectValue = string | number;
export interface TreeSelectNode {
  value?: TreeSelectValue;
  title?: OctaneNode;
  children?: TreeSelectNode[];
  disabled?: boolean;
  selectable?: boolean;
  [field: string]: unknown;
}
interface CommonProps extends HierarchyPickerProps {
  treeData?: TreeSelectNode[];
  fieldNames?: { value?: string; label?: string; children?: string };
  treeDefaultExpandAll?: boolean;
  treeExpandedKeys?: TreeSelectValue[];
  onTreeExpand?: (keys: TreeSelectValue[]) => void;
}
export type TreeSelectProps = CommonProps &
  (
    | {
        multiple?: false;
        value?: TreeSelectValue | null;
        defaultValue?: TreeSelectValue | null;
        onChange?: (value: TreeSelectValue | undefined) => void;
      }
    | {
        multiple: true;
        value?: TreeSelectValue[];
        defaultValue?: TreeSelectValue[];
        onChange?: (value: TreeSelectValue[]) => void;
      }
  );
export function TreeSelect(props: TreeSelectProps) {
  const [inner, setInner] = useState<
    TreeSelectValue | TreeSelectValue[] | null
  >(props.defaultValue ?? (props.multiple ? [] : null));
  const value = props.value !== undefined ? props.value : inner;
  const selected = Array.isArray(value) ? value : value == null ? [] : [value];
  const labels = new Map<TreeSelectValue, OctaneNode>();
  const fields = {
    value: "value",
    label: "title",
    children: "children",
    ...props.fieldNames,
  };
  const convert = (nodes: TreeSelectNode[]): TreeDataNode[] =>
    nodes.map((node) => {
      const key = node[fields.value];
      if (typeof key !== "string" && typeof key !== "number")
        throw new Error(
          "TreeSelect treeData requires unique string or number values",
        );
      if (labels.has(key))
        throw new Error(`TreeSelect duplicate value: ${key}`);
      const title = (node[fields.label] ?? String(key)) as OctaneNode;
      labels.set(key, title);
      const children = node[fields.children];
      return {
        key,
        title,
        disabled: node.disabled,
        selectable: node.selectable,
        children: Array.isArray(children)
          ? convert(children as TreeSelectNode[])
          : undefined,
      };
    });
  const tree = convert(props.treeData ?? []);
  const change = (keys: TreeSelectValue[]) => {
    if (props.multiple) {
      if (props.value === undefined) setInner(keys);
      props.onChange?.(keys);
    } else {
      if (props.value === undefined) setInner(keys[0] ?? null);
      props.onChange?.(keys[0]);
    }
  };
  const filter = (nodes: TreeDataNode[], search: string): TreeDataNode[] =>
    nodes.flatMap((node) => {
      const children = filter(node.children ?? [], search);
      const text =
        typeof node.title === "string" || typeof node.title === "number"
          ? String(node.title)
          : String(node.key);
      return text.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
        children.length
        ? [{ ...node, children }]
        : [];
    });
  const display = selected
    .map((key) => {
      const label = labels.get(key);
      return typeof label === "string" || typeof label === "number"
        ? String(label)
        : String(key);
    })
    .join(", ");
  return (
    <HierarchyPicker
      {...props}
      name="tree-select"
      label={display}
      hasValue={selected.length > 0}
      clear={() => change([])}
      content={(search, close) => {
        const nodes = search ? filter(tree, search) : tree;
        const expanded: TreeSelectValue[] = [];
        const collect = (items: TreeDataNode[]) => {
          for (const node of items) {
            if (node.children?.length) {
              expanded.push(node.key as TreeSelectValue);
              collect(node.children);
            }
          }
        };
        if (search) collect(nodes);
        return nodes.length ? (
          <Tree
            treeData={nodes}
            multiple={props.multiple}
            selectedKeys={selected}
            defaultExpandAll={props.treeDefaultExpandAll}
            expandedKeys={search ? expanded : props.treeExpandedKeys}
            onExpand={(keys) => props.onTreeExpand?.(keys)}
            onSelect={(keys, info) => {
              change(props.multiple ? keys : [info.node.key]);
              if (!props.multiple) close();
            }}
          />
        ) : (
          <div role="status">No options</div>
        );
      }}
    />
  );
}
