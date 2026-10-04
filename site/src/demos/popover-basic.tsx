import { Button, Flex, Popover, Segmented, Space } from "antd-octane";
import { useState } from "octane";
export function BasicDemo() {
  const content = (
    <div>
      <p>Content</p>
      <p>Content</p>
    </div>
  );
  return (
    <Popover content={content} title="Title">
      <Button type="primary">Hover me</Button>
    </Popover>
  );
}
export function ControlDemo() {
  const [open, setOpen] = useState(false);
  return (
    <Popover
      content={
        <Button type="link" onClick={() => setOpen(false)}>
          Close
        </Button>
      }
      title="Title"
      trigger="click"
      open={open}
      onOpenChange={setOpen}
    >
      <Button type="primary">Click me</Button>
    </Popover>
  );
}

export function HoverWithClickDemo() {
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const hide = () => {
    setClicked(false);
    setHovered(false);
  };
  return (
    <Popover
      style={{ width: 260 }}
      content={<div>This is hover content.</div>}
      title="Hover title"
      trigger="hover"
      open={hovered}
      onOpenChange={(open) => {
        setHovered(open);
        setClicked(false);
      }}
    >
      <Popover
        content={
          <div>
            <div>This is click content.</div>
            <Button type="link" onClick={hide}>
              Close
            </Button>
          </div>
        }
        title="Click title"
        trigger="click"
        open={clicked}
        onOpenChange={(open) => {
          setClicked(open);
          setHovered(false);
        }}
      >
        <Button>Hover and click</Button>
      </Popover>
    </Popover>
  );
}

export function TriggerDemo() {
  return (
    <Space wrap>
      <Popover title="悬停" content="hover trigger" trigger="hover">
        <Button>悬停</Button>
      </Popover>
      <Popover title="点击" content="click trigger" trigger="click">
        <Button>点击</Button>
      </Popover>
      <Popover title="聚焦" content="focus trigger" trigger="focus">
        <Button>聚焦</Button>
      </Popover>
    </Space>
  );
}

export function PositionDemo() {
  const placements = [
    ["topLeft", "TL"],
    ["top", "Top"],
    ["topRight", "TR"],
    ["leftTop", "LT"],
    ["left", "Left"],
    ["leftBottom", "LB"],
    ["rightTop", "RT"],
    ["right", "Right"],
    ["rightBottom", "RB"],
    ["bottomLeft", "BL"],
    ["bottom", "Bottom"],
    ["bottomRight", "BR"],
  ] as const;
  const content = (
    <div>
      <p>Content</p>
      <p>Content</p>
    </div>
  );
  return (
    <Flex vertical align="center" gap={8} style={{ width: "100%" }}>
      <Flex wrap justify="center" gap={8}>
        {placements.slice(0, 3).map(([placement, label]) => (
          <Popover
            key={placement}
            placement={placement}
            title="Title"
            content={content}
          >
            <Button>{label}</Button>
          </Popover>
        ))}
      </Flex>
      <Flex justify="space-between" gap={72}>
        <Flex vertical gap={8}>
          {placements.slice(3, 6).map(([placement, label]) => (
            <Popover
              key={placement}
              placement={placement}
              title="Title"
              content={content}
            >
              <Button>{label}</Button>
            </Popover>
          ))}
        </Flex>
        <Flex vertical gap={8}>
          {placements.slice(6, 9).map(([placement, label]) => (
            <Popover
              key={placement}
              placement={placement}
              title="Title"
              content={content}
            >
              <Button>{label}</Button>
            </Popover>
          ))}
        </Flex>
      </Flex>
      <Flex wrap justify="center" gap={8}>
        {placements.slice(9).map(([placement, label]) => (
          <Popover
            key={placement}
            placement={placement}
            title="Title"
            content={content}
          >
            <Button>{label}</Button>
          </Popover>
        ))}
      </Flex>
    </Flex>
  );
}

export function ArrowDemo() {
  const [arrow, setArrow] = useState<"Show" | "Hide" | "Center">("Show");
  const mergedArrow =
    arrow === "Hide"
      ? false
      : arrow === "Center"
        ? { pointAtCenter: true }
        : true;
  const placements = [
    ["topLeft", "TL"],
    ["top", "Top"],
    ["topRight", "TR"],
    ["leftTop", "LT"],
    ["left", "Left"],
    ["leftBottom", "LB"],
    ["rightTop", "RT"],
    ["right", "Right"],
    ["rightBottom", "RB"],
    ["bottomLeft", "BL"],
    ["bottom", "Bottom"],
    ["bottomRight", "BR"],
  ] as const;
  const content = (
    <div>
      <p>Content</p>
      <p>Content</p>
    </div>
  );
  const render = (placement: (typeof placements)[number][0], label: string) => (
    <Popover
      key={placement}
      placement={placement}
      title="Title"
      content={content}
      arrow={mergedArrow}
    >
      <Button>{label}</Button>
    </Popover>
  );
  return (
    <div>
      <Segmented
        options={["Show", "Hide", "Center"]}
        value={arrow}
        onChange={(value) => setArrow(value as "Show" | "Hide" | "Center")}
        style={{ marginBottom: 16 }}
      />
      <Flex vertical align="center" gap={8} style={{ width: "100%" }}>
        <Flex wrap justify="center" gap={8}>
          {placements.slice(0, 3).map(([p, l]) => render(p, l))}
        </Flex>
        <Flex justify="space-between" gap={72}>
          <Flex vertical gap={8}>
            {placements.slice(3, 6).map(([p, l]) => render(p, l))}
          </Flex>
          <Flex vertical gap={8}>
            {placements.slice(6, 9).map(([p, l]) => render(p, l))}
          </Flex>
        </Flex>
        <Flex wrap justify="center" gap={8}>
          {placements.slice(9).map(([p, l]) => render(p, l))}
        </Flex>
      </Flex>
    </div>
  );
}

export function ArrowPointAtCenterDemo() {
  const placements = ["top", "right", "bottom", "left"] as const;
  return (
    <Flex wrap gap={16} justify="center">
      {placements.map((placement) => (
        <Popover
          key={placement}
          placement={placement}
          content={placement}
          arrow={{ pointAtCenter: true }}
          open
        >
          <Button>{placement}</Button>
        </Popover>
      ))}
    </Flex>
  );
}

export function OffsetDemo() {
  return (
    <Popover
      title="贴边偏移"
      content="通过 align.offset 调整浮层与触发器的距离。"
      align={{ offset: [0, 12] }}
    >
      <Button>偏移 12px</Button>
    </Popover>
  );
}

export function CloseDemo() {
  const [open, setOpen] = useState(false);
  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      trigger="click"
      title="从浮层内关闭"
      content={<Button onClick={() => setOpen(false)}>关闭浮层</Button>}
    >
      <Button>打开浮层</Button>
    </Popover>
  );
}
