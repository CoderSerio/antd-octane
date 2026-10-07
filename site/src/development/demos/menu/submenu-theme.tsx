// Adapted from Ant Design 5.29.3 (MIT), components/menu/demo/submenu-theme.tsx.

import type { MenuProps } from "antd-octane";
import { useState } from "octane";
import { MailOutlined } from "../../icons";

type MenuTheme = NonNullable<MenuProps["theme"]>;

import { Menu, Switch } from "antd-octane";

type MenuItem = Required<MenuProps>["items"][number];

const App = () => {
  const [menuTheme, setMenuTheme] = useState<MenuTheme>("light");
  const [current, setCurrent] = useState("1");

  const changeTheme = (value: boolean) => {
    setMenuTheme(value ? "dark" : "light");
  };

  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
  };

  const items: MenuItem[] = [
    {
      key: "sub1",
      icon: <MailOutlined />,
      label: "Navigation One",
      theme: menuTheme,
      children: [
        { key: "1", label: "Option 1" },
        { key: "2", label: "Option 2" },
        { key: "3", label: "Option 3" },
      ],
    },
    { key: "5", label: "Option 5" },
    { key: "6", label: "Option 6" },
  ];

  return (
    <>
      <Switch
        checked={menuTheme === "dark"}
        onChange={changeTheme}
        checkedChildren="Dark"
        unCheckedChildren="Light"
      />
      <br />
      <br />
      <Menu
        onClick={onClick}
        style={{ width: 256 }}
        openKeys={["sub1"]}
        selectedKeys={[current]}
        mode="vertical"
        theme="dark"
        items={items}
        getPopupContainer={(node) => node.parentNode as HTMLElement}
      />
    </>
  );
};

export default App;
