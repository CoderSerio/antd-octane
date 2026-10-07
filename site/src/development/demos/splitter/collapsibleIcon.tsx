// Adapted from Ant Design 5.29.3 (MIT), components/splitter/demo/collapsibleIcon.tsx.

import type { RadioChangeEvent } from "antd-octane";
import { Flex, Radio, Splitter, Typography } from "antd-octane";
import { useState } from "octane";

const Desc = (props: Readonly<{ text?: string | number }>) => (
  <Flex justify="center" align="center" style={{ height: "100%" }}>
    <Typography.Title
      type="secondary"
      level={5}
      style={{ whiteSpace: "nowrap" }}
    >
      {props.text}
    </Typography.Title>
  </Flex>
);

const options = [
  { label: "Auto", value: "auto" },
  { label: "True", value: true },
  { label: "False", value: false },
];

const App = () => {
  const [showIconMode, setShowIconMode] = useState<"auto" | boolean>(true);

  const onChange = (e: RadioChangeEvent) => {
    setShowIconMode(e.target.value as "auto" | boolean);
  };

  return (
    <Flex vertical gap={20}>
      <Flex gap={5}>
        <p>ShowCollapsibleIcon: </p>
        <Radio.Group
          options={options}
          value={showIconMode}
          onChange={onChange}
        />
      </Flex>
      <Splitter
        style={{ height: 200, boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}
      >
        <Splitter.Panel
          collapsible={{
            start: true,
            end: true,
            showCollapsibleIcon: showIconMode,
          }}
          min="20%"
        >
          <Desc text="First" />
        </Splitter.Panel>
        <Splitter.Panel
          collapsible={{
            start: true,
            end: true,
            showCollapsibleIcon: showIconMode,
          }}
        >
          <Desc text="Second" />
        </Splitter.Panel>
        <Splitter.Panel
          collapsible={{
            start: true,
            end: true,
            showCollapsibleIcon: showIconMode,
          }}
        >
          <Desc text="Third" />
        </Splitter.Panel>
      </Splitter>
    </Flex>
  );
};

export default App;
