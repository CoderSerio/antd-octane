import type { OctaneNode } from "octane";
import { Children, Fragment, isValidElement, useMemo } from "octane";
import { responsiveValue, type Screens } from "../../_util/responsive";
import {
  type DescriptionsItem,
  DescriptionsItemComponent,
  type DescriptionsItemType,
} from "../item";

export interface InternalDescriptionsItemType
  extends Omit<DescriptionsItem, "span"> {
  span?: number;
  filled?: boolean;
}

export default function useItems(
  screens: Screens,
  items?: DescriptionsItemType[],
  children?: OctaneNode,
) {
  return useMemo(() => {
    const legacyItems: DescriptionsItem[] = [];
    // rc-util/toArray flattens Fragment descriptors before reading Item props.
    const collect = (nodes: OctaneNode) =>
      Children.forEach(nodes, (child) => {
        if (!isValidElement<DescriptionsItem>(child)) return;
        if (child.type === Fragment) {
          collect(child.children ?? child.props.children);
        } else if (child.type === DescriptionsItemComponent) {
          legacyItems.push({
            ...child.props,
            key: child.props.key ?? child.key,
            children: child.children ?? child.props.children,
          });
        }
      });
    collect(children);
    return (items ?? legacyItems).map(
      ({ span, ...item }): InternalDescriptionsItemType =>
        span === "filled"
          ? { ...item, filled: true }
          : { ...item, span: responsiveValue(span, screens, 1) },
    );
  }, [screens, items, children]);
}
