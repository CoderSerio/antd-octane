/** @jsxImportSource octane */
import type { OctaneNode } from "octane";
import { cloneElement, isValidElement, useId } from "octane";
import { useComponentTokens } from "../_util/tokens";
import { devUseWarning } from "../_util/warning";
import { useConfig } from "../config-provider";
import type {
  CollapseExpandIconProps,
  CollapseItem,
  CollapsePanelProps,
} from "./interface";
import PanelContent from "./PanelContent";
import { collapseClass } from "./util";

/** State passed to legacy children by rc-collapse's useItems convention. */
export interface LegacyPanelProps extends CollapsePanelProps {
  panelKey?: string;
  isActive?: boolean;
  accordion?: boolean;
  expandIcon?: InternalPanelProps["expandIcon"];
}

export function CollapsePanel({
  header,
  panelKey = "",
  isActive = false,
  accordion = false,
  expandIcon,
  onItemClick,
  collapsible,
  destroyInactivePanel = false,
  prefixCls,
  ...props
}: LegacyPanelProps) {
  const warning = devUseWarning("Collapse.Panel");
  warning.deprecated(
    !("disabled" in props),
    "disabled",
    'collapsible="disabled"',
  );
  const config = useConfig();
  const { token } = useComponentTokens("Collapse");
  const id = useId();
  return (
    <InternalPanel
      item={{ ...props, label: header, destroyInactivePanel }}
      panelKey={panelKey}
      panelId={`${id}-${encodeURIComponent(panelKey)}`}
      prefixCls={config.getPrefixCls("collapse", prefixCls)}
      active={isActive}
      accordion={accordion}
      collapsible={collapsible}
      destroy={destroyInactivePanel}
      motionEnabled={token.motion}
      direction={config.direction}
      expandIcon={expandIcon}
      onItemClick={(key) => onItemClick?.(key)}
    />
  );
}

export interface InternalPanelProps {
  item: CollapseItem & {
    prefixCls?: string;
    headerClass?: string;
    header?: OctaneNode;
    disabled?: boolean;
  };
  panelKey: string;
  panelId: string;
  prefixCls: string;
  active: boolean;
  accordion: boolean;
  collapsible?: CollapseItem["collapsible"];
  destroy: boolean;
  motionEnabled: boolean;
  direction: "ltr" | "rtl";
  expandIcon?: (props: CollapseExpandIconProps) => OctaneNode;
  onItemClick: (key: string) => void;
}

export default function InternalPanel({
  item,
  panelKey,
  panelId,
  prefixCls,
  active,
  accordion,
  collapsible,
  destroy,
  motionEnabled,
  direction,
  expandIcon,
  onItemClick,
}: InternalPanelProps) {
  const {
    label,
    children,
    key: _key,
    prefixCls: itemPrefix,
    header: _header,
    disabled: _disabled,
    headerClass,
    styles,
    classNames,
    extra,
    showArrow = true,
    forceRender,
    destroyInactivePanel,
    onItemClick: itemClick,
    collapsible: _collapsible,
    ref,
    className,
    ...rest
  } = item;
  const prefix = itemPrefix ?? prefixCls;
  const disabled = collapsible === "disabled";
  const toggle = () => {
    if (!disabled) {
      onItemClick(panelKey);
      itemClick?.(panelKey);
    }
  };
  const interactive = {
    role: accordion ? "tab" : "button",
    "aria-expanded": active,
    "aria-disabled": disabled,
    "aria-controls": panelId,
    tabIndex: disabled ? -1 : 0,
    onClick: toggle,
    onKeyDown: (event: KeyboardEvent) => {
      if (event.key === "Enter") toggle();
    },
  };
  const panelProps: CollapseExpandIconProps = {
    isActive: active,
    header: label,
    className,
    style: rest.style,
    showArrow,
    forceRender,
    disabled,
    extra,
    collapsible,
  };
  const customIcon = expandIcon?.(panelProps);
  const icon = expandIcon ? (
    isValidElement(customIcon) ? (
      cloneElement(customIcon, {
        className: [customIcon.props.className, collapseClass(prefix, "arrow")],
      })
    ) : (
      customIcon
    )
  ) : (
    <span
      className={["anticon", "anticon-right", collapseClass(prefix, "arrow")]}
      role="img"
      aria-label={active ? "expanded" : "collapsed"}
    >
      <svg
        viewBox="64 64 896 896"
        focusable="false"
        width="1em"
        height="1em"
        fill="currentColor"
        aria-hidden="true"
        style={{
          transform: active
            ? `rotate(${direction === "rtl" ? -90 : 90}deg)`
            : undefined,
        }}
      >
        <path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z" />
      </svg>
    </span>
  );
  return (
    <div
      {...rest}
      ref={ref}
      className={[
        collapseClass(prefix, "item"),
        active && collapseClass(prefix, "item-active"),
        disabled && collapseClass(prefix, "item-disabled"),
        !showArrow && itemPrefix && collapseClass(prefix, "no-arrow"),
        className,
      ]}
    >
      {/* rc-collapse binds the whole header only when no narrower trigger is requested. */}
      <div
        id={`${panelId}-header`}
        className={[
          headerClass,
          collapseClass(prefix, "header"),
          collapsible && collapseClass(prefix, `collapsible-${collapsible}`),
          classNames?.header,
        ]}
        style={styles?.header}
        {...(!["header", "icon"].includes(collapsible ?? "")
          ? interactive
          : {})}
      >
        {showArrow && icon && (
          <div
            className={collapseClass(prefix, "expand-icon")}
            {...(["header", "icon"].includes(collapsible ?? "")
              ? interactive
              : {})}
          >
            {icon}
          </div>
        )}
        <span
          className={collapseClass(prefix, "header-text")}
          {...(collapsible === "header" ? interactive : {})}
        >
          {label}
        </span>
        {extra !== null &&
          extra !== undefined &&
          typeof extra !== "boolean" && (
            <div className={collapseClass(prefix, "extra")}>{extra}</div>
          )}
      </div>
      <PanelContent
        active={active}
        forceRender={forceRender}
        destroy={destroyInactivePanel ?? destroy}
        motionEnabled={motionEnabled}
        id={panelId}
        labelledBy={`${panelId}-header`}
        prefixCls={prefix}
        role={accordion ? "tabpanel" : undefined}
        bodyClassName={classNames?.body}
        bodyStyle={styles?.body}
      >
        {children}
      </PanelContent>
    </div>
  );
}
