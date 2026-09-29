import { Button, Dropdown, Space } from "antd-octane";
import { useState } from "octane";

export function ControlledOpenDemo() {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState("尚未选择");
  const [lastSource, setLastSource] = useState("无");

  return (
    <Space direction="vertical">
      <Space wrap>
        <Dropdown
          open={open}
          trigger={["click"]}
          autoFocus
          onOpenChange={(next, info) => {
            setOpen(next);
            setLastSource(info.source);
          }}
          menu={{
            items: [
              { key: "edit", label: "编辑" },
              { key: "share", label: "分享" },
              { key: "delete", label: "删除", danger: true },
            ],
            onClick: (info) => setAction(info.key),
          }}
        >
          <Button>点击或按 ↓ 打开</Button>
        </Dropdown>
        <Button onClick={() => setOpen(!open)}>
          {open ? "从外部关闭" : "从外部打开"}
        </Button>
      </Space>
      <p aria-live="polite">
        当前：{open ? "展开" : "关闭"}；上次选择：{action}；最近一次回调来源：
        {lastSource}
      </p>
    </Space>
  );
}
