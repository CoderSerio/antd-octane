import { Input, Space } from "antd-octane";
import { useState } from "octane";
export function InputAffixDemo() {
  return (
    <div className="input-examples">
      <Input
        prefix="￥"
        suffix="元"
        allowClear
        defaultValue="100"
        aria-label="金额文本"
      />
      <Input
        addonBefore="https://"
        addonAfter=".com"
        defaultValue="example"
        aria-label="网站名称"
      />
    </div>
  );
}
export function InputPasswordDemo() {
  return (
    <Input.Password placeholder="请输入密码" aria-label="示例密码" allowClear />
  );
}
export function InputSearchDemo() {
  const [query, setQuery] = useState("");
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Input.Search
        placeholder="搜索组件"
        aria-label="搜索组件"
        allowClear
        enterButton="搜索"
        onSearch={(value, _event, info) =>
          setQuery(info.source === "clear" ? "" : value)
        }
      />
      <span aria-live="polite">
        {query ? `搜索内容：${query}` : "输入关键词并按 Enter，或点击搜索。"}
      </span>
    </Space>
  );
}
export function InputTextAreaDemo() {
  return (
    <Input.TextArea
      aria-label="项目说明"
      placeholder="输入多行项目说明，自动适应 2–5 行高度"
      autoSize={{ minRows: 2, maxRows: 5 }}
      allowClear
    />
  );
}
