// Data flattening and checked-key conduction follow rc-tree 5.13.1's treeUtil/util conventions.
// Adapted for Octane; upstream MIT provenance is recorded in THIRD_PARTY_NOTICES.md.
import type { OctaneNode } from "octane";
import { Children, Fragment, isValidElement } from "octane";
import { TreeNode } from "./TreeNode";
import type {
  Key,
  TreeDataNode,
  TreeFieldNames,
  TreeNodeProps,
  TreeProps,
} from "./types";

export interface Entry<T extends TreeDataNode> {
  key: Key;
  pos: string;
  node: T;
  parent?: Entry<T>;
  children: Entry<T>[];
  depth: number;
  index: number;
  siblingCount: number;
  isLeaf: boolean;
}

export function isEntryLeaf<T extends TreeDataNode>(
  entry: Entry<T>,
  loadData: TreeProps<T>["loadData"],
  loadedKeys: Key[],
) {
  if (entry.node.isLeaf !== undefined) return entry.node.isLeaf;
  return (
    entry.children.length === 0 && (!loadData || loadedKeys.includes(entry.key))
  );
}

export function treeNodeChildrenToData<T extends TreeDataNode>(
  children: OctaneNode,
  names: TreeFieldNames,
): T[] {
  const nodes: T[] = [];
  Children.forEach(children, (child) => {
    // rc-tree's convertTreeToData uses rc-util toArray, which unwraps fragments
    // at every level before filtering the TreeNode descriptors.
    if (isValidElement(child) && child.type === Fragment) {
      nodes.push(
        ...treeNodeChildrenToData<T>(
          child.children ?? child.props.children,
          names,
        ),
      );
      return;
    }
    if (!isValidElement<TreeNodeProps>(child) || child.type !== TreeNode)
      return;

    const props = child.props;
    const nodeChildren = child.children ?? props.children;
    const key = props.key ?? child.key ?? props.eventKey;
    const data: Record<string, unknown> = { ...props };
    delete data.children;
    delete data.eventKey;
    delete data.key;
    delete data.title;
    if (key !== null && key !== undefined) data[names.key] = key;
    if (props.title !== undefined) data[names.title] = props.title;
    const childData = treeNodeChildrenToData<T>(nodeChildren, names);
    if (childData.length > 0) data[names.children] = childData;
    nodes.push(data as T);
  });
  return nodes;
}

export interface CheckState {
  checked: Key[];
  halfChecked: Key[];
}

function asKey(value: unknown): Key | undefined {
  return typeof value === "string" || typeof value === "number"
    ? value
    : undefined;
}

export function buildEntries<T extends TreeDataNode>(
  data: T[],
  fieldNames: TreeFieldNames,
  parent?: Entry<T>,
  parentPos = "0",
): Entry<T>[] {
  return data.map((node, index) => {
    const pos = `${parentPos}-${index}`;
    const key = asKey(node[fieldNames.key]) ?? pos;
    const childData = node[fieldNames.children];
    const children = Array.isArray(childData) ? (childData as T[]) : [];
    const entry: Entry<T> = {
      key,
      pos,
      node,
      parent,
      children: [],
      depth: parent ? parent.depth + 1 : 0,
      index,
      siblingCount: data.length,
      isLeaf:
        node.isLeaf === true ||
        (node.isLeaf !== false && children.length === 0),
    };
    entry.children = buildEntries(children, fieldNames, entry, pos);
    return entry;
  });
}

export function collectEntries<T extends TreeDataNode>(
  entries: Entry<T>[],
): Entry<T>[] {
  return entries.flatMap((entry) => [entry, ...collectEntries(entry.children)]);
}

function findEntry<T extends TreeDataNode>(
  entries: Entry<T>[],
  key: Key,
): Entry<T> | undefined {
  for (const entry of entries) {
    if (entry.key === key) return entry;
    const child = findEntry(entry.children, key);
    if (child) return child;
  }
  return undefined;
}

export function expandParents<T extends TreeDataNode>(
  keys: Key[],
  entries: Entry<T>[],
): Key[] {
  const result = new Set<Key>();
  for (const key of keys) {
    const entry = findEntry(entries, key);
    if (!entry) continue;
    result.add(key);
    if (entry.node.disabled) continue;
    let parent = entry.parent;
    while (parent) {
      result.add(parent.key);
      if (parent.node.disabled) break;
      parent = parent.parent;
    }
  }
  return [...result];
}

