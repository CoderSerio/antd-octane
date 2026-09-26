import type { OctaneNode } from "octane";
import { Floating, type FloatingProps } from "../_util/floating";
import { useComponentTokens } from "../_util/tokens";
export interface PopoverProps extends FloatingProps {
  title?: OctaneNode | (() => OctaneNode);
  content?: OctaneNode | (() => OctaneNode);
  color?: string;
}
export function Popover({ title, content, color, ...props }: PopoverProps) {
  const { token: t, component: c, base } = useComponentTokens("Popover");
  const heading = typeof title === "function" ? title() : title;
  const body = typeof content === "function" ? content() : content;
  const contents =
    (heading !== undefined &&
      heading !== null &&
      heading !== false &&
      heading !== "") ||
    (body !== undefined && body !== null && body !== false && body !== "") ? (
      <>
        {heading !== undefined &&
          heading !== null &&
          heading !== false &&
          heading !== "" && <div className="ant-popover-title">{heading}</div>}
        {body !== undefined && (
          <div className="ant-popover-inner-content">{body}</div>
        )}
      </>
    ) : null;
  return (
    <Floating
      {...props}
      kind="popover"
      content={contents}
      zIndex={props.zIndex ?? c?.zIndexPopup ?? t.zIndexPopupBase + 30}
      popupStyle={{
        ...base,
        "--ao-popup-bg": color ?? t.colorBgElevated,
        "--ao-popup-color": t.colorText,
        "--ao-popup-radius": `${t.borderRadiusLG}px`,
        "--ao-popup-shadow": t.boxShadowSecondary,
        "--ao-popup-padding":
          typeof c?.innerPadding === "number"
            ? `${c.innerPadding}px`
            : (c?.innerPadding ?? `${t.paddingSM}px`),
        "--ao-popup-title-width": `${c?.titleMinWidth ?? 177}px`,
        "--ao-popup-title-gap": `${t.marginXS}px`,
        "--ao-popup-title-weight": t.fontWeightStrong,
        "--ao-popup-title-color": t.colorTextHeading,
      }}
    />
  );
}
