/** @jsxImportSource octane */

import { normalizeClass, useEffect, useRef, useState } from "octane";
import { useConfig } from "../config-provider";
import { FileOutlined, FolderOpenOutlined, FolderOutlined } from "./icons";
import {
  buildEntries,
  collectEntries,
  expandParents,
  InternalTree,
  rangeKeys,
  treeNodeChildrenToData,
} from "./Tree";
import type {
  DirectoryTreeProps,
  Key,
  TreeDataNode,
  TreeExpandInfo,
  TreeFieldNames,
  TreeNodeAttribute,
  TreeSelectInfo,
} from "./types";

function directoryIcon<T extends TreeDataNode>(node: TreeNodeAttribute<T>) {
  return node.isLeaf ? (
    <FileOutlined />
  ) : node.expanded ? (
    <FolderOpenOutlined />
  ) : (
    <FolderOutlined />
  );
}

function InternalDirectoryTree<T extends TreeDataNode = TreeDataNode>({
  treeData,
  children,
  fieldNames,
  expandedKeys,
  defaultExpandedKeys = [],
  defaultExpandAll = false,
  defaultExpandParent = false,
  autoExpandParent = false,
  selectedKeys,
  defaultSelectedKeys = [],
  multiple = false,
  showIcon = true,
  blockNode = true,
  expandAction = "click",
  icon,
  className,
  onExpand,
  onSelect,
  ...rest
}: DirectoryTreeProps<T>) {
  const config = useConfig();
  const names: TreeFieldNames = {
    key: fieldNames?.key ?? "key",
    title: fieldNames?.title ?? "title",
    children: fieldNames?.children ?? "children",
  };
  const data = treeData ?? treeNodeChildrenToData<T>(children, names);
  const roots = buildEntries(data, names);
  const allEntries = collectEntries(roots);
  const [internalExpanded, setInternalExpanded] = useState<Key[]>(() => {
    if (defaultExpandAll) return allEntries.map((entry) => entry.key);
    const initialKeys = expandedKeys ?? defaultExpandedKeys;
    return defaultExpandParent
      ? expandParents(initialKeys, roots)
      : initialKeys;
  });
  const expanded =
    expandedKeys === undefined
      ? internalExpanded
      : autoExpandParent
        ? expandParents(expandedKeys, roots)
        : expandedKeys;
  const [internalSelected, setInternalSelected] = useState<Key[]>(
    selectedKeys ?? defaultSelectedKeys,
  );
  const selected = selectedKeys ?? internalSelected;
  // Keep the last controlled values, as antd DirectoryTree's effects do, so
  // removing a controlled prop continues from its last supplied value.
  useEffect(() => {
    if (selectedKeys !== undefined) setInternalSelected(selectedKeys);
  }, [selectedKeys]);
  useEffect(() => {
    if (expandedKeys !== undefined) setInternalExpanded(expandedKeys);
  }, [expandedKeys]);
  const lastSelectedKey = useRef<Key | null>(null);
  const cachedSelectedKeys = useRef<Key[] | null>(null);

  const handleExpand = (keys: Key[], info: TreeExpandInfo<T>) => {
    if (expandedKeys === undefined) setInternalExpanded(keys);
    onExpand?.(keys, info);
  };

  const handleSelect = (keys: Key[], info: TreeSelectInfo<T>) => {
    const key = info.node.key;
    const nativeEvent = info.nativeEvent;
    let nextKeys: Key[];
    if (multiple && (nativeEvent.ctrlKey || nativeEvent.metaKey)) {
      nextKeys = keys;
      lastSelectedKey.current = key;
      cachedSelectedKeys.current = nextKeys;
    } else if (multiple && nativeEvent.shiftKey) {
      const range = rangeKeys(
        roots,
        expanded,
        key,
        lastSelectedKey.current ?? undefined,
      );
      nextKeys = [
        ...new Set([...(cachedSelectedKeys.current ?? []), ...range]),
      ];
    } else {
      nextKeys = [key];
      lastSelectedKey.current = key;
      cachedSelectedKeys.current = nextKeys;
    }

    const selectedKeySet = new Set(nextKeys);
    const nextInfo: TreeSelectInfo<T> = {
      ...info,
      selected: true,
      selectedNodes: allEntries
        .filter((entry) => selectedKeySet.has(entry.key))
        .map((entry) => entry.node),
    };
    onSelect?.(nextKeys, nextInfo);
    if (selectedKeys === undefined) setInternalSelected(nextKeys);
  };

  return (
    <InternalTree<T>
      {...rest}
      treeData={data}
      fieldNames={names}
      expandedKeys={expanded}
      autoExpandParent={autoExpandParent}
      selectedKeys={selected}
      multiple={multiple}
      showIcon={showIcon}
      blockNode={blockNode}
      expandAction={expandAction}
      icon={icon ?? directoryIcon<T>}
      className={normalizeClass([
        "ant-tree-directory",
        config.direction === "rtl" ? "ant-tree-directory-rtl" : "",
        className,
      ])}
      onExpand={handleExpand}
      onSelect={handleSelect}
    />
  );
}

export const DirectoryTree = InternalDirectoryTree;
