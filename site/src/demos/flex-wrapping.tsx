import { Button, Flex } from "antd-octane";

export function WrappingDemo() {
  return (
    <Flex wrap gap="small">
      {Array.from({ length: 24 }, (_, index) => (
        <Button key={index} type="primary">
          Button
        </Button>
      ))}
    </Flex>
  );
}
