import { Button, Flex, Splitter, Switch, Typography } from "antd-octane";
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

export function ControlledDemo() {
  const [sizes, setSizes] = useState<(number | string)[]>(["50%", "50%"]);
  const [enabled, setEnabled] = useState(true);
  return (
    <Flex vertical gap="middle">
      <Splitter
        onResize={setSizes}
        style={{ height: 200, boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}
      >
        <Splitter.Panel size={sizes[0]} resizable={enabled}>
          <Desc text="First" />
        </Splitter.Panel>
        <Splitter.Panel size={sizes[1]}>
          <Desc text="Second" />
        </Splitter.Panel>
      </Splitter>
      <Flex gap="middle" justify="space-between">
        <Switch
          value={enabled}
          onChange={() => setEnabled(!enabled)}
          checkedChildren="Enabled"
          unCheckedChildren="Disabled"
        />
        <Button onClick={() => setSizes(["50%", "50%"])}>Reset</Button>
      </Flex>
    </Flex>
  );
}
