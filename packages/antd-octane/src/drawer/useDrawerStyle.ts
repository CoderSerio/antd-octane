import { useComponentTokens } from "../_util/tokens";

export function useDrawerStyle(
  placement: "left" | "right" | "top" | "bottom",
  zIndex?: number,
) {
  const { token: t, component: c, base } = useComponentTokens("Drawer");
  return {
    motion: t.motion,
    style: {
      ...base,
      "--ao-dialog-z": zIndex || (c?.zIndexPopup ?? t.zIndexPopupBase),
      "--ao-drawer-z": c?.zIndexPopup ?? t.zIndexPopupBase,
      "--ao-dialog-mask": t.colorBgMask,
      "--ao-dialog-shadow":
        placement === "left"
          ? t.boxShadowDrawerLeft
          : placement === "right"
            ? t.boxShadowDrawerRight
            : placement === "top"
              ? t.boxShadowDrawerUp
              : t.boxShadowDrawerDown,
      "--ao-dialog-bg": t.colorBgElevated,
      "--ao-drawer-padding": `${t.paddingLG}px`,
      "--ao-drawer-header-padding": `${t.padding}px ${t.paddingLG}px`,
      "--ao-drawer-border": `${t.lineWidth}px ${t.lineType} ${t.colorSplit}`,
      "--ao-drawer-close-size": `${t.fontSizeLG + t.paddingXS}px`,
      "--ao-drawer-close-radius": `${t.borderRadiusSM}px`,
      "--ao-drawer-close-gap": `${t.marginXS}px`,
      "--ao-drawer-close-color": t.colorIcon,
      "--ao-drawer-close-hover-color": t.colorIconHover,
      "--ao-drawer-close-hover-bg": t.colorBgTextHover,
      "--ao-drawer-close-active-bg": t.colorBgTextActive,
      "--ao-drawer-focus": `${t.lineWidthFocus}px solid ${t.colorPrimaryBorder}`,
      "--ao-drawer-weight": t.fontWeightStrong,
      "--ao-motion-mid": t.motionDurationMid,
      "--ao-drawer-title-size": `${t.fontSizeLG}px`,
      "--ao-drawer-title-line": t.lineHeightLG,
      "--ao-drawer-footer-padding": `${c?.footerPaddingBlock ?? t.paddingXS}px ${c?.footerPaddingInline ?? t.padding}px`,
      "--ao-motion-slow": t.motionDurationSlow,
    },
  };
}
