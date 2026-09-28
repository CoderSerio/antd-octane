import { Checkbox, Pagination, Space } from "antd-octane";
import { useState } from "octane";

export function DisabledDemo() {
  const [disabled, setDisabled] = useState(true);
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Checkbox
        checked={disabled}
        onChange={(event) => setDisabled(event.target.checked)}
      >
        禁用分页
      </Checkbox>
      <Pagination total={80} disabled={disabled} showQuickJumper />
    </Space>
  );
}
