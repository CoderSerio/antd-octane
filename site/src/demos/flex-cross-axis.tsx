import { Flex } from "antd-octane";
import { useState } from "octane";

export function CrossAxisDemo() {
  const [align, setAlign] = useState("center");
  return (
    <Flex vertical gap="middle" style={{ width: "100%" }}>
      <label>
        align：
        <select
          value={align}
          onChange={(event) =>
            setAlign((event.target as HTMLSelectElement).value)
          }
        >
          {["flex-start", "center", "flex-end", "stretch"].map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
      </label>
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
