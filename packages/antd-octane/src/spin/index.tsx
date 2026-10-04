// Ant Design 5.29.3 components/spin/index.tsx (MIT), adapted to Octane.
import type { CSSProperties, ElementDescriptor, OctaneNode } from "octane";
import { useEffect, useState } from "octane";
import { devUseWarning } from "../_util/warning";
import { useConfig } from "../config-provider";
import Indicator from "./Indicator";
import usePercent from "./usePercent";
import useSpinStyle from "./useSpinStyle";

export type SpinSize = "small" | "default" | "large";
export type SpinIndicator = ElementDescriptor<HTMLElement>;
export interface SpinProps {
  prefixCls?: string;
  className?: string;
  rootClassName?: string;
  spinning?: boolean;
  style?: CSSProperties;
  size?: SpinSize;
  tip?: OctaneNode;
  delay?: number;
  wrapperClassName?: string;
  indicator?: SpinIndicator;
  children?: OctaneNode;
  fullscreen?: boolean;
  percent?: number | "auto";
}
export type SpinType = ((props: SpinProps) => ElementDescriptor) & {
  setDefaultIndicator: (indicator: OctaneNode) => void;
};
let defaultIndicator: OctaneNode;
function shouldDelay(spinning?: boolean, delay?: number): boolean {
  return !!spinning && !!delay && !Number.isNaN(Number(delay));
}
function InternalSpin({
  prefixCls: customPrefix,
  spinning: customSpinning = true,
  delay = 0,
  className,
  rootClassName,
  size = "default",
  tip,
  wrapperClassName,
  style,
  children,
  fullscreen = false,
  indicator,
  percent,
  ...restProps
}: SpinProps) {
  const config = useConfig();
  const prefixCls = config.getPrefixCls("spin", customPrefix);
  const base = useSpinStyle();
  const [spinning, setSpinning] = useState(
    () => customSpinning && !shouldDelay(customSpinning, delay),
  );
  const mergedPercent = usePercent(spinning, percent);
  useEffect(() => {
    if (customSpinning) {
      // The upstream debounce is invoked once per effect; a cancellable timer
      // preserves its trailing call, including zero and negative delays.
      const timer = setTimeout(() => setSpinning(true), delay);
      return () => clearTimeout(timer);
    }
    setSpinning(false);
  }, [delay, customSpinning]);
  const nested = typeof children !== "undefined" && !fullscreen;
  const warning = devUseWarning("Spin");
  warning(
    !tip || nested || fullscreen,
    "usage",
    "`tip` only work in nest or fullscreen pattern.",
  );
  const classes = (suffix: string) => [
    `ant-spin${suffix}`,
    `${prefixCls}${suffix}`,
  ];
  const spinner = (
    <div
      {...restProps}
      style={{ ...base, ...config.spin?.style, ...style }}
      className={[
        ...classes(""),
        config.spin?.className,
        size === "small" && classes("-sm"),
        size === "large" && classes("-lg"),
        spinning && classes("-spinning"),
        !!tip && classes("-show-text"),
        config.direction === "rtl" && classes("-rtl"),
        className,
        !fullscreen && rootClassName,
      ]}
      aria-live="polite"
      aria-busy={spinning}
    >
      <Indicator
        prefixCls={prefixCls}
        indicator={indicator ?? config.spin?.indicator ?? defaultIndicator}
        percent={mergedPercent}
      />
      {tip && (nested || fullscreen) ? (
        <div className={classes("-text")}>{tip}</div>
      ) : null}
    </div>
  );
  if (nested)
    return (
      <div
        {...restProps}
        className={[...classes("-nested-loading"), wrapperClassName]}
        style={base}
      >
        {spinning && <div key="loading">{spinner}</div>}
        <div
          className={[...classes("-container"), spinning && classes("-blur")]}
          key="container"
        >
          {children}
        </div>
      </div>
    );
  if (fullscreen)
    return (
      <div
        className={[
          ...classes("-fullscreen"),
          spinning && classes("-fullscreen-show"),
          rootClassName,
        ]}
        style={base}
      >
        {spinner}
      </div>
    );
  return spinner;
}
export const Spin = Object.assign(InternalSpin, {
  setDefaultIndicator(indicator: OctaneNode) {
    defaultIndicator = indicator;
  },
});
