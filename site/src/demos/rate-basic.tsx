import { Flex, Rate, Space } from "antd-octane";
import { useState } from "octane";
export function BasicDemo() {
  return (
    <Flex vertical gap={16}>
      <Rate defaultValue={3} />
      <Rate allowHalf defaultValue={2.5} />
      <Rate disabled defaultValue={4} />
    </Flex>
  );
}
export function MoreDemo() {
  const [value, setValue] = useState(3);
  return (
    <Flex vertical gap={16}>
      <Space>
        <Rate
          allowHalf
          value={value}
          onChange={setValue}
          tooltips={["很差", "较差", "一般", "不错", "很好"]}
          aria-label="体验评分"
        />
        <span>{value} 分</span>
      </Space>
      <Rate
        character="♥"
        defaultValue={3}
        allowClear={false}
        style={{ color: "#eb2f96" }}
      />
      <p>方向键调整评分，Home 清零，End 设为满分。</p>
    </Flex>
  );
}
