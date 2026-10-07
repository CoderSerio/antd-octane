import { Avatar, Space } from "antd-octane";
export function BasicDemo() {
  return (
    <Space size="middle" wrap>
      <Avatar size="large">大</Avatar>
      <Avatar>中</Avatar>
      <Avatar size="small">小</Avatar>
      <Avatar size={64} shape="square">
        Octane
      </Avatar>
      <Avatar style={{ backgroundColor: "#fde3cf", color: "#f56a00" }}>
        U
      </Avatar>
    </Space>
  );
}
export function MoreDemo() {
  return (
    <Space size="middle">
      <Avatar
        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%231677ff'/%3E%3Ccircle cx='40' cy='30' r='15' fill='white'/%3E%3Cpath d='M12 80a28 28 0 0 1 56 0' fill='white'/%3E%3C/svg%3E"
        alt="用户头像"
      />
      <Avatar gap={4}>Long name</Avatar>
      <Avatar shape="square" size={48}>
        AB
      </Avatar>
    </Space>
  );
}
