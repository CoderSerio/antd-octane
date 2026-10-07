// Adapted from Ant Design 5.29.3 components/result/style/index.ts (MIT).
import { useComponentTokens } from "../_util/tokens";
import type { ResultStatusType } from "./index";

export default function useResultStyle(status: ResultStatusType) {
  const { token: t, component: c, base } = useComponentTokens("Result");
  const extraMargin = c?.extraMargin ?? `${t.paddingLG}px 0 0 0`;
  return {
    ...base,
    "--ao-result-color":
      status === "success"
        ? t.colorSuccess
        : status === "error"
          ? t.colorError
          : status === "warning"
            ? t.colorWarning
            : t.colorInfo,
    "--ao-result-title-color": t.colorTextHeading,
    "--ao-result-title-line": t.lineHeightHeading3,
    "--ao-result-title-size": `${c?.titleFontSize ?? t.fontSizeHeading3}px`,
    "--ao-result-subtitle-size": `${c?.subtitleFontSize ?? t.fontSize}px`,
    "--ao-result-icon-size": `${c?.iconFontSize ?? t.fontSizeHeading3 * 3}px`,
    "--ao-result-extra-margin":
      typeof extraMargin === "number" ? `${extraMargin}px` : extraMargin,
    "--ao-result-padding": `${t.paddingLG * 2}px ${t.paddingXL}px`,
    "--ao-result-content-padding": `${t.paddingLG}px ${t.padding * 2.5}px`,
    "--ao-result-content-bg": t.colorFillAlter,
    "--ao-result-gap": `${t.marginXS}px`,
    "--ao-result-extra-gap": `${t.paddingXS}px`,
    "--ao-result-link": t.colorLink,
    "--ao-result-link-hover": t.colorLinkHover,
    "--ao-result-link-active": t.colorLinkActive,
    "--ao-result-link-disabled": t.colorTextDisabled,
    "--ao-result-link-decoration": t.linkDecoration,
    "--ao-result-link-hover-decoration": t.linkHoverDecoration,
    "--ao-result-link-focus-decoration": t.linkFocusDecoration,
    "--ao-result-link-motion": t.motionDurationSlow,
    "--ao-result-block-gap": `${t.paddingLG}px`,
  };
}
