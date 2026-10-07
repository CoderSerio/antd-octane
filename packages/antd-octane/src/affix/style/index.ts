// Adapted from Ant Design 5.29.3 components/affix/style/index.ts and genCommonStyle (MIT).
import type { CSSProperties } from "octane";
import { useComponentTokens } from "../../_util/tokens";
import type { AliasToken } from "../../theme/types";

export const prepareComponentToken = (token: AliasToken) => ({
  zIndexPopup: token.zIndexBase + 10,
});

export default function useStyle(): CSSProperties {
  const { token, component } = useComponentTokens("Affix");
  return {
    position: "fixed",
    zIndex: component?.zIndexPopup ?? prepareComponentToken(token).zIndexPopup,
    boxSizing: "border-box",
    fontFamily: token.fontFamily,
    fontSize: token.fontSize,
  };
}
