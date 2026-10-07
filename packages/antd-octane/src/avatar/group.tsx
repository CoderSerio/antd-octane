/** @jsxImportSource octane */

import type { OctaneNode } from "octane";
import {
  Children,
  cloneElement,
  Fragment,
  isValidElement,
  useContext,
} from "octane";
import { useComponentTokens } from "../_util/tokens";
import { useConfig } from "../config-provider";
import { Popover } from "../popover";
import { InternalAvatar } from "./avatar";
import { AvatarGroupContext } from "./context";
import type { AvatarGroupProps } from "./types";

export type { AvatarGroupProps };

function toArray(children: OctaneNode): OctaneNode[] {
  return Children.toArray(children).flatMap((child) =>
    isValidElement(child) && child.type === Fragment
      ? toArray(child.children ?? child.props.children)
      : [child],
  );
}

export function AvatarGroup({
  prefixCls,
  rootClassName,
  className,
  style,
  maxCount,
  maxStyle,
  maxPopoverPlacement,
  maxPopoverTrigger,
  max,
  size,
  shape,
  children,
  ...rest
}: AvatarGroupProps) {
  const { token: t, component: c, base } = useComponentTokens("Avatar");
  const config = useConfig();
  const parentGroup = useContext(AvatarGroupContext);
  const items = toArray(children).map((child, index) =>
    isValidElement(child)
      ? cloneElement(child, { key: `avatar-key-${index}` })
      : child,
  );
  const count = max?.count || maxCount;
  const hiddenItems = count && count < items.length ? items.slice(count) : [];
  const shownItems = hiddenItems.length ? items.slice(0, count) : items;
  const hiddenCount = hiddenItems.length;
  const popover = max?.popover;
  const prefix = config.getPrefixCls("avatar", prefixCls);
  const groupClass = `${prefix}-group`;
  const moreStyle = max?.style || maxStyle;
  const popoverRootStyle = {
    "--ao-avatar-group-space": `${c?.groupSpace ?? t.marginXXS}px`,
    ...popover?.styles?.root,
  };
  const groupContext = {
    size: size || parentGroup.size,
    shape: shape || parentGroup.shape,
  };

  return (
    <AvatarGroupContext value={groupContext}>
      <div
        {...rest}
        className={[
          groupClass,
          groupClass !== "ant-avatar-group" && "ant-avatar-group",
          config.direction === "rtl" && `${groupClass}-rtl`,
          className,
          rootClassName,
        ]
          .filter(Boolean)
          .join(" ")}
        style={{
          ...base,
          boxSizing: "border-box",
          fontFamily: t.fontFamily,
          fontSize: t.fontSize,
          direction: config.direction,
          "--ao-avatar-group-overlap": `${c?.groupOverlapping ?? -t.marginXS}px`,
          "--ao-avatar-group-border": c?.groupBorderColor ?? t.colorBorderBg,
          "--ao-avatar-group-space": `${c?.groupSpace ?? t.marginXXS}px`,
          ...style,
        }}
      >
        {shownItems}
        {hiddenCount > 0 && (
          <Popover
            destroyOnHidden
            content={hiddenItems}
            {...(popover ?? {})}
            placement={popover?.placement || maxPopoverPlacement || "top"}
            trigger={popover?.trigger || maxPopoverTrigger || "hover"}
            styles={{
              ...popover?.styles,
              root: popoverRootStyle,
            }}
            classNames={{
              ...popover?.classNames,
              root: [
                `${groupClass}-popover`,
                "ant-avatar-group-popover",
                popover?.classNames?.root,
              ]
                .filter(Boolean)
                .join(" "),
            }}
          >
            <InternalAvatar
              className={`${prefix}-group-overflow`}
              style={moreStyle}
            >
              +{items.length - (count ?? 0)}
            </InternalAvatar>
          </Popover>
        )}
      </div>
    </AvatarGroupContext>
  );
}
