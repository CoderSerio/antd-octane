// Adapted from Ant Design 5.29.3 (MIT), components/splitter/demo/multiple.tsx.
import { Flex, Splitter, Typography } from "antd-octane";

const Desc = (props: Readonly<{ text?: string | number }>) => (
  <Flex justify="center" align="center" style={{ height: "100%" }}>
    <Typography.Title
      type="secondary"
      level={5}
      style={{ whiteSpace: "nowrap" }}
    >
      Panel {props.text}
    </Typography.Title>
  </Flex>
);

const App = () => (
  <Splitter style={{ height: 200, boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}>
    <Splitter.Panel collapsible>
      <Desc text={1} />
    </Splitter.Panel>
    <Splitter.Panel collapsible={{ start: true }}>
      <Desc text={2} />
    </Splitter.Panel>
    <Splitter.Panel>
      <Desc text={3} />
    </Splitter.Panel>
  </Splitter>
);

export default App;
