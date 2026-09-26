import type { CSSProperties } from "octane";
import { resolveComponentAlias } from "../theme/resolve";
import type { AliasToken, InputToken, ThemeConfig } from "../theme/types";

export function inputVariables(
  config: ThemeConfig,
  global: AliasToken,
): CSSProperties {
  const t = resolveComponentAlias(config, global, "Input");
  const overrides = config.components?.Input;
  const font = overrides?.inputFontSize ?? t.fontSize;
  const sm = overrides?.inputFontSizeSM ?? font;
  const lg = overrides?.inputFontSizeLG ?? t.fontSizeLG;
  const c: InputToken = {
    paddingBlock: Math.max(
      Math.round(((t.controlHeight - font * t.lineHeight) / 2) * 10) / 10 -
        t.lineWidth,
      0,
    ),
    paddingBlockSM: Math.max(
      Math.round(((t.controlHeightSM - sm * t.lineHeight) / 2) * 10) / 10 -
        t.lineWidth,
      0,
    ),
    paddingBlockLG: Math.max(
      Math.ceil(((t.controlHeightLG - lg * t.lineHeightLG) / 2) * 10) / 10 -
        t.lineWidth,
      0,
    ),
    paddingInline: t.paddingSM - t.lineWidth,
    paddingInlineSM: t.controlPaddingHorizontalSM - t.lineWidth,
    paddingInlineLG: t.controlPaddingHorizontal - t.lineWidth,
    activeBorderColor: t.colorPrimary,
    hoverBorderColor: t.colorPrimaryHover,
    activeShadow: `0 0 0 ${t.controlOutlineWidth}px ${t.controlOutline}`,
    errorActiveShadow: `0 0 0 ${t.controlOutlineWidth}px ${t.colorErrorOutline}`,
    warningActiveShadow: `0 0 0 ${t.controlOutlineWidth}px ${t.colorWarningOutline}`,
    hoverBg: t.colorBgContainer,
    activeBg: t.colorBgContainer,
    inputFontSize: font,
    inputFontSizeSM: sm,
    inputFontSizeLG: lg,
    ...overrides,
  };
  const variables: Record<string, string | number> = {
    "--ao-input-font": t.fontFamily,
    "--ao-input-font-size": `${c.inputFontSize}px`,
    "--ao-input-font-sm": `${c.inputFontSizeSM}px`,
    "--ao-input-font-lg": `${c.inputFontSizeLG}px`,
    "--ao-input-line": t.lineHeight,
    "--ao-input-line-lg": t.lineHeightLG,
    "--ao-input-color": t.colorText,
    "--ao-input-bg": t.colorBgContainer,
    "--ao-input-border": t.colorBorder,
    "--ao-input-width": `${t.lineWidth}px`,
    "--ao-input-line-type": t.lineType,
    "--ao-input-radius": `${t.borderRadius}px`,
    "--ao-input-radius-sm": `${t.borderRadiusSM}px`,
    "--ao-input-radius-lg": `${t.borderRadiusLG}px`,
    "--ao-input-pb": `${c.paddingBlock}px`,
    "--ao-input-pb-sm": `${c.paddingBlockSM}px`,
    "--ao-input-pb-lg": `${c.paddingBlockLG}px`,
    "--ao-input-pi": `${c.paddingInline}px`,
    "--ao-input-pi-sm": `${c.paddingInlineSM}px`,
    "--ao-input-pi-lg": `${c.paddingInlineLG}px`,
    "--ao-input-hover": c.hoverBorderColor,
    "--ao-input-active": c.activeBorderColor,
    "--ao-input-shadow": c.activeShadow,
    "--ao-input-hover-bg": c.hoverBg,
    "--ao-input-active-bg": c.activeBg,
    "--ao-input-error": t.colorError,
    "--ao-input-error-hover": t.colorErrorBorderHover,
    "--ao-input-warning-hover": t.colorWarningBorderHover,
    "--ao-input-warning": t.colorWarning,
    "--ao-input-error-shadow": c.errorActiveShadow,
    "--ao-input-warning-shadow": c.warningActiveShadow,
    "--ao-input-placeholder": t.colorTextPlaceholder,
    "--ao-input-disabled": t.colorTextDisabled,
    "--ao-input-disabled-bg": t.colorBgContainerDisabled,
    "--ao-input-duration": t.motionDurationMid,
  };
  return variables;
}
