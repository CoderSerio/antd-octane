import { Input, Space } from "antd-octane";
import { useState } from "octane";

export function InputNativeLengthDemo() {
  const [value, setValue] = useState("");
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Input
        aria-label="十字以内的标题"
        placeholder="标题最多 10 个字符"
        maxLength={10}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <span aria-live="polite">{value.length} / 10</span>
    </Space>
  );
}
