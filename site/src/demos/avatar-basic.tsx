import { Avatar, Badge, Button, Divider, Space, Tooltip } from "antd-octane";
import { useState } from "octane";
import { AntDesignOutlined, avatarUrl, UserOutlined } from "./avatar-icons";

export function BasicDemo() {
  return (
    <Space direction="vertical" size={16} style={{ alignItems: "flex-start" }}>
      <Space wrap size={16}>
        <Avatar size={64} icon={<UserOutlined />} />
        <Avatar size="large" icon={<UserOutlined />} />
        <Avatar icon={<UserOutlined />} />
        <Avatar size="small" icon={<UserOutlined />} />
        <Avatar size={14} icon={<UserOutlined />} />
      </Space>
      <Space wrap size={16}>
        <Avatar shape="square" size={64} icon={<UserOutlined />} />
        <Avatar shape="square" size="large" icon={<UserOutlined />} />
        <Avatar shape="square" icon={<UserOutlined />} />
        <Avatar shape="square" size="small" icon={<UserOutlined />} />
        <Avatar shape="square" size={14} icon={<UserOutlined />} />
      </Space>
    </Space>
  );
}

export function TypeDemo() {
  return (
    <Space size={16} wrap>
      <Avatar icon={<UserOutlined />} />
      <Avatar>U</Avatar>
      <Avatar size={40}>USER</Avatar>
      <Avatar src={avatarUrl} />
      <Avatar src={<img draggable={false} src={avatarUrl} alt="avatar" />} />
      <Avatar style={{ backgroundColor: "#fde3cf", color: "#f56a00" }}>
        U
      </Avatar>
      <Avatar style={{ backgroundColor: "#87d068" }} icon={<UserOutlined />} />
    </Space>
  );
}

const users = ["U", "Lucy", "Tom", "Edward"];
const colors = ["#f56a00", "#7265e6", "#ffbf00", "#00a2ae"];
const gaps = [4, 3, 2, 1];

export function DynamicDemo() {
  const [user, setUser] = useState(users[0]);
  const [color, setColor] = useState(colors[0]);
  const [gap, setGap] = useState(gaps[0]);
  const changeUser = () => {
    const index = users.indexOf(user);
    setUser(users[index < users.length - 1 ? index + 1 : 0]);
    setColor(colors[index < colors.length - 1 ? index + 1 : 0]);
  };
  const changeGap = () => {
    const index = gaps.indexOf(gap);
    setGap(gaps[index < gaps.length - 1 ? index + 1 : 0]);
  };
  return (
    <Space>
      <Avatar
        size="large"
        gap={gap}
        style={{ backgroundColor: color, verticalAlign: "middle" }}
      >
        {user}
      </Avatar>
      <Button size="small" onClick={changeUser}>
        ChangeUser
      </Button>
      <Button size="small" onClick={changeGap}>
        changeGap
      </Button>
    </Space>
  );
}

export function BadgeDemo() {
  return (
    <Space size={24}>
      <Badge count={1}>
        <Avatar shape="square" icon={<UserOutlined />} />
      </Badge>
      <Badge dot>
        <Avatar shape="square" icon={<UserOutlined />} />
      </Badge>
    </Space>
  );
}

function GroupSet({
  seed,
  large = false,
  click = false,
  src,
}: {
  seed: number;
  large?: boolean;
  click?: boolean;
  src?: string;
}) {
  return (
    <Avatar.Group
      size={large ? "large" : undefined}
      max={{
        count: 2,
        style: {
          color: "#f56a00",
          backgroundColor: "#fde3cf",
          cursor: click ? "pointer" : undefined,
        },
        popover: click ? { trigger: "click" } : undefined,
      }}
    >
      <Avatar
        src={src ?? `https://api.dicebear.com/7.x/miniavs/svg?seed=${seed}`}
      />
      <Avatar style={{ backgroundColor: "#f56a00" }}>K</Avatar>
      <Tooltip title="Ant User" placement="top">
        <Avatar
          style={{ backgroundColor: "#87d068" }}
          icon={<UserOutlined />}
        />
      </Tooltip>
      <Avatar
        style={{ backgroundColor: "#1677ff" }}
        icon={<AntDesignOutlined />}
      />
    </Avatar.Group>
  );
}

export function GroupDemo() {
  return (
    <div style={{ width: "100%" }}>
      <Avatar.Group>
        <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
        <a href="https://ant.design">
          <Avatar style={{ backgroundColor: "#f56a00" }}>K</Avatar>
        </a>
        <Tooltip title="Ant User" placement="top">
          <Avatar
            style={{ backgroundColor: "#87d068" }}
            icon={<UserOutlined />}
          />
        </Tooltip>
        <Avatar
          style={{ backgroundColor: "#1677ff" }}
          icon={<AntDesignOutlined />}
        />
      </Avatar.Group>
      <Divider />
      <GroupSet seed={2} />
      <Divider />
      <GroupSet seed={3} large />
      <Divider />
      <GroupSet
        seed={4}
        large
        click
        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
      />
      <Divider />
      <Avatar.Group shape="square">
        <Avatar style={{ backgroundColor: "#fde3cf" }}>A</Avatar>
        <Avatar style={{ backgroundColor: "#f56a00" }}>K</Avatar>
        <Avatar
          style={{ backgroundColor: "#87d068" }}
          icon={<UserOutlined />}
        />
        <Avatar
          style={{ backgroundColor: "#1677ff" }}
          icon={<AntDesignOutlined />}
        />
      </Avatar.Group>
    </div>
  );
}

export function ResponsiveDemo() {
  return (
    <Avatar
      size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
      icon={<AntDesignOutlined />}
    />
  );
}

export function FallbackDemo() {
  return (
    <Space>
      <Avatar shape="circle" src="http://abc.com/not-exist.jpg">
        A
      </Avatar>
      <Avatar shape="circle" src="http://abc.com/not-exist.jpg">
        ABC
      </Avatar>
    </Space>
  );
}

export function MoreDemo() {
  return <TypeDemo />;
}
