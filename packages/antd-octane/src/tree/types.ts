import type { CSSProperties, HTMLAttributes, OctaneNode, Ref } from "octane";

export type Key = string | number;

export interface TreeFieldNames {
  key: string;
  title: string;
  children: string;
}

export interface TreeDataNode {
  key?: Key;
  title?: OctaneNode | ((node: TreeDataNode) => OctaneNode);
  children?: TreeDataNode[];
  disabled?: boolean;
  disableCheckbox?: boolean;
  checkable?: boolean;
  selectable?: boolean;
  isLeaf?: boolean;
  className?: string;
  style?: CSSProperties;
  icon?: OctaneNode | ((node: TreeNodeAttribute) => OctaneNode);
  switcherIcon?: OctaneNode | ((node: TreeNodeAttribute) => OctaneNode);
  [field: string]: unknown;
}

export interface TreeNodeProps extends Omit<TreeDataNode, "children"> {
  eventKey?: Key;
  children?: OctaneNode;
}

export type TreeNodeAttribute<T extends TreeDataNode = TreeDataNode> = T & {
  key: Key;
  expanded: boolean;
  selected: boolean;
  checked: boolean;
  loaded: boolean;
  loading: boolean;
  halfChecked: boolean;
  disabled: boolean;
  disableCheckbox: boolean;
  isLeaf: boolean;
  pos: string;
  eventKey: Key;
  prefixCls: string;
  selectable: boolean;
  active: boolean;
  dragOver: boolean;
  dragOverGapTop: boolean;
  dragOverGapBottom: boolean;
  title: TreeDataNode["title"];
  data: T;
};

export interface TreeShowLineConfig<T extends TreeDataNode = TreeDataNode> {
  showLeafIcon?:
    | boolean
    | OctaneNode
    | ((node: TreeNodeAttribute<T>) => OctaneNode);
}

export interface TreeSelectInfo<T extends TreeDataNode = TreeDataNode> {
  event: "select";
  selected: boolean;
  node: TreeNodeAttribute<T>;
  selectedNodes: T[];
  nativeEvent: MouseEvent | KeyboardEvent;
}

export interface TreeExpandInfo<T extends TreeDataNode = TreeDataNode> {
  expanded: boolean;
  node: TreeNodeAttribute<T>;
  nativeEvent: MouseEvent | KeyboardEvent;
}

export interface TreeCheckInfo<T extends TreeDataNode = TreeDataNode> {
  event: "check";
  checked: boolean;
  node: TreeNodeAttribute<T>;
  checkedNodes: T[];
  checkedNodesPositions?: Array<{ node: T; pos: string }>;
  halfCheckedKeys?: Key[];
  nativeEvent: MouseEvent | KeyboardEvent;
}

export interface TreeLoadInfo<T extends TreeDataNode = TreeDataNode> {
  event: "load";
  node: TreeNodeAttribute<T>;
}

export interface TreeRightClickInfo<T extends TreeDataNode = TreeDataNode> {
  event: MouseEvent;
  node: TreeNodeAttribute<T>;
}

export interface TreeDropPosition<T extends TreeDataNode = TreeDataNode> {
  dragNode: T;
  dropNode: T;
  dropPosition: -1 | 0 | 1;
}

export interface TreeDragInfo<T extends TreeDataNode = TreeDataNode> {
  event: DragEvent;
  node: TreeNodeAttribute<T>;
}

export interface TreeDragEnterInfo<T extends TreeDataNode = TreeDataNode>
  extends TreeDragInfo<T> {
  expandedKeys: Key[];
}

export interface TreeDropInfo<T extends TreeDataNode = TreeDataNode>
  extends TreeDragInfo<T> {
  dragNode: TreeNodeAttribute<T>;
  dragNodesKeys: Key[];
  dropPosition: number;
  dropToGap: boolean;
}

export interface TreeDraggableConfig<T extends TreeDataNode = TreeDataNode> {
  icon?: OctaneNode | false;
  nodeDraggable?: (node: T) => boolean;
}

export interface TreeScrollTarget {
  index?: number;
  key?: Key;
  top?: number;
  left?: number;
  align?: "top" | "bottom" | "auto";
  offset?: number;
}

export interface TreeRef {
  nativeElement: HTMLDivElement;
  scrollTo: (target: number | TreeScrollTarget) => void;
}

export interface TreeDropIndicatorProps {
  dropPosition: -1 | 0 | 1;
  dropLevelOffset: number;
  indent: number;
  prefixCls: string;
  direction: "ltr" | "rtl";
}

export interface TreeMotionEvent {
  deadline?: boolean;
  propertyName?: string;
}

type TreeMotionHandler = (
  node: HTMLDivElement,
  event?: TreeMotionEvent,
  // biome-ignore lint/suspicious/noConfusingVoidType: rc-motion accepts callbacks that return no value.
) => CSSProperties | void;
type TreeMotionEndHandler = (
  node: HTMLDivElement,
  event: TreeMotionEvent,
  // biome-ignore lint/suspicious/noConfusingVoidType: rc-motion end handlers may return no value or cancel with false.
) => boolean | void;

