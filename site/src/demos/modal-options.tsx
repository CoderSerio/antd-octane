import { Button, Checkbox, Input, Modal, Space } from "antd-octane";
import { useState } from "octane";

export function ButtonPropsDemo() {
  const [open, setOpen] = useState(false);
  const [understood, setUnderstood] = useState(false);
  const [status, setStatus] = useState("未删除");
  return (
    <Space wrap>
      <Button
        danger
        onClick={() => {
          setUnderstood(false);
          setOpen(true);
        }}
      >
        删除草稿
      </Button>
      <span aria-live="polite">{status}</span>
      <Modal
        title="确认删除草稿"
        open={open}
        onCancel={() => setOpen(false)}
        okText="删除"
        okButtonProps={{ danger: true, disabled: !understood }}
        onOk={() => {
          setStatus("草稿已删除（演示）");
          setOpen(false);
        }}
      >
        <p>
          此处仅更新演示状态。确认按钮可通过 okButtonProps
          控制危险样式和禁用条件。
        </p>
        <Checkbox
          checked={understood}
          onChange={(event) => setUnderstood(event.target.checked)}
        >
          我已了解操作影响
        </Checkbox>
      </Modal>
    </Space>
  );
}

export function LifecycleDemo() {
  const [mode, setMode] = useState<"keep" | "destroy" | null>(null);
  return (
    <Space wrap>
      <Button onClick={() => setMode("keep")}>保留编辑内容</Button>
      <Button onClick={() => setMode("destroy")}>关闭后销毁内容</Button>
      <Modal
        open={mode === "keep"}
        title="保留编辑内容"
        footer={null}
        onCancel={() => setMode(null)}
      >
        <Input defaultValue="初始备注" aria-label="保留模式备注" />
        <p>修改后关闭，再从同一入口打开，内容仍在。</p>
      </Modal>
      <Modal
        open={mode === "destroy"}
        destroyOnHidden
        title="关闭后销毁内容"
        footer={null}
        onCancel={() => setMode(null)}
      >
        <Input defaultValue="初始备注" aria-label="销毁模式备注" />
        <p>修改后关闭，再打开时恢复初始备注。</p>
      </Modal>
    </Space>
  );
}
