import {
  Button,
  ConfigProvider,
  Input,
  Select,
  Space,
  Switch,
} from "antd-octane";
import { useState } from "octane";

export function CompactDemo() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("尚未搜索");
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Space.Compact block>
        <Select
          defaultValue="name"
          options={[
            { value: "name", label: "名称" },
            { value: "id", label: "编号" },
          ]}
          style={{ width: 100 }}
        />
        <Input
          aria-label="紧凑搜索内容"
          placeholder="输入搜索内容"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1, minWidth: 0 }}
        />
        <Button
          type="primary"
          onClick={() => setResult(query || "请输入搜索内容")}
        >
          搜索
        </Button>
      </Space.Compact>
      <span role="status">{result}</span>
    </Space>
  );
}
export function CompactSizeDemo() {
  const [small, setSmall] = useState(false);
  return (
    <Space direction="vertical">
      <Switch
        checked={small}
        onChange={setSmall}
        checkedChildren="小尺寸"
        unCheckedChildren="大尺寸"
      />
      <Space.Compact size={small ? "small" : "large"}>
        <Button>左侧</Button>
        <Button>中间</Button>
        <Button>右侧</Button>
      </Space.Compact>
    </Space>
  );
}
export function CompactVerticalDemo() {
  return (
    <Space.Compact direction="vertical">
      <Button>上移</Button>
      <Button>复制</Button>
      <Button danger>删除</Button>
    </Space.Compact>
  );
}
export function CompactAddonDemo() {
  const [disabled, setDisabled] = useState(false);
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Switch
        checked={disabled}
        onChange={setDisabled}
        checkedChildren="已禁用"
        unCheckedChildren="可编辑"
      />
      <ConfigProvider componentDisabled={disabled}>
        <Space.Compact block>
          <Space.Addon>https://</Space.Addon>
          <Input
            aria-label="域名"
            defaultValue="example"
            style={{ minWidth: 0, flex: 1 }}
          />
          <Space.Addon>.com</Space.Addon>
        </Space.Compact>
      </ConfigProvider>
    </Space>
  );
}
