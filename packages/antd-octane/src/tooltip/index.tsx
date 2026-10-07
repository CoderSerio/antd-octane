/** @jsxImportSource octane */
import type { OctaneNode } from "octane";
import { resolvePresetColor } from "../_util/colors";
import {
  Floating,
  type FloatingProps,
  floatingArrowStyleVars,
} from "../_util/floating";
import { useComponentTokens } from "../_util/tokens";

export type { TooltipRef } from "../_util/floating";
export interface TooltipProps extends Omit<FloatingProps, "onOpenChange"> {
  title?: OctaneNode | (() => OctaneNode);
  overlay?: OctaneNode | (() => OctaneNode);
  color?: string;
  onOpenChange?: (open: boolean) => void;
}
export function Tooltip({ title, overlay, color, ...props }: TooltipProps) {
  const { token: t, component: c, base } = useComponentTokens("Tooltip");
  const memoOverlay = title === 0 ? title : overlay || title || "";
  const noTitle = !title && !overlay && title !== 0;
  return (
    <Floating
      {...props}
      kind="tooltip"
      content={typeof memoOverlay === "function" ? memoOverlay() : memoOverlay}
      tooltipHasTitle={!noTitle}
      zIndex={props.zIndex ?? c?.zIndexPopup ?? t.zIndexPopupBase + 70}
      popupStyle={{
        ...base,
        "--ao-popup-bg": color
          ? resolvePresetColor(color, t)
          : t.colorBgSpotlight,
        "--ao-popup-color": t.colorTextLightSolid,
        "--ao-popup-radius": `${t.borderRadius}px`,
        "--ao-popup-shadow": t.boxShadowSecondary,
        "--ao-popup-motion-duration": t.motionDurationFast,
        "--ao-popup-motion-easing": t.motionEaseOutCirc,
        "--ao-popup-motion-leave-easing": t.motionEaseInOutCirc,
        ...floatingArrowStyleVars(
          t,
          t.borderRadius,
          Math.min(t.borderRadiusOuter, 4),
        ),
        "--ao-popup-padding": `${t.paddingSM / 2}px ${t.paddingXS}px`,
        "--ao-popup-minheight": `${t.controlHeight}px`,
      }}
    />
  );
}
