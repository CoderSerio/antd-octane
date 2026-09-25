import { Button, Drawer, Input, Segmented, Space } from "antd-octane";
import { useState } from "octane";
export function BasicDemo() {
  const [open, setOpen] = useState(false),
    [placement, setPlacement] = useState<"left" | "right" | "top" | "bottom">(
      "right",
    );
  return (
    <Space wrap>
      <Segmented
        value={placement}
        options={["left", "right", "top", "bottom"]}
        onChange={(value) => setPlacement(value as typeof placement)}
        aria-label="抽屉方向"
      />
      <Button type="primary" onClick={() => setOpen(true)}>
        打开抽屉
      </Button>
      <Drawer
        title="项目详情"
        placement={placement}
        open={open}
        onClose={() => setOpen(false)}
        footer={
          <Button type="primary" onClick={() => setOpen(false)}>
            完成
          </Button>
        }
      >
        <p>从页面边缘展开补充内容，保留用户当前的位置。</p>
        <Input defaultValue="项目 A" aria-label="抽屉项目名称" />
      </Drawer>
    </Space>
  );
}
export function MoreDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>打开销毁示例</Button>
      <Drawer
        open={open}
        title="临时编辑"
        onClose={() => setOpen(false)}
        destroyOnHidden
        width={480}
        extra={
          <Button type="link" onClick={() => setOpen(false)}>
            取消编辑
          </Button>
        }
      >
        <Input placeholder="关闭后清空输入" aria-label="临时备注" />
        <p>destroyOnHidden 在关闭时卸载内容；再次打开从初始状态开始。</p>
      </Drawer>
    </>
  );
}
