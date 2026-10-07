// Native adaptation of Ant Design 5.29.3 components/app/style/index.ts (MIT).
import { useComponentTokens } from "../../_util/tokens";
import { useStyleContext } from "../../style/context";
import {
  escapeClass,
  styleId,
  useStyleRegister,
} from "../../style/useStyleRegister";

export const prepareComponentToken = () => ({});

export default function useStyle(prefixCls: string) {
  const { token } = useComponentTokens("App");
  const { layer } = useStyleContext();
  const declarations = `color:${token.colorText};font-size:${token.fontSize}px;line-height:${token.lineHeight};font-family:${token.fontFamily}`;
  const hashId = styleId("app", `${prefixCls}:${declarations}:${layer}`);
  const selector = `:where(.${hashId}).${escapeClass(prefixCls)}`;
  const css = `${selector}{${declarations}}${selector}.${escapeClass(`${prefixCls}-rtl`)}{direction:rtl}`;
  useStyleRegister("app", hashId, layer ? `@layer antd{${css}}` : css, layer);
  return hashId;
}
