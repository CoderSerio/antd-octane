import { Alert, Button, Space } from "antd-octane";
export function BasicDemo() {
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Alert type="success" message="保存成功" showIcon />
      <Alert
        type="info"
        message="提示信息"
        description="更改将在下一次发布时生效。"
        showIcon
      />
      <Alert type="warning" message="请确认配置" showIcon />
      <Alert type="error" message="提交失败" showIcon />
    </Space>
  );
}
export function MoreDemo() {
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Alert banner message="当前为开发预览" />
      <Alert
        message="这是一条可以关闭的提示"
        closable
        action={
          <Button size="small" type="text">
            了解更多
          </Button>
        }
      />
    </Space>
  );
}
