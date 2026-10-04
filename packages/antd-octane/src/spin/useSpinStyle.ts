import { useComponentTokens } from "../_util/tokens";

export default function useSpinStyle() {
  const { token: t, component: c, base } = useComponentTokens("Spin");
  return {
    ...base,
    "--ao-spin-default-size": `${c?.dotSize ?? t.controlHeightLG / 2}px`,
    "--ao-spin-size-sm": `${c?.dotSizeSM ?? t.controlHeightLG * 0.35}px`,
    "--ao-spin-size-lg": `${c?.dotSizeLG ?? t.controlHeight}px`,
    "--ao-spin-height":
      typeof c?.contentHeight === "string"
        ? c.contentHeight
        : `${c?.contentHeight ?? 400}px`,
    "--ao-spin-margin": `${t.marginXXS}px`,
    "--ao-spin-z": t.zIndexPopupBase,
    "--ao-spin-mask": t.colorBgMask,
    "--ao-spin-white": t.colorWhite,
    "--ao-spin-light": t.colorTextLightSolid,
    "--ao-spin-fill": t.colorFillSecondary,
    "--ao-spin-slow": t.motionDurationSlow,
    "--ao-spin-mid": t.motionDurationMid,
    "--ao-spin-ease": t.motionEaseInOutCirc,
  };
}
