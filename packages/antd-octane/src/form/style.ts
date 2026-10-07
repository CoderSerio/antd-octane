import type { CSSProperties } from "octane";
import { useComponentTokens } from "../_util/tokens";
import type { SizeType } from "../config-provider/context";
import { prepareComponentToken } from "./tokens";

function cssSize(value: number | string | undefined) {
  return typeof value === "number" ? `${value}px` : value;
}

// Form and Form.Item each resolve their own upstream component style tokens.
export function useFormStyle(
  size?: SizeType,
): CSSProperties & Record<`--${string}`, string | number | undefined> {
  const { token: t, component } = useComponentTokens("Form");
  const formToken = { ...prepareComponentToken(t), ...component };
  const height =
    size === "small"
      ? t.controlHeightSM
      : size === "large"
        ? t.controlHeightLG
        : t.controlHeight;
  return {
    "--ao-form-text": t.colorText,
    "--ao-form-secondary": t.colorTextDescription,
    "--ao-form-error": t.colorError,
    "--ao-form-font": t.fontFamily,
    "--ao-form-size": `${t.fontSize}px`,
    "--ao-form-line": t.lineHeight,
    "--ao-form-label-color": formToken.labelColor,
    "--ao-form-label-size": `${formToken.labelFontSize}px`,
    "--ao-form-label-height": cssSize(
      size === "small" || size === "large" ? height : formToken.labelHeight,
    ),
    "--ao-form-control-height": `${height}px`,
    "--ao-form-small-height": `${t.controlHeightSM}px`,
    "--ao-form-item-margin": `${formToken.itemMarginBottom}px`,
    "--ao-form-inline-margin": `${formToken.inlineItemMarginBottom}px`,
    "--ao-form-inline-gap": `${t.margin}px`,
    "--ao-form-required": formToken.labelRequiredMarkColor,
    "--ao-form-mark-gap": `${t.marginXXS}px`,
    "--ao-form-colon-start": `${formToken.labelColonMarginInlineStart}px`,
    "--ao-form-colon-end": `${formToken.labelColonMarginInlineEnd}px`,
    "--ao-form-vertical-padding": cssSize(formToken.verticalLabelPadding),
    "--ao-form-vertical-margin": cssSize(formToken.verticalLabelMargin),
  };
}
