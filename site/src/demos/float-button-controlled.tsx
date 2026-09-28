import { Button, FloatButton, Space, Switch } from "antd-octane";
import { useState } from "octane";

export function ControlledDemo() {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState("尚未选择操作");
  return (
    <div style={{ position: "relative", width: "100%", height: 260 }}>
      <Space wrap>
        <Switch checked={open} onChange={setOpen} aria-label="展开浮动菜单" />
        <span>展开菜单</span>
        <span aria-live="polite">{action}</span>
      </Space>
      <FloatButton.Group
        trigger="click"
        open={open}
        onOpenChange={setOpen}
        shape="square"
        type="primary"
        aria-label="项目快捷菜单"
        style={{ position: "absolute", right: 16, bottom: 16 }}
      >
        <FloatButton
          description="新建"
          onClick={() => {
            setAction("已选择新建");
            setOpen(false);
          }}
        />
        <FloatButton
          description="帮助"
          onClick={() => {
            setAction("已选择帮助");
            setOpen(false);
          }}
        />
      </FloatButton.Group>
    </div>
  );
}

export function StaticGroupDemo() {
  const [action, setAction] = useState("请选择一个快捷操作");
  return (
    <div style={{ position: "relative", width: "100%", height: 200 }}>
      <p aria-live="polite">{action}</p>
      <Button onClick={() => setAction("请选择一个快捷操作")}>重置反馈</Button>
      <FloatButton.Group
        shape="square"
        style={{ position: "absolute", right: 16, bottom: 16 }}
      >
        <FloatButton
          description="保存"
          onClick={() => setAction("草稿已保存")}
        />
        <FloatButton
          href="#start"
          description="文档"
          aria-label="打开接入指南"
        />
      </FloatButton.Group>
    </div>
  );
}
