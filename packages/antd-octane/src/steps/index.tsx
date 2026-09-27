/** @jsxImportSource octane */
import type { CSSProperties, HTMLAttributes, OctaneNode } from "octane";
import { useBreakpoint } from "../_util/responsive";
import { useComponentTokens } from "../_util/tokens";
export type StepStatus = "wait" | "process" | "finish" | "error";
export interface StepItem {
  key?: string | number;
  title?: OctaneNode;
  subTitle?: OctaneNode;
  description?: OctaneNode;
  icon?: OctaneNode;
  status?: StepStatus;
  disabled?: boolean;
}
export interface StepsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  items?: StepItem[];
  current?: number;
  initial?: number;
  status?: StepStatus;
  size?: "default" | "small";
  direction?: "horizontal" | "vertical";
  responsive?: boolean;
  labelPlacement?: "horizontal" | "vertical";
  onChange?: (current: number) => void;
  style?: CSSProperties;
}
export function Steps({
  items = [],
  current = 0,
  initial = 0,
  status = "process",
  size = "default",
  direction = "horizontal",
  responsive = true,
  labelPlacement = "horizontal",
  onChange,
  className,
  style,
  ...rest
}: StepsProps) {
  const { token: t, component: c, base } = useComponentTokens("Steps");
  const screens = useBreakpoint(responsive);
  const vertical =
    direction === "vertical" || (responsive && screens.xs === true);
  return (
    <div
      {...rest}
      className={[
        "ant-steps",
        vertical ? "ant-steps-vertical" : "ant-steps-horizontal",
        `ant-steps-${size}`,
        labelPlacement === "vertical" &&
          !vertical &&
          "ant-steps-label-vertical",
        className,
      ]}
      style={{
        ...base,
        "--ao-steps-icon": `${size === "small" ? (c?.iconSizeSM ?? t.fontSizeHeading3) : (c?.iconSize ?? t.controlHeight)}px`,
        "--ao-steps-title": `${size === "small" ? t.fontSize : t.fontSizeLG}px`,
        "--ao-steps-title-line": `${size === "small" ? (c?.iconSizeSM ?? t.fontSizeHeading3) : t.controlHeight}px`,
        "--ao-steps-icon-font": `${size === "small" ? t.fontSizeSM : t.fontSize}px`,
        "--ao-steps-gap": `${t.margin}px`,
        "--ao-steps-description": `${c?.descriptionMaxWidth ?? 140}px`,
        "--ao-steps-wait": t.colorFillContent,
        "--ao-steps-primary-bg": t.colorPrimaryBg,
        "--ao-steps-error": t.colorError,
        "--ao-steps-error-bg": t.colorErrorBg,
        "--ao-steps-light": t.colorTextLightSolid,
        ...style,
      }}
    >
      {items.map((item, index) => {
        const step = index + initial;
        const state =
          item.status ??
          (step === current ? status : step < current ? "finish" : "wait");
        const content = (
          <>
            <span className="ant-steps-item-icon">
              <span className="ant-steps-icon">
                {item.icon ??
                  (state === "finish"
                    ? "✓"
                    : state === "error"
                      ? "×"
                      : step + 1)}
              </span>
            </span>
            <span className="ant-steps-item-content">
              <span className="ant-steps-item-title">
                {item.title}
                {item.subTitle !== undefined && (
                  <span className="ant-steps-item-subtitle">
                    {item.subTitle}
                  </span>
                )}
              </span>
              {item.description !== undefined && (
                <span className="ant-steps-item-description">
                  {item.description}
                </span>
              )}
            </span>
          </>
        );
        return (
          <div
            key={item.key ?? index}
            className={[
              "ant-steps-item",
              `ant-steps-item-${state}`,
              item.disabled && "ant-steps-item-disabled",
              item.icon !== undefined && "ant-steps-item-custom",
            ]}
            aria-current={step === current ? "step" : undefined}
          >
            {onChange ? (
              <button
                className="ant-steps-item-container"
                type="button"
                disabled={item.disabled}
                onClick={() => {
                  if (step !== current) onChange(step);
                }}
              >
                {content}
              </button>
            ) : (
              <div className="ant-steps-item-container">{content}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
