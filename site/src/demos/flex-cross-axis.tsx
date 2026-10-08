import { Flex, Select } from "antd-octane";
import { useState } from "octane";

export function CrossAxisDemo() {
  const [align, setAlign] = useState("center");
  return (
    <Flex vertical gap="middle" style={{ width: "100%" }}>
      <Flex align="center" gap="small" wrap>
        <span>align：</span>
        <Select
          aria-label="交叉轴对齐方式"
          value={align}
          options={["flex-start", "center", "flex-end", "stretch"].map(
            (value) => ({ value }),
          )}
          onChange={(value) => {
            if (typeof value === "string") setAlign(value);
          }}
          style={{ width: 160 }}
        />
      </Flex>
      <Flex
        align={align}
        gap="small"
        style={{ height: 140, padding: 8, background: "var(--subtle)" }}
      >
        {[40, 70, 100].map((height) => (
          <div
            key={height}
            style={{
              minHeight: height,
              flex: 1,
              padding: 8,
              background: "#1677ff",
              color: "#fff",
            }}
          >
            {height}px
          </div>
        ))}
      </Flex>
    </Flex>
  );
}
