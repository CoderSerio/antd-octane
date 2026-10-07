import { Button, Checkbox, Divider, Tabs } from "antd-octane";
import type { OctaneNode } from "octane";
import { useMemo, useState } from "octane";

const CheckboxGroup = Checkbox.Group;

const operations = <Button>Extra Action</Button>;

const OperationsSlot: Record<PositionType, OctaneNode> = {
  left: <Button style={{ marginInlineEnd: 16 }}>Left Extra Action</Button>,
  right: <Button>Right Extra Action</Button>,
};

const options = ["left", "right"];

type PositionType = "left" | "right";

const items = Array.from({ length: 3 }).map((_, i) => {
  const id = String(i + 1);
  return {
    label: `Tab ${id}`,
    key: id,
    children: `Content of tab ${id}`,
  };
});

export function ExtraDemo() {
  const [position, setPosition] = useState<PositionType[]>(["left", "right"]);

  const slot = useMemo(() => {
    if (position.length === 0) {
      return null;
    }
    return Object.fromEntries(
      position.map((direction) => [direction, OperationsSlot[direction]]),
    ) as { left?: OctaneNode; right?: OctaneNode };
  }, [position]);

  return (
    <>
      <Tabs tabBarExtraContent={operations} items={items} />
      <br />
      <br />
      <br />
      <div>You can also specify its direction or both side</div>
      <Divider />
      <CheckboxGroup
        options={options}
        value={position}
        onChange={(value) => {
          setPosition(value as PositionType[]);
        }}
      />
      <br />
      <br />
      <Tabs tabBarExtraContent={slot} items={items} />
    </>
  );
}