/** Octane-native counterpart of rc-motion's collapse motion options. */
export interface TreeMotion {
  motionName?:
    | string
    | {
        appear?: string;
        enter?: string;
        leave?: string;
        appearActive?: string;
        enterActive?: string;
        leaveActive?: string;
      };
  motionAppear?: boolean;
  motionEnter?: boolean;
  motionLeave?: boolean;
  motionDeadline?: number;
  onAppearPrepare?: (node: HTMLDivElement) => void | boolean | Promise<void>;
  onEnterPrepare?: (node: HTMLDivElement) => void | boolean | Promise<void>;
  onLeavePrepare?: (node: HTMLDivElement) => void | boolean | Promise<void>;
  onAppearStart?: TreeMotionHandler;
  onAppearActive?: TreeMotionHandler;
  onAppearEnd?: TreeMotionEndHandler;
  onEnterStart?: TreeMotionHandler;
  onEnterActive?: TreeMotionHandler;
  onEnterEnd?: TreeMotionEndHandler;
  onLeaveStart?: TreeMotionHandler;
  onLeaveActive?: TreeMotionHandler;
  onLeaveEnd?: TreeMotionEndHandler;
  onVisibleChanged?: (visible: boolean) => void;
}

export interface TreeMouseInfo<T extends TreeDataNode = TreeDataNode> {
  event: MouseEvent;
  node: TreeNodeAttribute<T>;
}

export interface TreeProps<T extends TreeDataNode = TreeDataNode>
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    | "onLoad"
    | "onSelect"
    | "onDragStart"
    | "onDragEnter"
    | "onDragOver"
    | "onDragLeave"
    | "onDragEnd"
    | "onDrop"
    | "draggable"
    | "style"
    | "onClick"
    | "onDoubleClick"
    | "onMouseEnter"
    | "onMouseLeave"
  > {
  treeData?: T[];
  prefixCls?: string;
  rootClassName?: string;
  rootStyle?: CSSProperties;
  children?: OctaneNode;
  fieldNames?: Partial<TreeFieldNames>;
  expandedKeys?: Key[];
  defaultExpandedKeys?: Key[];
  defaultExpandAll?: boolean;
  defaultExpandParent?: boolean;
  autoExpandParent?: boolean;
  selectedKeys?: Key[];
  defaultSelectedKeys?: Key[];
  checkedKeys?: Key[] | { checked: Key[]; halfChecked: Key[] };
  defaultCheckedKeys?: Key[];
  loadedKeys?: Key[];
  loadData?: (node: TreeNodeAttribute<T>) => Promise<unknown>;
  filterTreeNode?: (node: TreeNodeAttribute<T>) => boolean;
  /** @deprecated Ant Design's historical name for filterTreeNode. */
  filterAntTreeNode?: (node: TreeNodeAttribute<T>) => boolean;
  checkable?: boolean;
  checkStrictly?: boolean;
  selectable?: boolean;
  multiple?: boolean;
  disabled?: boolean;
  showLine?: boolean | TreeShowLineConfig<T>;
  showIcon?: boolean;
  blockNode?: boolean;
  indentSize?: number;
  icon?: OctaneNode | ((node: TreeNodeAttribute<T>) => OctaneNode);
  switcherIcon?: OctaneNode | ((node: TreeNodeAttribute<T>) => OctaneNode);
  switcherLoadingIcon?: OctaneNode;
  expandAction?: false | "click" | "doubleClick";
  titleRender?: (node: T) => OctaneNode;
  height?: number;
  itemHeight?: number;
  scrollWidth?: number;
  itemScrollOffset?: number;
  virtual?: boolean;
  motion?: TreeMotion | null;
  focusable?: boolean;
  activeKey?: Key | null;
  onActiveChange?: (key: Key | null) => void;
  direction?: "ltr" | "rtl";
  onClick?: (event: MouseEvent, node: TreeNodeAttribute<T>) => void;
  onDoubleClick?: (event: MouseEvent, node: TreeNodeAttribute<T>) => void;
  onMouseEnter?: (info: TreeMouseInfo<T>) => void;
  onMouseLeave?: (info: TreeMouseInfo<T>) => void;
  dropIndicatorRender?: (props: TreeDropIndicatorProps) => OctaneNode;
  draggable?: boolean | ((node: T) => boolean) | TreeDraggableConfig<T>;
  allowDrop?: (options: TreeDropPosition<T>) => boolean;
  style?: CSSProperties;
  onExpand?: (expandedKeys: Key[], info: TreeExpandInfo<T>) => void;
  onSelect?: (selectedKeys: Key[], info: TreeSelectInfo<T>) => void;
  onCheck?: (
    checkedKeys: Key[] | { checked: Key[]; halfChecked: Key[] },
    info: TreeCheckInfo<T>,
  ) => void;
  onLoad?: (loadedKeys: Key[], info: TreeLoadInfo<T>) => void;
  onRightClick?: (info: TreeRightClickInfo<T>) => void;
  onDragStart?: (info: TreeDragInfo<T>) => void;
  onDragEnter?: (info: TreeDragEnterInfo<T>) => void;
  onDragOver?: (info: TreeDragInfo<T>) => void;
  onDragLeave?: (info: TreeDragInfo<T>) => void;
  onDragEnd?: (info: TreeDragInfo<T>) => void;
  onDrop?: (info: TreeDropInfo<T>) => void;
  ref?: Ref<TreeRef>;
}

export type DirectoryTreeExpandAction = false | "click" | "doubleClick";

export interface DirectoryTreeProps<T extends TreeDataNode = TreeDataNode>
  extends TreeProps<T> {
  expandAction?: DirectoryTreeExpandAction;
}

export type TreeStyle = CSSProperties;
