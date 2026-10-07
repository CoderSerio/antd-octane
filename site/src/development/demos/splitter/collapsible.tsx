// Adapted from Ant Design 5.29.3 (MIT), components/splitter/demo/collapsible.tsx.

import type { SplitterProps } from "antd-octane";
import { Flex, Splitter, Typography } from "antd-octane";

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

const CustomSplitter = ({ style, ...restProps }: Readonly<SplitterProps>) => (
  <Splitter
    style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)", ...style }}
    {...restProps}
  >
    <Splitter.Panel collapsible min="20%">
      <Desc text="First" />
    </Splitter.Panel>
    <Splitter.Panel collapsible>
      <Desc text="Second" />
    </Splitter.Panel>
  </Splitter>
);

const App = () => (
  <Flex gap="middle" vertical>
    <CustomSplitter style={{ height: 200 }} />
    <CustomSplitter style={{ height: 300 }} layout="vertical" />
  </Flex>
);

export default App;
