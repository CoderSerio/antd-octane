import { Button, ConfigProvider, Input, Space } from "antd-octane";
export function ThemeComponentsDemo() {
  return (
    <ConfigProvider
      theme={{
        components: {
          Button: { colorPrimary: "#722ed1", algorithm: true },
          Input: { activeBorderColor: "#722ed1", hoverBorderColor: "#9254de" },
        },
      }}
    >
      <Space wrap>
        <Button type="primary">组件主题</Button>
        <Input
          aria-label="组件主题输入"
          placeholder="聚焦查看边框"
          style={{ width: 180 }}
        />
      </Space>
    </ConfigProvider>
  );
}
