/** @jsxImportSource octane */
import type { CSSProperties, OctaneNode } from "octane";
import type { Responsive } from "../_util/responsive";

export interface DescriptionsItem {
  key?: string | number;
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
  label?: OctaneNode;
  children?: OctaneNode;
  span?: number | "filled" | Responsive<number>;
  /** @deprecated Please use `styles.label` instead. */
  labelStyle?: CSSProperties;
  /** @deprecated Please use `styles.content` instead. */
  contentStyle?: CSSProperties;
  styles?: Partial<Record<"label" | "content", CSSProperties>>;
  classNames?: Partial<Record<"label" | "content", string>>;
}

export type DescriptionsItemProps = DescriptionsItem;

/** antd 5 name for an item supplied through the `items` prop. */
export type DescriptionsItemType = Omit<DescriptionsItem, "prefixCls">;

/** JSX structure only; Descriptions consumes the item descriptor. */
export function DescriptionsItemComponent({ children }: DescriptionsItem) {
  return children ?? null;
}
