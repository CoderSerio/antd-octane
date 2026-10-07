import type { DropdownProps, MenuProps } from "antd-octane";
import { Dropdown, Space } from "antd-octane";
import { useState } from "octane";
import { DownOutlined } from "../layout-navigation-icons";

const App = () => {
  const [open, setOpen] = useState(false);

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key === "3") {
      setOpen(false);
    }
  };

  const handleOpenChange: DropdownProps["onOpenChange"] = (nextOpen, info) => {
    if (info.source === "trigger" || nextOpen) {
      setOpen(nextOpen);
    }
  };

  const items: MenuProps["items"] = [
    {
      label: "Clicking me will not close the menu.",
      key: "1",
    },
    {
      label: "Clicking me will not close the menu also.",
      key: "2",
    },
    {
      label: "Clicking me will close the menu.",
      key: "3",
    },
  ];

  return (
    <Dropdown
      menu={{
        items,
        onClick: handleMenuClick,
      }}
      onOpenChange={handleOpenChange}
      open={open}
    >
      {/* biome-ignore lint/a11y/useValidAnchor lint/a11y/noStaticElementInteractions: preserves the upstream dropdown trigger. */}
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          Hover me
          <DownOutlined />
        </Space>
      </a>
    </Dropdown>
  );
};

export default App;
