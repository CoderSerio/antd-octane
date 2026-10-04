/** @jsxImportSource octane */
import type { CSSProperties, HTMLAttributes, OctaneNode, Ref } from "octane";
import {
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "octane";
import cssSize from "../_util/css-size";
import { useComponentTokens } from "../_util/tokens";
import { useConfig } from "../config-provider";
import MotionThumb from "./MotionThumb";
export type SegmentedValue = string | number;
export interface SegmentedOption<
  ValueType extends SegmentedValue = SegmentedValue,
> {
  value: ValueType;
  label?: OctaneNode;
  icon?: OctaneNode;
  disabled?: boolean;
  title?: string;
  className?: string;
}

interface SegmentedLabeledOptionWithoutIcon<
  ValueType extends SegmentedValue = SegmentedValue,
> extends SegmentedOption<ValueType> {
  label: OctaneNode;
}

interface SegmentedLabeledOptionWithIcon<
  ValueType extends SegmentedValue = SegmentedValue,
> extends Omit<SegmentedOption<ValueType>, "label"> {
  label?: OctaneNode;
  icon: OctaneNode;
}

export type SegmentedLabeledOption<
  ValueType extends SegmentedValue = SegmentedValue,
> =
  | SegmentedLabeledOptionWithoutIcon<ValueType>
  | SegmentedLabeledOptionWithIcon<ValueType>;

export type SegmentedOptions<
  ValueType extends SegmentedValue = SegmentedValue,
> = (
  | ValueType
  | SegmentedOption<ValueType>
  | SegmentedLabeledOption<ValueType>
)[];

export interface SegmentedProps<
  ValueType extends SegmentedValue = SegmentedValue,
> extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "onChange" | "defaultValue" | "value" | "ref"
  > {
  ref?: Ref<HTMLDivElement>;
  prefixCls?: string;
  options: SegmentedOptions<ValueType>;
  value?: ValueType;
  defaultValue?: ValueType;
  onChange?: (value: ValueType) => void;
  disabled?: boolean;
  name?: string;
  size?: "small" | "middle" | "large";
  block?: boolean;
  vertical?: boolean;
  shape?: "default" | "round";
  style?: CSSProperties;
  rootClassName?: string;
  motionName?: string;
  direction?: "ltr" | "rtl";
}

type NormalizedOption<ValueType extends SegmentedValue> =
  SegmentedOption<ValueType>;

export function Segmented<ValueType extends SegmentedValue = SegmentedValue>({
  ref,
  options = [],
  prefixCls,
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
  rootClassName,
  style,
  onKeyDown,
  motionName = "thumb-motion",
  direction: _direction,
  ...rest
}: SegmentedProps<ValueType>) {
  const config = useConfig();
  const { token: t, component: c, base } = useComponentTokens("Segmented");
  const id = useId();
  const items: NormalizedOption<ValueType>[] = options.map((option) =>
    typeof option === "object"
      ? (option as NormalizedOption<ValueType>)
      : { value: option, label: String(option), title: String(option) },
  );
  const outer = useRef<HTMLDivElement | null>(null);
  useImperativeHandle(ref, () => outer.current as HTMLDivElement, []);
  const [thumbShow, setThumbShow] = useState(false);
  const [keyboard, setKeyboard] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inner, setInner] = useState<ValueType | undefined>(
    value !== undefined
      ? value
      : defaultValue !== undefined
        ? defaultValue
        : items[0]?.value,
  );
  const previousValue = useRef(value);
  useLayoutEffect(() => {
    if (previousValue.current !== value && value === undefined)
      setInner(undefined);
    previousValue.current = value;
  }, [value]);
  const current = value !== undefined ? value : inner;
  const blocked = Boolean(disabled);
  const actualSize = size ?? "middle";
  const prefix = config.getPrefixCls("segmented", prefixCls);
  const change = (next: ValueType) => {
    if (blocked) return;
    setInner(next);
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
      role="radiogroup"
      aria-label="segmented control"
      tabIndex={blocked ? undefined : 0}
      aria-orientation={vertical ? "vertical" : "horizontal"}
      {...rest}
      ref={outer}
      className={[
        prefix !== "ant-segmented" && prefix,
        "ant-segmented",
        actualSize === "small" && `${prefix}-sm`,
        actualSize === "small" && "ant-segmented-sm",
        actualSize === "large" && `${prefix}-lg`,
        actualSize === "large" && "ant-segmented-lg",
        block && "ant-segmented-block",
        vertical && "ant-segmented-vertical",
        blocked && "ant-segmented-disabled",
        shape === "round" && `${prefix}-shape-round`,
        shape === "round" && "ant-segmented-shape-round",
        config.direction === "rtl" && `${prefix}-rtl`,
        config.direction === "rtl" && "ant-segmented-rtl",
        config.segmented?.className,
        className,
        rootClassName,
      ]}
      style={{
        ...base,
        direction: config.direction,
        "--ao-seg-focus-width": `${t.lineWidthFocus}px`,
        "--ao-seg-duration": t.motion ? t.motionDurationMid : "0s",
        "--ao-seg-motion-duration": t.motion ? t.motionDurationSlow : "0s",
        "--ao-seg-motion-ease": t.motionEaseInOut,
        "--ao-seg-thumb-padding": `${t.paddingXXS}px`,
        "--ao-seg-icon-gap": `${t.marginSM / 2}px`,
        "--ao-seg-height": `${height}px`,
        "--ao-seg-padding": cssSize(c?.trackPadding) ?? `${t.lineWidthBold}px`,
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
        ...config.segmented?.style,
        ...style,
      }}
      onKeyDown={onKeyDown}
    >
      <div className={[`${prefix}-group`, "ant-segmented-group"]}>
        <MotionThumb
          prefixCls={prefix}
          motionName={motionName}
          containerRef={outer}
          value={current}
          getValueIndex={(next) =>
            items.findIndex((item) => item.value === next)
          }
          vertical={vertical}
          direction={config.direction}
          motion={t.motion}
          onMotionStart={() => setThumbShow(true)}
          onMotionEnd={() => setThumbShow(false)}
        />
        {items.map((item) => (
          <label
            key={item.value}
            onMouseDown={() => setKeyboard(false)}
            className={[
              prefix !== "ant-segmented" && `${prefix}-item`,
              "ant-segmented-item",
              current === item.value && !thumbShow && `${prefix}-item-selected`,
              current === item.value &&
                !thumbShow &&
                "ant-segmented-item-selected",
              current === item.value &&
                keyboard &&
                focused &&
                `${prefix}-item-focused`,
              current === item.value &&
                keyboard &&
                focused &&
                "ant-segmented-item-focused",
              (blocked || item.disabled) && "ant-segmented-item-disabled",
              item.className,
            ]}
          >
            <input
              className={[
                prefix !== "ant-segmented" && `${prefix}-item-input`,
                "ant-segmented-item-input",
              ]}
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
              onChange={() => change(item.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyUp={(event) => {
                if (event.key === "Tab") setKeyboard(true);
              }}
              onKeyDown={(event) => {
                const delta =
                  event.key === "ArrowLeft" || event.key === "ArrowUp"
                    ? -1
                    : event.key === "ArrowRight" || event.key === "ArrowDown"
                      ? 1
                      : 0;
                if (!delta || blocked || !items.length) return;
                // rc-segmented offsets within the full options list, including
                // disabled entries. Value changes never replace the source of truth.
                const index = items.findIndex(
                  (option) => option.value === current,
                );
                const next =
                  items[(index + delta + items.length) % items.length];
                if (next) change(next.value);
              }}
            />
            <div
              title={
                item.title ??
                (!item.icon && typeof item.label !== "object"
                  ? item.label?.toString()
                  : undefined)
              }
              className={[
                prefix !== "ant-segmented" && `${prefix}-item-label`,
                "ant-segmented-item-label",
              ]}
            >
              {item.icon ? (
                <>
                  <span
                    className={[
                      prefix !== "ant-segmented" && `${prefix}-item-icon`,
                      "ant-segmented-item-icon",
                    ]}
                  >
                    {item.icon}
                  </span>
                  {item.label && <span>{item.label}</span>}
                </>
              ) : (
                item.label
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
