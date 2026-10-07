import { Button, Flex, type FlexProps, Segmented } from "antd-octane";
import { useState } from "octane";

const boxStyle = {
  width: "100%",
  height: 120,
  borderRadius: 6,
  border: "1px solid #40a9ff",
};
const justifyOptions = [
  "flex-start",
  "center",
  "flex-end",
  "space-between",
  "space-around",
  "space-evenly",
];
const alignOptions = ["flex-start", "center", "flex-end"];

export function AlignmentDemo() {
  const [justify, setJustify] = useState<FlexProps["justify"]>(
    justifyOptions[0],
  );
  const [alignItems, setAlignItems] = useState<FlexProps["align"]>(
    alignOptions[0],
  );
  return (
    <Flex gap="middle" align="start" vertical style={{ width: "100%" }}>
      <p>Select justify :</p>
      <Segmented
        options={justifyOptions}
        onChange={(value) => setJustify(String(value))}
        style={{ maxWidth: "100%", overflowX: "auto" }}
      />
      <p>Select align :</p>
      <Segmented
        options={alignOptions}
        onChange={(value) => setAlignItems(String(value))}
        style={{ maxWidth: "100%", overflowX: "auto" }}
      />
      <Flex style={boxStyle} justify={justify} align={alignItems}>
        <Button type="primary">Primary</Button>
        <Button type="primary">Primary</Button>
        <Button type="primary">Primary</Button>
        <Button type="primary">Primary</Button>
      </Flex>
    </Flex>
  );
}
