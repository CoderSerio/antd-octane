import type { CSSProperties } from "octane";
import type { AliasToken } from "../theme/types";

/** Ant Design 5.29.3 components/form/style/index.ts component tokens. */
export interface ComponentToken {
  labelRequiredMarkColor: string;
  labelColor: string;
  labelFontSize: number;
  labelHeight: number | string;
  labelColonMarginInlineStart: number;
  labelColonMarginInlineEnd: number;
  itemMarginBottom: number;
  inlineItemMarginBottom: number;
  verticalLabelPadding: CSSProperties["padding"];
  verticalLabelMargin: CSSProperties["margin"];
}

export function prepareComponentToken(token: AliasToken): ComponentToken {
  return {
    labelRequiredMarkColor: token.colorError,
    labelColor: token.colorTextHeading,
    labelFontSize: token.fontSize,
    labelHeight: token.controlHeight,
    labelColonMarginInlineStart: token.marginXXS / 2,
    labelColonMarginInlineEnd: token.marginXS,
    itemMarginBottom: token.marginLG,
    inlineItemMarginBottom: 0,
    verticalLabelPadding: `0 0 ${token.paddingXS}px`,
    verticalLabelMargin: 0,
  };
}
