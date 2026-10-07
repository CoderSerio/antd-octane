/** @jsxImportSource octane */
import type { OctaneNode } from "octane";
import { EllipsisOutlined } from "../_util/layout-icons";
import { Button, type ButtonProps } from "../button";
import { useConfig } from "../config-provider";
import { Menu } from "../menu";
import { Space } from "../space";
import { DropdownPopup, type DropdownProps } from "./popup";

export type { DropdownProps } from "./popup";

export function Dropdown(props: DropdownProps) {
  const menu = props.menu;
  return (
    <DropdownPopup
      {...props}
      renderMenu={
        menu?.items
          ? (close) => (
              <Menu
                {...menu}
                className={["ant-dropdown-menu", menu.className]
                  .filter(Boolean)
                  .join(" ")}
                selectable={menu.selectable ?? false}
                onClick={(info) => {
                  menu.onClick?.(info);
                  if (!(menu.selectable && menu.multiple)) close();
                }}
              />
            )
          : undefined
      }
    />
  );
}

export interface DropdownButtonProps extends DropdownProps {
  type?: ButtonProps["type"];
  htmlType?: ButtonProps["htmlType"];
  size?: ButtonProps["size"];
  danger?: boolean;
  loading?: ButtonProps["loading"];
  onClick?: ButtonProps["onClick"];
  icon?: OctaneNode;
  href?: string;
  title?: string;
  buttonsRender?: (buttons: OctaneNode[]) => OctaneNode[];
}
function DropdownButton({
  type = "default",
  htmlType,
  size,
  danger,
  loading,
  onClick,
  icon,
  href,
  title,
  buttonsRender = (buttons) => buttons,
  children,
  className,
  style,
  ...dropdownProps
}: DropdownButtonProps) {
  const config = useConfig();
  const [left, right] = buttonsRender([
    <Button
      type={type}
      danger={danger}
      disabled={dropdownProps.disabled}
      loading={loading}
      onClick={onClick}
      htmlType={htmlType}
      href={href}
      title={title}
    >
      {children}
    </Button>,
    <Button type={type} danger={danger} icon={icon ?? <EllipsisOutlined />} />,
  ]);
  return (
    <Space.Compact
      block
      size={size}
      className={["ant-dropdown-button", className]}
      style={style}
    >
      {left}
      <Dropdown
        placement={config.direction === "rtl" ? "bottomLeft" : "bottomRight"}
        {...dropdownProps}
      >
        {right}
      </Dropdown>
    </Space.Compact>
  );
}
Dropdown.Button = DropdownButton;
