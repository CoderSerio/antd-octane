import { Button, Flex } from "antd-octane";
export function BasicDemo() {
  return (
    <Flex vertical gap="middle" style={{ width: "100%" }}>
      <Flex gap="small" wrap>
        <Button type="primary">提交</Button>
        <Button>取消</Button>
        <Button>保存草稿</Button>
      </Flex>
      <Flex justify="space-between" align="center">
        <span>左右分布</span>
        <Button size="small">查看</Button>
      </Flex>
    </Flex>
  );
}
