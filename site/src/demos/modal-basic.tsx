import { Button, Drawer, Dropdown, Input, Modal, Space } from "antd-octane";
import { useEffect, useRef, useState } from "octane";
export function BasicDemo() {
  const [open, setOpen] = useState(false),
    [saved, setSaved] = useState(false),
    [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const close = () => {
    clearTimeout(timer.current);
    setLoading(false);
    setOpen(false);
  };
  return (
    <Space>
      <Button type="primary" onClick={() => setOpen(true)}>
        打开对话框
      </Button>
      <span aria-live="polite">{saved ? "已保存" : "等待保存"}</span>
      <Modal
        title="编辑项目"
        open={open}
        onCancel={close}
        confirmLoading={loading}
        onOk={() => {
          setLoading(true);
          timer.current = setTimeout(() => {
            setSaved(true);
            close();
          }, 400);
        }}
      >
        <p>填写项目名称，确认后模拟一次保存。</p>
        <Input defaultValue="Octane 项目" aria-label="项目名称" />
      </Modal>
    </Space>
  );
}
export function MoreDemo() {
  const [open, setOpen] = useState(false),
    [drawer, setDrawer] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>打开嵌套示例</Button>
      <Modal
        title="项目设置"
        open={open}
        centered
        footer={null}
        onCancel={() => {
          setOpen(false);
          setDrawer(false);
        }}
      >
        <Input aria-label="设置备注" placeholder="关闭后保留内容" />
        <p>
          <Button onClick={() => setDrawer(true)}>打开成员抽屉</Button>
          <Dropdown
            trigger={["click"]}
            menu={{
              items: [
                { key: "edit", label: "编辑设置" },
                { key: "copy", label: "复制设置" },
              ],
            }}
          >
            <Button>更多设置</Button>
          </Dropdown>
        </p>
        <Drawer
          title="成员信息"
          open={drawer}
          onClose={() => setDrawer(false)}
          zIndex={1100}
        >
          <Input aria-label="成员名称" placeholder="输入成员名称" />
          <p>按 Escape 仅关闭最上层，返回后外层仍保持滚动锁。</p>
        </Drawer>
      </Modal>
    </>
  );
}
