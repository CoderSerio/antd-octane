import { Menu } from "antd-octane";
import { useState } from "octane";
export function BasicDemo() {
  const [selected, setSelected] = useState(["overview"]);
  return (
    <div style={{ width: 260, maxWidth: "100%" }}>
      <Menu
        mode="inline"
        selectedKeys={selected}
        onSelect={(info) => setSelected(info.selectedKeys)}
        defaultOpenKeys={["settings"]}
        items={[
          { key: "overview", label: "项目概览" },
          {
            key: "settings",
            label: "项目设置",
            children: [
              { key: "members", label: "成员管理" },
              { key: "access", label: "访问权限" },
              { key: "disabled", label: "审计日志", disabled: true },
            ],
          },
          {
            key: "group",
            type: "group",
            label: "其他",
            children: [{ key: "help", label: "使用帮助" }],
          },
        ]}
      />
      <p aria-live="polite">当前选择：{selected[0]}</p>
    </div>
  );
}
export function MoreDemo() {
  return (
    <Menu
      mode="horizontal"
      defaultSelectedKeys={["docs"]}
      items={[
        { key: "docs", label: "研发文档" },
        { key: "components", label: "组件" },
        { key: "resources", label: "资源" },
        { key: "disabled", label: "实验室", disabled: true },
      ]}
    />
  );
}
