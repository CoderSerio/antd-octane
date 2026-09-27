import { Button, Menu, Space } from "antd-octane";
import { useState } from "octane";

export function ControlledTreeDemo() {
  const [selectedKeys, setSelectedKeys] = useState<string[]>(["overview"]);
  const [openKeys, setOpenKeys] = useState<string[]>(["workspace"]);

  return (
    <Space direction="vertical" style={{ width: 280, maxWidth: "100%" }}>
      <Space wrap>
        <Button onClick={() => setOpenKeys(["workspace", "account"])}>
          展开全部
        </Button>
        <Button onClick={() => setOpenKeys([])}>收起全部</Button>
      </Space>
      <Menu
        mode="inline"
        multiple
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onSelect={(info) => setSelectedKeys(info.selectedKeys)}
        onDeselect={(info) => setSelectedKeys(info.selectedKeys)}
        onOpenChange={setOpenKeys}
        items={[
          {
            key: "workspace",
            label: "工作区",
            children: [
              { key: "overview", label: "概览" },
              { key: "tasks", label: "任务" },
            ],
          },
          {
            key: "account",
            label: "账户",
            children: [
              { key: "profile", label: "个人资料" },
              { key: "security", label: "安全设置" },
            ],
          },
        ]}
      />
      <p aria-live="polite">
        已选：{selectedKeys.length ? selectedKeys.join("、") : "无"}；展开：
        {openKeys.length ? openKeys.join("、") : "无"}
      </p>
    </Space>
  );
}
