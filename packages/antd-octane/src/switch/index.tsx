/** @jsxImportSource octane */
import type { ButtonHTMLAttributes, CSSProperties, OctaneNode } from "octane";
import { useState } from "octane";
import { useConfig } from "../config-provider";
import { resolveComponentAlias } from "../theme/resolve";
export interface SwitchProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "onChange" | "onClick" | "value" | "defaultValue" | "children"
  > {
  style?: CSSProperties;
  checked?: boolean;
  defaultChecked?: boolean;
  value?: boolean;
  defaultValue?: boolean;
  loading?: boolean;
  size?: "small" | "default";
  checkedChildren?: OctaneNode;
  unCheckedChildren?: OctaneNode;
  onChange?: (checked: boolean, event: MouseEvent | KeyboardEvent) => void;
  onClick?: (checked: boolean, event: MouseEvent) => void;
}
export function Switch(props: SwitchProps) {
  const config = useConfig();
  const {
    checked,
    value,
    defaultChecked,
    defaultValue,
    loading = false,
    size,
    checkedChildren,
    unCheckedChildren,
    onChange,
    onClick,
    onKeyDown,
    disabled = config.componentDisabled ?? false,
    className,
    style,
    ...rest
  } = props;
  const [inner, setInner] = useState(defaultChecked ?? defaultValue ?? false);
  const current = checked ?? value ?? inner;
  const blocked = disabled || loading;
  const t = resolveComponentAlias(config.theme, config.token, "Switch");
  const c = config.theme.components?.Switch;
  const small = (size ?? config.componentSize) === "small";
  const height = small
    ? (c?.trackHeightSM ?? t.controlHeight / 2)
    : (c?.trackHeight ?? t.fontSize * t.lineHeight);
  const handle = small
    ? (c?.handleSizeSM ?? t.controlHeight / 2 - 4)
    : (c?.handleSize ?? t.fontSize * t.lineHeight - 4);
  const change = (next: boolean, event: MouseEvent | KeyboardEvent) => {
    if (blocked || next === current) return;
    if (checked === undefined && value === undefined) setInner(next);
    onChange?.(next, event);
  };
  return (
    <button
      {...rest}
      type="button"
      role="switch"
      aria-checked={current}
      aria-busy={loading || undefined}
      disabled={blocked}
      className={[
        "ant-switch",
        current && "ant-switch-checked",
        small && "ant-switch-small",
        blocked && "ant-switch-disabled",
        className,
      ]}
      style={{
        "--ao-switch-height": `${height}px`,
        "--ao-switch-width": `${small ? (c?.trackMinWidthSM ?? t.controlHeight - 4) : (c?.trackMinWidth ?? t.fontSize * t.lineHeight * 2)}px`,
        "--ao-switch-handle": `${handle}px`,
        "--ao-switch-padding": `${c?.trackPadding ?? 2}px`,
        "--ao-switch-handle-bg": c?.handleBg ?? t.colorWhite,
        "--ao-switch-shadow":
          c?.handleShadow ?? "0 2px 4px 0 rgba(0, 35, 11, 0.2)",
        "--ao-switch-bg": t.colorTextQuaternary,
        "--ao-switch-hover": t.colorTextTertiary,
        "--ao-switch-primary": t.colorPrimary,
        "--ao-switch-primary-hover": t.colorPrimaryHover,
        "--ao-switch-focus": t.colorPrimaryBorder,
        "--ao-switch-duration": t.motion ? t.motionDurationMid : "0s",
        "--ao-switch-font": t.fontFamily,
        "--ao-switch-color": t.colorTextLightSolid,
        "--ao-switch-text": t.colorText,
        "--ao-switch-font-size": `${t.fontSize}px`,
        "--ao-switch-inner-font": `${t.fontSizeSM}px`,
        "--ao-switch-opacity": t.opacityLoading,
        ...style,
      }}
      onClick={(event) => {
        change(!current, event);
        onClick?.(!current, event);
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          change(event.key === "ArrowRight", event);
        }
      }}
    >
      <span className="ant-switch-handle" aria-hidden="true">
        {loading && <span className="ant-switch-loading-icon" />}
      </span>
      <span className="ant-switch-inner">
        {current ? checkedChildren : unCheckedChildren}
      </span>
    </button>
  );
}
