import { Button, Dropdown, Space } from "antd-octane";
import { useState } from "octane";
export function BasicDemo() {
  const [action, setAction] = useState("尚未选择");
  return (
    <Space direction="vertical">
      <Dropdown
        trigger={["click"]}
        menu={{
          items: [
            { key: "copy", label: "复制链接" },
            { key: "rename", label: "重命名" },
            { key: "divider", type: "divider" },
            { key: "archive", label: "归档", disabled: true },
          ],
          onClick: (info) =>
            setAction(info.key === "copy" ? "已选择复制链接" : "已选择重命名"),
        }}
      >
        <Button>更多操作</Button>
      </Dropdown>
      <p aria-live="polite">{action}</p>
    </Space>
  );
}
export function MoreDemo() {
  const [selected, setSelected] = useState("未选择");
  const menu = {
    items: [
      { key: "open", label: "打开" },
      { key: "download", label: "下载" },
    ],
    onClick: (info: { key: string }) =>
      setSelected(info.key === "open" ? "打开" : "下载"),
  };
  return (
    <Space direction="vertical">
      <Dropdown menu={menu}>
        <Button>悬停查看菜单</Button>
      </Dropdown>
      <Dropdown trigger={["contextMenu"]} menu={menu}>
        <Button>右键打开菜单</Button>
      </Dropdown>
      <p aria-live="polite">当前操作：{selected}</p>
    </Space>
  );
}
