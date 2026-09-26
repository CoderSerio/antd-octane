import type { OctaneNode } from "octane";
import { Floating, type FloatingProps } from "../_util/floating";
import { useComponentTokens } from "../_util/tokens";
export interface TooltipProps extends FloatingProps {
  title?: OctaneNode | (() => OctaneNode);
  color?: string;
}
export function Tooltip({ title, color, ...props }: TooltipProps) {
  const { token: t, component: c, base } = useComponentTokens("Tooltip");
  return (
    <Floating
      {...props}
      kind="tooltip"
      content={typeof title === "function" ? title() : title}
      zIndex={props.zIndex ?? c?.zIndexPopup ?? t.zIndexPopupBase + 70}
      popupStyle={{
        ...base,
        "--ao-popup-bg": color ?? t.colorBgSpotlight,
        "--ao-popup-color": t.colorTextLightSolid,
        "--ao-popup-radius": `${t.borderRadius}px`,
        "--ao-popup-shadow": t.boxShadowSecondary,
        "--ao-popup-padding": `${t.paddingSM / 2}px ${t.paddingXS}px`,
        "--ao-popup-minheight": `${t.controlHeight}px`,
      }}
    />
  );
}
