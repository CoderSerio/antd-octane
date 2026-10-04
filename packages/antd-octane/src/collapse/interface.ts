import type { CSSProperties, HTMLAttributes, OctaneNode, Ref } from "octane";

export type CollapsibleType = "header" | "icon" | "disabled";
/** @deprecated Use start or end instead of left or right. */
export type ExpandIconPosition = "start" | "end" | "left" | "right";
export interface CollapseItem
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  key?: string | number;
  className?: string;
  style?: CSSProperties;
  label?: OctaneNode;
  styles?: Partial<Record<"header" | "body", CSSProperties>>;
  classNames?: Partial<Record<"header" | "body", string>>;
  extra?: OctaneNode;
  showArrow?: boolean;
  collapsible?: CollapsibleType;
  forceRender?: boolean;
  destroyInactivePanel?: boolean;
  onItemClick?: (key: string) => void;
  ref?: Ref<HTMLDivElement>;
}
export interface CollapsePanelProps extends Omit<CollapseItem, "label"> {
  header: OctaneNode;
  /** @deprecated Use collapsible="disabled" instead. */
  disabled?: boolean;
  prefixCls?: string;
  headerClass?: string;
}
export interface CollapseExpandIconProps {
  isActive?: boolean;
  header?: OctaneNode;
  className?: string;
  style?: CSSProperties;
  showArrow?: boolean;
  forceRender?: boolean;
  disabled?: boolean;
  extra?: OctaneNode;
  collapsible?: CollapsibleType;
}
export interface CollapseProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  items?: CollapseItem[];
  style?: CSSProperties;
  rootClassName?: string;
  prefixCls?: string;
  activeKey?: string | number | (string | number)[];
  defaultActiveKey?: string | number | (string | number)[];
  accordion?: boolean;
  bordered?: boolean;
  ghost?: boolean;
  size?: "small" | "middle" | "large";
  collapsible?: CollapsibleType;
  destroyOnHidden?: boolean;
  /** @deprecated Use destroyOnHidden instead. */
  destroyInactivePanel?: boolean;
  expandIcon?: (props: CollapseExpandIconProps) => OctaneNode;
  expandIconPosition?: ExpandIconPosition;
  onChange?: (keys: string[]) => void;
}
