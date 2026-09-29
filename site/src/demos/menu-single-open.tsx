import { Menu } from "antd-octane";
import { useState } from "octane";

const items = [
  {
    key: "mail",
    label: "Navigation One",
    children: [
      { key: "one", label: "Option 1" },
      { key: "two", label: "Option 2" },
    ],
  },
  {
    key: "apps",
    label: "Navigation Two",
    children: [
      { key: "three", label: "Option 3" },
      { key: "four", label: "Option 4" },
    ],
  },
  {
    key: "settings",
    label: "Navigation Three",
    children: [{ key: "five", label: "Option 5" }],
  },
];

export function SingleOpenDemo() {
  const [openKeys, setOpenKeys] = useState<string[]>(["mail"]);
  return (
    <Menu
      mode="inline"
      style={{ width: 280, maxWidth: "100%" }}
      items={items}
      openKeys={openKeys}
      onOpenChange={(next) => {
        const opened = next.find((key) => !openKeys.includes(key));
        setOpenKeys(opened ? [opened] : []);
      }}
    />
  );
}
