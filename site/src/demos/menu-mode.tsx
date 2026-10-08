import { Menu, Select, Space } from "antd-octane";
import { useState } from "octane";

export function ModeDemo() {
  const [mode, setMode] = useState<"inline" | "vertical" | "horizontal">(
    "inline",
  );
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Space wrap>
        <span>mode：</span>
        <Select
          aria-label="菜单模式"
          value={mode}
          options={["inline", "vertical", "horizontal"].map((value) => ({
            value,
          }))}
          onChange={(value) => {
            if (
              value === "inline" ||
              value === "vertical" ||
              value === "horizontal"
            )
              setMode(value);
          }}
          style={{ width: 160 }}
        />
      </Space>
      <Menu
        mode={mode}
        defaultSelectedKeys={["one"]}
        items={[
          { key: "one", label: "Navigation One" },
          { key: "two", label: "Navigation Two" },
          { key: "three", label: "Navigation Three", disabled: true },
        ]}
      />
    </Space>
  );
}
