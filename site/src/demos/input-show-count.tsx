import { Input, Space } from "antd-octane";
import { useState } from "octane";

export function InputShowCountDemo() {
  const [title, setTitle] = useState("");
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Input
        aria-label="受控标题"
        placeholder="标题最多 12 个字符"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        maxLength={12}
        showCount
        allowClear
      />
      <Input.Password
        aria-label="访问口令"
        placeholder="口令最多 16 个字符"
        maxLength={16}
        showCount
      />
      <Input.Search
        aria-label="搜索关键词"
        placeholder="关键词最多 20 个字符"
        maxLength={20}
        showCount
        enterButton="搜索"
      />
      <Input.TextArea
        aria-label="说明"
        placeholder="说明最多 60 个字符"
        maxLength={60}
        showCount
        autoSize={{ minRows: 2, maxRows: 4 }}
      />
    </Space>
  );
}
