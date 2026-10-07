// Derived from Ant Design 5.29.3 components/modal/style/index.ts (MIT).
import { useMediaQuery } from "../_util/responsive";
import { useComponentTokens } from "../_util/tokens";
import { useConfig } from "../config-provider";
import { useStyleContext } from "../style/context";
import { styleId, useStyleRegister } from "../style/useStyleRegister";
import { genModalStyle } from "./style";
export function useModalStyle(zIndex?: number, customPrefix?: string) {
  const { token: t, component: c, base } = useComponentTokens("Modal");
  const config = useConfig();
  const prefixCls = config.getPrefixCls("modal", customPrefix);
  const { layer } = useStyleContext();
  const hashId = styleId("modal", `${prefixCls}:${layer}`);
  const rules = genModalStyle(prefixCls, hashId, config.getPrefixCls());
  useStyleRegister(
    "modal",
    hashId,
    layer ? `@layer antd{${rules}}` : rules,
    layer,
  );
  const narrow = useMediaQuery(`(max-width: ${t.screenSMMax}px)`);
  const confirmIconSize = t.fontHeight ?? Math.round(t.fontSize * t.lineHeight);
  return {
    hashId,
    token: t,
    style: {
      ...base,
      "--ao-dialog-z": zIndex ?? t.zIndexPopupBase,
      "--ao-dialog-mask": t.colorBgMask,
      "--ao-dialog-shadow": t.boxShadow,
      "--ao-dialog-bg": c?.contentBg ?? t.colorBgElevated,
      "--ao-dialog-radius": `${t.borderRadiusLG}px`,
      "--ao-dialog-padding": t.wireframe
        ? 0
        : `${t.paddingMD}px ${t.paddingContentHorizontalLG}px`,
      "--ao-dialog-title-size": `${c?.titleFontSize ?? t.fontSizeHeading5}px`,
      "--ao-dialog-title-line": c?.titleLineHeight ?? t.lineHeightHeading5,
      "--ao-dialog-title": c?.titleColor ?? t.colorTextHeading,
      "--ao-dialog-header": c?.headerBg ?? t.colorBgElevated,
      "--ao-dialog-footer": c?.footerBg ?? "transparent",
      "--ao-dialog-gap": `${t.marginXS}px`,
      "--ao-confirm-icon-size": `${confirmIconSize}px`,
      "--ao-confirm-icon-gap": `${t.wireframe ? t.margin : t.marginSM}px`,
      "--ao-confirm-icon-top": "0px",
      "--ao-confirm-info": t.colorInfo,
      "--ao-confirm-icon-title-top":
        "calc((var(--ao-dialog-title-size) * var(--ao-dialog-title-line) - var(--ao-confirm-icon-size)) / 2)",
      "--ao-confirm-paragraph-gap": `${t.marginXS}px`,
      "--ao-confirm-paragraph-margin": `${t.marginSM}px`,
      "--ao-confirm-btns-margin": `${t.wireframe ? t.marginLG : t.marginSM}px`,
      "--ao-confirm-body-padding": t.wireframe
        ? `${t.padding * 2}px ${t.padding * 2}px ${t.paddingLG}px`
        : 0,
      "--ao-confirm-title-color": t.colorTextHeading,
      "--ao-confirm-weight": t.fontWeightStrong,
      "--ao-dialog-bottom-padding": `${t.paddingLG}px`,
      "--ao-modal-viewport-gap": `${narrow ? 16 : t.margin * 2}px`,
      "--ao-modal-margin-block": `${narrow ? t.marginXS : 0}px`,
      "--ao-dialog-margin": `${t.margin}px`,
      "--ao-dialog-button-gap": `${t.marginXS}px`,
      "--ao-motion-slow": t.motionDurationSlow,
      "--ao-motion-mid": t.motionDurationMid,
      "--ao-motion-out-circ": t.motionEaseOutCirc,
      "--ao-motion-in-out-circ": t.motionEaseInOutCirc,
      "--ao-modal-weight": t.fontWeightStrong,
      "--ao-modal-header-padding": t.wireframe
        ? `${t.padding}px ${t.paddingLG}px`
        : 0,
      "--ao-modal-header-border": t.wireframe
        ? `${t.lineWidth}px ${t.lineType} ${t.colorSplit}`
        : "none",
      "--ao-modal-header-gap": `${t.wireframe ? 0 : t.marginXS}px`,
      "--ao-modal-body-padding": `${t.wireframe ? t.paddingLG : 0}px`,
      "--ao-modal-footer-padding": t.wireframe
        ? `${t.paddingXS}px ${t.padding}px`
        : 0,
      "--ao-modal-footer-border": t.wireframe
        ? `${t.lineWidth}px ${t.lineType} ${t.colorSplit}`
        : "none",
      "--ao-modal-footer-radius": t.wireframe
        ? `0 0 ${t.borderRadiusLG}px ${t.borderRadiusLG}px`
        : 0,
      "--ao-modal-footer-gap": `${t.wireframe ? 0 : t.marginSM}px`,
      "--ao-modal-close-offset": `${(t.fontSizeHeading5 * t.lineHeightHeading5 + t.padding * 2 - t.controlHeight) / 2}px`,
      "--ao-modal-close-size": `${t.controlHeight}px`,
      "--ao-modal-close-font": `${t.fontSizeLG}px`,
      "--ao-modal-close-z": t.zIndexPopupBase + 10,
      "--ao-modal-close-radius": `${t.borderRadiusSM}px`,
      "--ao-modal-close-color": t.colorIcon,
      "--ao-modal-close-hover": t.colorIconHover,
      "--ao-modal-close-hover-bg": t.colorBgTextHover,
      "--ao-modal-close-active-bg": t.colorBgTextActive,
      "--ao-modal-focus": `${t.lineWidthFocus}px solid ${t.colorPrimaryBorder}`,
    },
  };
}
