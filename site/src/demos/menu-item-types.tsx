import { Menu, Space } from "antd-octane";
import { useState } from "octane";

export function ItemTypesDemo() {
  const [action, setAction] = useState("尚未选择");
  return (
    <Space direction="vertical">
      <Menu
        selectable={false}
        style={{ width: 260, maxWidth: "100%" }}
        onClick={(info) => setAction(info.key)}
        items={[
          {
            key: "group",
            type: "group",
            label: "操作",
            children: [
              {
                key: "edit",
                label: "编辑",
                icon: <span aria-hidden="true">✎</span>,
                title: "编辑当前项目",
              },
              { key: "copy", label: "复制", disabled: true },
            ],
          },
          { key: "divider", type: "divider" },
          { key: "delete", label: "删除", danger: true },
        ]}
      />
      <p aria-live="polite">
        本地操作演示：{action}；selectable=false 不保留选中状态。
      </p>
    </Space>
  );
}
