import type { TabsProps } from "antd-octane";

import { Segmented, Tabs } from "antd-octane";
import { useState } from "octane";

const onChange = (key: string) => {
  console.log(key);
};

const items: TabsProps["items"] = [
  { key: "1", label: "Tab 1", children: "Content of Tab Pane 1" },
  { key: "2", label: "Tab 2", children: "Content of Tab Pane 2" },
  { key: "3", label: "Tab 3", children: "Content of Tab Pane 3" },
];

type Align = "start" | "center" | "end";

export function CustomIndicatorDemo() {
  const [alignValue, setAlignValue] = useState<Align>("center");
  return (
    <>
      <Segmented
        value={alignValue}
        style={{ marginBottom: 8 }}
        onChange={(value) => setAlignValue(value as Align)}
        options={["start", "center", "end"]}
      />
      <Tabs
        defaultActiveKey="1"
        items={items}
        onChange={onChange}
        indicator={{ size: (origin) => origin - 20, align: alignValue }}
      />
    </>
  );
}
