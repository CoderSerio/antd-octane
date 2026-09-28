import { Button, Checkbox, Dropdown, Space } from "antd-octane";
import { useState } from "octane";

export function DisabledDemo() {
  const [disabled, setDisabled] = useState(true);
  return (
    <Space>
      <Checkbox
        checked={disabled}
        onChange={(event) => setDisabled(event.target.checked)}
      >
        禁用菜单
      </Checkbox>
      <Dropdown
        disabled={disabled}
        trigger={["click"]}
        menu={{ items: [{ key: "one", label: "1st menu item" }] }}
      >
        <Button disabled={disabled}>更多</Button>
      </Dropdown>
    </Space>
  );
}
