import type { RadioChangeEvent } from "antd-octane";
import { Radio, Space, Tabs } from "antd-octane";
import { useState } from "octane";

type TabPosition = "left" | "right" | "top" | "bottom";

export function PositionDemo() {
  const [tabPosition, setTabPosition] = useState<TabPosition>("left");

  const changeTabPosition = (e: RadioChangeEvent) => {
    setTabPosition(e.target.value as TabPosition);
  };

  return (
    <>
      <Space style={{ marginBottom: 24 }}>
        Tab position:
        <Radio.Group value={tabPosition} onChange={changeTabPosition}>
          <Radio.Button value="top">top</Radio.Button>
          <Radio.Button value="bottom">bottom</Radio.Button>
          <Radio.Button value="left">left</Radio.Button>
          <Radio.Button value="right">right</Radio.Button>
        </Radio.Group>
      </Space>
      <Tabs
        tabPosition={tabPosition}
        items={Array.from({ length: 3 }).map((_, i) => {
          const id = String(i + 1);
          return {
            label: `Tab ${id}`,
            key: id,
            children: `Content of Tab ${id}`,
          };
        })}
      />
    </>
  );
}
