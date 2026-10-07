// Ant Design 5.29.3 components/progress/style/index.ts (MIT).
import { useComponentTokens } from "../_util/tokens";
export default function useProgressStyle(size: unknown) {
  const { token: t, component: c, base } = useComponentTokens("Progress");
  return {
    ...base,
    "--ao-progress-color": c?.defaultColor ?? t.colorInfo,
    "--ao-progress-trail": c?.remainingColor ?? t.colorFillSecondary,
    "--ao-progress-radius": `${c?.lineBorderRadius ?? 100}px`,
    "--ao-progress-text": c?.circleTextColor ?? t.colorText,
    "--ao-progress-font": `${size === "small" ? t.fontSizeSM : t.fontSize}px`,
    "--ao-progress-font-sm": `${t.fontSizeSM}px`,
    "--ao-progress-circle-text": c?.circleTextFontSize ?? "1em",
    "--ao-progress-circle-icon":
      c?.circleIconFontSize ?? `${t.fontSize / t.fontSizeSM}em`,
    "--ao-progress-step-gap": `${t.marginXXS / 2}px`,
    "--ao-progress-text-gap": `${t.marginXS}px`,
    "--ao-progress-bottom-gap": `${t.marginXXS}px`,
    "--ao-progress-inner-padding": `${t.paddingXXS}px`,
    "--ao-progress-success": t.colorSuccess,
    "--ao-progress-error": t.colorError,
    "--ao-progress-slow": t.motionDurationSlow,
    "--ao-progress-ease": t.motionEaseInOutCirc,
    "--ao-progress-active-ease": t.motionEaseOutQuint,
  };
}
