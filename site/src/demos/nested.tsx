import { Button, ConfigProvider } from "antd-octane";
export function NestedDemo() {
  return (
    <div className="demo-row">
      <Button type="primary">继承全局主题</Button>
      <ConfigProvider
        theme={{ token: { colorPrimary: "#389e0d", borderRadius: 12 } }}
      >
        <Button type="primary">局部绿色主题</Button>
      </ConfigProvider>
      <ConfigProvider theme={{ inherit: false }}>
        <Button type="primary">独立默认主题</Button>
      </ConfigProvider>
    </div>
  );
}
