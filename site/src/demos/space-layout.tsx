import { Button, Space } from "antd-octane";
export function LayoutDemo() {
  return (
    <Space size={[8, 16]} wrap>
      {Array.from({ length: 20 }, (_, index) => (
        <Button key={index}>Button</Button>
      ))}
    </Space>
  );
}
