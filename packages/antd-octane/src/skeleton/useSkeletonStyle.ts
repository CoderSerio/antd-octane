import { useComponentTokens } from "../_util/tokens";
export default function useSkeletonStyle() {
  const { token: t, component: c, base } = useComponentTokens("Skeleton");
  return {
    t,
    style: {
      ...base,
      "--ao-skeleton-from":
        c?.gradientFromColor ?? c?.color ?? t.colorFillContent,
      "--ao-skeleton-to":
        c?.gradientToColor ?? c?.colorGradientEnd ?? t.colorFill,
      "--ao-skeleton-title":
        typeof c?.titleHeight === "string"
          ? c.titleHeight
          : `${c?.titleHeight ?? t.controlHeight / 2}px`,
      "--ao-skeleton-radius": `${c?.blockRadius ?? t.borderRadiusSM}px`,
      "--ao-skeleton-margin": `${c?.paragraphMarginTop ?? t.marginLG + t.marginXXS}px`,
      "--ao-skeleton-line": `${c?.paragraphLiHeight ?? t.controlHeight / 2}px`,
      "--ao-skeleton-gap": `${t.marginSM}px`,
      "--ao-skeleton-title-gap": `${t.controlHeightSM}px`,
      "--ao-skeleton-row-gap": `${t.controlHeightXS}px`,
      "--ao-skeleton-avatar-gap": `${t.padding}px`,
      "--ao-skeleton-control-height": `${t.controlHeight}px`,
      "--ao-skeleton-control-height-lg": `${t.controlHeightLG}px`,
      "--ao-skeleton-control-height-sm": `${t.controlHeightSM}px`,
      "--ao-skeleton-element-radius": `${t.borderRadiusSM}px`,
      "--ao-skeleton-image-size": `${t.controlHeight * 1.5}px`,
    },
  };
}
