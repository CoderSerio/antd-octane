import { Button, ConfigProvider } from "antd-octane";
export function ComponentDemo() {
  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            primaryColor: "#102a43",
            colorPrimary: "#a7f3d0",
            fontWeight: 600,
            controlHeight: 40,
          },
        },
      }}
    >
      <Button type="primary">组件级主题配置</Button>
    </ConfigProvider>
  );
}
