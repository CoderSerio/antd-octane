import { Button, Drawer, Input, Space } from "antd-octane";
import { useState } from "octane";

export function NestedDemo() {
  const [open, setOpen] = useState(false);
  const [childOpen, setChildOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>编辑项目成员</Button>
      <Drawer
        open={open}
        title="项目成员"
        width={480}
        onClose={() => {
          setOpen(false);
          setChildOpen(false);
        }}
      >
        <Space direction="vertical">
          <Input defaultValue="Octane 文档项目" aria-label="项目名称" />
          <Button onClick={() => setChildOpen(true)}>补充成员信息</Button>
        </Space>
        <Drawer
          open={childOpen}
          title="成员备注"
          width={360}
          zIndex={1100}
          onClose={() => setChildOpen(false)}
        >
          <Input placeholder="填写备注" aria-label="成员备注" />
          <p>Escape 只关闭最上层；外层内容不会被推动。</p>
        </Drawer>
      </Drawer>
    </>
  );
}
