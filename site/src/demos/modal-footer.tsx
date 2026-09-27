import { Button, Modal, Space } from "antd-octane";
import { useState } from "octane";

export function FooterDemo() {
  const [open, setOpen] = useState(false);
  const [choice, setChoice] = useState("尚未选择");
  const finish = (value: string) => {
    setChoice(value);
    setOpen(false);
  };
  return (
    <Space wrap>
      <Button onClick={() => setOpen(true)}>选择处理方式</Button>
      <span aria-live="polite">{choice}</span>
      <Modal
        title="处理草稿"
        open={open}
        onCancel={() => setOpen(false)}
        footer={
          <Space wrap>
            <Button onClick={() => finish("稍后处理")}>稍后处理</Button>
            <Button danger onClick={() => finish("已删除草稿")}>
              删除
            </Button>
            <Button type="primary" onClick={() => finish("已保存草稿")}>
              保存
            </Button>
          </Space>
        }
      >
        <p>当默认的确定与取消不够用时，直接提供完整的 footer 内容。</p>
      </Modal>
    </Space>
  );
}
