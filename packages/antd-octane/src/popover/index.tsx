/** @jsxImportSource octane */
import type { OctaneNode } from "octane";
import { resolvePresetColor } from "../_util/colors";
import cssSize from "../_util/css-size";
import {
  Floating,
  type FloatingProps,
  floatingArrowStyleVars,
} from "../_util/floating";
import { useComponentTokens } from "../_util/tokens";
import { useConfig } from "../config-provider";

export type { TooltipRef } from "../tooltip";
export interface PopoverProps extends Omit<FloatingProps, "onOpenChange"> {
  prefixCls?: string;
  title?: OctaneNode | (() => OctaneNode);
  content?: OctaneNode | (() => OctaneNode);
  color?: string;
  onOpenChange?: (open: boolean, event?: Event) => void;
}

export function Popover({ title, content, color, ...props }: PopoverProps) {
  const config = useConfig();
  const { token: t, component: c, base } = useComponentTokens("Popover");
  const prefix = config.getPrefixCls("popover", props.prefixCls);
  const heading = typeof title === "function" ? title() : title;
  const body = typeof content === "function" ? content() : content;
  const contents =
    heading || body ? (
      <>
        {heading && (
          <div
            className={[
              prefix !== "ant-popover" && `${prefix}-title`,
              "ant-popover-title",
            ]}
          >
            {heading}
          </div>
        )}
        {body && (
          <div
            className={[
              prefix !== "ant-popover" && `${prefix}-inner-content`,
              "ant-popover-inner-content",
            ]}
          >
            {body}
          </div>
        )}
      </>
    ) : null;
  const componentTokens = c as
    | (typeof c & {
        width?: number | string;
        minWidth?: number | string;
        titlePadding?: number | string;
        titleMarginBottom?: number;
        titleBorderBottom?: string;
        innerContentPadding?: number | string;
        innerPadding?: number | string;
      })
    | undefined;
  const wireframe = t.wireframe;
  const titlePaddingBlockDist =
    t.controlHeight - (t.fontHeight ?? t.fontSize * t.lineHeight);
  const defaultTitlePadding = wireframe
    ? `${titlePaddingBlockDist / 2}px ${t.padding}px ${titlePaddingBlockDist / 2 - t.lineWidth}px`
    : "0px";
  return (
    <Floating
      {...props}
      kind="popover"
      prefixCls={prefix}
      content={contents}
      onOpenChange={(open, event) => props.onOpenChange?.(open, event)}
      zIndex={props.zIndex ?? c?.zIndexPopup ?? t.zIndexPopupBase + 30}
      popupStyle={{
        ...base,
        "--ao-popup-bg": color
          ? resolvePresetColor(color, t)
          : t.colorBgElevated,
        "--ao-popup-color": t.colorText,
        "--ao-popup-radius": `${t.borderRadiusLG}px`,
        "--ao-popup-shadow": t.boxShadowSecondary,
        "--ao-popup-motion-duration": t.motionDurationMid,
        "--ao-popup-motion-easing": t.motionEaseOutCirc,
        "--ao-popup-motion-leave-easing": t.motionEaseInOutCirc,
        "--ao-popup-padding":
          cssSize(componentTokens?.innerPadding) ??
          (wireframe ? "0px" : "12px"),
        "--ao-popup-title-width":
          cssSize(
            c?.titleMinWidth ??
              componentTokens?.width ??
              componentTokens?.minWidth,
          ) ?? "177px",
        "--ao-popup-title-gap":
          cssSize(componentTokens?.titleMarginBottom) ??
          (wireframe ? "0px" : `${t.marginXS}px`),
        "--ao-popup-title-padding":
          cssSize(componentTokens?.titlePadding) ?? defaultTitlePadding,
        "--ao-popup-title-border":
          componentTokens?.titleBorderBottom ??
          (wireframe
            ? `${t.lineWidth}px ${t.lineType} ${t.colorSplit}`
            : "none"),
        "--ao-popup-content-padding":
          cssSize(componentTokens?.innerContentPadding) ??
          (wireframe ? `${t.paddingSM}px ${t.padding}px` : "0px"),
        "--ao-popup-title-weight": t.fontWeightStrong,
        "--ao-popup-title-color": t.colorTextHeading,
        ...floatingArrowStyleVars(t, t.borderRadiusLG),
      }}
    />
  );
}
