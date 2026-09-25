import { Button, ConfigProvider, message, Space } from "antd-octane";
export function BasicDemo() {
  const [api, holder] = message.useMessage({ maxCount: 3 });
  return (
    <>
      {holder}
      <Space wrap>
        <Button
          onClick={() => {
            api.success("项目保存成功");
          }}
        >
          成功提示
        </Button>
        <Button
          onClick={() => {
            api.warning("请先填写项目名称");
          }}
        >
          警告提示
        </Button>
        <Button
          onClick={() => {
            api.error("保存失败，请重试");
          }}
        >
          错误提示
        </Button>
        <Button
          onClick={() => {
            api.info("这条消息将在 1 秒后关闭", 1);
          }}
        >
          自动关闭
        </Button>
      </Space>
    </>
  );
}
export function MoreDemo() {
  const [api, holder] = message.useMessage();
  return (
    <ConfigProvider
      theme={{
        components: { Message: { contentBg: "#e6f4ff" } },
        token: { colorText: "#003a8c" },
      }}
    >
      {holder}
      <Space wrap>
        <Button
          onClick={() => {
            api.open({
              key: "save",
              type: "loading",
              content: "正在保存草稿…",
              duration: 0,
            });
          }}
        >
          开始保存
        </Button>
        <Button
          onClick={() => {
            api.open({
              key: "save",
              type: "success",
              content: "同一条消息已更新为保存成功",
              duration: 3,
            });
          }}
        >
          更新结果
        </Button>
        <Button onClick={() => api.destroy("save")}>手动关闭</Button>
      </Space>
    </ConfigProvider>
  );
}
