import { Button, ConfigProvider, Space } from "antd-octane";
export function ThemeBrandDemo() {
  return (
    <ConfigProvider
      theme={{ token: { colorPrimary: "#00b96b", borderRadius: 8 } }}
    >
      <Space>
        <Button type="primary">Primary</Button>
        <Button>Default</Button>
        <Button type="link">Link</Button>
      </Space>
    </ConfigProvider>
  );
}
