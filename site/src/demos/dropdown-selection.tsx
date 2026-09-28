import { Button, Dropdown, Space } from "antd-octane";
import { useState } from "octane";

export function SelectionDemo() {
  const [selectedKeys, setSelectedKeys] = useState(["one"]);
  return (
    <Space direction="vertical">
      <Dropdown
        trigger={["click"]}
        menu={{
          selectable: true,
          selectedKeys,
          onSelect: (info) => setSelectedKeys(info.selectedKeys),
          items: [
            { key: "one", label: "1st menu item" },
            { key: "two", label: "2nd menu item" },
            { key: "three", label: "3rd menu item", disabled: true },
          ],
        }}
      >
        <Button>选择菜单项</Button>
      </Dropdown>
      <p aria-live="polite">当前选择：{selectedKeys[0]}</p>
    </Space>
  );
}
