import { Flex, Radio } from "antd-octane";
import { useState } from "octane";

const baseStyle = { width: "25%", height: 54 };

export function BasicDemo() {
  const [value, setValue] = useState("horizontal");
  return (
    <Flex gap="middle" vertical style={{ width: "100%" }}>
      <Radio.Group
        value={value}
        onChange={(event) => setValue(String(event.target.value))}
      >
        <Radio value="horizontal">horizontal</Radio>
        <Radio value="vertical">vertical</Radio>
      </Radio.Group>
      <Flex vertical={value === "vertical"}>
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            style={{
              ...baseStyle,
              backgroundColor: index % 2 ? "#1677ff" : "#1677ffbf",
            }}
          />
        ))}
      </Flex>
    </Flex>
  );
}
