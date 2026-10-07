import { Button, Card, Flex, Typography } from "antd-octane";

export function CombinationDemo() {
  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <Card
        hoverable
        style={{ width: 620 }}
        styles={{ body: { padding: 0, overflow: "hidden" } }}
      >
        <Flex justify="space-between">
          <img
            draggable={false}
            alt="avatar"
            src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
            style={{ display: "block", width: 273 }}
          />
          <Flex
            vertical
            align="flex-end"
            justify="space-between"
            style={{ padding: 32 }}
          >
            <Typography.Title level={3}>
              “antd is an enterprise-class UI design language and Octane UI
              library.”
            </Typography.Title>
            <Button type="primary" href="https://ant.design" target="_blank">
              Get Started
            </Button>
          </Flex>
        </Flex>
      </Card>
    </div>
  );
}
