// Adapted from Ant Design 5.29.3 components/alert/style/index.ts (MIT).
import { useComponentTokens } from "../_util/tokens";
import type { AlertProps } from "./Alert";

export default function useAlertStyle(
  type: NonNullable<AlertProps["type"]>,
  withDescription: boolean,
) {
  const { token: t, component: c, base } = useComponentTokens("Alert");
  const status = {
    success: "Success",
    info: "Info",
    warning: "Warning",
    error: "Error",
  }[type];
  const colors = t as unknown as Record<string, string>;
  const padding = withDescription
    ? (c?.withDescriptionPadding ??
      `${t.paddingMD}px ${t.paddingContentHorizontalLG}px`)
    : (c?.defaultPadding ?? `${t.paddingContentVerticalSM}px 12px`);
  return {
    motion: t.motion,
    style: {
      ...base,
      "--ao-alert-bg": colors[`color${status}Bg`],
      "--ao-alert-border": colors[`color${status}Border`],
      "--ao-alert-icon": colors[`color${status}`],
      "--ao-alert-padding":
        typeof padding === "number" ? `${padding}px` : padding,
      "--ao-alert-icon-size": `${withDescription ? (c?.withDescriptionIconSize ?? t.fontSizeHeading3) : t.fontSize}px`,
      "--ao-alert-message-gap": `${t.marginXS}px`,
      "--ao-alert-icon-gap": `${withDescription ? t.marginSM : t.marginXS}px`,
      "--ao-alert-heading": `${withDescription ? t.fontSizeLG : t.fontSize}px`,
      "--ao-alert-heading-color": t.colorTextHeading,
      "--ao-alert-radius": `${t.borderRadiusLG}px`,
      "--ao-alert-close-size": `${t.fontSizeIcon}px`,
      "--ao-alert-close-color": t.colorIcon,
      "--ao-alert-close-hover": t.colorIconHover,
      "--ao-alert-border-width": `${t.lineWidth}px`,
      "--ao-alert-border-style": t.lineType,
      "--ao-alert-action-gap": `${t.marginXS}px`,
      "--ao-alert-link": t.colorLink,
      "--ao-alert-link-hover": t.colorLinkHover,
      "--ao-alert-link-active": t.colorLinkActive,
      "--ao-alert-link-disabled": t.colorTextDisabled,
      "--ao-alert-link-decoration": t.linkDecoration,
      "--ao-alert-link-hover-decoration": t.linkHoverDecoration,
      "--ao-alert-link-focus-decoration": t.linkFocusDecoration,
      "--ao-motion-mid": t.motionDurationMid,
      "--ao-motion-slow": t.motionDurationSlow,
      "--ao-motion-in-out-circ": t.motionEaseInOutCirc,
    },
  };
}