export function visibleEntries<T extends TreeDataNode>(
  entries: Entry<T>[],
  expandedKeys: Key[],
): Entry<T>[] {
  const visible: Entry<T>[] = [];
  for (const entry of entries) {
    visible.push(entry);
    if (expandedKeys.includes(entry.key))
      visible.push(...visibleEntries(entry.children, expandedKeys));
  }
  return visible;
}

export function rangeKeys<T extends TreeDataNode>(
  entries: Entry<T>[],
  expandedKeys: Key[],
  startKey: Key | undefined,
  endKey: Key | undefined,
): Key[] {
  if (startKey === undefined || endKey === undefined) return [];
  if (startKey === endKey) return [startKey];
  const visibleKeys = visibleEntries(entries, expandedKeys).map(
    (entry) => entry.key,
  );
  const startIndex = visibleKeys.indexOf(startKey);
  const endIndex = visibleKeys.indexOf(endKey);
  if (startIndex < 0 || endIndex < 0) return [];
  return visibleKeys.slice(
    Math.min(startIndex, endIndex),
    Math.max(startIndex, endIndex) + 1,
  );
}

function isCheckDisabled<T extends TreeDataNode>(entry: Entry<T>): boolean {
  return Boolean(
    entry.node.disabled ||
      entry.node.disableCheckbox ||
      entry.node.checkable === false,
  );
}

export function conductCheck<T extends TreeDataNode>(
  entries: Entry<T>[],
  inputKeys: Key[],
  mode: "fill" | "clean",
  halfInput: Key[] = [],
): CheckState {
  const all = collectEntries(entries);
  const entryByKey = new Map(all.map((entry) => [entry.key, entry]));
  const checked = new Set(inputKeys.filter((key) => entryByKey.has(key)));
  const half = new Set(halfInput.filter((key) => entryByKey.has(key)));

  if (mode === "fill") {
    // Propagate checked parents down, stopping at disabled or non-checkable nodes.
    for (const entry of all) {
      if (!checked.has(entry.key) || isCheckDisabled(entry)) continue;
      for (const child of entry.children) {
        if (!isCheckDisabled(child)) checked.add(child.key);
      }
    }

    // Then infer checked and indeterminate parents from their eligible children.
    for (const entry of [...all].reverse()) {
      const parent = entry.parent;
      if (!parent || isCheckDisabled(entry) || isCheckDisabled(parent))
        continue;
      const children = parent.children.filter(
        (child) => !isCheckDisabled(child),
      );
      if (
        children.length > 0 &&
        children.every((child) => checked.has(child.key))
      )
        checked.add(parent.key);
      if (
        children.some((child) => checked.has(child.key) || half.has(child.key))
      )
        half.add(parent.key);
    }
  } else {
    // Remove descendants without a checked or indeterminate ancestor.
    for (const entry of all) {
      if (
        !checked.has(entry.key) &&
        !half.has(entry.key) &&
        !isCheckDisabled(entry)
      ) {
        for (const child of entry.children) {
          if (!isCheckDisabled(child)) checked.delete(child.key);
        }
      }
    }

    half.clear();
    for (const entry of [...all].reverse()) {
      const parent = entry.parent;
      if (!parent || isCheckDisabled(entry) || isCheckDisabled(parent))
        continue;
      const children = parent.children.filter(
        (child) => !isCheckDisabled(child),
      );
      if (!children.every((child) => checked.has(child.key)))
        checked.delete(parent.key);
      if (
        children.some((child) => checked.has(child.key) || half.has(child.key))
      )
        half.add(parent.key);
    }
  }

  for (const key of checked) half.delete(key);
  return { checked: [...checked], halfChecked: [...half] };
}

export function parseCheckState(value: TreeProps["checkedKeys"]): CheckState {
  if (Array.isArray(value)) return { checked: value, halfChecked: [] };
  return value
    ? { checked: value.checked, halfChecked: value.halfChecked }
    : { checked: [], halfChecked: [] };
}
