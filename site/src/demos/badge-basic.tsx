import {
  Avatar,
  Badge,
  Button,
  Card,
  Divider,
  Space,
  Switch,
} from "antd-octane";
import {
  ClockCircleOutlined,
  MinusOutlined,
  NotificationOutlined,
  PlusOutlined,
  QuestionOutlined,
} from "antd-octane/icons";
import { useState } from "octane";

export function BasicDemo() {
  return (
    <Space size="middle">
      <Badge count={5}>
        <Avatar shape="square" size="large" />
      </Badge>
      <Badge count={0} showZero>
        <Avatar shape="square" size="large" />
      </Badge>
      <Badge count={<ClockCircleOutlined style={{ color: "#f5222d" }} />}>
        <Avatar shape="square" size="large" />
      </Badge>
    </Space>
  );
}

export function StandaloneDemo() {
  const [show, setShow] = useState(true);
  return (
    <Space>
      <Switch checked={show} onChange={() => setShow(!show)} />
      <Badge count={show ? 11 : 0} showZero color="#faad14" />
      <Badge count={show ? 25 : 0} />
      <Badge
        count={show ? <ClockCircleOutlined style={{ color: "#f5222d" }} /> : 0}
      />
      <Badge
        className="site-badge-count-109"
        count={show ? 109 : 0}
        style={{ backgroundColor: "#52c41a" }}
      />
    </Space>
  );
}

export function OverflowDemo() {
  return (
    <Space size="large">
      <Badge count={99}>
        <Avatar shape="square" size="large" />
      </Badge>
      <Badge count={100}>
        <Avatar shape="square" size="large" />
      </Badge>
      <Badge count={99} overflowCount={10}>
        <Avatar shape="square" size="large" />
      </Badge>
      <Badge count={1000} overflowCount={999}>
        <Avatar shape="square" size="large" />
      </Badge>
    </Space>
  );
}

export function DotDemo() {
  return (
    <Space>
      <Badge dot>
        <NotificationOutlined style={{ fontSize: 16 }} />
      </Badge>
      <Badge dot>
        <a href="#badge">Link something</a>
      </Badge>
    </Space>
  );
}

export function DynamicDemo() {
  const [count, setCount] = useState(5);
  const [show, setShow] = useState(true);

  const increase = () => setCount(count + 1);
  const decline = () => setCount(Math.max(0, count - 1));
  const random = () => setCount(Math.floor(Math.random() * 100));

  return (
    <Space direction="vertical">
      <Space size="large">
        <Badge count={count}>
          <Avatar shape="square" size="large" />
        </Badge>
        <Space.Compact>
          <Button icon={<MinusOutlined />} onClick={decline} />
          <Button icon={<PlusOutlined />} onClick={increase} />
          <Button icon={<QuestionOutlined />} onClick={random} />
        </Space.Compact>
      </Space>
      <Space size="large">
        <Badge dot={show}>
          <Avatar shape="square" size="large" />
        </Badge>
        <Switch onChange={setShow} checked={show} />
      </Space>
    </Space>
  );
}

export function ClickableDemo() {
  return (
    <a href="#badge">
      <Badge count={5}>
        <Avatar shape="square" size="large" />
      </Badge>
    </a>
  );
}

export function OffsetDemo() {
  return (
    <Badge count={5} offset={[10, 10]}>
      <Avatar shape="square" size="large" />
    </Badge>
  );
}

export function SizeDemo() {
  return (
    <Space size="middle">
      <Badge size="default" count={5}>
        <Avatar shape="square" size="large" />
      </Badge>
      <Badge size="small" count={5}>
        <Avatar shape="square" size="large" />
      </Badge>
    </Space>
  );
}

export function StatusDemo() {
  return (
    <>
      <Space>
        <Badge status="success" />
        <Badge status="error" />
        <Badge status="default" />
        <Badge status="processing" />
        <Badge status="warning" />
      </Space>
      <br />
      <Space direction="vertical">
        <Badge status="success" text="Success" />
        <Badge status="error" text="Error" />
        <Badge status="default" text="Default" />
        <Badge status="processing" text="Processing" />
        <Badge status="warning" text="Warning" />
      </Space>
    </>
  );
}

