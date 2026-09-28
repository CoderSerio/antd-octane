import { Menu, Space } from "antd-octane";
import { useState } from "octane";

export function ModeDemo() {
  const [mode, setMode] = useState<"inline" | "vertical" | "horizontal">(
    "inline",
  );
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <label>
        mode：
        <select
          value={mode}
          onChange={(event) =>
            setMode((event.target as HTMLSelectElement).value as typeof mode)
          }
        >
          <option value="inline">inline</option>
          <option value="vertical">vertical</option>
          <option value="horizontal">horizontal</option>
        </select>
      </label>
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
