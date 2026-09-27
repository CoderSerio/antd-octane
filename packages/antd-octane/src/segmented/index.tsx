/** @jsxImportSource octane */
import type { CSSProperties, HTMLAttributes, OctaneNode } from "octane";
import { useId, useState } from "octane";
import { useComponentTokens } from "../_util/tokens";
import { useConfig } from "../config-provider";
export type SegmentedValue = string | number;
export interface SegmentedOption {
  value: SegmentedValue;
  label?: OctaneNode;
  icon?: OctaneNode;
  disabled?: boolean;
  title?: string;
  className?: string;
}
export interface SegmentedProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  options: (SegmentedValue | SegmentedOption)[];
  value?: SegmentedValue;
  defaultValue?: SegmentedValue;
  onChange?: (value: SegmentedValue) => void;
  disabled?: boolean;
  name?: string;
  size?: "small" | "middle" | "large";
  block?: boolean;
  vertical?: boolean;
  shape?: "default" | "round";
  style?: CSSProperties;
}
export function Segmented({
  options,
  value,
  defaultValue,
  onChange,
  disabled,
  name,
  size,
  block,
  vertical,
  shape = "default",
  className,
  style,
  onKeyDown,
  ...rest
}: SegmentedProps) {
  const config = useConfig();
  const { token: t, component: c, base } = useComponentTokens("Segmented");
  const id = useId();
  const items = options.map((o) =>
    typeof o === "object" ? o : { value: o, label: o },
  );
  const [inner, setInner] = useState(defaultValue ?? items[0]?.value);
  const current = value ?? inner;
  const blocked = disabled ?? config.componentDisabled;
  const actualSize = size ?? config.componentSize;
  const change = (next: SegmentedValue) => {
    if (next === current || blocked) return;
    if (value === undefined) setInner(next);
    onChange?.(next);
  };
  const height =
    actualSize === "large"
      ? t.controlHeightLG
      : actualSize === "small"
        ? t.controlHeightSM
        : t.controlHeight;
  return (
    <div
      {...rest}
      role="radiogroup"
      aria-orientation={vertical ? "vertical" : "horizontal"}
      className={[
        "ant-segmented",
        block && "ant-segmented-block",
        vertical && "ant-segmented-vertical",
        blocked && "ant-segmented-disabled",
        shape === "round" && "ant-segmented-shape-round",
        className,
      ]}
      style={{
        ...base,
        "--ao-seg-height": `${height}px`,
        "--ao-seg-padding": `${c?.trackPadding ?? t.lineWidthBold}px`,
        "--ao-seg-inline": `${(actualSize === "small" ? t.controlPaddingHorizontalSM : t.controlPaddingHorizontal) - t.lineWidth}px`,
        "--ao-seg-track": c?.trackBg ?? t.colorBgLayout,
        "--ao-seg-color": c?.itemColor ?? t.colorTextLabel,
        "--ao-seg-hover-color": c?.itemHoverColor ?? t.colorText,
        "--ao-seg-hover": c?.itemHoverBg ?? t.colorFillSecondary,
        "--ao-seg-selected": c?.itemSelectedBg ?? t.colorBgElevated,
        "--ao-seg-selected-color": c?.itemSelectedColor ?? t.colorText,
        "--ao-seg-active": c?.itemActiveBg ?? t.colorFill,
        "--ao-seg-disabled": t.colorTextDisabled,
        "--ao-seg-radius": `${actualSize === "large" ? t.borderRadius : actualSize === "small" ? t.borderRadiusXS : t.borderRadiusSM}px`,
        "--ao-radius": `${actualSize === "large" ? t.borderRadiusLG : actualSize === "small" ? t.borderRadiusSM : t.borderRadius}px`,
        "--ao-seg-shadow": t.boxShadowTertiary,
        "--ao-seg-font-size": `${actualSize === "large" ? t.fontSizeLG : t.fontSize}px`,
        ...style,
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || blocked) return;
        const delta = ["ArrowRight", "ArrowDown"].includes(event.key)
          ? 1
          : ["ArrowLeft", "ArrowUp"].includes(event.key)
            ? -1
            : 0;
        if (!delta && event.key !== "Home" && event.key !== "End") return;
        const enabled = items.filter((i) => !i.disabled);
        if (!enabled.length) return;
        event.preventDefault();
        const index = enabled.findIndex((i) => i.value === current);
        const next =
          event.key === "Home"
            ? enabled[0]
            : event.key === "End"
              ? enabled[enabled.length - 1]
              : enabled[
                  index < 0
                    ? delta > 0
                      ? 0
                      : enabled.length - 1
                    : (index + delta + enabled.length) % enabled.length
                ];
        change(next.value);
        const inputs =
          event.currentTarget.querySelectorAll<HTMLInputElement>("input");
        inputs[items.indexOf(next)]?.focus();
      }}
    >
      <div className="ant-segmented-group">
        {items.map((item, index) => (
          <label
            key={item.value}
            title={item.title}
            className={[
              "ant-segmented-item",
              current === item.value && "ant-segmented-item-selected",
              (blocked || item.disabled) && "ant-segmented-item-disabled",
              item.className,
            ]}
          >
            <input
              className="ant-segmented-item-input"
              type="radio"
              name={name ?? id}
              value={String(item.value)}
              disabled={blocked || item.disabled}
              checked={current === item.value}
              aria-label={
                item.label === undefined
                  ? (item.title ?? String(item.value))
                  : undefined
              }
              tabIndex={
                !item.disabled &&
                (current === item.value ||
                  (index === items.findIndex((i) => !i.disabled) &&
                    !items.some((i) => i.value === current && !i.disabled)))
                  ? 0
                  : -1
              }
              onChange={() => change(item.value)}
            />
            <div className="ant-segmented-item-label">
              {item.icon && (
                <span className="ant-segmented-item-icon">{item.icon}</span>
              )}
              {item.label ?? (!item.icon ? item.value : null)}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