export function ColorDemo() {
  const colors = [
    "pink",
    "red",
    "yellow",
    "orange",
    "cyan",
    "green",
    "blue",
    "purple",
    "geekblue",
    "magenta",
    "volcano",
    "gold",
    "lime",
  ];
  return (
    <>
      <Divider orientation="left">Presets</Divider>
      <Space direction="vertical">
        {colors.map((color) => (
          <Badge key={color} color={color} text={color} />
        ))}
      </Space>
      <Divider orientation="left">Custom</Divider>
      <Space direction="vertical">
        <Badge color="#f50" text="#f50" />
        <Badge color="rgb(45, 183, 245)" text="rgb(45, 183, 245)" />
        <Badge color="hsl(102, 53%, 61%)" text="hsl(102, 53%, 61%)" />
        <Badge color="hwb(205 6% 9%)" text="hwb(205 6% 9%)" />
      </Space>
    </>
  );
}

export function RibbonDemo() {
  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Badge.Ribbon text="Hippies">
        <Card title="Pushes open the window" size="small">
          and raises the spyglass.
        </Card>
      </Badge.Ribbon>
      <Badge.Ribbon text="Hippies" color="pink">
        <Card title="Pushes open the window" size="small">
          and raises the spyglass.
        </Card>
      </Badge.Ribbon>
      <Badge.Ribbon text="Hippies" color="red">
        <Card title="Pushes open the window" size="small">
          and raises the spyglass.
        </Card>
      </Badge.Ribbon>
      <Badge.Ribbon text="Hippies" color="cyan">
        <Card title="Pushes open the window" size="small">
          and raises the spyglass.
        </Card>
      </Badge.Ribbon>
      <Badge.Ribbon text="Hippies" color="green">
        <Card title="Pushes open the window" size="small">
          and raises the spyglass.
        </Card>
      </Badge.Ribbon>
      <Badge.Ribbon text="Hippies" color="purple">
        <Card title="Pushes open the window" size="small">
          and raises the spyglass.
        </Card>
      </Badge.Ribbon>
      <Badge.Ribbon text="Hippies" color="volcano">
        <Card title="Pushes open the window" size="small">
          and raises the spyglass.
        </Card>
      </Badge.Ribbon>
      <Badge.Ribbon text="Hippies" color="magenta">
        <Card title="Pushes open the window" size="small">
          and raises the spyglass.
        </Card>
      </Badge.Ribbon>
    </Space>
  );
}

export function MixDemo() {
  return (
    <Space size="middle" wrap>
      <Space size="middle" wrap>
        <Badge count={5} status="success">
          <Avatar shape="square" size="large" />
        </Badge>
        <Badge count={5} status="warning">
          <Avatar shape="square" size="large" />
        </Badge>
        <Badge count={5} color="blue">
          <Avatar shape="square" size="large" />
        </Badge>
        <Badge count={5} color="#fa541c">
          <Avatar shape="square" size="large" />
        </Badge>
        <Badge dot status="success">
          <Avatar shape="square" size="large" />
        </Badge>
        <Badge dot status="warning">
          <Avatar shape="square" size="large" />
        </Badge>
        <Badge dot status="processing">
          <Avatar shape="square" size="large" />
        </Badge>
        <Badge dot color="blue">
          <Avatar shape="square" size="large" />
        </Badge>
        <Badge dot color="#fa541c">
          <Avatar shape="square" size="large" />
        </Badge>
      </Space>
      <Space size="middle" wrap>
        <Badge count={0} showZero />
        <Badge count={0} showZero color="blue" />
        <Badge count={0} showZero color="#f0f" />
        <Badge count={0} showZero>
          <Avatar shape="square" size="large" />
        </Badge>
        <Badge count={0} showZero color="blue">
          <Avatar shape="square" size="large" />
        </Badge>
        <Badge count={0} color="#f0f" />
        <Badge status="success" text={0} showZero />
        <Badge status="warning" text={0} />
      </Space>
    </Space>
  );
}

export function TitleDemo() {
  return (
    <Space size="large">
      <Badge count={5} title="Custom hover text">
        <Avatar shape="square" size="large" />
      </Badge>
      <Badge count={-5} title="Negative">
        <Avatar shape="square" size="large" />
      </Badge>
    </Space>
  );
}
