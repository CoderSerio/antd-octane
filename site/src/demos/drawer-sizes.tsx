import { Button, Drawer, Space } from "antd-octane";
import { useState } from "octane";

export function SizesDemo() {
  const [open, setOpen] = useState(false);
  const [large, setLarge] = useState(false);
  return (
    <Space wrap>
      <Button
        onClick={() => {
          setLarge(false);
          setOpen(true);
        }}
      >
        默认尺寸
      </Button>
      <Button
        onClick={() => {
          setLarge(true);
          setOpen(true);
        }}
      >
        大尺寸
      </Button>
      <Drawer
        title={large ? "大尺寸抽屉" : "默认尺寸抽屉"}
        size={large ? "large" : "default"}
        open={open}
        onClose={() => setOpen(false)}
        maskClosable={false}
        extra={<Button onClick={() => setOpen(false)}>完成</Button>}
      >
        <p>
          点击遮罩不会关闭；点击右上角关闭按钮、按 Escape 或点击“完成”可以关闭。
        </p>
        <p>默认宽度为 378，大尺寸宽度为 736；窄屏仍受视口宽度限制。</p>
      </Drawer>
    </Space>
  );
}
