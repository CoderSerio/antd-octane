import type { RadioChangeEvent } from "antd-octane";
import { Radio, Tabs } from "antd-octane";
import { useState } from "octane";

type TabPosition = "left" | "right" | "top" | "bottom";

export function SlideDemo() {
  const [mode, setMode] = useState<TabPosition>("top");

  const handleModeChange = (e: RadioChangeEvent) => {
    setMode(e.target.value as TabPosition);
  };

  return (
    <div>
      <Radio.Group
        onChange={handleModeChange}
        value={mode}
        style={{ marginBottom: 8 }}
      >
        <Radio.Button value="top">Horizontal</Radio.Button>
        <Radio.Button value="left">Vertical</Radio.Button>
      </Radio.Group>
      <Tabs
        defaultActiveKey="1"
        tabPosition={mode}
        style={{ height: 220 }}
        items={Array.from({ length: 30 }, (_, i) => {
          const id = String(i);
          return {
            label: `Tab-${id}`,
            key: id,
            disabled: i === 28,
            children: `Content of tab ${id}`,
          };
        })}
      />
    </div>
  );
}
