/** @jsxImportSource octane */
import type { OctaneNode } from "octane";
import {
  cloneElement,
  isValidElement,
  normalizeClass,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "octane";
import type { CheckState, Entry } from "./utils";
import {
  buildEntries,
  collectEntries,
  conductCheck,
  expandParents,
  isEntryLeaf,
  parseCheckState,
  treeNodeChildrenToData,
} from "./utils";

export { TreeNode } from "./TreeNode";
export {
  buildEntries,
  collectEntries,
  expandParents,
  rangeKeys,
  treeNodeChildrenToData,
} from "./utils";

import cssSize from "../_util/css-size";
import { useComponentTokens } from "../_util/tokens";
import { useConfig } from "../config-provider";
import { DropIndicator } from "./DropIndicator";
import {
  CaretDownFilled,
  FileOutlined,
  HolderOutlined,
  LoadingOutlined,
  MinusSquareOutlined,
  PlusSquareOutlined,
} from "./icons";
import { collapseMotion } from "./MotionTreeNode";
import { NodeList, type NodeListRef } from "./NodeList";
import type {
  Key,
  TreeCheckInfo,
  TreeDataNode,
  TreeDraggableConfig,
  TreeDragInfo,
  TreeFieldNames,
  TreeNodeAttribute,
  TreeProps,
  TreeScrollTarget,
} from "./types";
import { calcDropPosition, type DropTarget } from "./utils/drag";

interface TreeComponentTokenOverrides {
  titleHeight?: number;
  indentSize?: number;
  nodeHoverBg?: string;
  nodeHoverColor?: string;
  nodeSelectedBg?: string;
  nodeSelectedColor?: string;
  directoryNodeSelectedColor?: string;
  directoryNodeSelectedBg?: string;
}

export function InternalTree<T extends TreeDataNode = TreeDataNode>({
  treeData,
  children,
  prefixCls,
  rootClassName,
  rootStyle,
  fieldNames,
  expandedKeys,
  defaultExpandedKeys = [],
  defaultExpandAll = false,
  defaultExpandParent = true,
  autoExpandParent = false,
  loadedKeys,
  loadData,
  filterTreeNode,
  filterAntTreeNode,
  selectedKeys,
  defaultSelectedKeys = [],
  checkedKeys,
  defaultCheckedKeys = [],
  checkable = false,
  checkStrictly = false,
  selectable = true,
  multiple = false,
  disabled,
  showLine = false,
  showIcon = false,
  blockNode = false,
  indentSize,
  icon,
  switcherIcon,
  switcherLoadingIcon,
  expandAction = false,
  titleRender,
  height,
  itemHeight,
  itemScrollOffset = 0,
  scrollWidth,
  virtual,
  motion,
  direction,
  focusable = true,
  activeKey: controlledActiveKey,
  onActiveChange,
  dropIndicatorRender,
  onClick,
  onDoubleClick,
  onMouseEnter,
  onMouseLeave,
  draggable = false,
  allowDrop,
  onExpand,
  onSelect,
  onCheck,
  onLoad,
  onRightClick,
  onDragStart,
  onDragEnter,
  onDragOver,
  onDragLeave,
  onDragEnd,
  onDrop,
  className,
  style,
  id,
  tabIndex = 0,
  onKeyDown,
  ref,
  ...rest
}: TreeProps<T>) {
  const config = useConfig();
  const { token: t, component, base } = useComponentTokens("Tree");
  const c = component as typeof component & TreeComponentTokenOverrides;
  const titleHeight = c?.titleHeight ?? t.controlHeightSM;
  const mergedIndentSize = indentSize ?? c?.indentSize ?? t.controlHeightSM;
  const mergedDirection = direction ?? config.direction ?? "ltr";
  const mergedPrefixCls =
    config.getPrefixCls?.("tree", prefixCls) ?? prefixCls ?? "ant-tree";
  const mergedVirtual = virtual ?? config.virtual ?? true;
  const mergedItemHeight = itemHeight ?? titleHeight + t.paddingXS / 2;
  const defaultMotion = useMemo(
    () => collapseMotion(config.getPrefixCls?.() ?? "ant"),
    [config.getPrefixCls],
  );
  const mergedMotion =
    t.motion === false ? null : motion === undefined ? defaultMotion : motion;
  const mergedShowLine = Boolean(showLine);
  const showLeafIcon =
    typeof showLine === "object" ? showLine.showLeafIcon : undefined;
  const names: TreeFieldNames = {
    key: fieldNames?.key ?? "key",
    title: fieldNames?.title ?? "title",
    children: fieldNames?.children ?? "children",
  };
  const data = treeData ?? treeNodeChildrenToData<T>(children, names);
  const mergedDisabled = disabled ?? config.componentDisabled ?? false;
  const roots = buildEntries(data, names);
  const allEntries = collectEntries(roots);
  const entryByKey = new Map(allEntries.map((entry) => [entry.key, entry]));
  const treeId = useId();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<NodeListRef | null>(null);
  const [dragKey, setDragKey] = useState<Key | undefined>();
  const [dropTarget, setDropTarget] = useState<DropTarget | undefined>();
  const dragStart = useRef({ x: 0 });
  const dragKeyRef = useRef<Key | undefined>(undefined);
  const expandTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  useEffect(
    () => () => {
      clearTimeout(expandTimer.current);
    },
    [],
  );

  const [internalExpanded, setInternalExpanded] = useState<Key[]>(() => {
    if (defaultExpandAll)
      return allEntries
        .filter((entry) => entry.children.length > 0)
        .map((entry) => entry.key);
    return defaultExpandParent || autoExpandParent
      ? expandParents(defaultExpandedKeys, roots)
      : defaultExpandedKeys;
  });
  const controlledExpansion = useRef({
    input: expandedKeys,
    auto: autoExpandParent,
    keys:
      defaultExpandParent || autoExpandParent
        ? expandParents(expandedKeys ?? [], roots)
        : (expandedKeys ?? []),
  });
  if (
    controlledExpansion.current.input !== expandedKeys ||
    controlledExpansion.current.auto !== autoExpandParent
  )
    controlledExpansion.current = {
      input: expandedKeys,
      auto: autoExpandParent,
      keys: autoExpandParent
        ? expandParents(expandedKeys ?? [], roots)
        : (expandedKeys ?? []),
    };
  const expanded =
    expandedKeys !== undefined
      ? controlledExpansion.current.keys
      : internalExpanded;
  const [internalLoaded, setInternalLoaded] = useState<Key[]>([]);
  const loaded = loadedKeys ?? internalLoaded;
  const loadedRef = useRef<Key[]>(loaded);
  loadedRef.current = loaded;
  const [loadingKeys, setLoadingKeys] = useState<Key[]>([]);
  const loadingRef = useRef(new Set<Key>());
  const visibleEntries: Entry<T>[] = [];
  const collectVisible = (entries: Entry<T>[]) => {
    for (const entry of entries) {
      visibleEntries.push(entry);
      if (expanded.includes(entry.key)) collectVisible(entry.children);
    }
  };
  collectVisible(roots);

  const scrollTo = (target: number | TreeScrollTarget) => {
    const root = rootRef.current;
    if (!root) return;
    if (typeof target === "number") {
      root.scrollTo({ top: target, behavior: "auto" });
      return;
    }
    if (target.top !== undefined) {
      root.scrollTo({
        top: target.top,
        left: target.left,
        behavior: "auto",
      });
      return;
    }
    const entry =
      target.key !== undefined
        ? entryByKey.get(target.key)
        : target.index !== undefined
          ? visibleEntries[target.index]
          : undefined;
    if (!entry) return;
    if (height !== undefined && mergedVirtual) {
      listRef.current?.scrollTo({ ...target, key: entry.key });
      return;
    }
    const targetNode = Array.from(
      root.querySelectorAll<HTMLElement>('[role="treeitem"]'),
    ).find(
      (candidate) =>
        candidate.id ===
        `${treeId}-node-${encodeURIComponent(String(entry.key))}`,
    );
    if (!targetNode) return;
    if (height === undefined) {
      targetNode.scrollIntoView({
        block:
          target.align === "bottom"
            ? "end"
            : target.align === "top"
              ? "start"
              : "nearest",
        behavior: "auto",
      });
      if (target.offset)
        window.scrollBy({ top: target.offset, behavior: "auto" });
      return;
    }
    const rootRect = root.getBoundingClientRect();
    const nodeRect = targetNode.getBoundingClientRect();
    const offset = target.offset ?? 0;
    const currentTop = root.scrollTop;
    let nextTop = currentTop;
    if (target.align === "top") {
      nextTop += nodeRect.top - rootRect.top + offset;
    } else if (target.align === "bottom") {
      nextTop += nodeRect.bottom - rootRect.bottom + offset;
    } else if (nodeRect.top < rootRect.top) {
      nextTop += nodeRect.top - rootRect.top + offset;
    } else if (nodeRect.bottom > rootRect.bottom) {
      nextTop += nodeRect.bottom - rootRect.bottom + offset;
    }
    root.scrollTo({ top: nextTop, left: target.left, behavior: "auto" });
  };
  useImperativeHandle(
    ref,
    () => ({ nativeElement: rootRef.current as HTMLDivElement, scrollTo }),
    [scrollTo],
  );

  const [internalSelected, setInternalSelected] =
    useState<Key[]>(defaultSelectedKeys);
  const selectedInput = selectedKeys ?? internalSelected;
  const selected = multiple ? selectedInput : selectedInput.slice(0, 1);

  const [internalChecked, setInternalChecked] = useState<CheckState>(() => {
    if (checkStrictly) return { checked: defaultCheckedKeys, halfChecked: [] };
    return conductCheck(roots, defaultCheckedKeys, "fill");
  });
  const suppliedCheck =
    checkedKeys === undefined ? internalChecked : parseCheckState(checkedKeys);
  const checkedState = checkStrictly
    ? {
        checked: suppliedCheck.checked.filter((key) => entryByKey.has(key)),
        halfChecked: suppliedCheck.halfChecked.filter((key) =>
          entryByKey.has(key),
        ),
      }
    : conductCheck(roots, suppliedCheck.checked, "fill");
  const checked = checkedState.checked;
  const halfChecked = checkedState.halfChecked;

  const [activeKey, setActiveKey] = useState<Key | undefined>(undefined);
  const active =
    controlledActiveKey !== undefined
      ? (controlledActiveKey ?? undefined)
      : activeKey;
  const setActive = (key: Key | undefined) => {
    if (active === key) return;
    if (controlledActiveKey === undefined) setActiveKey(key);
    onActiveChange?.(key ?? null);
    if (key !== undefined) scrollTo({ key, offset: itemScrollOffset });
  };

  const getTitle = (entry: Entry<T>): OctaneNode => {
    const rawTitle = entry.node[names.title];
    if (typeof rawTitle === "function")
      return (rawTitle as (node: T) => OctaneNode)(entry.node);
    if (titleRender) return titleRender(entry.node);
    return rawTitle === undefined ? "---" : (rawTitle as OctaneNode);
  };

  const nodeAttribute = (entry: Entry<T>): TreeNodeAttribute<T> => ({
    ...entry.node,
    key: entry.key,
    eventKey: entry.key,
    prefixCls: mergedPrefixCls,
    selectable: entry.node.selectable ?? selectable,
    active: active === entry.key,
    dragOver:
      dropTarget?.dragOverKey === entry.key && dropTarget.position === 0,
    dragOverGapTop:
      dropTarget?.dragOverKey === entry.key && dropTarget.position === -1,
    dragOverGapBottom:
      dropTarget?.dragOverKey === entry.key && dropTarget.position === 1,
    expanded: expanded.includes(entry.key),
    selected: selected.includes(entry.key),
    checked: checked.includes(entry.key),
    loaded: loaded.includes(entry.key),
    loading: loadingKeys.includes(entry.key),
    halfChecked: halfChecked.includes(entry.key),
    disabled: mergedDisabled || Boolean(entry.node.disabled),
    disableCheckbox: Boolean(entry.node.disableCheckbox),
    isLeaf: isEntryLeaf(entry, loadData, loaded),
    pos: entry.pos,
    title: entry.node.title,
    data: entry.node,
  });

  const draggableConfig: TreeDraggableConfig<T> =
    typeof draggable === "function"
      ? { nodeDraggable: draggable }
      : typeof draggable === "object" && draggable !== null
        ? draggable
        : {};
  const canDragEntry = (entry: Entry<T>) =>
    Boolean(draggable) &&
    !mergedDisabled &&
    !entry.node.disabled &&
    (draggableConfig.nodeDraggable?.(entry.node) ?? true);
  const dragInfo = (entry: Entry<T>, event: DragEvent): TreeDragInfo<T> => ({
    event,
    node: nodeAttribute(entry),
  });
  const getDropTarget = (entry: Entry<T>, event: DragEvent) => {
    const drag =
      dragKeyRef.current === undefined
        ? undefined
        : entryByKey.get(dragKeyRef.current);
    return drag &&
      !mergedDisabled &&
      (draggableConfig.nodeDraggable?.(entry.node) ?? true)
      ? calcDropPosition(
          event,
          drag,
          entry,
          mergedIndentSize,
          dragStart.current.x,
          allowDrop,
          visibleEntries,
          expanded,
          mergedDirection,
        )
      : undefined;
  };
  const clearDrag = () => {
    clearTimeout(expandTimer.current);
    dragKeyRef.current = undefined;
    setDragKey(undefined);
    setDropTarget(undefined);
  };
  const descendantKeys = (entry: Entry<T>): Key[] =>
    collectEntries([entry]).map((item) => item.key);
  const handleDragStart = (entry: Entry<T>, event: DragEvent) => {
    if (!canDragEntry(entry)) {
      event.preventDefault();
      return;
    }
    event.dataTransfer?.setData("text/plain", String(entry.key));
    if (event.dataTransfer) event.dataTransfer.effectAllowed = "move";
    clearTimeout(expandTimer.current);
    dragStart.current = { x: event.clientX };
    dragKeyRef.current = entry.key;
    setDragKey(entry.key);
    // rc-tree collapses the dragged branch so its descendants cannot become drop targets.
    if (expanded.includes(entry.key) && expandedKeys === undefined)
      setInternalExpanded(expanded.filter((key) => key !== entry.key));
    setDropTarget(undefined);
    onDragStart?.(dragInfo(entry, event));
  };
  const handleDragEnter = (entry: Entry<T>, event: DragEvent) => {
    event.stopPropagation();
    const target = getDropTarget(entry, event);
    if (!target?.allowed) {
      setDropTarget(undefined);
      return;
    }
    event.preventDefault();
    setDropTarget(target);
    clearTimeout(expandTimer.current);
    // Match rc-tree's 800 ms delayed expansion while hovering an expandable node.
    if (entry.children.length > 0 && !expanded.includes(entry.key)) {
      expandTimer.current = setTimeout(() => {
        if (dragKeyRef.current !== undefined) {
          const next = [...expanded, entry.key];
          if (expandedKeys === undefined) setInternalExpanded(next);
          onExpand?.(next, {
            node: nodeAttribute(entry),
            expanded: true,
            nativeEvent: event,
          });
        }
      }, 800);
    }
    onDragEnter?.({ ...dragInfo(entry, event), expandedKeys: expanded });
  };
  const handleDragOver = (entry: Entry<T>, event: DragEvent) => {
    event.stopPropagation();
    const target = getDropTarget(entry, event);
    if (!target?.allowed) {
      setDropTarget(undefined);
      return;
    }
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
    setDropTarget((current) =>
      current?.key === target.key &&
      current.position === target.position &&
      current.levelOffset === target.levelOffset
        ? current
        : target,
    );
    onDragOver?.(dragInfo(entry, event));
  };
  const handleDragLeave = (entry: Entry<T>, event: DragEvent) => {
    const relatedTarget = event.relatedTarget;
    if (
      relatedTarget instanceof Node &&
      (event.currentTarget as HTMLElement).contains(relatedTarget)
    )
      return;
    clearTimeout(expandTimer.current);
    if (dropTarget?.dragOverKey === entry.key) setDropTarget(undefined);
    onDragLeave?.(dragInfo(entry, event));
  };
  const handleDrop = (entry: Entry<T>, event: DragEvent) => {
    event.stopPropagation();
    const dragEntry =
      dragKeyRef.current === undefined
        ? undefined
        : entryByKey.get(dragKeyRef.current);
    const target = getDropTarget(entry, event);
    const dropEntry = target ? entryByKey.get(target.key) : undefined;
    if (dragEntry && target?.allowed && dropEntry) {
      event.preventDefault();
      onDrop?.({
        event,
        node: nodeAttribute(dropEntry),
        dragNode: nodeAttribute(dragEntry),
        dragNodesKeys: descendantKeys(dragEntry),
        dropPosition: dropEntry.index + target.position,
        dropToGap: target.position !== 0,
      });
    }
    clearDrag();
  };
  const handleDragEnd = (entry: Entry<T>, event: DragEvent) => {
    onDragEnd?.(dragInfo(entry, event));
    clearDrag();
  };

  const updateExpand = (entry: Entry<T>, event: MouseEvent | KeyboardEvent) => {
    if (loadingKeys.includes(entry.key) || isEntryLeaf(entry, loadData, loaded))
      return;
    const wasExpanded = expanded.includes(entry.key);
    const nextExpanded = wasExpanded
      ? expanded.filter((key) => key !== entry.key)
      : [...expanded, entry.key];
    if (expandedKeys === undefined) setInternalExpanded(nextExpanded);
    onExpand?.(nextExpanded, {
      expanded: nextExpanded.includes(entry.key),
      node: nodeAttribute(entry),
      nativeEvent: event,
    });

    if (!wasExpanded) loadEntry(entry);
  };

  const loadEntry = (entry: Entry<T>) => {
    if (
      !loadData ||
      isEntryLeaf(entry, loadData, loaded) ||
      loaded.includes(entry.key) ||
      loadingRef.current.has(entry.key)
    )
      return;

    const loadNode = nodeAttribute(entry);
    loadingRef.current.add(entry.key);
    setLoadingKeys((keys) => [...keys, entry.key]);
    void Promise.resolve()
      .then(() => loadData(loadNode))
      .then(() => {
        const nextLoaded = loadedRef.current.includes(entry.key)
          ? loadedRef.current
          : [...loadedRef.current, entry.key];
        loadedRef.current = nextLoaded;
        if (loadedKeys === undefined) setInternalLoaded(nextLoaded);
        onLoad?.(nextLoaded, { event: "load", node: loadNode });
      })
      .catch(() => undefined)
      .finally(() => {
        loadingRef.current.delete(entry.key);
        setLoadingKeys((keys) => keys.filter((key) => key !== entry.key));
      });
  };
  const expandedSignature = expanded.join("\0");
  const loadedSignature = loaded.join("\0");
  useEffect(() => {
    for (const entry of visibleEntries) {
      if (expanded.includes(entry.key) && !isEntryLeaf(entry, loadData, loaded))
        loadEntry(entry);
    }
  }, [expandedSignature, loadedSignature, loadData]);

  const updateSelection = (
    entry: Entry<T>,
    event: MouseEvent | KeyboardEvent,
  ) => {
    if (
      mergedDisabled ||
      entry.node.disabled ||
      entry.node.selectable === false
    )
      return;
    const wasSelected = selected.includes(entry.key);
    const nextSelected = wasSelected
      ? selected.filter((key) => key !== entry.key)
      : multiple
        ? [...selected, entry.key]
        : [entry.key];
    if (selectedKeys === undefined) setInternalSelected(nextSelected);
    onSelect?.(nextSelected, {
      event: "select",
      selected: !wasSelected,
      node: nodeAttribute(entry),
      selectedNodes: nextSelected
        .map((key) => entryByKey.get(key)?.node)
        .filter((node): node is T => node !== undefined),
      nativeEvent: event,
    });
  };

  const updateCheck = (
    entry: Entry<T>,
    event: MouseEvent | KeyboardEvent,
    nextChecked: boolean,
  ) => {
    if (
      mergedDisabled ||
      entry.node.disabled ||
      entry.node.disableCheckbox ||
      entry.node.checkable === false
    )
      return;

    let nextState: CheckState;
    let callbackValue: Key[] | { checked: Key[]; halfChecked: Key[] };
    if (checkStrictly) {
      const next = nextChecked
        ? [...checked, entry.key]
        : checked.filter((key) => key !== entry.key);
      const nextHalf = halfChecked.filter((key) => key !== entry.key);
      nextState = { checked: next, halfChecked: nextHalf };
      callbackValue = { checked: next, halfChecked: nextHalf };
    } else {
      const filled = conductCheck(
        roots,
        nextChecked ? [...checked, entry.key] : [...checked, entry.key],
        "fill",
      );
      nextState = nextChecked
        ? filled
        : conductCheck(
            roots,
            filled.checked.filter((key) => key !== entry.key),
            "clean",
            filled.halfChecked,
          );
      callbackValue = nextState.checked;
    }

    if (checkedKeys === undefined) setInternalChecked(nextState);
    const info: TreeCheckInfo<T> = {
      event: "check",
      checked: nextChecked,
      node: nodeAttribute(entry),
      checkedNodes: nextState.checked
        .map((key) => entryByKey.get(key)?.node)
        .filter((node): node is T => node !== undefined),
      nativeEvent: event,
    };
    if (checkStrictly) {
      onCheck?.(callbackValue, info);
    } else {
      info.checkedNodesPositions = nextState.checked
        .map((key) => entryByKey.get(key))
        .filter((item): item is Entry<T> => item !== undefined)
        .map((item) => ({ node: item.node, pos: item.pos }));
      info.halfCheckedKeys = nextState.halfChecked;
      onCheck?.(callbackValue, info);
    }
  };

  const focusRoot = (key?: Key) => {
    if (key !== undefined) setActive(undefined);
    rootRef.current?.focus({ preventScroll: true });
  };

  const handleKeyDown = (
    event: KeyboardEvent & { currentTarget: HTMLDivElement },
  ) => {
    const currentIndex = visibleEntries.findIndex(
      (entry) => entry.key === active,
    );
    const current = active === undefined ? undefined : entryByKey.get(active);
    const focusIndex = (index: number) => {
      const entry = visibleEntries[index];
      if (entry) setActive(entry.key);
    };

    if (event.key === "ArrowDown" && visibleEntries.length) {
      event.preventDefault();
      focusIndex((currentIndex + 1) % visibleEntries.length);
    } else if (event.key === "ArrowUp" && visibleEntries.length) {
      event.preventDefault();
      focusIndex(
        (currentIndex < 0
          ? visibleEntries.length - 1
          : currentIndex - 1 + visibleEntries.length) % visibleEntries.length,
      );
    } else if (event.key === "Home" && visibleEntries.length) {
      event.preventDefault();
      focusIndex(0);
    } else if (event.key === "End" && visibleEntries.length) {
      event.preventDefault();
      focusIndex(visibleEntries.length - 1);
    } else if (current && event.key === "ArrowLeft") {
      event.preventDefault();
      if (
        !isEntryLeaf(current, loadData, loaded) &&
        expanded.includes(current.key)
      ) {
        updateExpand(current, event);
      } else if (current.parent) {
        setActive(current.parent.key);
      }
    } else if (current && event.key === "ArrowRight") {
      event.preventDefault();
      if (
        !isEntryLeaf(current, loadData, loaded) &&
        !expanded.includes(current.key)
      ) {
        updateExpand(current, event);
      } else if (current.children.length > 0) {
        setActive(current.children[0].key);
      }
    } else if (current && (event.key === "Enter" || event.key === " ")) {
      if (event.key === " ") event.preventDefault();
      if (checkable) {
        updateCheck(current, event, !checked.includes(current.key));
      } else if (selectable) {
        updateSelection(current, event);
      }
    }
    onKeyDown?.(event);
  };

  const treeClasses = (value: string) =>
    mergedPrefixCls === "ant-tree"
      ? value
      : value
          .split(" ")
          .flatMap((name) =>
            name.startsWith("ant-tree")
              ? [name, name.replace("ant-tree", mergedPrefixCls)]
              : [name],
          )
          .join(" ");
  const renderEntry = (entry: Entry<T>): OctaneNode => {
    const isExpanded = expanded.includes(entry.key);
    const isChecked = checked.includes(entry.key);
    const isHalfChecked = halfChecked.includes(entry.key);
    const isSelected = selected.includes(entry.key);
    const nodeCheckable = checkable && entry.node.checkable !== false;
    const nodeSelectable = entry.node.selectable ?? selectable;
    const nodeDisabled = mergedDisabled || Boolean(entry.node.disabled);
    const isLeaf = isEntryLeaf(entry, loadData, loaded);
    const checkboxDisabled =
      nodeDisabled || Boolean(entry.node.disableCheckbox);
    const title = getTitle(entry);
    const attributes = nodeAttribute(entry);
    const ownSwitcher = entry.node.switcherIcon ?? switcherIcon;
    const ownIcon = entry.node.icon ?? icon;
    const isLoading = loadingKeys.includes(entry.key);
    const isFiltered =
      filterTreeNode?.(attributes) ?? filterAntTreeNode?.(attributes) ?? false;
    const switcherNode =
      typeof ownSwitcher === "function" ? ownSwitcher(attributes) : ownSwitcher;
    let renderedSwitcher: OctaneNode = switcherNode;
    if (isLoading) {
      renderedSwitcher = switcherLoadingIcon ?? (
        <LoadingOutlined
          spin
          className={treeClasses("ant-tree-switcher-loading-icon")}
        />
      );
    } else if (isLeaf && mergedShowLine) {
      if (typeof showLeafIcon === "function") {
        renderedSwitcher = showLeafIcon(attributes);
      } else if (typeof showLeafIcon !== "boolean" && showLeafIcon) {
        renderedSwitcher = showLeafIcon;
      } else if (showLeafIcon) {
        renderedSwitcher = (
          <FileOutlined
            className={treeClasses("ant-tree-switcher-line-icon")}
          />
        );
      } else {
        renderedSwitcher = (
          <span className={treeClasses("ant-tree-switcher-leaf-line")} />
        );
      }
    } else if (isLeaf) {
      renderedSwitcher = null;
    } else if (switcherNode === undefined && mergedShowLine) {
      renderedSwitcher = isExpanded ? (
        <MinusSquareOutlined
          className={treeClasses("ant-tree-switcher-line-icon")}
        />
      ) : (
        <PlusSquareOutlined
          className={treeClasses("ant-tree-switcher-line-icon")}
        />
      );
    }
    if (!isLeaf && !isLoading && renderedSwitcher === undefined)
      renderedSwitcher = (
        <CaretDownFilled className={treeClasses("ant-tree-switcher-icon")} />
      );
    if (isValidElement<{ className?: string }>(renderedSwitcher))
      renderedSwitcher = cloneElement(renderedSwitcher, {
        className: normalizeClass([
          renderedSwitcher.props.className,
          treeClasses(
            isLeaf
              ? "ant-tree-switcher-line-custom-icon"
              : "ant-tree-switcher-icon",
          ),
        ]),
      });
    const customSwitcher =
      ownSwitcher !== undefined || mergedShowLine || isLoading || !isLeaf;
    // rc-tree passes original node props to `icon`, while the switcher above
    // receives the inferred leaf state. Keep that distinction for DirectoryTree.
    const iconAttributes = {
      ...attributes,
      isLeaf: entry.node.isLeaf as boolean,
    };
    const iconNode =
      typeof ownIcon === "function" ? ownIcon(iconAttributes) : ownIcon;
    const nodeDraggable = canDragEntry(entry);
    const isDragging = dragKey === entry.key;
    const dropPosition =
      dropTarget?.dragOverKey === entry.key ? dropTarget.position : undefined;
    const itemClass = [
      "ant-tree-treenode",
      isLeaf
        ? "ant-tree-treenode-leaf"
        : `ant-tree-treenode-switcher-${isExpanded ? "open" : "close"}`,
      entry.index === entry.siblingCount - 1
        ? "ant-tree-treenode-leaf-last"
        : "",
      isSelected ? "ant-tree-treenode-selected" : "",
      isFiltered ? "filter-node" : "",
      isLoading ? "ant-tree-treenode-loading" : "",
      isChecked ? "ant-tree-treenode-checkbox-checked" : "",
      isHalfChecked ? "ant-tree-treenode-checkbox-indeterminate" : "",
      nodeDisabled ? "ant-tree-treenode-disabled" : "",
      nodeDraggable ? "ant-tree-treenode-draggable" : "",
      isDragging ? "ant-tree-treenode-dragging dragging" : "",
      dropTarget?.key === entry.key ? "drop-target" : "",
      dropPosition === 0
        ? "drag-over"
        : dropPosition === -1
          ? "drag-over-gap-top"
          : dropPosition === 1
            ? "drag-over-gap-bottom"
            : "",
      dropPosition === -1 ? "ant-tree-treenode-drop-gap-top" : "",
      dropPosition === 0 ? "ant-tree-treenode-drop-over" : "",
      dropPosition === 1 ? "ant-tree-treenode-drop-gap-bottom" : "",
      active === entry.key ? "ant-tree-treenode-active" : "",
      entry.node.className ?? "",
    ]
      .filter(Boolean)
      .join(" ");
    const ancestors: Entry<T>[] = [];
    for (let ancestor = entry.parent; ancestor; ancestor = ancestor.parent)
      ancestors.unshift(ancestor);
    const nodeId = `${treeId}-node-${encodeURIComponent(String(entry.key))}`;
    const titleText = typeof title === "string" ? title : "tree node";

    return (
      <div
        key={entry.key}
        id={nodeId}
        className={treeClasses(itemClass)}
        role="treeitem"
        tabIndex={-1}
        aria-level={entry.depth + 1}
        aria-posinset={entry.index + 1}
        aria-setsize={entry.siblingCount}
        aria-expanded={isLeaf ? undefined : isExpanded}
        aria-selected={nodeSelectable ? isSelected : undefined}
        aria-checked={
          nodeCheckable ? (isHalfChecked ? "mixed" : isChecked) : undefined
        }
        aria-disabled={nodeDisabled || undefined}
        aria-grabbed={isDragging || undefined}
        draggable={nodeDraggable}
        onMouseMove={() => setActive(undefined)}
        onDragStart={(event) => handleDragStart(entry, event)}
        onDragEnter={(event) => handleDragEnter(entry, event)}
        onDragOver={(event) => handleDragOver(entry, event)}
        onDragLeave={(event) => handleDragLeave(entry, event)}
        onDrop={(event) => handleDrop(entry, event)}
        onDragEnd={(event) => handleDragEnd(entry, event)}
        onContextMenu={(event) => {
          if (onRightClick) event.preventDefault();
          onRightClick?.({ event, node: nodeAttribute(entry) });
        }}
        onMouseEnter={(event) =>
          onMouseEnter?.({ event, node: nodeAttribute(entry) })
        }
        onMouseLeave={(event) =>
          onMouseLeave?.({ event, node: nodeAttribute(entry) })
        }
        style={{
          ...(entry.node.style ?? {}),
        }}
      >
        <span className={treeClasses("ant-tree-indent")} aria-hidden="true">
          {ancestors.map((ancestor) => (
            <span
              key={ancestor.key}
              className={treeClasses(
                `ant-tree-indent-unit${ancestor.index === 0 ? " ant-tree-indent-unit-start" : ""}${ancestor.index === ancestor.siblingCount - 1 ? " ant-tree-indent-unit-end" : ""}`,
              )}
            />
          ))}
        </span>
        {nodeDraggable && draggableConfig.icon !== false ? (
          <span
            className={treeClasses(
              "ant-tree-drag-icon ant-tree-draggable-icon",
            )}
            aria-hidden="true"
          >
            {draggableConfig.icon ?? <HolderOutlined />}
          </span>
        ) : null}
        <button
          type="button"
          tabIndex={-1}
          className={treeClasses(
            `ant-tree-switcher${isLeaf ? " ant-tree-switcher-noop" : ""}${isLeaf && mergedShowLine ? " ant-tree-switcher-show-line-leaf" : ""}${isExpanded ? " ant-tree-switcher_open" : " ant-tree-switcher_close"}${customSwitcher ? " ant-tree-switcher-custom" : ""}`,
          )}
          aria-label={`${isExpanded ? "Collapse" : "Expand"} ${titleText}`}
          aria-expanded={isLeaf ? undefined : isExpanded}
          disabled={isLeaf}
          onClick={(event) => {
            event.stopPropagation();
            focusRoot(entry.key);
            updateExpand(entry, event);
          }}
        >
          {renderedSwitcher}
        </button>
        {nodeCheckable ? (
          <span
            className={treeClasses(
              `ant-tree-checkbox${isChecked ? " ant-tree-checkbox-checked" : ""}${isHalfChecked ? " ant-tree-checkbox-indeterminate" : ""}${checkboxDisabled ? " ant-tree-checkbox-disabled" : ""}`,
            )}
          >
            <input
              type="checkbox"
              className={treeClasses("ant-tree-checkbox-input")}
              tabIndex={-1}
              aria-label={`Select ${titleText}`}
              aria-checked={isHalfChecked ? "mixed" : isChecked}
              disabled={checkboxDisabled}
              checked={isChecked}
              onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
                focusRoot(entry.key);
                updateCheck(entry, event, !isChecked);
              }}
              onChange={() => undefined}
            />
            <span className={treeClasses("ant-tree-checkbox-inner")} />
          </span>
        ) : null}
        <button
          type="button"
          tabIndex={-1}
          aria-disabled={nodeDisabled || undefined}
          className={treeClasses(
            `ant-tree-node-content-wrapper${isSelected ? " ant-tree-node-selected" : ""}${blockNode ? " ant-tree-node-content-wrapper-block" : ""}`,
          )}
          title={typeof title === "string" ? title : undefined}
          onClick={(event) => {
            focusRoot(entry.key);
            if (
              expandAction === "click" &&
              !event.shiftKey &&
              !event.ctrlKey &&
              !event.metaKey
            )
              updateExpand(entry, event);
            onClick?.(event, nodeAttribute(entry));
            if (nodeSelectable) updateSelection(entry, event);
            else if (checkable) updateCheck(entry, event, !isChecked);
          }}
          onDoubleClick={(event) => {
            if (
              expandAction === "doubleClick" &&
              !event.shiftKey &&
              !event.ctrlKey &&
              !event.metaKey
            )
              updateExpand(entry, event);
            onDoubleClick?.(event, nodeAttribute(entry));
          }}
        >
          {showIcon ? (
            <span className={treeClasses("ant-tree-iconEle")}>{iconNode}</span>
          ) : null}
          <span className={treeClasses("ant-tree-title")}>{title}</span>
          {dropPosition !== undefined && dropTarget?.allowed
            ? (dropIndicatorRender ?? DropIndicator)({
                dropPosition,
                dropLevelOffset: dropTarget.levelOffset,
                indent: mergedIndentSize,
                prefixCls: mergedPrefixCls,
                direction: mergedDirection,
              })
            : null}
        </button>
      </div>
    );
  };

  const treeClassName = [
    "ant-tree",
    "ant-tree-root",
    mergedDirection === "rtl" ? "ant-tree-rtl" : "",
    config.tree?.className ?? "",
    draggable ? "ant-tree-draggable" : "",
    mergedShowLine ? "ant-tree-show-line" : "",
    checkable ? "ant-tree-checkable" : "",
    blockNode ? "ant-tree-block-node" : "",
    selectable ? "" : "ant-tree-unselectable",
    mergedDisabled ? "ant-tree-disabled" : "",
    mergedPrefixCls !== "ant-tree" ? mergedPrefixCls : "",
    rootClassName ?? "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      {...rest}
      ref={rootRef}
      id={id ?? treeId}
      className={treeClassName}
      style={{
        ...base,
        maxHeight: height,
        overflowY: height === undefined ? undefined : "auto",
        overflowX: mergedVirtual && height ? "hidden" : undefined,
        direction: mergedDirection,
        "--ao-tree-title-height": `${titleHeight}px`,
        "--ao-tree-motion-duration": t.motionDurationMid,
        "--ao-tree-motion-ease": t.motionEaseInOut,
        "--ao-tree-indent-size": `${mergedIndentSize}px`,
        "--ao-tree-item-gap": `${t.paddingXS / 2}px`,
        "--ao-tree-radius": `${t.borderRadius}px`,
        "--ao-tree-node-hover-bg": c?.nodeHoverBg ?? t.controlItemBgHover,
        "--ao-tree-directory-hover-bg": t.controlItemBgHover,
        "--ao-tree-node-selected-bg":
          c?.nodeSelectedBg ?? t.controlItemBgActive,
        "--ao-tree-node-selected-color": c?.nodeSelectedColor ?? t.colorText,
        "--ao-tree-directory-selected-bg":
          c?.directoryNodeSelectedBg ?? t.colorPrimary,
        "--ao-tree-directory-selected-color":
          c?.directoryNodeSelectedColor ?? t.colorTextLightSolid,
        "--ao-tree-content-padding-inline": cssSize(t.paddingXS),
        "--ao-tree-switcher-color": t.colorText,
        "--ao-text-quaternary": t.colorTextQuaternary,
        "--ao-tree-switcher-hover-bg": t.colorBgTextHover,
        "--ao-tree-switcher-margin": cssSize(
          Math.max(0, (titleHeight - t.controlInteractiveSize) / 2),
        ),
        "--ao-tree-control-size": cssSize(t.controlInteractiveSize),
        "--ao-tree-checkbox-radius": cssSize(t.borderRadiusSM),
        "--ao-tree-border": t.colorBorder,
        "--ao-tree-disabled-color": t.colorTextDisabled,
        "--ao-tree-disabled-bg": t.colorBgContainerDisabled,
        "--ao-tree-selected-disabled-bg": t.controlItemBgActiveDisabled,
        "--ao-tree-font-weight-strong": t.fontWeightStrong,
        "--ao-tree-checkbox-mixed-size": cssSize(t.fontSizeLG / 2),
        "--ao-tree-checkbox-check-width": cssSize(
          (t.controlInteractiveSize * 5) / 14,
        ),
        "--ao-tree-checkbox-check-height": cssSize(
          (t.controlInteractiveSize * 8) / 14,
        ),
        "--ao-tree-checkbox-tick": t.colorWhite,
        "--ao-tree-checkbox-tick-width": cssSize(t.lineWidthBold),
        ...(config.tree?.style ?? {}),
        ...(style ?? {}),
        ...(rootStyle ?? {}),
      }}
      role="tree"
      aria-activedescendant={
        active === undefined
          ? undefined
          : `${treeId}-node-${encodeURIComponent(String(active))}`
      }
      aria-disabled={mergedDisabled || undefined}
      tabIndex={mergedDisabled || !focusable ? -1 : tabIndex}
      onKeyDown={handleKeyDown}
    >
      <NodeList
        ref={listRef}
        data={visibleEntries}
        expandedKeys={expanded}
        height={height}
        itemHeight={mergedItemHeight}
        virtual={mergedVirtual}
        motion={mergedMotion}
        scrollWidth={scrollWidth}
        scrollRef={rootRef}
        renderItem={renderEntry}
      />
    </div>
  );
}
