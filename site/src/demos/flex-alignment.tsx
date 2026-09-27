import { Button, Flex } from "antd-octane";
import { useState } from "octane";

const options = ["start", "center", "end", "space-between"] as const;

export function AlignmentDemo() {
  const [justify, setJustify] = useState<(typeof options)[number]>("start");
  return (
    <Flex vertical gap="middle" style={{ width: "100%" }}>
      <Flex gap="small" wrap>
        {options.map((option) => (
          <Button
            key={option}
            size="small"
            type={justify === option ? "primary" : "default"}
            onClick={() => setJustify(option)}
          >
            {option}
          </Button>
        ))}
      </Flex>
      <Flex
        justify={justify}
        align="center"
        gap="small"
        style={{
          width: "100%",
          minHeight: 76,
          padding: 8,
          background: "color-mix(in srgb, currentColor 8%, transparent)",
        }}
      >
        <Button size="small">一</Button>
        <Button size="small">二</Button>
        <Button size="small">三</Button>
      </Flex>
    </Flex>
  );
}
