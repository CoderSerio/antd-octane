import type {
  ComponentType,
  CSSProperties,
  ElementDescriptor,
  HTMLAttributes,
  OctaneNode,
  Ref,
} from "octane";
import type { DropdownProps } from "../dropdown";
export interface TabItem {
  key: string;
  label: OctaneNode;
  children?: OctaneNode;
  disabled?: boolean;
  closable?: boolean;
  closeIcon?: OctaneNode;
  forceRender?: boolean;
  destroyOnHidden?: boolean;
  destroyInactiveTabPane?: boolean;
  icon?: OctaneNode;
  className?: string;
  style?: CSSProperties;
}
/** Compatibility child API retained by antd 5 alongside `items`. */
export interface TabPaneProps
  extends Omit<TabItem, "key" | "label" | "children"> {
  key?: string | number;
  tab?: OctaneNode;
  label?: OctaneNode;
  children?: OctaneNode;
}
export interface TabsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  items?: TabItem[];
  children?: OctaneNode;
  renderTabBar?: TabsRenderTabBar;
  activeKey?: string;
  defaultActiveKey?: string;
  onChange?: (key: string) => void;
  onTabClick?: (key: string, event: MouseEvent | KeyboardEvent) => void;
  type?: "line" | "card" | "editable-card";
  size?: "small" | "middle" | "large";
  tabPosition?: "top" | "bottom" | "left" | "right";
  centered?: boolean;
  tabBarGutter?: number;
  tabBarStyle?: CSSProperties;
  tabBarExtraContent?: OctaneNode | { left?: OctaneNode; right?: OctaneNode };
  destroyOnHidden?: boolean;
  destroyInactiveTabPane?: boolean;
  hideAdd?: boolean;
  addIcon?: OctaneNode;
  moreIcon?: OctaneNode;
  more?: TabsMoreProps;
  animated?: boolean | { inkBar?: boolean; tabPane?: boolean };
  popupClassName?: string;
  getPopupContainer?: DropdownProps["getPopupContainer"];
  prefixCls?: string;
  ref?: Ref<{ nativeElement: HTMLDivElement | null }>;
  onTabScroll?: (info: {
    direction: "left" | "right" | "top" | "bottom";
  }) => void;
  indicatorSize?: number | ((origin: number) => number);
  indicator?: {
    size?: number | ((origin: number) => number);
    align?: "start" | "center" | "end";
  };
  removeIcon?: OctaneNode;
  rootClassName?: string;
  onEdit?: (
    keyOrEvent: string | MouseEvent | KeyboardEvent,
    action: "add" | "remove",
  ) => void;
  style?: CSSProperties;
}

export interface TabsAnimatedConfig {
  inkBar?: boolean;
  tabPane?: boolean;
}
export interface TabsEditableConfig {
  showAdd?: boolean;
  addIcon?: OctaneNode;
  removeIcon?: OctaneNode;
  onEdit: (
    action: "add" | "remove",
    info: { key?: string; event: MouseEvent | KeyboardEvent },
  ) => void;
}
/** Native counterpart of the props supplied to antd 5's DefaultTabBar. */
export interface TabsTabBarProps {
  id: string;
  activeKey?: string;
  tabPosition: "top" | "bottom" | "left" | "right";
  rtl: boolean;
  mobile: boolean;
  animated?: TabsAnimatedConfig;
  editable?: TabsEditableConfig;
  extra?: TabsProps["tabBarExtraContent"];
  more?: TabsProps["more"];
  tabBarGutter?: number;
  onTabClick: (key: string, event: MouseEvent | KeyboardEvent) => void;
  onTabScroll?: TabsProps["onTabScroll"];
  getPopupContainer?: TabsProps["getPopupContainer"];
  popupClassName?: string;
  indicator?: TabsProps["indicator"];
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLDivElement | null>;
  locale?: {
    dropdownAriaLabel?: string;
    removeAriaLabel?: string;
    addAriaLabel?: string;
  };
  /** Legacy descriptors supplied to renderTabBar, as in upstream. */
  panes?: OctaneNode;
  children?: (node: ElementDescriptor) => OctaneNode;
}
export type TabsRenderTabBar = (
  props: TabsTabBarProps,
  DefaultTabBar: ComponentType<TabsTabBarProps>,
) => OctaneNode;

export interface TabsMoreProps
  extends Omit<DropdownProps, "children" | "menu" | "trigger"> {
  icon?: OctaneNode;
  trigger?: "hover" | "click" | DropdownProps["trigger"];
}
