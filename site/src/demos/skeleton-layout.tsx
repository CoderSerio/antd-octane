import { Button, Skeleton, Space, Switch } from "antd-octane";
import { useState } from "octane";

export function LayoutDemo() {
  const [round, setRound] = useState(false);
  const [active, setActive] = useState(true);
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Space wrap>
        <Switch checked={round} onChange={setRound} aria-label="骨架圆角" />
        <span>圆角</span>
        <Switch checked={active} onChange={setActive} aria-label="骨架动画" />
        <span>动画</span>
      </Space>
      <Skeleton
        active={active}
        round={round}
        avatar={{ size: 56, shape: "square" }}
        title={{ width: "45%" }}
        paragraph={{ rows: 4, width: ["100%", "90%", "80%", "60%"] }}
      />
    </Space>
  );
}

export function ElementSizesDemo() {
  const [large, setLarge] = useState(false);
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Button onClick={() => setLarge(!large)}>切换独立占位尺寸</Button>
      <Space wrap>
        <Skeleton.Avatar
          active
          size={large ? 64 : 32}
          shape="square"
          aria-label="头像加载占位"
        />
        <Skeleton.Button
          active
          size={large ? "large" : "small"}
          shape="round"
          aria-label="按钮加载占位"
        />
        <Skeleton.Button
          active
          size={large ? "large" : "small"}
          shape="circle"
          aria-label="图标按钮加载占位"
        />
      </Space>
      <Skeleton.Input
        active
        size={large ? "large" : "small"}
        block
        aria-label="输入框加载占位"
      />
    </Space>
  );
}
